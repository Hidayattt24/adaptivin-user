"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import MobileWarning from "@/components/siswa/layout/MobileWarning";
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
 */

export default function HasilKeseluruhanPage() {
  const [isMobile, setIsMobile] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});

  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const classId = params?.classId as string;
  const materiId = params?.materiId as string;
  const isiMateriId = params?.isiMateriId as string;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

  if (!isMobile) {
    return <MobileWarning />;
  }

  return (
    <div className="relative w-full min-h-screen bg-white overflow-x-hidden pb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <h1 className="text-[#336D82] text-[20px] font-semibold">
          Riview Jawaban
        </h1>
        <button
          onClick={handleClose}
          className="w-[42px] h-[42px] bg-[#336D82] rounded-full flex items-center justify-center hover:bg-[#2a5868] active:scale-95 transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-white text-[24px]">
            close
          </span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="px-6 mb-6">
        <div
          className="rounded-[20px] p-6 shadow-xl"
          style={{
            background: "linear-gradient(180deg, #336D82 0%, #7AB0C4 100%)",
          }}
        >
          {/* Materi Info */}
          <div className="mb-4">
            <p className="text-white text-[14px] font-medium mb-1">Materi</p>
            <p className="text-white text-[15px] font-semibold">
              Pecahan biasa & campuran
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-white rounded-t-[10px] p-4 flex items-center gap-4">
            {/* Circular Progress */}
            <CircularProgress correct={correctAnswers} total={totalQuestions} />

            {/* Score Text */}
            <div>
              <p className="text-[#336D82] text-[11px] font-medium leading-relaxed">
                Jawaban kamu benar
              </p>
              <p className="text-[#336D82] text-[11px] font-medium leading-relaxed">
                {correctAnswers} dari {totalQuestions} pertanyaan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Toggle */}
      <div className="px-6 mb-4">
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setShowResults(!showResults)}
            className="bg-[#336D82] rounded-[20px] h-[34px] px-5 text-white text-[14px] font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            Hasil Keseluruhan
          </button>
          <button
            onClick={() => setShowResults(!showResults)}
            className="bg-[#336D82] rounded-[20px] h-[34px] w-[69px] flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            <span
              className={`material-symbols-outlined text-white text-[24px] transition-transform duration-300 ${
                showResults ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </button>
        </div>
      </div>

      {/* Results List */}
      {showResults && (
        <div className="px-6 space-y-3 mb-6 animate-fade-in">
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
      <div className="px-6 mt-6">
        <button
          onClick={() => {
            router.push(
              `/siswa/materi/${classId}/${materiId}/${isiMateriId}/kuis/hasil/hasil-keseluruhan/hasil-AI`
            );
          }}
          className="w-full bg-[#336D82] rounded-[20px] h-[43px] flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all"
          style={{
            textShadow:
              "#ffffff 0px 0px 22px, #ffffff 0px 0px 45px, #ffffff 0px 0px 159px",
          }}
        >
          <div className="w-[21px] h-[21px] bg-white rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[#336D82] text-[16px]">
              smart_toy
            </span>
          </div>
          <span className="text-white text-[11px] font-semibold">
            Ayo kita jelajahi hasil belajar kamu bareng AI!
          </span>
        </button>
      </div>

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
