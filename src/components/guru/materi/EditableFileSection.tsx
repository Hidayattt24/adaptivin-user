"use client";

import React, { useState } from "react";
import {
  Edit,
  Save,
  Delete,
  CheckCircle,
  InsertDriveFile,
  CloudUpload,
  Visibility,
} from "@mui/icons-material";

interface EditableFileSectionProps {
  title: string;
  initialFile: File | null;
  initialFileName?: string;
  initialFileUrl?: string;
  accept: string;
  formatHint: string;
  onSave: (file: File | null) => Promise<void>;
  onDelete?: () => Promise<void>;
  onPreview?: () => void;
}

export function EditableFileSection({
  title,
  initialFile,
  initialFileName,
  initialFileUrl,
  accept,
  formatHint,
  onSave,
  onDelete,
  onPreview,
}: EditableFileSectionProps) {
  const [file, setFile] = useState<File | null>(initialFile);
  const [fileName, setFileName] = useState(initialFileName || initialFile?.name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(!!initialFile);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasFile = !!file || !!fileName;
  const hasChanges = file !== initialFile;

  const handleEdit = () => {
    setIsEditing(true);
    setIsSaved(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setIsSaved(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFileName(droppedFile.name);
      setIsSaved(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(file);
      setIsEditing(false);
      setIsSaved(true);
    } catch (error) {
      console.error("Failed to save file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(initialFile);
    setFileName(initialFileName || initialFile?.name || "");
    setIsEditing(false);
    setIsSaved(!!initialFile);
  };

  const handleDeleteFile = async () => {
    if (!onDelete) return;

    setIsLoading(true);
    try {
      await onDelete();
      setFile(null);
      setFileName("");
      setIsEditing(false);
      setIsSaved(false);
    } catch (error) {
      console.error("Failed to delete file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[17px] md:text-[19px] font-semibold text-white font-poppins">
          {title}
        </h2>
        {isSaved && hasFile && !isEditing && (
          <CheckCircle sx={{ fontSize: 20, color: "#2ea062" }} />
        )}
      </div>

      <div
        className={`bg-white rounded-xl p-4 transition-all ${
          isDragging
            ? "border-2 border-dashed border-[#fcc61d] bg-[#fcc61d]/5"
            : "border-2 border-transparent"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {hasFile ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                <InsertDriveFile sx={{ fontSize: 24, color: "white" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 font-poppins truncate">
                  {fileName}
                </p>
                <p className="text-xs text-gray-500 font-poppins">{formatHint}</p>
              </div>
            </div>
            {isSaved && !isEditing && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2ea062] text-white rounded-lg text-xs font-semibold font-poppins">
                <CheckCircle sx={{ fontSize: 16 }} />
                Sukses diunggah
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <input
              type="file"
              id={`file-input-${title}`}
              accept={accept}
              onChange={handleFileSelect}
              className="hidden"
              disabled={!isEditing || isLoading}
            />
            <label htmlFor={`file-input-${title}`}>
              <div className="flex flex-col items-center gap-2 cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-[#336d82]/10 to-[#2a5a6d]/10 rounded-full flex items-center justify-center">
                  <CloudUpload sx={{ fontSize: 32, color: "#336d82" }} />
                </div>
                <p className="text-sm text-gray-700 font-poppins font-medium">
                  Klik untuk unggah atau seret file kesini
                </p>
                <p className="text-xs text-gray-500 font-poppins">{formatHint}</p>
              </div>
            </label>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3 justify-end">
        {!isEditing ? (
          <>
            {onPreview && (initialFileUrl || file) && (
              <button
                onClick={onPreview}
                className="px-5 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg bg-white text-[#336d82] hover:bg-gray-50 hover:-translate-y-0.5"
              >
                <Visibility sx={{ fontSize: 16 }} />
                Preview
              </button>
            )}
            <button
              onClick={handleEdit}
              className="px-5 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg bg-gradient-to-r from-[#fcc61d] to-[#f5b800] text-white hover:-translate-y-0.5"
            >
              <Edit sx={{ fontSize: 16 }} />
              Edit
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-5 py-2 rounded-xl text-[12px] font-semibold transition-all font-poppins shadow-md hover:shadow-lg bg-gray-400 text-white hover:bg-gray-500 disabled:opacity-50"
            >
              Batal
            </button>
            {onDelete && hasFile && (
              <button
                onClick={handleDeleteFile}
                disabled={isLoading}
                className="px-5 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg bg-[#ff1919] text-white hover:bg-[#e01515] hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Delete sx={{ fontSize: 16 }} />
                Hapus
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!hasChanges || isLoading}
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
