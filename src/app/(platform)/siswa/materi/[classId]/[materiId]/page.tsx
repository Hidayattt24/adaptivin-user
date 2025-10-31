"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useClassTheme } from "@/contexts/ClassThemeContext";
import { getMaterialById } from "@/data/mockMaterials";

export default function MateriDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useClassTheme();

  const classId = params?.classId as string;
  const materiId = params?.materiId as string;
  const material = getMaterialById(materiId);

  useEffect(() => {
    if (!material || material.classId !== classId) {
      router.push(`/siswa/materi/${classId}`);
    }
  }, [material, classId, router]);

  if (!material || material.classId !== classId) {
    return null;
  }

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-white">
      {/* Header with Gradient Background */}
      <div
        className="relative px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden"
        style={{
          background: theme.gradients.background,
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => router.push(`/siswa/materi/${classId}`)}
          className="absolute top-4 left-4 md:top-6 md:left-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <span className="material-symbols-outlined text-white text-xl md:text-2xl">
            arrow_back
          </span>
        </button>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-white/5 rounded-full -mr-16 md:-mr-24 -mt-16 md:-mt-24" />
          <div className="absolute bottom-0 left-0 w-24 h-24 md:w-36 md:h-36 bg-black/5 rounded-full -ml-12 md:-ml-18 -mb-12 md:-mb-18" />
        </div>

        {/* Content */}
        <div className="relative z-10 pt-8 max-w-4xl mx-auto">
          {/* Class Badge */}
          <div className="flex justify-center mb-4 md:mb-6">
            <div
              className="px-6 py-1.5 md:px-8 md:py-2 rounded-full"
              style={{
                background: theme.gradients.badge || theme.colors.badge,
              }}
            >
              <p className="text-white text-sm md:text-base font-semibold">
                {theme.name} {theme.romanNumeral}
              </p>
            </div>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4 md:mb-6">
            <div
              className="w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center"
              style={{
                background: theme.colors.iconBg,
              }}
            >
              <span className="material-symbols-outlined text-white text-4xl md:text-6xl">
                book
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold text-white text-center leading-tight">
            {material.title}
          </h1>

          {/* Description */}
          <p className="text-white/90 text-sm md:text-base text-center mt-3 md:mt-4 max-w-2xl mx-auto">
            {material.description}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 md:px-12 lg:px-16 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
        {/* Introduction */}
        {material.content?.introduction && (
          <div
            className="mb-6 p-5 rounded-2xl border-l-4"
            style={{
              background: `${theme.colors.primary}10`,
              borderColor: theme.colors.primary,
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: theme.colors.text.primary }}
            >
              {material.content.introduction}
            </p>
          </div>
        )}

        {/* Sections */}
        {material.content?.sections && material.content.sections.length > 0 && (
          <div className="space-y-6">
            {material.content.sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
              >
                {/* Section Title */}
                <h2
                  className="text-lg font-bold mb-3 flex items-center gap-2"
                  style={{ color: theme.colors.text.primary }}
                >
                  <span
                    className="flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold"
                    style={{ background: theme.colors.primary }}
                  >
                    {index + 1}
                  </span>
                  {section.title}
                </h2>

                {/* Section Content */}
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: theme.colors.text.secondary }}
                >
                  {section.content}
                </p>

                {/* Examples */}
                {section.examples && section.examples.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Contoh:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {section.examples.map((example, i) => (
                        <div
                          key={i}
                          className="px-4 py-2 rounded-lg font-mono text-sm"
                          style={{
                            background: `${theme.colors.secondary}20`,
                            color: theme.colors.text.primary,
                          }}
                        >
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No Content Message */}
        {(!material.content?.sections || material.content.sections.length === 0) && (
          <div className="text-center py-12">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: `${theme.colors.primary}20` }}
            >
              <span
                className="material-symbols-outlined text-4xl"
                style={{ color: theme.colors.primary }}
              >
                construction
              </span>
            </div>
            <p className="text-slate-600 text-sm">
              Konten materi sedang dalam pengembangan
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {/* Baca Isi Materi Button */}
          <Link
            href={`/siswa/materi/${classId}/${materiId}/1`}
            className="block w-full py-4 md:py-5 rounded-2xl font-semibold text-white text-center text-sm md:text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{
              background: theme.colors.primary,
            }}
          >
            📚 Baca Isi Materi
          </Link>

          {/* Start Quiz Button */}
          <Link
            href={`/siswa/materi/${classId}/${materiId}/1/kuis`}
            className="block w-full py-4 md:py-5 rounded-2xl font-semibold text-center text-sm md:text-base border-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{
              borderColor: theme.colors.primary,
              color: theme.colors.primary,
            }}
          >
            Mulai Kuis 🎯
          </Link>

          {/* Practice Button */}
          <button
            className="block w-full py-4 md:py-5 rounded-2xl font-semibold text-center text-sm md:text-base border-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{
              borderColor: theme.colors.primary,
              color: theme.colors.primary,
            }}
          >
            Latihan Soal 📝
          </button>
        </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-12 md:h-16" />

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
