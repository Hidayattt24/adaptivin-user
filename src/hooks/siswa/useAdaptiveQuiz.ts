"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getSoalForKuis,
  SoalAdaptif,
  createJawabanSiswa,
} from "@/lib/api/kuis";

// State untuk satu jawaban siswa
export interface StudentAnswer {
  soalId: string;
  jawabanSiswa: string;
  isCorrect: boolean;
  waktuDijawab: number;
  levelSoal: string;
  durasiSoal: number;
}

// State untuk quiz
export interface QuizState {
  kuisId: string;
  hasilKuisId: string;
  currentLevel: string;
  currentQuestionNumber: number;
  totalQuestions: number;
  answers: StudentAnswer[];
  isFinished: boolean;
}

export function useAdaptiveQuiz(
  kuisId: string,
  hasilKuisId: string,
  totalQuestions: number
) {
  const [quizState, setQuizState] = useState<QuizState>({
    kuisId,
    hasilKuisId,
    currentLevel: "level3", // Soal pertama selalu level 3
    currentQuestionNumber: 1,
    totalQuestions,
    answers: [],
    isFinished: false,
  });

  const [currentQuestion, setCurrentQuestion] = useState<SoalAdaptif | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update quizState saat hasilKuisId berubah (fix race condition)
  useEffect(() => {
    if (hasilKuisId && hasilKuisId !== quizState.hasilKuisId) {
      console.log("🔄 Updating hasilKuisId:", hasilKuisId);
      setQuizState((prev) => ({
        ...prev,
        hasilKuisId,
      }));
    }
  }, [hasilKuisId, quizState.hasilKuisId]);

  // Update totalQuestions saat parameter berubah (fix premature finish)
  useEffect(() => {
    if (totalQuestions > 0 && totalQuestions !== quizState.totalQuestions) {
      console.log("🔄 Updating totalQuestions:", totalQuestions);
      setQuizState((prev) => ({
        ...prev,
        totalQuestions,
      }));
    }
  }, [totalQuestions, quizState.totalQuestions]);

  /**
   * Load soal berdasarkan level saat ini
   */
  const loadQuestion = useCallback(async () => {
    if (quizState.isFinished) {
      console.log("⏹️ Quiz finished, not loading new question");
      return;
    }

    console.log("📖 Loading question:", {
      currentLevel: quizState.currentLevel,
      currentQuestionNumber: quizState.currentQuestionNumber,
      totalQuestions: quizState.totalQuestions,
      hasilKuisId: quizState.hasilKuisId,
    });

    setIsLoading(true);
    setError(null);

    try {
      // Pass hasilKuisId untuk prevent duplicate soal
      const soal = await getSoalForKuis(
        kuisId,
        quizState.currentLevel,
        quizState.hasilKuisId
      );
      console.log("✅ Question loaded:", {
        id: soal.id,
        tipe: soal.tipe_jawaban,
        level: soal.level_soal,
      });
      setCurrentQuestion(soal);
    } catch (err) {
      console.error("❌ Error loading question:", err);
      setError("Gagal memuat soal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, [
    kuisId,
    quizState.currentLevel,
    quizState.hasilKuisId,
    quizState.isFinished,
    quizState.currentQuestionNumber,
    quizState.totalQuestions,
  ]);

  /**
   * Submit jawaban dan simpan ke database
   */
  const submitAnswer = useCallback(
    async (jawabanSiswa: string, waktuDijawab: number, jawabanId?: string) => {
      if (!currentQuestion) {
        console.error("❌ No current question");
        return null;
      }

      console.log("🎯 Submitting answer:", {
        hasilKuisId: quizState.hasilKuisId,
        soalId: currentQuestion.id,
        jawabanId,
        jawabanSiswa,
        waktuDijawab,
        currentQuestionNumber: quizState.currentQuestionNumber,
        totalQuestions: quizState.totalQuestions,
      });

      // Validasi hasilKuisId
      if (!quizState.hasilKuisId) {
        console.error("❌ hasilKuisId is empty!");
        setError("Session kuis tidak ditemukan. Silakan refresh halaman.");
        return null;
      }

      try {
        // Simpan jawaban ke database via API
        const response = await createJawabanSiswa({
          hasil_kuis_id: quizState.hasilKuisId,
          soal_id: currentQuestion.id,
          jawaban_id: jawabanId,
          jawaban_siswa: jawabanSiswa,
          waktu_dijawab: waktuDijawab,
        });

        const { feedback } = response;
        console.log("✅ Answer saved, feedback:", feedback);

        // Simpan jawaban ke state lokal
        const newAnswer: StudentAnswer = {
          soalId: currentQuestion.id,
          jawabanSiswa,
          isCorrect: feedback.is_correct,
          waktuDijawab,
          levelSoal: currentQuestion.level_soal,
          durasiSoal: currentQuestion.durasi_soal,
        };

        // Check if this is the last question (BEFORE increment)
        // currentQuestionNumber adalah soal yang BARU SAJA dijawab
        // Jadi jika currentQuestionNumber === totalQuestions, maka ini adalah soal terakhir
        const isLastQuestion =
          quizState.currentQuestionNumber === quizState.totalQuestions;

        console.log("📊 Quiz progress:", {
          currentQuestionNumber: quizState.currentQuestionNumber,
          totalQuestions: quizState.totalQuestions,
          isLastQuestion,
          nextLevel: feedback.next_level,
          answersCount: quizState.answers.length + 1, // +1 karena newAnswer belum masuk array
        });

        // Update state using functional setState to avoid stale closure
        setQuizState((prev) => ({
          ...prev,
          currentLevel: feedback.next_level,
          currentQuestionNumber: prev.currentQuestionNumber + 1,
          answers: [...prev.answers, newAnswer],
          isFinished: isLastQuestion,
        }));

        return {
          isCorrect: feedback.is_correct,
          nextLevel: feedback.next_level,
          isFinished: isLastQuestion,
          feedback,
        };
      } catch (err) {
        console.error("❌ Error submitting answer:", err);
        setError("Gagal menyimpan jawaban. Silakan coba lagi.");
        return null;
      }
    },
    [
      currentQuestion,
      quizState.hasilKuisId,
      quizState.currentQuestionNumber,
      quizState.totalQuestions,
    ]
  );

  // Auto-load next question when currentQuestionNumber or currentLevel changes
  useEffect(() => {
    if (
      !quizState.isFinished &&
      quizState.hasilKuisId &&
      quizState.currentQuestionNumber > 1 // Skip initial load (question 1 loaded in initializeQuiz)
    ) {
      console.log("🔄 Auto-loading next question:", {
        currentQuestionNumber: quizState.currentQuestionNumber,
        currentLevel: quizState.currentLevel,
      });
      loadQuestion();
    }
  }, [
    quizState.currentQuestionNumber,
    quizState.currentLevel,
    quizState.isFinished,
    quizState.hasilKuisId,
    loadQuestion,
  ]);

  return {
    quizState,
    currentQuestion,
    isLoading,
    error,
    loadQuestion,
    submitAnswer,
  };
}
