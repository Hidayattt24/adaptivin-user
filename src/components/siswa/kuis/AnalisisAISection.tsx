"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface AnalisisAICardProps {
  analisis: AnalisisAI;
  onReanalyze?: () => void;
  isReanalyzing?: boolean;
}

export function AnalisisAICard({ analisis, onReanalyze, isReanalyzing }: AnalisisAICardProps) {
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
        <div className="flex items-center gap-2 mb-3">
          <Video className="w-4 h-4 text-purple-600" />
          <h4 className="font-semibold text-sm">Rekomendasi Video</h4>
        </div>
        <div className="space-y-2">
          {videos.map((video, index) => (
            <a
              key={index}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors border border-purple-200 dark:border-purple-800"
            >
              <Video className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  {video.judul || `Video ${index + 1}`}
                </p>
                {video.durasi && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    Durasi: {video.durasi}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg flex items-center gap-2">
                Analisis AI
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
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
            <Badge variant="secondary" className="bg-blue-500 text-white whitespace-nowrap">
              AI Generated
            </Badge>

            {onReanalyze && (
              <Button
                onClick={onReanalyze}
                disabled={isReanalyzing}
                size="sm"
                variant="outline"
                className="text-xs whitespace-nowrap"
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
        {/* Analisis Utama */}
        {analisis.analisis && (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-sm">Analisis</h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {analisis.analisis}
            </p>
          </div>
        )}

        {/* Level Info */}
        {(analisis.level_tertinggi || analisis.level_terendah) && (
          <div className="grid grid-cols-2 gap-3">
            {analisis.level_tertinggi && (
              <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-xs text-green-800 dark:text-green-200">
                    Level Tertinggi
                  </h4>
                </div>
                <p className="text-lg font-bold text-green-700 dark:text-green-300 uppercase">
                  {analisis.level_tertinggi}
                </p>
              </div>
            )}

            {analisis.level_terendah && (
              <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <h4 className="font-semibold text-xs text-orange-800 dark:text-orange-200">
                    Level Terendah
                  </h4>
                </div>
                <p className="text-lg font-bold text-orange-700 dark:text-orange-300 uppercase">
                  {analisis.level_terendah}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Kelebihan */}
        {analisis.kelebihan && (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-sm">Kelebihan</h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {analisis.kelebihan}
            </p>
          </div>
        )}

        {/* Kelemahan */}
        {analisis.kelemahan && (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <h4 className="font-semibold text-sm">Kelemahan</h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {analisis.kelemahan}
            </p>
          </div>
        )}

        {/* Rekomendasi Belajar */}
        {analisis.rekomendasi_belajar && (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-sm">Rekomendasi Belajar</h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {analisis.rekomendasi_belajar}
            </p>
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
    <Card className="border-dashed border-2 border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/30">
      <CardContent className="py-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto">
            <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              {isReAnalyze ? "Analisis Ulang?" : "Analisis AI Belum Tersedia"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {isReAnalyze
                ? "Klik tombol di bawah untuk menganalisis ulang hasil kuis Anda dengan AI."
                : "Dapatkan analisis mendalam tentang hasil kuis Anda dengan bantuan AI. Analisis ini akan memberikan rekomendasi belajar yang personal."}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {isReAnalyze ? "Analisis Ulang" : "Analisis dengan AI"}
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
