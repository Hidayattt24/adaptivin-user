interface IsiMateriCardProps {
  type: "pdf" | "video";
  title: string;
  classColor: string;
  onClick?: () => void;
}

export default function IsiMateriCard({
  type,
  title,
  classColor,
  onClick,
}: IsiMateriCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[10px] h-[84px] w-full flex items-center px-4 cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md border-2 border-transparent hover:border-opacity-20"
      style={{
        borderColor: classColor,
      }}
    >
      {/* Icon Circle */}
      <div
        className="w-[57px] h-[57px] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
        style={{ backgroundColor: classColor }}
      >
        {type === "pdf" ? (
          <span className="material-symbols-outlined text-white text-[27px]">
            picture_as_pdf
          </span>
        ) : (
          <span className="material-symbols-outlined text-white text-[28px]">
            play_circle
          </span>
        )}
      </div>

      {/* Title */}
      <div className="ml-4 flex-1">
        <p className="text-[#113a23] text-[12px] font-bold leading-tight">
          {title}
        </p>
      </div>

      {/* Arrow Indicator */}
      <div className="flex-shrink-0 ml-2">
        <span
          className="material-symbols-outlined text-[20px]"
          style={{ color: classColor }}
        >
          arrow_forward
        </span>
      </div>
    </div>
  );
}
