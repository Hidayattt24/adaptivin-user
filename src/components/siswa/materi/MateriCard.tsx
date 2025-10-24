"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useClassTheme } from '@/contexts/ClassThemeContext';

export interface MateriCardProps {
  id: string;
  title: string;
  description: string;
  icon: string; // Path to icon image
  isLocked?: boolean;
}

/**
 * MateriCard Component
 *
 * Displays a material card with theme-aware styling
 * Automatically adapts colors based on current class theme
 *
 * Usage:
 * ```tsx
 * <MateriCard
 *   id="pecahan-biasa"
 *   title="Pecahan Biasa & Campuran"
 *   description="Belajar membagi pizza..."
 *   icon="/icons/pizza.svg"
 * />
 * ```
 */
export default function MateriCard({
  id,
  title,
  description,
  icon,
  isLocked = false,
}: MateriCardProps) {
  const { theme } = useClassTheme();

  // Extract classId from materiId (format: "pecahan-biasa-4")
  const classId = theme.id; // Get from theme context

  const CardWrapper = isLocked ? 'div' : Link;
  const wrapperProps = isLocked
    ? {}
    : { href: `/siswa/materi/${classId}/${id}` };

  return (
    <CardWrapper
      {...wrapperProps}
      className={`block bg-white rounded-2xl p-5 shadow-sm border border-slate-100
        ${!isLocked ? 'hover:shadow-md hover:border-slate-200 active:scale-[0.98] transition-all duration-200' : 'opacity-60 cursor-not-allowed'}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon Circle */}
        <div
          className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: theme.colors.iconBg,
          }}
        >
          <Image
            src={icon}
            alt={title}
            width={28}
            height={28}
            className="object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm font-semibold mb-2 line-clamp-2"
            style={{ color: theme.colors.text.primary }}
          >
            {title}
          </h3>
          <p
            className="text-xs leading-relaxed line-clamp-3"
            style={{ color: theme.colors.text.secondary }}
          >
            {description}
          </p>
        </div>

        {/* Lock Icon */}
        {isLocked && (
          <div className="flex-shrink-0">
            <span className="material-symbols-outlined text-gray-400 text-xl">
              lock
            </span>
          </div>
        )}

        {/* Arrow Icon */}
        {!isLocked && (
          <div className="flex-shrink-0">
            <span className="material-symbols-outlined text-slate-400 text-xl">
              chevron_right
            </span>
          </div>
        )}
      </div>
    </CardWrapper>
  );
}
