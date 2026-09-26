/**
 * The only module permitted to read `process.env`.
 *
 * Nothing here is required for V1 — the search flow needs no secrets. The
 * names are reserved now (`ORIGINAL_PLAN.md` section 15) so that persistence
 * (`05`), AI matching (`08`), and the access gate (`04`) do not have to
 * introduce a new naming scheme later.
 *
 * Never import this from a Client Component. Next.js inlines only
 * `NEXT_PUBLIC_*` variables into the browser bundle, so a client import would
 * silently see every value here as `undefined` rather than leaking it.
 */

const ENVIRONMENT_VARIABLE_NAMES = [
  "DATABASE_URL",
  "LINKEDIN_API_KEY",
  "GEMINI_API_KEY",
  "OPENROUTER_API_KEY",
  "AUTH_SECRET",
] as const;

export type EnvironmentVariableName =
  (typeof ENVIRONMENT_VARIABLE_NAMES)[number];

export class MissingEnvironmentVariableError extends Error {
  readonly variableName: EnvironmentVariableName;

  constructor(variableName: EnvironmentVariableName) {
    super(
      `Missing required environment variable: ${variableName}. ` +
        `Add it to .env.local — see .env.example.`,
    );
    this.name = "MissingEnvironmentVariableError";
    this.variableName = variableName;
  }
}

export function isEnvironmentVariableName(
  value: string,
): value is EnvironmentVariableName {
  return (ENVIRONMENT_VARIABLE_NAMES as readonly string[]).includes(value);
}

/**
 * Returns the variable's value, or `undefined` when it is unset or empty.
 * Treats an empty string as unset so a blank `.env.local` line behaves the
 * same as a missing one.
 */
export function readEnvironmentVariable(
  name: EnvironmentVariableName,
): string | undefined {
  const value = process.env[name];
  return value === undefined || value.trim() === "" ? undefined : value;
}

/**
 * Returns the variable's value, or throws `MissingEnvironmentVariableError`.
 * Use this only for variables the calling code genuinely cannot proceed
 * without.
 */
export function requireEnvironmentVariable(
  name: EnvironmentVariableName,
): string {
  const value = readEnvironmentVariable(name);

  if (value === undefined) {
    throw new MissingEnvironmentVariableError(name);
  }

  return value;
}
