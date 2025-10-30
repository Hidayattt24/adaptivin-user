"use client";

import React from "react";
import { Quiz } from "@mui/icons-material";

interface BloomStats {
  C1: number;
  C2: number;
  C3: number;
  C4: number;
  C5: number;
  C6: number;
}

interface TotalSoalCardsProps {
  totalSoal: number;
  bloomStats: BloomStats;
  className?: string;
}

const bloomLabels = {
  C1: "Pengetahuan Dasar",
  C2: "Pemahaman",
  C3: "Penerapan",
  C4: "Analisis",
  C5: "Evaluasi",
  C6: "Kreasi",
};

const TotalSoalCards: React.FC<TotalSoalCardsProps> = ({
  totalSoal,
  bloomStats,
  className = "",
}) => {
  return (
    <div className={`space-y-4 sm:space-y-5 md:space-y-6 ${className}`}>
      {/* Total Soal Card - Full Width */}
      <div className="bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-xl sm:rounded-2xl md:rounded-[20px] h-[120px] sm:h-[130px] md:h-[140px] flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 shadow-xl">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/20 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
            <Quiz sx={{ fontSize: { xs: 32, sm: 40, md: 48 }, color: "white" }} />
          </div>
          <div>
            <h3 className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl poppins-medium mb-0.5 sm:mb-1">
              Total Bank Soal
            </h3>
            <p className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl poppins-bold leading-none">
              {totalSoal}
            </p>
          </div>
        </div>
        <div className="text-white/80 text-[10px] sm:text-xs md:text-sm poppins-medium text-right hidden sm:block">
          <p>Soal tersimpan</p>
          <p>di semua kategori</p>
        </div>
      </div>

      {/* Bloom Taxonomy Stats - Horizontal Segmented Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-[20px] shadow-xl border-2 border-[#336d82]/20 overflow-hidden">
        <div className="bg-gradient-to-r from-[#336d82] to-[#2a5a6d] px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4">
          <h3 className="text-white text-sm sm:text-base md:text-lg poppins-semibold">
            Distribusi Berdasarkan Taksonomi Bloom
          </h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 divide-x-2 divide-y-2 sm:divide-y-0 divide-[#336d82]/10">
          {(Object.keys(bloomStats) as Array<keyof BloomStats>).map((level) => (
            <div
              key={level}
              className="px-2 sm:px-3 md:px-4 py-4 sm:py-5 md:py-6 text-center hover:bg-[#336d82]/5 transition-colors"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 mx-auto mb-2 sm:mb-2.5 md:mb-3 bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-base sm:text-lg poppins-bold">{level}</span>
              </div>
              <p className="text-[#336d82] text-2xl sm:text-2xl md:text-3xl poppins-bold mb-0.5 sm:mb-1">
                {bloomStats[level]}
              </p>
              <p className="text-gray-600 text-[10px] sm:text-xs poppins-medium leading-tight">
                {bloomLabels[level]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TotalSoalCards;
