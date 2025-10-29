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
    <div className={`space-y-6 ${className}`}>
      {/* Total Soal Card - Full Width */}
      <div className="bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-[20px] h-[140px] flex items-center justify-between px-12 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
            <Quiz sx={{ fontSize: 48, color: "white" }} />
          </div>
          <div>
            <h3 className="text-white/90 text-xl poppins-medium mb-1">
              Total Bank Soal
            </h3>
            <p className="text-white text-6xl poppins-bold leading-none">
              {totalSoal}
            </p>
          </div>
        </div>
        <div className="text-white/80 text-sm poppins-medium text-right">
          <p>Soal tersimpan</p>
          <p>di semua kategori</p>
        </div>
      </div>

      {/* Bloom Taxonomy Stats - Horizontal Segmented Card */}
      <div className="bg-white rounded-[20px] shadow-xl border-2 border-[#336d82]/20 overflow-hidden">
        <div className="bg-gradient-to-r from-[#336d82] to-[#2a5a6d] px-6 py-4">
          <h3 className="text-white text-lg poppins-semibold">
            Distribusi Berdasarkan Taksonomi Bloom
          </h3>
        </div>
        <div className="grid grid-cols-6 divide-x-2 divide-[#336d82]/10">
          {(Object.keys(bloomStats) as Array<keyof BloomStats>).map((level) => (
            <div
              key={level}
              className="px-4 py-6 text-center hover:bg-[#336d82]/5 transition-colors"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-lg poppins-bold">{level}</span>
              </div>
              <p className="text-[#336d82] text-3xl poppins-bold mb-1">
                {bloomStats[level]}
              </p>
              <p className="text-gray-600 text-xs poppins-medium leading-tight">
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
