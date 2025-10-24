"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import MobileWarning from "@/components/siswa/layout/MobileWarning";
import QuizProgress from "@/components/siswa/kuis/QuizProgress";
import QuizBadge from "@/components/siswa/kuis/QuizBadge";
import SlideToAnswer from "@/components/siswa/kuis/SlideToAnswer";
import AnswerInput from "@/components/siswa/kuis/AnswerInput";
import { quizData } from "@/data/quizData";

/**
 * Quiz Page
 *
 * Halaman kuis dengan fitur:
 * - Progress bar untuk tracking kemajuan
 * - Soal dengan gambar
 * - Input jawaban numerik (hanya angka)
 * - Navigasi next/prev
 *
 * Data kuis diambil dari @/data/quizData (MVP)
 * TODO: Ganti dengan API call saat backend ready
 */

export default function KuisPage() {
  const [isMobile, setIsMobile] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const classId = params?.classId as string;
  const materiId = params?.materiId as string;
  const isiMateriId = params?.isiMateriId as string;

  const currentQuestion = quizData[currentQuestionIndex];
  const totalQuestions = quizData.length;

  // Check if answer is valid (not empty and is a number)
  const isAnswerValid = userAnswer.trim() !== "" && /^\d+$/.test(userAnswer.trim());

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Handle navigation from hasil page
  useEffect(() => {
    const nextIndex = searchParams.get("nextIndex");
    if (nextIndex) {
      const newIndex = parseInt(nextIndex);
      setCurrentQuestionIndex(newIndex);
    }
  }, [searchParams]);

  // Load answer when question changes
  useEffect(() => {
    // Always clear answer when question changes
    setUserAnswer("");
  }, [currentQuestionIndex]);

  const handleSubmitAnswer = () => {
    // Save answer
    const updatedAnswers = {
      ...answers,
      [currentQuestionIndex]: userAnswer,
    };
    setAnswers(updatedAnswers);

    // Save to sessionStorage for hasil-keseluruhan page
    sessionStorage.setItem("quizAnswers", JSON.stringify(updatedAnswers));

    // Navigate to hasil page to show result
    router.push(
      `/siswa/materi/${classId}/${materiId}/${isiMateriId}/kuis/hasil?questionIndex=${currentQuestionIndex}&userAnswer=${userAnswer}`
    );
  };

  if (!isMobile) {
    return <MobileWarning />;
  }

  return (
    <div
      className="relative w-full min-h-screen overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, #336D82 -23.16%, #FFF 132.2%)",
      }}
    >
      {/* Content Container */}
      <div className="px-[25px] pt-[50px] pb-8">
        {/* Material Title */}
        <div className="text-center mb-4">
          <p className="text-white text-[16px] font-medium">
            Pecahan Biasa & Campuran
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <QuizProgress
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-[20px] w-full min-h-[350px] shadow-2xl overflow-hidden mb-4 transform transition-all duration-300 hover:shadow-3xl">
          {/* Card Header with Badges */}
          <div className="relative h-[55px] flex items-center justify-between px-4 pt-3">
            {/* Soal Badge */}
            <QuizBadge icon="edit" label="Soal" />

            {/* Question Number Badge */}
            <QuizBadge
              icon="menu_book"
              label={String(currentQuestionIndex + 1).padStart(2, "0")}
            />
          </div>

          {/* Image Section */}
          <div className="px-4 mt-2">
            <div
              className="w-full h-[175px] rounded-[10px] overflow-hidden shadow-md transform transition-all duration-300 hover:scale-[1.02]"
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
          <div className="px-6 mt-4">
            <p className="text-[#336D82] text-[11px] leading-relaxed font-medium">
              {currentQuestion.question}
            </p>
          </div>
        </div>

        {/* Answer Input - Modern & Fun for Kids */}
        <div className="mb-6">
          <AnswerInput value={userAnswer} onChange={setUserAnswer} />
        </div>

        {/* Slide to Answer Button - Full Width */}
        <div className="mt-6">
          <SlideToAnswer
            key={`slide-${currentQuestionIndex}`}
            onSlideComplete={handleSubmitAnswer}
            disabled={!isAnswerValid}
          />
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
