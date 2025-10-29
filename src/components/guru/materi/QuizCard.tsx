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
    <div className="relative bg-[#336d82] rounded-[18px] min-h-[160px] flex flex-col justify-between p-4 shadow-lg hover:shadow-xl transition-shadow">
      {/* Question Text */}
      <div className="bg-white rounded-[15px] p-4 min-h-[70px] flex items-center">
        <p className="text-[#336d82] text-sm poppins-semibold leading-relaxed">
          {question}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between gap-3 mt-3">
        {/* Difficulty and Time Info */}
        <div className="flex items-center gap-3">
          {/* Difficulty Badge */}
          <div className="bg-white rounded-[15px] px-4 py-2 flex items-center gap-2">
            <span className="text-[#336d82] text-sm poppins-semibold">
              KESULITAN
            </span>
            <span className="text-[#336d82] text-xl poppins-bold">
              {difficulty}
            </span>
          </div>

          {/* Normal Time Badge */}
          <div className="bg-white rounded-[15px] px-4 py-2 flex items-center gap-2">
            <span className="text-[#336d82] text-sm poppins-semibold">
              WAKTU NORMAL
            </span>
            <span className="text-[#336d82] text-xl poppins-bold">
              {normalTime} menit
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onPreview}
            className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-all hover:shadow-lg shadow-md"
            aria-label="Preview soal"
            title="Preview Soal"
          >
            <Visibility className="text-[#336d82]" sx={{ fontSize: 20 }} />
          </button>
          <button
            onClick={onDelete}
            className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-all hover:shadow-lg shadow-md group"
            aria-label="Delete quiz"
            title="Hapus Soal"
          >
            <Delete className="text-[#336d82] group-hover:text-[#ff1919]" sx={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
