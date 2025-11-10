"use client";

import { useState } from "react";
import Image from "next/image";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

interface QuizResultCardProps {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  question: string;
  explanation: string;
  explanationImage?: string;
  onNext: () => void;
}

/**
 * Quiz Result Card Component
 *
 * Menampilkan hasil jawaban kuis (benar/salah) dengan:
 * - Background gradient (merah untuk salah, hijau untuk benar)
 * - Dropdown jawaban user
 * - Kotak jawaban salah (jika salah)
 * - Penjelasan dengan dropdown
 * - Button lanjut
 */
export default function QuizResultCard({
  isCorrect,
  userAnswer,
  correctAnswer,
  explanation,
  explanationImage,
  onNext,
}: QuizResultCardProps) {
  const [showUserAnswer, setShowUserAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const bgGradient = isCorrect
    ? "linear-gradient(180deg, #2EA062 -23.16%, #FFF 139.44%)"
    : "linear-gradient(180deg, #8A0000 -23.16%, #FFF 139.44%)";

  const headerText = isCorrect
    ? "Yeay! Jawabanmu Benar! 🎉"
    : "Ups kamu salah nih : (";

  const IconComponent = isCorrect
    ? SentimentSatisfiedIcon
    : SentimentDissatisfiedIcon;
  const buttonColor = isCorrect ? "#2EA062" : "#8A0000";

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex flex-col"
      style={{ background: bgGradient }}
    >
      {/* Content Container - Desktop Centered */}
      <div className="max-w-3xl mx-auto w-full">
        {/* Top Section - Header & Dropdown */}
        <div className="px-[25px] md:px-8 pt-[50px] md:pt-[70px] pb-6 flex-shrink-0">
          {/* Header Text */}
          <h1 className="text-white text-[24px] font-semibold text-center mb-6 drop-shadow-lg">
            {headerText}
          </h1>

          {/* Dropdown: Jawaban Kamu */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowUserAnswer(!showUserAnswer)}
              className="bg-white rounded-[20px] h-[34px] px-4 flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
              <div
                className="w-[22px] h-[22px] rounded-full flex items-center justify-center shadow-sm"
                style={{ backgroundColor: buttonColor }}
              >
                <IconComponent sx={{ color: "white", fontSize: "14px" }} />
              </div>
              <span
                className="text-[10px] font-semibold"
                style={{ color: buttonColor }}
              >
                Jawaban kamu
              </span>
              <ExpandMoreIcon
                sx={{
                  color: buttonColor,
                  fontSize: "16px",
                  transition: "transform 0.2s",
                  transform: showUserAnswer ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>
          </div>

          {/* User Answer Display (if wrong) */}
          {!isCorrect && showUserAnswer && (
            <div className="bg-[#FFC2C2] border-4 border-[red] rounded-[10px] h-[57px] flex items-center justify-between px-4 animate-fade-in">
              <p className="text-[red] text-[14px] font-medium">
                Jawabannya {userAnswer}
              </p>
              <div className="w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center shadow-md">
                <SentimentDissatisfiedIcon
                  sx={{ color: "red", fontSize: "24px" }}
                />
              </div>
            </div>
          )}

          {/* If correct, show answer */}
          {isCorrect && showUserAnswer && (
            <div className="bg-[#C2FFC2] border-4 border-[#2EA062] rounded-[10px] h-[57px] flex items-center justify-between px-4 animate-fade-in">
              <p className="text-[#2EA062] text-[14px] font-medium">
                Jawabannya {userAnswer} ✓
              </p>
              <div className="w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center shadow-md">
                <SentimentSatisfiedIcon
                  sx={{ color: "#2EA062", fontSize: "24px" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* White Bottom Container - Full Size with Scroll */}
        <div className="bg-white rounded-t-[50px] shadow-2xl flex-1 flex flex-col relative overflow-hidden">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-6 md:px-8 pt-8 pb-4">
            {/* Handle for drag indicator */}
            <div className="w-[89px] h-[4px] bg-gray-300 rounded-full mx-auto mb-6" />

            {/* Info Text */}
            <div className="mb-6">
              <p className="text-[#386641] text-[14px] font-semibold leading-relaxed">
                {isCorrect ? "Mantap! Kamu hebat!" : "Tenang..."}
              </p>
              <p className="text-[#386641] text-[14px] font-semibold leading-relaxed">
                {isCorrect
                  ? "Berikut penjelasannya agar lebih paham yaa!"
                  : "Berikut jawaban benar nya & Penjelasannya"}
              </p>
            </div>

            {/* Correct Answer Button - With Gradient */}
            <div
              className="rounded-[20px] h-[59px] flex items-center justify-center mb-4 shadow-lg flex-shrink-0"
              style={{
                background:
                  "linear-gradient(142deg, #386641 -10.37%, #70CC82 190.05%)",
              }}
            >
              <p className="text-white text-[14px] font-semibold">
                Jawaban benar <span className="font-bold">{correctAnswer}</span>
              </p>
            </div>

            {/* Penjelasan Dropdown Buttons */}
            <div className="flex gap-3 mb-4 justify-center flex-shrink-0">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                style={{
                  background:
                    "linear-gradient(142deg, #386641 -10.37%, #70CC82 190.05%)",
                }}
                className="rounded-[20px] h-[34px] px-5 text-white text-[13px] font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all"
              >
                Penjelasan
              </button>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                style={{
                  background:
                    "linear-gradient(142deg, #386641 -10.37%, #70CC82 190.05%)",
                }}
                className="rounded-[20px] h-[34px] w-[69px] flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all"
              >
                <ExpandMoreIcon
                  sx={{
                    color: "white",
                    fontSize: "24px",
                    transition: "transform 0.3s",
                    transform: showExplanation
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </button>
            </div>

            {/* Explanation Content */}
            {showExplanation && (
              <div
                className="rounded-[10px] p-5 mb-4 animate-fade-in shadow-lg"
                style={{
                  background:
                    "linear-gradient(142deg, #386641 -10.37%, #70CC82 190.05%)",
                }}
              >
                <p className="text-white text-[13px] font-medium leading-relaxed mb-4">
                  {explanation}
                </p>

                {/* Explanation Image/Formula */}
                {explanationImage && (
                  <div className="bg-white/95 backdrop-blur-sm rounded-[20px] p-4 shadow-inner">
                    <Image
                      src={explanationImage}
                      alt="Penjelasan"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Extra space at bottom for better scroll experience */}
            <div className="h-4" />
          </div>

          {/* Sticky Bottom Button */}
          <div className="px-6 py-4 bg-white border-t border-gray-100 flex-shrink-0">
            <button
              onClick={onNext}
              style={{
                background:
                  "linear-gradient(142deg, #386641 -10.37%, #70CC82 190.05%)",
              }}
              className="rounded-[20px] h-[46px] w-full flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all"
            >
              <div className="w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center shadow-md">
                <ThumbUpIcon sx={{ color: "#386641", fontSize: "20px" }} />
              </div>
              <span className="text-white text-[14px] font-semibold">
                Klik jika sudah paham
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
