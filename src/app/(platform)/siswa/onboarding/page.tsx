"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useSiswaProfile } from "@/hooks/siswa/useSiswaProfile";
import { updateMyProfile } from "@/lib/api/user";
import { setCookie } from "@/lib/storage";

// Cookie prefix (sama dengan middleware)
const COOKIE_PREFIX = "adaptivin_user_";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Selamat Datang! 👋",
    description:
      "Halo! Aku Kira, teman belajarmu! Aku akan menemanimu dalam petualangan seru belajar matematika. Siap-siap untuk pengalaman belajar yang menyenangkan!",
    icon: "🎉",
    color: "#33A1E0",
  },
  {
    id: 2,
    title: "Pilih Teman Belajarmu! 🐾",
    description:
      "Di Beranda, kamu bisa pilih karakter favoritmu! Ada banyak teman lucu yang siap menemanimu. Setiap karakter punya kepribadian unik lho!",
    icon: "🎯",
    color: "#FF6B9D",
  },
  {
    id: 3,
    title: "Belajar Materi Seru! �",
    description:
      "Klik menu Materi untuk belajar matematika dengan cara yang asyik! Ada video, gambar, dan penjelasan yang mudah dipahami. Belajar jadi lebih seru!",
    icon: "✨",
    color: "#FFB347",
  },
  {
    id: 4,
    title: "Kerjakan Kuis! 📝",
    description:
      "Setelah belajar, saatnya uji kemampuanmu dengan mengerjakan kuis! Jawab pertanyaan dengan teliti dan kumpulkan nilai terbaik!",
    icon: "🏆",
    color: "#8FBD41",
  },
  {
    id: 5,
    title: "Lihat Progresmu! 📊",
    description:
      "Klik ikon Profil untuk melihat nilai dan perkembanganmu! Kamu bisa lihat semua prestasi dan hasil kuismu di sana. Semangat terus ya!",
    icon: "🚀",
    color: "#9B59B6",
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  // Get user profile from backend
  const { data: profile, isLoading } = useSiswaProfile();
  const userName = profile?.nama_lengkap || "Sobat Belajar";

  const handleNext = async () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Selesai onboarding, simpan ke database DAN set cookie
      try {
        await updateMyProfile({ has_completed_onboarding: true });
        // Set cookie untuk cache middleware
        setCookie("hasSeenOnboarding", "true", { maxAge: 365 * 24 * 60 * 60 }); // 1 year in seconds
      } catch (error) {
        console.error("Failed to mark onboarding as completed:", error);
      }
      router.push("/siswa/beranda");
    }
  };

  const handleSkip = async () => {
    // Simpan ke database DAN set cookie saat skip
    try {
      await updateMyProfile({ has_completed_onboarding: true });
      // Set cookie untuk cache middleware
      setCookie("hasSeenOnboarding", "true", { maxAge: 365 * 24 * 60 * 60 }); // 1 year in seconds
    } catch (error) {
      console.error("Failed to mark onboarding as completed:", error);
    }
    router.push("/siswa/beranda");
  };

  const currentStepData = onboardingSteps[currentStep];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#E8F6FF] to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#33A1E0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#0A3D60] font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-[#E8F6FF] via-[#F0F9FF] to-white">
      {/* Animated Sky Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Sky Layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB]/30 via-[#E8F6FF]/20 to-transparent"></div>

        {/* Floating stars and sparkles - More dynamic */}
        <motion.div
          className="absolute top-[15%] left-[8%] text-4xl"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ⭐
        </motion.div>

        <motion.div
          className="absolute top-[25%] right-[12%] text-3xl"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -360],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          ✨
        </motion.div>

        <motion.div
          className="absolute top-[45%] left-[5%] text-3xl"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          🌟
        </motion.div>

        <motion.div
          className="absolute top-[35%] right-[20%] text-2xl"
          animate={{
            y: [0, 25, 0],
            rotate: [0, -360],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          💫
        </motion.div>

        <motion.div
          className="absolute bottom-[35%] left-[15%] text-3xl"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          ✨
        </motion.div>

        <motion.div
          className="absolute bottom-[45%] right-[10%] text-4xl"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -180, -360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5,
          }}
        >
          🌟
        </motion.div>
      </div>

      {/* Blushing Leaf (Trees) at Bottom - Behind card */}
      <div className="absolute bottom-0 left-0 right-0 z-[5] pointer-events-none">
        {/* Left Tree - At very bottom */}
        <motion.div
          className="absolute bottom-0 left-[-30px] sm:left-[-40px] w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[350px] md:h-[350px]"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <DotLottieReact src="/lottie/Blushing Leaf.lottie" loop autoplay />
        </motion.div>

        {/* Right Tree - At very bottom */}
        <motion.div
          className="absolute bottom-0 right-[-30px] sm:right-[-40px] w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[350px] md:h-[350px]"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [2, -2, 2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <DotLottieReact src="/lottie/Blushing Leaf.lottie" loop autoplay />
        </motion.div>

        {/* Center Small Tree - Hidden on mobile, visible on tablet+ */}
        <motion.div
          className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 w-[220px] h-[220px] lg:w-[260px] lg:h-[260px] opacity-80"
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <DotLottieReact src="/lottie/Blushing Leaf.lottie" loop autoplay />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-4">
        {/* Mascot and Cloud Container - Centered above greeting */}
        <div className="relative w-full max-w-2xl mb-1">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {/* Cloud Lottie - Left Side - Bigger on mobile */}
            <motion.div
              className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px]"
              animate={{
                x: [-10, 10, -10],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <DotLottieReact src="/lottie/awan.lottie" loop autoplay />
            </motion.div>

            {/* Kira Mascot with Airplane - Center */}
            <motion.div
              className="relative w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px]"
              animate={{
                y: [0, -15, 0],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/mascot/mascot-3.svg"
                alt="Kira - Mascot"
                width={280}
                height={280}
                className="object-contain drop-shadow-2xl"
                priority
              />

              {/* Airplane Trail Effect */}
              <motion.div
                className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scaleX: [0.9, 1.1, 0.9],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Cloud Lottie - Right Side - Bigger on mobile */}
            <motion.div
              className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px]"
              animate={{
                x: [10, -10, 10],
                y: [0, -15, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <DotLottieReact src="/lottie/awan.lottie" loop autoplay />
            </motion.div>
          </div>
        </div>

        {/* Greeting Text - Right below mascot */}
        <motion.div
          className="text-center mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0A3D60] mb-1.5">
            Halo, {userName}! 👋
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            Yuk, kenalan sama fitur-fitur serunya!
          </p>
        </motion.div>

        {/* Content Card with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
            className="w-full max-w-lg relative z-10"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border-4 border-white/60 relative overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#33A1E0] via-[#FF6B9D] to-[#FFB347]"></div>

              {/* Step Indicator */}
              <div className="flex justify-center gap-2 mb-6 mt-2">
                {onboardingSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2.5 rounded-full transition-all duration-300 ${index === currentStep
                      ? "w-10 bg-[#0A3D60]"
                      : index < currentStep
                        ? "w-2.5 bg-[#0A3D60]/50"
                        : "w-2.5 bg-gray-300"
                      }`}
                    animate={{
                      scale: index === currentStep ? [1, 1.15, 1] : 1,
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: index === currentStep ? Infinity : 0,
                      repeatDelay: 1,
                    }}
                  />
                ))}
              </div>

              {/* Icon */}
              <motion.div
                className="text-7xl sm:text-8xl text-center mb-5"
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, 8, -8, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {currentStepData.icon}
              </motion.div>

              {/* Title */}
              <h2
                className="text-2xl sm:text-3xl font-bold text-center mb-4 text-[#0A3D60] leading-tight"
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.08)",
                }}
              >
                {currentStepData.title}
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-700 text-center leading-relaxed mb-8 px-2">
                {currentStepData.description}
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Skip Button */}
                {currentStep < onboardingSteps.length - 1 && (
                  <button
                    onClick={handleSkip}
                    className="px-6 py-3.5 rounded-full font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 transition-all duration-300 active:scale-95 hover:shadow-md"
                  >
                    Lewati
                  </button>
                )}

                {/* Next/Start Button */}
                <button
                  onClick={handleNext}
                  className="flex-1 relative group overflow-hidden px-8 py-3.5 rounded-full font-bold text-white shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${currentStepData.color} 0%, ${currentStepData.color}cc 100%)`,
                  }}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <span className="relative z-10 flex items-center justify-center gap-2.5 text-base sm:text-lg">
                    {currentStep < onboardingSteps.length - 1
                      ? "Lanjut"
                      : "Mulai Petualangan!"}
                    <span className="text-2xl">
                      {currentStep < onboardingSteps.length - 1 ? "→" : "🚀"}
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Fade - Behind trees */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/30 to-transparent pointer-events-none z-[1]"></div>
    </div>
  );
}
