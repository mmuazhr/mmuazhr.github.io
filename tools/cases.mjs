// Single source for the reel on index.html and the pages in work/.
// Edit copy here, then run: node tools/build.mjs
// Every claim must trace to the CV (cv-source.html) or the project's own docs. No invented numbers.

export const cases = [
  {
    slug: "maxis-data-agents",
    art: "maxis-data",
    alt: "Engraved collage: a card-catalogue cabinet whose cards turn into charts, a magnifying glass and a checked shield.",
    kicker: "Maxis · Data & AI DevOps",
    status: "In production",
    when: "2026 to now",
    role: "Design, build and run (LLMOps)",
    title: "Data agents that check their own numbers",
    line: "Plain-language analytics on BigQuery and Power BI, with a guardrail that validates every figure before anyone sees it.",
    stack: ["Python", "Google ADK", "Vertex AI Agent Engine", "BigQuery", "Cloud Run", "Power BI / DAX"],
    problem: [
      "Business teams could not query the warehouse themselves, so every KPI question became a ticket for an analyst.",
      "Pointing a language model at a raw warehouse is worse than no answer: it invents tables that do not exist and numbers nobody can trace.",
    ],
    approach: [
      "A multi-agent system on Vertex AI Agent Engine, built with Google ADK. A semantic router sends each question to the right specialist agent. SQL generation is M-Schema aware, so the agent works from the real schema instead of guessing it.",
      "A grounding guardrail validates every number against live BigQuery results before it reaches a user. Multi-turn memory, query planning and anomaly detection sit around it, and when confidence is low the agent abstains instead of guessing. Answers come back as a short narrative with a chart and a table.",
      "A sibling agent turns natural language into DAX for Power BI. To test it I built an adversarial QA harness: probes that feed the agent inputs the test suite never covered, score the answers, and turn every failure into a permanent regression case.",
    ],
    flow: [
      ["question", "plain language, multi-turn"],
      ["semantic router", "picks the specialist"],
      ["SQL agent", "M-Schema aware"],
      ["grounding guardrail", "checked against live BigQuery", true],
      ["answer, or abstain", "no unverified numbers"],
    ],
    result: [
      "In production at Maxis, answering telecom KPI questions for non-technical users. The grounding loop eliminated hallucinated figures: every number shown has been checked against the warehouse that produced it.",
      "I own the LLMOps loop end to end: containerised Cloud Run deploys, versioned prompts and agent configs, reliability and cost monitoring.",
    ],
    note: "Internal system, so no screenshots or data are shown here.",
  },
  {
    slug: "job-agent",
    art: "job-agent",
    alt: "Engraved collage: a typewriter, a stack of sealed envelopes, a pinned map, a rubber stamp and a pocket watch.",
    kicker: "Independent build",
    status: "Built, pre-launch",
    when: "2026",
    role: "Product, architecture and review",
    title: "A job-application copilot that cannot lie about you",
    line: "Every sentence it writes must cite a fact from my real CV, and a person always presses Submit.",
    stack: ["Python", "Claude Agent SDK", "Supabase", "Airflow", "Playwright", "WeasyPrint"],
    problem: [
      "Most AI resume tools happily invent experience. A tool that writes about you has to be unable to make things up, and it should never apply anywhere without you.",
    ],
    approach: [
      "A career knowledge base is loaded from my real CV, with an ID on every fact. Tailoring may only use linked facts: each generated bullet cites a fact ID, and a verification pass rejects any claim without a source before a deterministic renderer produces the PDF and DOCX.",
      "Airflow schedules job discovery. Playwright pre-fills applications in copilot mode, which means it stops before the final step and a human always clicks Submit. Supabase runs with row-level security from day one.",
      "I wrote the design, specs and acceptance criteria, and reviewed the code that coding agents implemented against them.",
    ],
    flow: [
      ["job description", ""],
      ["analyse", "requirements and fit"],
      ["tailor", "from cited facts only"],
      ["verify", "unsourced claims rejected", true],
      ["render, then a human submits", "PDF and DOCX"],
    ],
    result: [
      "Knowledge base, tailoring and dashboard are built, with 129 collected tests. The next milestone is the first live discovery run on JobStreet.",
    ],
  },
  {
    slug: "kaggle",
    art: "kaggle",
    alt: "Engraved collage: playing cards and poker chips under a magnifying lens, dissolving into a scatter of data points, with a ribbon medal.",
    kicker: "Kaggle · Data science",
    status: "Top 10%",
    when: "2026",
    role: "Research lead, with AI agents",
    title: "Competitive data science, run like research",
    line: "33rd of 356 teams in a poker fraud-detection competition, where every submission had to earn its place on an honest holdout first.",
    stack: ["Python", "DuckDB", "LightGBM", "PyTorch", "Kaggle API"],
    problem: [
      "Competitions tempt you to tune toward the public leaderboard. It looks like progress and often is not: the public split rewards noise.",
    ],
    approach: [
      "I built a local research toolkit and ran the competition like a lab. Every experiment is registered, and the measuring stick is an honest five-fold holdout, not the public leaderboard: ideas that only improved the public score were treated as noise.",
      "AI agents run the experiments under these rules. Every submission needed my explicit approval, and every decision and finding is logged so nothing gets re-tried by accident.",
    ],
    flow: [
      ["idea", ""],
      ["registered experiment", "logged before it runs"],
      ["honest holdout", "five folds, not the leaderboard", true],
      ["decision log", "what worked, what not to retry"],
      ["submit, with approval", ""],
    ],
    result: [
      "33rd of 356 teams in Detect Suspicious Value Transfers in Poker (top 10%).",
      "The approach has since carried into hyperspectral object detection on 16-band imagery, low-light object detection and a live memecoin pump-or-dump league, now in a workbench where every experiment writes down its expected result, and what would prove it wrong, before it runs.",
    ],
  },
  {
    slug: "content-studio",
    art: "content-studio",
    alt: "Engraved collage: a vintage ribbon microphone, a film strip, a clapperboard and a printed sound waveform.",
    kicker: "Independent build",
    status: "In development",
    when: "2026",
    role: "Design and build (with coding agents)",
    title: "An AI video studio with a human in the loop",
    line: "Research, script and video for a Malay-language AI explainer channel, orchestrated as one pipeline, with approval gates in front of every paid step.",
    stack: ["Python", "Airflow", "Claude", "Supabase", "FastAPI", "Veo"],
    problem: [
      "Short explainer videos need research, a script, generated shots and editing. Fully automatic AI output drifts off-topic and burns paid generation credits on takes nobody wanted.",
    ],
    approach: [
      "Airflow runs two pipelines: topic research, and video production. Claude writes scripts that must pass schema validation, and episodes are dialogues between two recurring characters, Naro and Exa, kept consistent with locked reference images.",
      "A FastAPI dashboard holds the approval gates: nothing moves from script to paid video generation without a human yes. The pipeline runs in dry-run mode by default, so tests never spend credits.",
    ],
    flow: [
      ["topic research", ""],
      ["script", "schema-validated"],
      ["approval gate", "a human says yes", true],
      ["video production", "character-locked shots"],
      ["approval, then publish", ""],
    ],
    result: [
      "The first slice (research, script, approval and video generation) passed my acceptance testing in July 2026. Final assembly, a new episode format and the channel launch are next.",
    ],
  },
  {
    slug: "notch-app",
    art: "notch-app",
    alt: "Engraved collage: a small wallet with receipts and coins rising out of a laptop's camera notch, beside a bar chart.",
    kicker: "Independent build · macOS",
    status: "My daily driver",
    when: "2026",
    role: "Design and build (with coding agents)",
    title: "AI Wallet, a native notch app for the Mac",
    line: "The MacBook notch turned into a live surface for music, activities and AI usage, built in Swift and used every day.",
    stack: ["Swift 6", "SwiftUI", "AppKit", "XcodeGen", "XCUITest"],
    problem: [
      "The notch is dead space at the top of every new MacBook. I wanted one place for what is happening right now, without another menu-bar icon.",
      "Version one was a wallet for AI usage, with rings for each assistant's quota. That is where the name comes from, and it grew into a full notch shell.",
    ],
    approach: [
      "A native SwiftUI and AppKit app with Dynamic-Island-style motion: an oversized window plus a spring-animated shape, so the notch can grow and settle like it is part of the hardware.",
      "Pages for Now Playing, activities and the clipboard. An optional volume and brightness display replaces the system one, and iPhone Live Activities appear through the accessibility layer. Builds are signed with a stable identity so macOS privacy permissions survive every update.",
    ],
    result: [
      "It replaced the app I used to run in my notch, and has been my daily driver since August 2026. I plan to release it publicly, so fixes target classes of device rather than my own setup.",
    ],
  },
  {
    slug: "pjbumi-inspection",
    art: "pjbumi",
    alt: "Engraved collage: an inspection camera on an arm examining a rusty pipe joint, over an engineering blueprint.",
    kicker: "PJBUMI Heavy Engineering",
    status: "MLOps apprentice",
    when: "2023 to 2024",
    role: "Led model development",
    title: "Computer vision for oil and gas inspection",
    line: "Defect detection and asset-health models for an inspection service used with oil and gas clients.",
    stack: ["Python", "TensorFlow", "OpenCV", "Flask", "Power BI"],
    problem: [
      "Inspecting oil and gas assets is slow, manual work, and defects such as corrosion are cheapest to fix when they are caught early.",
    ],
    approach: [
      "I led AI model development for the company's asset inspection service: defect detection and real-time asset-health assessment, including work on a Petronas engagement.",
      "Alongside it I built InOutVision, a face-recognition attendance system with OpenCV, TensorFlow and Power BI dashboards, and a CNN that tracks stockpile volume, served with Flask.",
    ],
    result: [
      "The models were used in inspection services delivered to oil and gas clients.",
    ],
    note: "Client work, so no inspection imagery is shown here.",
  },
  {
    slug: "queless",
    art: "queless",
    alt: "Engraved collage: a café counter with a QR table card, a receipt printer pushing out an order ticket, a coffee cup and a phone.",
    kicker: "Independent build · SaaS",
    status: "Closed trial",
    when: "2026",
    role: "Product, architecture and build (with coding agents)",
    title: "QueLess, order-ahead for Malaysian merchants",
    line: "Customers scan a QR, order ahead and pay the merchant directly. No queue at the counter, no payment-gateway fees.",
    stack: ["Next.js", "Prisma", "Postgres", "Railway", "Sentry"],
    problem: [
      "Small food and drink merchants lose customers to queues, and payment gateways take a cut of every order.",
    ],
    approach: [
      "Customers order from a QR code and pay with the merchant's own DuitNow QR, then upload proof. The queue number is issued only when the merchant confirms, so nobody jumps the line on an unpaid order. Live queue updates stream to the customer, and waiting times are estimated from how many orders the kitchen can work on at once.",
      "It is built to run on Railway in Singapore, close to Malaysian users, with CI, health checks and Sentry error monitoring.",
    ],
    result: [
      "Deployed to production for a closed trial with merchants.",
    ],
  },
];

export const alsoBuilt = [
  ["Self-improving agent architecture", "A cross-user policy store in Firestore, kept apart from per-user memory, so what one conversation teaches every later one knows, with no added latency per turn."],
  ["AI bundle business case", "The financial model and pitch for bundling an AI subscription into Hotlink youth plans at Maxis. It caught a rebate modelling error that changed the strategy."],
  ["Rebate-assignment automation", "Automated the rebate process for newly launched Maxis plans, cutting manual work before campaigns."],
  ["FluentAI", "An English fluency companion that adapts difficulty from your mistakes instead of correcting every sentence."],
  ["fitmu", "An iPhone and Apple Watch weight-loss coach that understands Malaysian food."],
];
