interface CircularProgressProps {
  correct: number;
  total: number;
  size?: number;
}

/**
 * Circular Progress Component
 *
 * Menampilkan progress melingkar dengan:
 * - Angka correct/total di tengah
 * - Circle progress bar
 */
export default function CircularProgress({
  correct,
  total,
  size = 100,
}: CircularProgressProps) {
  const percentage = total > 0 ? (correct / total) * 100 : 0;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#336D82"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Text in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p
          className="text-[#336D82] font-bold"
          style={{ fontSize: `${size / 3.5}px` }}
        >
          {correct}/{total}
        </p>
      </div>
    </div>
  );
}
