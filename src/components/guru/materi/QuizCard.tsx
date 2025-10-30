"use client";

import React from "react";
import { Visibility, Delete } from "@mui/icons-material";

interface QuizCardProps {
  id: string;
  question: string;
  difficulty: "C1" | "C2" | "C3" | "C4" | "C5" | "C6";
  normalTime: number; // in minutes
  onPreview?: () => void;
  onDelete?: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  difficulty,
  normalTime,
  onPreview,
  onDelete,
}) => {
  return (
    <div className="relative bg-[#336d82] rounded-xl sm:rounded-2xl md:rounded-[18px] min-h-[160px] flex flex-col justify-between p-3 sm:p-3.5 md:p-4 shadow-lg hover:shadow-xl transition-shadow">
      {/* Question Text */}
      <div className="bg-white rounded-lg sm:rounded-xl md:rounded-[15px] p-3 sm:p-3.5 md:p-4 min-h-[60px] sm:min-h-[65px] md:min-h-[70px] flex items-center">
        <p className="text-[#336d82] text-xs sm:text-sm poppins-semibold leading-relaxed line-clamp-3">
          {question}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 mt-2 sm:mt-2.5 md:mt-3">
        {/* Difficulty and Time Info */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 flex-1">
          {/* Difficulty Badge */}
          <div className="bg-white rounded-lg sm:rounded-xl md:rounded-[15px] px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 flex items-center justify-between sm:justify-start gap-2">
            <span className="text-[#336d82] text-xs sm:text-sm poppins-semibold">
              KESULITAN
            </span>
            <span className="text-[#336d82] text-lg sm:text-xl poppins-bold">
              {difficulty}
            </span>
          </div>

          {/* Normal Time Badge */}
          <div className="bg-white rounded-lg sm:rounded-xl md:rounded-[15px] px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 flex items-center justify-between sm:justify-start gap-2">
            <span className="text-[#336d82] text-xs sm:text-sm poppins-semibold">
              WAKTU NORMAL
            </span>
            <span className="text-[#336d82] text-lg sm:text-xl poppins-bold">
              {normalTime} menit
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0 justify-center sm:justify-start">
          <button
            onClick={onPreview}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-[40px] md:h-[40px] bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-all hover:shadow-lg shadow-md"
            aria-label="Preview soal"
            title="Preview Soal"
          >
            <Visibility className="text-[#336d82]" sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </button>
          <button
            onClick={onDelete}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-[40px] md:h-[40px] bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-all hover:shadow-lg shadow-md group"
            aria-label="Delete quiz"
            title="Hapus Soal"
          >
            <Delete className="text-[#336d82] group-hover:text-[#ff1919]" sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
