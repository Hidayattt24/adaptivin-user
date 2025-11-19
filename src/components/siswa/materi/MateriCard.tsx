"use client";

import Link from "next/link";
import { useClassTheme } from "@/contexts/ClassThemeContext";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BookIcon from "@mui/icons-material/Book";
import SchoolIcon from "@mui/icons-material/School";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LockIcon from "@mui/icons-material/Lock";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export interface MateriCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  isLocked?: boolean;
  isCompleted?: boolean;
}

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  book: BookIcon,
  menu_book: MenuBookIcon,
  school: SchoolIcon,
  auto_stories: AutoStoriesIcon,
};

/**
 * MateriCard Component
 */
export default function MateriCard({
  id,
  title,
  description,
  icon,
  isLocked = false,
  isCompleted = false,
}: MateriCardProps) {
  const { theme } = useClassTheme();

  // Get icon component
  const IconComponent = iconMap[icon] || BookIcon;

  // Get classId from theme
  const classId = theme.id;

  const cardClassName = `block bg-white rounded-[10px] shadow-sm border border-slate-100 relative ${
    !isLocked
      ? "hover:shadow-md hover:border-slate-200 active:scale-[0.98] transition-all duration-200"
      : "opacity-60 cursor-not-allowed"
  }`;
  const cardStyle = {
    width: "326px",
    height: "129px",
  };

  const cardContent = (
    <div className="flex items-center gap-4 h-full p-4">
      {/* Completed Badge - Top Right Corner */}
      {isCompleted && !isLocked && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-green-400 to-green-500 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
          <span>✓</span>
          <span>Sudah Dipelajari</span>
        </div>
      )}

      {/* Icon Circle - Left Side */}
      <div
        className="flex-shrink-0 rounded-full flex items-center justify-center"
        style={{
          width: "57px",
          height: "57px",
          background: theme.colors.iconBg,
        }}
      >
        <IconComponent
          sx={{
            fontSize: "32px",
            color: "#FFFFFF",
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
          <LockIcon
            sx={{
              fontSize: "20px",
              color: "#9CA3AF",
            }}
          />
        ) : (
          <ChevronRightIcon
            sx={{
              fontSize: "20px",
              color: "#9CA3AF",
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
    <Link
      href={`/siswa/materi/${classId}/${id}`}
      className={cardClassName}
      style={cardStyle}
    >
      {cardContent}
    </Link>
  );
}
