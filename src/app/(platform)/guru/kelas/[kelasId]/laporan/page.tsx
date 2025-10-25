"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const LaporanKelasPage = () => {
  const params = useParams();
  const kelasId = params.kelasId;

  const [selectedPeriod, setSelectedPeriod] = useState("week");

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Link href="/guru/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <span>/</span>
        <Link href={`/guru/kelas/${kelasId}`} className="hover:text-blue-600">Kelas</Link>
        <span>/</span>
        <span className="text-gray-900">Laporan</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan & Analisis Kelas</h1>
          <p className="text-gray-600">Analisis mendalam performa kelas</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="day">Hari Ini</option>
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
          </select>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
            Export PDF
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">Total Siswa Aktif</p>
          <h3 className="text-3xl font-bold text-gray-800">30</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">Rata-rata Nilai</p>
          <h3 className="text-3xl font-bold text-gray-800">85</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">Tingkat Penyelesaian</p>
          <h3 className="text-3xl font-bold text-gray-800">80%</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">Total Waktu Belajar</p>
          <h3 className="text-3xl font-bold text-gray-800">240 jam</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Belajar</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Grafik akan ditampilkan di sini</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribusi Nilai</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Grafik akan ditampilkan di sini</p>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Siswa Berprestasi</h3>
          <div className="text-center py-8 text-gray-500">Belum ada data</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Siswa Membutuhkan Perhatian</h3>
          <div className="text-center py-8 text-gray-500">Belum ada data</div>
        </div>
      </div>
    </div>
  );
};

export default LaporanKelasPage;
