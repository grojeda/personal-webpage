export type AboutData = {
  intro: string;
  highlights: { label: string; value: string }[];
};

type AboutProps = {
  data: AboutData;
};

const About = ({ data }: AboutProps) => {
  return (
    <div className="flex flex-col gap-4 text-[#cdd6f4]">
      <p className="text-base leading-relaxed">{data.intro}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {data.highlights.map((item) => (
          <article
            key={item.label}
            className="rounded-lg border border-[#45475a] bg-[rgba(69,71,90,0.15)] p-4"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#7f849c]">
              {item.label}
            </p>
            <p className="mt-2 text-sm text-[#cdd6f4]">{item.value}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default About;
