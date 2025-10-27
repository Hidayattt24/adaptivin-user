"use client";

import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface QuizCardProps {
  id: string;
  question: string;
  difficulty: "C1" | "C2" | "C3" | "C4" | "C5" | "C6";
  normalTime: number; // in minutes
  onEdit?: () => void;
  onDelete?: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  difficulty,
  normalTime,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="relative bg-[#336d82] rounded-[20px] min-h-[242px] flex flex-col justify-between p-6 shadow-lg hover:shadow-xl transition-shadow">
      {/* Question Text */}
      <div className="bg-white rounded-[20px] p-6 min-h-[104px] flex items-center">
        <p className="text-[#336d82] text-base poppins-semibold leading-relaxed">
          {question}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between gap-4 mt-4">
        {/* Difficulty and Time Info */}
        <div className="flex items-center gap-4">
          {/* Difficulty Badge */}
          <div className="bg-white rounded-[20px] px-6 py-3 flex items-center gap-3">
            <span className="text-[#336d82] text-xl poppins-semibold">
              KESULITAN
            </span>
            <span className="text-[#336d82] text-3xl poppins-bold">
              {difficulty}
            </span>
          </div>

          {/* Normal Time Badge */}
          <div className="bg-white rounded-[20px] px-6 py-3 flex items-center gap-3">
            <span className="text-[#336d82] text-xl poppins-semibold">
              WAKTU NORMAL
            </span>
            <span className="text-[#336d82] text-3xl poppins-bold">
              {normalTime} menit
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={onEdit}
            className="w-[49px] h-[49px] bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-all hover:shadow-lg shadow-md"
            aria-label="Edit quiz"
          >
            <EditIcon className="text-[#336d82]" sx={{ fontSize: 24 }} />
          </button>
          <button
            onClick={onDelete}
            className="w-[49px] h-[49px] bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-all hover:shadow-lg shadow-md"
            aria-label="Delete quiz"
          >
            <DeleteIcon className="text-[#336d82]" sx={{ fontSize: 24 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
