"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useClassTheme } from "@/contexts/ClassThemeContext";
import IsiMateriCard from "@/components/siswa/materi/IsiMateriCard";
import MateriDropdown from "@/components/siswa/materi/MateriDropdown";
import MediaViewerModal from "@/components/siswa/materi/MediaViewerModal";
import { useSubMateriById } from "@/hooks/siswa/useMateri";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorIcon from "@mui/icons-material/Error";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DescriptionIcon from "@mui/icons-material/Description";

export default function IsiMateriPage() {
  const [uploadSectionOpen, setUploadSectionOpen] = useState(true);
  const [bacaanSectionOpen, setBacaanSectionOpen] = useState(true);
  const [mediaModal, setMediaModal] = useState<{
    isOpen: boolean;
    type: "pdf" | "video";
    url: string;
    title: string;
  }>({
    isOpen: false,
    type: "pdf",
    url: "",
    title: "",
  });

  const params = useParams();
  const router = useRouter();
  const { theme } = useClassTheme();

  const classId = params?.classId as string;
  const materiId = params?.materiId as string;
  const subMateriId = params?.subMateriId as string;

  // Fetch sub materi data
  const { data: subMateri, isLoading, error } = useSubMateriById(subMateriId);

  // Separate media by type
  const pdfMedia =
    subMateri?.sub_materi_media?.filter((m) => m.tipe_media === "pdf") || [];
  const videoMedia =
    subMateri?.sub_materi_media?.filter((m) => m.tipe_media === "video") || [];
  const gambarMedia =
    subMateri?.sub_materi_media?.filter((m) => m.tipe_media === "gambar") || [];

  // Open media viewer
  const openMediaViewer = (
    type: "pdf" | "video",
    url: string,
    title: string
  ) => {
    setMediaModal({
      isOpen: true,
      type,
      url,
      title,
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div
        className="relative w-full min-h-screen overflow-x-hidden flex items-center justify-center"
        style={{
          background: `linear-gradient(180deg, ${theme.colors.primary} 0%, #FFFFFF 100%)`,
        }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold">Memuat materi...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !subMateri) {
    return (
      <div
        className="relative w-full min-h-screen overflow-x-hidden flex items-center justify-center"
        style={{
          background: `linear-gradient(180deg, ${theme.colors.primary} 0%, #FFFFFF 100%)`,
        }}
      >
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ErrorIcon sx={{ color: "#ef4444", fontSize: "48px" }} />
          </div>
          <h2 className="text-white font-bold text-xl mb-2">
            Materi Tidak Ditemukan
          </h2>
          <p className="text-white/80 mb-4">
            Materi yang Anda cari tidak tersedia
          </p>
          <button
            onClick={() => router.push(`/siswa/materi/${classId}`)}
            className="px-6 py-2 bg-white text-gray-700 rounded-full font-semibold hover:bg-gray-100 transition-all"
          >
            Kembali ke Daftar Materi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full min-h-screen overflow-x-hidden"
      style={{
        background: `linear-gradient(180deg, ${theme.colors.primary} 0%, #FFFFFF 100%)`,
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => router.push(`/siswa/materi/${classId}/${materiId}`)}
        className="absolute top-4 md:top-5 left-4 md:left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all z-10"
      >
        <ArrowBackIcon sx={{ color: "white", fontSize: "20px" }} />
      </button>

      {/* Content Container - Desktop Centered & Compact */}
      <div className="px-[25px] md:px-8 lg:px-12 pt-[41px] md:pt-16 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* MATERI UPLOAD SECTION */}
          <div className="mb-6 md:mb-7">
            {/* Section Header */}
            <div className="flex items-center justify-center gap-3 mb-4 md:mb-5">
              {/* Title Badge */}
              <div
                className="px-6 md:px-7 py-2 rounded-[20px] h-[34px] md:h-[36px] flex items-center justify-center shadow-lg"
                style={{
                  background: theme.gradients.badge || theme.colors.badge,
                }}
              >
                <p className="text-white text-[13px] md:text-sm font-semibold">
                  📚 Materi Upload
                </p>
              </div>

              {/* Dropdown Button */}
              <MateriDropdown
                isOpen={uploadSectionOpen}
                onToggle={() => setUploadSectionOpen(!uploadSectionOpen)}
                gradientColor={theme.gradients.badge || theme.colors.badge}
              />
            </div>

            {/* Upload Cards - Desktop Grid */}
            {uploadSectionOpen &&
              (pdfMedia.length > 0 || videoMedia.length > 0) && (
                <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                  {/* PDF Cards */}
                  {pdfMedia.map((media, index) => (
                    <IsiMateriCard
                      key={media.id}
                      type="pdf"
                      title={`File ${subMateri.judul_sub_materi} ${
                        pdfMedia.length > 1 ? `(${index + 1})` : ""
                      }`}
                      classColor={theme.colors.primary}
                      onClick={() => {
                        openMediaViewer(
                          "pdf",
                          media.url,
                          `File ${subMateri.judul_sub_materi} ${
                            pdfMedia.length > 1 ? `(${index + 1})` : ""
                          }`
                        );
                      }}
                    />
                  ))}

                  {/* Video Cards */}
                  {videoMedia.map((media, index) => (
                    <IsiMateriCard
                      key={media.id}
                      type="video"
                      title={`Video ${subMateri.judul_sub_materi} ${
                        videoMedia.length > 1 ? `(${index + 1})` : ""
                      }`}
                      classColor={theme.colors.primary}
                      onClick={() => {
                        openMediaViewer(
                          "video",
                          media.url,
                          `Video ${subMateri.judul_sub_materi} ${
                            videoMedia.length > 1 ? `(${index + 1})` : ""
                          }`
                        );
                      }}
                    />
                  ))}
                </div>
              )}

            {/* No Media Message */}
            {uploadSectionOpen &&
              pdfMedia.length === 0 &&
              videoMedia.length === 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center">
                  <FolderOpenIcon
                    sx={{
                      color: "#9ca3af",
                      fontSize: "48px",
                      marginBottom: "8px",
                    }}
                  />
                  <p className="text-gray-500 text-sm">
                    Belum ada file atau video yang diupload untuk materi ini
                  </p>
                </div>
              )}
          </div>

          {/* MATERI BACAAN SECTION */}
          <div className="mb-6 md:mb-7">
            {/* Section Header */}
            <div className="flex items-center justify-center gap-3 mb-4 md:mb-5">
              {/* Title Badge */}
              <div
                className="px-6 md:px-7 py-2 rounded-[20px] h-[34px] md:h-[36px] flex items-center justify-center shadow-lg"
                style={{
                  background: theme.gradients.badge || theme.colors.badge,
                }}
              >
                <p className="text-white text-[13px] md:text-sm font-semibold">
                  📖 Materi Bacaan
                </p>
              </div>

              {/* Dropdown Button */}
              <MateriDropdown
                isOpen={bacaanSectionOpen}
                onToggle={() => setBacaanSectionOpen(!bacaanSectionOpen)}
                gradientColor={theme.gradients.badge || theme.colors.badge}
              />
            </div>

            {/* Reading Card - Content from guru's input */}
            {bacaanSectionOpen && (
              <div className="bg-white rounded-[10px] md:rounded-[15px] w-full shadow-xl overflow-hidden">
                {/* Card Content - Scrollable for long text */}
                <div className="p-6 md:p-7 max-h-[600px] md:max-h-[550px] overflow-y-auto custom-scrollbar">
                  {/* Main Title - From database */}
                  <h1
                    className="text-[18px] md:text-2xl font-bold text-center mb-5 md:mb-6 leading-tight"
                    style={{ color: theme.colors.primary }}
                  >
                    {subMateri.judul_sub_materi}
                  </h1>

                  {/* Images uploaded by guru */}
                  {gambarMedia.length > 0 && (
                    <div className="space-y-4 my-4">
                      {gambarMedia.map((media) => (
                        <div
                          key={media.id}
                          className="w-full h-[150px] md:h-[200px] rounded-[10px] overflow-hidden"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={media.url}
                            alt="Ilustrasi Materi"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Content - Text from database */}
                  {/* whitespace-pre-line preserves line breaks from textarea */}
                  {subMateri.isi_materi && (
                    <div className="text-[#666] text-[12px] md:text-sm leading-relaxed whitespace-pre-line mb-4">
                      {subMateri.isi_materi}
                    </div>
                  )}

                  {/* No Content Message */}
                  {!subMateri.isi_materi && gambarMedia.length === 0 && (
                    <div className="text-center py-8">
                      <DescriptionIcon
                        sx={{
                          color: "#9ca3af",
                          fontSize: "48px",
                          marginBottom: "8px",
                        }}
                      />
                      <p className="text-gray-500 text-sm">
                        Belum ada konten bacaan untuk materi ini
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-12" />

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme.colors.primary};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme.colors.primary}dd;
        }
      `}</style>

      {/* Media Viewer Modal */}
      <MediaViewerModal
        isOpen={mediaModal.isOpen}
        onClose={() => setMediaModal({ ...mediaModal, isOpen: false })}
        type={mediaModal.type}
        url={mediaModal.url}
        title={mediaModal.title}
      />
    </div>
  );
}
