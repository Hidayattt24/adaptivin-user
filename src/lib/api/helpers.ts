import type { AxiosResponse } from "axios";

export interface ApiSuccessResponse<T> {
  status: "success";
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  status: "error";
  message: string;
}

/**
 * Unwraps the standardized API response `{ status, message, data }`
 * and returns the inner `data` payload. Throws if the format is unexpected.
 */
export function unwrapApiResponse<T>(response: AxiosResponse<unknown>): T {
  const body = response?.data;

  if (!body) {
    throw new Error("Response body is empty");
  }

  // Type guard untuk ApiSuccessResponse
  if (
    typeof body === "object" &&
    body !== null &&
    "status" in body &&
    body.status === "success" &&
    "data" in body
  ) {
    return (body as ApiSuccessResponse<T>).data;
  }

  // Fallback untuk legacy responses tanpa wrapper
  if (typeof body === "object" && body !== null && "data" in body) {
    return (body as { data: T }).data;
  }

  throw new Error("Unexpected API response format");
}
