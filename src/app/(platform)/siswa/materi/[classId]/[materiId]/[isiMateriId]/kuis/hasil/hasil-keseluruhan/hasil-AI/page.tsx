"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MobileWarning from "@/components/siswa/layout/MobileWarning";
import AILoader from "@/components/siswa/kuis/AILoader";
import VideoRecommendationCard from "@/components/siswa/kuis/VideoRecommendationCard";
import { quizData } from "@/data/quizData";

/**
 * Hasil AI Analysis Page
 *
 * Halaman analisis hasil kuis oleh AI (Mbah AdaptivAI)
 * - Loading animation saat AI menganalisis
 * - Menampilkan analisis dari Gemini AI
 * - Rekomendasi video pembelajaran
 *
 * Flow:
 * 1. Show loader (AI analyzing)
 * 2. Send quiz data to Gemini API
 * 3. Display analysis results
 * 4. Show video recommendations
 */

export default function HasilAIPage() {
  const [isMobile, setIsMobile] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [showVideo, setShowVideo] = useState(true);

  const params = useParams();
  const router = useRouter();

  const classId = params?.classId as string;
  const materiId = params?.materiId as string;
  const isiMateriId = params?.isiMateriId as string;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Call API to analyze quiz with Gemini AI
  useEffect(() => {
    const analyzeQuiz = async () => {
      try {
        // Get user answers from sessionStorage
        const storedAnswers = sessionStorage.getItem("quizAnswers");
        const userAnswers = storedAnswers ? JSON.parse(storedAnswers) : {};

        // Call API to analyze quiz
        const response = await fetch("/api/analyze-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userAnswers,
            quizData,
            materiTitle: "Pecahan biasa & campuran",
          }),
        });

        const result = await response.json();

        if (result.success) {
          setAiAnalysis(result.data.analysis);
        } else {
          // Fallback to simple analysis if API fails
          const correctAnswers = quizData.filter((q, index) => {
            const userAnswer = parseInt(userAnswers[index] || "0");
            return userAnswer === q.correctAnswer;
          }).length;
          setAiAnalysis(
            `Kamu berhasil menjawab ${correctAnswers} dari ${quizData.length} pertanyaan dengan benar! Terus belajar ya! 📚`
          );
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error analyzing quiz:", error);
        // Fallback analysis
        setAiAnalysis(
          "Mbah AdaptivAI sedang sibuk, tapi tetap semangat belajar ya! 💪"
        );
        setIsLoading(false);
      }
    };

    analyzeQuiz();
  }, []);

  const handleBack = () => {
    router.push(
      `/siswa/materi/${classId}/${materiId}/${isiMateriId}/kuis/hasil/hasil-keseluruhan`
    );
  };

  if (!isMobile) {
    return <MobileWarning />;
  }

  if (isLoading) {
    return <AILoader />;
  }

  return (
    <div
      className="relative w-full min-h-screen overflow-x-hidden pb-8"
      style={{
        background: "linear-gradient(180deg, #336D82 0%, #FFF 130.19%)",
      }}
    >
      {/* Header */}
      <div className="relative h-[75px] flex items-center justify-between px-6">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-[#336D82] text-[24px]">
            chevron_left
          </span>
        </button>

        {/* Title */}
        <h1 className="text-white text-[16px] font-semibold">
          Mbah AdaptivAI
        </h1>

        {/* Avatar */}
        <div className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center overflow-hidden">
          <span className="text-[24px]">👴</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-6">
        {/* Materi Title */}
        <h2 className="text-white text-[18px] font-bold text-center mb-6">
          Pecahan biasa & campuran
        </h2>

        {/* Hasil Keseluruhan Card */}
        <div className="mb-6">
          {/* Dropdown Button - Center Aligned */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="rounded-[10px] h-[34px] px-5 flex items-center gap-3 shadow-md hover:shadow-lg active:scale-95 transition-all"
              style={{
                background: "linear-gradient(0deg, #FFF 0%, #FFF 100%)",
              }}
            >
              <span className="text-[#336D82] text-[14px] font-semibold">
                Hasil Keseluruhan
              </span>
              <span
                className={`material-symbols-outlined text-[#336D82] text-[20px] transition-transform duration-300 ${
                  showAnalysis ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>
          </div>

          {/* Analysis Card */}
          {showAnalysis && (
            <div
              className="rounded-[10px] p-4 shadow-md animate-fade-in"
              style={{
                background: "linear-gradient(0deg, #FFF 0%, #FFF 100%)",
              }}
            >
              <p className="text-[#336D82] text-[12px] leading-relaxed whitespace-pre-line">
                {aiAnalysis}
              </p>
            </div>
          )}
        </div>

        {/* Rekomendasi Video Section */}
        <div className="mb-6">
          {/* Dropdown Button - Center Aligned */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowVideo(!showVideo)}
              className="rounded-[10px] h-[34px] px-5 flex items-center gap-3 shadow-md hover:shadow-lg active:scale-95 transition-all"
              style={{
                background: "linear-gradient(0deg, #FFF 0%, #FFF 100%)",
              }}
            >
              <span className="text-[#336D82] text-[14px] font-semibold">
                Rekomendasi Video
              </span>
              <span
                className={`material-symbols-outlined text-[#336D82] text-[20px] transition-transform duration-300 ${
                  showVideo ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>
          </div>

          {/* Video Card */}
          {showVideo && (
            <div className="animate-fade-in">
              <VideoRecommendationCard
                title="Nilai Tempat Matematika Kelas 4 SD"
                topic="Kelas 4"
                description="Secara keseluruhan, video ini memberikan penjelasan dasar yang jelas mengenai konsep nilai tempat pada bilangan cacah, dari satuan hingga puluhan ribu. Video ini cocok untuk siswa SD kelas 4 dan dapat digunakan dalam pembelajaran di kelas maupun belajar mandiri."
                thumbnailUrl="/images/video-thumbnail.jpg"
                videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
