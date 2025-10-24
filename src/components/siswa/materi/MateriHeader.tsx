"use client";

import { useClassTheme } from '@/contexts/ClassThemeContext';

export interface MateriHeaderProps {
  motivationalText?: string;
}

/**
 * MateriHeader Component
 *
 * Displays the header section with class badge and motivational text
 * Theme-aware gradient background and badge styling
 *
 * Usage:
 * ```tsx
 * <MateriHeader motivationalText="Jangan takut salah!" />
 * ```
 */
export default function MateriHeader({
  motivationalText = "Jangan takut salah, di sini kita belajar bersama!",
}: MateriHeaderProps) {
  const { theme } = useClassTheme();

  return (
    <div
      className="relative px-6 pt-12 pb-8 overflow-hidden"
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
        {/* Class Badge */}
        <div className="flex justify-center mb-6">
          <div
            className="px-8 py-2 rounded-full"
            style={{
              background: theme.gradients.badge || theme.colors.badge,
            }}
          >
            <p className="text-white text-base font-semibold">
              {theme.name}{' '}
              <span className="font-semibold italic">{theme.romanNumeral}</span>
            </p>
          </div>
        </div>

        {/* Motivational Text */}
        <p className="text-white text-xl font-semibold text-center leading-tight max-w-sm mx-auto">
          {motivationalText}
        </p>
      </div>
    </div>
  );
}
