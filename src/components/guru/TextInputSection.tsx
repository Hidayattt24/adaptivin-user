"use client";

import React from "react";
import { CheckCircle, AddPhotoAlternate } from "@mui/icons-material";

interface TextInputSectionProps {
  sectionNumber: number;
  title: string;
  value: string;
  placeholder: string;
  confirmed: boolean;
  onChange: (value: string) => void;
  onDelete: () => void;
  onConfirm: () => void;
  multiline?: boolean;
  rows?: number;
  showImageUpload?: boolean;
  onImageUpload?: () => void;
}

export function TextInputSection({
  sectionNumber,
  title,
  value,
  placeholder,
  confirmed,
  onChange,
  onDelete,
  onConfirm,
  multiline = false,
  rows = 1,
  showImageUpload = false,
  onImageUpload,
}: TextInputSectionProps) {
  const inputClasses =
    "w-full px-4 py-3 rounded-xl text-[14px] border-none focus:outline-none focus:ring-2 focus:ring-white/50 font-poppins shadow-inner bg-white text-gray-900";

  return (
    <div className="bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-[17px] md:text-[19px] font-semibold text-white mb-3 font-poppins flex items-center gap-2">
        <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">
          {sectionNumber}
        </span>
        {title}
      </h2>

      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses + " resize-none"}
          rows={rows}
          disabled={confirmed}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
          disabled={confirmed}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-3">
        {showImageUpload && onImageUpload && (
          <button
            type="button"
            onClick={onImageUpload}
            disabled={confirmed}
            className={`px-5 py-2.5 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg ${
              confirmed
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-gradient-to-r from-[#fcc61d] to-[#f5b800] text-white hover:-translate-y-0.5"
            }`}
          >
            <AddPhotoAlternate sx={{ fontSize: 16 }} />
            Tambah Gambar
          </button>
        )}

        <div className={`flex gap-2 ${showImageUpload ? 'w-full sm:w-auto' : 'w-full'}`}>
          <button
            onClick={onDelete}
            disabled={confirmed}
            className={`${showImageUpload ? 'flex-1 sm:flex-none' : 'flex-1'} px-7 py-2 rounded-xl text-[12px] font-semibold transition-all font-poppins shadow-md hover:shadow-lg ${
              confirmed
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#ff1919] text-white hover:bg-[#e01515] hover:-translate-y-0.5"
            }`}
          >
            Hapus
          </button>
          <button
            onClick={onConfirm}
            disabled={!value || confirmed}
            className={`${showImageUpload ? 'flex-1 sm:flex-none' : 'flex-1'} px-7 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center justify-center gap-2 font-poppins shadow-md hover:shadow-lg ${
              confirmed
                ? "bg-[#2ea062] text-white cursor-default"
                : !value
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#2ea062] text-white hover:bg-[#26824f] hover:-translate-y-0.5"
            }`}
          >
            {confirmed && <CheckCircle sx={{ fontSize: 16 }} />}
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}
