"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const PreviewSoalPage = () => {
  const params = useParams();
  const kelasId = params.kelasId;
  const soalId = params.soalId;

  const soalData = {
    id: soalId,
    pertanyaan: "Berapa hasil dari 15 + 27?",
    topik: "Bilangan",
    tingkatKesulitan: "mudah",
    tipe: "pilihan-ganda",
    jawaban: "42",
    digunakan: 25,
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Link href="/guru/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <span>/</span>
        <Link href={`/guru/kelas/${kelasId}`} className="hover:text-blue-600">Kelas</Link>
        <span>/</span>
        <Link href={`/guru/kelas/${kelasId}/soal`} className="hover:text-blue-600">Bank Soal</Link>
        <span>/</span>
        <span className="text-gray-900">Preview Soal</span>
      </div>

      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Preview Soal</h1>
        <div className="flex gap-2">
          <Link href={`/guru/kelas/${kelasId}/soal/${soalId}/edit`}>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">Edit Soal</button>
          </Link>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg">Hapus</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{soalData.pertanyaan}</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Topik: {soalData.topik}</p>
          <p>Tingkat Kesulitan: {soalData.tingkatKesulitan}</p>
          <p>Tipe: {soalData.tipe}</p>
          <p>Jawaban: {soalData.jawaban}</p>
          <p>Digunakan oleh: {soalData.digunakan} siswa</p>
        </div>
      </div>
    </div>
  );
};

export default PreviewSoalPage;
