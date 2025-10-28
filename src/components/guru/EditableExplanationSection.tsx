"use client";

import React, { useState, useEffect } from "react";
import {
  Edit,
  Save,
  Delete,
  CheckCircle,
  AddPhotoAlternate,
  Close,
} from "@mui/icons-material";

interface EditableExplanationSectionProps {
  initialExplanation: string;
  initialImages?: string[]; // URLs
  onSave: (explanation: string, images: File[]) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function EditableExplanationSection({
  initialExplanation,
  initialImages = [],
  onSave,
  onDelete,
}: EditableExplanationSectionProps) {
  const [explanation, setExplanation] = useState(initialExplanation);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialImages);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const hasChanges =
    explanation !== initialExplanation || images.length > 0;

  useEffect(() => {
    return () => {
      // Cleanup blob URLs
      imagePreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  const handleEdit = () => {
    setIsEditing(true);
    setIsSaved(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = [...images, ...files];
      const newPreviews = files.map((file) => URL.createObjectURL(file));

      setImages(newImages);
      setImagePreviews([...imagePreviews, ...newPreviews]);
      setIsSaved(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const preview = imagePreviews[index];
    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    setIsSaved(false);
  };

  const handleSave = async () => {
    if (!explanation.trim()) return;

    setIsLoading(true);
    try {
      await onSave(explanation, images);
      setIsEditing(false);
      setIsSaved(true);
      setImages([]); // Clear new images after save
    } catch (error) {
      console.error("Failed to save explanation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Clean up new blob URLs
    images.forEach((_, index) => {
      const preview = imagePreviews[initialImages.length + index];
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });

    setExplanation(initialExplanation);
    setImages([]);
    setImagePreviews(initialImages);
    setIsEditing(false);
    setIsSaved(true);
  };

  const handleDeleteAll = async () => {
    if (!onDelete) return;

    setIsLoading(true);
    try {
      await onDelete();
      imagePreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
      setExplanation("");
      setImages([]);
      setImagePreviews([]);
      setIsEditing(false);
      setIsSaved(false);
    } catch (error) {
      console.error("Failed to delete explanation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[17px] md:text-[19px] font-semibold text-white font-poppins">
          Isi penjelasan materi
        </h2>
        {isSaved && !isEditing && (
          <CheckCircle sx={{ fontSize: 20, color: "#2ea062" }} />
        )}
      </div>

      {/* Image Gallery - Full Width Previews */}
      {imagePreviews.length > 0 && (
        <div className="mb-4 space-y-3">
          {imagePreviews.map((preview, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all"
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                loading="lazy"
              />
              {isEditing && (
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-5 right-5 bg-[#ff1919] text-white rounded-full p-2 hover:bg-[#e01515] hover:scale-110 transition-all shadow-lg"
                  aria-label="Hapus gambar"
                >
                  <Close sx={{ fontSize: 18 }} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <textarea
        value={explanation}
        onChange={(e) => {
          setExplanation(e.target.value);
          setIsSaved(false);
        }}
        placeholder="Ketik disini untuk menulis materi..."
        className={`w-full px-4 py-3 rounded-xl text-[14px] border-2 resize-none font-poppins shadow-inner bg-white text-gray-900 transition-all ${
          isEditing
            ? "border-[#fcc61d] focus:outline-none focus:ring-2 focus:ring-[#fcc61d]/50"
            : "border-transparent focus:outline-none focus:ring-2 focus:ring-white/50"
        }`}
        rows={5}
        disabled={!isEditing || isLoading}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-3">
        {isEditing && (
          <>
            <input
              type="file"
              id="explanation-image-upload"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
              disabled={isLoading}
            />
            <label htmlFor="explanation-image-upload">
              <button
                type="button"
                onClick={() =>
                  document.getElementById("explanation-image-upload")?.click()
                }
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg bg-gradient-to-r from-[#fcc61d] to-[#f5b800] text-white hover:-translate-y-0.5 disabled:opacity-50"
              >
                <AddPhotoAlternate sx={{ fontSize: 16 }} />
                Tambah Gambar
              </button>
            </label>
          </>
        )}

        <div className="flex gap-2 w-full sm:w-auto ml-auto">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="px-5 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg bg-gradient-to-r from-[#fcc61d] to-[#f5b800] text-white hover:-translate-y-0.5"
            >
              <Edit sx={{ fontSize: 16 }} />
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 sm:flex-none px-5 py-2 rounded-xl text-[12px] font-semibold transition-all font-poppins shadow-md hover:shadow-lg bg-gray-400 text-white hover:bg-gray-500 disabled:opacity-50"
              >
                Batal
              </button>
              {onDelete && (
                <button
                  onClick={handleDeleteAll}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none px-5 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg bg-[#ff1919] text-white hover:bg-[#e01515] hover:-translate-y-0.5 disabled:opacity-50"
                >
                  <Delete sx={{ fontSize: 16 }} />
                  Hapus
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!explanation.trim() || !hasChanges || isLoading}
                className="flex-1 sm:flex-none px-7 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg bg-[#2ea062] text-white hover:bg-[#26824f] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save sx={{ fontSize: 16 }} />
                Simpan
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
