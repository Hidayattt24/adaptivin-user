"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MobileWarning from "@/components/siswa/layout/MobileWarning";
import { useSiswaProfile, useUpdateSiswaProfile } from "@/hooks/siswa/useSiswaProfile";
import Swal from "sweetalert2";

export default function GantiNamaPage() {
  const [isMobile, setIsMobile] = useState(true);
  const [nama, setNama] = useState("");
  const router = useRouter();

  const { data: profile, isLoading: isLoadingProfile } = useSiswaProfile();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateSiswaProfile();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Load current name from profile
  useEffect(() => {
    if (profile?.nama_lengkap) {
      setNama(profile.nama_lengkap);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Nama tidak boleh kosong!",
        confirmButtonColor: "#336d82",
      });
      return;
    }

    try {
      await updateProfile({ nama_lengkap: nama.trim() });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Nama berhasil diubah!",
        confirmButtonColor: "#336d82",
        timer: 2000,
      });

      router.push("/siswa/profil");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error instanceof Error ? error.message : "Gagal mengubah nama",
        confirmButtonColor: "#336d82",
      });
    }
  };

  const isLoading = isLoadingProfile || isUpdating;

  if (!isMobile) {
    return <MobileWarning />;
  }

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gradient-to-b from-[#336d82] to-[#91c6d9]">
      {/* Header */}
      <div className="relative pt-8 pb-6 px-6">
        <button
          onClick={() => router.back()}
          className="absolute left-6 top-8 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
        >
          <span className="material-symbols-outlined text-white text-[24px]">
            arrow_back
          </span>
        </button>
        <h1 className="text-[24px] font-semibold text-white text-center">
          Ganti Nama
        </h1>
      </div>

      {/* Content */}
      <div className="px-6 mt-8">
        <div className="bg-white rounded-[24px] p-6 shadow-xl">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="nama"
                className="block text-[14px] font-medium text-[#336d82] mb-2"
              >
                Nama Lengkap
              </label>
              <input
                type="text"
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#91c6d9]/30 rounded-[16px] text-[16px] text-[#336d82] focus:outline-none focus:border-[#336d82] transition-all duration-300"
                placeholder="Masukkan nama lengkap"
                disabled={isLoading}
              />
            </div>

            <div className="bg-[#E8F6FF] rounded-[16px] p-4 mb-6">
              <div className="flex gap-2">
                <span className="material-symbols-outlined text-[#336d82] text-[20px] flex-shrink-0">
                  info
                </span>
                <p className="text-[12px] text-[#336d82] leading-relaxed">
                  Nama yang kamu masukkan akan ditampilkan di profil dan
                  digunakan untuk sertifikat.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-[#336d82] to-[#5b9db5] text-white text-[16px] font-semibold py-3 rounded-[20px] shadow-lg transition-all duration-300 ${isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-xl hover:scale-[1.02]"
                }`}
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>
      </div>

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional"
      />
    </div>
  );
}
