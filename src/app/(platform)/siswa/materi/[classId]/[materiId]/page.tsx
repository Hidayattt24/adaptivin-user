"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MobileWarning from "@/components/siswa/layout/MobileWarning";
import { useClassTheme } from "@/contexts/ClassThemeContext";
import { useMateriById } from "@/hooks/siswa/useMateri";

/**
 * Materi Detail Page
 *
 * NO NAVBAR MOBILE - Only back button to class list
 * Displays detailed content of a specific material
 * URL: /siswa/materi/4/pecahan-biasa-campuran-4
 */

export default function MateriDetailPage() {
  const [isMobile, setIsMobile] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { theme } = useClassTheme();

  const classId = params?.classId as string;
  const materiId = params?.materiId as string;

  // Fetch materi data dari database (bukan mock)
  const { data: materi, isLoading, error } = useMateriById(materiId);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Redirect if material not found
  useEffect(() => {
    if (error || (!isLoading && !materi)) {
      router.push(`/siswa/materi/${classId}`);
    }
  }, [materi, error, isLoading, classId, router]);

  if (!isMobile) {
    return <MobileWarning />;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#33A1E0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4c859a] font-medium">Memuat materi...</p>
        </div>
      </div>
    );
  }

  if (!materi) {
    return null; // Will redirect
  }

  // Sort sub_materi by urutan
  const sortedSubMateri = materi.sub_materi ? [...materi.sub_materi].sort((a, b) => a.urutan - b.urutan) : [];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-white">
      {/* Header with Gradient Background - NO NAVBAR */}
      <div
        className="relative px-6 pt-12 pb-8 overflow-hidden"
        style={{
          background: theme.gradients.background,
        }}
      >
        {/* Back Button to Class List */}
        <button
          onClick={() => router.push(`/siswa/materi/${classId}`)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <span className="material-symbols-outlined text-white text-xl">
            arrow_back
          </span>
        </button>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12" />
        </div>

        {/* Content */}
        <div className="relative z-10 pt-8">
          {/* Class Badge */}
          <div className="flex justify-center mb-4">
            <div
              className="px-6 py-1.5 rounded-full"
              style={{
                background: theme.gradients.badge || theme.colors.badge,
              }}
            >
              <p className="text-white text-sm font-semibold">
                {theme.name} {theme.romanNumeral}
              </p>
            </div>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: theme.colors.iconBg,
              }}
            >
              <span className="material-symbols-outlined text-white text-4xl">
                book
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white text-center leading-tight">
            {materi.judul_materi}
          </h1>

          {/* Description */}
          <p className="text-white/90 text-sm text-center mt-3 max-w-sm mx-auto">
            {materi.deskripsi || "Materi pembelajaran"}
          </p>
        </div>
      </div>

      {/* Content Section - DATA DARI sub_materi */}
      <div className="px-6 py-8">
        {/* Sub Materi List */}
        {sortedSubMateri.length > 0 ? (
          <div className="space-y-6">
            {sortedSubMateri.map((subMateri, index) => (
              <div
                key={subMateri.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
              >
                {/* Sub Materi Title */}
                <h2
                  className="text-lg font-bold mb-3 flex items-center gap-2"
                  style={{ color: theme.colors.text.primary }}
                >
                  <span
                    className="flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold"
                    style={{ background: theme.colors.primary }}
                  >
                    {index + 1}
                  </span>
                  {subMateri.judul_sub_materi}
                </h2>

                {/* Sub Materi Content */}
                {subMateri.isi_materi && (
                  <div
                    className="text-sm leading-relaxed mb-4 prose prose-sm max-w-none"
                    style={{ color: theme.colors.text.secondary }}
                    dangerouslySetInnerHTML={{ __html: subMateri.isi_materi }}
                  />
                )}

                {/* Media (PDF, Video, Gambar) */}
                {subMateri.sub_materi_media && subMateri.sub_materi_media.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {subMateri.sub_materi_media.map((media) => (
                      <div key={media.id}>
                        {/* Gambar */}
                        {media.tipe_media === "gambar" && (
                          <div className="rounded-lg overflow-hidden relative w-full min-h-[200px]">
                            <Image
                              src={media.url}
                              alt="Materi gambar"
                              width={800}
                              height={600}
                              className="w-full h-auto object-contain"
                              unoptimized // Karena dari external URL (Supabase Storage)
                            />
                          </div>
                        )}

                        {/* Video */}
                        {media.tipe_media === "video" && (
                          <div className="rounded-lg overflow-hidden">
                            <video
                              src={media.url}
                              controls
                              className="w-full h-auto"
                            >
                              Browser Anda tidak mendukung video.
                            </video>
                          </div>
                        )}

                        {/* PDF */}
                        {media.tipe_media === "pdf" && (
                          <a
                            href={media.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-lg border-2 hover:scale-[1.02] transition-all"
                            style={{
                              borderColor: theme.colors.primary,
                              color: theme.colors.primary,
                            }}
                          >
                            <span className="material-symbols-outlined text-2xl">
                              picture_as_pdf
                            </span>
                            <span className="font-medium">Lihat PDF</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: `${theme.colors.primary}20` }}
            >
              <span
                className="material-symbols-outlined text-4xl"
                style={{ color: theme.colors.primary }}
              >
                construction
              </span>
            </div>
            <p className="text-slate-600 text-sm">
              Belum ada isi materi. Guru sedang menyiapkan konten pembelajaran.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          {/* Baca Isi Materi Button */}
          <Link
            href={`/siswa/materi/${classId}/${materiId}/1`}
            className="block w-full py-4 rounded-2xl font-semibold text-white text-center shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{
              background: theme.colors.primary,
            }}
          >
            📚 Baca Isi Materi
          </Link>

          {/* Start Quiz Button */}
          <Link
            href={`/siswa/materi/${classId}/${materiId}/kuis`}
            className="block w-full py-4 rounded-2xl font-semibold text-center border-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{
              borderColor: theme.colors.primary,
              color: theme.colors.primary,
            }}
          >
            Mulai Kuis 🎯
          </Link>

          {/* Practice Button */}
          <button
            className="block w-full py-4 rounded-2xl font-semibold text-center border-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{
              borderColor: theme.colors.primary,
              color: theme.colors.primary,
            }}
          >
            Latihan Soal 📝
          </button>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-12" />

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional"
      />
    </div>
  );
}
