import type { ReactNode } from "react";
import { STATS } from "@/data/profile";
import { cn } from "@/lib/utils";

export function Section({
  id,
  index,
  label,
  title,
  intro,
  children,
  className,
}: {
  id: string;
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("border-t border-line", className)}>
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <header className="reveal mb-12 grid gap-4 md:mb-16 md:grid-cols-[180px_1fr] md:gap-10">
          <p className="eyebrow pt-2">
            <span className="text-accent">{index}</span> / {label}
          </p>
          <div>
            <h2
              id={`${id}-title`}
              className="max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-balance md:text-[2.75rem] md:leading-[1.08]"
            >
              {title}
            </h2>
            {intro ? <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-muted text-pretty">{intro}</p> : null}
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}

export function Serif({ children }: { children: ReactNode }) {
  return <span className="font-serif text-[1.08em] font-normal italic tracking-normal text-accent">{children}</span>;
}

export function Stats() {
  return (
    <div className="border-y border-line bg-elevated/40">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4 md:px-2">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              "flex flex-col-reverse justify-end px-5 py-7 md:px-6 md:py-9",
              i % 2 === 1 && "border-l border-line",
              i > 0 && "md:border-l",
              i >= 2 && "border-t border-line md:border-t-0",
            )}
          >
            <dt className="mt-1.5 text-[12.5px] leading-snug text-muted">{s.label}</dt>
            <dd className="font-mono text-2xl font-medium tracking-tight md:text-3xl">{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
