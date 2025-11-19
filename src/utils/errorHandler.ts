import Swal from "sweetalert2";

/**
 * Extract user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return "Terjadi kesalahan yang tidak diketahui";

  // Axios error
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string; error?: string } } }).response;
    if (response?.data?.message) return response.data.message;
    if (response?.data?.error) return response.data.error;
  }

  // Error object
  if (error instanceof Error) {
    return error.message;
  }

  // String error
  if (typeof error === "string") {
    return error;
  }

  return "Terjadi kesalahan yang tidak diketahui";
}

/**
 * Show user-friendly error alert with retry option
 */
export async function showErrorAlert(
  error: unknown,
  options?: {
    title?: string;
    showRetry?: boolean;
    onRetry?: () => void;
  }
): Promise<boolean> {
  const message = getErrorMessage(error);
  const title = options?.title || "Terjadi Kesalahan";
  const showRetry = options?.showRetry ?? false;

  const result = await Swal.fire({
    icon: "error",
    title,
    html: `
      <div class="text-left">
        <p class="text-gray-700 mb-4">${message}</p>
        ${showRetry ? '<p class="text-sm text-gray-500">Anda dapat mencoba lagi atau kembali ke halaman sebelumnya.</p>' : ''}
      </div>
    `,
    showCancelButton: showRetry,
    confirmButtonText: showRetry ? "Coba Lagi" : "Tutup",
    cancelButtonText: "Kembali",
    confirmButtonColor: "#336d82",
    cancelButtonColor: "#6b7280",
    allowOutsideClick: false,
  });

  if (result.isConfirmed && options?.onRetry) {
    options.onRetry();
    return true;
  }

  if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
    window.history.back();
  }

  return false;
}

/**
 * Show success alert with auto-close
 */
export async function showSuccessAlert(
  message: string,
  options?: {
    title?: string;
    timer?: number;
  }
): Promise<void> {
  await Swal.fire({
    icon: "success",
    title: options?.title || "Berhasil!",
    text: message,
    confirmButtonColor: "#336d82",
    timer: options?.timer || 2000,
    showConfirmButton: !options?.timer,
  });
}

/**
 * Handle API error with user-friendly message
 */
export function handleApiError(error: unknown, context?: string): void {
  const message = getErrorMessage(error);
  const title = context ? `Gagal ${context}` : "Terjadi Kesalahan";

  // Don't log to console in production
  if (process.env.NODE_ENV === "development") {
    console.error(`[${title}]`, error);
  }

  Swal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonColor: "#336d82",
  });
}

/**
 * Wrapper for async operations with error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options?: {
    context?: string;
    showRetry?: boolean;
    onError?: (error: unknown) => void;
  }
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (options?.onError) {
      options.onError(error);
    } else {
      await showErrorAlert(error, {
        title: options?.context,
        showRetry: options?.showRetry,
        onRetry: options?.showRetry ? () => withErrorHandling(fn, options) : undefined,
      });
    }
    return null;
  }
}

