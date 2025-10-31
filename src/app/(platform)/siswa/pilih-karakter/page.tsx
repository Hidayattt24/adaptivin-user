"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import MobileNavbar from "@/components/siswa/navigation/MobileNavbar";
import InfiniteCarousel from "@/components/siswa/carousel/InfiniteCarousel";
import EmojiText from "@/components/common/EmojiText";

// Character color mapping for borders
const characterColors: Record<string, string> = {
  "bro-kerbuz": "#0F61AD",
  "kocheng-oren": "#832C4C",
  "mas-gwebek": "#8FBD41",
  "mas-pace": "#568C1C",
  "mas-piggy": "#BB5D57",
  "pak-bubu": "#5F3C32",
  "sin-bunbun": "#F564A9",
};

const characters = [
  {
    id: "kocheng-oren",
    name: "KOCHENG OREN",
    path: "/siswa/pilih-karakter/kocheng-oren.svg",
    description:
      "Si raja santuy yang selalu hoki 🍊👑. Paling jago bikin suasana belajar jadi seru!",
    color: characterColors["kocheng-oren"],
  },
  {
    id: "bro-kerbuz",
    name: "BRO KERBUZ",
    path: "/siswa/pilih-karakter/bro-kerbuz.svg",
    description:
      "Petualang cerdas yang nggak pernah takut tantangan! 🦝✨ Siap bantu kamu menguasai matematika!",
    color: characterColors["bro-kerbuz"],
  },
  {
    id: "mas-gwebek",
    name: "MAS GWEBEK",
    path: "/siswa/pilih-karakter/mas-gwebek.svg",
    description:
      "Kodok hijau yang lincah dan ceria! 🐸💚 Expert dalam menjelaskan konsep rumit dengan mudah!",
    color: characterColors["mas-gwebek"],
  },
  {
    id: "mas-pace",
    name: "MAS PACE",
    path: "/siswa/pilih-karakter/mas-pace.svg",
    description:
      "Kuda pekerja keras yang nggak pernah menyerah! 🐴💪 Motivator terbaik buat kamu tetap semangat!",
    color: characterColors["mas-pace"],
  },
  {
    id: "mas-piggy",
    name: "MAS PIGGY",
    path: "/siswa/pilih-karakter/mas-piggy.svg",
    description:
      "Babi pintar yang suka ngitung duit... eh, maksudnya angka! 🐷💰 Ahli dalam soal-soal logika!",
    color: characterColors["mas-piggy"],
  },
  {
    id: "pak-bubu",
    name: "PAK BUBU",
    path: "/siswa/pilih-karakter/pak-bubu.svg",
    description:
      "Burung hantu bijaksana yang tahu segalanya! 🦉📚 Guru sabar yang selalu ada buat kamu!",
    color: characterColors["pak-bubu"],
  },
  {
    id: "sin-bunbun",
    name: "SIN BUNBUN",
    path: "/siswa/pilih-karakter/sin-bunbun.svg",
    description:
      "Kelinci cepat yang lompat dari soal ke soal! 🐰⚡ Spesialis dalam mengerjakan soal dengan cepat!",
    color: characterColors["sin-bunbun"],
  },
];

export default function PilihKarakterPage() {
  const [selectedCharacter, setSelectedCharacter] = useState("kocheng-oren");
  const [centerCharacter, setCenterCharacter] = useState("kocheng-oren");

  useEffect(() => {
    // Disable scroll restoration for this page
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    return () => {
      // Restore default scroll behavior when leaving page
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

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

  const handleSelectCharacter = (characterId: string) => {
    setSelectedCharacter(characterId);
    triggerConfetti();
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-white">
      {/* Decorative Background Elements - More playful for kids */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Colorful gradient waves */}
        <div className="absolute top-0 left-0 right-0 h-[300px] md:h-[400px] bg-gradient-to-b from-[#E8F6FF]/40 via-[#FFE8F5]/20 to-transparent"></div>

        {/* Floating stars */}
        <div className="absolute top-[80px] right-[40px] text-4xl animate-float">⭐</div>
        <div className="absolute top-[150px] left-[30px] text-3xl animate-float-delayed">✨</div>
        <div className="absolute hidden md:block top-[200px] right-[120px] text-5xl animate-float" style={{ animationDelay: '0.5s' }}>🌟</div>
        <div className="absolute hidden lg:block top-[120px] left-[100px] text-4xl animate-float-delayed" style={{ animationDelay: '1s' }}>💫</div>
        <div className="absolute hidden lg:block bottom-[200px] right-[80px] text-3xl animate-float" style={{ animationDelay: '1.5s' }}>⭐</div>
        <div className="absolute hidden lg:block bottom-[250px] left-[120px] text-4xl animate-float-delayed" style={{ animationDelay: '2s' }}>✨</div>

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
          0%, 100% {
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
      <div className="relative z-10">
        {/* Header - Compact for Desktop */}
        <div className="px-4 sm:px-6 md:px-6 lg:px-8 pt-8 sm:pt-10 md:pt-6 pb-2 sm:pb-3 md:pb-3">
          <div className="max-w-2xl mx-auto">
            {/* Fun animated title */}
            <div className="relative inline-block w-full">
              <h1 className="text-[26px] sm:text-[30px] md:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#33A1E0] via-[#FF6B9D] to-[#FFB347] text-center drop-shadow-lg leading-tight animate-gradient">
                Pilih Teman
                <br />
                <EmojiText tag="span" size={18}>Belajarmu 🐾</EmojiText>
              </h1>
            </div>
          </div>
        </div>

        {/* Fun character info card - Compact for Desktop */}
        <div className="px-4 sm:px-6 md:px-6 lg:px-8 mt-3 sm:mt-4 md:mt-4">
          <div className="max-w-lg mx-auto">
            <div className="bg-gradient-to-r from-[#E8F6FF] via-white to-[#FFE8F5] rounded-2xl sm:rounded-2xl p-3 sm:p-3 md:p-3 shadow-xl border-2 border-[#33A1E0]/20">
              <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-3">
                <div className="text-2xl sm:text-3xl md:text-3xl animate-bounce flex-shrink-0">🎯</div>
                <div className="text-center flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg md:text-lg font-bold text-[#4c859a] mb-1 truncate">
                    {characters.find(c => c.id === centerCharacter)?.name || "Pilih Karaktermu!"}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                    <p className="text-[11px] sm:text-xs md:text-xs text-gray-600 font-medium">Siap menemanimu belajar!</p>
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl md:text-3xl animate-bounce flex-shrink-0" style={{ animationDelay: '0.5s' }}>🎉</div>
              </div>
            </div>
          </div>
        </div>

        {/* Infinite Carousel - All screen sizes - Compact for Desktop */}
        <div className="mt-4 sm:mt-6 md:mt-6">
          <InfiniteCarousel
            items={characters}
            onSelect={handleSelectCharacter}
            selectedId={selectedCharacter}
            onCenterChange={setCenterCharacter}
            showNavigationButtons={true}
          />
        </div>

        {/* Select Button - Compact for Desktop */}
        <div className="flex justify-center mt-5 sm:mt-6 md:mt-5 px-4 sm:px-6 md:px-6">
          <button
            onClick={() => {
              handleSelectCharacter(centerCharacter);
              triggerConfetti();
            }}
            className="relative group bg-gradient-to-r from-[#33A1E0] via-[#2B7A9E] to-[#336d82] text-white text-sm sm:text-[15px] md:text-sm font-bold px-8 sm:px-10 md:px-10 py-2.5 sm:py-3 md:py-2.5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 active:scale-95 md:hover:scale-105 md:hover:-translate-y-1 overflow-hidden"
          >
            {/* Animated background shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            {/* Button text */}
            <span className="relative z-10 flex items-center gap-2 md:gap-2">
              <span className="text-xl sm:text-2xl md:text-2xl animate-bounce">🎮</span>
              <span>Pilih Teman Ini!</span>
              <span className="text-xl sm:text-2xl md:text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>✨</span>
            </span>

            {/* Sparkle effects */}
            <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 sm:w-4 sm:h-4 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </button>
        </div>

        {/* Navigation Bar - All screen sizes */}
        <div className="mt-12 sm:mt-16 md:mt-12">
          <MobileNavbar
            characterImage={`/siswa/foto-profil/${selectedCharacter}.svg`}
          />
        </div>

        {/* Bottom Spacing - Compact for Desktop */}
        <div className="h-20 sm:h-24 md:h-24"></div>
      </div>
    </div>
  );
}
