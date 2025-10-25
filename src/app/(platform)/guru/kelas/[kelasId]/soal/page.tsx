"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const SoalListPage = () => {
  const params = useParams();
  const kelasId = params.kelasId;

  const [soalList] = useState([
    {
      id: "1",
      pertanyaan: "Berapa hasil dari 15 + 27?",
      topik: "Bilangan",
      tingkatKesulitan: "mudah",
      tipe: "pilihan-ganda",
      digunakan: 25,
    },
    {
      id: "2",
      pertanyaan: "Selesaikan: 48 ÷ 6 = ?",
      topik: "Bilangan",
      tingkatKesulitan: "sedang",
      tipe: "essay",
      digunakan: 18,
    },
  ]);

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Link href="/guru/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <span>/</span>
        <Link href={`/guru/kelas/${kelasId}`} className="hover:text-blue-600">Kelas</Link>
        <span>/</span>
        <span className="text-gray-900">Bank Soal</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bank Soal</h1>
          <p className="text-gray-600">Kelola soal untuk kuis dan latihan</p>
        </div>
        <Link href={`/guru/kelas/${kelasId}/soal/tambah`}>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Soal
          </button>
        </Link>
      </div>

      {/* Soal List */}
      <div className="space-y-4">
        {soalList.map((soal) => (
          <div key={soal.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{soal.pertanyaan}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Topik: {soal.topik}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    soal.tingkatKesulitan === 'mudah' ? 'bg-green-100 text-green-600' :
                    soal.tingkatKesulitan === 'sedang' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {soal.tingkatKesulitan.charAt(0).toUpperCase() + soal.tingkatKesulitan.slice(1)}
                  </span>
                  <span>{soal.digunakan} siswa mengerjakan</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/guru/kelas/${kelasId}/soal/${soal.id}`}>
                  <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">Lihat</button>
                </Link>
                <Link href={`/guru/kelas/${kelasId}/soal/${soal.id}/edit`}>
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Edit</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoalListPage;
