"use client";

import React from "react";
import { CloudUpload, InsertDriveFile, CheckCircle, Visibility, Close } from "@mui/icons-material";

interface FileUploadCardProps {
  sectionNumber: number;
  title: string;
  file: File | null;
  accept: string;
  formatHint: string;
  confirmed: boolean;
  isDragging: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onConfirm: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  inputId: string;
  existingFileUrl?: string;
  existingFileName?: string;
}

export function FileUploadCard({
  sectionNumber,
  title,
  file,
  accept,
  formatHint,
  confirmed,
  isDragging,
  onFileSelect,
  onRemove,
  onConfirm,
  onDragOver,
  onDragLeave,
  onDrop,
  inputId,
  existingFileUrl,
  existingFileName,
}: FileUploadCardProps) {
  const handlePreview = () => {
    if (existingFileUrl) {
      window.open(existingFileUrl, "_blank");
    }
  };

  const hasFile = file || existingFileUrl;
  const displayFileName = file ? file.name : existingFileName || "Tidak ada file dipilih";

  return (
    <div className="bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-[17px] md:text-[19px] font-semibold text-white mb-3 font-poppins flex items-center gap-2">
        <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">
          {sectionNumber}
        </span>
        {title}
      </h2>

      {/* Existing File Preview */}
      {existingFileUrl && !file && (
        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <InsertDriveFile sx={{ fontSize: 24, color: "#16a34a" }} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-green-800 font-poppins">
                  File tersimpan
                </p>
                <p className="text-[12px] text-green-600 font-poppins">
                  {existingFileName || "File pembelajaran"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-[12px] font-semibold hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
              >
                <Visibility sx={{ fontSize: 16 }} />
                Preview
              </button>
              <button
                onClick={onRemove}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-[12px] font-semibold hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
              >
                <Close sx={{ fontSize: 16 }} />
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload New File */}
      <div
        className={`bg-white rounded-xl p-5 transition-all shadow-inner ${isDragging
            ? "border-2 border-[#336d82] border-dashed bg-[#336d82]/5 scale-[1.02]"
            : "border-2 border-transparent"
          }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          type="file"
          id={inputId}
          accept={accept}
          onChange={onFileSelect}
          className="hidden"
          disabled={confirmed}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm">
              <InsertDriveFile sx={{ fontSize: 28, color: "#666" }} />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-gray-800 font-poppins">
                {displayFileName}
              </p>
              <p className="text-[12px] text-gray-500 font-poppins mt-0.5">
                {formatHint}
              </p>
            </div>
          </div>
          <label
            htmlFor={inputId}
            className={`cursor-pointer ${confirmed ? "cursor-not-allowed" : ""
              }`}
          >
            <div
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-semibold transition-all font-poppins shadow-md hover:shadow-lg ${confirmed
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#336d82] to-[#2a5a6d] text-white hover:-translate-y-0.5"
                }`}
            >
              <CloudUpload sx={{ fontSize: 18 }} />
              {existingFileUrl ? "Ganti file" : "Pilih file"}
            </div>
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        {file && (
          <>
            <button
              onClick={onRemove}
              disabled={confirmed}
              className={`px-7 py-2 rounded-xl text-[12px] font-semibold transition-all font-poppins shadow-md hover:shadow-lg ${confirmed
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-[#ff1919] text-white hover:bg-[#e01515] hover:-translate-y-0.5"
                }`}
            >
              Hapus
            </button>
            <button
              onClick={onConfirm}
              disabled={!hasFile || confirmed}
              className={`px-7 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg ${confirmed
                  ? "bg-[#2ea062] text-white cursor-default"
                  : !hasFile
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-[#2ea062] text-white hover:bg-[#26824f] hover:-translate-y-0.5"
                }`}
            >
              {confirmed && <CheckCircle sx={{ fontSize: 16 }} />}
              Konfirmasi
            </button>
          </>
        )}
      </div>
    </div>
  );
}
