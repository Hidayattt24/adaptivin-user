"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MobileWarning from "@/components/siswa/layout/MobileWarning";
import { useClassTheme } from "@/contexts/ClassThemeContext";
import MateriHeaderNew from "@/components/siswa/materi/MateriHeaderNew";
import MateriCardNew from "@/components/siswa/materi/MateriCardNew";
import { useSiswaProfile } from "@/hooks/siswa/useSiswaProfile";
import { useMateriByKelas } from "@/hooks/siswa/useMateri";

/**
 * Materi List Page Per Class
 *
 * NO NAVBAR MOBILE - Only back button to beranda
 * Shows materials for specific class only
 * URL: /siswa/materi/4, /siswa/materi/5, /siswa/materi/6
 */

export default function MateriClassListPage() {
  const [isMobile, setIsMobile] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { theme } = useClassTheme();

  // Get siswa profile untuk ambil kelas_id yang sebenarnya
  const { data: profile } = useSiswaProfile();

  const classIdParam = params?.classId as string;

  // Jika classIdParam adalah tingkat kelas (4, 5, 6), gunakan kelas_id dari profile
  // Jika classIdParam adalah UUID, langsung gunakan
  const kelasId = profile?.kelas?.id || null;

  // Get materi by kelas
  const { data: materiList, isLoading } = useMateriByKelas(kelasId);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#33A1E0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4c859a] font-medium">Memuat materi...</p>
        </div>
      </div>
    );
  } return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-white">
      {/* Header with Theme - NO NAVBAR */}
      <div className="relative">
        {/* Back Button to Beranda */}
        <button
          onClick={() => router.push('/siswa/beranda')}
          className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <span className="material-symbols-outlined text-white text-xl">
            arrow_back
          </span>
        </button>

        <MateriHeaderNew />
      </div>

      {/* Materials List */}
      <div className="px-6 py-8 pb-12 flex flex-col items-center">
        {materiList && materiList.length > 0 ? (
          <div className="space-y-4 flex flex-col items-center">
            {materiList.map((materi) => (
              <MateriCardNew
                key={materi.id}
                id={materi.id}
                title={materi.judul_materi}
                description={materi.deskripsi || "Materi pembelajaran"}
                icon="book" // Default icon untuk semua materi
                isLocked={false} // Semua materi unlocked by default
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: `${theme.colors.primary}20` }}
            >
              <span
                className="material-symbols-outlined text-4xl"
                style={{ color: theme.colors.primary }}
              >
                school
              </span>
            </div>
            <p className="text-slate-600 text-sm">
              Belum ada materi untuk kelas ini
            </p>
          </div>
        )}
      </div>

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional"
      />
    </div>
  );
}
