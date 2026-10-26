import { useEffect, useRef, useState } from "react";
import { Check, Play, RotateCcw } from "lucide-react";
import { GO_TOPICS, ML_LOG } from "@/data/profile";
import { GO_SNIPPET, goSnippetOutput, tokenizeGo, type Token } from "@/lib/go-snippet";
import { RETRAIN_EVENT } from "@/lib/terminal-store";
import { Section, Serif } from "@/components/Section";

const TOKEN_CLASS: Record<Token["kind"], string> = {
  kw: "text-accent",
  str: "text-warm",
  num: "text-warm",
  fn: "text-fg",
  plain: "text-muted",
};

function GoPlayground() {
  const [output, setOutput] = useState<string[] | null>(null);
  const [visible, setVisible] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(timer.current), []);

  const run = () => {
    window.clearInterval(timer.current);
    const lines = goSnippetOutput();
    setOutput(lines);
    setVisible(0);
    let shown = 0;
    timer.current = window.setInterval(() => {
      shown++;
      setVisible(shown);
      if (shown >= lines.length) window.clearInterval(timer.current);
    }, 220);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-bg">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="font-mono text-[11px] text-muted">main.go</span>
        <button
          type="button"
          onClick={run}
          className="inline-flex items-center gap-1.5 rounded-md bg-accent-soft px-2.5 py-1 font-mono text-[11px] text-accent transition-opacity hover:opacity-80"
        >
          <Play className="size-3 fill-current" />
          go run .
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[11.5px] leading-[1.7]" tabIndex={0} aria-label="Go source code">
        <code>
          {GO_SNIPPET.split("\n").map((line, i) => (
            <div key={i} className="flex">
              <span className="w-7 shrink-0 select-none pr-3 text-right text-faint/60">{i + 1}</span>
              <span className="whitespace-pre">
                {line.length === 0
                  ? " "
                  : tokenizeGo(line.replace(/\t/g, "  ")).map((t, j) => (
                      <span key={j} className={TOKEN_CLASS[t.kind]}>
                        {t.text}
                      </span>
                    ))}
              </span>
            </div>
          ))}
        </code>
      </pre>
      <div className="min-h-[7.5rem] border-t border-line bg-elevated/60 px-4 py-3 font-mono text-[11.5px] leading-[1.7]" aria-live="polite">
        {output === null ? (
          <p className="text-faint">// press run to start the goroutines</p>
        ) : (
          <>
            {output.slice(0, visible).map((l, i) => (
              <p key={i} className="text-fg">
                {l}
              </p>
            ))}
            {visible >= output.length ? <p className="text-faint">exit status 0</p> : <span className="caret text-accent">▍</span>}
          </>
        )}
      </div>
    </div>
  );
}

export function Lab() {
  return (
    <Section
      id="lab"
      index="02"
      label="The lab"
      title={
        <>
          What I'm learning <Serif>right now.</Serif>
        </>
      }
      intro="Two tracks. Machine learning and AI, from gradient descent by hand to CNNs on medical images. And Go, for small, fast backend services."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <article className="reveal flex min-w-0 flex-col rounded-2xl border border-line bg-elevated p-6 md:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-xl font-semibold tracking-tight">Machine learning & AI</h3>
            <span className="font-mono text-[11px] text-faint">python · numpy · keras</span>
          </div>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            My learning log, in order. Every step is a notebook I worked through end to end.
          </p>

          <ol className="relative mt-7 space-y-5 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-px before:bg-line">
            {ML_LOG.map((item) => (
              <li key={item.step} className="relative flex gap-4">
                <span className="relative z-10 grid size-[23px] shrink-0 place-items-center rounded-full border border-line-strong bg-elevated text-accent">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <div className="-mt-0.5">
                  <p className="text-[14.5px] font-medium">
                    <span className="mr-2 font-mono text-[11px] text-faint">{item.step}</span>
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{item.note}</p>
                </div>
              </li>
            ))}
            <li className="relative flex gap-4">
              <span className="relative z-10 grid size-[23px] shrink-0 place-items-center rounded-full border border-accent/50 bg-elevated">
                <span className="size-2 animate-pulse rounded-full bg-accent" />
              </span>
              <p className="-mt-0.5 font-mono text-[12.5px] leading-[23px] text-accent">still training…</p>
            </li>
          </ol>

          <div className="mt-auto pt-8">
            <div className="rounded-xl border border-line bg-bg p-4">
              <p className="text-[13.5px] leading-relaxed text-muted">
                <span className="text-fg">Practice, not just notes.</span> The network at the top of this page is about
                200 lines of TypeScript, with backpropagation and the Adam optimiser written by hand. No ML libraries.
              </p>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new Event(RETRAIN_EVENT));
                  document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11.5px] text-accent transition-opacity hover:opacity-80"
              >
                <RotateCcw className="size-3" />
                retrain it from scratch
              </button>
            </div>
          </div>
        </article>

        <article className="reveal flex min-w-0 flex-col rounded-2xl border border-line bg-elevated p-6 md:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-xl font-semibold tracking-tight">Go</h3>
            <span className="font-mono text-[11px] text-faint">stdlib first</span>
          </div>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            After years of TypeScript I wanted a language that is small, fast and has concurrency built in. This is
            what I'm practising.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {GO_TOPICS.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-6 flex-1">
            <GoPlayground />
          </div>
        </article>
      </div>
    </Section>
  );
}
