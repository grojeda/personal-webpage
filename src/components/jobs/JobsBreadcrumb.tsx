import { JobsViewMode } from './viewMode';

type JobsBreadcrumbProps = {
  mode: JobsViewMode;
  filename: string | null;
  onBack?: () => void;
};

const JobsBreadcrumb = ({ mode, onBack }: JobsBreadcrumbProps) => {
  const isFileView = mode === JobsViewMode.File;

  return (
    <div className="mb-3 flex items-center text-xs font-mono text-muted">
      <div className="flex justify-between w-full items-center px-2 mb-2">
        {isFileView && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer uppercase tracking-[0.3em] text-accent-green transition hover:text-foreground"
          >
            ← back to directory
          </button>
        )}
      </div>
    </div>
  );
};

export default JobsBreadcrumb;
