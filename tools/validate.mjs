#!/usr/bin/env node
// Zero-dependency smoke test for the static site.
// Run from anywhere: node tools/validate.mjs
// Checks: JS files parse, local href/src/url() refs exist on disk,
// in-page anchors resolve to an id, every <img> has an alt attribute.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

const htmlFiles = readdirSync(root).filter((f) => f.endsWith(".html"));
const jsFiles = readdirSync(root).filter((f) => f.endsWith(".js"));
const cssFiles = readdirSync(root).filter((f) => f.endsWith(".css"));

for (const f of jsFiles) {
  try {
    execFileSync(process.execPath, ["--check", join(root, f)], { stdio: "pipe" });
  } catch (e) {
    failures.push(`${f}: does not parse: ${e.stderr.toString().trim()}`);
  }
}

const checkLocalRef = (sourceFile, ref) => {
  const localPath = ref.split(/[?#]/)[0];
  if (localPath && !existsSync(join(root, localPath))) {
    failures.push(`${sourceFile}: local ref "${ref}" not found on disk`);
  }
};

const checkUrlRefs = (sourceFile, text) => {
  for (const m of text.matchAll(/url\(\s*"?'?([^"')]+)'?"?\s*\)/g)) {
    if (!/^(https?:|data:)/.test(m[1])) checkLocalRef(sourceFile, m[1]);
  }
};

for (const f of htmlFiles) {
  const html = readFileSync(join(root, f), "utf8");
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));

  for (const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const ref = m[1];
    if (ref.startsWith("#")) {
      if (ref.length > 1 && !ids.has(ref.slice(1))) {
        failures.push(`${f}: anchor ${ref} has no matching id`);
      }
    } else if (!/^(https?:|mailto:|data:)/.test(ref)) {
      checkLocalRef(f, ref);
    }
  }

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(m[0])) {
      failures.push(`${f}: <img> missing alt attribute: ${m[0].slice(0, 70)}`);
    }
  }

  checkUrlRefs(f, html);
}

for (const f of cssFiles) {
  checkUrlRefs(f, readFileSync(join(root, f), "utf8"));
}

if (failures.length > 0) {
  console.error(`FAIL: ${failures.length} problem(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  `OK: ${jsFiles.length} JS parsed; refs, anchors, alts and asset paths verified across ${htmlFiles.length} HTML and ${cssFiles.length} CSS file(s).`
);
