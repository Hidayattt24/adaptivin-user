"use client";

import { useParams, useRouter } from "next/navigation";
import { useClassTheme } from "@/contexts/ClassThemeContext";
import MateriHeaderNew from "@/components/siswa/materi/MateriHeaderNew";
import MateriCardNew from "@/components/siswa/materi/MateriCardNew";
import { getMaterialsByClass } from "@/data/mockMaterials";



export default function MateriClassListPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useClassTheme();

  const classId = params?.classId as string;
  const materials = getMaterialsByClass(classId);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-white">
      {/* Header with Theme */}
      <div className="relative">
        {/* Back Button */}
        <button
          onClick={() => router.push('/siswa/beranda')}
          className="absolute top-4 left-4 md:top-6 md:left-8 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <span className="material-symbols-outlined text-white text-xl md:text-2xl">
            arrow_back
          </span>
        </button>

        <MateriHeaderNew />
      </div>

      {/* Materials List - Responsive */}
      <div className="px-6 md:px-12 lg:px-16 py-8 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto">
          {materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
            <div className="text-center py-12 md:py-20">
              <div
                className="w-16 h-16 md:w-24 md:h-24 rounded-full mx-auto mb-4 md:mb-6 flex items-center justify-center"
                style={{ background: `${theme.colors.primary}20` }}
              >
                <span
                  className="material-symbols-outlined text-4xl md:text-6xl"
                  style={{ color: theme.colors.primary }}
                >
                  school
                </span>
              </div>
              <p className="text-slate-600 text-sm md:text-base">
                Belum ada materi untuk kelas ini
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
