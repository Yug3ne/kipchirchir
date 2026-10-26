import { Download, Moon, Sun, TerminalSquare } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { useTheme } from "@/hooks/use-theme";
import { terminal } from "@/lib/terminal-store";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#lab", label: "Lab" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const { toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:px-8" aria-label="Main">
        <a href="#top" className="group flex items-center gap-2.5" title="Back to top">
          <span className="grid size-7 place-items-center rounded-md bg-fg font-mono text-[11px] font-bold text-bg transition-transform group-hover:-rotate-6">
            ek
          </span>
          <span className="font-mono text-[13px] text-muted transition-colors group-hover:text-fg">
            kipchirchir<span className="text-accent">.</span>
          </span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-[13px] text-muted transition-colors hover:text-fg">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <a
            href={PROFILE.resume}
            download
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] text-muted transition-colors hover:text-fg"
          >
            <Download className="size-3.5" />
            Resume
          </a>
          <button
            type="button"
            onClick={terminal.open}
            className="flex items-center gap-2 rounded-lg border border-line px-2.5 py-1.5 text-muted transition-colors hover:border-line-strong hover:text-fg"
            aria-label="Open terminal"
          >
            <TerminalSquare className="size-3.5" />
            <kbd className="hidden font-mono text-[10.5px] sm:inline">⌘K</kbd>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:text-fg"
            aria-label="Toggle colour theme"
          >
            <Sun className="hidden size-4 dark:block" />
            <Moon className="size-4 dark:hidden" />
          </button>
        </div>
      </nav>
    </header>
  );
}
