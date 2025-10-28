"use client";

import React, { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import KelasNavigationSidebar from "@/components/guru/KelasNavigationSidebar";
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

  // Check if we're on tambah/edit pages - hide sidebar and profile
  const isTambahOrEditPage = pathname.includes("/tambah") || pathname.includes("/edit");

  // Dummy data untuk guru
  const guruData = {
    nama: "Isabella",
    email: "isabella@gmail.com",
    foto: "/guru/foto-profil/profil-guru.svg",
  };

  // If it's tambah or edit page, render without sidebar and profile
  if (isTambahOrEditPage) {
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
            <p className="text-black text-base poppins-medium">{guruData.nama}</p>
            <p className="text-black/55 text-base poppins-medium">
              {guruData.email}
            </p>
          </div>
          <div className="w-[83px] h-[83px] rounded-full border-[6px] border-[#336d82] overflow-hidden flex-shrink-0">
            <Image
              src={guruData.foto}
              alt={guruData.nama}
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
