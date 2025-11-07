"use client";

import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import type { Kuis } from "@/lib/api/kuis";

interface KuisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { judul: string; jumlah_soal: number }) => Promise<void>;
  kuis?: Kuis | null;
  materiId: string;
  materiNama: string;
}

const KuisModal: React.FC<KuisModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  kuis,
  materiNama,
}) => {
  const [judul, setJudul] = useState("");
  const [jumlahSoal, setJumlahSoal] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    judul?: string;
    jumlah_soal?: string;
  }>({});

  // Reset form saat modal dibuka/ditutup atau kuis berubah
  useEffect(() => {
    if (isOpen) {
      if (kuis) {
        // Edit mode
        setJudul(kuis.judul);
        setJumlahSoal(kuis.jumlah_soal);
      } else {
        // Create mode
        setJudul("");
        setJumlahSoal(10);
      }
      setErrors({});
    }
  }, [isOpen, kuis]);

  // Validasi form
  const validate = (): boolean => {
    const newErrors: { judul?: string; jumlah_soal?: string } = {};

    if (!judul.trim()) {
      newErrors.judul = "Judul kuis wajib diisi";
    } else if (judul.length < 3) {
      newErrors.judul = "Judul minimal 3 karakter";
    }

    if (!jumlahSoal || jumlahSoal < 1) {
      newErrors.jumlah_soal = "Jumlah soal minimal 1";
    } else if (jumlahSoal > 50) {
      newErrors.jumlah_soal = "Jumlah soal maksimal 50";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        judul: judul.trim(),
        jumlah_soal: jumlahSoal,
      });

      onClose();
    } catch (error) {
      console.error("Error submitting kuis:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#336D82] to-[#4A8BA0] p-5 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-xl poppins-semibold text-white">
              {kuis ? "Edit Kuis" : "Buat Kuis Baru"}
            </h2>
            <p className="text-sm poppins-regular text-white/80 mt-1">
              {materiNama}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm poppins-regular text-blue-800">
              ℹ️ Soal akan diambil otomatis dari bank soal materi ini sesuai
              dengan jumlah yang Anda tentukan.
            </p>
          </div>

          {/* Judul Kuis */}
          <div>
            <label
              htmlFor="judul"
              className="block text-sm poppins-medium text-gray-700 mb-2"
            >
              Judul Kuis <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="judul"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Kuis Matematika Bab 1"
              className={`w-full px-4 py-3 border rounded-lg poppins-regular text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#336D82] transition-all ${errors.judul
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
                }`}
            />
            {errors.judul && (
              <p className="text-red-500 text-xs poppins-regular mt-1">
                {errors.judul}
              </p>
            )}
          </div>

          {/* Jumlah Soal */}
          <div>
            <label
              htmlFor="jumlah_soal"
              className="block text-sm poppins-medium text-gray-700 mb-2"
            >
              Jumlah Soal <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setJumlahSoal((prev) => Math.max(1, prev - 1))
                }
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center text-xl poppins-semibold text-gray-700 transition-colors"
              >
                −
              </button>
              <input
                type="number"
                id="jumlah_soal"
                value={jumlahSoal}
                onChange={(e) => setJumlahSoal(parseInt(e.target.value) || 0)}
                min="1"
                max="50"
                className={`flex-1 px-4 py-3 border rounded-lg poppins-medium text-black text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#336D82] transition-all ${errors.jumlah_soal
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                  }`}
              />
              <button
                type="button"
                onClick={() =>
                  setJumlahSoal((prev) => Math.min(50, prev + 1))
                }
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center text-xl poppins-semibold text-gray-700 transition-colors"
              >
                +
              </button>
            </div>
            {errors.jumlah_soal && (
              <p className="text-red-500 text-xs poppins-regular mt-1">
                {errors.jumlah_soal}
              </p>
            )}
            <p className="text-xs poppins-regular text-gray-500 mt-2">
              Range: 1 - 50 soal
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg poppins-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#336D82] to-[#4A8BA0] text-white rounded-lg poppins-medium hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <SaveIcon sx={{ fontSize: 20 }} />
              {isSubmitting
                ? "Menyimpan..."
                : kuis
                  ? "Update Kuis"
                  : "Buat Kuis"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KuisModal;
