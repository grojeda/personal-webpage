import { useCallback, useEffect, useRef, useState } from 'react';
import { getUptimeString } from '../shared/time';
import { useUptime } from '../hooks/useUptime';
import type { JobDocument } from '../shared/jobs';
import { JobsViewMode } from './jobs/viewMode';
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
  jobFiles: JobDocument[];
  onSelectJob: (filename: string | null) => void;
  onSetJobsViewMode: (mode: JobsViewMode) => void;
};

const BOX_CONTENT_WIDTH = 58;
const LABEL_WIDTH = 11;

const makeLine = (label: string, value: string) => {
  const labelText = `${label}:`.padEnd(LABEL_WIDTH, ' ');
  const content = `${labelText}${value}`.padEnd(BOX_CONTENT_WIDTH, ' ');

  return `│ ${content} │`;
};

const buildIntroArt = (uptime: string) => {
  const lines = [
    makeLine('name', 'Germán Rodríguez Ojeda'),
    makeLine('role', 'Fullstack Developer'),
    makeLine('focus', 'LLMs · Homelab experimentation'),
    makeLine('location', 'Spain'),
    makeLine('status', 'available for chat'),
    makeLine('uptime', uptime),
    makeLine('mode', 'building my own AI tools and homelab'),
    makeLine('contact', 'german.rodriguez@proton.me')
  ];

  const top = '┌' + '─'.repeat(BOX_CONTENT_WIDTH + 2) + '┐';
  const bottom = '└' + '─'.repeat(BOX_CONTENT_WIDTH + 2) + '┘';

  return [
    top,
    ...lines,
    bottom,
    '',
    "Type 'help' to see available commands."
  ].join('\n');
};

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

const ROOT_DIRECTORIES = ['./jobs', './about', './contact'];

const buildLsOutput = () => {
  const lines = ['.'];
  ROOT_DIRECTORIES.forEach((dir, index) => {
    const branch = index === ROOT_DIRECTORIES.length - 1 ? '└──' : '├──';
    lines.push(`${branch} ${dir}`);
  });
  return lines.join('\n');
};

const normalizeJobInput = (value: string) => {
  const sanitized = value.trim().replace(/^(\.\/)?jobs\//i, '');
  if (!sanitized) return '';
  const withExt = sanitized.endsWith('.yml') || sanitized.endsWith('.yaml')
    ? sanitized.replace(/\.ya?ml$/i, '.yml')
    : `${sanitized}.yml`;
  return withExt;
};

const findJobByInput = (jobs: JobDocument[], input: string) => {
  const normalized = normalizeJobInput(input);
  return (
    jobs.find(
      (job) => job.filename.toLowerCase() === normalized.toLowerCase()
    ) ?? null
  );
};

const Terminal = ({
  openPanels,
  onOpenPanel,
  onClosePanel,
  onCloseAll,
  jobFiles,
  onSelectJob,
  onSetJobsViewMode
}: TerminalProps) => {
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

  const handleJobsCommand = (
    command: string,
    pushEntry: (entry: Omit<HistoryEntry, 'id'>) => void
  ) => {
    const tokens = command.trim().split(/\s+/);
    if (tokens[0]?.toLowerCase() !== 'jobs') {
      return false;
    }

    if (tokens.length === 1) {
      onSetJobsViewMode(JobsViewMode.Directory);
      onSelectJob(null);
      onOpenPanel('jobs');
      pushEntry({
        type: 'output',
        content: 'jobs: opened directory view.'
      });
      return true;
    }

    const action = tokens[1].toLowerCase();
    const args =
      action === 'view' || action === 'open'
        ? tokens.slice(2)
        : tokens.slice(1);
    const fileInput = args.join(' ').trim();

    if (!fileInput) {
      pushEntry({
        type: 'output',
        content: 'Usage: jobs view <filename.yml>'
      });
      return true;
    }

    const job = findJobByInput(jobFiles, fileInput);
    if (!job) {
      pushEntry({
        type: 'output',
        content: `jobs: file not found: ${fileInput}`
      });
      return true;
    }

    onSelectJob(job.filename);
    onSetJobsViewMode(JobsViewMode.File);
    onOpenPanel('jobs');
    pushEntry({
      type: 'output',
      content: `Opened ${job.filename} in jobs window.`
    });
    return true;
  };

  const handleCatCommand = (
    command: string,
    pushEntry: (entry: Omit<HistoryEntry, 'id'>) => void
  ) => {
    if (!command.toLowerCase().startsWith('cat ')) {
      return false;
    }

    const target = command.slice(4).trim();
    if (!target) {
      pushEntry({ type: 'output', content: 'cat: missing file operand' });
      return true;
    }

    const lowerTarget = target.toLowerCase();
    if (!(lowerTarget.startsWith('jobs/') || lowerTarget.startsWith('./jobs/'))) {
      pushEntry({
        type: 'output',
        content: 'cat: only jobs/<file>.yml is supported.'
      });
      return true;
    }

    const job = findJobByInput(jobFiles, target);
    if (!job) {
      pushEntry({
        type: 'output',
        content: `cat: ${target}: No such file`
      });
      return true;
    }

    pushEntry({ type: 'output', content: job.raw });
    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      const nextId = prev.length ? prev[prev.length - 1].id + 1 : 0;
      let cursorId = nextId;
      const entries: HistoryEntry[] = [
        { id: cursorId, type: 'command', content: trimmed }
      ];
      const pushEntry = (entry: Omit<HistoryEntry, 'id'>) => {
        cursorId += 1;
        entries.push({ ...entry, id: cursorId } as HistoryEntry);
      };
      const lower = trimmed.toLowerCase();

      if (lower === 'help') {
        pushEntry({
          type: 'output',
          content: helpText
        });
      } else if (lower === 'ls') {
        pushEntry({
          type: 'output',
          content: buildLsOutput()
        });
      } else if (lower === 'clear') {
        return [{ id: 0, type: 'output', content: buildIntroArt(uptime) }];
      } else if (handleJobsCommand(trimmed, pushEntry)) {
        // handled above
      } else if (handleCatCommand(trimmed, pushEntry)) {
        // handled cat
      } else {
        const response = handleWindowCommand(lower);

        if (!response) {
          pushEntry({
            type: 'output',
            content: `bash: command not found: ${trimmed}`
          });
        } else {
          pushEntry({
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
      <span className="text-accent-green">grojeda</span>
      <span className="text-accent-blue">@personal-webpage</span>
      <span className="text-muted">:</span>
      <span className="text-accent-blue">~</span>
      <span className="mr-2 text-muted">$</span>
    </>
  );

  return (
    <div
      className="flex h-full min-h-0 w-full flex-col font-mono text-sm text-foreground"
      onClick={focusInput}
      onMouseEnter={focusInput}
    >
      <div ref={terminalRef} className="scroll-shell flex-1 overflow-y-auto">
        {history.map((entry) => (
          <div key={entry.id} className="flex">
            {entry.type === 'command' ? (
              <>
                {routePath()}
                <pre className="whitespace-pre text-foreground">
                  {entry.content}
                </pre>
              </>
            ) : (
              <pre className="whitespace-pre-wrap break-words text-foreground">
                {entry.content}
              </pre>
            )}
          </div>
        ))}

        <form
          onSubmit={handleSubmit}
          className="mt-4 flex items-center bg-transparent text-foreground"
        >
          {routePath()}
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="ml-1 flex-1 bg-transparent caret-accent-green text-foreground outline-none"
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;
