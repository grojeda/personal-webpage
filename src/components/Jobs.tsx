import JobsBreadcrumb from './jobs/JobsBreadcrumb';
import JobsDirectoryGrid from './jobs/JobsDirectoryGrid';
import JobsFileViewer from './jobs/JobsFileViewer';
import { JobsViewMode } from './jobs/viewMode';
import type { JobDocument } from '../shared/jobs';

type JobsProps = {
  data: {
    jobs: JobDocument[];
    selectedFilename: string | null;
    onSelectJob: (filename: string | null) => void;
    viewMode: JobsViewMode;
    onChangeView: (mode: JobsViewMode) => void;
  };
};

const Jobs = ({ data }: JobsProps) => {
  const { jobs, selectedFilename, onSelectJob, viewMode, onChangeView } = data;
  const selectedJob =
    jobs.find((job) => job.filename === selectedFilename) ?? null;

  const openFile = (job: JobDocument) => {
    onSelectJob(job.filename);
    onChangeView(JobsViewMode.File);
  };

  const handleBack = () => {
    onChangeView(JobsViewMode.Directory);
    onSelectJob(null);
  };

  return (
    <div className="flex h-full flex-col text-sm text-foreground w-full">
      <JobsBreadcrumb
        mode={viewMode}
        filename={selectedFilename}
        onBack={viewMode === JobsViewMode.File ? handleBack : undefined}
      />

      {viewMode === JobsViewMode.Directory ? (
          <JobsDirectoryGrid
            jobs={jobs}
            selectedFilename={selectedFilename}
            onOpenJob={openFile}
          />
        ) : (
          <JobsFileViewer job={selectedJob} />
        )}
    </div>
  );
};

export default Jobs;
