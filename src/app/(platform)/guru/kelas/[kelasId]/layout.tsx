"use client";

import React, { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { KelasNavigationSidebar, KelasFloatingDock } from "@/components/guru";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";

export default function KelasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const kelasId = params.kelasId as string;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Check if we're on tambah/edit/bank pages - hide sidebar and profile
  const isFullscreenPage = pathname.includes("/tambah") || pathname.includes("/edit") || pathname.includes("/bank");

  // Dummy data untuk guru
  const guruData = {
    nama: "Isabella",
    email: "isabella@gmail.com",
    foto: "/guru/foto-profil/profil-guru.svg",
  };

  // If it's fullscreen page (tambah/edit/bank), render without sidebar and profile
  if (isFullscreenPage) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Sidebar Toggle Button - Hidden on Mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-6 left-6 z-50 w-10 h-10 bg-[#336d82] text-white rounded-lg md:flex hidden items-center justify-center hover:bg-[#2a5a6a] transition-colors shadow-lg"
      >
        <MenuIcon sx={{ fontSize: 24 }} />
      </button>

      {/* Desktop Sidebar - Hidden on Mobile/Tablet */}
      <div className="hidden md:block">
        <KelasNavigationSidebar kelasId={kelasId} isOpen={isSidebarOpen} />
      </div>

      {/* Mobile/Tablet Floating Dock */}
      <KelasFloatingDock kelasId={kelasId} />

      {/* Main Content Area */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "md:ml-[300px]" : "md:ml-0"
        } ml-0`}
      >
        {/* Top Right - User Profile - Responsive */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-8 md:right-12 flex items-center gap-2 sm:gap-3 md:gap-4 z-30">
          {/* Text - Always visible, position changes based on screen size */}
          <div className="text-left sm:text-right order-2 sm:order-1">
            <p className="text-black text-xs sm:text-sm md:text-base poppins-medium leading-tight">{guruData.nama}</p>
            <p className="text-black/55 text-[10px] sm:text-xs md:text-base poppins-medium leading-tight">
              {guruData.email}
            </p>
          </div>
          {/* Photo */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-[83px] md:h-[83px] rounded-full border-4 sm:border-5 md:border-[6px] border-[#336d82] overflow-hidden flex-shrink-0 order-1 sm:order-2">
            <Image
              src={guruData.foto}
              alt={guruData.nama}
              width={83}
              height={83}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Page Content - Responsive Padding */}
        <div className="pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 md:px-10 lg:px-12 pb-20 md:pb-8 relative">{children}</div>
      </div>
    </div>
  );
}
