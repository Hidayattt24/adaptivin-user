"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useClassTheme } from "@/contexts/ClassThemeContext";
import MateriHeader from "@/components/siswa/materi/MateriHeader";
import MateriCard from "@/components/siswa/materi/MateriCard";
import { useSiswaProfile } from "@/hooks/siswa/useSiswaProfile";
import { useMateriByKelas } from "@/hooks/siswa/useMateri";
import { checkMateriCompletion } from "@/lib/api/kuis";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";

export default function MateriClassListPage() {
  const router = useRouter();
  const { theme } = useClassTheme();
  const [completionStatus, setCompletionStatus] = useState<Record<string, boolean>>({});

  // Get siswa profile untuk ambil kelas_id yang sebenarnya
  const { data: profile } = useSiswaProfile();

  // Gunakan kelas_id dari profile
  const kelasId = profile?.kelas?.id || null;

  // Get materi by kelas
  const { data: materiList, isLoading } = useMateriByKelas(kelasId);

  // Fetch completion status for each materi
  useEffect(() => {
    const fetchCompletionStatus = async () => {
      if (!materiList || materiList.length === 0) return;

      const statusMap: Record<string, boolean> = {};
      
      // Check each materi
      for (const materi of materiList) {
        try {
          const isCompleted = await checkMateriCompletion(materi.id);
          statusMap[materi.id] = isCompleted;
        } catch (error) {
          console.error(`Error checking completion for materi ${materi.id}:`, error);
          statusMap[materi.id] = false;
        }
      }

      setCompletionStatus(statusMap);
    };

    fetchCompletionStatus();
  }, [materiList]);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-white">
      {/* Header with Theme */}
      <div className="relative">
        {/* Back Button */}
        <button
          onClick={() => router.push("/siswa/beranda")}
          className="absolute top-4 left-4 md:top-6 md:left-8 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <ArrowBackIcon
            sx={{
              color: "white",
              fontSize: { xs: "20px", md: "24px" },
            }}
          />
        </button>

        <MateriHeader />
      </div>

      {/* Materials List - Responsive */}
      <div className="px-6 md:px-12 lg:px-16 py-8 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-[#33A1E0] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : materiList && materiList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {materiList.map((material) => (
                <MateriCard
                  key={material.id}
                  id={material.id}
                  title={material.judul_materi}
                  description={material.deskripsi || ""}
                  icon="book"
                  isLocked={false}
                  isCompleted={completionStatus[material.id] || false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-20">
              <div
                className="w-16 h-16 md:w-24 md:h-24 rounded-full mx-auto mb-4 md:mb-6 flex items-center justify-center"
                style={{ background: `${theme.colors.primary}20` }}
              >
                <SchoolIcon
                  sx={{
                    fontSize: { xs: "36px", md: "60px" },
                    color: theme.colors.primary,
                  }}
                />
              </div>
              <p className="text-slate-600 text-sm md:text-base">
                Belum ada materi untuk kelas ini
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
