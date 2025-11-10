"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Header from "@/components/siswa/layout/Header";
import SectionTitle from "@/components/siswa/layout/SectionTitle";
import CardCarousel from "@/components/siswa/carousel/CardCarousel";
import MobileNavbar from "@/components/siswa/navigation/MobileNavbar";
import { useSiswaProfile } from "@/hooks/siswa/useSiswaProfile";

// Dynamically import DotLottieReact with SSR disabled
const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  { ssr: false }
);

export default function BerandaSiswaPage() {
  const { data: profile, isLoading } = useSiswaProfile();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#33A1E0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4c859a] font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  const kelas = profile?.kelas;
  const tingkatKelas = kelas?.tingkat_kelas || "4";
  const namaKelas = kelas?.nama_kelas || `Kelas ${tingkatKelas}`;
  const mataPelajaran = kelas?.mata_pelajaran || "Matematika";
  const namaLengkap = profile?.nama_lengkap || "Siswa";

  // Format tingkat kelas untuk nama file gambar
  // Menggunakan card kosong (card-1, card-2, card-3) sesuai tingkat kelas
  const formatKelasForImage = (tingkat: string): string => {
    // Convert Roman numerals to Arabic if needed
    const romanToArabic: Record<string, string> = {
      I: "4",
      II: "5",
      III: "6",
      IV: "4",
      V: "5",
      VI: "6",
    };

    // Check if it's a Roman numeral and convert it
    const arabicTingkat = romanToArabic[tingkat] || tingkat;

    // Map to card kosong: card-1 untuk kelas 4, card-2 untuk kelas 5, card-3 untuk kelas 6
    if (arabicTingkat === "6") return "card-3";
    if (arabicTingkat === "5") return "card-2";
    if (arabicTingkat === "4") return "card-1";

    // Default fallback ke card-1
    return "card-1";
  };

  const cards = [
    {
      id: kelas?.id || `kelas-${tingkatKelas}`,
      title: namaKelas,
      subtitle: mataPelajaran,
      imagePath: `/siswa/card-siswa/${formatKelasForImage(tingkatKelas)}.svg`,
      link: `/siswa/materi/${tingkatKelas}`,
      displayTitle: `${mataPelajaran}\n${namaKelas}`,
    },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-white">
      {/* Decorative Background Elements - Playful with SVG Assets */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Colorful Gradient Waves - Subtle */}
        <div className="absolute top-0 left-0 right-0 h-[350px] md:h-[450px] lg:h-[550px] bg-gradient-to-b from-[#E8F6FF]/40 via-[#FFE8F5]/20 to-transparent"></div>

        {/* SVG Assets - Bubble scattered around */}
        <div className="absolute top-[100px] md:top-[140px] right-[50px] md:right-[90px] w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 opacity-60 animate-float">
          <Image
            src="/assets/bubble.svg"
            alt="bubble"
            width={96}
            height={96}
            className="w-full h-full"
          />
        </div>

        <div className="absolute top-[220px] md:top-[300px] left-[40px] md:left-[70px] w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 opacity-50 animate-float-delayed">
          <Image
            src="/assets/bubble.svg"
            alt="bubble"
            width={80}
            height={80}
            className="w-full h-full"
          />
        </div>

        <div
          className="absolute bottom-[280px] md:bottom-[350px] right-[60px] md:right-[100px] w-12 h-12 md:w-16 md:h-16 opacity-45 animate-float"
          style={{ animationDelay: "1s" }}
        >
          <Image
            src="/assets/bubble.svg"
            alt="bubble"
            width={64}
            height={64}
            className="w-full h-full"
          />
        </div>

        <div
          className="absolute top-[380px] md:top-[480px] left-[35px] md:left-[60px] w-10 h-10 md:w-14 md:h-14 opacity-40 animate-float-delayed"
          style={{ animationDelay: "1.5s" }}
        >
          <Image
            src="/assets/bubble.svg"
            alt="bubble"
            width={56}
            height={56}
            className="w-full h-full"
          />
        </div>

        {/* Owl SVG - Cute companion */}
        <div className="absolute top-[160px] md:top-[220px] left-[25%] w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 opacity-70 animate-float">
          <Image
            src="/assets/owl.svg"
            alt="owl"
            width={128}
            height={128}
            className="w-full h-full"
          />
        </div>

        {/* Large Floating Emoji/Icons */}
        <div className="absolute top-[100px] md:top-[140px] right-[40px] md:right-[80px] text-4xl md:text-5xl lg:text-6xl animate-float opacity-70">
          🎯
        </div>
        <div className="absolute top-[200px] md:top-[280px] left-[30px] md:left-[60px] text-3xl md:text-4xl lg:text-5xl animate-float-delayed opacity-70">
          ⭐
        </div>
        <div
          className="absolute top-[350px] md:top-[450px] right-[60px] md:right-[100px] text-3xl md:text-4xl lg:text-5xl animate-float opacity-60"
          style={{ animationDelay: "0.5s" }}
        >
          🚀
        </div>
        <div
          className="absolute bottom-[250px] md:bottom-[300px] right-[30px] md:right-[70px] text-4xl md:text-5xl lg:text-6xl animate-float opacity-65"
          style={{ animationDelay: "1.5s" }}
        >
          📚
        </div>
        <div
          className="absolute bottom-[350px] md:bottom-[420px] left-[40px] md:left-[80px] text-3xl md:text-4xl lg:text-5xl animate-float-delayed opacity-60"
          style={{ animationDelay: "2s" }}
        >
          ✨
        </div>

        {/* Colorful Geometric Shapes - Subtle */}
        <div className="absolute top-[120px] md:top-[160px] right-[30px] md:right-[60px] w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 border-[5px] border-[#FFB347]/30 rounded-2xl rotate-12 animate-float"></div>
        <div className="absolute top-[180px] md:top-[240px] left-[20px] md:left-[50px] w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-[#33A1E0]/15 to-[#FF6B9D]/15 rounded-full animate-float-delayed"></div>
        <div
          className="absolute bottom-[200px] md:bottom-[280px] left-[60px] md:left-[100px] w-12 h-12 md:w-16 md:h-16 lg:w-18 lg:h-18 border-[4px] border-[#FF6B9D]/25 rounded-full animate-float-delayed"
          style={{ animationDelay: "0.8s" }}
        ></div>

        {/* Fun Stars Scatter - More subtle */}
        <div
          className="absolute top-[140px] md:top-[190px] left-[28%] text-xl md:text-2xl animate-pulse opacity-50"
          style={{ animationDelay: "0.5s" }}
        >
          ⭐
        </div>
        <div
          className="absolute top-[280px] md:top-[370px] right-[25%] text-lg md:text-xl animate-pulse opacity-45"
          style={{ animationDelay: "1s" }}
        >
          ✨
        </div>
        <div
          className="absolute bottom-[220px] md:bottom-[290px] left-[32%] text-xl md:text-2xl animate-pulse opacity-50"
          style={{ animationDelay: "1.5s" }}
        >
          🌟
        </div>

        {/* Decorative Corner Elements - Softer */}
        <div className="absolute top-0 right-0 w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 bg-gradient-to-bl from-[#FFB347]/10 via-[#FF6B9D]/5 to-transparent rounded-bl-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 md:w-52 md:h-52 lg:w-60 lg:h-60 bg-gradient-to-tr from-[#33A1E0]/10 via-[#9B59B6]/5 to-transparent rounded-tr-[120px]"></div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(12deg);
          }
          50% {
            transform: translateY(-25px) rotate(12deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header with greeting and profile - Data dari database otomatis */}
        <Header username={namaLengkap} />

        {/* Section Title */}
        <SectionTitle>Ayo Tentukan Level Petualanganmu</SectionTitle>

        {/* Card Carousel - Data dari database */}
        <CardCarousel cards={cards} />

        {/* Mobile Navigation Bar - Karakter dari database otomatis */}
        <MobileNavbar />

        {/* Bottom Spacing for navbar */}
        <div className="h-32 md:h-36"></div>
      </div>
    </div>
  );
}
