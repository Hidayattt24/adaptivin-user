import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
          <PictureAsPdfIcon sx={{ color: "white", fontSize: "27px" }} />
        ) : (
          <PlayCircleIcon sx={{ color: "white", fontSize: "28px" }} />
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
        <ArrowForwardIcon
          sx={{
            color: classColor,
            fontSize: "20px",
          }}
        />
      </div>
    </div>
  );
}
