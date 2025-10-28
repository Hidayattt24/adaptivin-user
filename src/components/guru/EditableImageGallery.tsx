"use client";

import React, { useState } from "react";
import { Delete, Edit, ZoomIn } from "@mui/icons-material";

interface EditableImageGalleryProps {
  images: string[];
  onImageClick: (index: number) => void;
  onImageDelete: (index: number) => void;
  onImageEdit: (index: number) => void;
}

export default function EditableImageGallery({
  images,
  onImageClick,
  onImageDelete,
  onImageEdit,
}: EditableImageGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <div className="space-y-3">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all group"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <img
            src={image}
            alt={`Gambar ${index + 1}`}
            className="w-full h-auto max-h-[350px] object-contain rounded-lg cursor-pointer"
            onClick={() => onImageClick(index)}
          />

          {/* Hover Overlay Actions */}
          <div
            className={`absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center gap-3 transition-opacity duration-200 ${
              hoveredIndex === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Zoom/Preview */}
            <button
              onClick={() => onImageClick(index)}
              className="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
              aria-label="Preview"
            >
              <ZoomIn sx={{ fontSize: 24, color: "#336d82" }} />
            </button>

            {/* Edit */}
            <button
              onClick={() => onImageEdit(index)}
              className="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
              aria-label="Edit"
            >
              <Edit sx={{ fontSize: 22, color: "#fcc61d" }} />
            </button>

            {/* Delete */}
            <button
              onClick={() => onImageDelete(index)}
              className="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
              aria-label="Hapus"
            >
              <Delete sx={{ fontSize: 22, color: "#ff1919" }} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
