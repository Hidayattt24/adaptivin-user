"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MobileNavbar from "@/components/siswa/navigation/MobileNavbar";
import { useSiswaProfile } from "@/hooks/siswa/useSiswaProfile";
import { getCurrentUser } from "@/lib/api/user";
import { clearAuth } from "@/lib/storage";
import Swal from "sweetalert2";

export default function ProfilSiswaPage() {
  const router = useRouter();
  const { data: profile, isLoading } = useSiswaProfile();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Yakin ingin keluar?",
      text: "Kamu akan keluar dari akun ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
      confirmButtonColor: "#336D82",
      cancelButtonColor: "#6b7280",
    });
    if (result.isConfirmed) {
      // Clear all auth data
      clearAuth();
      router.push("/splash");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#33A1E0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4c859a] font-medium">Memuat profil...</p>
        </div>
      </div>
    );
  }

  // Fallback ke localStorage jika query masih loading atau data belum ada
  const currentUser = getCurrentUser();

  // Get profile data
  const namaLengkap =
    profile?.nama_lengkap || currentUser?.nama_lengkap || "Siswa";
  const tingkatKelas =
    profile?.kelas?.tingkat_kelas || currentUser?.kelas?.tingkat_kelas || "IV";
  const namaSekolah =
    profile?.sekolah?.nama_sekolah || currentUser?.sekolah?.nama_sekolah || "";

  // Dapatkan gambar profil dari database (poto_profil_url dari tabel pilih_karakter)
  // Gunakan fallback ke localStorage untuk memastikan avatar tetap tampil saat navigasi
  const profileImage =
    profile?.karakter?.poto_profil_url ||
    currentUser?.karakter?.poto_profil_url ||
    "/siswa/foto-profil/kocheng-oren.svg";

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 to-white">
      {/* Profile Card with Modern Gradient */}
      <div className="px-5 md:px-8 pt-8 md:pt-10 pb-6 max-w-2xl mx-auto">
        <div
          className="relative rounded-[32px] md:rounded-[36px] overflow-hidden shadow-xl"
          style={{
            background:
              "linear-gradient(180deg, #33A1E0 0.03%, #0A3D60 124.56%)",
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 md:w-36 md:h-36 bg-white/10 rounded-full -mr-16 md:-mr-18 -mt-16 md:-mt-18" />
          <div className="absolute bottom-0 left-0 w-24 h-24 md:w-28 md:h-28 bg-black/5 rounded-full -ml-12 md:-ml-14 -mb-12 md:-mb-14" />

          {/* Profile Content */}
          <div className="relative px-6 md:px-8 py-10 md:py-12">
            {/* Profile Avatar */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-white/95 flex items-center justify-center shadow-lg ring-4 ring-white/30">
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={75}
                    height={75}
                    className="object-contain w-[75px] md:w-[82px]"
                  />
                </div>
                {/* Status indicator */}
                <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-7 h-7 md:w-8 md:h-8 bg-emerald-400 rounded-full border-4 border-white shadow-md" />
              </div>
            </div>

            {/* Name */}
            <h1 className="text-2xl md:text-[26px] font-bold text-white text-center mb-3 tracking-tight">
              {namaLengkap}
            </h1>

            {/* Class Badge */}
            <div className="flex flex-col items-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm px-6 md:px-7 py-2 md:py-2.5 rounded-full border border-white/30">
                <p className="text-white text-sm md:text-[15px] font-semibold tracking-wide">
                  Kelas {tingkatKelas}
                </p>
              </div>
              {namaSekolah && (
                <p className="text-white/80 text-xs md:text-[13px] font-medium">
                  {namaSekolah}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="px-5 md:px-8 mt-6 md:mt-7 max-w-2xl mx-auto">
        <div className="space-y-3">
          {/* Ganti Nama Card */}
          <Link
            href="/siswa/profil/ganti-nama"
            className="block bg-white rounded-2xl md:rounded-[26px] p-5 md:p-5.5 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 active:scale-[0.98] transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 md:gap-4.5">
                <div
                  className="w-12 h-12 md:w-[52px] md:h-[52px] rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(180deg, #33A1E0 0.03%, #0A3D60 124.56%)",
                  }}
                >
                  <span className="material-symbols-outlined text-white text-xl md:text-[22px]">
                    badge
                  </span>
                </div>
                <div>
                  <h3 className="text-base md:text-[17px] font-semibold text-slate-800">
                    Ganti Nama
                  </h3>
                  <p className="text-xs md:text-[13px] text-slate-500 mt-0.5">
                    Ubah nama profil Anda
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-xl md:text-[22px]">
                chevron_right
              </span>
            </div>
          </Link>

          {/* Ganti Password Card */}
          <Link
            href="/siswa/profil/ganti-password"
            className="block bg-white rounded-2xl md:rounded-[26px] p-5 md:p-5.5 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 active:scale-[0.98] transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 md:gap-4.5">
                <div
                  className="w-12 h-12 md:w-[52px] md:h-[52px] rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(180deg, #33A1E0 0.03%, #0A3D60 124.56%)",
                  }}
                >
                  <span className="material-symbols-outlined text-white text-xl md:text-[22px]">
                    lock
                  </span>
                </div>
                <div>
                  <h3 className="text-base md:text-[17px] font-semibold text-slate-800">
                    Ganti Password
                  </h3>
                  <p className="text-xs md:text-[13px] text-slate-500 mt-0.5">
                    Perbarui kata sandi Anda
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-xl md:text-[22px]">
                chevron_right
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-5 md:px-8 mt-8 md:mt-9 max-w-2xl mx-auto">
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 rounded-2xl md:rounded-[26px] h-14 md:h-[58px] flex items-center justify-center gap-3 hover:from-red-600 hover:to-red-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-red-500/20"
        >
          <span className="material-symbols-outlined text-white text-xl md:text-[22px]">
            logout
          </span>
          <span className="text-white text-sm md:text-[15px] font-semibold tracking-wide">
            Keluar dari Akun
          </span>
        </button>
      </div>

      {/* Spacing before navbar */}
      <div className="h-[200px] md:h-[220px]" />

      {/* Mobile Navigation Bar - Karakter dari database otomatis */}
      <MobileNavbar />

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional"
      />
    </div>
  );
}
