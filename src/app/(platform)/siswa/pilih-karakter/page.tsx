"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import MobileWarning from "@/components/siswa/layout/MobileWarning";
import MobileNavbar from "@/components/siswa/navigation/MobileNavbar";
import InfiniteCarousel from "@/components/siswa/carousel/InfiniteCarousel";
import EmojiText from "@/components/common/EmojiText";
import { useSiswaProfile, useUpdateSiswaProfile } from "@/hooks/siswa/useSiswaProfile";
import Swal from "sweetalert2";
import path from "path";

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

// Character ID to index mapping (hanya 5 karakter yang tersedia di STUDENT_AVATARS)
const characterIdToIndex: Record<string, number> = {
  "kocheng-oren": 0,
  "bro-kerbuz": 1,
  "sin-bunbun": 2,
  "mas-gwebek": 3,
  "pak-bubu": 4,
  "mas-pace": 5,
  "mas-piggy": 6,
};

// Index to character ID mapping
const indexToCharacterId: Record<number, string> = {
  0: "kocheng-oren",
  1: "bro-kerbuz",
  2: "sin-bunbun",
  3: "mas-gwebek",
  4: "pak-bubu",
  5: "mas-pace",
  6: "mas-piggy",
};

// Hanya tampilkan 5 karakter yang sesuai dengan database
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
    id: "sin-bunbun",
    name: "SIN BUNBUN",
    path: "/siswa/pilih-karakter/sin-bunbun.svg",
    description:
      "Kelinci cepat yang lompat dari soal ke soal! �⚡ Spesialis dalam mengerjakan soal dengan cepat!",
    color: characterColors["sin-bunbun"],
  },
  {
    id: "mas-gwebek",
    name: "MAS GWEBEK",
    path: "/siswa/pilih-karakter/mas-gwebek.svg",
    description:
      "Bebek cerdas yang suka berpetualang! 🦆🌟 Ahli dalam memecahkan teka-teki matematika!",
    color: characterColors["mas-gwebek"],
  },
  {
    id: "pak-bubu",
    name: "PAK BUBU",
    path: "/siswa/pilih-karakter/pak-bubu.svg",
    description:
      "Teman setia yang selalu ceria! 🐻✨ Siap menemani perjalanan belajarmu dengan penuh semangat!",
    color: characterColors["pak-bubu"],
  },
  {
    id: "mas-pace",
    name: "MAS PACE",
    path: "/siswa/pilih-karakter/mas-pace.svg",
    description:
      "Pace yang bijak dan sabar! 🐢📚 Siap membantu kamu memahami konsep matematika dengan tenang.",
    color: characterColors["mas-pace"],
  },
  {
    id: "mas-piggy",
    name: "MAS PIGGY",
    path: "/siswa/pilih-karakter/mas-piggy.svg",
    description:
      "Babi yang lucu dan menggemaskan! 🐷✨ Siap menemani kamu belajar dengan penuh keceriaan.",
    color: characterColors["mas-piggy"],
  }
];

export default function PilihKarakterPage() {
  const [isMobile, setIsMobile] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState("kocheng-oren");
  const [centerCharacter, setCenterCharacter] = useState("kocheng-oren");
  const router = useRouter();

  const { data: profile } = useSiswaProfile();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateSiswaProfile();

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

  // Load current character from profile
  useEffect(() => {
    if (profile?.profil_siswa_index !== undefined && profile.profil_siswa_index !== null) {
      const characterId = indexToCharacterId[profile.profil_siswa_index] || "kocheng-oren";
      setSelectedCharacter(characterId);
      setCenterCharacter(characterId);
    }
  }, [profile]);

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
    setSelectedCharacter(characterId);
    triggerConfetti();

    // Simpan langsung ke database ketika card di-klik
    const characterIndex = characterIdToIndex[characterId];
    if (characterIndex !== undefined) {
      try {
        await updateProfile({ profil_siswa_index: characterIndex });
      } catch (error) {
        console.error("Gagal menyimpan karakter:", error);
      }
    }
  };

  const handleSelectCenter = async () => {
    setSelectedCharacter(centerCharacter);
    triggerConfetti();

    // Save to database
    const characterIndex = characterIdToIndex[centerCharacter];
    if (characterIndex !== undefined) {
      try {
        await updateProfile({ profil_siswa_index: characterIndex });

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Karakter berhasil dipilih!",
          confirmButtonColor: "#336d82",
          timer: 2000,
          showConfirmButton: false,
        });

        // Navigate to beranda after short delay
        setTimeout(() => {
          router.push("/siswa/beranda");
        }, 2000);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal menyimpan pilihan karakter",
          confirmButtonColor: "#336d82",
        });
      }
    }
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
            disabled={isUpdating}
            className={`bg-[#336d82] text-white text-[13px] font-medium px-12 py-3 rounded-[20px] shadow-lg transition-all duration-300 ${isUpdating
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#2B7A9E] hover:scale-105"
              }`}
          >
            {isUpdating ? "Menyimpan..." : "Pilih"}
          </button>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="mt-16">
          <MobileNavbar />
        </div>

        {/* Bottom Spacing */}
        <div className="h-24"></div>
      </div>
    </div>
  );
}
