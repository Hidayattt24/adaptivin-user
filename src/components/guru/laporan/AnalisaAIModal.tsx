"use client";

import React, { useState } from "react";
import { Close, AutoAwesome, TrendingUp, TrendingDown, CheckCircle, Cancel } from "@mui/icons-material";

interface QuizSummary {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
}

interface AnalisaAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  materiTitle: string;
  quizSummary: QuizSummary;
}

const AnalisaAIModal: React.FC<AnalisaAIModalProps> = ({
  isOpen,
  onClose,
  studentName,
  materiTitle,
  quizSummary = {
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    score: 0,
  },
}) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [aiAnalysisText, setAiAnalysisText] = useState<string>("");

  // Handle request for AI analysis
  const handleRequestAnalysis = async () => {
    setIsLoadingAnalysis(true);

    try {
      // TODO: Replace with actual API call to Gemini
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const percentage = quizSummary.score;
      let analysisText = `Halo Guru! Saya Mbah AdaptivAI 👴\n\nSaya sudah menganalisis hasil belajar ${studentName} pada materi "${materiTitle}".\n\n`;

      if (percentage >= 80) {
        analysisText += `🎉 PEMAHAMAN SANGAT BAIK\n${studentName} menunjukkan pemahaman yang luar biasa! Siswa berhasil menjawab ${quizSummary.correctAnswers} dari ${quizSummary.totalQuestions} pertanyaan dengan benar (${percentage}%).\n\n`;
      } else if (percentage >= 60) {
        analysisText += `✅ PEMAHAMAN CUKUP BAIK\n${studentName} menunjukkan pemahaman yang cukup baik. Siswa berhasil menjawab ${quizSummary.correctAnswers} dari ${quizSummary.totalQuestions} pertanyaan dengan benar (${percentage}%).\n\n`;
      } else {
        analysisText += `📚 PERLU BIMBINGAN LEBIH\n${studentName} berhasil menjawab ${quizSummary.correctAnswers} dari ${quizSummary.totalQuestions} pertanyaan dengan benar (${percentage}%). Siswa perlu bimbingan lebih untuk memahami konsep ${materiTitle}.\n\n`;
      }

      if (quizSummary.incorrectAnswers > 0) {
        analysisText += `💡 REKOMENDASI UNTUK GURU\n`;
        analysisText += `• Jelaskan kembali konsep dasar dengan pendekatan visual\n`;
        analysisText += `• Berikan latihan tambahan dengan tingkat kesulitan bertahap\n`;
        analysisText += `• Gunakan contoh konkret dari kehidupan sehari-hari\n`;
        analysisText += `• Berikan waktu lebih untuk siswa memahami setiap langkah\n\n`;
      }

      if (percentage >= 70) {
        analysisText += `🎯 PREDIKSI\n${studentName} memiliki fondasi yang kuat. Dengan latihan konsisten, siswa diprediksi akan mencapai tingkat mahir dalam 2-3 minggu. Terus berikan dukungan dan motivasi!\n\n`;
      } else {
        analysisText += `🎯 PREDIKSI\n${studentName} membutuhkan perhatian ekstra dan pendekatan pembelajaran yang lebih personal. Dengan bimbingan yang tepat, siswa pasti bisa menguasai materi ini.\n\n`;
      }

      analysisText += `Salam hangat,\nMbah AdaptivAI 👴`;

      setAiAnalysisText(analysisText);
      setShowAnalysis(true);
    } catch (error) {
      console.error("Error fetching AI analysis:", error);
      setAiAnalysisText(
        "Maaf, terjadi kesalahan saat menganalisis data siswa. Silakan coba lagi."
      );
      setShowAnalysis(true);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const getScoreStatus = () => {
    if (quizSummary.score >= 80) return {
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-300",
      label: "Sangat Baik"
    };
    if (quizSummary.score >= 60) return {
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-300",
      label: "Cukup Baik"
    };
    return {
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-300",
      label: "Perlu Perbaikan"
    };
  };

  const scoreStatus = getScoreStatus();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        {/* Header - Simplified */}
        <div className="sticky top-0 bg-gradient-to-r from-[#fcc61d] to-[#ffd84d] p-6 rounded-t-3xl flex items-center justify-between z-10 shadow-md">
          <div className="flex items-center gap-3">
            <div className="text-5xl">👴</div>
            <div>
              <h2 className="text-white text-2xl poppins-bold">Analisa AI</h2>
              <p className="text-white/90 text-sm poppins-medium">{studentName} • {materiTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Tutup"
          >
            <Close sx={{ fontSize: 28 }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Quick Stats - Compact */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Score */}
            <div className={`${scoreStatus.bg} ${scoreStatus.border} border-2 rounded-2xl p-4 text-center`}>
              <p className="text-gray-600 text-xs poppins-medium mb-1">Skor</p>
              <p className={`${scoreStatus.color} text-4xl poppins-bold`}>{quizSummary.score}%</p>
              <p className={`${scoreStatus.color} text-xs poppins-semibold mt-1`}>{scoreStatus.label}</p>
            </div>

            {/* Correct */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle sx={{ fontSize: 16, color: "#10b981" }} />
                <p className="text-gray-600 text-xs poppins-medium">Benar</p>
              </div>
              <p className="text-emerald-700 text-4xl poppins-bold">{quizSummary.correctAnswers}</p>
              <p className="text-emerald-600 text-xs poppins-medium mt-1">soal</p>
            </div>

            {/* Incorrect */}
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Cancel sx={{ fontSize: 16, color: "#f43f5e" }} />
                <p className="text-gray-600 text-xs poppins-medium">Salah</p>
              </div>
              <p className="text-rose-700 text-4xl poppins-bold">{quizSummary.incorrectAnswers}</p>
              <p className="text-rose-600 text-xs poppins-medium mt-1">soal</p>
            </div>
          </div>

          {/* AI Analysis Button or Result */}
          {!showAnalysis ? (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full mb-4">
                  <span className="text-5xl">👴</span>
                </div>
                <h3 className="text-[#336d82] text-xl poppins-bold mb-2">
                  Mbah AdaptivAI Siap Membantu!
                </h3>
                <p className="text-gray-600 text-sm poppins-regular max-w-md mx-auto">
                  Dapatkan analisa lengkap dan rekomendasi pembelajaran dari AI
                </p>
              </div>

              <button
                onClick={handleRequestAnalysis}
                disabled={isLoadingAnalysis}
                className="bg-gradient-to-r from-[#fcc61d] to-[#ffd84d] text-white px-8 py-4 rounded-2xl poppins-bold text-lg hover:from-[#e5b21a] hover:to-[#f0c940] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-3 group"
              >
                {isLoadingAnalysis ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Mbah AI sedang menganalisis...</span>
                  </>
                ) : (
                  <>
                    <AutoAwesome sx={{ fontSize: 28 }} className="group-hover:rotate-12 transition-transform" />
                    <span>Minta Analisa dari Mbah AI</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* AI Analysis Result - Cleaner format */
            <div className="animate-fadeIn">
              <div className="bg-gradient-to-br from-yellow-50/50 to-orange-50/50 rounded-2xl p-6 border-2 border-yellow-200">
                <div className="prose prose-sm max-w-none">
                  <pre className="text-[#336d82] text-base poppins-regular leading-relaxed whitespace-pre-wrap font-sans">
{aiAnalysisText}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-3xl border-t-2 border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-[#fcc61d] to-[#ffd84d] text-white px-8 py-3 rounded-xl poppins-semibold hover:from-[#e5b21a] hover:to-[#f0c940] transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalisaAIModal;
