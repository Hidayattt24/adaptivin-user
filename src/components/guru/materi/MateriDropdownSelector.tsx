"use client";

import React, { useState, useRef, useEffect } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface MateriOption {
  id: string;
  judul: string;
}

interface MateriDropdownSelectorProps {
  materiList: MateriOption[];
  selectedMateri: string | null;
  onSelectMateri: (materiId: string) => void;
  className?: string;
}

const MateriDropdownSelector: React.FC<MateriDropdownSelectorProps> = ({
  materiList,
  selectedMateri,
  onSelectMateri,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedMateriData = materiList.find((m) => m.id === selectedMateri);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Button - Mobile Optimized */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#336d82] rounded-xl sm:rounded-[20px] h-[44px] sm:h-[50px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 shadow-lg hover:bg-[#2a5a6a] active:bg-[#234d5c] transition-colors"
      >
        <span className="text-white text-sm sm:text-lg poppins-semibold truncate flex-1 text-left sm:text-center">
          {selectedMateriData ? selectedMateriData.judul : "Pilih Materi"}
        </span>
        <ArrowDropDownIcon
          className="text-white flex-shrink-0"
          sx={{ fontSize: { xs: 24, sm: 28 } }}
        />
      </button>

      {/* Dropdown Menu - Mobile Optimized */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl sm:rounded-[20px] shadow-xl border-2 border-[#336d82] max-h-[250px] sm:max-h-[300px] overflow-y-auto z-50">
          {materiList.map((materi) => (
            <button
              key={materi.id}
              onClick={() => {
                onSelectMateri(materi.id);
                setIsOpen(false);
              }}
              className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base hover:bg-[#336d82]/10 active:bg-[#336d82]/20 transition-colors first:rounded-t-xl first:sm:rounded-t-[20px] last:rounded-b-xl last:sm:rounded-b-[20px] ${
                selectedMateri === materi.id
                  ? "bg-[#336d82]/20 text-[#336d82] poppins-semibold"
                  : "text-gray-700 poppins-medium"
              }`}
            >
              {materi.judul}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MateriDropdownSelector;
