"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import Swal from "sweetalert2";
import MobileNavbar from "@/components/siswa/navigation/MobileNavbar";
import InfiniteCarousel from "@/components/siswa/carousel/InfiniteCarousel";
import EmojiText from "@/components/common/EmojiText";
import {
  useSiswaProfile,
  useUpdateSiswaProfile,
  useKarakter,
} from "@/hooks/siswa/useSiswaProfile";

// Character color mapping (corrected order)
const characterColors: Record<number, string> = {
  1: "#0F61AD", // Bro Kerbuz
  2: "#832C4C", // Kocheng Oren
  3: "#8FBD41", // Mas Gwebek
  4: "#568C1C", // Mas Pace
  5: "#BB5D57", // Mas Piggy
  6: "#5F3C32", // Pak Bubu
  7: "#F564A9", // Sis Bun Bun
};

// Character descriptions (by index)
const characterDescriptions: Record<number, string> = {
  1: "Petualang cerdas yang nggak pernah takut tantangan! 🐮✨ Siap bantu kamu menguasai matematika!",
  2: "Si raja santuy yang selalu hoki 😾👑. Paling jago bikin suasana belajar jadi seru!",
  3: "Kodok hijau yang lincah dan ceria! 🐸💚 Expert dalam menjelaskan konsep rumit dengan mudah!",
  4: "Kura kura pekerja keras yang nggak pernah menyerah! 🐢💪 Motivator terbaik buat kamu tetap semangat!",
  5: "Babi pintar yang suka ngitung duit... eh, maksudnya angka! 🐷💰 Ahli dalam soal-soal logika!",
  6: "Beruang hantu bijaksana yang tahu segalanya! 🐻📚 Guru sabar yang selalu ada buat kamu!",
  7: "Kelinci cepat yang lompat dari soal ke soal! 🐰⚡ Spesialis dalam mengerjakan soal dengan cepat!",
};

export default function PilihKarakterPage() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("");
  const [centerCharacterId, setCenterCharacterId] = useState<string>("");

  const { data: profile, isLoading: isLoadingProfile } = useSiswaProfile();
  const { data: karakterData, isLoading: isLoadingKarakter } = useKarakter();
  const { mutateAsync: updateProfile } = useUpdateSiswaProfile();

  useEffect(() => {
    // Disable scroll restoration for this page
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return () => {
      // Restore default scroll behavior when leaving page
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  // Load current character from profile
  useEffect(() => {
    if (profile?.karakter_id) {
      setSelectedCharacterId(profile.karakter_id);
      setCenterCharacterId(profile.karakter_id);
    } else if (karakterData && karakterData.karakter.length > 0) {
      // Default to first character if no character selected
      const firstChar = karakterData.karakter[0];
      setSelectedCharacterId(firstChar.id);
      setCenterCharacterId(firstChar.id);
    }
  }, [profile, karakterData]);

  // Map karakter data to carousel format
  const characters = (karakterData?.karakter || []).map((karakter) => ({
    id: karakter.id,
    name: `Karakter ${karakter.index}`, // You can add nama field to database if needed
    path: karakter.karakter_url,
    description:
      characterDescriptions[karakter.index] || "Teman belajar yang seru!",
    color: characterColors[karakter.index] || "#33A1E0",
  }));

  // Confetti effect with stars
  const triggerConfetti = () => {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ["star"],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ["circle"],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  const handleSelectCharacter = async (characterId: string) => {
    setSelectedCharacterId(characterId);
    triggerConfetti();

    // Simpan langsung ke database ketika card di-klik
    try {
      await updateProfile({ karakter_id: characterId });
      // Success notification (optional - bisa di-comment jika terlalu banyak notif)
      // Swal sudah di-handle oleh mutation hook yang update cache
    } catch (error: unknown) {
      console.error("Gagal menyimpan karakter:", error);

      // Tampilkan error message yang user-friendly
      const getErrorMessage = (err: unknown): string => {
        if (err && typeof err === "object") {
          // AxiosError structure
          if (
            "response" in err &&
            err.response &&
            typeof err.response === "object" &&
            "data" in err.response
          ) {
            const data = err.response.data as { message?: string };
            if (data?.message) return data.message;
          }
          // Generic Error
          if ("message" in err && typeof err.message === "string") {
            return err.message;
          }
        }
        return "Gagal menyimpan karakter. Silakan coba lagi.";
      };

      const errorMessage = getErrorMessage(error);

      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: errorMessage,
        confirmButtonColor: "#336d82",
      });
    }
  };

  if (isLoadingProfile || isLoadingKarakter) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center px-4">
          {/* Simple Loading Spinner */}
          <div className="w-16 h-16 mx-auto mb-6">
            <div className="w-full h-full border-4 border-[#33A1E0]/20 border-t-[#33A1E0] rounded-full animate-spin"></div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A3D60]">
              Memuat Karakter
            </h3>
            <p className="text-sm sm:text-base text-gray-500 font-medium">
              Tunggu sebentar ya, teman belajarmu sedang bersiap! ✨
            </p>
          </div>

          {/* Animated Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-[#33A1E0] rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-[#FF6B9D] rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-[#FFB347] rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  const centerCharacter = characters.find((c) => c.id === centerCharacterId);

  // Use local mascot for pilih-karakter page instead of selected character
  const mascotImageForNavbar = "/mascot/mascot-2.svg";

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-white">
      {/* Decorative Background Elements - More playful for kids */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Colorful gradient waves */}
        <div className="absolute top-0 left-0 right-0 h-[300px] md:h-[400px] bg-gradient-to-b from-[#E8F6FF]/40 via-[#FFE8F5]/20 to-transparent"></div>

        {/* Floating stars */}
        <div className="absolute top-[80px] right-[40px] text-4xl animate-float">
          ⭐
        </div>
        <div className="absolute top-[150px] left-[30px] text-3xl animate-float-delayed">
          ✨
        </div>
        <div
          className="absolute hidden md:block top-[200px] right-[120px] text-5xl animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          🌟
        </div>
        <div
          className="absolute hidden lg:block top-[120px] left-[100px] text-4xl animate-float-delayed"
          style={{ animationDelay: "1s" }}
        >
          💫
        </div>
        <div
          className="absolute hidden lg:block bottom-[200px] right-[80px] text-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        >
          ⭐
        </div>
        <div
          className="absolute hidden lg:block bottom-[250px] left-[120px] text-4xl animate-float-delayed"
          style={{ animationDelay: "2s" }}
        >
          ✨
        </div>

        {/* Colorful geometric shapes */}
        <div className="absolute top-[120px] right-[30px] w-16 h-16 border-4 border-[#FFB347]/30 rounded-2xl rotate-12 animate-float"></div>
        <div className="absolute top-[180px] left-[20px] w-12 h-12 bg-[#FF6B9D]/20 rounded-full animate-float-delayed"></div>
        <div className="absolute hidden lg:block top-[250px] right-[100px] w-14 h-14 bg-[#33A1E0]/20 rounded-lg rotate-45 animate-float"></div>
        <div className="absolute hidden lg:block bottom-[150px] left-[80px] w-16 h-16 border-4 border-[#9B59B6]/20 rounded-full animate-float-delayed"></div>

        {/* Cute clouds */}
        <div className="absolute hidden md:block top-[100px] left-[200px] opacity-30">
          <div className="relative w-24 h-12 bg-white rounded-full">
            <div className="absolute -left-4 top-2 w-16 h-10 bg-white rounded-full"></div>
            <div className="absolute -right-4 top-3 w-14 h-8 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="absolute hidden lg:block bottom-[180px] right-[150px] opacity-20">
          <div className="relative w-20 h-10 bg-white rounded-full">
            <div className="absolute -left-3 top-1 w-14 h-8 bg-white rounded-full"></div>
            <div className="absolute -right-3 top-2 w-12 h-7 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#33A1E0 1px, transparent 1px), linear-gradient(90deg, #33A1E0 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Corner decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFB347]/10 to-transparent rounded-bl-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#FF6B9D]/10 to-transparent rounded-tr-[100px]"></div>
      </div>

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
        /* Gradient animation for title */
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header - Medium for Desktop */}
        <div className="px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 md:pt-10 pb-2 sm:pb-3 md:pb-3">
          <div className="max-w-2xl mx-auto">
            {/* Fun animated title */}
            <div className="relative inline-block w-full">
              <h1 className="text-[26px] sm:text-[30px] md:text-[32px] font-bold text-[#0A3D60] text-center drop-shadow-lg leading-tight">
                Pilih Teman
                <br />
                <EmojiText tag="span" size={18}>
                  Belajarmu 🐾
                </EmojiText>
              </h1>
            </div>
          </div>
        </div>

        {/* Fun character info card - Medium for Desktop */}
        <div className="px-4 sm:px-6 md:px-8 mt-3 sm:mt-4 md:mt-5">
          <div className="max-w-xl mx-auto">
            <div
              className="rounded-2xl md:rounded-[26px] p-4 sm:p-4 md:p-5 shadow-xl"
              style={{
                background:
                  "linear-gradient(180deg, #33A1E0 0.03%, #0A3D60 124.56%)",
              }}
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                <div className="text-center flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 truncate">
                    {centerCharacter?.name || "Pilih Karaktermu!"}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full animate-pulse flex-shrink-0"></div>
                    <p className="text-xs sm:text-[13px] md:text-sm text-white font-medium">
                      Siap menemanimu belajar!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mascot Helper Note - Desktop only */}
        <div className="hidden md:block px-4 sm:px-6 md:px-8 mt-4">
          <div className="max-w-xl mx-auto">
            <div
              className="backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-white/50"
              style={{
                background:
                  "linear-gradient(180deg, #33A1E0 0.03%, #0A3D60 124.56%)",
              }}
            >
              <div className="flex items-start gap-3">
                {/* Mascot Image */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
                    <img
                      src="/mascot/mascot-2.svg"
                      alt="Mascot"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="flex-1 pt-1">
                  <div className="bg-white/90 rounded-xl px-4 py-3 shadow-sm">
                    <p className="text-sm font-semibold text-[#0A3D60] leading-relaxed">
                      💡 <span className="font-bold">Tips:</span> Kamu bisa
                      scroll langsung dengan mouse kamu, lalu klik card pilihan
                      kamu!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Infinite Carousel - Medium for Desktop */}
        <div className="mt-4 sm:mt-6 md:mt-6">
          <InfiniteCarousel
            items={characters}
            onSelect={handleSelectCharacter}
            selectedId={selectedCharacterId}
            onCenterChange={setCenterCharacterId}
            showNavigationButtons={true}
          />
        </div>

        {/* Select Button - Medium for Desktop */}
        <div className="flex justify-center mt-5 sm:mt-6 md:mt-7 px-4 sm:px-6 md:px-8">
          <button
            onClick={() => {
              handleSelectCharacter(centerCharacterId);
              triggerConfetti();
            }}
            className="relative group text-white text-sm sm:text-[15px] md:text-[15px] font-bold px-8 sm:px-10 md:px-11 py-2.5 sm:py-3 md:py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 active:scale-95 md:hover:scale-105 md:hover:-translate-y-1 overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, #33A1E0 0.03%, #0A3D60 124.56%)",
            }}
          >
            {/* Animated background shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            {/* Button text */}
            <span className="relative z-10 flex items-center gap-2 md:gap-2.5">
              <span className="text-xl sm:text-2xl md:text-[26px] animate-bounce">
                🎮
              </span>
              <span>Pilih Teman Ini!</span>
              <span
                className="text-xl sm:text-2xl md:text-[26px] animate-bounce"
                style={{ animationDelay: "0.3s" }}
              >
                ✨
              </span>
            </span>

            {/* Sparkle effects */}
            <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] bg-yellow-300 rounded-full animate-ping"></div>
            <div
              className="absolute -bottom-1 -left-1 w-3 h-3 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] bg-pink-300 rounded-full animate-ping"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </button>
        </div>

        {/* Navigation Bar - Medium for Desktop */}
        <div className="mt-12 sm:mt-16 md:mt-16">
          <MobileNavbar characterImage={mascotImageForNavbar} />
        </div>

        {/* Bottom Spacing - Medium for Desktop */}
        <div className="h-20 sm:h-24 md:h-28"></div>
      </div>
    </div>
  );
}
