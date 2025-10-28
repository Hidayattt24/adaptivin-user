"use client";

import React from "react";
import { Close } from "@mui/icons-material";
import {
  TextInputSection,
  FileUploadCard,
  ImagePreviewCard,
} from "@/components/guru";

export interface MateriSectionData {
  id: string;
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

interface MateriSectionProps {
  section: MateriSectionData;
  sectionIndex: number;
  totalSections: number;
  isDraggingFile: boolean;
  isDraggingVideo: boolean;
  onUpdate: (updatedSection: MateriSectionData) => void;
  onDelete: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "video") => void;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onDragOver: (e: React.DragEvent, type: "file" | "video") => void;
  onDragLeave: (e: React.DragEvent, type: "file" | "video") => void;
  onDrop: (e: React.DragEvent, type: "file" | "video") => void;
}

export function MateriSection({
  section,
  sectionIndex,
  totalSections,
  isDraggingFile,
  isDraggingVideo,
  onUpdate,
  onDelete,
  onFileSelect,
  onImageSelect,
  onRemoveImage,
  onDragOver,
  onDragLeave,
  onDrop,
}: MateriSectionProps) {
  const baseNumber = sectionIndex * 4;

  const handleConfirm = (field: keyof MateriSectionData["confirmed"]) => {
    onUpdate({
      ...section,
      confirmed: { ...section.confirmed, [field]: true },
    });
  };

  const handleDeleteField = (field: "title" | "explanation") => {
    if (field === "title") {
      onUpdate({
        ...section,
        title: "",
        confirmed: { ...section.confirmed, title: false },
      });
    } else if (field === "explanation") {
      section.imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      onUpdate({
        ...section,
        explanation: "",
        images: [],
        imagePreviews: [],
        confirmed: { ...section.confirmed, explanation: false },
      });
    }
  };

  const handleRemoveFile = (type: "file" | "video") => {
    if (type === "file") {
      onUpdate({
        ...section,
        file: null,
        confirmed: { ...section.confirmed, file: false },
      });
    } else {
      onUpdate({
        ...section,
        video: null,
        confirmed: { ...section.confirmed, video: false },
      });
    }
  };

  return (
    <div className="relative border-2 border-dashed border-[#336d82]/40 rounded-2xl p-4 md:p-5 space-y-4 bg-white/50 backdrop-blur-sm shadow-lg">
      {/* Section Header with Delete Button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#fcc61d] to-[#f5b800] rounded-xl flex items-center justify-center text-white font-bold shadow-md">
            {sectionIndex + 1}
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-[#336d82] font-poppins">
              {section.title || `Sub-Materi ${sectionIndex + 1}`}
            </h3>
            <p className="text-xs text-gray-500 font-poppins">
              Bagian dari materi utama
            </p>
          </div>
        </div>
        {totalSections > 1 && (
          <button
            onClick={onDelete}
            className="p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all hover:scale-110 shadow-lg group"
            aria-label="Hapus sub-materi ini"
          >
            <Close sx={{ fontSize: 18 }} />
          </button>
        )}
      </div>

      {/* 1. Title Input */}
      <TextInputSection
        sectionNumber={baseNumber + 1}
        title="Isi judul sub-bagian"
        value={section.title}
        placeholder="Ketik disini untuk menulis judul sub-bagian...."
        confirmed={section.confirmed.title}
        onChange={(value) => {
          onUpdate({
            ...section,
            title: value,
            confirmed: { ...section.confirmed, title: false },
          });
        }}
        onDelete={() => handleDeleteField("title")}
        onConfirm={() => handleConfirm("title")}
      />

      {/* 2. File Upload */}
      <FileUploadCard
        sectionNumber={baseNumber + 2}
        title="Unggah materi dalam bentuk file (Opsional)"
        file={section.file}
        accept=".pdf,.doc,.docx"
        formatHint="Format: PDF, DOC, DOCX"
        confirmed={section.confirmed.file}
        isDragging={isDraggingFile}
        onFileSelect={(e) => onFileSelect(e, "file")}
        onRemove={() => handleRemoveFile("file")}
        onConfirm={() => handleConfirm("file")}
        onDragOver={(e) => onDragOver(e, "file")}
        onDragLeave={(e) => onDragLeave(e, "file")}
        onDrop={(e) => onDrop(e, "file")}
        inputId={`file-upload-${section.id}`}
      />

      {/* 3. Video Upload */}
      <FileUploadCard
        sectionNumber={baseNumber + 3}
        title="Unggah materi dalam bentuk video (Opsional)"
        file={section.video}
        accept="video/*"
        formatHint="Format: MP4, AVI, MOV"
        confirmed={section.confirmed.video}
        isDragging={isDraggingVideo}
        onFileSelect={(e) => onFileSelect(e, "video")}
        onRemove={() => handleRemoveFile("video")}
        onConfirm={() => handleConfirm("video")}
        onDragOver={(e) => onDragOver(e, "video")}
        onDragLeave={(e) => onDragLeave(e, "video")}
        onDrop={(e) => onDrop(e, "video")}
        inputId={`video-upload-${section.id}`}
      />

      {/* 4. Explanation with Images */}
      <div className="bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-[17px] md:text-[19px] font-semibold text-white mb-3 font-poppins flex items-center gap-2">
          <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">
            {baseNumber + 4}
          </span>
          Isi penjelasan materi
        </h2>

        <ImagePreviewCard
          previews={section.imagePreviews}
          onRemove={onRemoveImage}
        />

        <textarea
          value={section.explanation}
          onChange={(e) => {
            onUpdate({
              ...section,
              explanation: e.target.value,
              confirmed: { ...section.confirmed, explanation: false },
            });
          }}
          placeholder="Ketik disini untuk menulis materi...."
          className="w-full px-4 py-3 rounded-xl text-[14px] border-none focus:outline-none focus:ring-2 focus:ring-white/50 resize-none font-poppins shadow-inner bg-white text-gray-900"
          rows={5}
          disabled={section.confirmed.explanation}
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-3">
          <input
            type="file"
            id={`image-upload-${section.id}`}
            accept="image/*"
            multiple
            onChange={onImageSelect}
            className="hidden"
            disabled={section.confirmed.explanation}
          />
          <label htmlFor={`image-upload-${section.id}`}>
            <button
              type="button"
              onClick={() =>
                !section.confirmed.explanation &&
                document.getElementById(`image-upload-${section.id}`)?.click()
              }
              disabled={section.confirmed.explanation}
              className={`px-5 py-2.5 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg ${
                section.confirmed.explanation
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
              onClick={() => handleDeleteField("explanation")}
              disabled={section.confirmed.explanation}
              className={`flex-1 sm:flex-none px-7 py-2 rounded-xl text-[12px] font-semibold transition-all font-poppins shadow-md hover:shadow-lg ${
                section.confirmed.explanation
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-[#ff1919] text-white hover:bg-[#e01515] hover:-translate-y-0.5"
              }`}
            >
              Hapus
            </button>
            <button
              onClick={() => handleConfirm("explanation")}
              disabled={!section.explanation || section.confirmed.explanation}
              className={`flex-1 sm:flex-none px-7 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg ${
                section.confirmed.explanation
                  ? "bg-[#2ea062] text-white cursor-default"
                  : !section.explanation
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-[#2ea062] text-white hover:bg-[#26824f] hover:-translate-y-0.5"
              }`}
            >
              {section.confirmed.explanation && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              )}
              Konfirmasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
