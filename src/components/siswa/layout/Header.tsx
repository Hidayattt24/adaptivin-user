"use client";

import Image from "next/image";
import { useSiswaProfile } from "@/hooks/siswa/useSiswaProfile";
import { getStudentAvatar } from "@/lib/api/user";

interface HeaderProps {
  username?: string;
}

export default function Header({ username }: HeaderProps) {
  // Ambil data profil dari database
  const { data: profile } = useSiswaProfile();

  // Dapatkan nama dan gambar karakter dari database
  const namaLengkap = username || profile?.nama_lengkap || "Siswa";
  const profileImage = getStudentAvatar(profile?.profil_siswa_index);

  return (
    <div className="px-6 pt-[71px] pb-6">
      <div className="flex items-start justify-between">
        {/* Greeting */}
        <div className="flex-1">
          <h1 className="text-[26px] poppins-bold text-[#2B7A9E] leading-tight drop-shadow-sm">Hallo {namaLengkap}!</h1>
          <p className="text-[19px] font-medium text-[#2B7A9E] mt-1">siap belajar seru hari ini?</p>
        </div>

        {/* Profile Picture - Clean design without background circles */}
        <div className="relative flex-shrink-0 ml-4">
          <div className="w-[75px] h-[75px] rounded-full bg-white flex items-center justify-center shadow-[0_4px_20px_0_rgba(43,122,158,0.2)] overflow-hidden border-2 border-[#33A1E0]/30">
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
    </div>
  );
}
