"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const KelasOverviewPage = () => {
  const params = useParams();
  const kelasId = params.kelasId;

  // Data dummy - nanti diambil dari API berdasarkan kelasId
  const kelasData = {
    nama: "Kelas 5A",
    tahunAjaran: "2024/2025",
    jumlahSiswa: 30,
    materiAktif: 5,
    totalSoal: 25,
    rataRataNilai: 85,
  };

  const menuKelas = [
    {
      title: "Materi",
      description: "Kelola materi pembelajaran",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      href: `/guru/kelas/${kelasId}/materi`,
      color: "blue",
      count: kelasData.materiAktif,
    },
    {
      title: "Siswa",
      description: "Lihat daftar dan progress siswa",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      href: `/guru/kelas/${kelasId}/siswa`,
      color: "green",
      count: kelasData.jumlahSiswa,
    },
    {
      title: "Bank Soal",
      description: "Kelola soal dan kuis",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      href: `/guru/kelas/${kelasId}/soal`,
      color: "purple",
      count: kelasData.totalSoal,
    },
    {
      title: "Laporan",
      description: "Analisis dan laporan kelas",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      href: `/guru/kelas/${kelasId}/laporan`,
      color: "yellow",
      count: null,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; hover: string }> =
      {
        blue: {
          bg: "bg-blue-100",
          text: "text-blue-600",
          hover: "hover:bg-blue-50",
        },
        green: {
          bg: "bg-green-100",
          text: "text-green-600",
          hover: "hover:bg-green-50",
        },
        purple: {
          bg: "bg-purple-100",
          text: "text-purple-600",
          hover: "hover:bg-purple-50",
        },
        yellow: {
          bg: "bg-yellow-100",
          text: "text-yellow-600",
          hover: "hover:bg-yellow-50",
        },
      };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/guru/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-gray-900">{kelasData.nama}</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {kelasData.nama}
            </h1>
            <p className="text-gray-600">
              Tahun Ajaran {kelasData.tahunAjaran}
            </p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Pengaturan Kelas
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">Jumlah Siswa</p>
          <h3 className="text-3xl font-bold text-gray-800">
            {kelasData.jumlahSiswa}
          </h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">Materi Aktif</p>
          <h3 className="text-3xl font-bold text-gray-800">
            {kelasData.materiAktif}
          </h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">Total Soal</p>
          <h3 className="text-3xl font-bold text-gray-800">
            {kelasData.totalSoal}
          </h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">Rata-rata Nilai</p>
          <h3 className="text-3xl font-bold text-gray-800">
            {kelasData.rataRataNilai}
          </h3>
        </div>
      </div>

      {/* Menu Cards */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Menu Kelola Kelas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuKelas.map((menu) => {
            const colors = getColorClasses(menu.color);
            return (
              <Link
                key={menu.title}
                href={menu.href}
                className={`block border-2 border-gray-200 rounded-lg p-6 ${colors.hover} transition-all hover:border-${menu.color}-300 hover:shadow-md`}
              >
                <div className={`${colors.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <svg
                    className={`w-6 h-6 ${colors.text}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={menu.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {menu.title}
                  {menu.count !== null && (
                    <span className={`ml-2 text-sm ${colors.text}`}>
                      ({menu.count})
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600">{menu.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Aktivitas Terkini
        </h2>
        <div className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            Belum ada aktivitas terkini
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelasOverviewPage;
