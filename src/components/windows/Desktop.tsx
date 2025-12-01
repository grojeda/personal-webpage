import { useMemo, useState, type ComponentType } from 'react';
import Terminal from './Terminal';
import Window from './Window';
import Jobs from '../jobs/Jobs';
import { JobsViewMode } from '../jobs/viewMode';
import About, { type AboutData } from '../About';
import Contact, { type ContactEntry } from '../Contact';
import type { WindowSlug } from '../../shared/models/windows';
import { WINDOW_LABELS } from '../../shared/models/windows';
import rawWindowData from '../../config/windows.json';
import { jobDocuments, type JobDocument } from '../../shared/models/jobs';

const MAX_SECONDARY_WINDOWS = 3;

type JobsPanelData = {
  jobs: JobDocument[];
  selectedFilename: string | null;
  onSelectJob: (filename: string | null) => void;
  viewMode: JobsViewMode;
  onChangeView: (mode: JobsViewMode) => void;
};

type PanelDataMap = {
  jobs: JobsPanelData;
  about: AboutData;
  contact: ContactEntry[];
};

type PanelComponentProps<K extends WindowSlug> = {
  data: PanelDataMap[K];
};

type PanelConfig<K extends WindowSlug> = {
  Component: ComponentType<PanelComponentProps<K>>;
  data: PanelDataMap[K];
  getTitle?: (data: PanelDataMap[K]) => string;
};

const windowData = rawWindowData as Omit<PanelDataMap, 'jobs'>;

const Desktop = () => {
  const [openPanels, setOpenPanels] = useState<WindowSlug[]>([]);
  const [activeJobFilename, setActiveJobFilename] = useState<string | null>(
    null
  );
  const [jobsViewMode, setJobsViewMode] = useState<JobsViewMode>(
    JobsViewMode.Directory
  );

  const layout = useMemo(() => {
    const totalWindows = openPanels.length + 1;
    const baseClasses =
      'grid h-full min-h-0 w-full grid-cols-1 auto-rows-[minmax(0,1fr)] gap-4 transition-[grid-template-columns,grid-template-rows] duration-500 ease-out';

    if (totalWindows === 1) {
      return {
        grid: `${baseClasses} grid-rows-1`,
        terminal: 'col-span-1 row-span-1',
        panels: []
      };
    }

    if (totalWindows === 2) {
      return {
        grid: `${baseClasses} md:grid-cols-2 md:grid-rows-1`,
        terminal: 'md:col-start-1 md:row-start-1 md:row-span-1',
        panels: ['md:col-start-2 md:row-start-1']
      };
    }

    if (totalWindows === 3) {
      return {
        grid: `${baseClasses} md:grid-cols-2 md:grid-rows-2`,
        terminal: 'md:col-start-1 md:row-start-1 md:row-span-2',
        panels: [
          'md:col-start-2 md:row-start-1',
          'md:col-start-2 md:row-start-2'
        ]
      };
    }

    return {
      grid: `${baseClasses} md:grid-cols-2 md:grid-rows-2`,
      terminal: 'md:col-start-1 md:row-start-1 md:row-span-1',
      panels: [
        'md:col-start-2 md:row-start-1',
        'md:col-start-1 md:row-start-2',
        'md:col-start-2 md:row-start-2'
      ]
    };
  }, [openPanels.length]);

  const openPanel = (panel: WindowSlug) => {
    let replaced: WindowSlug | null = null;
    setOpenPanels((prev) => {
      if (prev.includes(panel)) return prev;

      const next = [...prev, panel];
      if (next.length > MAX_SECONDARY_WINDOWS) {
        replaced = next.shift() ?? null;
      }

      return next;
    });

    return replaced;
  };

  const closePanel = (panel: WindowSlug) => {
    setOpenPanels((prev) => prev.filter((item) => item !== panel));
  };

  const closeAllPanels = () => setOpenPanels([]);
  const handleSelectJob = (filename: string | null) => {
    setActiveJobFilename(filename);
  };

  const panelRegistry: { [K in WindowSlug]: PanelConfig<K> } = {
    jobs: {
      Component: Jobs,
      data: {
        jobs: jobDocuments,
        selectedFilename: activeJobFilename,
        onSelectJob: handleSelectJob,
        viewMode: jobsViewMode,
        onChangeView: setJobsViewMode
      },
      getTitle: ({ viewMode, selectedFilename }) => {
        if (viewMode === JobsViewMode.File && selectedFilename) {
          return `./jobs/${selectedFilename}`;
        }
        return './jobs';
      }
    },
    about: { Component: About, data: windowData.about },
    contact: { Component: Contact, data: windowData.contact }
  };

  return (
    <section className="box-border flex h-svh min-h-0 w-full items-stretch overflow-hidden px-4 py-6 md:px-6">
      <div className={`mx-auto h-full min-h-0 w-full ${layout.grid}`}>
        <Window
          title="terminal"
          className={`min-h-80 ${layout.terminal}`}
        >
          <Terminal
            openPanels={openPanels}
            onOpenPanel={openPanel}
            onClosePanel={closePanel}
            onCloseAll={closeAllPanels}
            jobFiles={jobDocuments}
            onSelectJob={handleSelectJob}
            onSetJobsViewMode={(mode) => {
              setJobsViewMode(mode);
              if (mode === JobsViewMode.Directory) {
                handleSelectJob(null);
              }
              if (mode === JobsViewMode.File && !openPanels.includes('jobs')) {
                openPanel('jobs');
              }
            }}
          />
        </Window>

        {openPanels.map((panel, index) => {
          const { Component, data, getTitle } = panelRegistry[panel];
          const placement = layout.panels[index] ?? '';
          const title = getTitle ? getTitle(data) : WINDOW_LABELS[panel];
          return (
            <Window
              key={panel}
              title={title}
              onClose={() => closePanel(panel)}
              className={`min-h-[280px] ${placement}`}
            >
              <Component data={data} />
            </Window>
          );
        })}
      </div>
    </section>
  );
};

export default Desktop;
