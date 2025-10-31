"use client";

import { useEffect, useState } from "react";

interface QuizTimerProps {
  totalSeconds: number; // Total waktu dalam detik (dari guru)
  onTimeUp: () => void; // Callback ketika waktu habis
  isPaused?: boolean; // Untuk pause timer
}

export default function QuizTimer({
  totalSeconds,
  onTimeUp,
  isPaused = false,
}: QuizTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);

  useEffect(() => {
    setRemainingSeconds(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (isPaused || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds, isPaused, onTimeUp]);

  // Format waktu ke MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Hitung persentase waktu tersisa
  const percentage = (remainingSeconds / totalSeconds) * 100;

  // Tentukan warna berdasarkan waktu tersisa
  const getColor = () => {
    if (percentage > 50) return "#2ea062"; // Hijau
    if (percentage > 25) return "#fcc61d"; // Kuning
    return "#ff1919"; // Merah
  };

  // Tentukan apakah perlu warning animation
  const isWarning = percentage <= 25 && remainingSeconds > 0;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Timer Card - Lebih prominent */}
      <div
        className={`bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-5 shadow-2xl border-2 transition-all ${
          isWarning ? "animate-pulse border-red-500" : "border-white/50"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left: Icon & Label */}
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-all shadow-lg ${
                isWarning ? "animate-bounce" : ""
              }`}
              style={{
                background: `linear-gradient(135deg, ${getColor()} 0%, ${getColor()}dd 100%)`,
                boxShadow: isWarning ? `0 0 25px ${getColor()}80` : `0 4px 15px ${getColor()}40`,
              }}
            >
              <span className="material-symbols-outlined text-white text-3xl md:text-4xl">
                timer
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs md:text-sm text-gray-600 font-medium">
                Waktu Tersisa
              </span>
              <span className="text-[10px] md:text-xs text-gray-400">
                {isWarning ? "⚠️ Segera selesaikan!" : "Kerjakan dengan tenang"}
              </span>
            </div>
          </div>

          {/* Right: Timer Display - BESAR & JELAS */}
          <div className="flex flex-col items-end">
            <span
              className={`text-4xl md:text-5xl font-bold tabular-nums transition-all ${
                isWarning ? "animate-pulse" : ""
              }`}
              style={{ 
                color: getColor(),
                textShadow: isWarning ? `0 0 20px ${getColor()}60` : "none"
              }}
            >
              {formatTime(remainingSeconds)}
            </span>
            <span className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              menit:detik
            </span>
          </div>
        </div>

        {/* Progress Bar - Tanpa persentase */}
        <div className="mt-4">
          <div className="w-full h-3 md:h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full transition-all duration-1000 ease-linear rounded-full"
              style={{
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${getColor()} 0%, ${getColor()}dd 100%)`,
                boxShadow: `0 0 10px ${getColor()}60`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
