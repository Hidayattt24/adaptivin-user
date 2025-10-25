"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const DetailSiswaPage = () => {
  const params = useParams();
  const kelasId = params.kelasId;
  const siswaId = params.siswaId;

  // Data dummy
  const siswaData = {
    id: siswaId,
    nama: "Ahmad Fauzi",
    nis: "2024001",
    email: "ahmad@example.com",
    kelas: "5A",
    rataRataNilai: 88,
    totalWaktuBelajar: "12 jam",
    materiSelesai: 4,
    totalMateri: 5,
    soalDikerjakan: 45,
  };

  const progressMateri = [
    {
      id: "1",
      judul: "Penjumlahan dan Pengurangan",
      status: "completed",
      nilai: 90,
      tanggalSelesai: "2024-10-22",
    },
    {
      id: "2",
      judul: "Perkalian Dasar",
      status: "completed",
      nilai: 85,
      tanggalSelesai: "2024-10-23",
    },
    {
      id: "3",
      judul: "Pembagian",
      status: "in_progress",
      nilai: null,
      tanggalSelesai: null,
    },
  ];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Link href="/guru/dashboard" className="hover:text-blue-600">
          Dashboard
        </Link>
        <span>/</span>
        <Link href={`/guru/kelas/${kelasId}`} className="hover:text-blue-600">
          Kelas
        </Link>
        <span>/</span>
        <Link
          href={`/guru/kelas/${kelasId}/siswa`}
          className="hover:text-blue-600"
        >
          Siswa
        </Link>
        <span>/</span>
        <span className="text-gray-900">{siswaData.nama}</span>
      </div>

      {/* Student Profile */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              {siswaData.nama.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {siswaData.nama}
              </h1>
              <p className="text-gray-600">NIS: {siswaData.nis}</p>
              <p className="text-gray-600">{siswaData.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              Kirim Pesan
            </button>
            <Link href={`/guru/kelas/${kelasId}/laporan/${siswaId}`}>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                Lihat Laporan Lengkap
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">Rata-rata Nilai</p>
          <h3 className="text-3xl font-bold text-gray-800">
            {siswaData.rataRataNilai}
          </h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">Materi Selesai</p>
          <h3 className="text-3xl font-bold text-gray-800">
            {siswaData.materiSelesai}/{siswaData.totalMateri}
          </h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">Soal Dikerjakan</p>
          <h3 className="text-3xl font-bold text-gray-800">
            {siswaData.soalDikerjakan}
          </h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm mb-1">Waktu Belajar</p>
          <h3 className="text-3xl font-bold text-gray-800">
            {siswaData.totalWaktuBelajar}
          </h3>
        </div>
      </div>

      {/* Progress Materi */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Progress Materi
        </h2>
        <div className="space-y-4">
          {progressMateri.map((materi) => (
            <div
              key={materi.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {materi.judul}
                  </h3>
                  {materi.status === "completed" ? (
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="text-green-600 font-semibold">
                        Selesai
                      </span>
                      <span>Nilai: {materi.nilai}</span>
                      <span>
                        {new Date(
                          materi.tanggalSelesai!
                        ).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-yellow-600 font-semibold">
                      Sedang Belajar
                    </span>
                  )}
                </div>
                {materi.status === "completed" && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
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

export default DetailSiswaPage;
