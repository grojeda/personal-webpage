import { useEffect, useRef, useState } from 'react';
import { getUptimeString } from '../shared/time';
import { useUptime } from '../hooks/useUptime';

type HistoryEntry = {
  id: number;
  content?: string;
};

const helpText = `Comandos disponibles:
- projects`;

const buildIntroArt = (uptime: string) => `
┌──────────────────────────────────────────────────────────┐
│ name:       Germán Rodríguez Ojeda                       │
│ role:       Fullstack Developer                          │
│ focus:      LLMs · Homelab experimentation               │
│ location:   Spain                                        │
│ status:     available for chat                           │
│ uptime:     ${uptime}                        │
│ mode:       building my own AI tools and homelab         │
│ contact:    german.rodriguez@proton.me                   │
└──────────────────────────────────────────────────────────┘

Type 'help' to see available commands.
`;

const Terminal = () => {
  const uptime = useUptime();

  const [history, setHistory] = useState<HistoryEntry[]>([
    { id: 0, content: buildIntroArt(uptime) }
  ]);
  const [input, setInput] = useState('');
  const [showProjects, setShowProjects] = useState(false);
  const terminalRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) return;

    const nextId = history.length ? history[history.length - 1].id + 1 : 0;

    const newEntries: HistoryEntry[] = [...history, { id: nextId, content: trimmed }];

    if (trimmed.toLowerCase() === 'projects') {
      newEntries.push({
        id: nextId + 1
      });
      setShowProjects(true);
    }
    if (trimmed.toLowerCase() === 'help') {
      newEntries.push({
        id: nextId + 1,
        content: helpText
      });
    } else {
      newEntries.push({
        id: nextId + 1,
        content: `bash: command not found: ${trimmed}`
      });
    }

    setHistory(newEntries);
    setInput('');
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const next = getUptimeString();
      setHistory((prev) =>
        prev.map((entry) => (entry.id === 0 ? { ...entry, content: buildIntroArt(next) } : entry))
      );
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const routePath = () => {
    return (
      <>
        <span className="text-emerald-400">grojeda@personal-webpage</span>
        <span className="text-slate-500">:</span>
        <span className="text-sky-400">~</span>
        <span className="text-slate-500">$ </span>
      </>
    );
  };

  return (
    <section className="flex h-[calc(100vh-4rem)] w-full items-stretch px-6 py-6">
      <div className="flex w-full gap-4">
        <div
          className={`flex flex-1 flex-col rounded-xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-[0_0_0_1px_rgba(15,23,42,0.9)] backdrop-blur-md transition-[flex] duration-200 ${
            showProjects ? 'md:w-1/2' : 'md:w-full'
          }`}
        >
          <div
            ref={terminalRef}
            className="flex-1 overflow-y-auto rounded-md bg-slate-950/90 p-3 font-mono text-sm text-slate-100 shadow-inner shadow-slate-950/80"
          >
            {routePath()}
            {history.map((entry) => (
              <pre key={entry.id} className="whitespace-pre text-slate-100">
                {entry.id !== 0 && routePath()}
                {entry.content && entry.content}
              </pre>
            ))}
            <form
              onSubmit={handleSubmit}
              className="flex items-center bg-slate-950/95 font-mono text-sm text-slate-100"
            >
              {routePath()}
              <input
                autoFocus
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="ml-2 flex-1 bg-transparent caret-emerald-400 outline-none [caret-width:4px] placeholder:text-slate-600"
              />
            </form>
          </div>
        </div>

        {showProjects && (
          <div className="hidden w-1/2 flex-1 flex-col rounded-xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-[0_0_0_1px_rgba(15,23,42,0.9)] backdrop-blur-md md:flex">
            <div className="flex flex-1 items-center justify-center rounded-md bg-slate-950/90 p-4 font-mono text-sm text-slate-300">
              ventana proyectos
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Terminal;
