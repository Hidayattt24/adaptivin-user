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
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#336d82] rounded-[20px] h-[50px] w-auto inline-flex items-center justify-center gap-2 px-5 shadow-lg hover:bg-[#2a5a6a] transition-colors"
      >
        <span className="text-white text-lg poppins-semibold whitespace-nowrap">
          {selectedMateriData ? selectedMateriData.judul : "Pilih Materi"}
        </span>
        <ArrowDropDownIcon
          className="text-white"
          sx={{ fontSize: 28 }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[20px] shadow-xl border-2 border-[#336d82] max-h-[300px] overflow-y-auto z-50">
          {materiList.map((materi) => (
            <button
              key={materi.id}
              onClick={() => {
                onSelectMateri(materi.id);
                setIsOpen(false);
              }}
              className={`w-full px-6 py-4 text-left hover:bg-[#336d82]/10 transition-colors first:rounded-t-[20px] last:rounded-b-[20px] ${
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
