"use client";

import React from "react";
import { Close } from "@mui/icons-material";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "image" | "pdf" | "video" | "document";
  src: string;
  fileName?: string;
}

export default function PreviewModal({
  isOpen,
  onClose,
  type,
  src,
  fileName,
}: PreviewModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
        aria-label="Tutup"
      >
        <Close sx={{ fontSize: 28, color: "white" }} />
      </button>

      {/* Content */}
      <div className="relative max-w-6xl w-full max-h-[90vh] overflow-auto">
        {type === "image" && (
          <img
            src={src}
            alt="Preview"
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        )}

        {type === "pdf" && (
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            <iframe
              src={src}
              className="w-full h-[85vh]"
              title="PDF Preview"
            />
          </div>
        )}

        {type === "video" && (
          <video
            src={src}
            controls
            autoPlay
            className="w-full h-auto rounded-lg shadow-2xl"
          >
            Browser Anda tidak mendukung video.
          </video>
        )}

        {type === "document" && (
          <div className="bg-white rounded-lg shadow-2xl p-8 text-center">
            <p className="text-gray-700 mb-4 font-poppins">
              Preview tidak tersedia untuk format ini
            </p>
            <p className="text-sm text-gray-500 mb-6 font-poppins">
              {fileName}
            </p>
            <a
              href={src}
              download={fileName}
              className="inline-block px-6 py-3 bg-[#336d82] text-white rounded-lg hover:bg-[#2a5a6d] transition-colors font-poppins font-semibold"
            >
              Download File
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
