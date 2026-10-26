import type { ReactNode } from "react";
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
