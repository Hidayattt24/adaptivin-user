"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const MateriListPage = () => {
  const params = useParams();
  const kelasId = params.kelasId;

  const [materiList] = useState([
    {
      id: "1",
      judul: "Penjumlahan dan Pengurangan",
      topik: "Bilangan",
      status: "published",
      jumlahSiswaSelesai: 25,
      totalSiswa: 30,
      createdAt: "2024-10-20",
    },
    {
      id: "2",
      judul: "Perkalian Dasar",
      topik: "Bilangan",
      status: "draft",
      jumlahSiswaSelesai: 0,
      totalSiswa: 30,
      createdAt: "2024-10-22",
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
        <span className="text-gray-900">Materi</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kelola Materi
          </h1>
          <p className="text-gray-600">
            Daftar materi pembelajaran untuk kelas ini
          </p>
        </div>
        <Link href={`/guru/kelas/${kelasId}/materi/tambah`}>
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
            Tambah Materi
          </button>
        </Link>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Materi
            </label>
            <input
              type="text"
              placeholder="Cari berdasarkan judul..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topik
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Semua Topik</option>
              <option value="bilangan">Bilangan</option>
              <option value="geometri">Geometri</option>
              <option value="aljabar">Aljabar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Semua Status</option>
              <option value="published">Dipublikasi</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Materi List */}
      {materiList.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Belum Ada Materi
          </h3>
          <p className="text-gray-600 mb-6">
            Mulai buat materi pembelajaran pertama untuk kelas ini
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {materiList.map((materi) => (
            <div
              key={materi.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {materi.judul}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        materi.status === "published"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {materi.status === "published" ? "Dipublikasi" : "Draft"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Topik: {materi.topik}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      {materi.jumlahSiswaSelesai}/{materi.totalSiswa} siswa
                      selesai
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(materi.createdAt).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/guru/kelas/${kelasId}/materi/${materi.id}`}>
                    <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      Lihat
                    </button>
                  </Link>
                  <Link
                    href={`/guru/kelas/${kelasId}/materi/${materi.id}/edit`}
                  >
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      Edit
                    </button>
                  </Link>
                  <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MateriListPage;
