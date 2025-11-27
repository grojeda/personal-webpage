import { useCallback, useEffect, useRef, useState } from 'react';
import { getUptimeString } from '../shared/time';
import { useUptime } from '../hooks/useUptime';
import { resolveWindowSlug, WINDOW_LABELS, type WindowSlug } from '../shared/windows';

type HistoryEntry = {
  id: number;
  type: 'command' | 'output';
  content: string;
};

type TerminalProps = {
  openPanels: WindowSlug[];
  onOpenPanel: (panel: WindowSlug) => WindowSlug | null;
  onClosePanel: (panel: WindowSlug) => void;
  onCloseAll: () => void;
};

const buildIntroArt = (uptime: string) => `
┌──────────────────────────────────────────────────────────┐
│ name:       Germán Rodríguez Ojeda                       │
│ role:       Fullstack Developer                          │
│ focus:      LLMs · Homelab experimentation               │
│ location:   Spain                                        │
│ status:     available for chat                           │
│ uptime:     ${uptime}                         │
│ mode:       building my own AI tools and homelab         │
│ contact:    german.rodriguez@proton.me                   │
└──────────────────────────────────────────────────────────┘

Type 'help' to see available commands.
`;

const buildHelpText = () => {
  const availableWindows = Object.values(WINDOW_LABELS)
    .map((label) => `  - ${label}`)
    .join('\n');

  return `Available commands:
  help             Display this help message
  clear            Clear the terminal screen
  windows          List open windows
  close all        Close every window except terminal
  open <window>    Open one of: 
${availableWindows}
  close <window>   Close the requested window
  <window>         Shortcut to open (jobs, about, contact)

Note: the desktop keeps a max of four windows visible; the oldest non-terminal window closes first.`;
};

const Terminal = ({ openPanels, onOpenPanel, onClosePanel, onCloseAll }: TerminalProps) => {
  const uptime = useUptime();

  const [history, setHistory] = useState<HistoryEntry[]>([
    { id: 0, type: 'output', content: buildIntroArt(uptime) }
  ]);
  const [input, setInput] = useState('');
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);
  const helpText = buildHelpText();

  const handleWindowCommand = (lower: string): string | null => {
    if (lower === 'windows') {
      if (openPanels.length === 0) {
        return 'No secondary windows are active.';
      }

      const list = openPanels
        .map((panel) => `- ${WINDOW_LABELS[panel]}`)
        .join('\n');
      return `Open windows:\n${list}`;
    }

    if (lower === 'close all') {
      if (openPanels.length === 0) {
        return 'No windows need to be closed.';
      }

      onCloseAll();
      return 'Closed every secondary window.';
    }

    const closeMatch = lower.match(/^close\s+(.+)/);
    if (closeMatch) {
      const slug = resolveWindowSlug(closeMatch[1].trim());
      if (!slug) {
        return `Unknown window: ${closeMatch[1].trim()}`;
      }

      if (!openPanels.includes(slug)) {
        return `${WINDOW_LABELS[slug]} is not open.`;
      }

      onClosePanel(slug);
      return `Closing ${WINDOW_LABELS[slug]} window.`;
    }

    const openMatch = lower.match(/^(open|show)\s+(.+)/);
    const slug =
      (openMatch && resolveWindowSlug(openMatch[2].trim())) ||
      resolveWindowSlug(lower);

    if (slug) {
      if (openPanels.includes(slug)) {
        return `${WINDOW_LABELS[slug]} is already visible.`;
      }

      const replaced = onOpenPanel(slug);
      if (replaced) {
        return `Opening ${WINDOW_LABELS[slug]} window (closing ${WINDOW_LABELS[replaced]}).`;
      }

      return `Opening ${WINDOW_LABELS[slug]} window.`;
    }

    return null;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      const nextId = prev.length ? prev[prev.length - 1].id + 1 : 0;
      const entries: HistoryEntry[] = [];

      entries.push({
        id: nextId,
        type: 'command',
        content: trimmed
      });

      const lower = trimmed.toLowerCase();

      if (lower === 'help') {
        entries.push({
          id: nextId + 1,
          type: 'output',
          content: helpText
        });
      } else if (lower === 'clear') {
        return [{ id: 0, type: 'output', content: buildIntroArt(uptime) }];
      } else {
        const response = handleWindowCommand(lower);

        if (!response) {
          entries.push({
            id: nextId + 1,
            type: 'output',
            content: `bash: command not found: ${trimmed}`
          });
        } else {
          entries.push({
            id: nextId + 1,
            type: 'output',
            content: response
          });
        }
      }

      return [...prev, ...entries];
    });

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
        prev.map((entry) =>
          entry.id === 0 ? { ...entry, content: buildIntroArt(next) } : entry
        )
      );
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const routePath = () => (
    <>
      <span className="text-[#a6e3a1]">grojeda@personal-webpage</span>
      <span className="text-[#7f849c]">:</span>
      <span className="text-[#89b4fa]">~</span>
      <span className="mr-2 text-[#7f849c]">$</span>
    </>
  );

  return (
    <div
      className="flex h-full min-h-0 w-full flex-col font-mono text-sm text-[#cdd6f4]"
      onClick={focusInput}
      onMouseEnter={focusInput}
    >
      <div ref={terminalRef} className="scroll-shell flex-1 overflow-y-auto">
        {history.map((entry) => (
          <div key={entry.id} className="flex">
            {entry.type === 'command' ? (
              <>
                {routePath()}
                <pre className="whitespace-pre text-[#cdd6f4]">
                  {entry.content}
                </pre>
              </>
            ) : (
              <pre className="whitespace-pre-wrap break-words text-[#cdd6f4]">
                {entry.content}
              </pre>
            )}
          </div>
        ))}

        <form
          onSubmit={handleSubmit}
          className="mt-4 flex items-center bg-transparent text-[#cdd6f4]"
        >
          {routePath()}
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="ml-1 flex-1 bg-transparent caret-[#a6e3a1] text-[#cdd6f4] outline-none"
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;
