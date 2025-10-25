"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const SiswaListPage = () => {
  const params = useParams();
  const kelasId = params.kelasId;

  const [siswaList] = useState([
    {
      id: "1",
      nama: "Ahmad Fauzi",
      nis: "2024001",
      email: "ahmad@example.com",
      materiSelesai: 4,
      totalMateri: 5,
      rataRataNilai: 88,
      statusAktif: true,
    },
    {
      id: "2",
      nama: "Siti Nurhaliza",
      nis: "2024002",
      email: "siti@example.com",
      materiSelesai: 5,
      totalMateri: 5,
      rataRataNilai: 92,
      statusAktif: true,
    },
    {
      id: "3",
      nama: "Budi Santoso",
      nis: "2024003",
      email: "budi@example.com",
      materiSelesai: 3,
      totalMateri: 5,
      rataRataNilai: 75,
      statusAktif: true,
    },
  ]);

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
        <span className="text-gray-900">Siswa</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daftar Siswa
          </h1>
          <p className="text-gray-600">
            Kelola dan pantau progress siswa di kelas ini
          </p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Siswa
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Siswa
            </label>
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau NIS..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urutkan
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="nama">Nama (A-Z)</option>
              <option value="nilai">Nilai Tertinggi</option>
              <option value="progress">Progress Terbanyak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Siswa Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Siswa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NIS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress Materi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rata-rata Nilai
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {siswaList.map((siswa) => (
              <tr key={siswa.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {siswa.nama.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {siswa.nama}
                      </div>
                      <div className="text-sm text-gray-500">
                        {siswa.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {siswa.nis}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 mb-1">
                    {siswa.materiSelesai}/{siswa.totalMateri} Materi
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (siswa.materiSelesai / siswa.totalMateri) * 100
                        }%`,
                      }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">
                    {siswa.rataRataNilai}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      siswa.statusAktif
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {siswa.statusAktif ? "Aktif" : "Tidak Aktif"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/guru/kelas/${kelasId}/siswa/${siswa.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Lihat Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SiswaListPage;
