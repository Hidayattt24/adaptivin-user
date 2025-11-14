"use client";

import { useEffect, useState } from "react";
import TimerIcon from "@mui/icons-material/Timer";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface QuizTimerProps {
  totalSeconds: number; // Total waktu dalam detik (dari guru)
  onTimeUp?: () => void; // Optional callback ketika waktu habis (tidak wajib)
  isPaused?: boolean; // Untuk pause timer
  initialElapsedSeconds?: number; // Waktu awal yang sudah berlalu (untuk resume)
  questionStartTime?: number; // Timestamp saat soal dimulai (untuk sync real-time)
}

export default function QuizTimer({
  totalSeconds,
  onTimeUp,
  isPaused = false,
  initialElapsedSeconds = 0,
  questionStartTime,
}: QuizTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(initialElapsedSeconds);

  // Sync dengan waktu real jika questionStartTime diberikan
  useEffect(() => {
    if (questionStartTime) {
      const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
      setElapsedSeconds(elapsed);
    } else {
      setElapsedSeconds(initialElapsedSeconds);
    }
  }, [totalSeconds, questionStartTime, initialElapsedSeconds]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        const newElapsed = prev + 1;

        // Trigger callback hanya sekali saat waktu habis
        if (newElapsed === totalSeconds && onTimeUp) {
          onTimeUp();
        }

        return newElapsed;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, totalSeconds, onTimeUp]);

  // Format waktu ke MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Hitung persentase progress (0-100)
  const percentage = Math.min(100, (elapsedSeconds / totalSeconds) * 100);

  // Tentukan warna berdasarkan progress (selalu tenang)
  const getColor = () => {
    return "#336D82"; // Warna tema utama yang tenang
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Timer Card - Count Up Design */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-5 shadow-xl border-2 border-white/50 transition-all">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Icon & Label */}
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-all shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${getColor()} 0%, ${getColor()}dd 100%)`,
                boxShadow: `0 0 15px ${getColor()}40`,
              }}
            >
              <PlayArrowIcon
                sx={{ color: "white", fontSize: { xs: "32px", md: "40px" } }}
              />
            </div>

            <div className="flex flex-col">
              <span className="text-xs md:text-sm text-gray-600 font-medium">
                ⏱️ Waktu Berjalan
              </span>
              <span className="text-[10px] md:text-xs text-gray-400">
                Kerjakan dengan tenang & teliti
              </span>
            </div>
          </div>

          {/* Right: Timer Display - Count Up */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <span
                className="text-4xl md:text-5xl font-bold tabular-nums transition-all"
                style={{
                  color: getColor(),
                  textShadow: `0 0 15px ${getColor()}30`,
                }}
              >
                {formatTime(elapsedSeconds)}
              </span>
            </div>
            <span className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              menit:detik
            </span>
          </div>
        </div>

        {/* Progress Bar - Shows progress increasing */}
        <div className="mt-4">
          <div className="w-full h-3 md:h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full transition-all duration-1000 ease-linear rounded-full"
              style={{
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${getColor()} 0%, ${getColor()}dd 100%)`,
                boxShadow: `0 0 8px ${getColor()}40`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
