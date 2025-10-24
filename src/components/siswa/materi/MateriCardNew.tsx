"use client";

import Link from 'next/link';
import { useClassTheme } from '@/contexts/ClassThemeContext';

export interface MateriCardNewProps {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon name from pixelarticons (e.g., 'book', 'calculator')
  isLocked?: boolean;
}

/**
 * MateriCardNew Component
 *
 * New design with:
 * - Rectangle: 326x129px
 * - Icon circle (left) from pixelarticons
 * - Text content (right)
 * - Theme-aware colors
 *
 * Usage:
 * ```tsx
 * <MateriCardNew
 *   id="pecahan-biasa"
 *   title="Pecahan Biasa & Campuran"
 *   description="Belajar membagi pizza..."
 *   icon="book"
 * />
 * ```
 */
export default function MateriCardNew({
  id,
  title,
  description,
  icon,
  isLocked = false,
}: MateriCardNewProps) {
  const { theme } = useClassTheme();

  // Get classId from theme
  const classId = theme.id;

  const cardClassName = `block bg-white rounded-[10px] shadow-sm border border-slate-100 ${!isLocked ? 'hover:shadow-md hover:border-slate-200 active:scale-[0.98] transition-all duration-200' : 'opacity-60 cursor-not-allowed'}`;
  const cardStyle = {
    width: '326px',
    height: '129px',
  };

  const cardContent = (
    <div className="flex items-center gap-4 h-full p-4">
      {/* Icon Circle - Left Side */}
      <div
        className="flex-shrink-0 rounded-full flex items-center justify-center"
        style={{
          width: '57px',
          height: '57px',
          background: theme.colors.iconBg,
        }}
      >
        <i
          className={`pixelart-icons-font-${icon}`}
          style={{
            fontSize: '32px',
            color: '#FFFFFF',
          }}
        />
      </div>

      {/* Content - Right Side */}
      <div className="flex-1 min-w-0">
        <h3
          className="text-sm font-semibold mb-1.5 line-clamp-2"
          style={{ color: theme.colors.text.primary }}
        >
          {title}
        </h3>
        <p
          className="text-[10px] leading-relaxed line-clamp-3"
          style={{ color: theme.colors.text.secondary }}
        >
          {description}
        </p>
      </div>

      {/* Lock Icon or Arrow */}
      <div className="flex-shrink-0">
        {isLocked ? (
          <i
            className="pixelart-icons-font-lock"
            style={{
              fontSize: '20px',
              color: '#9CA3AF',
            }}
          />
        ) : (
          <i
            className="pixelart-icons-font-chevron-right"
            style={{
              fontSize: '20px',
              color: '#9CA3AF',
            }}
          />
        )}
      </div>
    </div>
  );

  if (isLocked) {
    return (
      <div className={cardClassName} style={cardStyle}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={`/siswa/materi/${classId}/${id}/1`} className={cardClassName} style={cardStyle}>
      {cardContent}
    </Link>
  );
}
