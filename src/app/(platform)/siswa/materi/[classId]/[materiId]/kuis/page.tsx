"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QuizProgress from "@/components/siswa/kuis/QuizProgress";
import QuizBadge from "@/components/siswa/kuis/QuizBadge";
import SlideToAnswer from "@/components/siswa/kuis/SlideToAnswer";
import DynamicAnswerInput from "@/components/siswa/kuis/DynamicAnswerInput";
import QuizTimer from "@/components/siswa/kuis/QuizTimer";
import {
  getKuisByMateri,
  Kuis,
  createHasilKuis,
  finishHasilKuis,
} from "@/lib/api/kuis";
import { useAdaptiveQuiz } from "@/hooks/siswa/useAdaptiveQuiz";
import AnswerFeedbackModal from "@/components/siswa/kuis/AnswerFeedbackModal";
import Image from "next/image";

export default function KuisPage() {
  const [userAnswer, setUserAnswer] = useState(""); // For isian_singkat
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]); // For pilihan_ganda & kompleks
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState<{
    isCorrect: boolean;
    explanation?: string;
    explanationImage?: string;
  } | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [kuisData, setKuisData] = useState<Kuis | null>(null);
  const [hasilKuisId, setHasilKuisId] = useState<string | null>(null);
  const [isLoadingKuis, setIsLoadingKuis] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false); // Flag to prevent double init

  const params = useParams();
  const router = useRouter();

  const classId = params?.classId as string;
  const materiId = params?.materiId as string;

  // Load data kuis dan buat hasil_kuis_siswa (ONLY ONCE)
  useEffect(() => {
    // Prevent double initialization
    if (isInitialized) return;

    async function loadKuis() {
      try {
        setIsLoadingKuis(true);
        const kuis = await getKuisByMateri(materiId);

        if (!kuis) {
          alert("Kuis tidak ditemukan untuk materi ini");
          router.back();
          return;
        }

        console.log("✅ Kuis loaded:", kuis);
        setKuisData(kuis);

        // Buat hasil_kuis_siswa saat siswa mulai kuis
        // Backend akan check: jika sudah ada yang belum selesai, return yang existing
        const hasilKuis = await createHasilKuis(kuis.id);
        console.log("✅ Hasil kuis created/resumed:", hasilKuis);
        setHasilKuisId(hasilKuis.id);
        setIsInitialized(true); // Mark as initialized
      } catch (error) {
        console.error("Error loading kuis:", error);
        alert("Gagal memuat data kuis");
        router.back();
      } finally {
        setIsLoadingKuis(false);
      }
    }

    if (materiId && !isInitialized) {
      loadKuis();
    }
  }, [materiId, router, isInitialized]);

  // Initialize adaptive quiz hook ONLY when kuisData is ready
  const {
    quizState,
    currentQuestion,
    isLoading,
    error,
    loadQuestion,
    submitAnswer,
  } = useAdaptiveQuiz(
    kuisData?.id || "",
    hasilKuisId || "",
    kuisData?.jumlah_soal || 10 // Default 10 to prevent premature finish, will be updated when kuisData loads
  );

  // Load soal pertama ketika kuis data dan hasilKuisId tersedia
  useEffect(() => {
    if (kuisData && hasilKuisId && !currentQuestion && !quizState.isFinished) {
      console.log("🎬 Initializing first question with jumlah_soal:", kuisData.jumlah_soal);
      loadQuestion();
    }
  }, [kuisData, hasilKuisId, currentQuestion, quizState.isFinished, loadQuestion]);

  // Reset timer setiap kali soal berubah
  useEffect(() => {
    setQuestionStartTime(Date.now());
    setUserAnswer("");
    setSelectedAnswers([]);
  }, [currentQuestion]);

  // Redirect ke hasil jika kuis selesai
  useEffect(() => {
    if (quizState.isFinished && hasilKuisId) {
      let isFinishing = false; // Flag to prevent double finish

      const finishQuiz = async () => {
        if (isFinishing) return; // Already finishing
        isFinishing = true;

        console.log("🏁 Finishing quiz:", hasilKuisId);

        try {
          // Tandai kuis sebagai selesai di database
          await finishHasilKuis(hasilKuisId);
          console.log("✅ Quiz finished successfully");

          // Redirect ke halaman hasil dengan hasilKuisId (menggunakan path yang benar)
          router.push(
            `/siswa/materi/${classId}/${materiId}/kuis/hasil?hasilKuisId=${hasilKuisId}`
          );
        } catch (err) {
          console.error("❌ Error finishing kuis:", err);
          // Tetap redirect meskipun error
          router.push(
            `/siswa/materi/${classId}/${materiId}/kuis/hasil?hasilKuisId=${hasilKuisId}`
          );
        }
      };

      finishQuiz();
    }
  }, [quizState.isFinished, hasilKuisId, classId, materiId, router]);

  // Handler untuk pilih jawaban (pilihan ganda)
  const handleSelectAnswer = (jawabanId: string) => {
    if (!currentQuestion) return;

    if (currentQuestion.tipe_jawaban === "pilihan_ganda") {
      // Single choice: replace
      setSelectedAnswers([jawabanId]);
    } else if (currentQuestion.tipe_jawaban === "pilihan_ganda_kompleks") {
      // Multiple choice: toggle
      setSelectedAnswers(prev =>
        prev.includes(jawabanId)
          ? prev.filter(id => id !== jawabanId)
          : [...prev, jawabanId]
      );
    }
  };

  // Helper untuk meng-generate jawaban siswa berdasarkan tipe soal
  const getJawabanSiswa = () => {
    if (!currentQuestion) return "";

    if (currentQuestion.tipe_jawaban === "isian_singkat") {
      return userAnswer;
    } else {
      // pilihan_ganda atau pilihan_ganda_kompleks
      return selectedAnswers.join(","); // Gabungkan multiple answers dengan koma
    }
  };

  // Helper untuk mendapatkan jawaban_id pertama (untuk single answer)
  const getJawabanId = () => {
    if (!currentQuestion) return undefined;

    if (currentQuestion.tipe_jawaban === "isian_singkat") {
      return undefined; // Isian singkat tidak butuh jawaban_id
    } else {
      return selectedAnswers[0] || undefined; // Ambil jawaban pertama
    }
  };

  // Validasi apakah jawaban sudah valid
  const isAnswerValid = (() => {
    if (!currentQuestion) return false;

    if (currentQuestion.tipe_jawaban === "isian_singkat") {
      return userAnswer.trim() !== "";
    } else {
      return selectedAnswers.length > 0;
    }
  })();

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !isAnswerValid) return;

    // Hitung waktu yang digunakan (dalam detik)
    const waktuDijawab = Math.floor((Date.now() - questionStartTime) / 1000);

    // Get jawaban siswa berdasarkan tipe soal
    const jawabanSiswa = getJawabanSiswa();
    const jawabanId = getJawabanId();

    // Submit jawaban (akan otomatis disimpan ke database via API)
    const result = await submitAnswer(jawabanSiswa, waktuDijawab, jawabanId);

    if (result) {
      // Simpan ke sessionStorage untuk hasil individual
      sessionStorage.setItem(
        "lastAnswer",
        JSON.stringify({
          soal: currentQuestion,
          jawabanSiswa,
          isCorrect: result.isCorrect,
          waktuDijawab,
        })
      );

      // Tampilkan modal feedback
      setFeedbackData({
        isCorrect: result.isCorrect,
        explanation: currentQuestion.penjelasan,
        explanationImage: currentQuestion.gambar_pendukung_jawaban,
      });
      setShowFeedbackModal(true);
    }
  };

  const handleFeedbackNext = () => {
    console.log("🔵 Feedback modal closed, quizState:", {
      currentQuestionNumber: quizState.currentQuestionNumber,
      isFinished: quizState.isFinished,
    });

    setShowFeedbackModal(false);
    setFeedbackData(null);

    // No need to manually loadQuestion - auto-load effect will handle it
  };

  // Loading state
  if (isLoadingKuis || !kuisData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#336D82] to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg font-medium">Memuat kuis...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#336D82] to-white">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => loadQuestion()}
            className="bg-[#336D82] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2a5a6d] transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Loading soal
  if (isLoading || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#336D82] to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg font-medium">Memuat soal...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full min-h-screen overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, #336D82 -23.16%, #FFF 132.2%)",
      }}
    >
      {/* Answer Feedback Modal */}
      {feedbackData && (
        <AnswerFeedbackModal
          isOpen={showFeedbackModal}
          isCorrect={feedbackData.isCorrect}
          explanation={feedbackData.explanation}
          explanationImage={feedbackData.explanationImage}
          onNext={handleFeedbackNext}
        />
      )}

      {/* Content Container */}
      <div className="px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-8 md:pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            {/* Kuis Title */}
            <div className="text-center mb-4">
              <p className="text-white text-base md:text-xl font-medium">
                {kuisData.judul}
              </p>
              <p className="text-white/80 text-sm mt-1">
                Level Soal: {currentQuestion.level_soal.replace("level", "")}
              </p>
            </div>

            {/* Timer - menggunakan durasi soal saat ini */}
            <div className="flex justify-center mb-4">
              <QuizTimer
                totalSeconds={currentQuestion.durasi_soal}
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 md:mb-12">
            <QuizProgress
              currentQuestion={quizState.currentQuestionNumber}
              totalQuestions={quizState.totalQuestions}
            />
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-[20px] md:rounded-[30px] w-full min-h-[350px] md:min-h-[450px] shadow-2xl overflow-hidden mb-4 md:mb-6">
            {/* Card Header with Badges */}
            <div className="relative h-[55px] md:h-[70px] flex items-center justify-between px-4 md:px-8 pt-3 md:pt-4">
              <QuizBadge icon="edit" label="Soal" />
              <QuizBadge
                icon="menu_book"
                label={String(quizState.currentQuestionNumber).padStart(2, "0")}
              />
            </div>

            {/* Image Section */}
            {currentQuestion.soal_gambar && (
              <div className="px-4 md:px-8 mt-2 md:mt-4">
                <div className="w-full h-[175px] md:h-[280px] rounded-[10px] md:rounded-[15px] overflow-hidden shadow-md">
                  <Image
                    src={currentQuestion.soal_gambar}
                    alt={`Soal ${quizState.currentQuestionNumber}`}
                    width={800}
                    height={280}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Question Text */}
            <div className="px-6 md:px-10 mt-4 md:mt-6 mb-6">
              <p className="text-[#336D82] text-xs md:text-base leading-relaxed font-medium whitespace-pre-wrap">
                {currentQuestion.soal_teks}
              </p>
            </div>
          </div>

          {/* Answer Input - Dynamic based on question type */}
          <div className="mb-6 md:mb-8">
            <DynamicAnswerInput
              tipeJawaban={currentQuestion.tipe_jawaban}
              jawaban={currentQuestion.jawaban}
              selectedAnswers={selectedAnswers}
              userAnswer={userAnswer}
              onSelectAnswer={handleSelectAnswer}
              onChangeUserAnswer={setUserAnswer}
            />
          </div>

          {/* Slide to Answer Button */}
          <div className="mt-6 md:mt-8">
            <SlideToAnswer
              key={`slide-${currentQuestion.id}`}
              onSlideComplete={handleSubmitAnswer}
              disabled={!isAnswerValid}
            />
          </div>
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
