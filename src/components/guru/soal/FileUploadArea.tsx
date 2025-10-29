"use client";

import React from "react";
import { CloudUpload, Visibility, Delete, CheckCircle } from "@mui/icons-material";

interface FileUploadAreaProps {
  file: File | null;
  filePreview: string | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onPreview: () => void;
  label: string;
  optional?: boolean;
  variant?: "primary" | "secondary";
}

export default function FileUploadArea({
  file,
  filePreview,
  onFileSelect,
  onRemove,
  onPreview,
  label,
  optional = false,
  variant = "primary",
}: FileUploadAreaProps) {
  const borderColor = variant === "primary" ? "border-green-200" : "border-blue-200";
  const badgeColor = variant === "primary" ? "bg-green-500" : "bg-blue-500";

  if (filePreview) {
    return (
      <div className={`bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 ${borderColor}`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={filePreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-xl shadow-md"
            />
            <div className={`absolute -top-2 -right-2 w-6 h-6 ${badgeColor} rounded-full flex items-center justify-center shadow-md`}>
              <CheckCircle sx={{ fontSize: 16, color: "white" }} />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-700 font-semibold mb-1 text-sm">
              {file?.name}
            </p>
            <p className="text-gray-500 text-xs">
              {file && `${(file.size / 1024).toFixed(1)} KB`}
            </p>
          </div>
          <button
            onClick={onPreview}
            type="button"
            className="px-4 py-2 bg-[#336d82] text-white rounded-xl hover:bg-[#2a5a6d] transition-all flex items-center gap-2 font-poppins text-sm shadow-md hover:shadow-lg hover:scale-105"
          >
            <Visibility sx={{ fontSize: 18 }} />
            Preview
          </button>
          <button
            onClick={onRemove}
            type="button"
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all flex items-center gap-2 font-poppins text-sm shadow-md hover:shadow-lg hover:scale-105"
          >
            <Delete sx={{ fontSize: 18 }} />
            Hapus
          </button>
        </div>
      </div>
    );
  }

  return (
    <label className="block bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center cursor-pointer hover:bg-white transition-all shadow-lg border-2 border-dashed border-[#336d82]/30 hover:border-[#336d82] hover:shadow-xl group">
      <input
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 bg-gradient-to-br from-[#336d82] to-[#4a8a9e] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <CloudUpload sx={{ fontSize: 32, color: "white" }} />
        </div>
        <div>
          <p className="text-[#336d82] font-bold text-lg mb-1">{label}</p>
          <p className="text-gray-500 text-sm">
            Klik atau drag & drop file gambar di sini
          </p>
          {optional && (
            <p className="text-gray-400 text-xs mt-1">
              Opsional - Format: JPG, PNG, GIF (Max 5MB)
            </p>
          )}
        </div>
      </div>
    </label>
  );
}
