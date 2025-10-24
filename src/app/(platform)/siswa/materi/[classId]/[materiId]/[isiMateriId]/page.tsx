"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MobileWarning from "@/components/siswa/layout/MobileWarning";
import { useClassTheme } from "@/contexts/ClassThemeContext";
import IsiMateriCard from "@/components/siswa/materi/IsiMateriCard";
import MateriDropdown from "@/components/siswa/materi/MateriDropdown";

/**
 * Isi Materi Page
 *
 * Menampilkan konten materi dengan section:
 * - Materi Upload (PDF & Video)
 * - Materi Bacaan
 * - Button untuk Kuis
 */

export default function IsiMateriPage() {
  const [isMobile, setIsMobile] = useState(true);
  const [uploadSectionOpen, setUploadSectionOpen] = useState(true);
  const [bacaanSectionOpen, setBacaanSectionOpen] = useState(true);

  const params = useParams();
  const router = useRouter();
  const { theme } = useClassTheme();

  const classId = params?.classId as string;
  const materiId = params?.materiId as string;
  const isiMateriId = params?.isiMateriId as string;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isMobile) {
    return <MobileWarning />;
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
        onClick={() => router.push(`/siswa/materi/${classId}`)}
        className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all z-10"
      >
        <span className="material-symbols-outlined text-white text-xl">
          arrow_back
        </span>
      </button>

      {/* Content Container */}
      <div className="px-[25px] pt-[41px] pb-8">
        {/* MATERI UPLOAD SECTION */}
        <div className="mb-8">
          {/* Section Header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {/* Title Badge */}
            <div
              className="px-6 py-2 rounded-[20px] h-[34px] flex items-center justify-center shadow-lg"
              style={{
                background: theme.gradients.badge || theme.colors.badge,
              }}
            >
              <p className="text-white text-[13px] font-semibold">
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

          {/* Upload Cards */}
          {uploadSectionOpen && (
            <div className="space-y-4">
              {/* PDF Card */}
              <IsiMateriCard
                type="pdf"
                title="File Pecahan Biasa & Campuran"
                classColor={theme.colors.primary}
                onClick={() => {
                  console.log("Open PDF");
                }}
              />

              {/* Video Card */}
              <IsiMateriCard
                type="video"
                title="Video Pecahan Biasa & Campuran"
                classColor={theme.colors.primary}
                onClick={() => {
                  console.log("Open Video");
                }}
              />
            </div>
          )}
        </div>

        {/* MATERI BACAAN SECTION */}
        <div className="mb-8">
          {/* Section Header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {/* Title Badge */}
            <div
              className="px-6 py-2 rounded-[20px] h-[34px] flex items-center justify-center shadow-lg"
              style={{
                background: theme.gradients.badge || theme.colors.badge,
              }}
            >
              <p className="text-white text-[13px] font-semibold">
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

          {/* Reading Card - Designed for long content from admin */}
          {bacaanSectionOpen && (
            <div className="bg-white rounded-[10px] w-full shadow-xl overflow-hidden">
              {/* Card Content - Scrollable for long text */}
              <div className="p-6 max-h-[600px] overflow-y-auto">
                {/* Title */}
                <h2
                  className="text-[16px] font-bold text-center mb-4 leading-tight"
                  style={{ color: theme.colors.text.primary }}
                >
                  Cara Membagi Kue Agar Semua Kebagian!
                </h2>

                {/* Content - Will be from admin (MVP hardcoded) */}
                <div className="space-y-4 text-[#666] text-[12px] leading-relaxed">
                  <p>
                    Bayangkan kamu punya satu kue ulang tahun yang lezat.
                    Kalau kamu ingin membaginya dengan 3 temanmu, kamu harus
                    memotongnya jadi 4 bagian yang sama besar, kan?
                  </p>

                  <div
                    className="p-4 rounded-lg my-4"
                    style={{
                      background: `${theme.colors.primary}10`,
                      borderLeft: `4px solid ${theme.colors.primary}`,
                    }}
                  >
                    <p
                      className="font-bold mb-2 text-[13px]"
                      style={{ color: theme.colors.primary }}
                    >
                      📌 Pecahan Biasa
                    </p>
                    <p>
                      Pecahan Biasa itu seperti saat kamu mengambil 1 potong dari 4
                      total potongan yang ada. Kita menuliskannya sebagai <strong>1/4</strong>.
                    </p>
                  </div>

                  {/* Image */}
                  <div className="w-full h-[150px] rounded-[10px] overflow-hidden my-4">
                    <img
                      src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"
                      alt="Ilustrasi Kue"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="p-4 rounded-lg my-4"
                    style={{
                      background: `${theme.colors.primary}10`,
                      borderLeft: `4px solid ${theme.colors.primary}`,
                    }}
                  >
                    <p
                      className="font-bold mb-2 text-[13px]"
                      style={{ color: theme.colors.primary }}
                    >
                      📌 Pecahan Campuran
                    </p>
                    <p>
                      Nah, Pecahan Campuran itu kalau kamu punya 1 kue utuh DAN 1/4
                      potong kue lagi. Kita menuliskannya sebagai <strong>1 ¼</strong>.
                      Gampang, kan?
                    </p>
                  </div>

                  <p>
                    Dengan memahami pecahan, kamu bisa membagi apa saja secara adil -
                    mulai dari kue, pizza, atau bahkan permen! Sekarang coba latihan
                    dengan contoh-contoh lainnya ya!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* UJI KEMAMPUAN BUTTON */}
        <div className="mt-8">
          <button
            onClick={() => {
              router.push(`/siswa/materi/${classId}/${materiId}/kuis`);
            }}
            className="w-full max-w-[230px] h-[34px] rounded-[20px] flex items-center justify-center mx-auto hover:opacity-90 transition-opacity shadow-lg"
            style={{
              background: theme.gradients.badge || theme.colors.badge,
            }}
          >
            {/* Icon */}
            <div
              className="w-[21px] h-[21px] rounded-full flex items-center justify-center mr-2"
              style={{
                backgroundColor: theme.colors.primary,
              }}
            >
              <span className="material-symbols-outlined text-white text-[14px]">
                psychology
              </span>
            </div>

            {/* Text */}
            <p className="text-white text-[11px] font-semibold">
              Uji Kemampuanku Sekarang!
            </p>
          </button>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-12" />

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
