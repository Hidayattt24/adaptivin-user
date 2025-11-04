"use client";

import { useState, useEffect } from "react";
import Header from "@/components/siswa/layout/Header";
import SectionTitle from "@/components/siswa/layout/SectionTitle";
import CardCarousel from "@/components/siswa/carousel/CardCarousel";
import MobileNavbar from "@/components/siswa/navigation/MobileNavbar";
import Image from "next/image";
import Link from "next/link";
import { div } from "framer-motion/client";

export default function BerandaSiswaPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [showMascot, setShowMascot] = useState(true);
  const [mascotMessage, setMascotMessage] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Mascot messages rotation
  const mascotMessages = [
    "Halo! Aku Kiro, teman belajarmu! �",
    "Yuk semangat belajar hari ini! 💪",
    "Kamu pasti bisa! Ayo mulai! 🌟",
  ];

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Selamat Datang! 👋",
      message:
        "Hai! Aku Adaptivin, teman belajarmu. Mau aku tunjukkan cara pakai website ini?",
      emoji: "🤗",
      position: "center",
    },
    {
      title: "Pilih Kelasmu 📚",
      message:
        "Di sini kamu bisa pilih kelas yang mau dipelajari. Klik kartu kelas untuk mulai belajar!",
      emoji: "👆",
      position: "cards",
    },
    {
      title: "Lihat Profilmu 👤",
      message:
        "Klik foto profilmu untuk lihat perkembangan belajar dan ganti karakter favoritmu!",
      emoji: "⭐",
      position: "profile",
    },
    {
      title: "Siap Belajar! 🚀",
      message:
        "Sekarang kamu sudah siap! Yuk mulai petualangan belajarmu. Semangat ya! 💪",
      emoji: "🎉",
      position: "center",
    },
  ];

  // Fetch classes from API (example)
  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchClasses = async () => {
    //   const response = await fetch('/api/student/classes');
    //   const data = await response.json();
    //   setClasses(data);
    // };
    // fetchClasses();

    // Dummy data for now - nanti diganti dengan data dari backend
    const dummyClasses = [
      {
        id: "kelas-4",
        name: "Kelas 4A", // Dari admin input
        gradeLevel: 4,
        subject: "Matematika",
        imagePath: "/siswa/card-siswa/card-1.svg",
      },
      {
        id: "kelas-5",
        name: "Kelas 5B", // Dari admin input
        gradeLevel: 5,
        subject: "Matematika",
        imagePath: "/siswa/card-siswa/card-2.svg",
      },
      {
        id: "kelas-6",
        name: "Kelas 6C", // Dari admin input
        gradeLevel: 6,
        subject: "Matematika",
        imagePath: "/siswa/card-siswa/card-3.svg",
      },
    ];
    setClasses(dummyClasses);
  }, []);

  // Check if first visit - Show tutorial immediately
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedBeranda");
    if (!hasVisited) {
      setShowTutorial(true);
    }
  }, []);

  const handleNextTutorial = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
      localStorage.setItem("hasVisitedBeranda", "true");
    }
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("hasVisitedBeranda", "true");
  };

  const handleRestartTutorial = () => {
    setTutorialStep(0);
    setShowTutorial(true);
  };

  // Helper function to convert number to Roman numeral
  const toRoman = (num: number): string => {
    const romanNumerals: { [key: number]: string } = {
      1: "I",
      2: "II",
      3: "III",
      4: "IV",
      5: "V",
      6: "VI",
      7: "VII",
      8: "VIII",
      9: "IX",
      10: "X",
    };
    return romanNumerals[num] || num.toString();
  };

  // Transform classes data to cards format
  const cards = classes.map((classData) => ({
    id: classData.id,
    title: `${classData.subject} ${classData.name}`,
    imagePath: classData.imagePath,
    link: `/siswa/materi/${classData.gradeLevel}`,
    // Dynamic displayTitle based on admin input
    displayTitle: `${classData.subject}\nKelas ${toRoman(
      classData.gradeLevel
    )}`,
  }));

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-white">
      {/* Enhanced Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Waves */}
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-[#E8F6FF]/50 via-[#FFE8F5]/30 to-transparent"></div>

        {/* Floating Emoji Decorations */}
        <div className="absolute top-[100px] right-[10%] text-4xl md:text-5xl opacity-20 animate-float">
          ⭐
        </div>
        <div className="absolute top-[200px] left-[5%] text-3xl md:text-4xl opacity-20 animate-float-delayed">
          🎯
        </div>
        <div className="absolute top-[350px] right-[15%] text-3xl md:text-4xl opacity-20 animate-float">
          📚
        </div>
        <div className="absolute hidden md:block top-[150px] left-[15%] text-4xl opacity-20 animate-float-delayed">
          🚀
        </div>
        <div className="absolute hidden md:block top-[400px] left-[20%] text-3xl opacity-20 animate-float">
          💡
        </div>
        <div className="absolute hidden lg:block bottom-[250px] right-[10%] text-5xl opacity-20 animate-float-delayed">
          🎨
        </div>
        <div className="absolute hidden lg:block bottom-[300px] left-[10%] text-4xl opacity-20 animate-float">
          🏆
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute top-[120px] right-[30px] w-16 h-16 border-4 border-[#FFB347]/20 rounded-2xl rotate-12 animate-float"></div>
        <div className="absolute top-[180px] left-[20px] w-12 h-12 bg-[#33A1E0]/10 rounded-full animate-float-delayed"></div>
        <div className="absolute top-[450px] right-[50px] w-10 h-10 bg-[#FF6B9D]/10 rounded-lg rotate-45 animate-float"></div>
        <div className="absolute hidden lg:block top-[300px] left-[100px] w-14 h-14 border-4 border-[#FF6B9D]/15 rounded-full animate-float"></div>
        <div className="absolute hidden lg:block bottom-[200px] right-[150px] w-16 h-16 bg-[#FFB347]/10 rounded-2xl rotate-12 animate-float-delayed"></div>

        {/* Colorful Dots Pattern */}
        <div className="absolute top-[250px] left-[8%] flex gap-2 opacity-30">
          <div className="w-3 h-3 bg-[#33A1E0] rounded-full animate-pulse"></div>
          <div
            className="w-3 h-3 bg-[#FF6B9D] rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-3 h-3 bg-[#FFB347] rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
        <div className="absolute hidden md:block bottom-[350px] right-[12%] flex gap-2 opacity-30">
          <div className="w-3 h-3 bg-[#FFB347] rounded-full animate-pulse"></div>
          <div
            className="w-3 h-3 bg-[#33A1E0] rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-3 h-3 bg-[#FF6B9D] rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#33A1E0 1px, transparent 1px), linear-gradient(90deg, #33A1E0 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Decorative Corner Elements with Stars */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#33A1E0]/5 to-transparent rounded-bl-[100px]">
          <div className="absolute top-4 right-4 text-2xl opacity-30">✨</div>
        </div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#FFB347]/5 to-transparent rounded-tr-[100px]">
          <div className="absolute bottom-4 left-4 text-2xl opacity-30">🌟</div>
        </div>

        {/* Animated Sparkles */}
        <div className="absolute top-[180px] right-[25%] text-xl opacity-40 animate-sparkle">
          ✨
        </div>
        <div
          className="absolute hidden md:block top-[320px] left-[30%] text-xl opacity-40 animate-sparkle"
          style={{ animationDelay: "1s" }}
        >
          ✨
        </div>
        <div
          className="absolute hidden lg:block bottom-[280px] right-[20%] text-xl opacity-40 animate-sparkle"
          style={{ animationDelay: "2s" }}
        >
          ✨
        </div>
      </div>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-fade-in">
          {/* Tutorial Spotlight Effect */}
          <div className="absolute inset-0">
            {tutorialSteps[tutorialStep].position === "cards" && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[80%] h-[400px] bg-white/5 rounded-3xl animate-pulse-slow"></div>
            )}
            {tutorialSteps[tutorialStep].position === "profile" && (
              <div className="absolute top-8 right-8 w-32 h-32 bg-white/5 rounded-full animate-pulse-slow"></div>
            )}
          </div>

          {/* Tutorial Content */}
          <div className="relative h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-10 animate-scale-in border-4 border-[#33A1E0]">
              {/* Step Indicator */}
              <div className="flex justify-center gap-2 mb-6">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === tutorialStep
                        ? "w-8 bg-[#33A1E0]"
                        : "w-2 bg-gray-300"
                    }`}
                  ></div>
                ))}
              </div>

              {/* Mascot Emoji */}
              <div className="text-center mb-6">
                <div className="inline-block text-7xl md:text-8xl animate-bounce-gentle">
                  {tutorialSteps[tutorialStep].emoji}
                </div>
              </div>

              {/* Tutorial Text */}
              <h3 className="text-2xl md:text-3xl font-bold text-[#2B7A9E] text-center mb-4">
                {tutorialSteps[tutorialStep].title}
              </h3>
              <p className="text-lg md:text-xl text-gray-700 text-center mb-8 leading-relaxed">
                {tutorialSteps[tutorialStep].message}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {tutorialStep < tutorialSteps.length - 1 ? (
                  <>
                    <button
                      onClick={handleSkipTutorial}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                    >
                      Lewati
                    </button>
                    <button
                      onClick={handleNextTutorial}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-[#33A1E0] to-[#2B7A9E] text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                    >
                      Lanjut →
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleNextTutorial}
                    className="w-full px-6 py-4 bg-gradient-to-r from-[#33A1E0] via-[#FF6B9D] to-[#FFB347] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Mulai Belajar! 🚀
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Button - Show Tutorial Again - Compact for Desktop */}
      {!showTutorial && (
        <button
          onClick={handleRestartTutorial}
          className="fixed bottom-24 md:bottom-8 left-4 md:left-8 z-50 w-14 h-14 md:w-14 md:h-14 bg-gradient-to-br from-[#33A1E0] to-[#2B7A9E] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all group"
          title="Lihat Panduan"
        >
          <span className="text-2xl group-hover:animate-wave">❓</span>
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-4 py-2 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border-2 border-[#33A1E0]">
            <p className="text-sm font-bold text-[#2B7A9E]">Lihat Panduan</p>
          </div>
        </button>
      )}

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
        @keyframes slide-in-bounce {
          0% {
            transform: translateX(400px) scale(0);
            opacity: 0;
          }
          60% {
            transform: translateX(-20px) scale(1.1);
            opacity: 1;
          }
          80% {
            transform: translateX(10px) scale(0.95);
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes fade-in-up {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes bounce-gentle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes wave {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(20deg);
          }
          75% {
            transform: rotate(-20deg);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-slide-in-bounce {
          animation: slide-in-bounce 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out 0.5s both;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        .animate-wave {
          animation: wave 1.5s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in-delay 0.6s ease-out 0.3s both;
        }
        @keyframes sparkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.3) rotate(180deg);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-sparkle {
          animation: sparkle 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10">
        {/* Header with greeting and profile - Mobile Only */}
        <div className="md:hidden">
          <Header
            username="Farhan"
            profileImage="/siswa/foto-profil/kocheng-oren.svg"
          />
        </div>

        {/* Desktop/Tablet Header - Compact for Desktop */}
        <div className="hidden md:block px-6 lg:px-8 pt-5 pb-3">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center gap-3">
              {/* Animated Greeting Icon */}
              <div className="text-3xl animate-wave">👋</div>
              <div>
                <h1 className="text-xl poppins-bold text-[#2B7A9E] leading-tight drop-shadow-sm animate-fade-in">
                  Hallo Farhan!
                </h1>
                <p className="text-sm font-medium text-[#2B7A9E] mt-0.5 animate-fade-in-delay">
                  Siap belajar seru hari ini? 🚀
                </p>
              </div>
            </div>
            <div className="relative flex-shrink-0 group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#33A1E0] to-[#FF6B9D] rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-[0_4px_20px_0_rgba(43,122,158,0.2)] overflow-hidden border-3 border-[#33A1E0]/30 group-hover:border-[#33A1E0]/60 transition-all group-hover:scale-110">
                <Image
                  src="/siswa/foto-profil/kocheng-oren.svg"
                  alt="Farhan Profile"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Title - Mobile */}
        <div className="md:hidden">
          <SectionTitle>Ayo Tentukan Level Petualanganmu</SectionTitle>
        </div>

        {/* Card Carousel - Mobile */}
        <div className="md:hidden">
          <CardCarousel cards={cards} />
        </div>

        {/* Card Grid - Desktop/Tablet - Centered with Title */}
        <div className="hidden md:block px-6 lg:px-8 pb-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
            {/* Section Title - Close to Cards */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E8F6FF] to-[#FFE8F5] px-5 py-2 rounded-full shadow-lg border-2 border-[#33A1E0]/20">
                <span className="text-xl animate-bounce-gentle">🎯</span>
                <h2 className="text-base font-bold text-[#2B7A9E] drop-shadow-sm">
                  Ayo Tentukan Level Petualanganmu
                </h2>
                <span
                  className="text-xl animate-bounce-gentle"
                  style={{ animationDelay: "0.5s" }}
                >
                  🚀
                </span>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-3 gap-5 w-full">
              {cards.map((card) => (
                <Link key={card.id} href={card.link}>
                  <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-[#33A1E0]/10 hover:border-[#33A1E0]/40 hover:-translate-y-3 hover:scale-[1.02]">
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-10"></div>

                    {/* Card Content */}
                    <div className="aspect-[4/5] relative overflow-hidden">
                      {/* Background Image with Parallax */}
                      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                        <Image
                          src={card.imagePath}
                          alt={card.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                      {/* Text Overlay with Animation - No Shadow */}
                      {card.displayTitle && (
                        <div className="absolute inset-0 flex items-start justify-end p-5 transition-transform duration-500 group-hover:translate-y-[-4px]">
                          <div className="text-right transform transition-all duration-500 group-hover:scale-105">
                            <div className="press-start-2p-regular text-white text-base leading-relaxed">
                              {card.displayTitle.split("\n").map((line, i) => (
                                <div
                                  key={i}
                                  className="transform transition-all duration-500"
                                  style={{
                                    transitionDelay: `${i * 50}ms`,
                                  }}
                                >
                                  {line}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bottom Glow Effect */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#33A1E0] via-[#FF6B9D] to-[#FFB347] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-white/0 group-hover:border-white/60 transition-all duration-500 rounded-tl-2xl"></div>
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-white/0 group-hover:border-white/60 transition-all duration-500 rounded-br-2xl"></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Empty State Message if no classes - Compact */}
          {cards.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-32 h-32 mx-auto mb-5 bg-gradient-to-br from-[#E8F6FF] via-[#FFE8F5] to-[#FFF4E8] rounded-full flex items-center justify-center shadow-2xl animate-bounce-gentle border-4 border-white">
                <span className="text-6xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-[#2B7A9E] mb-2">
                Belum Ada Kelas Nih! 🤔
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Tenang, kelas kamu akan muncul di sini setelah guru
                menambahkanmu. Sabar ya! 😊
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Bar - All screen sizes */}
      <MobileNavbar characterImage="/siswa/foto-profil/kocheng-oren.svg" />

      {/* Bottom Spacing for navbar */}
      <div className="h-24 md:h-32 lg:h-36"></div>
    </div>
  );
}
