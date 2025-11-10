interface QuizResultItemProps {
  questionNumber: number;
  question: string;
  isCorrect: boolean;
  onInfoClick: () => void;
}

/**
 * Quiz Result Item Component
 *
 * Menampilkan item hasil kuis dengan:
 * - Background hijau (benar) atau merah (salah)
 * - Icon checkmark atau sad face
 * - Text soal
 * - Icon info untuk melihat detail
 */
export default function QuizResultItem({
  question,
  isCorrect,
  onInfoClick,
}: QuizResultItemProps) {
  const bgGradient = isCorrect
    ? "linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.9) 100%)"
    : "linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)";
  const borderColor = isCorrect ? "#22c55e" : "#ef4444";
  const icon = isCorrect ? "check_circle" : "cancel";
  const shadowColor = isCorrect
    ? "0 4px 14px 0 rgba(34, 197, 94, 0.39)"
    : "0 4px 14px 0 rgba(239, 68, 68, 0.39)";

  return (
    <div
      className="relative rounded-[20px] p-4 min-h-[88px] md:min-h-[100px] flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group overflow-hidden"
      style={{
        background: bgGradient,
        borderWidth: "2px",
        borderColor: borderColor,
        borderStyle: "solid",
        boxShadow: shadowColor,
      }}
      onClick={onInfoClick}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-32 h-32 bg-white rounded-full -top-16 -left-16" />
        <div className="absolute w-24 h-24 bg-white rounded-full -bottom-12 -right-12" />
      </div>

      {/* Left Icon - Check or Cancel */}
      <div className="relative w-[29px] h-[29px] md:w-[35px] md:h-[35px] bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
        <span
          className="material-symbols-outlined text-[18px] md:text-[22px] font-bold"
          style={{ color: borderColor }}
        >
          {icon}
        </span>
      </div>

      {/* Question Text */}
      <p className="relative text-white text-[10px] md:text-[12px] leading-relaxed flex-1 font-medium">
        {question.length > 80 ? question.substring(0, 80) + "..." : question}
      </p>

      {/* Info Icon - Right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onInfoClick();
        }}
        className="relative w-[24px] h-[24px] md:w-[28px] md:h-[28px] bg-gradient-to-br from-[#FFD93D] to-[#FFC700] rounded-full flex items-center justify-center flex-shrink-0 hover:scale-110 active:scale-95 transition-all shadow-lg group/btn"
      >
        <span className="material-symbols-outlined text-white text-[16px] md:text-[18px] group-hover/btn:rotate-12 transition-transform">
          info
        </span>
        {/* Pulse Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-yellow-300 animate-ping opacity-75" />
      </button>

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
