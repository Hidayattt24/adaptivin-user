"use client";

import React from "react";
import { TextInputSection } from "@/components/guru";

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

interface SubMateriMedia {
  id: string;
  tipe_media: "pdf" | "video" | "gambar";
  url: string;
  created_at: string;
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
  existingPdf?: SubMateriMedia;
  existingVideo?: SubMateriMedia;
}

export function MainMateriTitle({
  materiData,
  onUpdate,
}: MainMateriTitleProps) {
  const handleConfirm = (field: keyof MainMateriData["confirmed"]) => {
    onUpdate({
      ...materiData,
      confirmed: { ...materiData.confirmed, [field]: true },
    });
  };

  const handleDelete = (field: "title" | "explanation" | "file" | "video") => {
    if (field === "title") {
      onUpdate({
        ...materiData,
        title: "",
        confirmed: { ...materiData.confirmed, title: false },
      });
    } else if (field === "explanation") {
      materiData.imagePreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
      });
      onUpdate({
        ...materiData,
        explanation: "",
        images: [],
        imagePreviews: [],
        confirmed: { ...materiData.confirmed, explanation: false },
      });
    } else if (field === "file") {
      onUpdate({
        ...materiData,
        file: null,
        confirmed: { ...materiData.confirmed, file: false },
      });
    } else if (field === "video") {
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

      {/* Deskripsi Materi */}
      <div className="bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-[17px] md:text-[19px] font-semibold text-white mb-3 font-poppins flex items-center gap-2">
          <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">
            2
          </span>
          Deskripsi materi (Opsional)
        </h2>
        <div className="bg-white rounded-xl p-4 shadow-inner">
          <textarea
            value={materiData.explanation}
            onChange={(e) => {
              onUpdate({
                ...materiData,
                explanation: e.target.value,
                confirmed: { ...materiData.confirmed, explanation: false },
              });
            }}
            placeholder="Berikan deskripsi singkat tentang materi ini..."
            className="w-full min-h-[100px] p-3 text-[14px] text-gray-800 font-poppins resize-none focus:outline-none focus:ring-2 focus:ring-[#336d82] rounded-lg border border-gray-200"
          />
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={() => handleDelete("explanation")}
            className="px-7 py-2 rounded-xl text-[12px] font-semibold transition-all font-poppins shadow-md hover:shadow-lg bg-[#ff1919] text-white hover:bg-[#e01515] hover:-translate-y-0.5"
          >
            Hapus
          </button>
          <button
            onClick={() => handleConfirm("explanation")}
            disabled={materiData.confirmed.explanation}
            className={`px-7 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg ${materiData.confirmed.explanation
                ? "bg-[#2ea062] text-white cursor-default"
                : "bg-[#2ea062] text-white hover:bg-[#26824f] hover:-translate-y-0.5"
              }`}
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}
