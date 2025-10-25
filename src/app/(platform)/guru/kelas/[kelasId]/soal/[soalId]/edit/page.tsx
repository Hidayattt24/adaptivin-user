"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const EditSoalPage = () => {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.kelasId;
  const soalId = params.soalId;

  const [formData, setFormData] = useState({
    pertanyaan: "Berapa hasil dari 15 + 27?",
    topik: "bilangan",
    tingkatKesulitan: "mudah",
    jawaban: "42",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    router.push(`/guru/kelas/${kelasId}/soal/${soalId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Soal</h1>

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

          <div className="flex justify-end gap-4">
            <Link href={`/guru/kelas/${kelasId}/soal/${soalId}`}>
              <button type="button" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Batal
              </button>
            </Link>
            <button type="submit" className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
              Simpan Perubahan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditSoalPage;
