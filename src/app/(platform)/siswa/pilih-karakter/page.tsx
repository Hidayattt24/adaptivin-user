"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import MobileWarning from "@/components/siswa/layout/MobileWarning";
import MobileNavbar from "@/components/siswa/navigation/MobileNavbar";

const characters = [
  { id: "kocheng-oren", name: "Kocheng Oren", path: "/siswa/foto-profil/kocheng-oren.svg" },
  { id: "bro-kerbuz", name: "Bro Kerbuz", path: "/siswa/foto-profil/bro-kerbuz.svg" },
  { id: "mas-gwebek", name: "Mas Gwebek", path: "/siswa/foto-profil/mas-gwebek.svg" },
  { id: "mas-pace", name: "Mas Pace", path: "/siswa/foto-profil/mas-pace.svg" },
  { id: "mas-piggy", name: "Mas Piggy", path: "/siswa/foto-profil/mas-piggy.svg" },
  { id: "pak-bubu", name: "Pak Bubu", path: "/siswa/foto-profil/pak-bubu.svg" },
  { id: "sin-bunbun", name: "Sin Bunbun", path: "/siswa/foto-profil/sin-bunbun.svg" },
];

export default function PilihKarakterPage() {
  const [isMobile, setIsMobile] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState("kocheng-oren");

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
    <div className="relative w-full min-h-screen overflow-x-hidden bg-white">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[#E8F6FF]/40 to-transparent"></div>
        <div className="absolute top-[120px] right-[30px] w-16 h-16 border-4 border-[#FFB347]/20 rounded-2xl rotate-12 animate-float"></div>
        <div className="absolute top-[180px] left-[20px] w-12 h-12 bg-[#33A1E0]/10 rounded-full animate-float-delayed"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(#33A1E0 1px, transparent 1px), linear-gradient(90deg, #33A1E0 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#33A1E0]/5 to-transparent rounded-bl-[100px]"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(12deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
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
        <div className="px-6 pt-[71px] pb-6">
          <h1 className="text-[26px] font-bold text-[#2B7A9E] text-center drop-shadow-sm">
            Pilih Karaktermu
          </h1>
          <p className="text-[15px] font-medium text-[#2B7A9E] text-center mt-2">
            Pilih teman belajar favoritmu!
          </p>
        </div>

        {/* Character Grid */}
        <div className="px-6 grid grid-cols-2 gap-4 pb-32">
          {characters.map((character) => (
            <button
              key={character.id}
              onClick={() => setSelectedCharacter(character.id)}
              className={`relative bg-white rounded-3xl p-6 transition-all duration-300 ${
                selectedCharacter === character.id
                  ? "shadow-[0_8px_32px_0_rgba(51,161,224,0.4)] scale-105 border-4 border-[#33A1E0]"
                  : "shadow-[0_4px_16px_0_rgba(0,0,0,0.1)] hover:scale-102"
              }`}
            >
              {selectedCharacter === character.id && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#33A1E0] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">✓</span>
                </div>
              )}
              <div className="aspect-square flex items-center justify-center mb-3">
                <Image
                  src={character.path}
                  alt={character.name}
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <p className="text-[14px] font-semibold text-[#2B7A9E] text-center">
                {character.name}
              </p>
            </button>
          ))}
        </div>

        {/* Mobile Navigation Bar */}
        <MobileNavbar characterImage={`/siswa/foto-profil/${selectedCharacter}.svg`} />
      </div>
    </div>
  );
}
