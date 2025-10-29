"use client";

import React from "react";
import { Close, AccessTime, Image as ImageIcon } from "@mui/icons-material";
import { Question } from "./QuestionSection";

interface QuestionPreviewModalProps {
  isOpen: boolean;
  question: Question | null;
  questionNumber: number;
  onClose: () => void;
}

const bloomLabels = {
  C1: "C1 - Mengingat",
  C2: "C2 - Memahami",
  C3: "C3 - Menerapkan",
  C4: "C4 - Menganalisis",
  C5: "C5 - Mengevaluasi",
  C6: "C6 - Mencipta",
};

export function QuestionPreviewModal({
  isOpen,
  question,
  questionNumber,
  onClose,
}: QuestionPreviewModalProps) {
  if (!isOpen || !question) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#336d82] to-[#2a5a6d] px-8 py-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-white text-2xl poppins-bold">
              Preview Soal Nomor {questionNumber}
            </h2>
            <p className="text-white/80 text-sm poppins-medium mt-1">
              {bloomLabels[question.questionType]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
          >
            <Close sx={{ fontSize: 24, color: "white" }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Question Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#336d82] rounded-xl flex items-center justify-center">
                <span className="text-white poppins-bold">?</span>
              </div>
              <h3 className="text-[#336d82] text-xl poppins-semibold">
                Pertanyaan
              </h3>
            </div>

            {/* Question Image */}
            {question.questionFilePreview && (
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-3 text-gray-600">
                  <ImageIcon sx={{ fontSize: 20 }} />
                  <span className="text-sm poppins-medium">Gambar Soal</span>
                </div>
                <img
                  src={question.questionFilePreview}
                  alt="Question"
                  className="w-full rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Question Text */}
            {question.questionText && (
              <div className="bg-gradient-to-br from-[#336d82]/5 to-white rounded-xl p-6 border-2 border-[#336d82]/20">
                <p className="text-gray-800 text-base poppins-medium leading-relaxed whitespace-pre-wrap">
                  {question.questionText}
                </p>
              </div>
            )}
          </div>

          {/* Answer Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#2ea062] rounded-xl flex items-center justify-center">
                <span className="text-white poppins-bold">✓</span>
              </div>
              <h3 className="text-[#2ea062] text-xl poppins-semibold">
                Jawaban ({question.answerType})
              </h3>
            </div>

            {/* Answer Image */}
            {question.answerFilePreview && (
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-3 text-gray-600">
                  <ImageIcon sx={{ fontSize: 20 }} />
                  <span className="text-sm poppins-medium">Gambar Jawaban</span>
                </div>
                <img
                  src={question.answerFilePreview}
                  alt="Answer"
                  className="w-full rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Answer Text */}
            {question.answerText && (
              <div className="bg-gradient-to-br from-[#2ea062]/5 to-white rounded-xl p-6 border-2 border-[#2ea062]/20">
                <p className="text-gray-800 text-base poppins-medium leading-relaxed whitespace-pre-wrap">
                  {question.answerText}
                </p>
              </div>
            )}
          </div>

          {/* Time Limit */}
          <div className="bg-gradient-to-r from-[#fcc61d]/10 to-[#f5b800]/10 rounded-xl p-6 border-2 border-[#fcc61d]/30">
            <div className="flex items-center gap-3">
              <AccessTime sx={{ fontSize: 32, color: "#f5b800" }} />
              <div>
                <p className="text-gray-600 text-sm poppins-medium">
                  Waktu Menjawab
                </p>
                <p className="text-[#f5b800] text-2xl poppins-bold">
                  {question.timeValue} {question.timeUnit}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-8 py-4 border-t-2 border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-[#336d82] hover:bg-[#2a5a6d] text-white py-3 rounded-xl poppins-semibold transition-colors shadow-md"
          >
            Tutup Preview
          </button>
        </div>
      </div>
    </div>
  );
}
