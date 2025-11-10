"use client";

import { useEffect } from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "pdf" | "video";
  url: string;
  title: string;
}

export default function MediaViewerModal({
  isOpen,
  onClose,
  type,
  url,
  title,
}: MediaViewerModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {type === "pdf" ? (
              <PictureAsPdfIcon sx={{ color: "white", fontSize: "24px" }} />
            ) : (
              <PlayCircleIcon sx={{ color: "white", fontSize: "24px" }} />
            )}
            <h2 className="text-white font-bold text-lg line-clamp-1">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
          >
            <CloseIcon sx={{ color: "white", fontSize: "20px" }} />
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-100 h-[calc(90vh-80px)] overflow-hidden">
          {type === "pdf" ? (
            // PDF Viewer
            <iframe
              src={url}
              className="w-full h-full"
              title={title}
              style={{ border: "none" }}
            />
          ) : (
            // Video Player
            <div className="w-full h-full flex items-center justify-center bg-black">
              <video
                controls
                className="w-full h-full"
                src={url}
                style={{ maxHeight: "100%" }}
              >
                Browser Anda tidak mendukung video player.
              </video>
            </div>
          )}
        </div>

        {/* Footer with External Link */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-gray-600 text-sm">
            {type === "pdf" ? "📄 Dokumen PDF" : "🎥 Video Pembelajaran"}
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all flex items-center gap-2"
          >
            <OpenInNewIcon sx={{ fontSize: "16px" }} />
            Buka di Tab Baru
          </a>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
