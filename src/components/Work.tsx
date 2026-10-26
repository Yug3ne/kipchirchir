import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { HEARD_RESULTS, PROFILE, PROJECTS, type Project } from "@/data/profile";
import { Section, Serif } from "@/components/Section";
import { GithubIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

function ProjectLinks({ project, className }: { project: Project; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      {project.repo ? (
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-fg"
        >
          <GithubIcon className="size-3.5" />
          Source
        </a>
      ) : null}
      {project.live ? (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-fg"
        >
          {project.liveLabel ?? "Live"}
          <ArrowUpRight className="size-3.5" />
        </a>
      ) : null}
    </div>
  );
}

function Window({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-bg font-mono text-[11.5px] leading-[1.8]">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="ml-2 text-[10.5px] text-faint">{title}</span>
      </div>
      <div className="overflow-x-auto p-4">{children}</div>
    </div>
  );
}

function TidepushVisual() {
  return (
    <Window title="~/payd-app">
      <p className="whitespace-nowrap">
        <span className="text-faint">$</span> npx tidepush publish --channel production
      </p>
      <p className="whitespace-nowrap text-muted">
        <span className="text-accent">✓</span> bundle uploaded
      </p>
      <p className="whitespace-nowrap text-muted">
        <span className="text-accent">✓</span> manifest signed with app key
      </p>
      <div className="mt-3 flex items-center gap-3">
        <span className="shrink-0 text-faint">rollout</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-accent [animation:rollout_6s_ease-in-out_infinite_alternate]" style={{ width: "100%" }} />
        </div>
        <span className="shrink-0 text-faint">10% → 100%</span>
      </div>
      <p className="mt-3 whitespace-nowrap text-faint">
        <span className="text-warm">↺</span> tidepush rollback <span className="text-muted">ready</span>
      </p>
    </Window>
  );
}

function PaydSdkVisual() {
  return (
    <Window title="collect.ts">
      <p className="whitespace-nowrap">
        <span className="text-accent">const</span> payd = <span className="text-accent">new</span> PaydClient({"{ "}
        <span className="text-muted">apiUsername, apiPassword</span>
        {" }"});
      </p>
      <p className="mt-2 whitespace-nowrap">
        <span className="text-accent">await</span> payd.collections.mpesa({"{"}
      </p>
      <p className="whitespace-nowrap pl-4 text-muted">
        amount: <span className="text-warm">500</span>, phoneNumber: <span className="text-warm">"0700000000"</span>,
      </p>
      <p className="whitespace-nowrap">{"});"}</p>
      <p className="mt-3 whitespace-nowrap text-muted">
        <span className="text-accent">✓</span> 101 tests passed
      </p>
    </Window>
  );
}

function HeardVisual() {
  return (
    <div className="rounded-xl border border-line bg-bg p-4 font-mono text-[11px]">
      <table className="w-full border-separate border-spacing-y-1.5">
        <caption className="mb-2 text-left text-faint">PR-AUC on 480 held-out Kenyans (higher is better)</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Model</th>
            <th scope="col">PR-AUC</th>
          </tr>
        </thead>
        <tbody>
          {HEARD_RESULTS.map((r) => (
            <tr key={r.model}>
              <th scope="row" className={cn("w-[44%] pr-3 text-left font-normal", "chosen" in r ? "text-fg" : "text-muted")}>
                {r.model}
              </th>
              <td>
                <div className="flex items-center gap-2.5">
                  <div className="h-2 flex-1" aria-hidden="true">
                    <div
                      className={cn(
                        "h-full rounded-r-[4px]",
                        "chosen" in r ? "bg-accent" : "baseline" in r ? "bg-line" : "bg-line-strong",
                      )}
                      style={{ width: `${(r.prAuc / 0.45) * 100}%` }}
                    />
                  </div>
                  <span className={cn("w-9 text-right tabular-nums", "chosen" in r ? "text-fg" : "text-muted")}>
                    {r.prAuc.toFixed(2)}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const VISUALS: Record<string, () => ReactNode> = {
  tidepush: TidepushVisual,
  "payd-sdks": PaydSdkVisual,
  "who-gets-heard": HeardVisual,
};

function FeatureCard({ project, wide }: { project: Project; wide?: boolean }) {
  const Visual = VISUALS[project.slug];
  return (
    <article
      className={cn(
        "reveal group relative flex min-w-0 flex-col gap-8 rounded-2xl border border-line bg-elevated p-6 transition-colors hover:border-line-strong md:p-8",
        wide && "lg:col-span-2 lg:grid lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-12",
      )}
    >
      <div className="flex flex-1 flex-col">
        <p className="eyebrow">
          {project.kind} · {project.year}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-[1.75rem]">{project.name}</h3>
        <p className="mt-1.5 text-[15px] text-fg/85">{project.tagline}</p>
        <p className="mt-4 text-[14px] leading-relaxed text-muted">{project.description}</p>
        <ul className="mt-5 space-y-1.5">
          {project.points.map((p) => (
            <li key={p} className="flex gap-2.5 text-[13.5px] leading-relaxed text-muted">
              <span className="mt-[9px] size-1 shrink-0 rounded-full bg-accent" />
              {p}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>
        <ProjectLinks project={project} className="mt-6" />
      </div>
      {Visual ? <Visual /> : null}
    </article>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const href = project.live ?? project.repo;
  return (
    <li className="reveal group relative grid gap-2 border-b border-line py-6 md:grid-cols-[180px_1fr_auto] md:items-baseline md:gap-10">
      <p className="font-mono text-[11px] text-faint">
        {project.kind} · {project.year}
      </p>
      <div>
        <h3 className="text-lg font-medium tracking-tight">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
              {project.name}
              <ArrowUpRight className="ml-1 inline size-4 text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </a>
          ) : (
            project.name
          )}
        </h3>
        <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-muted">
          {project.tagline} {project.points[0]}.
        </p>
      </div>
      <div className="relative z-10 flex flex-wrap gap-1.5 md:justify-end">
        {project.stack.slice(0, 3).map((s) => (
          <span key={s} className="chip">
            {s}
          </span>
        ))}
      </div>
    </li>
  );
}

export function Work() {
  const featured = PROJECTS.slice(0, 3);
  const rest = PROJECTS.slice(3);

  return (
    <Section
      id="work"
      index="01"
      label="Selected work"
      title={
        <>
          Things I've built and <Serif>shipped.</Serif>
        </>
      }
      intro="Developer infrastructure, SDKs, machine learning on real Kenyan data, and products running in production. Most of it is open source."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {featured.map((p, i) => (
          <FeatureCard key={p.slug} project={p} wide={i === 0} />
        ))}
      </div>

      <div className="mt-20">
        <p className="eyebrow mb-2">More projects</p>
        <ul className="border-t border-line">
          {rest.map((p) => (
            <ProjectRow key={p.slug} project={p} />
          ))}
        </ul>
        <a
          href={`${PROFILE.links.github}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 text-[14px] text-muted transition-colors hover:text-fg"
        >
          <GithubIcon className="size-4" />
          <span className="link-underline">Everything else on GitHub</span>
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </Section>
  );
}
