"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CircularProgress from "@/components/siswa/kuis/CircularProgress";
import QuizResultItem from "@/components/siswa/kuis/QuizResultItem";
import { quizData } from "@/data/quizData";

/**
 * Hasil Keseluruhan Page
 *
 * Halaman review semua jawaban kuis dengan:
 * - Summary score dan progress
 * - List semua hasil (benar/salah)
 * - Button untuk AI review (future feature)
 *
 * Data answers diterima via query params atau sessionStorage
 * 
 * Responsive: Mobile & Desktop optimized
 */

export default function HasilKeseluruhanPage() {
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});

  const params = useParams();
  const router = useRouter();

  const classId = params?.classId as string;
  const materiId = params?.materiId as string;
  const isiMateriId = params?.isiMateriId as string;

  // Load user answers from sessionStorage or query params
  useEffect(() => {
    // Try to get from sessionStorage first
    const storedAnswers = sessionStorage.getItem("quizAnswers");
    if (storedAnswers) {
      setUserAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  // Calculate results
  const totalQuestions = quizData.length;
  const correctAnswers = quizData.filter((q, index) => {
    const userAnswer = parseInt(userAnswers[index] || "0");
    return userAnswer === q.correctAnswer;
  }).length;

  const handleInfoClick = (questionIndex: number) => {
    // Navigate to individual result page
    const userAnswer = userAnswers[questionIndex] || "0";
    router.push(
      `/siswa/materi/${classId}/${materiId}/${isiMateriId}/kuis/hasil?questionIndex=${questionIndex}&userAnswer=${userAnswer}&fromReview=true`
    );
  };

  const handleClose = () => {
    // Clear quiz data and return to materi page
    sessionStorage.removeItem("quizAnswers");
    router.push(`/siswa/materi/${classId}/${materiId}/${isiMateriId}`);
  };

  return (
    <div className="relative w-full min-h-screen bg-white overflow-x-hidden pb-8 md:pb-12">
      {/* Content Container - Desktop Centered */}
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-8 pt-8 md:pt-12 pb-4 md:pb-6">
          <h1 className="text-[#336D82] text-[20px] md:text-3xl font-semibold">
            Riview Jawaban
          </h1>
          <button
            onClick={handleClose}
            className="w-[42px] h-[42px] md:w-[52px] md:h-[52px] bg-[#336D82] rounded-full flex items-center justify-center hover:bg-[#2a5868] active:scale-95 transition-all shadow-lg"
          >
            <span className="material-symbols-outlined text-white text-[24px] md:text-[28px]">
              close
            </span>
          </button>
        </div>

        {/* Summary Card */}
        <div className="px-6 md:px-8 mb-6 md:mb-8">
          <div
            className="rounded-[20px] md:rounded-[30px] p-6 md:p-8 shadow-xl"
            style={{
              background: "linear-gradient(180deg, #336D82 0%, #7AB0C4 100%)",
            }}
          >
            {/* Materi Info */}
            <div className="mb-4 md:mb-6">
              <p className="text-white text-[14px] md:text-base font-medium mb-1">Materi</p>
              <p className="text-white text-[15px] md:text-xl font-semibold">
                Pecahan biasa & campuran
              </p>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-t-[10px] md:rounded-t-[15px] p-4 md:p-6 flex items-center gap-4 md:gap-6">
              {/* Circular Progress */}
              <CircularProgress correct={correctAnswers} total={totalQuestions} />

              {/* Score Text */}
              <div>
                <p className="text-[#336D82] text-[11px] md:text-sm font-medium leading-relaxed">
                  Jawaban kamu benar
                </p>
                <p className="text-[#336D82] text-[11px] md:text-sm font-medium leading-relaxed">
                  {correctAnswers} dari {totalQuestions} pertanyaan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dropdown Toggle */}
        <div className="px-6 md:px-8 mb-4 md:mb-6">
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowResults(!showResults)}
              className="bg-[#336D82] rounded-[20px] h-[34px] md:h-[44px] px-5 md:px-7 text-white text-[14px] md:text-base font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              Hasil Keseluruhan
            </button>
            <button
              onClick={() => setShowResults(!showResults)}
              className="bg-[#336D82] rounded-[20px] h-[34px] md:h-[44px] w-[69px] md:w-[80px] flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <span
                className={`material-symbols-outlined text-white text-[24px] md:text-[28px] transition-transform duration-300 ${
                  showResults ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>
          </div>
        </div>

        {/* Results List - Desktop Grid */}
        {showResults && (
          <div className="px-6 md:px-8 space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 mb-6 md:mb-8 animate-fade-in">
            {quizData.map((question, index) => {
              const userAnswer = parseInt(userAnswers[index] || "0");
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <QuizResultItem
                  key={question.id}
                  questionNumber={index + 1}
                  question={question.question}
                  isCorrect={isCorrect}
                  onInfoClick={() => handleInfoClick(index)}
                />
              );
            })}
          </div>
        )}

        {/* AI Review Button */}
        <div className="px-6 md:px-8 mt-6 md:mt-8">
          <button
            onClick={() => {
              router.push(
                `/siswa/materi/${classId}/${materiId}/${isiMateriId}/kuis/hasil/hasil-keseluruhan/hasil-AI`
              );
            }}
            className="w-full max-w-md mx-auto block bg-[#336D82] rounded-[20px] h-[43px] md:h-[52px] flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all"
            style={{
              textShadow:
                "#ffffff 0px 0px 22px, #ffffff 0px 0px 45px, #ffffff 0px 0px 159px",
            }}
          >
            <div className="w-[21px] h-[21px] md:w-[26px] md:h-[26px] bg-white rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[#336D82] text-[16px] md:text-[20px]">
                smart_toy
              </span>
            </div>
            <span className="text-white text-[11px] md:text-sm font-semibold">
              Ayo kita jelajahi hasil belajar kamu bareng AI!
            </span>
          </button>
        </div>
      </div>

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
