export type ContactEntry = {
  label: string;
  value: string;
  href: string;
};

type ContactProps = {
  data: ContactEntry[];
};

const Contact = ({ data }: ContactProps) => {
  return (
    <div className="flex flex-col gap-4 text-sm text-[#cdd6f4]">
      <p className="text-[#cdd6f4]">
        Ping me through any of the channels below. I tend to answer within a
        few hours if I&apos;m not deep in the lab.
      </p>
      <ul className="flex flex-col gap-3">
        {data.map((contact) => (
          <li
            key={contact.label}
            className="flex flex-wrap items-center justify-between rounded-lg border border-[#45475a] bg-[rgba(69,71,90,0.15)] px-4 py-3 text-[#cdd6f4]"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[#7f849c]">
              {contact.label}
            </span>
            <a
              href={contact.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[#89b4fa] transition hover:text-[#f5c2e7]"
            >
              {contact.value}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contact;
