export type WindowSlug = 'jobs' | 'about' | 'contact';

export const WINDOW_LABELS: Record<WindowSlug, string> = {
  jobs: 'jobs',
  about: 'about',
  contact: 'contact'
};

export const WINDOW_ALIASES: Record<WindowSlug, string[]> = {
  jobs: ['jobs', 'job', 'work'],
  about: ['about', 'bio', 'info'],
  contact: ['contact', 'reach', 'mail']
};

export const resolveWindowSlug = (value: string): WindowSlug | null => {
  const normalized = value.toLowerCase();

  return (
    (Object.entries(WINDOW_ALIASES).find(([, aliases]) =>
      aliases.includes(normalized)
    )?.[0] as WindowSlug | undefined) ?? null
  );
};
