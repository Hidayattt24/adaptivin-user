"use client";

import React, { useState, useEffect } from "react";
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
  Sparkles,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/siswa/kuis/MarkdownRenderer";
import { createTeacherAnalysis, AnalisisAIGuru, getTeacherAnalysisByHasilKuis, deleteTeacherAnalysis } from "@/lib/api/analisis";
import Swal from "sweetalert2";

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
  analisisGuru?: AnalisisAIGuru | null; // Teacher analysis from database
  isLoading?: boolean;
  className?: string;
  hasilKuisId?: string; // For teacher re-analysis
  onAnalysisComplete?: () => void; // Callback after teacher analysis
}

const AnalysisAISection: React.FC<AnalysisAISectionProps> = ({
  studentName,
  materiTitle,
  analisisData,
  analisisGuru,
  isLoading = false,
  className = "",
  hasilKuisId,
  onAnalysisComplete,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [teacherAnalysis, setTeacherAnalysis] = useState<AnalisisAIGuru | null>(analisisGuru || null);
  const [showTeacherAnalysis, setShowTeacherAnalysis] = useState(!!analisisGuru);

  // Helper function to parse JSON strings and format as markdown
  const parseAndFormatJSON = (data: string | object | unknown[]): string => {
    if (!data) return "Data tidak tersedia";

    // If already a string and not JSON, return as is
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return parseAndFormatJSON(parsed);
      } catch {
        // Not JSON, return as is
        return data;
      }
    }

    // If it's an array
    if (Array.isArray(data)) {
      if (data.length === 0) return "Tidak ada data";

      // Check if it's a simple string array
      const isSimpleStringArray = data.every(item => typeof item === 'string');
      
      if (isSimpleStringArray) {
        // Format simple string arrays as a nice bullet list
        return data.map((item, index) => `**${index + 1}.** ${item}`).join('\n\n');
      }

      // Format as markdown list with better styling for object arrays
      return data.map((item, index) => {
        if (typeof item === 'object') {
          // For objects with nama and penjelasan, create a beautiful formatted section
          if (item.nama || item.judul) {
            const title = item.nama || item.judul;
            const description = item.penjelasan || item.deskripsi || item.keterangan || '';
            
            // Format: heading with title, then description
            let formatted = `### ${index + 1}. ${title}\n\n`;
            
            if (description) {
              formatted += `${description}\n`;
            }
            
            // Add any other fields (excluding nama, judul, penjelasan, deskripsi, keterangan)
            const otherFields = Object.entries(item)
              .filter(([key]) => !['nama', 'judul', 'penjelasan', 'deskripsi', 'keterangan'].includes(key))
              .filter(([, value]) => value !== null && value !== undefined);
            
            if (otherFields.length > 0) {
              formatted += '\n';
              otherFields.forEach(([key, value]) => {
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                formatted += `**${formattedKey}**: ${value}\n\n`;
              });
            }
            
            return formatted;
          }
          
          // Fallback for objects without nama/judul
          const entries = Object.entries(item)
            .filter(([, value]) => value !== null && value !== undefined)
            .map(([key, value]) => {
              const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              return `- **${formattedKey}**: ${value}`;
            });
          return `**${index + 1}.**\n${entries.join('\n')}\n`;
        }
        return `${index + 1}. ${item}`;
      }).join('\n\n');
    }

    // If it's an object
    if (typeof data === 'object') {
      // Special handling for strategi_differensiasi structure
      if ('konten' in data || 'proses' in data || 'produk' in data) {
        const strategiData = data as { konten?: string; proses?: string; produk?: string };
        let formatted = '';
        
        if (strategiData.konten) {
          formatted += `### 📚 Diferensiasi Konten\n\n${strategiData.konten}\n\n`;
        }
        
        if (strategiData.proses) {
          formatted += `### ⚙️ Diferensiasi Proses\n\n${strategiData.proses}\n\n`;
        }
        
        if (strategiData.produk) {
          formatted += `### 🎯 Diferensiasi Produk\n\n${strategiData.produk}\n\n`;
        }
        
        return formatted.trim();
      }
      
      // General object formatting
      const entries = Object.entries(data)
        .filter(([, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
          const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          return `- **${formattedKey}**: ${value}`;
        });
      return entries.join('\n');
    }

    return String(data);
  };

  // Fetch existing teacher analysis when component mounts or hasilKuisId changes
  useEffect(() => {
    const fetchTeacherAnalysis = async () => {
      if (hasilKuisId && !analisisGuru) {
        try {
          const analysis = await getTeacherAnalysisByHasilKuis(hasilKuisId);
          if (analysis) {
            setTeacherAnalysis(analysis);
            setShowTeacherAnalysis(true);
          }
        } catch {
          // Silently fail - teacher analysis might not exist yet
          console.log("No teacher analysis found yet");
        }
      } else if (analisisGuru) {
        setTeacherAnalysis(analisisGuru);
        setShowTeacherAnalysis(true);
      }
    };

    fetchTeacherAnalysis();
  }, [hasilKuisId, analisisGuru]);

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
      await Swal.fire({
        icon: "error",
        title: "ID Tidak Ditemukan",
        text: "ID hasil kuis tidak ditemukan",
        confirmButtonColor: "#336D82",
      });
      return;
    }

    // Check if this is re-analysis (analysis already exists)
    const isReanalysis = !!teacherAnalysis;

    const result = await Swal.fire({
      title: isReanalysis ? "Analisis Ulang Strategi Pembelajaran" : "Analisis Strategi Pembelajaran",
      html: `
        <div class="text-left">
          ${isReanalysis ? '<p class="mb-3 text-orange-600 font-semibold">⚠️ Analisis sebelumnya akan dihapus dan diganti dengan analisis baru.</p>' : ''}
          <p class="mb-3">Fitur ini akan menghasilkan:</p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Diagnosis pembelajaran siswa</li>
            <li>Pola belajar dan zona proximal development</li>
            <li>Strategi differensiasi yang personalized</li>
            <li>Aktivitas pembelajaran yang sesuai</li>
            <li>Rekomendasi video untuk guru</li>
          </ul>
          <p class="mt-4 text-sm text-gray-600">Proses ini memerlukan waktu sekitar 30-60 detik.</p>
        </div>
      `,
      icon: isReanalysis ? "warning" : "question",
      showCancelButton: true,
      confirmButtonColor: isReanalysis ? "#f59e0b" : "#336D82",
      cancelButtonColor: "#d33",
      confirmButtonText: isReanalysis ? '<i class="fas fa-refresh"></i> Ya, Analisis Ulang!' : '<i class="fas fa-brain"></i> Ya, Analisis Sekarang!',
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-2xl",
        title: "text-2xl font-bold text-[#336D82]",
      },
    });

    if (!result.isConfirmed) return;

    // Show loading
    Swal.fire({
      title: "Sedang Menganalisis...",
      html: `
        <div class="flex flex-col items-center">
          <div class="mb-4">
            <svg class="animate-spin h-16 w-16 text-[#336D82]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-gray-600">AI sedang menganalisis hasil kuis siswa...</p>
          <p class="text-sm text-gray-500 mt-2">Mohon tunggu sebentar</p>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      customClass: {
        popup: "rounded-2xl",
      },
    });

    setIsAnalyzing(true);
    try {
      // If re-analysis, delete the old analysis first
      if (isReanalysis && teacherAnalysis?.id) {
        try {
          await deleteTeacherAnalysis(teacherAnalysis.id);
        } catch (deleteError) {
          console.error("Error deleting old analysis:", deleteError);
          // Continue with creating new analysis even if delete fails
        }
      }

      const analysis = await createTeacherAnalysis(hasilKuisId);
      setTeacherAnalysis(analysis);
      setShowTeacherAnalysis(true);

      await Swal.fire({
        icon: "success",
        title: isReanalysis ? "Analisis Ulang Berhasil!" : "Analisis Berhasil!",
        html: `
          <div class="text-left">
            <p class="mb-3">${isReanalysis ? 'Analisis strategi pembelajaran telah diperbarui!' : 'Analisis strategi pembelajaran telah selesai dibuat!'}</p>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <p class="text-sm text-gray-700">✨ Anda dapat melihat hasil analisis lengkap di bawah ini</p>
              <p class="text-sm text-gray-700 mt-2">📊 Termasuk strategi differensiasi dan aktivitas pembelajaran</p>
            </div>
          </div>
        `,
        confirmButtonColor: "#336D82",
        confirmButtonText: "Lihat Hasil Analisis",
        customClass: {
          popup: "rounded-2xl",
          title: "text-2xl font-bold text-green-600",
        },
      }); if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (error) {
      console.error("Error creating teacher analysis:", error);
      const errorMessage = error instanceof Error ? error.message : "Gagal membuat analisis. Silakan coba lagi.";

      await Swal.fire({
        icon: "error",
        title: "Analisis Gagal",
        text: errorMessage,
        confirmButtonColor: "#336D82",
        customClass: {
          popup: "rounded-2xl",
        },
      });
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
    <div id="analysis-section" className={`space-y-6 ${className}`}>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Teacher Analysis Section */}
      {showTeacherAnalysis && teacherAnalysis && (
        <div className="mt-8 space-y-6 border-t-4 border-purple-300 pt-8">
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 rounded-2xl p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-white/20 rounded-xl">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  <h2 className="text-2xl poppins-bold text-white">
                    Analisis Strategi Pembelajaran (Guru)
                  </h2>
                </div>
                <p className="text-white/90 poppins-regular">
                  Rekomendasi khusus untuk pengajaran efektif
                </p>
              </div>
            </div>
          </div>

          {/* Diagnosis Pembelajaran */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl poppins-bold text-gray-800">
                Diagnosis Pembelajaran
              </h3>
            </div>
            <MarkdownRenderer
              content={teacherAnalysis.diagnosis_pembelajaran}
              className="text-gray-700 poppins-regular leading-relaxed"
            />
          </div>

          {/* Pola Belajar & Level Kemampuan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border-2 border-indigo-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-200 rounded-xl">
                  <Target className="w-6 h-6 text-indigo-700" />
                </div>
                <h3 className="text-lg poppins-bold text-indigo-800">
                  Pola Belajar Siswa
                </h3>
              </div>
              <MarkdownRenderer
                content={teacherAnalysis.pola_belajar_siswa}
                className="text-gray-700 poppins-regular text-sm leading-relaxed"
              />
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 border-2 border-teal-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-teal-200 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-teal-700" />
                </div>
                <h3 className="text-lg poppins-bold text-teal-800">
                  Level Kemampuan Saat Ini
                </h3>
              </div>
              <MarkdownRenderer
                content={teacherAnalysis.level_kemampuan_saat_ini}
                className="text-gray-700 poppins-regular text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Zona Proximal Development */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border-2 border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-200 rounded-xl">
                <Lightbulb className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-lg poppins-bold text-amber-800">
                Zona Proximal Development (ZPD)
              </h3>
            </div>
            <MarkdownRenderer
              content={teacherAnalysis.zona_proximal_development}
              className="text-gray-700 poppins-regular leading-relaxed"
            />
          </div>

          {/* Strategi Differensiasi & Metode Mengajar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg poppins-bold text-gray-800">
                  Strategi Differensiasi
                </h3>
              </div>
              <MarkdownRenderer
                content={parseAndFormatJSON(teacherAnalysis.strategi_differensiasi)}
                className="text-gray-700 poppins-regular text-sm leading-relaxed"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg poppins-bold text-gray-800">
                  Rekomendasi Metode Mengajar
                </h3>
              </div>
              <MarkdownRenderer
                content={parseAndFormatJSON(teacherAnalysis.rekomendasi_metode_mengajar)}
                className="text-gray-700 poppins-regular text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Tips Praktis & Indikator Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-200 rounded-xl">
                  <Lightbulb className="w-6 h-6 text-green-700" />
                </div>
                <h3 className="text-lg poppins-bold text-green-800">
                  Tips Praktis
                </h3>
              </div>
              <MarkdownRenderer
                content={parseAndFormatJSON(teacherAnalysis.tips_praktis)}
                className="text-gray-700 poppins-regular text-sm leading-relaxed"
              />
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-200 rounded-xl">
                  <Target className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="text-lg poppins-bold text-blue-800">
                  Indikator Progress
                </h3>
              </div>
              <MarkdownRenderer
                content={parseAndFormatJSON(teacherAnalysis.indikator_progress)}
                className="text-gray-700 poppins-regular text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Aktivitas Pembelajaran */}
          <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-6 border-2 border-rose-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-rose-200 rounded-xl">
                <BookOpen className="w-6 h-6 text-rose-700" />
              </div>
              <h3 className="text-lg poppins-bold text-rose-800">
                Aktivitas Pembelajaran
              </h3>
            </div>
            <MarkdownRenderer
              content={parseAndFormatJSON(teacherAnalysis.aktivitas_pembelajaran)}
              className="text-gray-700 poppins-regular leading-relaxed"
            />
          </div>

          {/* Rekomendasi Video Untuk Guru */}
          {(() => {
            // Parse teacher video recommendations
            let teacherVideoLinks: Array<{ judul?: string; url: string; fokus?: string; durasi?: string }> = [];
            if (teacherAnalysis.rekomendasi_video_guru) {
              try {
                let parsedData: string[] | Array<{ judul?: string; url: string; fokus?: string; durasi?: string }>;
                if (typeof teacherAnalysis.rekomendasi_video_guru === 'string') {
                  parsedData = JSON.parse(teacherAnalysis.rekomendasi_video_guru);
                } else {
                  parsedData = teacherAnalysis.rekomendasi_video_guru as string[] | Array<{ judul?: string; url: string; fokus?: string; durasi?: string }>;
                }

                // Handle array of strings or array of objects
                if (Array.isArray(parsedData)) {
                  teacherVideoLinks = parsedData
                    .map((item) => {
                      if (typeof item === 'string') {
                        return { url: item };
                      } else if (item && typeof item === 'object' && item.url) {
                        return { judul: item.judul, url: item.url, fokus: item.fokus, durasi: item.durasi };
                      }
                      return null;
                    })
                    .filter((item): item is { judul?: string; url: string; fokus?: string; durasi?: string } => item !== null);
                }
              } catch {
                teacherVideoLinks = [];
              }
            }

            if (teacherVideoLinks.length > 0) {
              return (
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Video className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg poppins-bold text-gray-800">
                      Rekomendasi Video untuk Guru
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {teacherVideoLinks.map((video, index) => {
                      const thumbnail = getYouTubeThumbnail(video.url);
                      const videoId = getYouTubeVideoId(video.url);

                      return (
                        <a
                          key={index}
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-purple-300"
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
                                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                                  </div>
                                </div>
                                {/* Duration Badge */}
                                {video.durasi && (
                                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded poppins-semibold">
                                    {video.durasi}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Video className="w-12 h-12 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Video Info */}
                          <div className="p-4">
                            <p className="text-sm poppins-semibold text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors mb-1">
                              {video.judul || `Video Pembelajaran ${index + 1}`}
                            </p>
                            {video.fokus && (
                              <p className="text-xs text-gray-600 poppins-regular line-clamp-2">
                                {video.fokus}
                              </p>
                            )}
                            <div className="flex items-center gap-1 mt-2 text-purple-600">
                              <Play className="w-3 h-3" />
                              <span className="text-xs poppins-medium">Tonton Video</span>
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* Action Buttons */}
      <div className="no-print flex flex-wrap gap-4 justify-end">
        {hasilKuisId && (
          <button
            onClick={handleTeacherAnalysis}
            disabled={isAnalyzing}
            className={`group relative px-8 py-4 ${teacherAnalysis ? 'bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600' : 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600'} text-white rounded-xl poppins-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3 overflow-hidden`}
          >
            <div className={`absolute inset-0 ${teacherAnalysis ? 'bg-gradient-to-r from-orange-400 to-amber-400' : 'bg-gradient-to-r from-purple-400 to-indigo-400'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative flex items-center gap-3">
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span className="text-lg">Menganalisis...</span>
                </>
              ) : teacherAnalysis ? (
                <>
                  <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-300" />
                  <Brain className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-lg">Analisis Ulang</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <Brain className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-lg">Analisis untuk Guru</span>
                </>
              )}
            </div>
          </button>
        )}
        <button
          onClick={() => window.print()}
          className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl poppins-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span className="text-lg">Cetak Analisis</span>
        </button>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          /* Hide everything initially */
          body * {
            visibility: hidden;
          }
          
          /* Show the header */
          body {
            background: white !important;
          }
          
          /* Show performance chart */
          #performance-chart,
          #performance-chart * {
            visibility: visible;
          }
          
          /* Show the analysis section and its children */
          #analysis-section,
          #analysis-section * {
            visibility: visible;
          }
          
          /* Position sections for print */
          #performance-chart {
            position: relative;
            width: 100%;
            margin-bottom: 2rem;
            page-break-after: avoid;
          }
          
          #analysis-section {
            position: relative;
            width: 100%;
          }
          
          /* Hide buttons and non-essential elements */
          .no-print {
            display: none !important;
          }
          
          /* Ensure proper page breaks */
          .bg-white,
          .rounded-2xl {
            page-break-inside: avoid;
          }
          
          /* Remove shadows and adjust colors for print */
          .shadow-lg,
          .shadow-xl {
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
          }
          
          /* Ensure backgrounds print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Optimize spacing for print */
          .space-y-6 > * + * {
            margin-top: 1rem !important;
          }
          
          /* Ensure gradients print correctly */
          .bg-gradient-to-r,
          .bg-gradient-to-br {
            background-image: linear-gradient(to right, var(--tw-gradient-stops)) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalysisAISection;
