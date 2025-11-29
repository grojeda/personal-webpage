export type JobEntry = {
  role: string;
  company: string;
  period: string;
  stack: string[];
};

type JobsProps = {
  data: JobEntry[];
};

const Jobs = ({ data }: JobsProps) => {
  return (
    <div className="flex w-full flex-col gap-4">
      {data.map((job) => (
        <article
          key={`${job.company}-${job.role}`}
          className="rounded-lg border border-border bg-border/15 p-4 text-foreground"
        >
          <header className="flex flex-wrap items-center justify-between gap-2 text-sm uppercase tracking-[0.25em] text-muted">
            <span>{job.company}</span>
            <span>{job.period}</span>
          </header>
          <p className="mt-2 text-lg font-semibold text-foreground">{job.role}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-accent-green">
            stack
          </p>
          <ul className="mt-1 flex flex-wrap gap-2 text-sm text-accent-lavender">
            {job.stack.map((tool) => (
              <li
                key={tool}
                className="rounded-full border border-accent-gray px-2 py-0.5 text-xs uppercase tracking-[0.2em]"
              >
                {tool}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
};

export default Jobs;
