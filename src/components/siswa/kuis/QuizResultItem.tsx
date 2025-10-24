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
  questionNumber,
  question,
  isCorrect,
  onInfoClick,
}: QuizResultItemProps) {
  const bgColor = isCorrect
    ? "rgba(56, 102, 65, 0.75)"
    : "rgba(255, 0, 0, 0.75)";
  const borderColor = isCorrect ? "#386641" : "#FF0000";
  const icon = isCorrect ? "sentiment_satisfied" : "sentiment_dissatisfied";

  return (
    <div
      className="relative rounded-[20px] p-4 border-3 min-h-[88px] flex items-center gap-3"
      style={{
        backgroundColor: bgColor,
        borderWidth: "3px",
        borderColor: borderColor,
        borderStyle: "solid",
      }}
    >
      {/* Left Icon - Check or Sad */}
      <div className="w-[29px] h-[29px] bg-white rounded-full flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-[18px]" style={{ color: borderColor }}>
          {icon}
        </span>
      </div>

      {/* Question Text */}
      <p className="text-white text-[10px] leading-relaxed flex-1">
        {question}
      </p>

      {/* Info Icon - Right */}
      <button
        onClick={onInfoClick}
        className="w-[24px] h-[24px] bg-[#FFD93D] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#FFC700] active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-white text-[16px]">
          info
        </span>
      </button>

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
