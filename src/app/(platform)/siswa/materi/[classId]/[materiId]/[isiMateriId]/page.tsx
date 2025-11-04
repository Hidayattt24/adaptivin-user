"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
 * 
 * Responsive: Mobile & Desktop optimized
 */

export default function IsiMateriPage() {
  const [uploadSectionOpen, setUploadSectionOpen] = useState(true);
  const [bacaanSectionOpen, setBacaanSectionOpen] = useState(true);

  const params = useParams();
  const router = useRouter();
  const { theme } = useClassTheme();

  const classId = params?.classId as string;
  const materiId = params?.materiId as string;
  const isiMateriId = params?.isiMateriId as string;

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
        className="absolute top-4 md:top-5 left-4 md:left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all z-10"
      >
        <span className="material-symbols-outlined text-white text-xl">
          arrow_back
        </span>
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
            {uploadSectionOpen && (
              <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
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
                <div className="p-6 md:p-7 max-h-[600px] md:max-h-[550px] overflow-y-auto">
                  {/* Main Title - From "Isi judul materi utama" input */}
                  <h1
                    className="text-[18px] md:text-2xl font-bold text-center mb-5 md:mb-6 leading-tight"
                    style={{ color: theme.colors.primary }}
                  >
                    Pecahan Biasa & Campuran
                  </h1>

                  {/* Content - Text from guru's explanation input */}
                  {/* whitespace-pre-line preserves line breaks from textarea */}
                  <div className="text-[#666] text-[12px] md:text-sm leading-relaxed whitespace-pre-line">
                    {`Bayangkan kamu punya satu kue ulang tahun yang lezat. Kalau kamu ingin membaginya dengan 3 temanmu, kamu harus memotongnya jadi 4 bagian yang sama besar, kan?`}
                  </div>

                  {/* Sub-section Title - From "Isi judul sub-bagian" input */}
                  <h2
                    className="text-[15px] md:text-lg font-bold mt-5 mb-3 leading-tight"
                    style={{ color: theme.colors.primary }}
                  >
                    📌 Pecahan Biasa
                  </h2>

                  <div className="text-[#666] text-[12px] md:text-sm leading-relaxed whitespace-pre-line">
                    {`Pecahan Biasa itu seperti saat kamu mengambil 1 potong dari 4 total potongan yang ada. Kita menuliskannya sebagai 1/4.`}
                  </div>

                  {/* Images uploaded by guru */}
                  <div className="w-full h-[150px] md:h-[200px] rounded-[10px] overflow-hidden my-4">
                    <img
                      src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"
                      alt="Ilustrasi Materi"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Sub-section Title - From "Isi judul sub-bagian" input */}
                  <h2
                    className="text-[15px] md:text-lg font-bold mt-5 mb-3 leading-tight"
                    style={{ color: theme.colors.primary }}
                  >
                    📌 Pecahan Campuran
                  </h2>

                  <div className="text-[#666] text-[12px] md:text-sm leading-relaxed whitespace-pre-line">
                    {`Nah, Pecahan Campuran itu kalau kamu punya 1 kue utuh DAN 1/4 potong kue lagi. Kita menuliskannya sebagai 1 ¼. Gampang, kan?

Dengan memahami pecahan, kamu bisa membagi apa saja secara adil - mulai dari kue, pizza, atau bahkan permen! Sekarang coba latihan dengan contoh-contoh lainnya ya!`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* UJI KEMAMPUAN BUTTON */}
          <div className="mt-6 md:mt-7">
            <button
              onClick={() => {
                router.push(`/siswa/materi/${classId}/${materiId}/${isiMateriId}/kuis`);
              }}
              className="w-full max-w-[230px] md:max-w-[260px] h-[34px] md:h-[40px] rounded-[20px] flex items-center justify-center mx-auto hover:opacity-90 hover:scale-105 transition-all shadow-lg"
              style={{
                background: theme.gradients.badge || theme.colors.badge,
              }}
            >
              {/* Icon */}
              <div
                className="w-[21px] h-[21px] md:w-[24px] md:h-[24px] rounded-full flex items-center justify-center mr-2"
                style={{
                  backgroundColor: theme.colors.primary,
                }}
              >
                <span className="material-symbols-outlined text-white text-[14px] md:text-[16px]">
                  psychology
                </span>
              </div>

              {/* Text */}
              <p className="text-white text-[11px] md:text-[13px] font-semibold">
                Uji Kemampuanku Sekarang!
              </p>
            </button>
          </div>
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
