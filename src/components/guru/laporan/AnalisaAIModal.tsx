"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Close, Replay } from "@mui/icons-material";
import { Play, ExternalLink } from "lucide-react";
import {
  createTeacherAnalysis,
  getTeacherAnalysisByHasilKuis,
  checkTeacherAnalysisStatus,
  deleteTeacherAnalysis,
  type AnalisisAIGuru,
  type AktivitasPembelajaran,
  type RekomendasiVideoGuru,
} from "@/lib/api/analisis";

interface QuizSummary {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
}

interface VideoRecommendation {
  id?: string;
  title?: string;
  judul?: string; // Support both formats
  grade?: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  url?: string; // Support both formats
  durasi?: string;
}

interface AnalisisData {
  id: string;
  analisis: string;
  kelebihan: string;
  kelemahan: string;
  level_tertinggi: string;
  level_terendah: string;
  rekomendasi_belajar: string;
  rekomendasi_video: string | object;
}

interface AnalisaAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentId?: string;
  materiTitle: string;
  materiId?: string;
  quizId?: string;
  hasilKuisId?: string; // IMPORTANT: Add hasil_kuis_id for API calls
  quizSummary: QuizSummary;
  analisisData?: AnalisisData | null; // Analisis siswa dari backend
}

const AnalisaAIModal: React.FC<AnalisaAIModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentId,
  materiTitle,
  materiId,
  quizId,
  hasilKuisId, // NEW: Receive hasil_kuis_id
  quizSummary = {
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    score: 0,
  },
  analisisData, // Analisis siswa dari parent
}) => {
  // State for AI analysis result (untuk siswa)
  const [resultMessage, setResultMessage] = useState<string>("");
  const [videoRecommendations, setVideoRecommendations] = useState<
    VideoRecommendation[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // State for teacher analysis (dari API backend)
  const [teacherAnalysisData, setTeacherAnalysisData] = useState<AnalisisAIGuru | null>(null);
  const [isAnalyzingForTeacher, setIsAnalyzingForTeacher] = useState(false);
  const [showTeacherAnalysis, setShowTeacherAnalysis] = useState(false);
  const [teacherAnalysisError, setTeacherAnalysisError] = useState<string>("");
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  // State for video player
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Helper function to format text with proper line breaks
  // Convert escaped \n to actual newlines for proper rendering
  const formatText = (text: string): string => {
    if (!text) return "";
    // Replace escaped newlines (\n) with actual newline characters
    return text.replace(/\\n/g, "\n");
  };

  // Helper functions for YouTube video handling
  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getYouTubeThumbnail = (url: string): string => {
    const videoId = extractYouTubeId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : "/placeholder-video.jpg";
  };

  // Fetch result data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchResultData();
      // Cek apakah sudah ada analisis guru
      if (hasilKuisId) {
        checkExistingTeacherAnalysis();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, analisisData, hasilKuisId]);

  // Check if teacher analysis already exists
  const checkExistingTeacherAnalysis = async () => {
    if (!hasilKuisId) return;

    try {
      const status = await checkTeacherAnalysisStatus(hasilKuisId);

      if (status.is_analyzed && status.analisis_id) {
        // Jika sudah ada analisis, ambil datanya
        const analysis = await getTeacherAnalysisByHasilKuis(hasilKuisId);

        // Helper function to safely parse JSON strings
        const safeJsonParse = (str: string) => {
          if (!str || typeof str !== 'string') return str;

          // Check if string looks like JSON (starts with [ or {)
          const trimmed = str.trim();
          if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
            return str; // Not JSON, keep as string
          }

          try {
            return JSON.parse(str);
          } catch (e) {
            return str; // Keep as string if parsing fails
          }
        };

        // Parse JSONB fields jika masih string
        if (typeof analysis.aktivitas_pembelajaran === 'string') {
          try {
            analysis.aktivitas_pembelajaran = JSON.parse(analysis.aktivitas_pembelajaran);
          } catch (e) {
            analysis.aktivitas_pembelajaran = [];
          }
        }

        if (typeof analysis.rekomendasi_video_guru === 'string') {
          try {
            analysis.rekomendasi_video_guru = JSON.parse(analysis.rekomendasi_video_guru);
          } catch (e) {
            analysis.rekomendasi_video_guru = [];
          }
        }

        if (typeof analysis.rekomendasi_metode_mengajar === 'string') {
          analysis.rekomendasi_metode_mengajar = safeJsonParse(analysis.rekomendasi_metode_mengajar);
        }

        if (typeof analysis.tips_praktis === 'string') {
          analysis.tips_praktis = safeJsonParse(analysis.tips_praktis);
        }

        if (typeof analysis.indikator_progress === 'string') {
          analysis.indikator_progress = safeJsonParse(analysis.indikator_progress);
        }

        if (typeof analysis.strategi_differensiasi === 'string') {
          analysis.strategi_differensiasi = safeJsonParse(analysis.strategi_differensiasi);
        }

        setTeacherAnalysisData(analysis);
        setShowTeacherAnalysis(true); // Auto-show jika sudah ada
      }
    } catch (error) {
      console.error("Error checking teacher analysis:", error);
      // Silent error - user can still generate manually
    }
  };

  // Fetch the AI analysis result
  const fetchResultData = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Use analisisData from backend if available
      if (analisisData) {
        // Parse video recommendations from backend
        let videos: VideoRecommendation[] = [];

        if (typeof analisisData.rekomendasi_video === "string") {
          try {
            const parsed = JSON.parse(analisisData.rekomendasi_video);
            videos = Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            console.error("Failed to parse video recommendations:", e);
            videos = [];
          }
        } else if (Array.isArray(analisisData.rekomendasi_video)) {
          videos = analisisData.rekomendasi_video;
        }

        // Ensure each video has a unique id
        videos = videos.map((video, index) => ({
          ...video,
          id: video.id || `video-${index}-${Date.now()}`,
        }));

        // Use analisis from backend
        setResultMessage(analisisData.analisis);
        setVideoRecommendations(videos);
        setIsLoading(false);
        return;
      }

      // Fallback to mock data if no analisisData available
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const message = `Hai Adik! Mbah AdaptivAI senang sekali melihat usaha kamu dalam mengerjakan kuis tentang ${materiTitle}.

Kamu berhasil menjawab ${quizSummary.correctAnswers} dari ${
        quizSummary.totalQuestions
      } pertanyaan dengan benar. ${
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

  // Handle teacher analysis - Call API backend untuk generate atau ambil analisis guru
  const handleTeacherAnalysis = async (forceRegenerate: boolean = false) => {
    if (!hasilKuisId) {
      setTeacherAnalysisError("Hasil kuis ID tidak tersedia. Tidak dapat membuat analisis.");
      return;
    }

    setIsAnalyzingForTeacher(true);
    setTeacherAnalysisError("");

    try {
      console.log("🎓 Starting teacher analysis for hasilKuisId:", hasilKuisId);

      // 1. Cek apakah sudah ada analisis guru
      const status = await checkTeacherAnalysisStatus(hasilKuisId);
      console.log("Teacher analysis status:", status);

      let analysis: AnalisisAIGuru;

      if (status.is_analyzed && status.analisis_id && !forceRegenerate) {
        // 2. Jika sudah ada dan TIDAK re-analyze, ambil dari database
        console.log("✅ Analisis guru sudah ada, mengambil dari database...");
        analysis = await getTeacherAnalysisByHasilKuis(hasilKuisId);
        console.log("✅ Analisis guru berhasil diambil dari database");
      } else if (status.is_analyzed && status.analisis_id && forceRegenerate) {
        // 3. Jika sudah ada dan RE-ANALYZE, hapus dulu lalu generate baru
        console.log("🔄 Re-analyzing: Deleting old analysis...");
        await deleteTeacherAnalysis(status.analisis_id);
        console.log("✅ Old analysis deleted");

        console.log("🤖 Generating new teacher analysis dengan AI...");
        analysis = await createTeacherAnalysis(hasilKuisId);
        console.log("✅ New teacher analysis berhasil di-generate dan disimpan");
      } else {
        // 4. Jika belum ada sama sekali, generate baru dengan AI
        console.log("🤖 Analisis guru belum ada, generating dengan AI...");
        analysis = await createTeacherAnalysis(hasilKuisId);
        console.log("✅ Analisis guru berhasil di-generate dan disimpan ke database");
      }

      // 5. Parse JSONB fields jika masih berupa string
      if (typeof analysis.aktivitas_pembelajaran === "string") {
        try {
          analysis.aktivitas_pembelajaran = JSON.parse(
            analysis.aktivitas_pembelajaran
          );
        } catch (e) {
          console.error("Error parsing aktivitas_pembelajaran:", e);
          analysis.aktivitas_pembelajaran = [];
        }
      }

      if (typeof analysis.rekomendasi_video_guru === "string") {
        try {
          analysis.rekomendasi_video_guru = JSON.parse(
            analysis.rekomendasi_video_guru
          );
        } catch (e) {
          console.error("Error parsing rekomendasi_video_guru:", e);
          analysis.rekomendasi_video_guru = [];
        }
      }

      // Helper function to safely parse JSON strings
      const safeJsonParse = (str: string, fieldName: string) => {
        if (!str || typeof str !== 'string') return str;

        // Check if string looks like JSON (starts with [ or {)
        const trimmed = str.trim();
        if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
          // Not JSON, keep as string
          return str;
        }

        try {
          return JSON.parse(str);
        } catch (e) {
          console.error(`Error parsing ${fieldName}:`, e);
          return str; // Keep as string if parsing fails
        }
      };

      if (typeof analysis.rekomendasi_metode_mengajar === "string") {
        analysis.rekomendasi_metode_mengajar = safeJsonParse(
          analysis.rekomendasi_metode_mengajar,
          "rekomendasi_metode_mengajar"
        );
      }

      if (typeof analysis.tips_praktis === "string") {
        analysis.tips_praktis = safeJsonParse(
          analysis.tips_praktis,
          "tips_praktis"
        );
      }

      if (typeof analysis.indikator_progress === "string") {
        analysis.indikator_progress = safeJsonParse(
          analysis.indikator_progress,
          "indikator_progress"
        );
      }

      if (typeof analysis.strategi_differensiasi === "string") {
        analysis.strategi_differensiasi = safeJsonParse(
          analysis.strategi_differensiasi,
          "strategi_differensiasi"
        );
      }

      // 6. Set state untuk ditampilkan
      setTeacherAnalysisData(analysis);
      setShowTeacherAnalysis(true);

      console.log("✅ Teacher analysis data set successfully");
    } catch (error: any) {
      console.error("❌ Error in handleTeacherAnalysis:", error);
      setTeacherAnalysisError(
        error.message || "Gagal melakukan analisa untuk guru. Silakan coba lagi."
      );
    } finally {
      setIsAnalyzingForTeacher(false);
    }
  };

  // Handle re-analyze untuk guru
  const handleReanalyzeForTeacher = async () => {
    setIsReanalyzing(true);
    await handleTeacherAnalysis(true); // Pass true untuk force regenerate
    setIsReanalyzing(false);
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
            <div className="space-y-6">
              {/* Header Info - Hasil AI dari Siswa */}
              <div className="bg-gradient-to-r from-[#336d82] to-[#4a8fa3] rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 bg-white rounded-full p-2 shadow-lg flex-shrink-0">
                    <Image
                      src="/mascot/mbah-adaptivin.svg"
                      alt="Mbah Adaptivin"
                      width={56}
                      height={56}
                      className="w-full h-full object-contain"
                    />
                    {/* Sparkle animation */}
                    <div className="absolute -top-1 -right-1 text-lg animate-bounce">
                      ✨
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg poppins-bold">
                      Hasil Analisis AI dari Siswa
                    </h3>
                    <p className="text-white/90 text-sm poppins-medium">
                      {studentName} • Materi: {materiTitle}
                    </p>
                  </div>
                </div>
                <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                  <p className="text-white/95 text-xs poppins-regular leading-relaxed">
                    💡{" "}
                    <span className="poppins-semibold">Info untuk Guru:</span>{" "}
                    Berikut adalah analisis lengkap yang diterima siswa dari
                    Mbah Adaptivin. Gunakan informasi ini untuk memahami kondisi
                    pembelajaran siswa dan memberikan bimbingan yang lebih tepat
                    sasaran.
                  </p>
                </div>
              </div>

              {/* Result Message */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start gap-3 mb-4">
                  <div className="relative flex-shrink-0">
                    {/* Mbah Adaptivin Avatar */}
                    <div className="w-16 h-16 bg-white rounded-full p-2 shadow-lg border-2 border-blue-200">
                      <Image
                        src="/mascot/mbah-adaptivin.svg"
                        alt="Mbah Adaptivin"
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {/* Sparkle effect */}
                    <div className="absolute -top-1 -right-1 text-xl animate-bounce">
                      ✨
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-[#336d82] text-base poppins-bold">
                        Pesan dari Mbah Adaptivin
                      </h3>
                      <span className="text-[10px] text-blue-600 bg-blue-100 px-2 py-1 rounded-full poppins-medium">
                        📊 Data Database
                      </span>
                    </div>
                    <p className="text-[#336d82]/70 text-xs poppins-medium">
                      Ramalan khusus untuk {studentName}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm poppins-regular leading-relaxed whitespace-pre-wrap">
                  {formatText(resultMessage)}
                </p>
              </div>

              {/* Kelebihan & Kelemahan Section */}
              {analisisData && (
                <>
                  {/* Level Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Level Tertinggi */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xl">🏆</span>
                          </div>
                          <h4 className="text-green-800 text-sm poppins-bold">
                            Level Tertinggi Dikuasai
                          </h4>
                        </div>
                        <span className="text-[9px] text-green-600 bg-green-100 px-2 py-1 rounded-full poppins-medium whitespace-nowrap">
                          📊 Database
                        </span>
                      </div>
                      <p className="text-green-700 text-2xl poppins-bold uppercase">
                        {analisisData.level_tertinggi}
                      </p>
                    </div>

                    {/* Level Terendah */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xl">📊</span>
                          </div>
                          <h4 className="text-orange-800 text-sm poppins-bold">
                            Level Perlu Ditingkatkan
                          </h4>
                        </div>
                        <span className="text-[9px] text-orange-600 bg-orange-100 px-2 py-1 rounded-full poppins-medium whitespace-nowrap">
                          📊 Database
                        </span>
                      </div>
                      <p className="text-orange-700 text-2xl poppins-bold uppercase">
                        {analisisData.level_terendah}
                      </p>
                    </div>
                  </div>

                  {/* Kelebihan */}
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white text-2xl">💪</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-green-800 text-base poppins-bold">
                            Kelebihan Siswa
                          </h4>
                          <span className="text-[10px] text-green-600 bg-green-100 px-2 py-1 rounded-full poppins-medium">
                            📊 Data Database
                          </span>
                        </div>
                        <p className="text-green-700/70 text-xs poppins-medium">
                          Hal-hal yang sudah dikuasai dengan baik
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm poppins-regular leading-relaxed whitespace-pre-wrap">
                      {formatText(analisisData.kelebihan)}
                    </p>
                  </div>

                  {/* Kelemahan */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white text-2xl">📈</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-yellow-800 text-base poppins-bold">
                            Area yang Perlu Ditingkatkan
                          </h4>
                          <span className="text-[10px] text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full poppins-medium">
                            📊 Data Database
                          </span>
                        </div>
                        <p className="text-yellow-700/70 text-xs poppins-medium">
                          Hal-hal yang masih bisa diperbaiki
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm poppins-regular leading-relaxed whitespace-pre-wrap">
                      {formatText(analisisData.kelemahan)}
                    </p>
                  </div>

                  {/* Rekomendasi Belajar */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white text-2xl">💡</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-purple-800 text-base poppins-bold">
                            Rekomendasi Belajar
                          </h4>
                          <span className="text-[10px] text-purple-600 bg-purple-100 px-2 py-1 rounded-full poppins-medium">
                            📊 Data Database
                          </span>
                        </div>
                        <p className="text-purple-700/70 text-xs poppins-medium">
                          Saran dari Mbah untuk belajar lebih baik
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-xl p-4">
                      <p className="text-gray-700 text-sm poppins-regular leading-relaxed whitespace-pre-wrap">
                        {formatText(analisisData.rekomendasi_belajar)}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Video Recommendations */}
              {videoRecommendations.length > 0 && (
                <div>
                  <div className="bg-gradient-to-r from-[#336D82] to-[#7AB0C4] rounded-xl p-5 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">🎬</span>
                      <div>
                        <h3 className="text-white text-lg poppins-bold">
                          Rekomendasi Video Pembelajaran
                        </h3>
                        <p className="text-white/90 text-sm poppins-medium">
                          Video yang Mbah rekomendasikan untuk {studentName}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 mt-3">
                      <p className="text-white/95 text-xs poppins-regular">
                        💡 <span className="poppins-semibold">Info:</span> Video
                        ini sama yang dilihat siswa
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {videoRecommendations.map((video, index) => {
                      if (!video.url && !video.videoUrl) return null;

                      const videoUrl = video.url || video.videoUrl || "";
                      const videoId = extractYouTubeId(videoUrl);
                      const thumbnail = getYouTubeThumbnail(videoUrl);
                      const videoTitle =
                        video.title ||
                        video.judul ||
                        `Video Pembelajaran ${index + 1}`;
                      const videoGrade = video.grade || "Kelas 4-5";
                      const videoDescription = video.description || "";
                      const videoDuration = video.durasi || "";

                      return (
                        <div
                          key={video.id || `video-${index}`}
                          className="group rounded-xl overflow-hidden bg-white border-2 border-blue-200 hover:border-blue-400 transition-all duration-200 hover:shadow-xl"
                        >
                          {/* Thumbnail Section */}
                          <div className="relative aspect-video bg-gray-900">
                            <Image
                              src={thumbnail}
                              alt={videoTitle}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Play button overlay */}
                            <button
                              onClick={() => setSelectedVideo(videoId)}
                              className="absolute inset-0 flex items-center justify-center group/play hover:bg-black/20 transition-colors"
                            >
                              <div className="w-16 h-16 bg-[#336D82] rounded-full flex items-center justify-center shadow-xl group-hover/play:scale-110 group-hover/play:bg-[#2a5868] transition-transform">
                                <Play
                                  className="w-8 h-8 text-white ml-1"
                                  fill="white"
                                />
                              </div>
                            </button>

                            {/* Duration badge */}
                            {videoDuration && (
                              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/80 text-white text-xs font-semibold rounded">
                                {videoDuration}
                              </div>
                            )}
                          </div>

                          {/* Info Section */}
                          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="text-sm md:text-base font-bold text-gray-800 line-clamp-2 flex-1">
                                {videoTitle}
                              </p>
                              {videoGrade && (
                                <span className="inline-block bg-[#336D82] text-white text-[10px] px-2 py-1 rounded-full poppins-medium whitespace-nowrap">
                                  {videoGrade}
                                </span>
                              )}
                            </div>

                            {videoDescription && (
                              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                {videoDescription}
                              </p>
                            )}

                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedVideo(videoId)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#336D82] to-[#4a8fa3] text-white rounded-lg font-semibold text-sm hover:from-[#2a5868] hover:to-[#3d7a8a] transition-all active:scale-95 shadow-md"
                              >
                                <Play className="w-4 h-4" />
                                Tonton di Sini
                              </button>

                              <a
                                href={videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#336D82] border-2 border-[#336D82] rounded-lg font-semibold text-sm hover:bg-blue-50 transition-all active:scale-95"
                              >
                                <ExternalLink className="w-4 h-4" />
                                YouTube
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tips Box */}
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 flex items-start gap-3 mt-4">
                    <span className="text-2xl flex-shrink-0">💡</span>
                    <p className="text-sm text-yellow-800 poppins-medium">
                      <strong>Tips untuk Guru:</strong> Dorong siswa untuk
                      menonton video ini dan membuat catatan. Video ini dipilih
                      khusus sesuai dengan kebutuhan pembelajaran {studentName}.
                    </p>
                  </div>
                </div>
              )}

              {/* Video Player Modal */}
              {selectedVideo && (
                <div
                  className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-fadeIn"
                  onClick={() => setSelectedVideo(null)}
                >
                  <div
                    className="relative w-full max-w-5xl bg-black rounded-xl overflow-hidden shadow-2xl animate-slideUp"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close button */}
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors group"
                    >
                      <Close className="text-white group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Video iframe */}
                    <div className="relative aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Teacher Analysis Section */}
              {showTeacherAnalysis && teacherAnalysisData && (
                <div className="animate-fadeIn space-y-5">
                  {/* Header dengan Re-analyze Button */}
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[#336d82] text-xl poppins-bold flex items-center gap-2">
                      <span className="text-3xl">🎓</span>
                      Rekomendasi untuk Guru
                    </h3>

                    {/* Re-analyze Button */}
                    <button
                      onClick={handleReanalyzeForTeacher}
                      disabled={isReanalyzing || isAnalyzingForTeacher}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl poppins-semibold text-sm hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {isReanalyzing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Menganalisis Ulang...</span>
                        </>
                      ) : (
                        <>
                          <Replay className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                          <span>Analisis Ulang</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Info tentang analisis ulang */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">💡</span>
                    <div>
                      <p className="text-blue-800 text-xs poppins-medium leading-relaxed">
                        <span className="poppins-bold">Analisis Ulang:</span> Mbah akan menganalisis hasil kuis ini dari awal dengan AI dan memberikan rekomendasi strategi pembelajaran yang baru. Data analisis lama akan diganti.
                      </p>
                    </div>
                  </div>

                  {/* Diagnosis Pembelajaran */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white text-2xl">🔍</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-blue-800 text-base poppins-bold mb-1">
                          Diagnosis Pembelajaran
                        </h4>
                        <p className="text-blue-700/70 text-xs poppins-medium">
                          Analisis kondisi pembelajaran siswa
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm poppins-regular leading-relaxed">
                      {teacherAnalysisData.diagnosis_pembelajaran}
                    </p>
                  </div>

                  {/* Pola Belajar Siswa */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white text-2xl">📊</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-purple-800 text-base poppins-bold mb-1">
                          Pola Belajar Siswa
                        </h4>
                        <p className="text-purple-700/70 text-xs poppins-medium">
                          Identifikasi cara belajar siswa
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm poppins-regular leading-relaxed">
                      {teacherAnalysisData.pola_belajar_siswa}
                    </p>
                  </div>

                  {/* Level & ZPD */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white text-xl">📈</span>
                        </div>
                        <h4 className="text-green-800 text-sm poppins-bold">
                          Level Kemampuan Saat Ini
                        </h4>
                      </div>
                      <p className="text-green-700 text-2xl poppins-bold uppercase">
                        {teacherAnalysisData.level_kemampuan_saat_ini}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white text-xl">🎯</span>
                        </div>
                        <h4 className="text-amber-800 text-sm poppins-bold">
                          Zona Proximal Development
                        </h4>
                      </div>
                      <p className="text-gray-700 text-xs poppins-regular leading-relaxed">
                        {teacherAnalysisData.zona_proximal_development}
                      </p>
                    </div>
                  </div>

                  {/* Rekomendasi Metode Mengajar */}
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white text-2xl">💡</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-cyan-800 text-base poppins-bold mb-1">
                          Rekomendasi Metode Mengajar
                        </h4>
                        <p className="text-cyan-700/70 text-xs poppins-medium">
                          Strategi mengajar yang efektif untuk siswa ini
                        </p>
                      </div>
                    </div>

                    {/* Check if rekomendasi_metode_mengajar is array or string */}
                    {Array.isArray(teacherAnalysisData.rekomendasi_metode_mengajar) ? (
                      <div className="space-y-4">
                        {teacherAnalysisData.rekomendasi_metode_mengajar.map((metode: any, index: number) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl p-5 shadow-sm border border-cyan-100"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm poppins-bold flex-shrink-0">
                                {index + 1}
                              </div>
                              <h5 className="text-cyan-800 text-sm poppins-bold flex-1">
                                {metode.nama}
                              </h5>
                            </div>
                            <p className="text-gray-700 text-sm poppins-regular leading-relaxed pl-11">
                              {metode.penjelasan}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white/60 rounded-xl p-4">
                        <p className="text-gray-700 text-sm poppins-regular leading-relaxed whitespace-pre-wrap">
                          {teacherAnalysisData.rekomendasi_metode_mengajar}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Strategi Differensiasi */}
                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200">
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white text-2xl">🎨</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-rose-800 text-base poppins-bold mb-1">
                          Strategi Differensiasi
                        </h4>
                        <p className="text-rose-700/70 text-xs poppins-medium">
                          Cara menyesuaikan pembelajaran dengan kebutuhan siswa
                        </p>
                      </div>
                    </div>

                    {/* Check if strategi_differensiasi is object or string */}
                    {typeof teacherAnalysisData.strategi_differensiasi === 'object' &&
                     !Array.isArray(teacherAnalysisData.strategi_differensiasi) &&
                     teacherAnalysisData.strategi_differensiasi !== null &&
                     (teacherAnalysisData.strategi_differensiasi.konten ||
                      teacherAnalysisData.strategi_differensiasi.proses ||
                      teacherAnalysisData.strategi_differensiasi.produk) ? (
                      <div className="space-y-4">
                        {/* Diferensiasi Konten */}
                        {teacherAnalysisData.strategi_differensiasi.konten && (
                          <div className="bg-white rounded-xl p-5 shadow-sm border border-rose-100">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 bg-rose-500 text-white rounded-lg flex items-center justify-center text-sm poppins-bold">
                                📚
                              </div>
                              <h5 className="text-rose-800 text-sm poppins-bold">
                                Diferensiasi Konten
                              </h5>
                            </div>
                            <p className="text-gray-700 text-sm poppins-regular leading-relaxed pl-10">
                              {teacherAnalysisData.strategi_differensiasi.konten}
                            </p>
                          </div>
                        )}

                        {/* Diferensiasi Proses */}
                        {teacherAnalysisData.strategi_differensiasi.proses && (
                          <div className="bg-white rounded-xl p-5 shadow-sm border border-rose-100">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 bg-rose-500 text-white rounded-lg flex items-center justify-center text-sm poppins-bold">
                                ⚙️
                              </div>
                              <h5 className="text-rose-800 text-sm poppins-bold">
                                Diferensiasi Proses
                              </h5>
                            </div>
                            <p className="text-gray-700 text-sm poppins-regular leading-relaxed pl-10">
                              {teacherAnalysisData.strategi_differensiasi.proses}
                            </p>
                          </div>
                        )}

                        {/* Diferensiasi Produk */}
                        {teacherAnalysisData.strategi_differensiasi.produk && (
                          <div className="bg-white rounded-xl p-5 shadow-sm border border-rose-100">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 bg-rose-500 text-white rounded-lg flex items-center justify-center text-sm poppins-bold">
                                🎯
                              </div>
                              <h5 className="text-rose-800 text-sm poppins-bold">
                                Diferensiasi Produk
                              </h5>
                            </div>
                            <p className="text-gray-700 text-sm poppins-regular leading-relaxed pl-10">
                              {teacherAnalysisData.strategi_differensiasi.produk}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-white/60 rounded-xl p-4">
                        <p className="text-gray-700 text-sm poppins-regular leading-relaxed">
                          {typeof teacherAnalysisData.strategi_differensiasi === 'string'
                            ? teacherAnalysisData.strategi_differensiasi
                            : 'Tidak ada data strategi diferensiasi'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Aktivitas Pembelajaran */}
                  {Array.isArray(teacherAnalysisData.aktivitas_pembelajaran) &&
                    teacherAnalysisData.aktivitas_pembelajaran.length > 0 && (
                      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200">
                        <div className="flex items-start gap-3 mb-5">
                          <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                            <span className="text-white text-2xl">📚</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-violet-800 text-base poppins-bold mb-1">
                              Aktivitas Pembelajaran
                            </h4>
                            <p className="text-violet-700/70 text-xs poppins-medium">
                              Aktivitas yang bisa langsung diterapkan di kelas
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {(
                            teacherAnalysisData.aktivitas_pembelajaran as AktivitasPembelajaran[]
                          ).map((aktivitas, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-xl p-5 shadow-sm border border-violet-100"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <h5 className="text-violet-800 text-sm poppins-bold flex items-center gap-2">
                                  <span className="bg-violet-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                    {index + 1}
                                  </span>
                                  {aktivitas.nama}
                                </h5>
                                <span className="text-xs bg-violet-100 text-violet-700 px-3 py-1 rounded-full poppins-medium">
                                  {aktivitas.durasi}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm poppins-regular mb-3 leading-relaxed">
                                {aktivitas.deskripsi}
                              </p>
                              <div className="bg-violet-50 rounded-lg p-3">
                                <p className="text-violet-700 text-xs poppins-medium">
                                  <span className="font-bold">🎯 Tujuan:</span>{" "}
                                  {aktivitas.tujuan}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Tips Praktis */}
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200">
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white text-2xl">⭐</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-yellow-800 text-base poppins-bold mb-1">
                          Tips Praktis
                        </h4>
                        <p className="text-yellow-700/70 text-xs poppins-medium">
                          Tips yang bisa langsung diterapkan besok di kelas
                        </p>
                      </div>
                    </div>

                    {/* Check if tips_praktis is array or string */}
                    {Array.isArray(teacherAnalysisData.tips_praktis) ? (
                      <div className="bg-white/60 rounded-xl p-5">
                        <ul className="space-y-3">
                          {teacherAnalysisData.tips_praktis.map((tip: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-gray-700 text-sm poppins-regular leading-relaxed"
                            >
                              <span className="text-yellow-600 text-base flex-shrink-0 mt-0.5">
                                •
                              </span>
                              <span className="flex-1">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-white/60 rounded-xl p-4">
                        <p className="text-gray-700 text-sm poppins-regular leading-relaxed whitespace-pre-wrap">
                          {teacherAnalysisData.tips_praktis}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Indikator Progress */}
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white text-2xl">📊</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-teal-800 text-base poppins-bold mb-1">
                          Indikator Progress
                        </h4>
                        <p className="text-teal-700/70 text-xs poppins-medium">
                          Cara mengukur kemajuan siswa dalam 2-4 minggu
                        </p>
                      </div>
                    </div>

                    {/* Check if indikator_progress is array or string */}
                    {Array.isArray(teacherAnalysisData.indikator_progress) ? (
                      <div className="bg-white/60 rounded-xl p-5">
                        <ul className="space-y-3">
                          {teacherAnalysisData.indikator_progress.map((indikator: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-gray-700 text-sm poppins-regular leading-relaxed"
                            >
                              <span className="text-teal-600 text-base flex-shrink-0 mt-0.5">
                                ✓
                              </span>
                              <span className="flex-1">{indikator}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-white/60 rounded-xl p-4">
                        <p className="text-gray-700 text-sm poppins-regular leading-relaxed whitespace-pre-wrap">
                          {teacherAnalysisData.indikator_progress}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Video Rekomendasi untuk Guru - HANYA tampilkan jika ada */}
                  {Array.isArray(teacherAnalysisData.rekomendasi_video_guru) &&
                    teacherAnalysisData.rekomendasi_video_guru.length > 0 && (
                      <div>
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-5 mb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">🎥</span>
                            <div>
                              <h3 className="text-white text-lg poppins-bold">
                                Video Strategi Pembelajaran untuk Guru
                              </h3>
                              <p className="text-white/90 text-sm poppins-medium">
                                Video tentang metode & gaya mengajar yang efektif
                              </p>
                            </div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 mt-3">
                            <p className="text-white/95 text-xs poppins-regular">
                              💡 Video ini fokus pada <span className="poppins-semibold">strategi pembelajaran</span> (scaffolding, differensiasi, assessment), bukan konten materi
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {(
                            teacherAnalysisData.rekomendasi_video_guru as RekomendasiVideoGuru[]
                          ).map((video, index) => {
                            const videoUrl = video.url || "";
                            const videoId = extractYouTubeId(videoUrl);
                            const thumbnail = getYouTubeThumbnail(videoUrl);

                            return (
                              <div
                                key={index}
                                className="group rounded-xl overflow-hidden bg-white border-2 border-red-200 hover:border-red-400 transition-all duration-200 hover:shadow-xl"
                              >
                                <div className="relative aspect-video bg-gray-900">
                                  <Image
                                    src={thumbnail}
                                    alt={video.judul || "Video"}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                  <button
                                    onClick={() => setSelectedVideo(videoId)}
                                    className="absolute inset-0 flex items-center justify-center group/play hover:bg-black/20 transition-colors"
                                  >
                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover/play:scale-110 group-hover/play:bg-red-700 transition-transform">
                                      <Play
                                        className="w-8 h-8 text-white ml-1"
                                        fill="white"
                                      />
                                    </div>
                                  </button>
                                  {video.durasi && (
                                    <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/80 text-white text-xs font-semibold rounded">
                                      {video.durasi}
                                    </div>
                                  )}
                                </div>

                                <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <p className="text-sm md:text-base font-bold text-gray-800 line-clamp-2 flex-1">
                                      {video.judul}
                                    </p>
                                    {video.fokus && (
                                      <span className="inline-block bg-red-500 text-white text-[10px] px-2 py-1 rounded-full poppins-medium whitespace-nowrap">
                                        {video.fokus}
                                      </span>
                                    )}
                                  </div>
                                  {video.bahasa && (
                                    <p className="text-xs text-gray-600 mb-3">
                                      Bahasa: {video.bahasa}
                                    </p>
                                  )}
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setSelectedVideo(videoId)}
                                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold text-sm hover:from-red-600 hover:to-pink-600 transition-all active:scale-95 shadow-md"
                                    >
                                      <Play className="w-4 h-4" />
                                      Tonton
                                    </button>
                                    <a
                                      href={videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-500 border-2 border-red-500 rounded-lg font-semibold text-sm hover:bg-red-50 transition-all active:scale-95"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                      YouTube
                                    </a>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* Info jika tidak ada video */}
                  {(!teacherAnalysisData.rekomendasi_video_guru ||
                    (Array.isArray(teacherAnalysisData.rekomendasi_video_guru) &&
                      teacherAnalysisData.rekomendasi_video_guru.length === 0)) && (
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">📚</span>
                        <div>
                          <h4 className="text-gray-700 text-sm poppins-bold mb-2">
                            Tidak Ada Video Strategi Pembelajaran
                          </h4>
                          <p className="text-gray-600 text-xs poppins-regular leading-relaxed">
                            Saat ini tidak ada video yang relevan dengan strategi pembelajaran yang direkomendasikan.
                            Anda tetap bisa menerapkan metode dan tips yang sudah diberikan di atas tanpa video referensi.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error Display for Teacher Analysis */}
              {teacherAnalysisError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">⚠️</span>
                  <p className="text-sm text-red-600 poppins-medium">
                    {teacherAnalysisError}
                  </p>
                </div>
              )}

              {/* Teacher Analysis Button */}
              {!showTeacherAnalysis && (
                <div className="pt-4 border-t-2 border-gray-200">
                  {/* Decorative Info Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 mb-4 border-2 border-purple-200">
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 bg-white rounded-full p-2 shadow-lg border-2 border-purple-300">
                          <Image
                            src="/mascot/mbah-adaptivin.svg"
                            alt="Mbah Adaptivin"
                            width={56}
                            height={56}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        {/* Thinking bubble */}
                        <div className="absolute -top-1 -right-1 text-xl animate-bounce">
                          💭
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-purple-800 text-base poppins-bold mb-2 flex items-center gap-2">
                          <span>🎓</span>
                          Butuh Strategi Pembelajaran?
                        </h4>
                        <p className="text-purple-700 text-sm poppins-medium leading-relaxed mb-3">
                          Mbah Adaptivin bisa memberikan rekomendasi khusus
                          untuk guru tentang cara terbaik membimbing{" "}
                          <span className="poppins-bold">{studentName}</span>{" "}
                          berdasarkan hasil analisis ini!
                        </p>
                        <div className="flex items-start gap-2 text-xs text-purple-600">
                          <span className="flex-shrink-0">✨</span>
                          <p className="poppins-regular">
                            <span className="poppins-semibold">Fitur AI:</span>{" "}
                            Strategi pembelajaran personal, prediksi
                            perkembangan, dan langkah praktis yang bisa langsung
                            diterapkan!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Button */}
                  <button
                    onClick={() => handleTeacherAnalysis(false)}
                    disabled={isAnalyzingForTeacher}
                    className="relative w-full overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-6 py-4 rounded-2xl poppins-bold text-base hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {/* Shimmer effect */}
                    {!isAnalyzingForTeacher && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </div>
                    )}

                    <div className="relative z-10 flex items-center justify-center gap-3">
                      {isAnalyzingForTeacher ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>
                            Mbah sedang meramal strategi pembelajaran...
                          </span>
                          <span className="text-xl animate-pulse">🔮</span>
                        </>
                      ) : (
                        <>
                          <span className="text-2xl group-hover:scale-110 transition-transform">
                            🎓
                          </span>
                          <span className="group-hover:tracking-wide transition-all">
                            Minta Mbah Ramalkan Strategi untuk Guru!
                          </span>
                          <span className="text-2xl group-hover:rotate-12 transition-transform">
                            ✨
                          </span>
                        </>
                      )}
                    </div>

                    {/* Glow effect */}
                    {!isAnalyzingForTeacher && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute inset-0 bg-gradient-to-t from-yellow-300/20 to-transparent"></div>
                      </div>
                    )}
                  </button>

                  {/* Helper text */}
                  <p className="text-center text-xs text-gray-500 mt-3 poppins-regular italic">
                    💡 Klik tombol di atas untuk mendapatkan analisis mendalam
                    dan rekomendasi dari Mbah Adaptivin
                  </p>
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
