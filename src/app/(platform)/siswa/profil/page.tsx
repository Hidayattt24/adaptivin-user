"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import MobileWarning from "@/components/siswa/layout/MobileWarning";
import MobileNavbar from "@/components/siswa/navigation/MobileNavbar";

export default function ProfilSiswaPage() {
  const [isMobile, setIsMobile] = useState(true);

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
            Profil & Pengaturan
          </h1>
        </div>

        {/* Profile Card */}
        <div className="px-6 pb-6">
          <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_0_rgba(0,0,0,0.1)]">
            <div className="flex flex-col items-center">
              <div className="w-[100px] h-[100px] rounded-full bg-white flex items-center justify-center shadow-[0_4px_20px_0_rgba(51,161,224,0.2)] overflow-hidden border-2 border-[#33A1E0]/30 mb-4">
                <Image
                  src="/siswa/foto-profil/kocheng-oren.svg"
                  alt="Profile"
                  width={90}
                  height={90}
                  className="object-contain"
                />
              </div>
              <h2 className="text-[22px] font-bold text-[#2B7A9E]">Farhan</h2>
              <p className="text-[14px] text-[#2B7A9E]/70 mt-1">Kelas 4 SD</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-6 space-y-3 pb-32">
          <button className="w-full bg-white rounded-2xl p-4 shadow-[0_2px_12px_0_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_0_rgba(51,161,224,0.2)] transition-all duration-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#33A1E0]/10 to-[#33A1E0]/5 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[#33A1E0] text-[24px]">
                  person
                </span>
              </div>
              <span className="text-[15px] font-semibold text-[#2B7A9E]">
                Edit Profil
              </span>
            </div>
            <span className="material-symbols-outlined text-[#2B7A9E]/50">
              chevron_right
            </span>
          </button>

          <button className="w-full bg-white rounded-2xl p-4 shadow-[0_2px_12px_0_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_0_rgba(51,161,224,0.2)] transition-all duration-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B9D]/10 to-[#FF6B9D]/5 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[#FF6B9D] text-[24px]">
                  emoji_events
                </span>
              </div>
              <span className="text-[15px] font-semibold text-[#2B7A9E]">
                Prestasi Saya
              </span>
            </div>
            <span className="material-symbols-outlined text-[#2B7A9E]/50">
              chevron_right
            </span>
          </button>

          <button className="w-full bg-white rounded-2xl p-4 shadow-[0_2px_12px_0_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_0_rgba(51,161,224,0.2)] transition-all duration-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFB347]/10 to-[#FFB347]/5 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[#FFB347] text-[24px]">
                  settings
                </span>
              </div>
              <span className="text-[15px] font-semibold text-[#2B7A9E]">
                Pengaturan
              </span>
            </div>
            <span className="material-symbols-outlined text-[#2B7A9E]/50">
              chevron_right
            </span>
          </button>

          <button className="w-full bg-white rounded-2xl p-4 shadow-[0_2px_12px_0_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_0_rgba(51,161,224,0.2)] transition-all duration-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#A8E6CF]/10 to-[#A8E6CF]/5 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[#A8E6CF] text-[24px]">
                  help
                </span>
              </div>
              <span className="text-[15px] font-semibold text-[#2B7A9E]">
                Bantuan
              </span>
            </div>
            <span className="material-symbols-outlined text-[#2B7A9E]/50">
              chevron_right
            </span>
          </button>

          <button className="w-full bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 shadow-[0_4px_16px_0_rgba(239,68,68,0.3)] hover:shadow-[0_6px_24px_0_rgba(239,68,68,0.4)] transition-all duration-300 flex items-center justify-center gap-2 mt-6">
            <span className="material-symbols-outlined text-white text-[24px]">
              logout
            </span>
            <span className="text-[15px] font-bold text-white">Keluar</span>
          </button>
        </div>

        {/* Mobile Navigation Bar */}
        <MobileNavbar characterImage="/siswa/foto-profil/kocheng-oren.svg" />
      </div>

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
