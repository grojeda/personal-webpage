import type { ReactNode } from 'react';
import type { JobDocument } from '../../shared/jobs';

type JobsFileViewerProps = {
  job: JobDocument | null;
};

const KEY_CLASS = 'text-accent-blue';
const VALUE_CLASS = 'text-accent-green';
const DASH_CLASS = 'text-accent-peach';

const renderHighlightedYaml = (raw: string): ReactNode[] => {
  return raw.split(/\r?\n/).map((line, index) => {
    const keyValueMatch = line.match(/^(\s*)(- )?([^:]+):(.*)$/);
    if (keyValueMatch) {
      const [, indent = '', dash = '', key = '', rest = ''] = keyValueMatch;
      const value = rest.trim();
      return (
        <span key={`kv-${index}`}>
          {indent}
          {dash && <span className={DASH_CLASS}>{dash}</span>}
          <span className={KEY_CLASS}>{key.trim()}</span>
          <span className="text-muted">:</span>
          {value && (
            <>
              {' '}
              <span className={VALUE_CLASS}>{value}</span>
            </>
          )}
          {'\n'}
        </span>
      );
    }

    const listMatch = line.match(/^(\s*)- (.*)$/);
    if (listMatch) {
      const [, indent = '', content = ''] = listMatch;
      return (
        <span key={`list-${index}`}>
          {indent}
          <span className={DASH_CLASS}>- </span>
          <span className={VALUE_CLASS}>{content}</span>
          {'\n'}
        </span>
      );
    }

    return (
      <span key={`plain-${index}`}>
        {line}
        {'\n'}
      </span>
    );
  });
};

const JobsFileViewer = ({ job }: JobsFileViewerProps) => {
  if (!job) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border/70 p-8 text-center text-muted">
        Select a file from the directory or run{' '}
        <code className="font-mono text-foreground">jobs view &lt;file&gt;</code>.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-panel/40">
      <header className="border-b border-border/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted">
        {job.filename}
      </header>
      <pre className="scroll-shell flex-1 overflow-auto whitespace-pre-wrap break-words bg-transparent px-4 py-3 font-mono text-sm text-foreground">
        {renderHighlightedYaml(job.raw)}
      </pre>
    </div>
  );
};

export default JobsFileViewer;
