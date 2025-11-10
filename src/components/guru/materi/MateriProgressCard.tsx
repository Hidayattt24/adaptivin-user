"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Insights, Quiz, SmartToy, MenuBook } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { MateriProgress } from "@/types/guru";

interface MateriProgressCardProps {
  materi: MateriProgress;
  allMaterials?: MateriProgress[]; // All materials for this student
  onViewGrafik?: () => void;
  onViewHasilKuis?: () => void;
  onViewAnalisa?: () => void;
  onMateriChange?: (materiId: string) => void;
}

const MateriProgressCard: React.FC<MateriProgressCardProps> = ({
  materi,
  allMaterials = [],
  onViewGrafik,
  onViewHasilKuis,
  onViewAnalisa,
  onMateriChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMateri, setSelectedMateri] = useState(materi);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update selected materi when prop changes
  useEffect(() => {
    setSelectedMateri(materi);
  }, [materi]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMateriSelect = (newMateri: MateriProgress) => {
    setSelectedMateri(newMateri);
    setIsDropdownOpen(false);
    if (onMateriChange) {
      onMateriChange(newMateri.materiId);
    }
  };

  // Check if material is completed
  const isCompleted = selectedMateri.status === "completed";

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
      {/* Material Title and Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
        <h3 className="text-[#336d82] text-xl sm:text-2xl lg:text-3xl poppins-semibold leading-tight flex-1 min-w-0">
          {selectedMateri.judul}
        </h3>

        {/* Status Indicator */}
        <div
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl poppins-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
            isCompleted
              ? "bg-gradient-to-r from-[#2ea062] to-[#3bc97a] text-white shadow-sm"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {isCompleted ? "✓ Selesai" : "Belum Dikerjakan"}
        </div>
      </div>

      {/* Dropdown to select materi */}
      {allMaterials.length > 0 && (
        <div className="mb-4 sm:mb-5 lg:mb-6" ref={dropdownRef}>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white border-2 border-[#336d82]/30 rounded-xl sm:rounded-2xl h-[48px] sm:h-[52px] flex items-center justify-between px-4 sm:px-5 hover:border-[#336d82] hover:bg-[#336d82]/5 active:bg-[#336d82]/10 transition-all duration-200"
            >
              <span className="text-[#336d82] text-sm sm:text-base poppins-medium truncate pr-2">
                {selectedMateri.judul}
              </span>
              <ArrowDropDownIcon
                className="text-[#336d82] flex-shrink-0"
                sx={{ fontSize: { xs: 24, sm: 28 } }}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl sm:rounded-2xl shadow-2xl border-2 border-[#336d82]/20 max-h-[200px] sm:max-h-[240px] overflow-y-auto z-50">
                {allMaterials.map((mat) => (
                  <button
                    key={mat.materiId}
                    onClick={() => handleMateriSelect(mat)}
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 text-left hover:bg-[#336d82]/5 active:bg-[#336d82]/10 transition-all duration-150 first:rounded-t-xl first:sm:rounded-t-2xl last:rounded-b-xl last:sm:rounded-b-2xl border-b border-gray-100 last:border-b-0 ${
                      selectedMateri.materiId === mat.materiId
                        ? "bg-[#336d82]/10 text-[#336d82] poppins-semibold"
                        : "text-gray-700 poppins-medium"
                    }`}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs sm:text-sm truncate flex-1">
                        {mat.judul}
                      </span>
                      <span
                        className={`text-[10px] sm:text-xs px-2 py-1 rounded-lg poppins-semibold flex-shrink-0 ${
                          mat.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {mat.status === "completed" ? "Selesai" : "Belum"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conditional Content Based on Completion Status */}
      {isCompleted ? (
        <>
          {/* Analytics Cards - Enhanced Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {/* Grafik Perkembangan Card */}
            <button
              onClick={onViewGrafik}
              className="group bg-gradient-to-br from-white to-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-6 border-2 border-[#336d82]/30 hover:border-[#336d82] active:border-[#336d82] active:scale-[0.98] hover:shadow-2xl transition-all duration-300 text-left relative overflow-hidden min-h-[140px] sm:min-h-auto"
            >
              {/* Decorative Circle */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#336d82]/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="bg-gradient-to-br from-[#336d82] to-[#5a96a8] rounded-lg sm:rounded-xl p-2 sm:p-2.5 lg:p-3 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Insights
                      sx={{
                        fontSize: { xs: 22, sm: 28, lg: 32 },
                        color: "white",
                      }}
                    />
                  </div>
                  <div className="bg-[#336d82]/10 text-[#336d82] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs poppins-bold">
                    GRAFIK
                  </div>
                </div>

                <h4 className="text-[#336d82] text-sm sm:text-lg lg:text-xl poppins-bold mb-1 sm:mb-2 group-hover:text-[#2a5a6d] transition-colors leading-tight">
                  Grafik Perkembangan
                </h4>

                <p className="text-gray-600 text-[11px] sm:text-sm poppins-regular mb-2 sm:mb-4 leading-snug flex-1">
                  Lihat perkembangan pembelajaran siswa Level 1 - Level 6
                </p>

                <div className="flex items-center gap-1.5 sm:gap-2 text-[#336d82] poppins-semibold text-[11px] sm:text-sm group-hover:gap-3 transition-all mt-auto">
                  <span>Buka Detail</span>
                  <span className="group-hover:translate-x-1 transition-transform text-sm sm:text-base">
                    →
                  </span>
                </div>
              </div>
            </button>

            {/* Hasil Kuis Card */}
            <button
              onClick={onViewHasilKuis}
              className="group bg-gradient-to-br from-white to-emerald-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-6 border-2 border-[#2ea062]/30 hover:border-[#2ea062] active:border-[#2ea062] active:scale-[0.98] hover:shadow-2xl transition-all duration-300 text-left relative overflow-hidden min-h-[140px] sm:min-h-auto"
            >
              {/* Decorative Circle */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#2ea062]/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="bg-gradient-to-br from-[#2ea062] to-[#3bc97a] rounded-lg sm:rounded-xl p-2 sm:p-2.5 lg:p-3 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Quiz
                      sx={{
                        fontSize: { xs: 22, sm: 28, lg: 32 },
                        color: "white",
                      }}
                    />
                  </div>
                  <div className="bg-[#2ea062]/10 text-[#2ea062] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs poppins-bold">
                    KUIS
                  </div>
                </div>

                <h4 className="text-[#336d82] text-sm sm:text-lg lg:text-xl poppins-bold mb-1 sm:mb-2 group-hover:text-[#2ea062] transition-colors leading-tight">
                  Hasil Kuis
                </h4>

                <p className="text-gray-600 text-[11px] sm:text-sm poppins-regular mb-2 sm:mb-4 leading-snug flex-1">
                  Lihat hasil kuis lengkap dengan detail jawaban
                </p>

                <div className="flex items-center gap-1.5 sm:gap-2 text-[#2ea062] poppins-semibold text-[11px] sm:text-sm group-hover:gap-3 transition-all mt-auto">
                  <span>Buka Detail</span>
                  <span className="group-hover:translate-x-1 transition-transform text-sm sm:text-base">
                    →
                  </span>
                </div>
              </div>
            </button>

            {/* Analisa AI Card */}
            <button
              onClick={onViewAnalisa}
              className="group bg-gradient-to-br from-white to-yellow-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-6 border-2 border-[#fcc61d]/30 hover:border-[#fcc61d] active:border-[#fcc61d] active:scale-[0.98] hover:shadow-2xl transition-all duration-300 text-left relative overflow-hidden sm:col-span-2 lg:col-span-1 min-h-[140px] sm:min-h-auto"
            >
              {/* Decorative Circle */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#fcc61d]/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  {/* Mbah Adaptivin Avatar */}
                  <div className="relative bg-gradient-to-br from-[#fcc61d] to-[#ffd84d] rounded-lg sm:rounded-xl p-2 sm:p-2.5 lg:p-3 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <div className="w-[22px] h-[22px] sm:w-[28px] sm:h-[28px] lg:w-[32px] lg:h-[32px] relative">
                      <Image
                        src="/mascot/mbah-adaptivin.svg"
                        alt="Mbah Adaptivin"
                        fill
                        className="object-contain"
                      />
                    </div>
                    {/* Sparkle effect */}
                    <div className="absolute -top-1 -right-1 text-xs sm:text-sm animate-pulse">
                      ✨
                    </div>
                  </div>
                  <div className="bg-[#fcc61d]/10 text-[#fcc61d] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs poppins-bold flex items-center gap-0.5 sm:gap-1">
                    <span className="text-sm sm:text-xl">✨</span>
                    <span>AI</span>
                  </div>
                </div>

                <h4 className="text-[#336d82] text-sm sm:text-lg lg:text-xl poppins-bold mb-1 sm:mb-2 group-hover:text-[#d4a817] transition-colors leading-tight">
                  Analisa AI
                </h4>

                <p className="text-gray-600 text-[11px] sm:text-sm poppins-regular mb-2 sm:mb-4 leading-snug flex-1">
                  Dapatkan insight dan rekomendasi dari Mbah AI
                </p>

                <div className="flex items-center gap-1.5 sm:gap-2 text-[#fcc61d] poppins-semibold text-[11px] sm:text-sm group-hover:gap-3 transition-all mt-auto">
                  <span>Buka Detail</span>
                  <span className="group-hover:translate-x-1 transition-transform text-sm sm:text-base">
                    →
                  </span>
                </div>
              </div>
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Analytics Cards - Disabled state when not completed */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Grafik Perkembangan Card - Disabled */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200 text-left opacity-50 cursor-not-allowed relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gray-300 rounded-xl p-3 shadow-sm">
                    <Insights sx={{ fontSize: 32, color: "white" }} />
                  </div>
                  <div className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full text-xs poppins-bold">
                    TERKUNCI
                  </div>
                </div>

                <h4 className="text-gray-500 text-xl poppins-bold mb-2">
                  Grafik Perkembangan
                </h4>

                <p className="text-gray-400 text-sm poppins-regular leading-relaxed">
                  Tersedia setelah materi selesai dikerjakan
                </p>
              </div>
            </div>

            {/* Hasil Kuis Card - Disabled */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200 text-left opacity-50 cursor-not-allowed relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gray-300 rounded-xl p-3 shadow-sm">
                    <Quiz sx={{ fontSize: 32, color: "white" }} />
                  </div>
                  <div className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full text-xs poppins-bold">
                    TERKUNCI
                  </div>
                </div>

                <h4 className="text-gray-500 text-xl poppins-bold mb-2">
                  Hasil Kuis
                </h4>

                <p className="text-gray-400 text-sm poppins-regular leading-relaxed">
                  Tersedia setelah materi selesai dikerjakan
                </p>
              </div>
            </div>

            {/* Analisa AI Card - Disabled */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200 text-left opacity-50 cursor-not-allowed relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gray-300 rounded-xl p-3 shadow-sm">
                    <SmartToy sx={{ fontSize: 32, color: "white" }} />
                  </div>
                  <div className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full text-xs poppins-bold">
                    TERKUNCI
                  </div>
                </div>

                <h4 className="text-gray-500 text-xl poppins-bold mb-2">
                  Analisa AI
                </h4>

                <p className="text-gray-400 text-sm poppins-regular leading-relaxed">
                  Tersedia setelah materi selesai dikerjakan
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Additional message for not completed */}
      {!isCompleted && (
        <div className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center border-2 border-dashed border-gray-300">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mb-3 shadow-sm">
            <MenuBook sx={{ fontSize: 32, color: "#6b7280" }} />
          </div>
          <h4 className="text-gray-700 text-lg poppins-semibold mb-2">
            Belum Dikerjakan
          </h4>
          <p className="text-gray-500 text-sm poppins-regular max-w-md mx-auto">
            Siswa belum menyelesaikan materi ini. Analitik akan tersedia setelah
            materi selesai dikerjakan.
          </p>
        </div>
      )}
    </div>
  );
};

export default MateriProgressCard;
