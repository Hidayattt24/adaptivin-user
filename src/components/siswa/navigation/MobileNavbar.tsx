"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavbarProps {
  characterImage?: string;
}

export default function MobileNavbar({
  characterImage = "/siswa/foto-profil/kocheng-oren.svg",
}: MobileNavbarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[320px] z-50">
      <div className="relative">
        {/* Modern Glass Morphism Background */}
        <div className="bg-gradient-to-r from-[#2c5f6f] to-[#336d82] rounded-[24px] h-[64px] shadow-[0_8px_32px_0_rgba(51,109,130,0.4)] backdrop-blur-sm border border-white/10"></div>

        {/* Nav Items */}
        <div className="absolute inset-0 flex items-center justify-between px-10">
          {/* Home Button */}
          <Link
            href="/siswa/beranda"
            className="flex flex-col items-center gap-0.5 transition-all duration-300 group relative py-2 px-3"
          >
            {/* Active Indicator - Circular Background */}
            {isActive("/siswa/beranda") && (
              <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
            )}
            <span
              className={`material-symbols-outlined text-white transition-all duration-300 relative z-10 ${
                isActive("/siswa/beranda")
                  ? "text-[26px] drop-shadow-lg"
                  : "text-[24px] opacity-70 group-hover:opacity-100 group-hover:scale-110"
              }`}
              style={{ fontVariationSettings: isActive("/siswa/beranda") ? "'FILL' 1, 'wght' 700" : "'FILL' 0, 'wght' 400" }}
            >
              home
            </span>
            <span
              className={`text-white text-[9px] font-medium transition-opacity duration-300 relative z-10 ${
                isActive("/siswa/beranda") ? "opacity-100 font-bold" : "opacity-70"
              }`}
            >
              Home
            </span>
          </Link>

          {/* Character Button - Centered & Elevated */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-8">
            <Link
              href="/siswa/pilih-karakter"
              className="flex items-center justify-center group"
            >
              <div className="w-[85px] h-[85px] rounded-full bg-white flex items-center justify-center shadow-[0_8px_32px_0_rgba(51,161,224,0.3)] group-hover:scale-105 transition-all duration-300 border-4 border-[#33A1E0]/40 group-hover:border-[#33A1E0]/60">
                <Image
                  src={characterImage}
                  alt="Character"
                  width={70}
                  height={70}
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Profile Button */}
          <Link
            href="/siswa/profil"
            className="flex flex-col items-center gap-0.5 transition-all duration-300 group relative py-2 px-3"
          >
            {/* Active Indicator - Circular Background */}
            {isActive("/siswa/profil") && (
              <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
            )}
            <span
              className={`material-symbols-outlined text-white transition-all duration-300 relative z-10 ${
                isActive("/siswa/profil")
                  ? "text-[26px] drop-shadow-lg"
                  : "text-[24px] opacity-70 group-hover:opacity-100 group-hover:scale-110"
              }`}
              style={{ fontVariationSettings: isActive("/siswa/profil") ? "'FILL' 1, 'wght' 700" : "'FILL' 0, 'wght' 400" }}
            >
              account_circle
            </span>
            <span
              className={`text-white text-[9px] font-medium transition-opacity duration-300 relative z-10 ${
                isActive("/siswa/profil") ? "opacity-100 font-bold" : "opacity-70"
              }`}
            >
              Profile
            </span>
          </Link>
        </div>
      </div>

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
