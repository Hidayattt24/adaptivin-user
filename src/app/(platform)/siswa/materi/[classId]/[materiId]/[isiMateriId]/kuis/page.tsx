"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import QuizProgress from "@/components/siswa/kuis/QuizProgress";
import QuizBadge from "@/components/siswa/kuis/QuizBadge";
import SlideToAnswer from "@/components/siswa/kuis/SlideToAnswer";
import AnswerInput from "@/components/siswa/kuis/AnswerInput";
import QuizTimer from "@/components/siswa/kuis/QuizTimer";
import { quizData } from "@/data/quizData";

export default function KuisPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const classId = params?.classId as string;
  const materiId = params?.materiId as string;
  const isiMateriId = params?.isiMateriId as string;

  const currentQuestion = quizData[currentQuestionIndex];
  const totalQuestions = quizData.length;

  // Timer settings - Default 5 menit (300 detik) untuk MVP
  // Nantinya akan diambil dari data guru
  const quizTimeLimit = 300; // 5 menit dalam detik

  const isAnswerValid = userAnswer.trim() !== "" && /^\d+$/.test(userAnswer.trim());

  useEffect(() => {
    const nextIndex = searchParams.get("nextIndex");
    if (nextIndex) {
      const newIndex = parseInt(nextIndex);
      setCurrentQuestionIndex(newIndex);
    }
  }, [searchParams]);

  useEffect(() => {
    setUserAnswer("");
  }, [currentQuestionIndex]);

  const handleSubmitAnswer = () => {
    const updatedAnswers = {
      ...answers,
      [currentQuestionIndex]: userAnswer,
    };
    setAnswers(updatedAnswers);

    sessionStorage.setItem("quizAnswers", JSON.stringify(updatedAnswers));

    router.push(
      `/siswa/materi/${classId}/${materiId}/${isiMateriId}/kuis/hasil?questionIndex=${currentQuestionIndex}&userAnswer=${userAnswer}`
    );
  };

  const handleTimeUp = () => {
    // Simpan jawaban yang sudah dijawab
    sessionStorage.setItem("quizAnswers", JSON.stringify(answers));
    setShowTimeUpModal(true);

    // Auto redirect ke hasil keseluruhan setelah 3 detik
    setTimeout(() => {
      router.push(
        `/siswa/materi/${classId}/${materiId}/${isiMateriId}/kuis/hasil/hasil-keseluruhan`
      );
    }, 3000);
  };

  return (
    <div
      className="relative w-full min-h-screen overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, #336D82 -23.16%, #FFF 132.2%)",
      }}
    >
      {/* Time Up Modal */}
      {showTimeUpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-scale-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-red-500 text-5xl">
                  timer_off
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Waktu Habis!
              </h2>
              <p className="text-gray-600 mb-4">
                Kuis akan otomatis diselesaikan dengan jawaban yang sudah kamu isi.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-5 h-5 border-2 border-[#336D82] border-t-transparent rounded-full animate-spin" />
                <span>Mengarahkan ke hasil...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Container - Responsive */}
      <div className="px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-8 md:pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            {/* Material Title */}
            <div className="text-center mb-4">
              <p className="text-white text-base md:text-xl font-medium">
                Pecahan Biasa & Campuran
              </p>
            </div>

            {/* Timer */}
            <div className="flex justify-center mb-4">
              <QuizTimer
                totalSeconds={quizTimeLimit}
                onTimeUp={handleTimeUp}
                isPaused={showTimeUpModal}
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 md:mb-12">
            <QuizProgress
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
            />
          </div>

          {/* Question Card - Responsive */}
          <div className="bg-white rounded-[20px] md:rounded-[30px] w-full min-h-[350px] md:min-h-[450px] shadow-2xl overflow-hidden mb-4 md:mb-6 transform transition-all duration-300 hover:shadow-3xl">
            {/* Card Header with Badges */}
            <div className="relative h-[55px] md:h-[70px] flex items-center justify-between px-4 md:px-8 pt-3 md:pt-4">
              <QuizBadge icon="edit" label="Soal" />
              <QuizBadge
                icon="menu_book"
                label={String(currentQuestionIndex + 1).padStart(2, "0")}
              />
            </div>

            {/* Image Section */}
            <div className="px-4 md:px-8 mt-2 md:mt-4">
              <div
                className="w-full h-[175px] md:h-[280px] rounded-[10px] md:rounded-[15px] overflow-hidden shadow-md transform transition-all duration-300 hover:scale-[1.02]"
                style={{ backgroundColor: "#336D82" }}
              >
                <img
                  src={currentQuestion.image}
                  alt={`Ilustrasi soal ${currentQuestionIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="px-6 md:px-10 mt-4 md:mt-6">
              <p className="text-[#336D82] text-xs md:text-base leading-relaxed font-medium">
                {currentQuestion.question}
              </p>
            </div>
          </div>

          {/* Answer Input */}
          <div className="mb-6 md:mb-8">
            <AnswerInput value={userAnswer} onChange={setUserAnswer} />
          </div>

          {/* Slide to Answer Button */}
          <div className="mt-6 md:mt-8">
            <SlideToAnswer
              key={`slide-${currentQuestionIndex}`}
              onSlideComplete={handleSubmitAnswer}
              disabled={!isAnswerValid}
            />
          </div>
        </div>
      </div>

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />

      {/* Add animation styles */}
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
