"use client";

import React from "react";
import { Close, AccessTime, Image as ImageIcon, Info } from "@mui/icons-material";
import { Question } from "./QuestionSection";
import Image from "next/image";

interface QuestionPreviewModalProps {
  isOpen: boolean;
  question: Question | null;
  questionNumber: number;
  onClose: () => void;
}

const bloomLabels: Record<Question["questionType"], string> = {
  "level1": "Level 1 - Mengingat",
  "level2": "Level 2 - Memahami",
  "level3": "Level 3 - Menerapkan",
  "level4": "Level 4 - Menganalisis",
  "level5": "Level 5 - Mengevaluasi",
  "level6": "Level 6 - Mencipta",
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
                <Image
                  src={question.questionFilePreview}
                  alt="Question"
                  width={100}
                  height={100}
                  sizes="100vw"
                  className="w-full h-auto rounded-lg shadow-md"
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
                Jawaban ({question.answerType === "pilihan_ganda" ? "Pilihan Ganda" : 
                         question.answerType === "pilihan_ganda_kompleks" ? "Pilihan Ganda Kompleks" : 
                         "Isian Singkat"})
              </h3>
            </div>

            {/* All Options for Multiple Choice (with checkmark for correct ones) */}
            {(question.answerType === "pilihan_ganda" || question.answerType === "pilihan_ganda_kompleks") && 
             question.multipleChoiceOptions && question.multipleChoiceOptions.length > 0 ? (
              <div className="space-y-3">
                {question.multipleChoiceOptions
                  .filter(opt => opt.text.trim())
                  .map((option, index) => (
                    <div 
                      key={index}
                      className={`rounded-xl p-5 border-2 transition-all ${
                        option.isCorrect 
                          ? "bg-gradient-to-br from-[#2ea062]/10 to-white border-[#2ea062]/40" 
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          option.isCorrect 
                            ? "bg-[#2ea062]" 
                            : "bg-gray-300"
                        }`}>
                          <span className="text-white poppins-bold text-sm">{option.label}</span>
                        </div>
                        <div className="flex-1">
                          <p className={`text-base poppins-medium leading-relaxed ${
                            option.isCorrect ? "text-gray-900" : "text-gray-600"
                          }`}>
                            {option.text}
                          </p>
                          {option.isCorrect && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-5 h-5 bg-[#2ea062] rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                              <span className="text-[#2ea062] text-sm poppins-semibold">Jawaban Benar</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <>
                {/* Answer Text for Essay/Isian Types */}
                {question.answerText && (
                  <div className="bg-gradient-to-br from-[#2ea062]/5 to-white rounded-xl p-6 border-2 border-[#2ea062]/20">
                    <p className="text-gray-800 text-base poppins-medium leading-relaxed whitespace-pre-wrap">
                      {question.answerText}
                    </p>
                  </div>
                )}

                {/* Answer Image */}
                {question.answerFilePreview && (
                  <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-3 text-gray-600">
                      <ImageIcon sx={{ fontSize: 20 }} />
                      <span className="text-sm poppins-medium">Gambar Jawaban</span>
                    </div>
                    <Image
                      src={question.answerFilePreview}
                      alt="Answer"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Time Limit */}
          {/* Explanation Section */}
          {question.explanation && (
            <div className="bg-gradient-to-br from-[#336d82]/5 to-white rounded-xl p-6 border-2 border-[#336d82]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#336d82] rounded-xl flex items-center justify-center">
                  <Info sx={{ fontSize: 22, color: "white" }} />
                </div>
                <h3 className="text-[#336d82] text-xl poppins-semibold">Penjelasan</h3>
              </div>
              <p className="text-gray-800 text-base poppins-medium leading-relaxed whitespace-pre-wrap">
                {question.explanation}
              </p>
            </div>
          )}

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
