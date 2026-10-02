#!/usr/bin/env node
// Zero-dependency smoke test for the static site.
// Run from anywhere: node tools/validate.mjs
// Checks: JS files parse, local href/src/url() refs exist on disk,
// in-page anchors resolve to an id, every <img> has an alt attribute,
// and no referenced file is git-ignored (it would 404 on Pages).
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

// Site pages live at the root and in these folders; everything else (tools, previews) is skipped.
const PAGE_DIRS = ["", "work"];
const listDir = (dir, ext) =>
  existsSync(join(root, dir))
    ? readdirSync(join(root, dir)).filter((f) => f.endsWith(ext)).map((f) => join(dir, f))
    : [];
const htmlFiles = PAGE_DIRS.flatMap((d) => listDir(d, ".html"));
const jsFiles = PAGE_DIRS.flatMap((d) => listDir(d, ".js"));
const cssFiles = PAGE_DIRS.flatMap((d) => listDir(d, ".css"));

for (const f of jsFiles) {
  try {
    execFileSync(process.execPath, ["--check", join(root, f)], { stdio: "pipe" });
  } catch (e) {
    failures.push(`${f}: does not parse: ${e.stderr.toString().trim()}`);
  }
}

const referenced = new Set();
const checkLocalRef = (sourceFile, ref) => {
  const localPath = ref.split(/[?#]/)[0];
  if (!localPath) return;
  const target = resolve(root, dirname(sourceFile), localPath);
  if (!existsSync(target)) {
    failures.push(`${sourceFile}: local ref "${ref}" not found on disk`);
  } else {
    referenced.add(relative(root, target));
  }
};

const checkUrlRefs = (sourceFile, text) => {
  for (const m of text.matchAll(/url\(\s*"?'?([^"')]+)'?"?\s*\)/g)) {
    // "#id" / "%23id" point inside a document (e.g. an SVG filter in a data URI), not at a file
    if (!/^(https?:|data:|#|%23)/.test(m[1])) checkLocalRef(sourceFile, m[1]);
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

  for (const m of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    for (const cand of m[1].split(",")) {
      const ref = cand.trim().split(/\s+/)[0];
      if (ref && !/^(https?:|data:)/.test(ref)) checkLocalRef(f, ref);
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

// A file that exists locally but is git-ignored passes the disk check and 404s once deployed.
const refList = [...referenced].filter((f) => !f.startsWith(".."));
if (refList.length > 0) {
  let ignored = "";
  try {
    ignored = execFileSync("git", ["check-ignore", "--no-index", ...refList], { cwd: root, stdio: "pipe" }).toString();
  } catch (e) {
    ignored = e.stdout ? e.stdout.toString() : ""; // exit 1 = nothing ignored
  }
  for (const f of ignored.split("\n").filter(Boolean)) {
    failures.push(`${f}: referenced by a page but git-ignored, so it would 404 on Pages`);
  }
}

if (failures.length > 0) {
  console.error(`FAIL: ${failures.length} problem(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  `OK: ${jsFiles.length} JS parsed; refs, anchors, alts and asset paths verified across ${htmlFiles.length} HTML and ${cssFiles.length} CSS file(s).`
);
