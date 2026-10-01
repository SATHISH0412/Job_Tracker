import { NextRequest, NextResponse } from "next/server";
import { runSearch, SearchError } from "@/lib/search";
import {
  SEARCH_ERROR_CODES,
  getErrorMessage,
  type SearchErrorCode,
} from "@/lib/errors";

const MAX_BODY_BYTES = 100 * 1024; // 100 KB safety limit

/**
 * Maps application error codes to appropriate HTTP status codes.
 */
function getHttpStatusForErrorCode(code: SearchErrorCode): number {
  switch (code) {
    case SEARCH_ERROR_CODES.INVALID_INPUT:
    case SEARCH_ERROR_CODES.UNSUPPORTED_FILTER:
      return 400;
    case SEARCH_ERROR_CODES.AUTH_FAILURE:
      return 401;
    case SEARCH_ERROR_CODES.RATE_LIMIT_EXCEEDED:
      return 429;
    case SEARCH_ERROR_CODES.LINKEDIN_UNAVAILABLE:
    case SEARCH_ERROR_CODES.NETWORK_FAILURE:
      return 503;
    case SEARCH_ERROR_CODES.SERVER_ERROR:
    default:
      return 500;
  }
}

/**
 * `POST /api/linkedin/search`
 *
 * Receives filter inputs, re-validates server-side via lib/search.ts, and returns
 * a structured SearchResult containing the generated URL, normalized filters,
 * and an honest empty job list for V1.
 *
 * Implements ORIGINAL_PLAN.md section 6 and Plan 03 task 3.3.
 */
export async function POST(request: NextRequest): Promise<Response> {
  // 1. Guard against oversized bodies
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return NextResponse.json(
      {
        code: SEARCH_ERROR_CODES.INVALID_INPUT,
        message: "Request payload exceeds size limit.",
      },
      { status: 413 }
    );
  }

  // 2. Safe JSON parsing
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        code: SEARCH_ERROR_CODES.INVALID_INPUT,
        message: "Malformed JSON payload.",
      },
      { status: 400 }
    );
  }

  // 3. Delegate execution to pure orchestrator
  try {
    const result = runSearch(body);
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof SearchError) {
      const status = getHttpStatusForErrorCode(err.code);
      return NextResponse.json(
        {
          code: err.code,
          message: err.message,
        },
        { status }
      );
    }

    // Never leak stack trace, secrets, or internal details
    const fallback = getErrorMessage(SEARCH_ERROR_CODES.SERVER_ERROR);
    return NextResponse.json(
      {
        code: SEARCH_ERROR_CODES.SERVER_ERROR,
        message: fallback.message,
      },
      { status: 500 }
    );
  }
}
