"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MobileWarning from "@/components/siswa/layout/MobileWarning";
import { useClassTheme } from "@/contexts/ClassThemeContext";
import MateriHeaderNew from "@/components/siswa/materi/MateriHeaderNew";
import MateriCardNew from "@/components/siswa/materi/MateriCardNew";
import { getMaterialsByClass } from "@/data/mockMaterials";

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

  const classId = params?.classId as string;
  const materials = getMaterialsByClass(classId);

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

  return (
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
        {materials.length > 0 ? (
          <div className="space-y-4 flex flex-col items-center">
            {materials.map((material) => (
              <MateriCardNew
                key={material.id}
                id={material.id}
                title={material.title}
                description={material.description}
                icon={material.icon}
                isLocked={material.isLocked}
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
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
