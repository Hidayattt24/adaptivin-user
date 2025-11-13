"use client";

import React, { useState } from "react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Video,
  Target,
  AlertCircle,
  RefreshCw,
  Play,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/siswa/kuis/MarkdownRenderer";
import { createTeacherAnalysis } from "@/lib/api/analisis";

interface AnalisisData {
  hasil_kuis_id?: string;
  analisis: string;
  level_tertinggi: string;
  level_terendah: string;
  kelebihan: string;
  kelemahan: string;
  rekomendasi_belajar: string;
  rekomendasi_video: string | object | null;
}

interface AnalysisAISectionProps {
  studentName: string;
  materiTitle: string;
  analisisData?: AnalisisData | null;
  isLoading?: boolean;
  className?: string;
  hasilKuisId?: string; // For teacher re-analysis
  onAnalysisComplete?: () => void; // Callback after teacher analysis
}

const AnalysisAISection: React.FC<AnalysisAISectionProps> = ({
  studentName,
  materiTitle,
  analisisData,
  isLoading = false,
  className = "",
  hasilKuisId,
  onAnalysisComplete,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(\?v=))([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[8].length === 11 ? match[8] : null;
  };

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (url: string): string => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return "";
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  // Handler for teacher re-analysis
  const handleTeacherAnalysis = async () => {
    if (!hasilKuisId) {
      alert("ID hasil kuis tidak ditemukan");
      return;
    }

    const confirm = window.confirm(
      "Apakah Anda yakin ingin membuat analisis strategi pembelajaran untuk siswa ini?"
    );
    if (!confirm) return;

    setIsAnalyzing(true);
    try {
      await createTeacherAnalysis(hasilKuisId);
      alert("Analisis strategi pembelajaran berhasil dibuat!");
      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (error) {
      console.error("Error creating teacher analysis:", error);
      const errorMessage = error instanceof Error ? error.message : "Gagal membuat analisis. Silakan coba lagi.";
      alert(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };
  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-8 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!analisisData) {
    return (
      <div
        className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 border-2 border-blue-200 ${className}`}
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-200 rounded-full mb-4">
            <AlertCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl poppins-bold text-blue-800 mb-3">
            Siswa Belum Menganalisis Hasil Kuis
          </h3>
          <p className="text-blue-700 poppins-regular mb-6 max-w-md mx-auto">
            Siswa <span className="poppins-semibold">{studentName}</span> belum
            melakukan analisis AI untuk materi{" "}
            <span className="poppins-semibold">{materiTitle}</span>.
          </p>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-600 poppins-medium">
              💡 <span className="poppins-semibold">Tips:</span> Analisis AI
              akan tersedia setelah siswa menyelesaikan kuis dan melakukan
              analisis hasil kuisnya.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Parse video recommendations if available
  let videoLinks: Array<{ judul?: string; url: string }> = [];
  if (analisisData.rekomendasi_video) {
    try {
      let parsedData: string[] | Array<{ judul?: string; url: string }>;
      if (typeof analisisData.rekomendasi_video === 'string') {
        parsedData = JSON.parse(analisisData.rekomendasi_video);
      } else {
        parsedData = analisisData.rekomendasi_video as string[] | Array<{ judul?: string; url: string }>;
      }

      // Handle array of strings or array of objects
      if (Array.isArray(parsedData)) {
        videoLinks = parsedData
          .map((item) => {
            if (typeof item === 'string') {
              return { url: item };
            } else if (item && typeof item === 'object' && item.url) {
              return { judul: item.judul, url: item.url };
            }
            return null;
          })
          .filter((item): item is { judul?: string; url: string } => item !== null);
      }
    } catch {
      videoLinks = [];
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#336D82] to-[#4A8BA6] rounded-2xl p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-white/20 rounded-xl">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl poppins-bold text-white mb-2">
              Analisis AI untuk {studentName}
            </h2>
            <p className="text-white/90 poppins-regular">
              Materi: <span className="poppins-semibold">{materiTitle}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Analysis */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl poppins-bold text-gray-800">
            Ringkasan Analisis
          </h3>
        </div>
        <MarkdownRenderer
          content={analisisData.analisis}
          className="text-gray-700 poppins-regular leading-relaxed"
        />
      </div>

      {/* Level Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Highest Level */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-200 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="text-lg poppins-bold text-green-800">
              Level Tertinggi Dikuasai
            </h3>
          </div>
          <p className="text-3xl poppins-bold text-green-700 mb-2">
            {analisisData.level_tertinggi.toUpperCase()}
          </p>
          <p className="text-sm text-green-600 poppins-regular">
            Siswa menunjukkan pemahaman baik pada level ini
          </p>
        </div>

        {/* Lowest Level */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-orange-200 rounded-xl">
              <TrendingDown className="w-6 h-6 text-orange-700" />
            </div>
            <h3 className="text-lg poppins-bold text-orange-800">
              Level Perlu Ditingkatkan
            </h3>
          </div>
          <p className="text-3xl poppins-bold text-orange-700 mb-2">
            {analisisData.level_terendah.toUpperCase()}
          </p>
          <p className="text-sm text-orange-600 poppins-regular">
            Fokus pembelajaran pada level ini
          </p>
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg poppins-bold text-gray-800">Kelebihan</h3>
          </div>
          <MarkdownRenderer
            content={analisisData.kelebihan}
            className="text-gray-700 poppins-regular text-sm leading-relaxed"
          />
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg poppins-bold text-gray-800">Kelemahan</h3>
          </div>
          <MarkdownRenderer
            content={analisisData.kelemahan}
            className="text-gray-700 poppins-regular text-sm leading-relaxed"
          />
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-200 rounded-xl">
            <Lightbulb className="w-6 h-6 text-purple-700" />
          </div>
          <h3 className="text-lg poppins-bold text-purple-800">
            Rekomendasi Pembelajaran
          </h3>
        </div>
        <MarkdownRenderer
          content={analisisData.rekomendasi_belajar}
          className="text-gray-700 poppins-regular text-sm leading-relaxed"
        />
      </div>

      {/* Video Recommendations */}
      {videoLinks.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Video className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg poppins-bold text-gray-800">
              Rekomendasi Video Pembelajaran
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videoLinks.map((video, index) => {
              const thumbnail = getYouTubeThumbnail(video.url);
              const videoId = getYouTubeVideoId(video.url);

              return (
                <a
                  key={index}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-red-300"
                >
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video bg-gray-200">
                    {thumbnail && videoId ? (
                      <>
                        <img
                          src={thumbnail}
                          alt={video.judul || `Video ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <Play className="w-8 h-8 text-white ml-1" fill="white" />
                          </div>
                        </div>
                        {/* Duration Badge (if available) */}
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded poppins-semibold">
                          YouTube
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <p className="text-sm poppins-semibold text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors mb-1">
                      {video.judul || `Video Pembelajaran ${index + 1}`}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {video.url}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        {hasilKuisId && (
          <button
            onClick={handleTeacherAnalysis}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-gradient-to-r from-[#336D82] to-[#4A8BA6] text-white rounded-xl poppins-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                Analisis untuk Guru
              </>
            )}
          </button>
        )}
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl poppins-semibold hover:bg-gray-200 transition-colors"
        >
          Cetak Analisis
        </button>
      </div>
    </div>
  );
};

export default AnalysisAISection;
