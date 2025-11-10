"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Video,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { AnalisisAI, RekomendasiVideo } from "@/lib/api/analisis";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface AnalisisAICardProps {
  analisis: AnalisisAI;
  onReanalyze?: () => void;
  isReanalyzing?: boolean;
}

export function AnalisisAICard({
  analisis,
  onReanalyze,
  isReanalyzing,
}: AnalisisAICardProps) {
  const renderRekomendasiVideo = () => {
    if (!analisis.rekomendasi_video) return null;

    let videos: RekomendasiVideo[] = [];

    // Parse jika string JSON
    if (typeof analisis.rekomendasi_video === "string") {
      try {
        videos = JSON.parse(analisis.rekomendasi_video);
      } catch {
        return null;
      }
    } else {
      videos = analisis.rekomendasi_video;
    }

    if (!Array.isArray(videos) || videos.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="bg-gradient-to-r from-[#336D82] to-[#7AB0C4] rounded-lg p-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎬</span>
            <h4 className="font-bold text-base text-white">
              Video Seru Buat Kamu!
            </h4>
          </div>
          <p className="text-white/90 text-sm">
            Mbah pilihkan video yang asyik buat kamu tonton! Klik aja langsung!
            👇
          </p>
        </div>
        <div className="space-y-3">
          {videos.map((video, index) => (
            <a
              key={index}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 transition-all duration-200 border-2 border-red-200 hover:border-red-400 hover:shadow-lg active:scale-[0.98]"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base font-bold text-gray-800 group-hover:text-red-600 transition-colors mb-1">
                  {video.judul || `Video Pembelajaran ${index + 1}`}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                    🎥 YouTube
                  </span>
                  {video.durasi && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                      ⏱️ {video.durasi}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 group-hover:text-red-600 transition-colors font-medium">
                    Klik untuk nonton! →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 flex items-start gap-2">
          <span className="text-xl flex-shrink-0">💡</span>
          <p className="text-xs text-yellow-800 font-medium">
            <strong>Tips Mbah:</strong> Tonton video sambil catat hal penting
            ya! Biar makin nempel di otak! 🧠✨
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="border-[#336D82]/30 bg-white rounded-[20px] shadow-lg overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-[#336D82] to-[#7AB0C4]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            {/* Mbah Adaptivin Avatar */}
            <div className="w-12 h-12 rounded-full bg-white p-1 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Image
                src="/mascot/mbah-adaptivin.svg"
                alt="Mbah Adaptivin"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                Mbah Adaptivin
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              </CardTitle>
              <p className="text-xs text-white/90 mt-1">
                Dianalisis pada{" "}
                {new Date(analisis.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <Badge
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm text-white whitespace-nowrap hover:bg-white/30 border border-white/30"
            >
              AI Generated
            </Badge>

            {onReanalyze && (
              <Button
                onClick={onReanalyze}
                disabled={isReanalyzing}
                size="sm"
                variant="outline"
                className="text-xs whitespace-nowrap border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-sm"
              >
                {isReanalyzing ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Analisis Ulang
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Info Card - Level Summary */}
        <div className="bg-gradient-to-br from-[#F0F7F9] to-white rounded-lg p-4 border border-[#336D82]/20 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#336D82] to-[#7AB0C4] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-[#336D82] text-base md:text-lg font-bold mb-2">
                📊 Hasil Analisis Kuis
              </h4>
              <div className="space-y-1">
                <p className="text-[#336D82] text-sm md:text-base font-semibold">
                  🎯 Level Tertinggi:{" "}
                  <span className="text-green-600">
                    {analisis.level_tertinggi?.toUpperCase() || "N/A"}
                  </span>
                </p>
                <p className="text-[#336D82] text-sm md:text-base font-semibold">
                  📈 Level Terendah:{" "}
                  <span className="text-orange-600">
                    {analisis.level_terendah?.toUpperCase() || "N/A"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analisis Utama */}
        {analisis.analisis && (
          <div className="bg-[#F0F7F9] rounded-lg p-4 border border-[#336D82]/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#336D82]" />
              <h4 className="font-semibold text-sm text-[#336D82]">Analisis</h4>
            </div>
            <MarkdownRenderer content={analisis.analisis} />
          </div>
        )}

        {/* Level Info */}
        {(analisis.level_tertinggi || analisis.level_terendah) && (
          <div className="grid grid-cols-2 gap-3">
            {analisis.level_tertinggi && (
              <div className="bg-green-50 rounded-lg p-3 border border-green-300">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-xs text-green-800">
                    Level Tertinggi
                  </h4>
                </div>
                <p className="text-lg font-bold text-green-700 uppercase">
                  {analisis.level_tertinggi}
                </p>
              </div>
            )}

            {analisis.level_terendah && (
              <div className="bg-orange-50 rounded-lg p-3 border border-orange-300">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <h4 className="font-semibold text-xs text-orange-800">
                    Level Terendah
                  </h4>
                </div>
                <p className="text-lg font-bold text-orange-700 uppercase">
                  {analisis.level_terendah}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Kelebihan */}
        {analisis.kelebihan && (
          <div className="bg-[#F0F7F9] rounded-lg p-4 border border-green-300">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-sm text-[#336D82]">
                Kelebihan
              </h4>
            </div>
            <MarkdownRenderer content={analisis.kelebihan} />
          </div>
        )}

        {/* Kelemahan */}
        {analisis.kelemahan && (
          <div className="bg-[#F0F7F9] rounded-lg p-4 border border-orange-300">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <h4 className="font-semibold text-sm text-[#336D82]">
                Kelemahan
              </h4>
            </div>
            <MarkdownRenderer content={analisis.kelemahan} />
          </div>
        )}

        {/* Rekomendasi Belajar */}
        {analisis.rekomendasi_belajar && (
          <div className="bg-[#F0F7F9] rounded-lg p-4 border border-[#336D82]/20">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-[#336D82]" />
              <h4 className="font-semibold text-sm text-[#336D82]">
                Rekomendasi Belajar
              </h4>
            </div>
            <MarkdownRenderer content={analisis.rekomendasi_belajar} />
          </div>
        )}

        {/* Rekomendasi Video */}
        {renderRekomendasiVideo()}
      </CardContent>
    </Card>
  );
}

interface AnalisisAIButtonProps {
  hasilKuisId: string;
  onAnalysisComplete?: (analisis: AnalisisAI) => void;
  isReAnalyze?: boolean;
}

export function AnalisisAIButton({
  hasilKuisId,
  onAnalysisComplete,
  isReAnalyze = false,
}: AnalisisAIButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleAnalyze = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Import dynamically to avoid bundling issues
      const { createAnalisis } = await import("@/lib/api/analisis");
      const analisis = await createAnalisis(hasilKuisId);

      if (onAnalysisComplete) {
        onAnalysisComplete(analisis);
      }
    } catch (err) {
      console.error("Error creating analysis:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Gagal membuat analisis. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-dashed border-2 border-[#336D82]/30 bg-gradient-to-br from-[#F0F7F9] to-white rounded-[20px] overflow-hidden shadow-lg">
      <CardContent className="py-8">
        <div className="text-center space-y-4">
          {/* Mbah Adaptivin Avatar dengan Animasi */}
          <div className="relative mx-auto w-24 h-24 mb-2">
            <div className="absolute inset-0 bg-[#336D82]/10 rounded-full animate-ping" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#336D82] to-[#7AB0C4] p-2 flex items-center justify-center shadow-xl">
              <div className="w-full h-full rounded-full bg-white p-2 flex items-center justify-center">
                <Image
                  src="/mascot/mbah-adaptivin.svg"
                  alt="Mbah Adaptivin"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-yellow-500 animate-pulse" />
          </div>

          <div>
            <h3 className="font-bold text-xl mb-2 text-[#336D82]">
              {isReAnalyze
                ? "Mau Analisis Lagi?"
                : "Hai! Aku Mbah Adaptivin! 👋"}
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              {isReAnalyze
                ? "Yuk, kita analisis lagi hasil kuis kamu bersama Mbah Adaptivin! 🔍✨"
                : "Ayo kita lihat hasil belajar kamu! Mbah Adaptivin akan bantu kamu jadi lebih pintar lagi! 📚✨"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            size="lg"
            className="bg-gradient-to-r from-[#336D82] to-[#7AB0C4] hover:from-[#2a5868] hover:to-[#6a9fb3] text-white shadow-lg hover:shadow-xl active:scale-95 transition-all rounded-full px-8 py-6 text-base font-bold"
            data-analisis-button
          >
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mbah Adaptivin sedang bekerja...</span>
                </div>
                <span className="text-xs text-white/90 font-normal">
                  Menganalisis hasil kuis & mencari video terbaik untukmu 🔍
                </span>
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                {isReAnalyze
                  ? "Analisis Ulang dengan Mbah"
                  : "Ramal Hasil Belajarmu!"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface AnalisisAISectionProps {
  analisis: AnalisisAI;
  hasilKuisId: string;
  onReAnalyze?: () => Promise<void>;
}

export function AnalisisAISection({
  analisis,
  hasilKuisId,
  onReAnalyze,
}: AnalisisAISectionProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showReAnalyzeButton, setShowReAnalyzeButton] = React.useState(false);

  const handleReAnalyzeClick = async () => {
    if (!onReAnalyze) return;

    try {
      setIsDeleting(true);
      await onReAnalyze();
      // Setelah delete berhasil, tampilkan tombol analisis baru
      setShowReAnalyzeButton(true);
    } catch (error) {
      console.error("Error in handleReAnalyzeClick:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <AnalisisAICard
        analisis={analisis}
        onReanalyze={handleReAnalyzeClick}
        isReanalyzing={isDeleting}
      />

      {/* Tombol Analisis Ulang - setelah delete */}
      {showReAnalyzeButton && (
        <div className="flex justify-center">
          <AnalisisAIButton
            hasilKuisId={hasilKuisId}
            isReAnalyze={true}
            onAnalysisComplete={() => {
              setShowReAnalyzeButton(false);
              setIsDeleting(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
