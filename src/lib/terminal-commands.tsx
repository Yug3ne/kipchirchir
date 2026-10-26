import type { ReactNode } from "react";
import { EDUCATION, EXPERIENCE, GO_TOPICS, ML_LOG, PROFILE, PROJECTS, TOOLBOX } from "@/data/profile";
import { goSnippetOutput } from "@/lib/go-snippet";
import { RETRAIN_EVENT } from "@/lib/terminal-store";
import { setTheme } from "@/hooks/use-theme";

export type TerminalContext = {
  close: () => void;
  clear: () => void;
  history: string[];
};

type Command = {
  description: string;
  usage?: string;
  hidden?: boolean;
  run: (args: string[], ctx: TerminalContext) => ReactNode[] | void;
};

const SECTIONS = ["work", "lab", "experience", "contact", "top"] as const;

const OPEN_TARGETS: Record<string, string> = {
  github: PROFILE.links.github,
  linkedin: PROFILE.links.linkedin,
  x: PROFILE.links.x,
  twitter: PROFILE.links.x,
  email: `mailto:${PROFILE.email}`,
};

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target={href.startsWith("mailto:") ? undefined : "_blank"}
    rel="noopener noreferrer"
    className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
  >
    {children}
  </a>
);

const Dim = ({ children }: { children: ReactNode }) => <span className="text-faint">{children}</span>;
const Hi = ({ children }: { children: ReactNode }) => <span className="text-fg">{children}</span>;
const Acc = ({ children }: { children: ReactNode }) => <span className="text-accent">{children}</span>;

function goTo(section: string, ctx: TerminalContext) {
  ctx.close();
  window.setTimeout(() => {
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  }, 60);
}

function pad(s: string, n: number) {
  return s.padEnd(n, " ");
}

export const COMMANDS: Record<string, Command> = {
  help: {
    description: "list commands",
    run: () => [
      <Dim>Commands. You can also just ask a question, e.g. "what are you building?"</Dim>,
      "",
      ...Object.entries(COMMANDS)
        .filter(([, c]) => !c.hidden)
        .map(([name, c]) => (
          <span>
            <Acc>{pad(c.usage ?? name, 22)}</Acc>
            <Dim>{c.description}</Dim>
          </span>
        )),
      "",
      <Dim>tab completes · ↑↓ history · ctrl+l clears · esc closes</Dim>,
    ],
  },
  whoami: {
    description: "the short version",
    run: () => [
      <Hi>{PROFILE.name}</Hi>,
      `${PROFILE.role} · ${PROFILE.location}`,
      "",
      "I build web and mobile apps, developer tooling and infrastructure,",
      "and I'm learning machine learning and Go.",
      "",
      <Dim>try: projects · learning · contact</Dim>,
    ],
  },
  projects: {
    description: "things I've built",
    usage: "projects [name]",
    run: (args) => {
      if (args[0]) {
        const p = PROJECTS.find((x) => x.slug.startsWith(args[0].toLowerCase()) || x.name.toLowerCase().startsWith(args[0].toLowerCase()));
        if (!p) return [`projects: no project matching "${args[0]}"`];
        return [
          <Hi>{p.name}</Hi>,
          <Dim>
            {p.kind} · {p.year}
          </Dim>,
          "",
          p.description,
          "",
          ...p.points.map((pt) => <span>  <Acc>›</Acc> {pt}</span>),
          "",
          <Dim>stack: {p.stack.join(", ")}</Dim>,
          ...(p.repo ? [<span>source: <A href={p.repo}>{p.repo.replace("https://", "")}</A></span>] : []),
          ...(p.live ? [<span>{(p.liveLabel ?? "live").toLowerCase()}: <A href={p.live}>{p.live.replace("https://", "")}</A></span>] : []),
        ];
      }
      return [
        ...PROJECTS.map((p) => (
          <span>
            <Acc>{pad(p.slug, 16)}</Acc>
            {p.tagline}
          </span>
        )),
        "",
        <Dim>projects &lt;name&gt; for details · open &lt;name&gt; to visit</Dim>,
      ];
    },
  },
  experience: {
    description: "where I've worked",
    run: () =>
      EXPERIENCE.flatMap((j) => [
        <span>
          <Hi>{j.role}</Hi> <Dim>@</Dim> <Acc>{j.company}</Acc> <Dim>· {j.period}</Dim>
        </span>,
        <Dim>  {j.summary}</Dim>,
        "",
      ]).concat(EDUCATION.map((e) => <Dim>🎓 {e.school}: {e.detail}</Dim>)),
  },
  learning: {
    description: "what I'm learning now",
    run: () => [
      <Hi>machine learning & ai</Hi>,
      ...ML_LOG.map((m) => (
        <span>
          {"  "}
          <Acc>✓</Acc> <Dim>{m.step}</Dim> {m.title}
        </span>
      )),
      <span>
        {"  "}
        <Acc>▍</Acc> still training…
      </span>,
      "",
      <Hi>go</Hi>,
      <span>  {GO_TOPICS.join(" · ")}</span>,
      "",
      <Dim>try: go run main.go · train</Dim>,
    ],
  },
  skills: {
    description: "languages & tools",
    run: () => TOOLBOX.map((g) => (
      <span>
        <Acc>{pad(g.group.toLowerCase(), 20)}</Acc>
        {g.items.join(", ")}
      </span>
    )),
  },
  resume: {
    description: "download my resume (PDF)",
    run: () => {
      const a = document.createElement("a");
      a.href = PROFILE.resume;
      a.download = "";
      a.click();
      return [<span>downloading <A href={PROFILE.resume}>{PROFILE.resume.slice(1)}</A>…</span>];
    },
  },
  contact: {
    description: "get in touch",
    run: () => [
      <span>email     <A href={`mailto:${PROFILE.email}`}>{PROFILE.email}</A></span>,
      <span>github    <A href={PROFILE.links.github}>github.com/Yug3ne</A></span>,
      <span>linkedin  <A href={PROFILE.links.linkedin}>in/eugenekoech9</A></span>,
      <span>x         <A href={PROFILE.links.x}>@_Yu_gene__</A></span>,
    ],
  },
  open: {
    description: "open a link or project",
    usage: "open <target>",
    run: (args) => {
      const target = (args[0] ?? "").toLowerCase();
      const project = PROJECTS.find((p) => p.slug === target);
      const url = OPEN_TARGETS[target] ?? project?.live ?? project?.repo;
      if (!url) {
        return [`usage: open <${[...Object.keys(OPEN_TARGETS), ...PROJECTS.filter((p) => p.live || p.repo).map((p) => p.slug)].join("|")}>`];
      }
      if (url.startsWith("mailto:")) window.location.href = url;
      else window.open(url, "_blank", "noopener,noreferrer");
      return [<Dim>opening {url.replace(/^(https:\/\/|mailto:)/, "")}…</Dim>];
    },
  },
  ls: {
    description: "list sections",
    run: () => [
      <span>
        {SECTIONS.filter((s) => s !== "top").map((s) => (
          <span key={s}>
            <Acc>{s}/</Acc>
            {"  "}
          </span>
        ))}
      </span>,
    ],
  },
  cd: {
    description: "jump to a section",
    usage: "cd <section>",
    run: (args, ctx) => {
      const target = (args[0] ?? "").replace(/\/$/, "").toLowerCase();
      if (target === "" || target === "~" || target === "..") return goTo("top", ctx);
      if (!(SECTIONS as readonly string[]).includes(target)) return [`cd: no such section: ${args[0]}`];
      goTo(target, ctx);
    },
  },
  train: {
    description: "retrain the hero neural net",
    run: (_, ctx) => {
      window.dispatchEvent(new Event(RETRAIN_EVENT));
      goTo("top", ctx);
    },
  },
  go: {
    description: "run my Go practice snippet",
    usage: "go run main.go",
    run: (args) => {
      if (args[0] !== "run") return ["usage: go run main.go"];
      return [...goSnippetOutput(), <Dim>exit status 0</Dim>];
    },
  },
  theme: {
    description: "switch theme",
    usage: "theme [light|dark]",
    run: (args) => {
      const next = args[0] === "light" || args[0] === "dark" ? args[0] : document.documentElement.classList.contains("dark") ? "light" : "dark";
      setTheme(next);
      return [<Dim>theme set to {next}</Dim>];
    },
  },
  neofetch: {
    description: "system info",
    run: () => {
      const logo = [" ___ _  __", "| __| |/ /", "| _|| ' < ", "|___|_|\\_\\"];
      const info: ReactNode[] = [
        <span><Acc>yug3ne</Acc>@<Acc>kipchirchir</Acc></span>,
        <Dim>------------------</Dim>,
        <span><Acc>role</Acc>     {PROFILE.role}</span>,
        <span><Acc>location</Acc> {PROFILE.location}</span>,
        <span><Acc>os</Acc>       Omarchy (Arch Linux) · Hyprland</span>,
        <span><Acc>editor</Acc>   Neovim (LazyVim)</span>,
        <span><Acc>langs</Acc>    TypeScript, Python, Go</span>,
        <span><Acc>learning</Acc> ML / AI · Go</span>,
      ];
      return info.map((line, i) => (
        <span>
          <Acc>{pad(logo[i] ?? "", 13)}</Acc>
          {line}
        </span>
      ));
    },
  },
  history: {
    description: "past commands",
    hidden: true,
    run: (_, ctx) => ctx.history.map((h, i) => <span><Dim>{String(i + 1).padStart(3)}</Dim>  {h}</span>),
  },
  echo: { description: "print text", hidden: true, run: (args) => [args.join(" ")] },
  date: { description: "print date", hidden: true, run: () => [new Date().toString()] },
  pwd: { description: "print location", hidden: true, run: () => ["/home/guest/kipchirchir"] },
  sudo: {
    description: "try it",
    hidden: true,
    run: (args) => {
      if (args[0] === "hire" || args.join(" ").includes("hire")) {
        window.setTimeout(() => (window.location.href = `mailto:${PROFILE.email}?subject=Let's%20work%20together`), 600);
        return [<Acc>[sudo] permission granted.</Acc>, <Dim>opening your mail client…</Dim>];
      }
      return ["guest is not in the sudoers file. This incident will be reported. 👀", <Dim>(try: sudo hire eugene)</Dim>];
    },
  },
  rm: { description: "", hidden: true, run: () => ["rm: permission denied. Nice try though."] },
  vim: { description: "", hidden: true, run: () => ["You're already in the best editor: this website. (:q to… just kidding, esc closes)"] },
  clear: {
    description: "clear the screen",
    run: (_, ctx) => ctx.clear(),
  },
  exit: {
    description: "close the terminal",
    run: (_, ctx) => ctx.close(),
  },
};

// Aliases
const ALIASES: Record<string, string> = {
  about: "whoami",
  work: "projects",
  project: "projects",
  jobs: "experience",
  now: "learning",
  stack: "skills",
  email: "contact",
  cv: "resume",
  socials: "contact",
  "?": "help",
  q: "exit",
  ":q": "exit",
  nvim: "vim",
};

// Keyword intents for natural-language questions. Runs in the browser; no LLM involved.
const INTENTS: { cmd: string; words: string[] }[] = [
  { cmd: "learning", words: ["learn", "learning", "ml", "machine", "ai", "model", "neural", "golang", "go", "study", "studying", "school"] },
  { cmd: "projects", words: ["project", "projects", "build", "built", "building", "made", "ship", "portfolio", "open source", "tidepush"] },
  { cmd: "experience", words: ["experience", "job", "jobs", "work", "worked", "payd", "career", "company", "employ"] },
  { cmd: "resume", words: ["resume", "cv", "pdf"] },
  { cmd: "contact", words: ["contact", "email", "hire", "reach", "talk", "linkedin", "twitter", "call"] },
  { cmd: "skills", words: ["skill", "skills", "stack", "tech", "language", "languages", "tools", "framework"] },
  { cmd: "whoami", words: ["who", "about", "yourself", "you", "name", "eugene"] },
];

export function resolveCommand(input: string): { name: string; args: string[]; inferred: boolean } | null {
  const parts = input.trim().split(/\s+/);
  const head = parts[0]?.toLowerCase() ?? "";
  const name = ALIASES[head] ?? head;
  if (COMMANDS[name]) return { name, args: parts.slice(1), inferred: false };

  const text = ` ${input.toLowerCase().replace(/[^a-z0-9\s]/g, " ")} `;
  for (const intent of INTENTS) {
    if (intent.words.some((w) => text.includes(` ${w} `) || text.includes(` ${w}s `))) {
      return { name: intent.cmd, args: [], inferred: true };
    }
  }
  return null;
}

export function completions(input: string): string[] {
  const parts = input.split(/\s+/);
  if (parts.length <= 1) {
    const all = Object.keys(COMMANDS).filter((c) => !COMMANDS[c].hidden);
    return all.filter((c) => c.startsWith(parts[0] ?? "")).map((c) => c);
  }
  const [cmd, arg = ""] = parts;
  let options: string[] = [];
  if (cmd === "open") options = [...Object.keys(OPEN_TARGETS), ...PROJECTS.map((p) => p.slug)];
  else if (cmd === "projects" || cmd === "project") options = PROJECTS.map((p) => p.slug);
  else if (cmd === "cd") options = SECTIONS.filter((s) => s !== "top").map(String);
  else if (cmd === "theme") options = ["light", "dark"];
  else if (cmd === "go") options = ["run main.go"];
  return options.filter((o) => o.startsWith(arg)).map((o) => `${cmd} ${o}`);
}
