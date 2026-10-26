import { useState } from "react";
import { ArrowUpRight, Check, Copy, Download } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { SOCIALS } from "@/components/Hero";
import { Serif } from "@/components/Section";

const NOW = [
  ["learning", "ML & AI · Go"],
  ["building", "Tidepush"],
  ["based", PROFILE.location],
  ["timezone", "EAT · UTC+3"],
] as const;

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line">
      <div className="glow pointer-events-none absolute inset-0 -z-10 rotate-180" />
      <div className="mx-auto grid max-w-6xl gap-16 px-5 py-24 md:px-8 md:py-36 lg:grid-cols-[1fr_300px] lg:items-end">
        <div>
          <p className="eyebrow reveal">
            <span className="text-accent">04</span> / Contact
          </p>
          <h2
            id="contact-title"
            className="reveal mt-6 max-w-4xl text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.035em] text-balance sm:text-6xl md:text-7xl"
          >
            Have something worth <Serif>building?</Serif>
          </h2>
          <p className="reveal mt-6 max-w-xl text-[16px] leading-relaxed text-muted">
            I'm happy to talk about a product, a collaboration, or ML, Go and developer tooling. Email is the
            quickest way to reach me.
          </p>

          <div className="reveal mt-10 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${PROFILE.email}`}
              className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-[15px] font-medium text-bg transition-transform hover:-translate-y-0.5"
            >
              {PROFILE.email}
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-[14px] text-muted transition-colors hover:text-fg"
              aria-live="polite"
            >
              {copied ? <Check className="size-4 text-accent" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy email"}
            </button>
            <a
              href={PROFILE.resume}
              download
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-[14px] text-muted transition-colors hover:text-fg"
            >
              <Download className="size-4" />
              Download resume
            </a>
          </div>

          <ul className="reveal mt-14 flex flex-wrap gap-x-8 gap-y-3">
            {SOCIALS.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-[14px] text-muted transition-colors hover:text-fg"
                >
                  <Icon className="size-4" />
                  <span className="link-underline">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <dl className="reveal grid gap-4 rounded-2xl border border-line bg-elevated/60 p-6 font-mono text-[12px]">
          {NOW.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0">
              <dt className="text-faint">{k}</dt>
              <dd className="text-right text-fg">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 font-mono text-[11px] text-faint md:flex-row md:items-center md:justify-between md:px-8">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
        <p>
          Static HTML, prerendered. Press <kbd className="rounded border border-line px-1 text-muted">/</kbd> for the
          terminal.
        </p>
      </div>
    </footer>
  );
}
