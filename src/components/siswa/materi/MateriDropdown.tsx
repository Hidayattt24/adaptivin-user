"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

/**
 * Materi Dropdown Component
 *
 * Dropdown menu untuk section materi dengan gradient background sesuai tema kelas
 */

interface MateriDropdownProps {
  isOpen?: boolean;
  onToggle?: () => void;
  gradientColor?: string;
}

export default function MateriDropdown({
  isOpen = false,
  onToggle,
  gradientColor,
}: MateriDropdownProps) {
  return (
    <button
      onClick={onToggle}
      className="w-[69px] h-[34px] rounded-[20px] flex items-center justify-center hover:opacity-90 transition-opacity shadow-md"
      style={{
        background:
          gradientColor ||
          "linear-gradient(91deg, #67C090 -13.49%, #305A44 114.35%)",
      }}
    >
      <ChevronLeftIcon
        sx={{
          color: "white",
          fontSize: "21px",
          transition: "transform 0.2s",
          transform: isOpen ? "rotate(180deg)" : "rotate(270deg)",
        }}
      />
    </button>
  );
}
