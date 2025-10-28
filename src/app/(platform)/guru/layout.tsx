"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

export default function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path);
  };

  // Check if we're on the dashboard page or kelas detail pages
  const isDashboardPage = pathname === "/guru/dashboard";
  const isKelasDetailPage = pathname.includes("/guru/kelas/") && pathname !== "/guru/kelas";

  // If it's dashboard page or kelas detail page, render without navbar and sidebar
  if (isDashboardPage || isKelasDetailPage) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="ml-4 text-xl font-bold text-gray-900">
                Adaptivin - Portal Guru
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  G
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    Guru Demo
                  </p>
                  <p className="text-xs text-gray-500">guru@adaptivin.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-20 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="p-4 space-y-2">
          <Link
            href="/guru/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/guru/dashboard")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="font-medium">Dashboard</span>
          </Link>

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Menu Utama
            </p>
          </div>

          <Link
            href="/guru/kelas"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/guru/kelas")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="font-medium">Kelola Kelas</span>
          </Link>

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Pengaturan
            </p>
          </div>

          <Link
            href="/guru/profil"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/guru/profil")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="font-medium">Profil</span>
          </Link>

          <button className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 w-full">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="font-medium">Keluar</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-200 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {children}
      </main>
    </div>
    </QueryClientProvider>
  );
}
