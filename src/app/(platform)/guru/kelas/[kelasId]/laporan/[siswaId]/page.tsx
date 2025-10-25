"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const LaporanSiswaPage = () => {
  const params = useParams();
  const kelasId = params.kelasId;
  const siswaId = params.siswaId;

  const siswaData = {
    nama: "Ahmad Fauzi",
    nis: "2024001",
    rataRataNilai: 88,
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Link href="/guru/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <span>/</span>
        <Link href={`/guru/kelas/${kelasId}`} className="hover:text-blue-600">Kelas</Link>
        <span>/</span>
        <Link href={`/guru/kelas/${kelasId}/laporan`} className="hover:text-blue-600">Laporan</Link>
        <span>/</span>
        <span className="text-gray-900">{siswaData.nama}</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan Detail: {siswaData.nama}</h1>
          <p className="text-gray-600">NIS: {siswaData.nis}</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
          Export PDF
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">Rata-rata Nilai</p>
          <h3 className="text-3xl font-bold text-gray-800">{siswaData.rataRataNilai}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">Materi Selesai</p>
          <h3 className="text-3xl font-bold text-gray-800">4/5</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">Soal Dikerjakan</p>
          <h3 className="text-3xl font-bold text-gray-800">45</h3>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Analisis Mendalam</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Grafik analisis akan ditampilkan di sini</p>
        </div>
      </div>
    </div>
  );
};

export default LaporanSiswaPage;
