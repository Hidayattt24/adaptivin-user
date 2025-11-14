"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QuizProgress from "@/components/siswa/kuis/QuizProgress";
import QuizBadge from "@/components/siswa/kuis/QuizBadge";
import SlideToAnswer from "@/components/siswa/kuis/SlideToAnswer";
import DynamicAnswerInput from "@/components/siswa/kuis/DynamicAnswerInput";
import QuizTimer from "@/components/siswa/kuis/QuizTimer";
import ErrorIcon from "@mui/icons-material/Error";
import Swal from "sweetalert2";
import {
  getKuisByMateri,
  Kuis,
  createHasilKuis,
  finishHasilKuis,
  getRiwayatKuisByMateri,
  getJawabanByHasilKuis,
} from "@/lib/api/kuis";
import { useAdaptiveQuiz } from "@/hooks/siswa/useAdaptiveQuiz";
import AnswerFeedbackModal from "@/components/siswa/kuis/AnswerFeedbackModal";
import DemoQuiz from "@/components/siswa/kuis/DemoQuiz";
import Image from "next/image";
import { Lightbulb, PlayCircle, ArrowLeft } from "lucide-react";

export default function KuisPage() {
  // Quiz state
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState<{
    isCorrect: boolean;
    explanation?: string;
    explanationImage?: string;
  } | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  
  // Data state
  const [kuisData, setKuisData] = useState<Kuis | null>(null);
  const [hasilKuisId, setHasilKuisId] = useState<string | null>(null);
  const [isLoadingKuis, setIsLoadingKuis] = useState(true);
  
  // Flow control state
  const [showDemoQuiz, setShowDemoQuiz] = useState(false);
  const [hasStartedQuiz, setHasStartedQuiz] = useState(false); // User belum memulai kuis
  const [isInitialized, setIsInitialized] = useState(false);
  const [isResumingQuiz, setIsResumingQuiz] = useState(false);
  
  // Resume state - untuk restore progress ketika refresh
  const [resumeData, setResumeData] = useState<{
    currentQuestionNumber: number;
    currentLevel: string;
    answeredCount: number;
  } | null>(null);

  const params = useParams();
  const router = useRouter();

  const classId = params?.classId as string;
  const materiId = params?.materiId as string;

  // Load data kuis dan cek apakah ada kuis yang sedang berjalan
  useEffect(() => {
    if (isInitialized) return;

    async function loadKuis() {
      try {
        setIsLoadingKuis(true);
        
        // Load kuis data
        const kuis = await getKuisByMateri(materiId);
        if (!kuis) {
          Swal.fire("Gagal", "Kuis tidak ditemukan untuk materi ini", "error");
          router.back();
          return;
        }

        console.log("✅ Kuis loaded:", kuis);
        setKuisData(kuis);

        // Cek apakah ada kuis yang sedang berjalan (belum selesai)
        try {
          const riwayat = await getRiwayatKuisByMateri(materiId);
          const activeQuiz = riwayat.find(h => !h.selesai && h.kuis_id === kuis.id);
          
          if (activeQuiz) {
            console.log("🔄 Found active quiz, resuming:", activeQuiz);
            setIsResumingQuiz(true);
            setHasilKuisId(activeQuiz.id);
            setHasStartedQuiz(true); // Auto-resume kuis
            
            // Load jawaban yang sudah dibuat untuk restore progress
            try {
              const existingAnswers = await getJawabanByHasilKuis(activeQuiz.id);
              console.log("📝 Existing answers loaded:", existingAnswers);
              
              if (existingAnswers && existingAnswers.length > 0) {
                // Ambil jawaban terakhir untuk mengetahui level terakhir
                const lastAnswer = existingAnswers[existingAnswers.length - 1];
                const nextQuestionNumber = existingAnswers.length + 1;
                
                // Hitung next level berdasarkan jawaban terakhir
                // Logic sama dengan backend: benar & cepat = naik, salah = turun, benar lambat = sama
                let nextLevel = lastAnswer.level_soal;
                
                // Simplified next level logic (seharusnya sama dengan backend)
                if (lastAnswer.benar) {
                  // Jika benar, cek apakah cepat (waktu < 50% durasi)
                  const isFast = lastAnswer.soal && 
                    lastAnswer.waktu_dijawab < (lastAnswer.soal.durasi_soal * 0.5);
                  
                  if (isFast) {
                    // Naik level
                    if (nextLevel === "level3") nextLevel = "level4";
                    else if (nextLevel === "level4") nextLevel = "level5";
                  }
                  // Jika lambat, tetap di level yang sama
                } else {
                  // Jika salah, turun level
                  if (nextLevel === "level5") nextLevel = "level4";
                  else if (nextLevel === "level4") nextLevel = "level3";
                }
                
                console.log("🎯 Resume data calculated:", {
                  answeredCount: existingAnswers.length,
                  nextQuestionNumber,
                  lastLevel: lastAnswer.level_soal,
                  nextLevel,
                });
                
                setResumeData({
                  currentQuestionNumber: nextQuestionNumber,
                  currentLevel: nextLevel,
                  answeredCount: existingAnswers.length,
                });
              }
            } catch (error) {
              console.error("Error loading existing answers:", error);
              // Tetap lanjutkan, akan mulai dari awal
            }
            
            // Show notification
            Swal.fire({
              title: "Melanjutkan Kuis",
              text: "Anda memiliki kuis yang belum selesai. Kuis akan dilanjutkan.",
              icon: "info",
              timer: 2500,
              showConfirmButton: false,
              toast: true,
              position: "top",
            });
          }
        } catch (error) {
          console.log("No active quiz found or error checking:", error);
          // Tidak masalah jika tidak ada atau error, user bisa mulai kuis baru
        }

        setIsInitialized(true);
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

  // Create hasil_kuis_siswa HANYA ketika user klik "Mulai Kuis"
  useEffect(() => {
    if (!hasStartedQuiz || !kuisData || hasilKuisId) return;

    async function initializeQuiz() {
      if (!kuisData) return; // Type guard
      
      try {
        const hasilKuis = await createHasilKuis(kuisData.id);
        console.log("✅ Hasil kuis created:", hasilKuis);
        setHasilKuisId(hasilKuis.id);
      } catch (error) {
        console.error("Error creating hasil kuis:", error);
        alert("Gagal memulai kuis");
      }
    }

    initializeQuiz();
  }, [hasStartedQuiz, kuisData, hasilKuisId]);

  // Initialize adaptive quiz hook with resume data jika ada
  const {
    quizState,
    currentQuestion,
    isLoading,
    error,
    loadQuestion,
    submitAnswer,
    isSubmitting,
  } = useAdaptiveQuiz(
    kuisData?.id || "",
    hasilKuisId || "",
    kuisData?.jumlah_soal || 10,
    resumeData ? {
      currentLevel: resumeData.currentLevel,
      currentQuestionNumber: resumeData.currentQuestionNumber,
      answeredCount: resumeData.answeredCount,
    } : undefined
  );

  // Load soal pertama HANYA ketika kuis sudah dimulai
  useEffect(() => {
    if (
      hasStartedQuiz &&
      kuisData &&
      hasilKuisId &&
      !currentQuestion &&
      !quizState.isFinished
    ) {
      console.log("🎬 Loading first question...");
      loadQuestion();
    }
  }, [
    hasStartedQuiz,
    kuisData,
    hasilKuisId,
    currentQuestion,
    quizState.isFinished,
    loadQuestion,
  ]);

  // Reset timer setiap kali soal berubah
  useEffect(() => {
    if (!currentQuestion) return;

    const storageKey = `quiz-question-start-${currentQuestion.id}`;
    
    // Cek apakah ada waktu mulai yang tersimpan untuk soal ini
    const savedStartTime = sessionStorage.getItem(storageKey);
    
    if (savedStartTime) {
      // Gunakan waktu yang tersimpan (untuk handle refresh)
      setQuestionStartTime(parseInt(savedStartTime));
      console.log("⏱️ Restored question start time from storage");
    } else {
      // Soal baru, simpan waktu mulai
      const startTime = Date.now();
      setQuestionStartTime(startTime);
      sessionStorage.setItem(storageKey, startTime.toString());
      console.log("⏱️ Set new question start time");
    }
    
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
      setSelectedAnswers((prev) =>
        prev.includes(jawabanId)
          ? prev.filter((id) => id !== jawabanId)
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
    if (!currentQuestion || !isAnswerValid || isSubmitting) return;

    try {
      // Hitung waktu yang digunakan (dalam detik)
      const waktuDijawab = Math.floor((Date.now() - questionStartTime) / 1000);

      // Get jawaban siswa berdasarkan tipe soal
      const jawabanSiswa = getJawabanSiswa();
      const jawabanId = getJawabanId();

      // Submit jawaban (akan otomatis disimpan ke database via API)
      const result = await submitAnswer(jawabanSiswa, waktuDijawab, jawabanId);

      if (result) {
        // Cleanup sessionStorage untuk soal ini
        const storageKey = `quiz-question-start-${currentQuestion.id}`;
        sessionStorage.removeItem(storageKey);

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
    } catch (error) {
      console.error("❌ Error submitting answer:", error);
    }
  };

  const handleFeedbackNext = () => {
    setShowFeedbackModal(false);
    setFeedbackData(null);
  };

  // Handler untuk memulai kuis
  const handleStartQuiz = () => {
    setHasStartedQuiz(true);
  };

  // Handler untuk membuka demo
  const handleOpenDemo = () => {
    setShowDemoQuiz(true);
  };

  // Handler untuk menutup demo
  const handleDemoComplete = () => {
    setShowDemoQuiz(false);
    Swal.fire({
      title: "Demo Selesai! 🎉",
      html: `
        <div class="text-left">
          <p class="mb-3">Sekarang kamu sudah paham cara menjawab soal kuis!</p>
          <div class="bg-green-50 border border-green-200 rounded-lg p-3">
            <p class="text-sm text-gray-700"><strong>Ingat:</strong></p>
            <ul class="text-sm text-gray-700 list-disc list-inside mt-2">
              <li>Baca soal dengan teliti</li>
              <li>Pilih jawaban yang tepat</li>
              <li>Geser tombol untuk submit</li>
              <li>Perhatikan penjelasan setelah menjawab</li>
            </ul>
          </div>
          <p class="text-sm text-gray-600 mt-3">💡 Klik "Mulai Kuis" untuk memulai!</p>
        </div>
      `,
      icon: "success",
      confirmButtonColor: "#336D82",
      confirmButtonText: "Oke, Mengerti!",
      customClass: {
        popup: "rounded-2xl",
        title: "text-2xl font-bold text-green-600",
      },
    });
  };

  // Loading state
  if (isLoadingKuis || !kuisData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#336D82] to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg font-medium">
            {isResumingQuiz ? "Melanjutkan kuis..." : "Memuat kuis..."}
          </p>
        </div>
      </div>
    );
  }

  // Landing Page - Belum memulai kuis
  if (!hasStartedQuiz) {
    return (
      <>
        {/* Demo Quiz Modal */}
        <DemoQuiz
          isOpen={showDemoQuiz}
          onClose={() => setShowDemoQuiz(false)}
          onComplete={handleDemoComplete}
        />

        <div className="relative w-full min-h-screen overflow-x-hidden flex items-center justify-center"
          style={{
            background: "linear-gradient(180deg, #336D82 -23.16%, #FFF 132.2%)",
          }}
        >
          {/* Tombol Kembali */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/90 hover:bg-white text-[#336D82] px-3 py-2 md:px-4 md:py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 z-10 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Kembali</span>
          </button>

          <div className="max-w-2xl mx-auto px-6 py-20">
            {/* Welcome Card */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#336D82] to-[#4a8ba0] rounded-full flex items-center justify-center mx-auto mb-6">
                  <PlayCircle className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#336D82] mb-3">
                  {kuisData.judul}
                </h1>
                <p className="text-gray-600 text-lg">
                  Siap untuk memulai kuis?
                </p>
              </div>

              {/* Info Kuis */}
              <div className="bg-blue-50 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-[#336D82] mb-4">
                  📋 Informasi Kuis
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#336D82] rounded-full mr-3"></span>
                    <span>Total Soal: <strong>{kuisData.jumlah_soal}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#336D82] rounded-full mr-3"></span>
                    <span>Soal akan menyesuaikan dengan kemampuanmu</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#336D82] rounded-full mr-3"></span>
                    <span>Setiap soal memiliki batas waktu</span>
                  </div>
                </div>
              </div>

              {/* Tombol Actions */}
              <div className="space-y-4">
                {/* Tombol Mulai Kuis */}
                <button
                  onClick={handleStartQuiz}
                  className="w-full bg-gradient-to-r from-[#336D82] to-[#4a8ba0] text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <PlayCircle className="w-6 h-6" />
                  Mulai Kuis Sekarang
                </button>

                {/* Tombol Demo */}
                <button
                  onClick={handleOpenDemo}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Lightbulb className="w-6 h-6" />
                  Lihat Demo Tutorial
                </button>
              </div>

              {/* Tips */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  💡 <strong>Tips:</strong> Jika ini pertama kalimu, coba lihat demo tutorial terlebih dahulu!
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#336D82] to-white">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ErrorIcon sx={{ color: "#ef4444", fontSize: "64px" }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Terjadi Kesalahan
          </h2>
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
                questionStartTime={questionStartTime}
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 md:mb-12">
            {/* Progress Counter Text */}
            <div className="flex justify-between items-center mb-2">
              <p className="text-white text-sm md:text-base font-medium">
                Soal {quizState.currentQuestionNumber} dari{" "}
                {quizState.totalQuestions}
              </p>
              <p className="text-white/80 text-xs md:text-sm">
                {Math.round(
                  (quizState.currentQuestionNumber / quizState.totalQuestions) *
                  100
                )}
                % Selesai
              </p>
            </div>
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
              disabled={!isAnswerValid || isSubmitting}
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
