export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="flex items-end justify-between gap-4 h-64">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-200 rounded-t"
            style={{
              height: `${Math.random() * 60 + 40}%`,
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
