"use client";

import Image from "next/image";
import { useSiswaProfile } from "@/hooks/siswa/useSiswaProfile";

interface HeaderProps {
  username?: string;
}

export default function Header({ username }: HeaderProps) {
  // Ambil data profil dari database
  const { data: profile } = useSiswaProfile();

  // Dapatkan nama dan gambar karakter dari database
  const namaLengkap = username || profile?.nama_lengkap || "Siswa";
  const profileImage = profile?.karakter?.poto_profil_url || "/siswa/foto-profil/kocheng-oren.svg";

  return (
    <div className="px-6 pt-[71px] pb-6">
      <div className="flex items-start justify-between">
        {/* Greeting */}
        <div className="flex-1">
          <h1 className="text-[26px] poppins-bold text-[#33A1E0] leading-tight drop-shadow-sm">
            Hallo {namaLengkap}!
          </h1>
          <p className="text-[19px] font-medium text-[#33A1E0] mt-1">
            siap belajar seru hari ini?
          </p>
        </div>

        {/* Profile Picture - Attractive border design */}
        <div className="relative flex-shrink-0 ml-4">
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#33A1E0] via-[#5BB5E8] to-[#0A3D60] animate-spin-slow opacity-75"></div>
          
          {/* Inner white circle with image */}
          <div className="relative w-[75px] h-[75px] rounded-full bg-white flex items-center justify-center shadow-[0_8px_32px_0_rgba(51,161,224,0.4)] overflow-hidden m-[3px]">
            <Image
              src={profileImage}
              alt={`${namaLengkap} Profile`}
              width={70}
              height={70}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Animation for gradient border */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
