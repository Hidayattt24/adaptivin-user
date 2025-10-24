import React from "react";

interface QuizBadgeProps {
  icon: "edit" | "menu_book";
  label?: string;
  bgColor?: string;
}

/**
 * Quiz Badge Component
 *
 * Badge untuk menandakan "Soal" atau nomor soal dengan:
 * - Icon dalam circle putih
 * - Label opsional
 * - Ukuran tetap 71px x 33px
 */
export default function QuizBadge({
  icon,
  label,
  bgColor = "#336D82"
}: QuizBadgeProps) {
  return (
    <div
      className="flex items-center gap-2 rounded-[20px] px-4 h-[40px] w-[85px] flex-shrink-0 shadow-lg"
      style={{ backgroundColor: bgColor }}
    >
      {/* Circle with Icon - Badge enlarged, icon smaller */}
      <div className="w-[24px] h-[24px] bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
        <span
          className="material-symbols-outlined text-[14px] leading-none"
          style={{ color: bgColor }}
        >
          {icon}
        </span>
      </div>

      {/* Label */}
      {label && (
        <span className="text-white text-[11px] font-semibold leading-none">
          {label}
        </span>
      )}
    </div>
  );
}
