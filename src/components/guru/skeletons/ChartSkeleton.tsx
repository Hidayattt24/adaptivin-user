export function ChartSkeleton() {
  // Fixed heights to avoid hydration mismatch
  const barHeights = [85, 70, 60, 75, 90, 65];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="flex items-end justify-between gap-4 h-64">
        {barHeights.map((height, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-200 rounded-t"
            style={{
              height: `${height}%`,
            }}
          ></div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}
