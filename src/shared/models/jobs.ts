type JobPeriod = {
  from: string;
  to: string;
};

type GenericPeriod = Record<string, unknown> & Partial<JobPeriod>;

type JobDetails = {
  period?: GenericPeriod;
  [key: string]: unknown;
};

export type JobDocument = JobDetails & {
  filename: string;
  raw: string;
  period: GenericPeriod & JobPeriod;
};

const jobRawModules = import.meta.glob('../../data/jobs/*.yml', {
  eager: true,
  import: 'default',
  query: '?raw'
}) as Record<string, string>;

type Container =
  | { type: 'object'; value: Record<string, unknown> }
  | { type: 'array'; value: unknown[] };

const parseSimpleYaml = (raw: string): JobDetails => {
  const lines = raw.split(/\r?\n/);
  const root: Record<string, unknown> = {};
  const stack: { indent: number; container: Container }[] = [
    { indent: -1, container: { type: 'object', value: root } }
  ];

  const findNextMeaningfulLine = (start: number) => {
    for (let i = start; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line || !line.trim()) continue;
      const trimmed = line.trim();
      if (trimmed.startsWith('#')) continue;
      const indent = line.match(/^\s*/)![0].length;
      return { trimmed, indent };
    }
    return null;
  };

  const pushContainer = (indent: number, container: Container) => {
    stack.push({ indent, container });
  };

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    if (!line || !line.trim()) continue;
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) continue;

    const indent = line.match(/^\s*/)![0].length;
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const current = stack[stack.length - 1];
    if (!current) throw new Error('Invalid YAML structure');

    if (trimmed.startsWith('- ')) {
      if (current.container.type !== 'array') {
        throw new Error('Unexpected list item outside an array block');
      }
      current.container.value.push(trimmed.slice(2).trim());
      continue;
    }

    const [rawKey, ...rest] = trimmed.split(':');
    const key = rawKey.trim();
    const valuePart = rest.join(':').trim();

    if (valuePart === '') {
      const nextLine = findNextMeaningfulLine(lineIndex + 1);
      const isArray =
        nextLine !== null &&
        nextLine.indent > indent &&
        nextLine.trimmed.startsWith('- ');
      const containerValue = isArray ? [] : {};

      if (current.container.type !== 'object') {
        throw new Error('Nested block inside non-object container');
      }

      (current.container.value as Record<string, unknown>)[key] = containerValue;

      const child: Container = isArray
        ? { type: 'array', value: containerValue as unknown[] }
        : { type: 'object', value: containerValue as Record<string, unknown> };
      pushContainer(indent, child);
      continue;
    }

    if (current.container.type !== 'object') {
      throw new Error('Key-value pair inside array container');
    }

    (current.container.value as Record<string, unknown>)[key] = valuePart;
  }

  return root as JobDetails;
};

const pickString = (source: GenericPeriod | undefined, keys: string[]) => {
  if (!source) return '';
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
};

const normalizePeriod = (period: GenericPeriod | undefined): JobPeriod => {
  return {
    from: pickString(period, ['from', 'start']),
    to: pickString(period, ['to', 'end'])
  };
};

const parsePeriodValue = (value: string) => {
  if (!value) return Number.NaN;
  if (value.toLowerCase() === 'present') {
    return Number.MAX_SAFE_INTEGER;
  }
  const parsed = Date.parse(`${value}-01T00:00:00Z`);
  return Number.isNaN(parsed) ? Number.NaN : parsed;
};

const getSortValue = (job: JobDocument) => {
  const toValue = parsePeriodValue(job.period.to);
  if (!Number.isNaN(toValue)) {
    return toValue;
  }

  const fromValue = parsePeriodValue(job.period.from);
  if (!Number.isNaN(fromValue)) {
    return fromValue;
  }

  return 0;
};

const sortByPeriodDesc = (a: JobDocument, b: JobDocument) =>
  getSortValue(b) - getSortValue(a);

export const jobDocuments: JobDocument[] = Object.entries(jobRawModules)
  .map(([path, raw]) => {
    const filename = path.split('/').pop() ?? path;
    const parsed = parseSimpleYaml(raw);
    const period = normalizePeriod(parsed.period);
    return {
      filename,
      raw,
      ...parsed,
      period: {
        ...(parsed.period ?? {}),
        ...period
      }
    };
  })
  .sort(sortByPeriodDesc);
