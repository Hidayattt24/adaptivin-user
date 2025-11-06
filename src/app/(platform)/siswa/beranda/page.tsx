"use client";

import { useState, useEffect } from "react";
import MobileWarning from "@/components/siswa/layout/MobileWarning";
import Header from "@/components/siswa/layout/Header";
import SectionTitle from "@/components/siswa/layout/SectionTitle";
import CardCarousel from "@/components/siswa/carousel/CardCarousel";
import MobileNavbar from "@/components/siswa/navigation/MobileNavbar";
import { useSiswaProfile } from "@/hooks/siswa/useSiswaProfile";

export default function BerandaSiswaPage() {
  const [isMobile, setIsMobile] = useState(true);

  const { data: profile, isLoading } = useSiswaProfile();

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Desktop warning
  if (!isMobile) {
    return <MobileWarning />;
  }

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
      "I": "4",
      "II": "5",
      "III": "6",
      "IV": "4",
      "V": "5",
      "VI": "6"
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
      {/* Decorative Background Elements - Subtle and Playful */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Waves */}
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[#E8F6FF]/40 to-transparent"></div>

        {/* Floating Geometric Shapes */}
        <div className="absolute top-[120px] right-[30px] w-16 h-16 border-4 border-[#FFB347]/20 rounded-2xl rotate-12 animate-float"></div>
        <div className="absolute top-[180px] left-[20px] w-12 h-12 bg-[#33A1E0]/10 rounded-full animate-float-delayed"></div>
        <div className="absolute top-[450px] right-[50px] w-10 h-10 bg-[#FF6B9D]/10 rounded-lg rotate-45 animate-float"></div>

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#33A1E0 1px, transparent 1px), linear-gradient(90deg, #33A1E0 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#33A1E0]/5 to-transparent rounded-bl-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#FFB347]/5 to-transparent rounded-tr-[100px]"></div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(12deg);
          }
          50% {
            transform: translateY(-20px) rotate(12deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
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
      <div className="relative z-10">
        {/* Header with greeting and profile - Data dari database otomatis */}
        <Header username={namaLengkap} />

        {/* Section Title */}
        <SectionTitle>Ayo Tentukan Level Petualanganmu</SectionTitle>

        {/* Card Carousel - Data dari database */}
        <CardCarousel cards={cards} />

        {/* Mobile Navigation Bar - Karakter dari database otomatis */}
        <MobileNavbar />

        {/* Bottom Spacing for navbar */}
        <div className="h-32"></div>
      </div>
    </div>
  );
}
