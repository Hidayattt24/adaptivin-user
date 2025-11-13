"use client";

import React from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface SubMateri {
  id: string;
  judul_sub_materi: string;
  isi_materi: string | null;
  urutan: number;
  sub_materi_media?: Array<{
    id: string;
    tipe_media: "pdf" | "video" | "gambar";
    url: string;
  }>;
}

interface MateriPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  judul: string;
  deskripsi: string | null;
  subMateri: SubMateri[];
  isLoading?: boolean;
}

const MateriPreviewModal: React.FC<MateriPreviewModalProps> = ({
  isOpen,
  onClose,
  judul,
  deskripsi,
  subMateri,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#336D82] to-[#4A8BA6]">
          <div className="flex-1">
            <h2 className="text-2xl poppins-bold text-white">{judul}</h2>
            {deskripsi && (
              <p className="text-white/90 text-sm poppins-regular mt-1">
                {deskripsi}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Tutup preview"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : subMateri.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 poppins-medium text-lg">
                Belum ada sub materi
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Tambahkan sub materi melalui menu kelola materi
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {subMateri
                .sort((a, b) => a.urutan - b.urutan)
                .map((sub, index) => (
                  <div
                    key={sub.id}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    {/* Sub Materi Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#336D82] text-white rounded-full flex items-center justify-center poppins-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg poppins-semibold text-[#336D82]">
                          {sub.judul_sub_materi}
                        </h3>
                      </div>
                    </div>

                    {/* Sub Materi Content */}
                    {sub.isi_materi ? (
                      <div
                        className="text-gray-700 poppins-regular text-sm leading-relaxed pl-11 mb-4 whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: sub.isi_materi }}
                      />
                    ) : (
                      <div className="text-gray-400 poppins-regular text-sm italic pl-11 mb-4">
                        Tidak ada konten untuk sub materi ini
                      </div>
                    )}

                    {/* Media Attachments */}
                    {sub.sub_materi_media && sub.sub_materi_media.length > 0 && (
                      <div className="pl-11 space-y-3">
                        <p className="text-xs poppins-medium text-gray-500 uppercase">
                          Media Pendukung
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {sub.sub_materi_media.map((media) => (
                            <div
                              key={media.id}
                              className="border border-gray-200 rounded-lg p-3 hover:border-[#336D82] transition-colors"
                            >
                              {media.tipe_media === "gambar" && (
                                <div className="relative w-full h-32 rounded-md overflow-hidden bg-gray-100">
                                  <Image
                                    src={media.url}
                                    alt="Media gambar"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              {media.tipe_media === "video" && (
                                <div className="flex items-center gap-2 text-[#336D82]">
                                  <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                  </svg>
                                  <span className="text-sm poppins-medium">
                                    Video
                                  </span>
                                </div>
                              )}
                              {media.tipe_media === "pdf" && (
                                <div className="flex items-center gap-2 text-red-600">
                                  <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="text-sm poppins-medium">
                                    PDF
                                  </span>
                                </div>
                              )}
                              <a
                                href={media.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#336D82] hover:underline mt-2 block"
                              >
                                Buka media →
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 poppins-regular">
              Total {subMateri.length} sub materi
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#336D82] text-white rounded-xl poppins-semibold hover:bg-[#2a5a6a] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MateriPreviewModal;
