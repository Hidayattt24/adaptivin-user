"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

interface KelasNavigationSidebarProps {
  kelasId: string;
  isOpen: boolean;
}

const KelasNavigationSidebar: React.FC<KelasNavigationSidebarProps> = ({
  kelasId,
  isOpen,
}) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  const menuItems = [
    {
      title: "Materi",
      icon: MenuBookIcon,
      href: `/guru/kelas/${kelasId}/materi`,
      section: "menu",
    },
    {
      title: "Siswa",
      icon: PeopleIcon,
      href: `/guru/kelas/${kelasId}/siswa`,
      section: "menu",
    },
    {
      title: "Soal",
      icon: LibraryBooksIcon,
      href: `/guru/kelas/${kelasId}/soal`,
      section: "menu",
    },
    {
      title: "Laporan & Analisis",
      icon: AnalyticsIcon,
      href: `/guru/kelas/${kelasId}/laporan`,
      section: "menu",
    },
  ];

  const settingItems = [
    {
      title: "Pengaturan",
      icon: SettingsIcon,
      href: `/guru/kelas/${kelasId}/pengaturan`,
      section: "setting",
    },
    {
      title: "Kembali",
      icon: KeyboardReturnIcon,
      href: `/guru/dashboard`,
      section: "setting",
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-[300px] bg-gradient-to-b from-[#4f8194] via-[#7ba5b5] to-[#c8dce3] shadow-2xl z-40 overflow-y-auto scrollbar-hide transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center gap-2 px-6 py-8">
        <Image
          src="/logo/logo.svg"
          alt="Adaptivin Logo"
          width={40}
          height={40}
          className="w-10 h-10"
        />
        <span className="text-white text-xl poppins-semibold tracking-wide">
          Adaptivin
        </span>
      </div>

      {/* MENU Section */}
      <div className="px-6 py-4">
        <h2 className="text-white text-3xl poppins-semibold mb-4 tracking-wide">
          MENU
        </h2>
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all ${
                  active
                    ? "bg-[#4a7a8d] border-2 border-white text-white"
                    : "bg-white text-[#336d82] hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-[28px] h-[28px] rounded-full flex items-center justify-center flex-shrink-0 ${
                    active ? "bg-white/30" : "bg-[#578a9d]/15"
                  }`}
                >
                  <Icon
                    className={active ? "text-white" : "text-[#336d82]"}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <span className="text-[15px] poppins-medium leading-tight">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* PENGATURAN Section */}
      <div className="px-6 py-4">
        <h2 className="text-white text-3xl poppins-semibold mb-4 tracking-wide">
          PENGATURAN
        </h2>
        <div className="space-y-2">
          {settingItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all ${
                  active
                    ? "bg-[#4a7a8d] border-2 border-white text-white"
                    : "bg-white text-[#336d82] hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-[28px] h-[28px] rounded-full flex items-center justify-center flex-shrink-0 ${
                    active ? "bg-white/30" : "bg-[#578a9d]/15"
                  }`}
                >
                  <Icon
                    className={active ? "text-white" : "text-[#336d82]"}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <span className="text-[15px] poppins-medium leading-tight">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default KelasNavigationSidebar;
