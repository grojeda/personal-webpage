import type { JobDocument } from '../../shared/jobs';
import FileIcon from '../icons/FileIcon';

type JobsDirectoryGridProps = {
  jobs: JobDocument[];
  selectedFilename: string | null;
  onOpenJob: (job: JobDocument) => void;
};

const JobsDirectoryGrid = ({ jobs, selectedFilename, onOpenJob }: JobsDirectoryGridProps) => {
  return (
    <div className="grid auto-rows-[140px] grid-cols-2 gap-4 md:grid-cols-3">
      {jobs.map((job) => {
        const isActive = job.filename === selectedFilename;

        return (
          <div
            key={job.filename}
            onClick={() => onOpenJob(job)}
            className={`group border-border/60 bg-panel/30 hover:border-accent-green hover:bg-panel/60 flex h-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-4 text-center transition ${isActive ? 'border-accent-green text-accent-green' : ''} `}
          >
            <FileIcon className="text-accent-blue h-10 w-8" />
            <span className="text-foreground mt-2 line-clamp-2 font-mono text-xs tracking-wide">
              {job.filename}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default JobsDirectoryGrid;
