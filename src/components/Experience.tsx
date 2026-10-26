import { EDUCATION, EXPERIENCE, TOOLBOX } from "@/data/profile";
import { Section, Serif } from "@/components/Section";

export function Experience() {
  return (
    <Section
      id="experience"
      index="03"
      label="Experience"
      title={
        <>
          Where I've <Serif>worked.</Serif>
        </>
      }
      intro="Web, mobile and infrastructure, usually on small teams where I work on everything from the UI to the API."
    >
      <ol className="border-t border-line">
        {EXPERIENCE.map((job) => (
          <li
            key={job.company}
            className="reveal grid gap-3 border-b border-line py-9 md:grid-cols-[180px_1fr] md:gap-10"
          >
            <div className="font-mono text-[11.5px] leading-relaxed text-faint">
              <p className="flex items-center gap-2 text-muted">
                {job.current ? (
                  <>
                    <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                    <span className="sr-only">Current role:</span>
                  </>
                ) : null}
                {job.period}
              </p>
              <p>{job.location}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium tracking-tight">
                {job.role} <span className="text-faint">at</span> {job.company}
              </h3>
              <p className="mt-1.5 max-w-2xl text-[14.5px] leading-relaxed text-muted">{job.summary}</p>
              <ul className="mt-4 max-w-2xl space-y-2">
                {job.points.map((p) => (
                  <li key={p} className="flex gap-3 text-[14px] leading-relaxed text-muted">
                    <span className="mt-[10px] h-px w-3 shrink-0 bg-faint" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {job.stack.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-20 grid gap-12 md:grid-cols-[180px_1fr] md:gap-10">
        <p className="eyebrow pt-1">Toolbox</p>
        <div className="grid gap-8 sm:grid-cols-2">
          {TOOLBOX.map((group) => (
            <div key={group.group} className="reveal">
              <h3 className="text-[13px] font-medium">{group.group}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                {group.items.map((item, i) => (
                  <span key={item}>
                    {item === "Go" ? <span className="text-accent">Go</span> : item}
                    {i < group.items.length - 1 ? <span className="text-faint"> · </span> : null}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        <p className="eyebrow pt-1">Education</p>
        <ul className="grid gap-6 sm:grid-cols-2">
          {EDUCATION.map((e) => (
            <li key={e.school} className="reveal">
              <h3 className="text-[14.5px] font-medium">{e.school}</h3>
              <p className="mt-1 text-[13.5px] text-muted">{e.detail}</p>
              <p className="mt-1 font-mono text-[11px] text-faint">{e.period}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
