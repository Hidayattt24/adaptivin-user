"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import QuizResultCard from "@/components/siswa/kuis/QuizResultCard";
import { quizData } from "@/data/quizData";

/**
 * Quiz Result Page
 *
 * Halaman hasil kuis setelah user submit jawaban
 * - Menampilkan apakah jawaban benar atau salah
 * - Memberikan penjelasan
 * - Navigate ke soal berikutnya atau selesai
 *
 * Query params:
 * - questionIndex: index soal saat ini
 * - userAnswer: jawaban user
 * 
 * Responsive: Mobile & Desktop optimized
 */

export default function HasilPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const classId = params?.classId as string;
  const materiId = params?.materiId as string;
  const isiMateriId = params?.isiMateriId as string;

  const questionIndex = parseInt(searchParams.get("questionIndex") || "0");
  const userAnswer = searchParams.get("userAnswer") || "";
  const fromReview = searchParams.get("fromReview") === "true";

  const currentQuestion = quizData[questionIndex];
  const isCorrect =
    parseInt(userAnswer) === currentQuestion?.correctAnswer;

  const handleNext = () => {
    // If coming from review, go back to hasil-keseluruhan
    if (fromReview) {
      router.push(
        `/siswa/materi/${classId}/${materiId}/${isiMateriId}/kuis/hasil/hasil-keseluruhan`
      );
      return;
    }

    // Normal flow: check if there are more questions
    const nextIndex = questionIndex + 1;

    if (nextIndex < quizData.length) {
      // Go to next question - pass nextIndex via query param
      router.push(
        `/siswa/materi/${classId}/${materiId}/${isiMateriId}/kuis?nextIndex=${nextIndex}`
      );
    } else {
      // Finish quiz - navigate to hasil keseluruhan
      router.push(
        `/siswa/materi/${classId}/${materiId}/${isiMateriId}/kuis/hasil/hasil-keseluruhan`
      );
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: Question not found</p>
      </div>
    );
  }

  return (
    <QuizResultCard
      isCorrect={isCorrect}
      userAnswer={userAnswer}
      correctAnswer={currentQuestion.correctAnswerText}
      question={currentQuestion.question}
      explanation={currentQuestion.explanation}
      explanationImage={currentQuestion.explanationImage}
      onNext={handleNext}
    />
  );
}
