"use client";

import React from "react";
import { Visibility, Edit, Delete } from "@mui/icons-material";
// import { Question } from "./QuestionSection";
import Image from "next/image";

interface SoalClusterCardProps {
  // question: Question;
  questionNumber: number;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SoalClusterCard({
  // question,
  questionNumber,
  onPreview,
  onEdit,
  onDelete,
}: SoalClusterCardProps) {
  return (
    <div className="bg-white rounded-lg border-2 border-[#336d82]/20 hover:border-[#336d82] hover:shadow-xl transition-all p-4 h-full flex flex-col">
      {/* Header - Compact */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white poppins-bold text-sm">{questionNumber}</span>
          </div>
          <div>
            <p className="text-[#336d82] text-xs poppins-semibold">
              Soal #{questionNumber}
            </p>
            <p className="text-gray-500 text-[10px] poppins-medium">
              {/* {question.questionType} • {question.answerType} */}
            </p>
          </div>
        </div>
        <span className="px-2 py-1 bg-[#fcc61d]/20 text-[#f5b800] text-[10px] poppins-semibold rounded">
          {/* {question.timeValue} {question.timeUnit} */}
        </span>
      </div>

      {/* Question Preview - Flexible */}
      <div className="mb-3 flex-1">
        {/* {question.questionFilePreview && ( */}
          <div className="mb-2 rounded-lg overflow-hidden">
            {/* <Image
              src={question.questionFilePreview}
              alt="Question preview"
              className="w-full h-24 object-cover"
            /> */}
          </div>
        <p className="text-gray-700 text-xs poppins-regular line-clamp-3 leading-relaxed">
          {/* {question.questionText || "Soal dengan gambar"} */}
        </p>
      </div>

      {/* Actions - Compact */}
      <div className="flex gap-1.5 pt-3 border-t border-gray-100">
        <button
          onClick={onPreview}
          className="flex-1 bg-[#336d82] hover:bg-[#2a5a6d] text-white py-1.5 rounded-lg poppins-semibold text-[11px] transition-colors flex items-center justify-center gap-1"
          title="Preview Soal"
        >
          <Visibility sx={{ fontSize: 16 }} />
          <span className="hidden sm:inline">Preview</span>
        </button>
        <button
          onClick={onEdit}
          className="flex-1 bg-[#fcc61d] hover:bg-[#f5b800] text-white py-1.5 rounded-lg poppins-semibold text-[11px] transition-colors flex items-center justify-center gap-1"
          title="Edit Soal"
        >
          <Edit sx={{ fontSize: 16 }} />
          <span className="hidden sm:inline">Edit</span>
        </button>
        <button
          onClick={onDelete}
          className="px-3 bg-[#ff1919] hover:bg-[#e01515] text-white py-1.5 rounded-lg poppins-semibold text-[11px] transition-colors flex items-center justify-center"
          title="Hapus Soal"
        >
          <Delete sx={{ fontSize: 16 }} />
        </button>
      </div>
    </div>
  );
}
