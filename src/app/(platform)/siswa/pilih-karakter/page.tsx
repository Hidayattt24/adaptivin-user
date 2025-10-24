"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import MobileWarning from "@/components/siswa/layout/MobileWarning";
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
  const [isMobile, setIsMobile] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState("kocheng-oren");
  const [centerCharacter, setCenterCharacter] = useState("kocheng-oren");

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Disable scroll restoration for this page
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
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

  const handleSelectCenter = () => {
    setSelectedCharacter(centerCharacter);
    triggerConfetti();
  };

  if (!isMobile) {
    return <MobileWarning />;
  }

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-white">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[#E8F6FF]/40 to-transparent"></div>
        <div className="absolute top-[120px] right-[30px] w-16 h-16 border-4 border-[#FFB347]/20 rounded-2xl rotate-12 animate-float"></div>
        <div className="absolute top-[180px] left-[20px] w-12 h-12 bg-[#33A1E0]/10 rounded-full animate-float-delayed"></div>
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#33A1E0 1px, transparent 1px), linear-gradient(90deg, #33A1E0 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#33A1E0]/5 to-transparent rounded-bl-[100px]"></div>
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
      `}</style>

      {/* Content */}
      <div className="relative z-10">
        <div className="px-6 pt-[71px] pb-4">
          <h1 className="text-[32px] font-semibold text-[#4c859a] text-center drop-shadow-sm leading-tight">
            Pilih Teman
            <br />
            <EmojiText tag="span" size={28}>Belajarmu 🐾</EmojiText>
          </h1>
          <p className="text-[10px] font-medium italic text-[#4c859a] text-center mt-3">
            Geser dan pilih hewan pixel yang akan menemanimu belajar.
          </p>
        </div>

        {/* Infinite Carousel */}
        <div className="mt-8">
          <InfiniteCarousel
            items={characters}
            onSelect={handleSelectCharacter}
            selectedId={selectedCharacter}
            onCenterChange={setCenterCharacter}
          />
        </div>

        {/* Select Button */}
        <div className="flex justify-center mt-8 px-6">
          <button
            onClick={handleSelectCenter}
            className="bg-[#336d82] text-white text-[13px] font-medium px-12 py-3 rounded-[20px] shadow-lg hover:bg-[#2B7A9E] transition-all duration-300 hover:scale-105"
          >
            Pilih
          </button>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="mt-16">
          <MobileNavbar
            characterImage={`/siswa/foto-profil/${selectedCharacter}.svg`}
          />
        </div>

        {/* Bottom Spacing */}
        <div className="h-24"></div>
      </div>
    </div>
  );
}
