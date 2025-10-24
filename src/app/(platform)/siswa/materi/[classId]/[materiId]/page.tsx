"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MobileWarning from "@/components/siswa/layout/MobileWarning";
import { useClassTheme } from "@/contexts/ClassThemeContext";
import { getMaterialById } from "@/data/mockMaterials";

/**
 * Materi Detail Page
 *
 * NO NAVBAR MOBILE - Only back button to class list
 * Displays detailed content of a specific material
 * URL: /siswa/materi/4/pecahan-biasa-campuran-4
 */

export default function MateriDetailPage() {
  const [isMobile, setIsMobile] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { theme } = useClassTheme();

  const classId = params?.classId as string;
  const materiId = params?.materiId as string;
  const material = getMaterialById(materiId);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Redirect if material not found or doesn't belong to this class
  useEffect(() => {
    if (!material || material.classId !== classId) {
      router.push(`/siswa/materi/${classId}`);
    }
  }, [material, classId, router]);

  if (!isMobile) {
    return <MobileWarning />;
  }

  if (!material || material.classId !== classId) {
    return null; // Will redirect
  }

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-white">
      {/* Header with Gradient Background - NO NAVBAR */}
      <div
        className="relative px-6 pt-12 pb-8 overflow-hidden"
        style={{
          background: theme.gradients.background,
        }}
      >
        {/* Back Button to Class List */}
        <button
          onClick={() => router.push(`/siswa/materi/${classId}`)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <span className="material-symbols-outlined text-white text-xl">
            arrow_back
          </span>
        </button>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12" />
        </div>

        {/* Content */}
        <div className="relative z-10 pt-8">
          {/* Class Badge */}
          <div className="flex justify-center mb-4">
            <div
              className="px-6 py-1.5 rounded-full"
              style={{
                background: theme.gradients.badge || theme.colors.badge,
              }}
            >
              <p className="text-white text-sm font-semibold">
                {theme.name} {theme.romanNumeral}
              </p>
            </div>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: theme.colors.iconBg,
              }}
            >
              <span className="material-symbols-outlined text-white text-4xl">
                book
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white text-center leading-tight">
            {material.title}
          </h1>

          {/* Description */}
          <p className="text-white/90 text-sm text-center mt-3 max-w-sm mx-auto">
            {material.description}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 py-8">
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
        <div className="mt-8 space-y-3">
          {/* Start Quiz Button */}
          <Link
            href={`/siswa/materi/${classId}/${materiId}/kuis`}
            className="block w-full py-4 rounded-2xl font-semibold text-white text-center shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{
              background: theme.colors.primary,
            }}
          >
            Mulai Kuis 🎯
          </Link>

          {/* Practice Button */}
          <button
            className="block w-full py-4 rounded-2xl font-semibold text-center border-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{
              borderColor: theme.colors.primary,
              color: theme.colors.primary,
            }}
          >
            Latihan Soal 📝
          </button>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-12" />

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
