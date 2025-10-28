"use client";

import React from "react";
import { Close } from "@mui/icons-material";

interface ImagePreviewCardProps {
  previews: string[];
  onRemove: (index: number) => void;
}

export function ImagePreviewCard({ previews, onRemove }: ImagePreviewCardProps) {
  if (previews.length === 0) return null;

  return (
    <div className="mb-4 space-y-3">
      {previews.map((preview, index) => (
        <div
          key={index}
          className="relative bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all"
        >
          <img
            src={preview}
            alt={`Preview ${index + 1}`}
            className="w-full h-auto max-h-[350px] object-contain rounded-lg"
          />
          <button
            onClick={() => onRemove(index)}
            className="absolute top-5 right-5 bg-[#ff1919] text-white rounded-full p-2 hover:bg-[#e01515] hover:scale-110 transition-all shadow-lg"
            aria-label="Hapus gambar"
          >
            <Close sx={{ fontSize: 18 }} />
          </button>
        </div>
      ))}
    </div>
  );
}
