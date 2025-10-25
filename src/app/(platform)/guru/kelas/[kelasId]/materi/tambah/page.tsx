"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const TambahMateriPage = () => {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.kelasId;

  const [formData, setFormData] = useState({
    judul: "",
    topik: "",
    deskripsi: "",
    konten: "",
    status: "draft",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Kirim data ke API
    console.log("Form data:", formData);
    // Redirect ke list materi
    router.push(`/guru/kelas/${kelasId}/materi`);
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
        <span className="text-gray-900">Tambah Materi</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tambah Materi Baru
        </h1>
        <p className="text-gray-600">
          Buat materi pembelajaran baru untuk kelas ini
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Informasi Materi
          </h2>

          <div className="space-y-6">
            {/* Judul */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Materi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.judul}
                onChange={(e) =>
                  setFormData({ ...formData, judul: e.target.value })
                }
                placeholder="Contoh: Penjumlahan dan Pengurangan"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Topik */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topik <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.topik}
                onChange={(e) =>
                  setFormData({ ...formData, topik: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Topik</option>
                <option value="bilangan">Bilangan</option>
                <option value="geometri">Geometri</option>
                <option value="aljabar">Aljabar</option>
                <option value="statistika">Statistika</option>
                <option value="pengukuran">Pengukuran</option>
              </select>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Singkat
              </label>
              <textarea
                value={formData.deskripsi}
                onChange={(e) =>
                  setFormData({ ...formData, deskripsi: e.target.value })
                }
                placeholder="Jelaskan secara singkat tentang materi ini..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Konten */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konten Materi <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.konten}
                onChange={(e) =>
                  setFormData({ ...formData, konten: e.target.value })
                }
                placeholder="Tulis konten materi pembelajaran di sini..."
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <p className="mt-2 text-sm text-gray-500">
                Tips: Gunakan format markdown untuk formatting teks
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Publikasikan</option>
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Draft hanya bisa dilihat oleh Anda, materi yang dipublikasikan
                akan terlihat oleh siswa
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href={`/guru/kelas/${kelasId}/materi`}>
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
          </Link>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Simpan Materi
          </button>
        </div>
      </form>
    </div>
  );
};

export default TambahMateriPage;
