import React from "react";
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

/**
 * Quiz Progress Component
 *
 * Menampilkan progress bar untuk kuis dengan:
 * - Progress bar hijau yang menunjukkan kemajuan
 * - Icon buku di sebelah kanan
 */
export default function QuizProgress({ currentQuestion, totalQuestions }: QuizProgressProps) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="relative w-full h-[28px] bg-white rounded-[20px] shadow-lg overflow-hidden">
      {/* Progress Bar with Smooth Animation */}
      <div
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#2EA062] to-[#3BC97A] rounded-[20px] transition-all duration-700 ease-in-out"
        style={{
          width: `${progressPercentage}%`,
          minWidth: progressPercentage > 0 ? '25px' : '0',
        }}
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>

      {/* Book Icon */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-[20px] h-[20px] flex items-center justify-center z-10">
        <MenuBookIcon sx={{ color: '#336D82', fontSize: '18px', filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))' }} />
      </div>
    </div>
  );
}
