"use client";

import { useState, useEffect } from "react";
import QuizProgress from "@/components/siswa/kuis/QuizProgress";
import QuizBadge from "@/components/siswa/kuis/QuizBadge";
import SlideToAnswer from "@/components/siswa/kuis/SlideToAnswer";
import DynamicAnswerInput from "@/components/siswa/kuis/DynamicAnswerInput";
import QuizTimer from "@/components/siswa/kuis/QuizTimer";
import AnswerFeedbackModal from "@/components/siswa/kuis/AnswerFeedbackModal";
import Image from "next/image";
import { X, Lightbulb, ArrowRight } from "lucide-react";

// Static demo questions
const DEMO_QUESTIONS = [
  {
    id: "demo-1",
    soal_teks: "Tuliskan hasil dari 7 × 8 = ?",
    soal_gambar: null,
    tipe_jawaban: "isian_singkat" as const,
    level_soal: "level1",
    durasi_soal: 60,
    penjelasan: "Cara menghitung: 7 × 8 = 56. Pastikan menulis angka dengan benar!",
    gambar_pendukung_jawaban: null,
    jawaban: [],
    correctAnswer: "56", // For validation
  },
  {
    id: "demo-2",
    soal_teks: "Apa ibu kota negara Indonesia?",
    soal_gambar: null,
    tipe_jawaban: "pilihan_ganda" as const,
    level_soal: "level2",
    durasi_soal: 60,
    penjelasan: "Jakarta adalah ibu kota negara Indonesia yang terletak di Pulau Jawa.",
    gambar_pendukung_jawaban: null,
    jawaban: [
      { id: "a1", soal_id: "demo-2", isi_jawaban: "Bandung", is_benar: false },
      { id: "a2", soal_id: "demo-2", isi_jawaban: "Jakarta", is_benar: true },
      { id: "a3", soal_id: "demo-2", isi_jawaban: "Surabaya", is_benar: false },
      { id: "a4", soal_id: "demo-2", isi_jawaban: "Medan", is_benar: false },
    ],
    correctAnswerId: "a2",
  },
  {
    id: "demo-3",
    soal_teks: "Pilih SEMUA planet yang termasuk dalam tata surya kita:",
    soal_gambar: null,
    tipe_jawaban: "pilihan_ganda_kompleks" as const,
    level_soal: "level3",
    durasi_soal: 90,
    penjelasan: "Planet dalam tata surya: Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus.",
    gambar_pendukung_jawaban: null,
    jawaban: [
      { id: "b1", soal_id: "demo-3", isi_jawaban: "Bumi", is_benar: true },
      { id: "b2", soal_id: "demo-3", isi_jawaban: "Pluto", is_benar: false },
      { id: "b3", soal_id: "demo-3", isi_jawaban: "Mars", is_benar: true },
      { id: "b4", soal_id: "demo-3", isi_jawaban: "Andromeda", is_benar: true },
    ],
    correctAnswerIds: ["b1", "b3", "b4"],
  },
];

// Tutorial steps
interface TutorialStep {
  target: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const TUTORIAL_STEPS: Record<number, TutorialStep[]> = {
  0: [ // Isian Singkat
    {
      target: "question-text",
      title: "📝 Baca Soal dengan Teliti",
      description: "Pahami pertanyaan dengan baik sebelum menjawab.",
      position: "bottom",
    },
    {
      target: "answer-input",
      title: "✍️ Ketik Jawaban Anda",
      description: "Untuk soal isian singkat, ketik jawaban langsung di kotak ini.",
      position: "top",
    },
    {
      target: "slide-button",
      title: "➡️ Geser untuk Submit",
      description: "Setelah yakin dengan jawaban, geser tombol ini ke kanan untuk mengirim jawaban.",
      position: "top",
    },
  ],
  1: [ // Pilihan Ganda
    {
      target: "question-text",
      title: "📝 Baca Soal",
      description: "Perhatikan pertanyaan dengan seksama.",
      position: "bottom",
    },
    {
      target: "answer-options",
      title: "☑️ Pilih Satu Jawaban",
      description: "Klik SATU pilihan yang menurutmu paling benar. Hanya bisa pilih satu!",
      position: "top",
    },
    {
      target: "slide-button",
      title: "➡️ Geser untuk Submit",
      description: "Geser tombol ke kanan untuk mengirim jawaban yang sudah dipilih.",
      position: "top",
    },
  ],
  2: [ // Pilihan Ganda Kompleks
    {
      target: "question-text",
      title: "📝 Baca Soal",
      description: "Soal ini meminta SEMUA jawaban yang benar.",
      position: "bottom",
    },
    {
      target: "answer-options",
      title: "☑️ Pilih BANYAK Jawaban",
      description: "Klik SEMUA pilihan yang benar. Bisa lebih dari satu! Klik lagi untuk membatalkan.",
      position: "top",
    },
    {
      target: "slide-button",
      title: "➡️ Geser untuk Submit",
      description: "Pastikan semua jawaban benar sudah dipilih, lalu geser tombol ini.",
      position: "top",
    },
  ],
};

interface DemoQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function DemoQuiz({ isOpen, onClose, onComplete }: DemoQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState<{
    isCorrect: boolean;
    explanation?: string;
    explanationImage?: string;
  } | null>(null);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const currentQuestion = DEMO_QUESTIONS[currentQuestionIndex];
  const tutorialSteps = TUTORIAL_STEPS[currentQuestionIndex] || [];

  // Reset states when question changes
  useEffect(() => {
    setUserAnswer("");
    setSelectedAnswers([]);
    setCurrentTutorialStep(0);
    setShowTutorial(true);
  }, [currentQuestionIndex]);

  // Auto-advance tutorial on user interaction
  useEffect(() => {
    if (currentTutorialStep === 1) {
      // On answer input step
      if (currentQuestion.tipe_jawaban === "isian_singkat" && userAnswer.trim()) {
        // User typed something
        setTimeout(() => setCurrentTutorialStep(2), 800);
      } else if (selectedAnswers.length > 0) {
        // User selected something
        setTimeout(() => setCurrentTutorialStep(2), 800);
      }
    }
  }, [userAnswer, selectedAnswers, currentTutorialStep, currentQuestion.tipe_jawaban]);

  // Handle tutorial navigation
  const handleNextTutorialStep = () => {
    if (currentTutorialStep < tutorialSteps.length - 1) {
      setCurrentTutorialStep(currentTutorialStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
  };

  // Handle answer selection
  const handleSelectAnswer = (jawabanId: string) => {
    if (currentQuestion.tipe_jawaban === "pilihan_ganda") {
      setSelectedAnswers([jawabanId]);
    } else if (currentQuestion.tipe_jawaban === "pilihan_ganda_kompleks") {
      setSelectedAnswers((prev) =>
        prev.includes(jawabanId)
          ? prev.filter((id) => id !== jawabanId)
          : [...prev, jawabanId]
      );
    }
  };

  // Validate answer
  const isAnswerValid = () => {
    if (currentQuestion.tipe_jawaban === "isian_singkat") {
      return userAnswer.trim() !== "";
    } else {
      return selectedAnswers.length > 0;
    }
  };

  // Check if answer is correct
  const checkAnswer = () => {
    if (currentQuestion.tipe_jawaban === "isian_singkat") {
      return userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer?.toLowerCase();
    } else if (currentQuestion.tipe_jawaban === "pilihan_ganda") {
      return selectedAnswers[0] === currentQuestion.correctAnswerId;
    } else {
      // pilihan_ganda_kompleks
      const correct = currentQuestion.correctAnswerIds || [];
      return (
        selectedAnswers.length === correct.length &&
        selectedAnswers.every((id) => correct.includes(id))
      );
    }
  };

  // Handle submit
  const handleSubmitAnswer = () => {
    if (!isAnswerValid()) return;

    const isCorrect = checkAnswer();

    // Hide tutorial when showing feedback modal
    setShowTutorial(false);

    setFeedbackData({
      isCorrect,
      explanation: currentQuestion.penjelasan,
      explanationImage: currentQuestion.gambar_pendukung_jawaban ?? undefined,
    });
    setShowFeedbackModal(true);
  };

  // Handle feedback next
  const handleFeedbackNext = () => {
    setShowFeedbackModal(false);
    setFeedbackData(null);

    if (currentQuestionIndex < DEMO_QUESTIONS.length - 1) {
      // Next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Demo completed
      localStorage.setItem("quiz-demo-completed", "true");
      onComplete();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={(e) => {
          // Only close if clicking exactly on backdrop, not children
          if (e.target === e.currentTarget) {
            onClose();
          }
        }} 
      />

      {/* Demo Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4 py-20 pointer-events-none">
        <div className="relative w-full max-w-4xl pointer-events-auto">
          {/* Header Bar with Close Button and Badge */}
          <div className="flex items-center justify-between mb-4 px-2">
            {/* Demo Badge */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              <span className="font-bold">Mode Demo</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-lg transition-all hover:scale-110"
              aria-label="Tutup Demo"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quiz Content - Same as real quiz */}
          <div
            className="w-full min-h-[700px] rounded-3xl shadow-2xl relative"
            style={{
              background: "linear-gradient(180deg, #336D82 -23.16%, #FFF 132.2%)",
              overflow: "visible",
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
            <div className="px-6 md:px-12 pt-8 md:pt-12 pb-12" style={{ overflow: "visible" }}>
              <div className="max-w-3xl mx-auto relative" style={{ overflow: "visible" }}>
                {/* Header Section */}
                <div className="mb-6">
                  {/* Title */}
                  <div className="text-center mb-4">
                    <p className="text-white text-lg md:text-xl font-medium">
                      Demo: Cara Menjawab Kuis
                    </p>
                    <p className="text-white/80 text-sm mt-1">
                      Soal {currentQuestionIndex + 1} dari {DEMO_QUESTIONS.length}
                    </p>
                  </div>

                  {/* Timer (static for demo) */}
                  <div className="flex justify-center mb-4">
                    <QuizTimer totalSeconds={currentQuestion.durasi_soal} />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-white text-sm font-medium">
                      Soal {currentQuestionIndex + 1} dari {DEMO_QUESTIONS.length}
                    </p>
                    <p className="text-white/80 text-xs">
                      {Math.round(((currentQuestionIndex + 1) / DEMO_QUESTIONS.length) * 100)}% Selesai
                    </p>
                  </div>
                  <QuizProgress
                    currentQuestion={currentQuestionIndex + 1}
                    totalQuestions={DEMO_QUESTIONS.length}
                  />
                </div>

                {/* Question Card */}
                <div
                  id="question-card"
                  className="bg-white rounded-[30px] min-h-[350px] shadow-2xl mb-6 relative"
                  style={{ overflow: "visible", zIndex: 1 }}
                >
                  {/* Card Header */}
                  <div className="relative h-[70px] flex items-center justify-between px-8 pt-4">
                    <QuizBadge icon="edit" label="Soal" />
                    <QuizBadge
                      icon="menu_book"
                      label={String(currentQuestionIndex + 1).padStart(2, "0")}
                    />
                  </div>

                  {/* Question Text */}
                  <div 
                    id="question-text" 
                    className={`px-10 mt-6 mb-6 relative ${showTutorial && currentTutorialStep === 0 ? 'pb-40' : ''}`}
                    style={{ zIndex: showTutorial && currentTutorialStep === 0 ? 99 : "auto" }}
                  >
                    <p className="text-[#336D82] text-base leading-relaxed font-medium">
                      {currentQuestion.soal_teks}
                    </p>

                    {/* Tutorial Tooltip for Question */}
                    {showTutorial && currentTutorialStep === 0 && (
                      <TutorialTooltip
                        step={tutorialSteps[0]}
                        onNext={handleNextTutorialStep}
                        onSkip={handleSkipTutorial}
                        stepNumber={1}
                        totalSteps={tutorialSteps.length}
                      />
                    )}
                  </div>
                </div>

                {/* Answer Input */}
                <div 
                  id="answer-input" 
                  className={`mb-8 relative ${showTutorial && currentTutorialStep === 1 ? 'pb-40' : ''}`}
                  style={{ zIndex: showTutorial && currentTutorialStep === 1 ? 99 : "auto" }}
                >
                  <div id="answer-options">
                    <DynamicAnswerInput
                      tipeJawaban={currentQuestion.tipe_jawaban}
                      jawaban={currentQuestion.jawaban}
                      selectedAnswers={selectedAnswers}
                      userAnswer={userAnswer}
                      onSelectAnswer={handleSelectAnswer}
                      onChangeUserAnswer={setUserAnswer}
                    />
                  </div>

                  {/* Tutorial Tooltip for Answer Input */}
                  {showTutorial && currentTutorialStep === 1 && (
                    <TutorialTooltip
                      step={tutorialSteps[1]}
                      onNext={handleNextTutorialStep}
                      onSkip={handleSkipTutorial}
                      stepNumber={2}
                      totalSteps={tutorialSteps.length}
                    />
                  )}
                </div>

                {/* Slide to Answer */}
                <div 
                  id="slide-button" 
                  className={`relative ${showTutorial && currentTutorialStep === 2 ? 'pb-40' : ''}`}
                  style={{ zIndex: showTutorial && currentTutorialStep === 2 ? 99 : "auto" }}
                >
                  <SlideToAnswer
                    key={`demo-slide-${currentQuestionIndex}`}
                    onSlideComplete={handleSubmitAnswer}
                    disabled={!isAnswerValid()}
                  />

                  {/* Tutorial Tooltip for Submit */}
                  {showTutorial && currentTutorialStep === 2 && (
                    <TutorialTooltip
                      step={tutorialSteps[2]}
                      onNext={handleNextTutorialStep}
                      onSkip={handleSkipTutorial}
                      stepNumber={3}
                      totalSteps={tutorialSteps.length}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tutorial Tooltip Component
interface TutorialTooltipProps {
  step: TutorialStep;
  onNext: () => void;
  onSkip: () => void;
  stepNumber: number;
  totalSteps: number;
}

function TutorialTooltip({ step, onNext, onSkip, stepNumber, totalSteps }: TutorialTooltipProps) {
  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 animate-bounce-slow w-[90vw] max-w-sm" style={{ zIndex: 100 }}>
      <div 
        className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-6 relative border-4 border-white"
        style={{ 
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.3)" 
        }}
      >
        {/* Arrow pointing up */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[14px] border-b-white" />
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-yellow-400" />

        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">{step.title}</h3>
          <p className="text-sm text-white/90">{step.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-medium opacity-75">
            Langkah {stepNumber} dari {totalSteps}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onSkip}
              className="text-xs px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition"
            >
              Lewati
            </button>
            <button
              onClick={onNext}
              className="text-xs px-4 py-1 bg-white text-orange-500 font-bold rounded-lg hover:bg-white/90 transition flex items-center gap-1"
            >
              {stepNumber === totalSteps ? "Mengerti" : "Lanjut"}
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) translateX(-50%);
          }
          50% {
            transform: translateY(-5px) translateX(-50%);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
