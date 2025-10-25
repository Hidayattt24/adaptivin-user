"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const TambahSoalPage = () => {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.kelasId;

  const [formData, setFormData] = useState({
    pertanyaan: "",
    topik: "",
    tingkatKesulitan: "",
    tipe: "pilihan-ganda",
    jawaban: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    router.push(`/guru/kelas/${kelasId}/soal`);
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
        <span className="text-gray-900">Tambah Soal</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tambah Soal Baru</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pertanyaan *</label>
            <textarea
              required
              value={formData.pertanyaan}
              onChange={(e) => setFormData({ ...formData, pertanyaan: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topik *</label>
              <select
                required
                value={formData.topik}
                onChange={(e) => setFormData({ ...formData, topik: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Topik</option>
                <option value="bilangan">Bilangan</option>
                <option value="geometri">Geometri</option>
                <option value="aljabar">Aljabar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tingkat Kesulitan *</label>
              <select
                required
                value={formData.tingkatKesulitan}
                onChange={(e) => setFormData({ ...formData, tingkatKesulitan: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Tingkat</option>
                <option value="mudah">Mudah</option>
                <option value="sedang">Sedang</option>
                <option value="sulit">Sulit</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link href={`/guru/kelas/${kelasId}/soal`}>
              <button type="button" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Batal
              </button>
            </Link>
            <button type="submit" className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
              Simpan Soal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TambahSoalPage;
