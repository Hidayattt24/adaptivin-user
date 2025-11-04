"use client";

import React, { useState, useEffect } from "react";
import { Close, Replay } from "@mui/icons-material";

interface QuizSummary {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
}

interface VideoRecommendation {
  id: string;
  title: string;
  grade: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

interface AnalisaAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentId?: string;
  materiTitle: string;
  materiId?: string;
  quizId?: string;
  quizSummary: QuizSummary;
}

const AnalisaAIModal: React.FC<AnalisaAIModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentId,
  materiTitle,
  materiId,
  quizId,
  quizSummary = {
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    score: 0,
  },
}) => {
  // State for AI analysis result
  const [resultMessage, setResultMessage] = useState<string>("");
  const [videoRecommendations, setVideoRecommendations] = useState<VideoRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // State for teacher analysis
  const [teacherAnalysis, setTeacherAnalysis] = useState<string>("");
  const [isAnalyzingForTeacher, setIsAnalyzingForTeacher] = useState(false);
  const [showTeacherAnalysis, setShowTeacherAnalysis] = useState(false);

  // Fetch result data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchResultData();
    }
  }, [isOpen]);

  // Fetch the AI analysis result
  const fetchResultData = async () => {
    setIsLoading(true);
    setError("");

    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/hasil-ai?studentId=${studentId}&materiId=${materiId}&quizId=${quizId}`);
      // const data = await response.json();
      // setResultMessage(data.message);
      // setVideoRecommendations(data.videoRecommendations);

      // Mock data - simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const message = `Hai Adik! Mbah AdaptivAI senang sekali melihat usaha kamu dalam mengerjakan kuis tentang ${materiTitle}.

Kamu berhasil menjawab ${quizSummary.correctAnswers} dari ${quizSummary.totalQuestions} pertanyaan dengan benar. ${
        quizSummary.score < 60
          ? "Tidak apa-apa! Belajar matematika memang butuh waktu dan latihan. Yang penting kamu sudah berani mencoba! 💪"
          : "Bagus sekali! Terus pertahankan semangat belajarmu! 🎉"
      }

${
  quizSummary.incorrectAnswers > 0
    ? `Untuk soal yang masih salah, yuk kita pelajari lagi konsep dasarnya. Ingat, memahami ${materiTitle.toLowerCase()} itu seperti membagi kue - semakin banyak potongan, semakin kecil ukuran setiap potongannya! Jangan ragu untuk bertanya kepada guru atau orang tua jika ada yang belum dipahami.`
    : ""
}

Mbah AdaptivAI menyarankan kamu untuk menonton video pembelajaran yang sudah disiapkan di bawah. Video ini akan membantu kamu memahami materi dengan cara yang lebih menarik dan mudah dipahami. Jangan lupa untuk terus berlatih ya!`;

      const videos: VideoRecommendation[] = [
        {
          id: "1",
          title: "Nilai Tempat Matematika Kelas 4 SD",
          grade: "Kelas 4",
          description:
            "Secara keseluruhan, video ini memberikan penjelasan dasar yang jelas mengenai konsep nilai tempat pada bilangan cacah, dari satuan hingga puluhan ribu. Video ini cocok untuk siswa SD kelas 4 dan dapat digunakan dalam pembelajaran di kelas maupun belajar mandiri.",
        },
        {
          id: "2",
          title: "Pecahan Biasa dan Campuran - Penjelasan Lengkap",
          grade: "Kelas 4",
          description:
            "Video pembelajaran ini menjelaskan konsep pecahan biasa dan pecahan campuran dengan cara yang mudah dipahami. Dilengkapi dengan contoh soal dan latihan interaktif untuk membantu siswa memahami materi dengan lebih baik.",
        },
        {
          id: "3",
          title: "Cara Mudah Mengubah Pecahan Campuran ke Pecahan Biasa",
          grade: "Kelas 4",
          description:
            "Pelajari trik dan tips untuk mengubah pecahan campuran menjadi pecahan biasa dengan mudah. Video ini cocok untuk siswa yang ingin memperdalam pemahaman tentang operasi pecahan.",
        },
      ];

      setResultMessage(message);
      setVideoRecommendations(videos);
    } catch (error) {
      console.error("Error fetching result data:", error);
      setError("Gagal memuat hasil analisa. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle teacher analysis based on current student data
  const handleTeacherAnalysis = async () => {
    setIsAnalyzingForTeacher(true);

    try {
      // TODO: Replace with actual API endpoint for teacher analysis
      // const response = await fetch('/api/analisa-guru', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     studentId,
      //     studentName,
      //     materiId,
      //     materiTitle,
      //     quizId,
      //     quizSummary,
      //     studentResult: resultMessage
      //   })
      // });
      // const data = await response.json();
      // setTeacherAnalysis(data.analysis);

      // Mock data - simulating AI analysis for teacher
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const percentage = quizSummary.score;
      let analysis = `🎓 Analisa Khusus untuk Guru\n\n`;
      analysis += `Berdasarkan hasil kuis ${studentName} pada materi "${materiTitle}", berikut adalah rekomendasi pembelajaran:\n\n`;

      if (percentage >= 80) {
        analysis += `✅ EVALUASI KINERJA\n`;
        analysis += `${studentName} menunjukkan penguasaan materi yang sangat baik (${percentage}%). Siswa ini termasuk dalam kategori pembelajar mandiri yang dapat diberikan tantangan lebih tinggi.\n\n`;
        analysis += `💡 REKOMENDASI STRATEGI PEMBELAJARAN:\n`;
        analysis += `• Berikan materi pengayaan atau proyek mandiri\n`;
        analysis += `• Libatkan siswa sebagai peer tutor untuk membantu teman\n`;
        analysis += `• Berikan soal dengan tingkat kesulitan lebih tinggi (HOTS)\n`;
        analysis += `• Dorong eksplorasi topik lanjutan yang relevan\n\n`;
        analysis += `📈 PREDIKSI PERKEMBANGAN:\n`;
        analysis += `Dengan konsistensi pembelajaran saat ini, ${studentName} diprediksi akan mencapai tingkat mahir dalam 2-3 minggu ke depan.\n\n`;
      } else if (percentage >= 60) {
        analysis += `📊 EVALUASI KINERJA\n`;
        analysis += `${studentName} memiliki pemahaman dasar yang cukup baik (${percentage}%) namun masih ada ruang untuk peningkatan. Siswa membutuhkan penguatan pada beberapa konsep kunci.\n\n`;
        analysis += `💡 REKOMENDASI STRATEGI PEMBELAJARAN:\n`;
        analysis += `• Fokus pada penguatan konsep yang masih lemah\n`;
        analysis += `• Gunakan variasi metode pembelajaran (visual, audio, kinestetik)\n`;
        analysis += `• Berikan latihan bertahap dengan feedback reguler\n`;
        analysis += `• Sediakan waktu konsultasi individual\n`;
        analysis += `• Manfaatkan video pembelajaran yang sudah direkomendasikan\n\n`;
        analysis += `📈 PREDIKSI PERKEMBANGAN:\n`;
        analysis += `Dengan bimbingan yang tepat, ${studentName} dapat mencapai penguasaan materi dalam 3-4 minggu.\n\n`;
      } else {
        analysis += `⚠️ EVALUASI KINERJA\n`;
        analysis += `${studentName} mengalami kesulitan dalam memahami materi (${quizSummary.correctAnswers}/${quizSummary.totalQuestions} benar). Diperlukan intervensi pembelajaran yang lebih intensif dan personal.\n\n`;
        analysis += `💡 REKOMENDASI STRATEGI PEMBELAJARAN:\n`;
        analysis += `• Rombak pendekatan pembelajaran dengan metode yang lebih sederhana\n`;
        analysis += `• Gunakan analogi dan contoh konkret dari kehidupan sehari-hari\n`;
        analysis += `• Berikan bimbingan one-on-one secara rutin\n`;
        analysis += `• Pecah materi menjadi bagian-bagian lebih kecil dan terukur\n`;
        analysis += `• Koordinasikan dengan orang tua untuk dukungan belajar di rumah\n`;
        analysis += `• Pastikan siswa menonton video pembelajaran yang direkomendasikan\n\n`;
        analysis += `📈 PREDIKSI PERKEMBANGAN:\n`;
        analysis += `${studentName} memerlukan waktu sekitar 4-6 minggu dengan pendampingan intensif untuk mencapai penguasaan materi yang memadai.\n\n`;
      }

      analysis += `🎯 LANGKAH PRAKTIS:\n`;
      analysis += `1. Evaluasi pemahaman siswa pada setiap sub-topik secara spesifik\n`;
      analysis += `2. Berikan latihan tambahan yang disesuaikan dengan tingkat kesulitan\n`;
      analysis += `3. Monitor perkembangan siswa secara berkala\n`;
      analysis += `4. Berikan apresiasi untuk setiap kemajuan yang dicapai\n\n`;
      analysis += `Salam,\nMbah AdaptivAI 👴`;

      setTeacherAnalysis(analysis);
      setShowTeacherAnalysis(true);
    } catch (error) {
      console.error("Error analyzing for teacher:", error);
      setError("Gagal melakukan analisa untuk guru. Silakan coba lagi.");
    } finally {
      setIsAnalyzingForTeacher(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#336d82] to-[#4a8fa3] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white text-xl poppins-bold">
              Hasil Analisa AI
            </h2>
            <p className="text-white/90 text-sm poppins-medium mt-1">
              {studentName} • {materiTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Tutup"
          >
            <Close sx={{ fontSize: 28 }} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-14 h-14 border-4 border-[#336d82]/20 border-t-[#336d82] rounded-full animate-spin"></div>
              <p className="text-gray-600 text-sm poppins-medium">
                Memuat hasil analisa...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <p className="text-red-600 text-sm poppins-medium text-center">
                {error}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Result Message */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-4xl">👴</div>
                  <div>
                    <h3 className="text-[#336d82] text-base poppins-bold mb-2">
                      Pesan dari Mbah AdaptivAI
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 text-sm poppins-regular leading-relaxed whitespace-pre-wrap">
                  {resultMessage}
                </p>
              </div>

              {/* Video Recommendations */}
              {videoRecommendations.length > 0 && (
                <div>
                  <h3 className="text-[#336d82] text-base poppins-bold mb-4">
                    Rekomendasi Video Pembelajaran
                  </h3>
                  <div className="space-y-4">
                    {videoRecommendations.map((video) => (
                      <div
                        key={video.id}
                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#336d82]/30 transition-all duration-200"
                      >
                        <div className="px-4 py-4">
                          <h3 className="text-[#336D82] text-[14px] poppins-semibold mb-2">
                            {video.title}
                          </h3>
                          <div className="inline-block mb-3">
                            <div className="bg-[#336D82] rounded-[10px] px-3 py-1">
                              <span className="text-white text-[10px] poppins-medium">
                                {video.grade}
                              </span>
                            </div>
                          </div>
                          <p className="text-[#666666] text-[11px] poppins-regular leading-relaxed">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teacher Analysis Section */}
              {showTeacherAnalysis && (
                <div className="animate-fadeIn">
                  <h3 className="text-[#336d82] text-base poppins-bold mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎓</span>
                    Rekomendasi untuk Guru
                  </h3>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                    <p className="text-gray-700 text-sm poppins-regular leading-relaxed whitespace-pre-wrap">
                      {teacherAnalysis}
                    </p>
                  </div>
                </div>
              )}

              {/* Teacher Analysis Button */}
              {!showTeacherAnalysis && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleTeacherAnalysis}
                    disabled={isAnalyzingForTeacher}
                    className="w-full bg-gradient-to-r from-[#336d82] to-[#4a8fa3] text-white px-6 py-3.5 rounded-xl poppins-semibold hover:from-[#2a5a6b] hover:to-[#3d7a8a] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-3 group"
                  >
                    {isAnalyzingForTeacher ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sedang menganalisis...</span>
                      </>
                    ) : (
                      <>
                        <Replay
                          sx={{ fontSize: 22 }}
                          className="group-hover:rotate-180 transition-transform duration-300"
                        />
                        <span>Ayo Guru Analisa Berdasarkan AI</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalisaAIModal;
