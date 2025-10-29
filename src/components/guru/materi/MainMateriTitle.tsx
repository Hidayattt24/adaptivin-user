"use client";

import React from "react";
import { CheckCircle } from "@mui/icons-material";
import {
  TextInputSection,
  FileUploadCard,
  ImagePreviewCard,
} from "@/components/guru";

export interface MainMateriData {
  title: string;
  file: File | null;
  video: File | null;
  explanation: string;
  images: File[];
  imagePreviews: string[];
  confirmed: {
    title: boolean;
    file: boolean;
    video: boolean;
    explanation: boolean;
  };
}

interface MainMateriTitleProps {
  materiData: MainMateriData;
  isDraggingFile: boolean;
  isDraggingVideo: boolean;
  onUpdate: (updatedData: MainMateriData) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "video") => void;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onDragOver: (e: React.DragEvent, type: "file" | "video") => void;
  onDragLeave: (e: React.DragEvent, type: "file" | "video") => void;
  onDrop: (e: React.DragEvent, type: "file" | "video") => void;
}

export function MainMateriTitle({
  materiData,
  isDraggingFile,
  isDraggingVideo,
  onUpdate,
  onFileSelect,
  onImageSelect,
  onRemoveImage,
  onDragOver,
  onDragLeave,
  onDrop,
}: MainMateriTitleProps) {
  const handleConfirm = (field: keyof MainMateriData["confirmed"]) => {
    onUpdate({
      ...materiData,
      confirmed: { ...materiData.confirmed, [field]: true },
    });
  };

  const handleDelete = (field: "title" | "explanation") => {
    if (field === "title") {
      onUpdate({
        ...materiData,
        title: "",
        confirmed: { ...materiData.confirmed, title: false },
      });
    } else if (field === "explanation") {
      materiData.imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      onUpdate({
        ...materiData,
        explanation: "",
        images: [],
        imagePreviews: [],
        confirmed: { ...materiData.confirmed, explanation: false },
      });
    }
  };

  const handleRemoveFile = (type: "file" | "video") => {
    if (type === "file") {
      onUpdate({
        ...materiData,
        file: null,
        confirmed: { ...materiData.confirmed, file: false },
      });
    } else {
      onUpdate({
        ...materiData,
        video: null,
        confirmed: { ...materiData.confirmed, video: false },
      });
    }
  };

  return (
    <div className="border-2 border-[#336d82] rounded-2xl p-5 md:p-6 space-y-4 bg-gradient-to-br from-[#336d82]/5 to-white shadow-xl">
      {/* Header with Icon Badge */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-[#336d82]/20">
        <div className="w-12 h-12 bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">📚</span>
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#336d82] font-poppins">
            Judul Materi Utama
          </h2>
          <p className="text-sm text-gray-600 font-poppins">
            Topik utama pembelajaran (wajib diisi)
          </p>
        </div>
      </div>

      {/* 1. Main Title Input */}
      <TextInputSection
        sectionNumber={1}
        title="Isi judul materi utama"
        value={materiData.title}
        placeholder="Contoh: Pecahan, Perkalian, Ekosistem, dll..."
        confirmed={materiData.confirmed.title}
        onChange={(value) => {
          onUpdate({
            ...materiData,
            title: value,
            confirmed: { ...materiData.confirmed, title: false },
          });
        }}
        onDelete={() => handleDelete("title")}
        onConfirm={() => handleConfirm("title")}
      />

      {/* 2. File Upload */}
      <FileUploadCard
        sectionNumber={2}
        title="Unggah file materi utama (Opsional)"
        file={materiData.file}
        accept=".pdf,.doc,.docx"
        formatHint="Format: PDF, DOC, DOCX"
        confirmed={materiData.confirmed.file}
        isDragging={isDraggingFile}
        onFileSelect={(e) => onFileSelect(e, "file")}
        onRemove={() => handleRemoveFile("file")}
        onConfirm={() => handleConfirm("file")}
        onDragOver={(e) => onDragOver(e, "file")}
        onDragLeave={(e) => onDragLeave(e, "file")}
        onDrop={(e) => onDrop(e, "file")}
        inputId="main-file-upload"
      />

      {/* 3. Video Upload */}
      <FileUploadCard
        sectionNumber={3}
        title="Unggah video materi utama (Opsional)"
        file={materiData.video}
        accept="video/*"
        formatHint="Format: MP4, AVI, MOV"
        confirmed={materiData.confirmed.video}
        isDragging={isDraggingVideo}
        onFileSelect={(e) => onFileSelect(e, "video")}
        onRemove={() => handleRemoveFile("video")}
        onConfirm={() => handleConfirm("video")}
        onDragOver={(e) => onDragOver(e, "video")}
        onDragLeave={(e) => onDragLeave(e, "video")}
        onDrop={(e) => onDrop(e, "video")}
        inputId="main-video-upload"
      />

      {/* 4. Explanation with Images */}
      <div className="bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-[17px] md:text-[19px] font-semibold text-white mb-3 font-poppins flex items-center gap-2">
          <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">
            4
          </span>
          Penjelasan materi utama
        </h2>

        <ImagePreviewCard
          previews={materiData.imagePreviews}
          onRemove={onRemoveImage}
        />

        <textarea
          value={materiData.explanation}
          onChange={(e) => {
            onUpdate({
              ...materiData,
              explanation: e.target.value,
              confirmed: { ...materiData.confirmed, explanation: false },
            });
          }}
          placeholder="Jelaskan konsep utama materi ini..."
          className="w-full px-4 py-3 rounded-xl text-[14px] border-none focus:outline-none focus:ring-2 focus:ring-white/50 resize-none font-poppins shadow-inner bg-white text-gray-900"
          rows={5}
          disabled={materiData.confirmed.explanation}
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-3">
          <input
            type="file"
            id="main-image-upload"
            accept="image/*"
            multiple
            onChange={onImageSelect}
            className="hidden"
            disabled={materiData.confirmed.explanation}
          />
          <label htmlFor="main-image-upload">
            <button
              type="button"
              onClick={() =>
                !materiData.confirmed.explanation &&
                document.getElementById("main-image-upload")?.click()
              }
              disabled={materiData.confirmed.explanation}
              className={`px-5 py-2.5 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg ${
                materiData.confirmed.explanation
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#fcc61d] to-[#f5b800] text-white hover:-translate-y-0.5"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              Tambah Gambar
            </button>
          </label>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleDelete("explanation")}
              disabled={materiData.confirmed.explanation}
              className={`flex-1 sm:flex-none px-7 py-2 rounded-xl text-[12px] font-semibold transition-all font-poppins shadow-md hover:shadow-lg ${
                materiData.confirmed.explanation
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-[#ff1919] text-white hover:bg-[#e01515] hover:-translate-y-0.5"
              }`}
            >
              Hapus
            </button>
            <button
              onClick={() => handleConfirm("explanation")}
              disabled={!materiData.explanation || materiData.confirmed.explanation}
              className={`flex-1 sm:flex-none px-7 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg ${
                materiData.confirmed.explanation
                  ? "bg-[#2ea062] text-white cursor-default"
                  : !materiData.explanation
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-[#2ea062] text-white hover:bg-[#26824f] hover:-translate-y-0.5"
              }`}
            >
              {materiData.confirmed.explanation && <CheckCircle sx={{ fontSize: 16 }} />}
              Konfirmasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
