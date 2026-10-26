import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { terminal } from "@/lib/terminal-store";
import { NeuralPlayground } from "@/components/NeuralPlayground";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/icons";

function NairobiClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: PROFILE.timezone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="tabular-nums">{time ?? "--:--"}</span>;
}

export const SOCIALS = [
  { href: PROFILE.links.github, label: "GitHub", Icon: GithubIcon },
  { href: PROFILE.links.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: PROFILE.links.x, label: "X (Twitter)", Icon: XIcon },
];

export function Hero() {
  return (
    <section id="top" className="relative">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="glow pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-14 md:px-8 md:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-28">
        <div>
          <div className="rise flex items-center gap-3">
            <picture>
              <source srcSet="/avatar.avif 1x, /avatar@2x.avif 2x" type="image/avif" />
              <img
                src="/avatar@2x.webp"
                alt="Portrait of Eugene Kipchirchir Koech"
                width={44}
                height={44}
                fetchPriority="high"
                className="size-11 rounded-full object-cover object-top ring-1 ring-line-strong"
              />
            </picture>
            <div className="leading-tight">
              <p className="text-[14px] font-medium">{PROFILE.name}</p>
              <p className="font-mono text-[11px] text-faint">
                {PROFILE.location} · <NairobiClock /> EAT
              </p>
            </div>
          </div>

          <h1
            className="rise mt-8 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.035em] text-balance sm:text-6xl lg:text-[4.1rem]"
            style={{ animationDelay: "80ms" }}
          >
            I build software people rely on, and I'm teaching machines to{" "}
            <span className="font-serif text-[1.08em] font-normal italic tracking-[-0.01em] text-accent">learn.</span>
          </h1>

          <p
            className="rise mt-6 max-w-xl text-[16.5px] leading-relaxed text-muted text-pretty"
            style={{ animationDelay: "160ms" }}
          >
            {PROFILE.role} in {PROFILE.location.split(",")[0]}. I work across the whole stack, from web and mobile apps to
            developer tooling and infrastructure. Right now I'm going deep on{" "}
            <span className="text-fg">machine learning</span> and <span className="text-fg">Go</span>.
          </p>

          <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "240ms" }}>
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-[14px] font-medium text-bg transition-transform hover:-translate-y-0.5"
            >
              See my work
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <button
              type="button"
              onClick={terminal.open}
              className="inline-flex items-center gap-2.5 rounded-full border border-line-strong px-5 py-2.5 text-[14px] text-fg transition-colors hover:bg-accent-soft"
            >
              Open the terminal
              <kbd className="rounded border border-line px-1.5 font-mono text-[11px] text-faint">/</kbd>
            </button>
            <div className="ml-1 flex items-center gap-1">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:text-fg"
                >
                  <Icon className="size-[17px]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="rise mx-auto w-full max-w-[440px]" style={{ animationDelay: "200ms" }}>
          <NeuralPlayground />
          <p className="mt-3 text-center font-mono text-[10.5px] text-faint">
            A real neural network, training in your browser right now.
          </p>
        </div>
      </div>
    </section>
  );
}
