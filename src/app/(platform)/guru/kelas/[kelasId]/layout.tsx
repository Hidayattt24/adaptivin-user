"use client";

import React, { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { KelasNavigationSidebar } from "@/components/guru";
import { useTeacherProfile } from "@/hooks/guru/useTeacherProfile";
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
  // const guruData = {
  //   nama: "Isabella",
  //   email: "isabella@gmail.com",
  //   foto: "/guru/foto-profil/profil-guru.svg",
  // };

  const { data: teacher } = useTeacherProfile();

  // If it's fullscreen page (tambah/edit/bank), render without sidebar and profile
  if (isFullscreenPage) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-6 left-6 z-50 w-10 h-10 bg-[#336d82] text-white rounded-lg flex items-center justify-center hover:bg-[#2a5a6a] transition-colors shadow-lg"
      >
        <MenuIcon sx={{ fontSize: 24 }} />
      </button>

      {/* Sidebar */}
      <KelasNavigationSidebar kelasId={kelasId} isOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "ml-[300px]" : "ml-0"
        }`}
      >
        {/* Top Right - User Profile - Scrolls with content */}
        <div className="absolute top-6 right-12 flex items-center gap-4 z-30">
          <div className="text-right">
            <p className="text-black text-2xl poppins-medium">{teacher?.nama_lengkap}</p>
            <p className="text-black/55 text-base poppins-medium">
              {teacher?.email}
            </p>
          </div>
          <div className="w-[83px] h-[83px] rounded-full border-[6px] border-[#336d82] overflow-hidden flex-shrink-0">
            <Image
              src="/guru/foto-profil/profil-guru.svg"
              alt={teacher?.nama_lengkap || "Foto Profil Guru"}
              width={83}
              height={83}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Page Content */}
        <div className="pt-28 px-12 pb-8 relative">{children}</div>
      </div>
    </div>
  );
}
