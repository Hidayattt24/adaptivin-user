"use client";

import { useRouter, usePathname } from "next/navigation";
import type { ComponentType } from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SettingsIcon from "@mui/icons-material/Settings";

interface KelasFloatingDockProps {
  kelasId: string;
}

export const KelasFloatingDock = ({ kelasId }: KelasFloatingDockProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      name: "Materi",
      icon: MenuBookIcon,
      href: `/guru/kelas/${kelasId}/materi`,
    },
    {
      name: "Siswa",
      icon: PeopleIcon,
      href: `/guru/kelas/${kelasId}/siswa`,
    },
    {
      name: "Soal",
      icon: LibraryBooksIcon,
      href: `/guru/kelas/${kelasId}/soal`,
    },
    {
      name: "Laporan",
      icon: AnalyticsIcon,
      href: `/guru/kelas/${kelasId}/laporan`,
    },
    {
      name: "Pengaturan",
      icon: SettingsIcon,
      href: `/guru/kelas/${kelasId}/pengaturan`,
    },
  ];

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <FloatingDockMobile
      navItems={navItems}
      pathname={pathname}
      onNavigate={handleNavigate}
    />
  );
};

interface NavItem {
  name: string;
  icon: ComponentType<SvgIconProps>;
  href: string;
}

interface DockProps {
  navItems: NavItem[];
  pathname: string;
  onNavigate: (href: string) => void;
}

const FloatingDockMobile = ({ navItems, pathname, onNavigate }: DockProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block md:hidden">
      {/* Ultra Modern Bottom Navigation Bar */}
      <div className="relative">
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#336D82]/95 via-[#4a8a9e]/90 to-[#5a96a8]/85 backdrop-blur-2xl"></div>
        
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

        {/* Top glow effect */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>

        {/* Navigation Items Container */}
        <div className="relative flex items-center justify-around px-2 pt-3 pb-safe pb-4">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname.includes(item.href);
            
            return (
              <button
                key={item.name}
                onClick={() => onNavigate(item.href)}
                className="relative flex flex-col items-center justify-center gap-1 px-2 py-1.5 min-w-[68px] group transition-all duration-300"
                style={{
                  animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Active Background - Elevated Card Style */}
                {isActive && (
                  <>
                    {/* Main card background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-white/10 rounded-2xl backdrop-blur-md shadow-xl border border-white/30 animate-scaleIn"></div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md animate-pulse"></div>
                    
                    {/* Top highlight */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"></div>
                  </>
                )}

                {/* Icon Container with Bounce Effect */}
                <div className={`relative z-10 transition-all duration-300 ${
                  isActive
                    ? "text-white scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]"
                    : "text-white/60 group-hover:text-white/90 group-hover:scale-105 group-active:scale-95"
                }`}>
                  {/* Icon background circle for active state */}
                  {isActive && (
                    <div className="absolute inset-0 -m-2 bg-white/10 rounded-full animate-ping"></div>
                  )}
                  <Icon sx={{ fontSize: 26 }} />
                </div>

                {/* Label with smooth transition */}
                <span className={`relative z-10 text-[10px] poppins-bold tracking-wide transition-all duration-300 ${
                  isActive
                    ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                    : "text-white/60 group-hover:text-white/90"
                }`}>
                  {item.name}
                </span>

                {/* Active Indicator - Top Dot */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-bounce"></div>
                  </div>
                )}

                {/* Ripple effect on tap */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-white/0 group-active:bg-white/20 transition-colors duration-150"></div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom safe area indicator */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full mb-1"></div>
      </div>

      {/* Add keyframes for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
