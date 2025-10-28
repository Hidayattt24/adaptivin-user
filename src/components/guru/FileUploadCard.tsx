"use client";

import React, { useState, useRef } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface FileUploadCardProps {
  label: string;
  accept?: string;
  maxSize?: number; // in MB
  files: File[];
  onFilesChange: (files: File[]) => void;
  optional?: boolean;
}

export function FileUploadCard({
  label,
  accept = "*",
  maxSize = 10,
  files,
  onFilesChange,
  optional = false,
}: FileUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndAddFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    setError("");
    const validFiles: File[] = [];

    Array.from(newFiles).forEach((file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File ${file.name} terlalu besar. Maksimal ${maxSize}MB`);
        return;
      }

      // Check if file already exists
      if (files.some((f) => f.name === file.name && f.size === file.size)) {
        setError(`File ${file.name} sudah ditambahkan`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndAddFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndAddFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    // You can customize icons based on file type
    return <InsertDriveFileIcon className="text-[#336d82]" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {optional && (
          <span className="text-xs text-gray-500">(Opsional)</span>
        )}
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? "border-[#336d82] bg-blue-50"
              : "border-gray-300 hover:border-[#336d82] hover:bg-gray-50"
          }
        `}
      >
        <CloudUploadIcon
          className={`mx-auto mb-3 ${
            isDragging ? "text-[#336d82]" : "text-gray-400"
          }`}
          sx={{ fontSize: 48 }}
        />
        <p className="text-sm text-gray-600 mb-1">
          <span className="text-[#336d82] font-medium">Klik untuk upload</span>{" "}
          atau drag & drop
        </p>
        <p className="text-xs text-gray-500">Maksimal {maxSize}MB</p>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              {getFileIcon(file.name)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <CheckCircleIcon className="text-green-500" fontSize="small" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 hover:bg-red-50 rounded-full transition-colors"
                aria-label={`Hapus ${file.name}`}
              >
                <DeleteIcon className="text-red-500" fontSize="small" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
