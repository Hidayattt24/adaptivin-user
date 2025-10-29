"use client";

import React, { useState, useRef, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-lg">
      {/* Material Title and Progress */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#336d82] text-2xl poppins-semibold">
          {selectedMateri.judul}
        </h3>
        <div className="bg-[#336d82] text-white px-3 py-1.5 rounded-[10px] poppins-semibold text-sm whitespace-nowrap">
          {selectedMateri.progress}% Progress
        </div>
      </div>

      {/* Dropdown to select materi */}
      {allMaterials.length > 0 && (
        <div className="mb-4" ref={dropdownRef}>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-[#336d82]/10 border-2 border-[#336d82] rounded-[15px] h-[45px] flex items-center justify-between px-4 hover:bg-[#336d82]/20 transition-colors"
            >
              <span className="text-[#336d82] text-sm poppins-semibold">
                Pilih Materi: {selectedMateri.judul}
              </span>
              <ArrowDropDownIcon className="text-[#336d82]" sx={{ fontSize: 24 }} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[15px] shadow-xl border-2 border-[#336d82] max-h-[200px] overflow-y-auto z-50">
                {allMaterials.map((mat) => (
                  <button
                    key={mat.materiId}
                    onClick={() => handleMateriSelect(mat)}
                    className={`w-full px-4 py-3 text-left hover:bg-[#336d82]/10 transition-colors first:rounded-t-[15px] last:rounded-b-[15px] ${
                      selectedMateri.materiId === mat.materiId
                        ? "bg-[#336d82]/20 text-[#336d82] poppins-semibold"
                        : "text-gray-700 poppins-medium"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{mat.judul}</span>
                      <span className="text-xs text-gray-500">{mat.progress}%</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar with Animation */}
      <div className="mb-5">
        <div className="bg-white border-4 border-[#336d82] rounded-[20px] h-[30px] relative overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#336d82] to-[#5a96a8] h-full rounded-[16px] transition-all duration-700 ease-out relative"
            style={{ width: `${selectedMateri.progress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Action Cards - More Compact */}
      <div className="grid grid-cols-3 gap-4">
        {/* Grafik Card */}
        <div className="bg-[#336d82] rounded-[10px] p-4 flex flex-col justify-between min-h-[120px]">
          <h4 className="text-white text-xl poppins-semibold mb-3">Grafik</h4>
          <button
            onClick={onViewGrafik}
            className="bg-white rounded-[10px] flex items-center gap-2 px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            <div className="bg-[#336d82] rounded-full w-[24px] h-[24px] flex items-center justify-center flex-shrink-0">
              <ArrowForwardIosIcon sx={{ fontSize: 12, color: "white" }} />
            </div>
            <span className="text-[#336d82] text-xs poppins-semibold">
              Lihat Selengkapnya
            </span>
          </button>
        </div>

        {/* Hasil Kuis Card */}
        <div className="bg-[#336d82] rounded-[10px] p-4 flex flex-col justify-between min-h-[120px]">
          <h4 className="text-white text-xl poppins-semibold mb-3">
            Hasil Kuis
          </h4>
          <button
            onClick={onViewHasilKuis}
            className="bg-white rounded-[10px] flex items-center gap-2 px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            <div className="bg-[#336d82] rounded-full w-[24px] h-[24px] flex items-center justify-center flex-shrink-0">
              <ArrowForwardIosIcon sx={{ fontSize: 12, color: "white" }} />
            </div>
            <span className="text-[#336d82] text-xs poppins-semibold">
              Lihat Selengkapnya
            </span>
          </button>
        </div>

        {/* Analisa AI Card */}
        <div className="bg-[#336d82] rounded-[10px] p-4 flex flex-col justify-between min-h-[120px]">
          <h4 className="text-white text-xl poppins-semibold mb-3">
            Analisa AI
          </h4>
          <button
            onClick={onViewAnalisa}
            className="bg-white rounded-[10px] flex items-center gap-2 px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            <div className="bg-[#336d82] rounded-full w-[24px] h-[24px] flex items-center justify-center flex-shrink-0">
              <ArrowForwardIosIcon sx={{ fontSize: 12, color: "white" }} />
            </div>
            <span className="text-[#336d82] text-xs poppins-semibold">
              Lihat Selengkapnya
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MateriProgressCard;
