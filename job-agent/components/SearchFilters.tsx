import {
  EXPERIENCE_LEVEL_OPTIONS,
  WORK_ARRANGEMENT_OPTIONS,
  JOB_TYPE_OPTIONS,
  DATE_POSTED_OPTIONS,
  type ExperienceLevel,
  type WorkArrangement,
  type JobType,
  type DatePosted,
} from "@/types/job";

interface FilterConfig {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly options: readonly string[];
  readonly error?: string;
  readonly onChange: (value: string) => void;
}

interface FilterSelectProps {
  readonly config: FilterConfig;
  readonly disabled?: boolean;
}

function FilterSelect({ config, disabled }: FilterSelectProps) {
  const hasError = Boolean(config.error);
  const errorId = `${config.id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={config.id}
        className="text-sm font-medium text-foreground"
      >
        {config.label}
      </label>
      <select
        id={config.id}
        name={config.id}
        value={config.value}
        disabled={disabled}
        aria-invalid={hasError ? "true" : undefined}
        aria-describedby={hasError ? errorId : undefined}
        onChange={(event) => config.onChange(event.target.value)}
        className={`h-11 w-full rounded-md border bg-background px-3 text-base text-foreground sm:text-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${
          hasError
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-foreground/20 focus:border-foreground focus:ring-foreground"
        }`}
      >
        {config.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {hasError && (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
          {config.error}
        </p>
      )}
    </div>
  );
}

export interface SearchFiltersProps {
  readonly experienceLevel: ExperienceLevel;
  readonly onExperienceLevelChange: (value: ExperienceLevel) => void;
  readonly workArrangement: WorkArrangement;
  readonly onWorkArrangementChange: (value: WorkArrangement) => void;
  readonly jobType: JobType;
  readonly onJobTypeChange: (value: JobType) => void;
  readonly datePosted: DatePosted;
  readonly onDatePostedChange: (value: DatePosted) => void;
  readonly disabled?: boolean;
  readonly errors?: {
    readonly experienceLevel?: string;
    readonly workArrangement?: string;
    readonly jobType?: string;
    readonly datePosted?: string;
  };
}

/**
 * Filter select inputs for the search form.
 *
 * Implements the four select fields defined in ORIGINAL_PLAN.md section 9:
 * Experience Level, Work arrangement / Remote, Job Type, Date Posted.
 * Generic component mapping over option arrays from types/job.ts.
 */
export default function SearchFilters({
  experienceLevel,
  onExperienceLevelChange,
  workArrangement,
  onWorkArrangementChange,
  jobType,
  onJobTypeChange,
  datePosted,
  onDatePostedChange,
  disabled = false,
  errors,
}: SearchFiltersProps) {
  const configs: readonly FilterConfig[] = [
    {
      id: "experience-level",
      label: "Experience Level",
      value: experienceLevel,
      options: EXPERIENCE_LEVEL_OPTIONS,
      error: errors?.experienceLevel,
      onChange: (val) => onExperienceLevelChange(val as ExperienceLevel),
    },
    {
      id: "work-arrangement",
      label: "Remote",
      value: workArrangement,
      options: WORK_ARRANGEMENT_OPTIONS,
      error: errors?.workArrangement,
      onChange: (val) => onWorkArrangementChange(val as WorkArrangement),
    },
    {
      id: "job-type",
      label: "Job Type",
      value: jobType,
      options: JOB_TYPE_OPTIONS,
      error: errors?.jobType,
      onChange: (val) => onJobTypeChange(val as JobType),
    },
    {
      id: "date-posted",
      label: "Date Posted",
      value: datePosted,
      options: DATE_POSTED_OPTIONS,
      error: errors?.datePosted,
      onChange: (val) => onDatePostedChange(val as DatePosted),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {configs.map((config) => (
        <FilterSelect key={config.id} config={config} disabled={disabled} />
      ))}
    </div>
  );
}
