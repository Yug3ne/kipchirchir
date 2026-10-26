import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { COMMANDS, completions, resolveCommand, type TerminalContext } from "@/lib/terminal-commands";
import { terminal, useTerminalOpen } from "@/lib/terminal-store";

const PROMPT = "guest@kipchirchir:~$";

type Line = { id: number; node: ReactNode };

let nextId = 0;
const line = (node: ReactNode): Line => ({ id: nextId++, node });

const WELCOME: Line[] = [
  line(<span className="text-fg">Welcome. This terminal runs entirely in your browser.</span>),
  line(
    <span className="text-faint">
      Type <span className="text-accent">help</span>, or ask something like "what are you learning?"
    </span>,
  ),
  line(""),
];

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
}

export function Terminal() {
  const open = useTerminalOpen();
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // Global shortcuts: "/", "`", ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        terminal.toggle();
        return;
      }
      if ((e.key === "/" || e.key === "`") && !isTypingTarget(e.target) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        terminal.open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
      returnFocus.current?.focus?.();
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, open]);

  const run = useCallback((raw: string) => {
    const input = raw.trim();
    const echo = line(
      <span>
        <span className="text-accent">{PROMPT}</span> <span className="text-fg">{raw}</span>
      </span>,
    );
    if (!input) {
      setLines((l) => [...l, echo]);
      return;
    }
    history.current.push(input);
    historyIndex.current = -1;

    let cleared = false;
    const ctx: TerminalContext = {
      close: terminal.close,
      clear: () => {
        cleared = true;
      },
      history: history.current,
    };

    const resolved = resolveCommand(input);
    let output: ReactNode[] = [];
    if (!resolved) {
      output = [
        <span>
          command not found: {input.split(/\s+/)[0]}. Try <span className="text-accent">help</span>.
        </span>,
      ];
    } else {
      const result = COMMANDS[resolved.name].run(resolved.args, ctx) ?? [];
      output = resolved.inferred
        ? [<span className="text-faint">→ running "{resolved.name}"</span>, ...result]
        : result;
    }

    if (cleared) {
      setLines([]);
      return;
    }
    setLines((l) => [...l, echo, ...output.map(line), line("")]);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "Escape") {
      terminal.close();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      if (h.length === 0) return;
      let i = historyIndex.current;
      if (e.key === "ArrowUp") i = i === -1 ? h.length - 1 : Math.max(0, i - 1);
      else i = i === -1 ? -1 : i + 1 >= h.length ? -1 : i + 1;
      historyIndex.current = i;
      setValue(i === -1 ? "" : h[i]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const options = completions(value);
      if (options.length === 1) setValue(`${options[0]} `);
      else if (options.length > 1) {
        setLines((l) => [
          ...l,
          line(
            <span>
              <span className="text-accent">{PROMPT}</span> <span className="text-fg">{value}</span>
            </span>,
          ),
          line(<span className="text-faint">{options.join("   ")}</span>),
        ]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-[8vh] sm:p-6 sm:pt-[10vh]">
      <button
        type="button"
        aria-label="Close terminal"
        className="absolute inset-0 cursor-default bg-bg/60 backdrop-blur-sm [animation:rise_0.2s_ease-out]"
        onClick={terminal.close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Interactive terminal"
        className="relative flex h-[min(560px,78vh)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-line-strong bg-elevated font-mono text-[12.5px] shadow-[0_40px_120px_-30px_rgb(0_0_0/0.6)] [animation:rise_0.25s_cubic-bezier(0.2,0.7,0.2,1)]"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 flex-1 text-[11px] text-faint">guest@kipchirchir: ~</span>
          <button
            type="button"
            onClick={terminal.close}
            aria-label="Close terminal"
            className="rounded p-1 text-faint transition-colors hover:text-fg"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 leading-[1.65] text-muted" aria-live="polite">
          {lines.map((l) => (
            <div key={l.id} className="min-h-[1.65em] whitespace-pre-wrap break-words">
              {l.node}
            </div>
          ))}
          <label className="flex items-center gap-2">
            <span className="shrink-0 text-accent">{PROMPT}</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Terminal input"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent text-fg caret-accent outline-none"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
