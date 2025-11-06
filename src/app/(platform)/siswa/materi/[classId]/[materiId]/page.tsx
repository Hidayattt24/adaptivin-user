"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useClassTheme } from "@/contexts/ClassThemeContext";
import { useMateriById } from "@/hooks/siswa/useMateri";

export default function SubMateriListPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useClassTheme();

  const classId = params?.classId as string;
  const materiId = params?.materiId as string;

  // Fetch materi with sub_materi
  const { data: materi, isLoading, error } = useMateriById(materiId);

  // Sort sub_materi by urutan
  const sortedSubMateri = materi?.sub_materi
    ? [...materi.sub_materi].sort((a, b) => a.urutan - b.urutan)
    : [];

  // Loading state
  if (isLoading) {
    return (
      <div
        className="relative w-full min-h-screen flex items-center justify-center"
        style={{ background: theme.gradients.background }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold">Memuat sub materi...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !materi) {
    return (
      <div
        className="relative w-full min-h-screen flex items-center justify-center"
        style={{ background: theme.gradients.background }}
      >
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-white text-3xl">
              error
            </span>
          </div>
          <h2 className="text-white font-bold text-xl mb-2">
            Materi Tidak Ditemukan
          </h2>
          <p className="text-white/80 mb-4">
            Materi yang Anda cari tidak tersedia
          </p>
          <button
            onClick={() => router.push(`/siswa/materi/${classId}`)}
            className="px-6 py-2 bg-white rounded-full font-semibold hover:bg-gray-100 transition-all"
            style={{ color: theme.colors.primary }}
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-white">
      {/* Header with Gradient Background */}
      <div
        className="relative px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden"
        style={{ background: theme.gradients.background }}
      >
        {/* Back Button */}
        <button
          onClick={() => router.push(`/siswa/materi/${classId}`)}
          className="absolute top-4 left-4 md:top-6 md:left-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all z-10"
        >
          <span className="material-symbols-outlined text-white text-xl md:text-2xl">
            arrow_back
          </span>
        </button>

        {/* Content */}
        <div className="relative z-10 pt-8 max-w-4xl mx-auto">
          {/* Class Badge */}
          <div className="flex justify-center mb-4 md:mb-6">
            <div
              className="px-6 py-1.5 md:px-8 md:py-2 rounded-full"
              style={{ background: theme.gradients.badge || theme.colors.badge }}
            >
              <p className="text-white text-sm md:text-base font-semibold">
                {theme.name} {theme.romanNumeral}
              </p>
            </div>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4 md:mb-6">
            <div
              className="w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center"
              style={{ background: theme.colors.iconBg }}
            >
              <span className="material-symbols-outlined text-white text-4xl md:text-6xl">
                menu_book
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold text-white text-center leading-tight">
            {materi.judul_materi}
          </h1>

          {/* Description */}
          {materi.deskripsi && (
            <p className="text-white/90 text-sm md:text-base text-center mt-3 md:mt-4 max-w-2xl mx-auto">
              {materi.deskripsi}
            </p>
          )}
        </div>
      </div>

      {/* Sub Materi Cards Section */}
      <div className="px-6 md:px-12 lg:px-16 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Sub Materi List */}
          {sortedSubMateri.length > 0 ? (
            <div className="space-y-4 mb-8">
              {sortedSubMateri.map((subMateri, index) => (
                <Link
                  key={subMateri.id}
                  href={`/siswa/materi/${classId}/${materiId}/${subMateri.id}`}
                  className="block bg-white rounded-2xl p-5 shadow-md border-2 border-transparent hover:border-current hover:scale-[1.02] active:scale-[0.98] transition-all"
                  style={{ borderColor: "transparent" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Number Badge */}
                    <div
                      className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white text-lg md:text-xl font-bold"
                      style={{ background: theme.colors.primary }}
                    >
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-base md:text-lg font-bold mb-1 truncate"
                        style={{ color: theme.colors.text.primary }}
                      >
                        {subMateri.judul_sub_materi}
                      </h3>
                      {subMateri.isi_materi && (
                        <p className="text-sm text-slate-500 line-clamp-2">
                          {subMateri.isi_materi.substring(0, 100)}
                          {subMateri.isi_materi.length > 100 ? "..." : ""}
                        </p>
                      )}
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex-shrink-0">
                      <span
                        className="material-symbols-outlined text-2xl"
                        style={{ color: theme.colors.primary }}
                      >
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 mb-8">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: `${theme.colors.primary}20` }}
              >
                <span
                  className="material-symbols-outlined text-4xl"
                  style={{ color: theme.colors.primary }}
                >
                  library_books
                </span>
              </div>
              <p className="text-slate-600 text-sm">
                Belum ada sub materi. Guru sedang menyiapkan konten pembelajaran.
              </p>
            </div>
          )}

          {/* Quiz Button */}
          {sortedSubMateri.length > 0 && (
            <div className="flex justify-center">
              <Link
                href={`/siswa/materi/${classId}/${materiId}/kuis`}
                className="px-8 py-4 rounded-2xl font-semibold text-white text-center shadow-lg hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center gap-3"
                style={{ background: theme.colors.primary }}
              >
                <span className="material-symbols-outlined text-2xl">
                  quiz
                </span>
                <span>Mulai Kuis 🎯</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-12 md:h-16" />

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional"
      />
    </div>
  );
}
