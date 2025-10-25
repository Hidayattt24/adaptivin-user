"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const PreviewMateriPage = () => {
  const params = useParams();
  const kelasId = params.kelasId;
  const materiId = params.materiId;

  // Data dummy - nanti diambil dari API
  const materiData = {
    id: materiId,
    judul: "Penjumlahan dan Pengurangan",
    topik: "Bilangan",
    deskripsi:
      "Materi tentang operasi dasar penjumlahan dan pengurangan bilangan bulat",
    konten: `# Penjumlahan dan Pengurangan

## Pengenalan
Penjumlahan adalah operasi matematika yang menggabungkan dua bilangan atau lebih menjadi satu bilangan.
Pengurangan adalah operasi matematika yang mengurangi suatu bilangan dengan bilangan lainnya.

## Contoh Penjumlahan
- 5 + 3 = 8
- 10 + 7 = 17
- 25 + 15 = 40

## Contoh Pengurangan
- 10 - 3 = 7
- 20 - 8 = 12
- 50 - 25 = 25

## Latihan
Cobalah kerjakan soal-soal berikut:
1. 15 + 23 = ?
2. 40 - 18 = ?
3. 35 + 47 = ?`,
    status: "published",
    createdAt: "2024-10-20",
    jumlahSiswaSelesai: 25,
    totalSiswa: 30,
  };

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
          href={`/guru/kelas/${kelasId}/materi`}
          className="hover:text-blue-600"
        >
          Materi
        </Link>
        <span>/</span>
        <span className="text-gray-900">{materiData.judul}</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {materiData.judul}
            </h1>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                materiData.status === "published"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {materiData.status === "published" ? "Dipublikasi" : "Draft"}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{materiData.deskripsi}</p>
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Topik: {materiData.topik}
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              {materiData.jumlahSiswaSelesai}/{materiData.totalSiswa} siswa
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
              {new Date(materiData.createdAt).toLocaleDateString("id-ID")}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/guru/kelas/${kelasId}/materi/${materiId}/edit`}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Edit Materi
          </Link>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            Hapus
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap">{materiData.konten}</div>
        </div>
      </div>

      {/* Student Progress */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Progress Siswa
        </h2>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              {materiData.jumlahSiswaSelesai} dari {materiData.totalSiswa}{" "}
              siswa telah menyelesaikan materi ini
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {Math.round(
                (materiData.jumlahSiswaSelesai / materiData.totalSiswa) * 100
              )}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${
                  (materiData.jumlahSiswaSelesai / materiData.totalSiswa) * 100
                }%`,
              }}
            />
          </div>
        </div>
        <Link
          href={`/guru/kelas/${kelasId}/siswa`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Lihat detail progress siswa →
        </Link>
      </div>
    </div>
  );
};

export default PreviewMateriPage;
