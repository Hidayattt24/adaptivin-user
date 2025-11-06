"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiswaProfile } from "@/hooks/siswa/useSiswaProfile";
import { getCurrentUser } from "@/lib/api/user";

interface MobileNavbarProps {
  characterImage?: string; // Optional: untuk override karakter (misal di halaman pilih karakter)
}

export default function MobileNavbar({ characterImage: overrideCharacterImage }: MobileNavbarProps = {}) {
  const pathname = usePathname();

  // Ambil data profil dari database (dengan fallback ke localStorage)
  const { data: profile } = useSiswaProfile();

  // Fallback ke localStorage jika query masih loading atau data belum ada
  // Ini memastikan avatar tetap tampil dengan benar saat navigasi
  const currentUser = getCurrentUser();
  const karakterUrl = profile?.karakter?.poto_profil_url ?? currentUser?.karakter?.poto_profil_url;

  // Dapatkan gambar karakter dari database berdasarkan karakter_url
  // Jika ada override (misal di halaman pilih karakter), gunakan itu
  const characterImage = overrideCharacterImage || karakterUrl || "/siswa/foto-profil/kocheng-oren.svg";

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Responsive Navbar - Compact for desktop */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[360px] md:max-w-[300px] z-50">
        <div className="relative">
          {/* Modern Glass Morphism Background */}
          <div className="bg-gradient-to-r from-[#2c5f6f] to-[#336d82] rounded-[28px] md:rounded-[24px] h-[72px] md:h-[56px] shadow-[0_8px_32px_0_rgba(51,109,130,0.4)] backdrop-blur-sm border border-white/10"></div>

          {/* Nav Items */}
          <div className="absolute inset-0 flex items-center justify-between px-12 md:px-8">
            {/* Home Button */}
            <Link
              href="/siswa/beranda"
              className="flex flex-col items-center gap-1 md:gap-0.5 transition-all duration-300 group relative py-2 px-4 md:px-3"
            >
              {/* Active Indicator - Circular Background */}
              {isActive("/siswa/beranda") && (
                <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
              )}
              <span
                className={`material-symbols-outlined text-white transition-all duration-300 relative z-10 ${isActive("/siswa/beranda")
                  ? "text-[32px] drop-shadow-lg"
                  : "text-[28px] opacity-70 group-hover:opacity-100 group-hover:scale-110"
                  }`}
                style={{
                  fontVariationSettings: isActive("/siswa/beranda")
                    ? "'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 24"
                    : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                }}
              >
                home_app_logo
              </span>
              <span
                className={`text-white text-[10px] font-medium transition-opacity duration-300 relative z-10 ${isActive("/siswa/beranda")
                  ? "opacity-100 font-bold"
                  : "opacity-70"
                  }`}
              >
                Home
              </span>
            </Link>

            {/* Character Button - Centered & Elevated */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-10 md:-top-7">
              <Link
                href="/siswa/pilih-karakter"
                className="flex flex-col items-center justify-center group"
              >
                <div className="w-[95px] h-[95px] md:w-[75px] md:h-[75px] rounded-full bg-white flex items-center justify-center shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] group-hover:scale-105 transition-all duration-300 ring-4 ring-white/50">
                  <Image
                    src={characterImage}
                    alt="Character"
                    width={100}
                    height={100}
                    className="object-contain w-[78px] md:w-[60px]"
                  />
                </div>
              </Link>
            </div>

            {/* Profile Button */}
            <Link
              href="/siswa/profil"
              className="flex flex-col items-center gap-1 md:gap-0.5 transition-all duration-300 group relative py-2 px-4 md:px-3"
            >
              {/* Active Indicator - Circular Background */}
              {isActive("/siswa/profil") && (
                <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
              )}
              <span
                className={`material-symbols-outlined text-white transition-all duration-300 relative z-10 ${isActive("/siswa/profil")
                  ? "text-[32px] drop-shadow-lg"
                  : "text-[28px] opacity-70 group-hover:opacity-100 group-hover:scale-110"
                  }`}
                style={{
                  fontVariationSettings: isActive("/siswa/profil")
                    ? "'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 24"
                    : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                }}
              >
                power_settings_circle
              </span>
              <span
                className={`text-white text-[10px] font-medium transition-opacity duration-300 relative z-10 ${isActive("/siswa/profil")
                  ? "opacity-100 font-bold"
                  : "opacity-70"
                  }`}
              >
                Profile
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </>
  );
}
