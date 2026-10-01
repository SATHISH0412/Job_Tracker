/**
 * Application error codes and user-facing error copy.
 *
 * Implements the error handling taxonomy from ORIGINAL_PLAN.md section 14.
 * Error copy is defined once here and reused across the UI and API handlers.
 * Internal details (stack traces, server configuration, credentials) are never exposed.
 */

export const SEARCH_ERROR_CODES = {
  INVALID_INPUT: "INVALID_INPUT",
  NETWORK_FAILURE: "NETWORK_FAILURE",
  LINKEDIN_UNAVAILABLE: "LINKEDIN_UNAVAILABLE",
  UNSUPPORTED_FILTER: "UNSUPPORTED_FILTER",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  AUTH_FAILURE: "AUTH_FAILURE",
  SERVER_ERROR: "SERVER_ERROR",
} as const;

export type SearchErrorCode =
  (typeof SEARCH_ERROR_CODES)[keyof typeof SEARCH_ERROR_CODES];

export interface ErrorDetails {
  readonly title: string;
  readonly message: string;
}

export const ERROR_MESSAGES: Readonly<Record<SearchErrorCode, ErrorDetails>> = {
  [SEARCH_ERROR_CODES.INVALID_INPUT]: {
    title: "Unable to create the LinkedIn search.",
    message: "Please check your filters and try again.",
  },
  [SEARCH_ERROR_CODES.NETWORK_FAILURE]: {
    title: "Network failure.",
    message: "Unable to connect to the service. Please check your network and try again.",
  },
  [SEARCH_ERROR_CODES.LINKEDIN_UNAVAILABLE]: {
    title: "LinkedIn unavailable.",
    message: "LinkedIn is temporarily unavailable. Please try again later.",
  },
  [SEARCH_ERROR_CODES.UNSUPPORTED_FILTER]: {
    title: "Unsupported filter.",
    message: "One or more selected filters are not supported. Please modify your search.",
  },
  [SEARCH_ERROR_CODES.RATE_LIMIT_EXCEEDED]: {
    title: "Rate limit reached.",
    message: "Too many requests. Please wait a moment before trying again.",
  },
  [SEARCH_ERROR_CODES.AUTH_FAILURE]: {
    title: "Authentication failure.",
    message: "Access was denied. Please authenticate and try again.",
  },
  [SEARCH_ERROR_CODES.SERVER_ERROR]: {
    title: "Server error.",
    message: "An internal error occurred. Please try again later.",
  },
};

/**
 * Type guard checking if a value is a recognised SearchErrorCode.
 */
export function isSearchErrorCode(value: unknown): value is SearchErrorCode {
  return (
    typeof value === "string" &&
    Object.values(SEARCH_ERROR_CODES).includes(value as SearchErrorCode)
  );
}

/**
 * Resolves a search error code to safe, user-friendly copy.
 * Always falls back to SERVER_ERROR so no internal exception details escape.
 */
export function getErrorMessage(code: unknown): ErrorDetails {
  if (isSearchErrorCode(code)) {
    return ERROR_MESSAGES[code];
  }
  return ERROR_MESSAGES[SEARCH_ERROR_CODES.SERVER_ERROR];
}
