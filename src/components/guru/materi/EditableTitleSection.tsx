"use client";

import React, { useState } from "react";
import { Edit, Save, Delete, CheckCircle } from "@mui/icons-material";

interface EditableTitleSectionProps {
  initialTitle: string;
  onSave: (newTitle: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function EditableTitleSection({
  initialTitle,
  onSave,
  onDelete,
}: EditableTitleSectionProps) {
  const [title, setTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const hasChanges = title !== initialTitle;

  const handleEdit = () => {
    setIsEditing(true);
    setIsSaved(false);
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onSave(title);
      setIsEditing(false);
      setIsSaved(true);
    } catch (error) {
      console.error("Failed to save title:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    setIsEditing(false);
    setIsSaved(true);
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsLoading(true);
    try {
      await onDelete();
      setTitle("");
      setIsSaved(true);
    } catch (error) {
      console.error("Failed to delete title:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[17px] md:text-[19px] font-semibold text-white font-poppins">
          Judul Materi
        </h2>
        {isSaved && !isEditing && (
          <CheckCircle sx={{ fontSize: 20, color: "#2ea062" }} />
        )}
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setIsSaved(false);
        }}
        placeholder="Ketik disini untuk menulis judul materi..."
        className={`w-full px-4 py-3 rounded-xl text-[14px] border-2 font-poppins shadow-inner bg-white text-gray-900 transition-all ${
          isEditing
            ? "border-[#fcc61d] focus:outline-none focus:ring-2 focus:ring-[#fcc61d]/50"
            : "border-transparent focus:outline-none focus:ring-2 focus:ring-white/50"
        }`}
        disabled={!isEditing || isLoading}
      />

      <div className="flex gap-2 mt-3 justify-end">
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
              className="px-5 py-2 rounded-xl text-[12px] font-semibold transition-all font-poppins shadow-md hover:shadow-lg bg-gray-400 text-white hover:bg-gray-500 disabled:opacity-50"
            >
              Batal
            </button>
            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-5 py-2 rounded-xl text-[12px] font-semibold transition-all font-poppins shadow-md hover:shadow-lg bg-[#ff1919] text-white hover:bg-[#e01515] hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Delete sx={{ fontSize: 16 }} />
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!title.trim() || !hasChanges || isLoading}
              className="px-7 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg bg-[#2ea062] text-white hover:bg-[#26824f] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save sx={{ fontSize: 16 }} />
              Simpan
            </button>
          </>
        )}
      </div>
    </div>
  );
}
