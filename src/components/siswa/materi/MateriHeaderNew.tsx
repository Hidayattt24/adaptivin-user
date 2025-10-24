"use client";

import Image from "next/image";
import { useClassTheme } from "@/contexts/ClassThemeContext";

export interface MateriHeaderNewProps {
  motivationalText?: string;
}

/**
 * MateriHeaderNew Component
 *
 * New design with:
 * - Badge with gradient (border-radius: 20px)
 * - Motivational text
 * - White rectangle (326x136px) with pixel art inside
 * - "Materi Pembelajaran" badge below rectangle
 *
 * Usage:
 * ```tsx
 * <MateriHeaderNew />
 * ```
 */
export default function MateriHeaderNew({
  motivationalText = "Jangan takut salah, disini kita belajar bersama!",
}: MateriHeaderNewProps) {
  const { theme } = useClassTheme();

  return (
    <div
      className="relative px-6 pt-12 pb-6 overflow-hidden"
      style={{
        background: theme.gradients.background,
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Class Badge with Gradient */}
        <div className="flex justify-center mb-4">
          <div
            className="px-8 py-2.5 rounded-[20px]"
            style={{
              background: theme.gradients.badge || theme.colors.primary,
            }}
          >
            <p className="text-white text-base poppins-semibold-italic whitespace-nowrap">
              {theme.name} {theme.romanNumeral}
            </p>
          </div>
        </div>

        {/* Motivational Text */}
        <p className="text-white text-center text-base font-medium leading-relaxed max-w-sm mx-auto mb-6">
          {motivationalText}
        </p>

        {/* White Rectangle with Pixel Art */}
        <div className="flex justify-center mb-4">
          <div
            className="relative bg-white rounded-[10px] shadow-lg overflow-hidden"
            style={{
              width: "326px",
              height: "136px",
            }}
          >
            {/* Pixel Art Inside Rectangle - Two pixel arts side by side */}
            <div className="absolute inset-0 flex items-center justify-center gap-4 overflow-hidden">
              {/* Left Pixel Art - 88.656px x 97.14px */}
              <div className="flex-shrink-0">
                <Image
                  src={theme.pixelArt.left}
                  alt={`${theme.name} pixel art left`}
                  width={88.656}
                  height={97.14}
                  className="object-contain"
                  style={{
                    width: '88.656px',
                    height: '97.14px',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
              {/* Right Pixel Art - 160.256px x 197.632px */}
              <div className="flex-shrink-0">
                <Image
                  src={theme.pixelArt.right}
                  alt={`${theme.name} pixel art right`}
                  width={160.256}
                  height={197.632}
                  className="object-contain"
                  style={{
                    width: '160.256px',
                    height: '197.632px',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* "Materi Pembelajaran" Badge - Centered Below Rectangle */}
        <div className="flex justify-center">
          <div
            className="px-8 py-2 rounded-[20px]"
            style={{
              width: "184px",
              height: "34px",
              background: theme.gradients.badgeLabel,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p className="text-white text-xs poppins-semibold-italic whitespace-nowrap">
              Materi Pembelajaran
            </p>
          </div>
        </div>
      </div>

      {/* Add Google Material Symbols (fallback) */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
