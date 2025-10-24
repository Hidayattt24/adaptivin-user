interface VideoRecommendationCardProps {
  title: string;
  topic: string; // e.g., "Kelas 4"
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
}

/**
 * Video Recommendation Card Component
 *
 * Menampilkan rekomendasi video pembelajaran dengan:
 * - YouTube branding
 * - Thumbnail dengan play button overlay
 * - Title dan description
 * - Click to open video
 */
export default function VideoRecommendationCard({
  title,
  topic,
  description,
  thumbnailUrl,
  videoUrl,
}: VideoRecommendationCardProps) {
  const handleVideoClick = () => {
    // Open YouTube video in new tab
    window.open(videoUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-lg">
      {/* YouTube Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white">
        <div className="w-[32px] h-[22px] bg-red-600 rounded flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="w-[18px] h-[18px]"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="text-[#282828] text-[14px] font-semibold">
          Youtube
        </span>
      </div>

      {/* Video Thumbnail */}
      <div
        className="relative w-full h-[200px] bg-[#336D82] cursor-pointer group"
        onClick={handleVideoClick}
      >
        {/* Thumbnail Image - Using placeholder for MVP */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-[48px] mb-2">📚</div>
            <p className="text-white text-[14px] font-medium px-4">
              {title}
            </p>
          </div>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[68px] h-[68px] bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-[32px] h-[32px] ml-1"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>

      {/* Video Info */}
      <div className="px-4 py-4">
        {/* Title */}
        <h3 className="text-[#336D82] text-[14px] font-semibold mb-2">
          {title}
        </h3>

        {/* Topic Badge */}
        <div className="inline-block mb-3">
          <div className="bg-[#336D82] rounded-[10px] px-3 py-1">
            <span className="text-white text-[10px] font-medium">{topic}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#666666] text-[11px] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
