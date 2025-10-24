"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MobileWarning from "@/components/siswa/layout/MobileWarning";
import MobileNavbar from "@/components/siswa/navigation/MobileNavbar";

export default function ProfilSiswaPage() {
  const [isMobile, setIsMobile] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      // Clear session/token
      router.push("/");
    }
  };

  if (!isMobile) {
    return <MobileWarning />;
  }

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-white">
      {/* Header with Gradient Background */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-[198px] bg-gradient-to-b from-[#336d82] to-[#91c6d9] rounded-b-[40px]" />

        {/* Profile Avatar - Centered */}
        <div className="relative pt-[100px] flex justify-center">
          <div className="relative">
            <div className="w-[142px] h-[142px] rounded-full bg-gradient-to-br from-[#832C4C] to-[#6B2440] flex items-center justify-center shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <Image
                src="/siswa/foto-profil/kocheng-oren.svg"
                alt="Profile"
                width={85}
                height={85}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Name */}
        <h1 className="text-[24px] font-semibold text-[#336d82] text-center mt-[11px]">
          Farhan
        </h1>

        {/* Class Badge */}
        <div className="flex justify-center mt-[22px]">
          <div className="bg-gradient-to-r from-[#5b9db5] to-[#81b8cc] px-[59px] py-[7px] rounded-[20px]">
            <p className="text-white text-[16px] font-semibold">Kelas IV</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-[30px] mt-[53px] flex gap-[14px]">
        {/* Ganti Nama Button */}
        <Link
          href="/siswa/profil/ganti-nama"
          className="flex-1 bg-gradient-to-br from-[#6fadc4] to-[#5b9db5] rounded-[15px] h-[131px] p-[16px] relative group hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <p className="text-white text-[20px] font-medium italic leading-tight">
            Ganti
            <br />
            Nama
          </p>
          <div className="absolute bottom-[17px] right-[17px] w-[39px] h-[39px] bg-white/30 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[20px] rotate-[-45deg]">
              arrow_forward
            </span>
          </div>
        </Link>

        {/* Ganti Password Button */}
        <Link
          href="/siswa/profil/ganti-password"
          className="flex-1 bg-gradient-to-br from-[#6fadc4] to-[#5b9db5] rounded-[15px] h-[131px] p-[16px] relative group hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <p className="text-white text-[20px] font-medium italic leading-tight">
            Ganti
            <br />
            Password
          </p>
          <div className="absolute bottom-[17px] right-[17px] w-[39px] h-[39px] bg-white/30 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[20px] rotate-[-45deg]">
              arrow_forward
            </span>
          </div>
        </Link>
      </div>

      {/* Logout Button */}
      <div className="px-[30px] mt-[60px]">
        <button
          onClick={handleLogout}
          className="w-full bg-[#e62727] rounded-[20px] h-[34px] flex items-center justify-center gap-2 hover:bg-[#d11f1f] transition-all duration-300 shadow-md"
        >
          <div className="w-[28px] h-[28px] bg-white/20 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[16px]">
              logout
            </span>
          </div>
          <span className="text-white text-[13px] font-medium">Keluar</span>
        </button>
      </div>

      {/* Spacing before navbar */}
      <div className="h-[200px]" />

      {/* Mobile Navigation Bar */}
      <MobileNavbar characterImage="/siswa/foto-profil/kocheng-oren.svg" />

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
