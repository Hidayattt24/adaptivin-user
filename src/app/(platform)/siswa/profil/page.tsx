"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MobileNavbar from "@/components/siswa/navigation/MobileNavbar";

export default function ProfilSiswaPage() {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      // Clear session/token
      router.push("/");
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 to-white">
      {/* Profile Card - Compact for Desktop */}
      <div className="px-5 md:px-6 lg:px-8 pt-5 pb-3">
        <div className="max-w-lg mx-auto">
          <div
            className="relative rounded-[24px] overflow-hidden shadow-xl"
            style={{
              background: 'linear-gradient(172deg, #B6ECFF -5.6%, #336D82 112.71%)'
            }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/5 rounded-full -ml-8 -mb-8" />

            {/* Profile Content */}
            <div className="relative px-5 md:px-5 py-6 md:py-6">
              {/* Profile Avatar */}
              <div className="flex justify-center mb-4 md:mb-4">
                <div className="relative">
                  <div className="w-24 h-24 md:w-24 md:h-24 rounded-full bg-white/95 flex items-center justify-center shadow-lg ring-4 ring-white/30">
                    <Image
                      src="/siswa/foto-profil/kocheng-oren.svg"
                      alt="Profile"
                      width={80}
                      height={80}
                      className="object-contain w-[60px] md:w-[60px]"
                    />
                  </div>
                  {/* Status indicator */}
                  <div className="absolute bottom-0 right-0 w-5 h-5 md:w-5 md:h-5 bg-emerald-400 rounded-full border-3 border-white shadow-md" />
                </div>
              </div>

              {/* Name */}
              <h1 className="text-xl md:text-xl font-bold text-white text-center mb-2 tracking-tight">
                Farhan
              </h1>

              {/* Class Badge */}
              <div className="flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm px-4 md:px-4 py-1.5 rounded-full border border-white/30">
                  <p className="text-white text-xs md:text-xs font-semibold tracking-wide">Kelas IV</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards - Compact for Desktop */}
      <div className="px-5 md:px-6 lg:px-8 mt-4 md:mt-4">
        <div className="max-w-lg mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Ganti Nama Card */}
            <Link
              href="/siswa/profil/ganti-nama"
              className="block bg-white rounded-2xl p-4 md:p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 hover:-translate-y-1 active:scale-[0.98] transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#B6ECFF] to-[#336D82] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xl md:text-xl">
                      badge
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm md:text-sm font-semibold text-slate-800">Ganti Nama</h3>
                    <p className="text-xs md:text-xs text-slate-500 mt-0.5">Ubah nama profil Anda</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-xl md:text-xl">
                  chevron_right
                </span>
              </div>
            </Link>

            {/* Ganti Password Card */}
            <Link
              href="/siswa/profil/ganti-password"
              className="block bg-white rounded-2xl p-4 md:p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 hover:-translate-y-1 active:scale-[0.98] transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#B6ECFF] to-[#336D82] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xl md:text-xl">
                      lock
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm md:text-sm font-semibold text-slate-800">Ganti Password</h3>
                    <p className="text-xs md:text-xs text-slate-500 mt-0.5">Perbarui kata sandi Anda</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-xl md:text-xl">
                  chevron_right
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Logout Button - Compact for Desktop */}
      <div className="px-5 md:px-6 lg:px-8 mt-5 md:mt-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 rounded-2xl h-11 md:h-10 flex items-center justify-center gap-2 hover:from-red-600 hover:to-red-700 hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-red-500/20"
          >
            <span className="material-symbols-outlined text-white text-xl md:text-xl">
              logout
            </span>
            <span className="text-white text-sm md:text-sm font-semibold tracking-wide">Keluar dari Akun</span>
          </button>
        </div>
      </div>

      {/* Spacing before navbar - Compact for Desktop */}
      <div className="h-[200px] md:h-24" />

      {/* Navigation Bar - All screen sizes */}
      <MobileNavbar characterImage="/siswa/foto-profil/kocheng-oren.svg" />

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
