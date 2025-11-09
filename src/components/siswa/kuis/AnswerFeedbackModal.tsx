"use client";

import React from "react";
import Image from "next/image";

interface AnswerFeedbackModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  explanation?: string;
  explanationImage?: string;
  onNext: () => void;
}

export default function AnswerFeedbackModal({
  isOpen,
  isCorrect,
  explanation,
  explanationImage,
  onNext,
}: AnswerFeedbackModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-scale-in">
        {/* Header */}
        <div
          className={`px-8 py-6 ${isCorrect
              ? "bg-gradient-to-r from-[#2ea062] to-[#25854f]"
              : "bg-gradient-to-r from-[#e74c3c] to-[#c0392b]"
            }`}
        >
          <div className="flex items-center justify-center gap-4">
            {/* Icon */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${isCorrect ? "bg-white/20" : "bg-white/20"
                }`}
            >
              {isCorrect ? (
                <span className="material-symbols-outlined text-white text-5xl font-bold">
                  check_circle
                </span>
              ) : (
                <span className="material-symbols-outlined text-white text-5xl font-bold">
                  cancel
                </span>
              )}
            </div>

            {/* Text */}
            <div className="text-center">
              <h2 className="text-white text-3xl font-bold">
                {isCorrect ? "Jawaban Benar!" : "Jawaban Salah"}
              </h2>
              <p className="text-white/90 text-sm mt-1">
                {isCorrect
                  ? "Selamat! Kamu menjawab dengan tepat"
                  : "Jangan khawatir, kamu bisa belajar dari kesalahan ini"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Explanation Section */}
          {explanation && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#336d82] rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xl">
                    lightbulb
                  </span>
                </div>
                <h3 className="text-[#336d82] text-xl font-bold">Penjelasan</h3>
              </div>

              <div className="bg-gradient-to-br from-[#336d82]/5 to-white rounded-xl p-6 border-2 border-[#336d82]/20">
                <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                  {explanation}
                </p>
              </div>
            </div>
          )}

          {/* Explanation Image */}
          {explanationImage && (
            <div className="mb-6">
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-3 text-gray-600">
                  <span className="material-symbols-outlined text-xl">image</span>
                  <span className="text-sm font-medium">
                    Gambar Pendukung Penjelasan
                  </span>
                </div>
                <div className="relative w-full h-auto">
                  <Image
                    src={explanationImage}
                    alt="Penjelasan"
                    width={800}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Empty state jika tidak ada penjelasan */}
          {!explanation && !explanationImage && (
            <div className="text-center py-6">
              <span className="material-symbols-outlined text-gray-300 text-6xl">
                description
              </span>
              <p className="text-gray-400 mt-2">Tidak ada penjelasan tersedia</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-8 py-4 border-t-2 border-gray-200">
          <button
            onClick={onNext}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${isCorrect
                ? "bg-[#2ea062] hover:bg-[#25854f] text-white"
                : "bg-[#e74c3c] hover:bg-[#c0392b] text-white"
              }`}
          >
            OK, Lanjutkan
          </button>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
