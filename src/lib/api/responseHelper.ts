/**
 * API Response Helper for Frontend Siswa
 * Menangani response dari backend dengan struktur:
 * {
 *   success: true,
 *   status: "success",
 *   message: "...",
 *   data: {...}
 * }
 */

import { AxiosResponse } from "axios";

interface ApiResponse<T = unknown> {
  success: boolean;
  status: "success" | "error";
  message: string;
  data: T | null;
}

// Legacy response format (backward compatibility)
interface LegacyApiResponse<T = unknown> {
  status: "success" | "error";
  message: string;
  data: T;
}

/**
 * Extract data dari response API
 * Menangani berbagai format response untuk backward compatibility
 */
export function extractData<T>(response: AxiosResponse): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = response.data as any;

  // Format baru dengan success field
  // { success: true, status: "success", data: {...}, message }
  if ("success" in body && body.success === true) {
    const apiResponse = body as ApiResponse<T>;

    if (apiResponse.status !== "success") {
      throw new Error(apiResponse.message || "API request failed");
    }

    if (apiResponse.data === null || apiResponse.data === undefined) {
      throw new Error("No data returned from API");
    }

    return apiResponse.data;
  }

  // Format lama tanpa success field
  // { status: "success", data: {...}, message }
  if ("status" in body && body.status === "success" && "data" in body) {
    const legacyResponse = body as LegacyApiResponse<T>;

    if (legacyResponse.data === null || legacyResponse.data === undefined) {
      throw new Error("No data returned from API");
    }

    return legacyResponse.data;
  }

  // Error response
  if ("status" in body && body.status === "error") {
    throw new Error(body.message || "API request failed");
  }

  // Unexpected format
  throw new Error("Unexpected response format");
}

/**
 * Cek apakah response sukses (untuk operations yang tidak return data)
 */
export function isSuccess(response: AxiosResponse): boolean {
  const apiResponse = response.data as ApiResponse<unknown>;
  return apiResponse.success === true && apiResponse.status === "success";
}

/**
 * Extract message dari response
 */
export function extractMessage(response: AxiosResponse): string {
  const apiResponse = response.data as ApiResponse<unknown>;
  return apiResponse.message || "";
}

/**
 * Format error message dari error response
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const apiResponse = error as ApiResponse<unknown>;
    return apiResponse.message || "An error occurred";
  }

  return "An unknown error occurred";
}
