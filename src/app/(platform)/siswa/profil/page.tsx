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
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 to-white">
      {/* Profile Card with Modern Gradient */}
      <div className="px-5 pt-8 pb-6">
        <div
          className="relative rounded-[32px] overflow-hidden shadow-xl"
          style={{
            background: 'linear-gradient(172deg, #B6ECFF -5.6%, #336D82 112.71%)'
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12" />

          {/* Profile Content */}
          <div className="relative px-6 py-10">
            {/* Profile Avatar */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white/95 flex items-center justify-center shadow-lg ring-4 ring-white/30">
                  <Image
                    src="/siswa/foto-profil/kocheng-oren.svg"
                    alt="Profile"
                    width={75}
                    height={75}
                    className="object-contain"
                  />
                </div>
                {/* Status indicator */}
                <div className="absolute bottom-1 right-1 w-7 h-7 bg-emerald-400 rounded-full border-4 border-white shadow-md" />
              </div>
            </div>

            {/* Name */}
            <h1 className="text-2xl font-bold text-white text-center mb-3 tracking-tight">
              Farhan
            </h1>

            {/* Class Badge */}
            <div className="flex justify-center">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30">
                <p className="text-white text-sm font-semibold tracking-wide">Kelas IV</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="px-5 mt-6">
        <div className="space-y-3">
          {/* Ganti Nama Card */}
          <Link
            href="/siswa/profil/ganti-nama"
            className="block bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 active:scale-[0.98] transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B6ECFF] to-[#336D82] flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xl">
                    badge
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800">Ganti Nama</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Ubah nama profil Anda</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-xl">
                chevron_right
              </span>
            </div>
          </Link>

          {/* Ganti Password Card */}
          <Link
            href="/siswa/profil/ganti-password"
            className="block bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 active:scale-[0.98] transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B6ECFF] to-[#336D82] flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xl">
                    lock
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800">Ganti Password</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Perbarui kata sandi Anda</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-xl">
                chevron_right
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-5 mt-8">
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 rounded-2xl h-14 flex items-center justify-center gap-3 hover:from-red-600 hover:to-red-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-red-500/20"
        >
          <span className="material-symbols-outlined text-white text-xl">
            logout
          </span>
          <span className="text-white text-sm font-semibold tracking-wide">Keluar dari Akun</span>
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
