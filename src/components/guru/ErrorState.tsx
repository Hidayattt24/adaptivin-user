interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  compact?: boolean;
}

// SVG Alert Circle Icon
const AlertCircleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export function ErrorState({
  title = "Terjadi Kesalahan",
  message = "Gagal memuat data. Silakan coba lagi.",
  onRetry,
  compact = false,
}: ErrorStateProps) {
  if (compact) {
    return (
      <div
        className="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center justify-center gap-2 text-red-700 text-sm">
          <AlertCircleIcon className="w-4 h-4" />
          <span>{message}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline font-medium"
          >
            Coba Lagi
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircleIcon className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-[#336d82] text-white rounded-lg hover:bg-[#2a5a6d] transition-colors font-medium"
          >
            Coba Lagi
          </button>
        )}
      </div>
    </div>
  );
}
