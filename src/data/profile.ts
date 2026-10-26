// All portfolio content lives here. Edit this file to update the site.

export const PROFILE = {
  name: "Eugene Kipchirchir Koech",
  shortName: "Kipchirchir",
  handle: "yug3ne",
  role: "Software Engineer",
  location: "Nairobi, Kenya",
  timezone: "Africa/Nairobi",
  email: "eugenekoech9@gmail.com",
  available: true,
  resume: "/koech-kipchirchir-resume.pdf",
  links: {
    github: "https://github.com/Yug3ne",
    linkedin: "https://www.linkedin.com/in/eugenekoech9/",
    x: "https://x.com/_Yu_gene__",
  },
} as const;

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  points: string[];
  kind: string;
  year: string;
  repo?: string;
  live?: string;
  liveLabel?: string;
  /** Set when a project is no longer maintained or working; shown as a banner. */
  archived?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "tidepush",
    name: "Tidepush",
    tagline: "Self-hosted OTA updates for Expo apps, on Cloudflare.",
    description:
      "A multi-tenant server for the open Expo Updates protocol. Ship JavaScript and asset fixes to React Native apps without waiting on store review, as a hosted service or self-hosted on your own Cloudflare account.",
    stack: ["TypeScript", "Cloudflare Workers", "Hono", "D1", "R2", "TanStack Start", "Turborepo"],
    points: [
      "RSA-signed manifests and rollbacks, with staged percentage rollouts",
      "Instant rollback to the previous or store-embedded bundle, and staging → production promotion",
      "Hono API Worker on D1 and R2 with edge-cached bundles, plus a TanStack Start dashboard",
      "tidepush CLI on npm, backed by 120+ tests and CI with a JavaScript budget",
    ],
    kind: "Infra · Open source",
    year: "2026",
    repo: "https://github.com/Yug3ne/tidepush",
    live: "https://tidepush-website.yugenecodes99.workers.dev",
    liveLabel: "Docs",
  },
  {
    slug: "payd-sdks",
    name: "Payd SDKs",
    tagline: "Typed SDK for payments and payouts across Africa.",
    description:
      "An open-source TypeScript client for the Payd API: collections (including M-Pesa STK Push), payouts and transactions, with an interactive playground for testing API keys.",
    stack: ["TypeScript", "Node.js", "Express"],
    points: [
      "Published to npm as payd-node-sdk",
      "101 unit tests backed by shared JSON fixtures",
      "Shipped with a playground for testing webhooks and API keys",
    ],
    kind: "Developer tools",
    year: "2026",
    repo: "https://github.com/Yug3ne/payd-sdks",
    archived: "This SDK no longer works. The code is kept for reference.",
  },
  {
    slug: "who-gets-heard",
    name: "Who Gets Heard?",
    tagline: "Predicting which Kenyans reach their county representative.",
    description:
      "Binary classification over Afrobarometer survey data joined to budget records for all 47 counties. scikit-learn baselines compared with Keras Sequential and Functional networks.",
    stack: ["Python", "scikit-learn", "TensorFlow / Keras", "pandas"],
    points: [
      "Five public datasets joined across all 47 counties, with no synthetic data",
      "Gradient Boosting scored the best PR-AUC on 480 held-out Kenyans",
      "Finding: county budget transparency does not predict who contacts their MCA",
      "Fairness audit: the model misses engaged women and young people",
    ],
    kind: "Machine learning",
    year: "2026",
  },
  {
    slug: "sautilink",
    name: "Sauti Link",
    tagline: "Civic participation, in English and Kiswahili.",
    description:
      "Connects citizens with their ward MCAs. AI-simplified bills, voting on county budget items, and a real-time analytics dashboard for officials.",
    stack: ["React 19", "Convex", "TypeScript", "Recharts"],
    points: [
      "Bilingual bill summaries, public feedback and county-level dashboards",
      "Real-time Convex functions for voting, analytics, uploads and multi-role access",
    ],
    kind: "Civic tech",
    year: "2026",
    repo: "https://github.com/Yug3ne/sautilink",
    live: "https://sautilink.vercel.app",
    liveLabel: "Live",
  },
  {
    slug: "scantiko",
    name: "ScanTiko",
    tagline: "Ticket scanning at a live tournament.",
    description:
      "A React Native scanner with a custom camera overlay and instant API verification, deployed at a high-traffic rugby tournament.",
    stack: ["React Native", "Expo"],
    points: ["2,000+ tickets validated at Kabeberi 7s", "Keeps working when the network drops"],
    kind: "Mobile",
    year: "2025",
    repo: "https://github.com/Yug3ne/ScanTiko",
  },
  {
    slug: "planrr",
    name: "Planrr",
    tagline: "Group contributions and shared expenses.",
    description:
      "A mobile-first app for personal contributions and shared expenses, built with Expo and React Native on a GraphQL API.",
    stack: ["Expo", "React Native", "GraphQL"],
    points: ["Shipped on iOS and Android", "Built at Cybasoft with a cross-functional remote team"],
    kind: "Mobile",
    year: "2025",
    live: "https://planrr.io",
    liveLabel: "planrr.io",
  },
  {
    slug: "chora",
    name: "Chora",
    tagline: "A whiteboard with as many sheets as you need.",
    description:
      "Excalidraw with cloud auto-save, instant switching between sheets and a ⌘K fuzzy switcher.",
    stack: ["React", "Excalidraw", "Convex", "Better Auth"],
    points: ["Saves to the cloud with a debounce", "Private sheets for each user"],
    kind: "Productivity",
    year: "2026",
    repo: "https://github.com/Yug3ne/chorra",
  },
];

// PR-AUC on 480 held-out Kenyans, from the "Who Gets Heard?" report.
export const HEARD_RESULTS = [
  { model: "Gradient Boosting", prAuc: 0.43, chosen: true },
  { model: "Keras (functional)", prAuc: 0.394 },
  { model: "Random Forest", prAuc: 0.386 },
  { model: "SVM (RBF)", prAuc: 0.375 },
  { model: "Logistic Regression", prAuc: 0.359 },
  { model: "Random guess", prAuc: 0.256, baseline: true },
] as const;

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  points: string[];
  stack: string[];
  current?: boolean;
};

export const EXPERIENCE: Experience[] = [
  {
    company: "GetPayd Technologies",
    role: "Frontend & Mobile Developer",
    period: "Jan 2026 — Now",
    location: "Nairobi",
    summary:
      "Lead engineer on Payd's new Expo iOS and Android app, and a developer on the Vue 3 web app: wallets, payment links, invoices and cross-border payments.",
    points: [
      "Evaluated Expo against Flutter, then led the new Expo app (80%+ of commits) to full feature parity with the web product",
      "Built the mobile auth model: phone OTP, biometric re-authentication with auto-lock, SecureStore tokens and Expo Router guards",
      "Shipped deposits, withdrawals, transfers, mobile money and cross-border payouts on a shared Vue 3 composables layer",
      "Wired PostHog remote flags for live maintenance banners, and wrote a Kotlin Expo native module",
      "295 Jest tests, with typecheck, lint and format gates on every pull request",
    ],
    stack: ["Expo", "React Native", "Vue 3", "TanStack Query", "Zustand", "Zod", "Jest"],
    current: true,
  },
  {
    company: "Cybasoft",
    role: "Full-Stack Developer",
    period: "Oct 2024 — Oct 2025",
    location: "Remote · Elkridge, MD",
    summary: "Planrr, a mobile-first app for personal contributions and shared expenses.",
    points: [
      "Built user-facing features for financial activity and account workflows, keeping client state in sync with the backend",
      "Wrote GraphQL queries and mutations for targeted, efficient data fetching",
      "Shipped deadline tracking, status filters and UI improvements with a cross-functional remote team",
    ],
    stack: ["Expo", "React Native", "GraphQL"],
  },
  {
    company: "Virgil Africa",
    role: "Full-Stack Developer",
    period: "Feb 2025 — May 2025",
    location: "Nairobi",
    summary: "Client-facing web products.",
    points: [
      "Led the frontend of a new product, from UI prototype to production component architecture",
      "Built responsive React interfaces that streamlined checkout",
      "Built lightweight Python / FastAPI endpoints for asynchronous data and client sync",
      "Set up GitHub Actions CI/CD for automated builds and deploys",
    ],
    stack: ["React", "Python", "FastAPI", "GitHub Actions"],
  },
];

export const EDUCATION = [
  {
    school: "African Leadership University",
    detail: "BSc Software Engineering, concentration in Machine Learning & AI",
    period: "2024 — 2027 (expected)",
  },
  {
    school: "Moringa School",
    detail: "Certificate in Software Engineering",
    period: "2023 — 2024",
  },
];

// What I'm learning now. Each step is a checkpoint in the "training run".
export const ML_LOG = [
  { step: "01", title: "Regression analysis", note: "Linear models, loss functions, gradient descent by hand" },
  { step: "02", title: "Classical ML", note: "scikit-learn pipelines, cross-validation, feature engineering" },
  { step: "03", title: "Neural nets from scratch", note: "Forward and backward propagation in NumPy, building deep nets step by step" },
  { step: "04", title: "MNIST", note: "My first end-to-end image classifier" },
  { step: "05", title: "Malaria diagnosis CNN", note: "A CNN built from scratch, compared with ResNet50 transfer learning" },
  { step: "06", title: "Who Gets Heard?", note: "Real civic data, classical ML compared with Keras networks" },
] as const;

export const GO_TOPICS = [
  "Goroutines & channels",
  "net/http services",
  "Table-driven tests",
  "CLIs & tooling",
] as const;

export const TOOLBOX: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "Go", "Kotlin (basic)", "SQL"] },
  { group: "Machine learning", items: ["NumPy", "pandas", "scikit-learn", "TensorFlow / Keras", "Jupyter"] },
  { group: "Frontend & mobile", items: ["React", "Vue 3", "React Native", "Expo / Expo Router", "Vite", "Tailwind"] },
  { group: "Backend & cloud", items: ["Node.js", "Hono", "FastAPI", "GraphQL", "Convex", "Cloudflare Workers, D1, R2", "PostgreSQL"] },
];
