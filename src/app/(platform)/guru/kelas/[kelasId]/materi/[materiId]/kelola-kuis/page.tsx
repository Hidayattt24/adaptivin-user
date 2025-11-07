"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KuisCard from "@/components/guru/kuis/KuisCard";
import KuisModal from "@/components/guru/kuis/KuisModal";
import {
  useKuisByMateri,
  useCreateKuis,
  useUpdateKuis,
} from "@/hooks/guru/useKuis";
import type { Kuis } from "@/lib/api/kuis";
import { isAxiosError } from "axios";
import Swal from "sweetalert2";

export default function KelolaKuisPage() {
  const params = useParams();
  const router = useRouter();
  const materiId = params.materiId as string;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKuis, setSelectedKuis] = useState<Kuis | null>(null);

  // React Query hooks - mengambil kuis berdasarkan materi (max 1 kuis per materi)
  const { data: existingKuis, isLoading, error } = useKuisByMateri(materiId);
  const { mutateAsync: createKuis } = useCreateKuis();
  const { mutateAsync: updateKuis } = useUpdateKuis();

  // Handle create/edit kuis
  const handleOpenModal = () => {
    // Jika sudah ada kuis, set sebagai selected untuk edit
    if (existingKuis) {
      setSelectedKuis(existingKuis);
    } else {
      setSelectedKuis(null);
    }
    setIsModalOpen(true);
  };

  // Handle submit (create or update)
  const handleSubmit = async (data: {
    judul: string;
    jumlah_soal: number;
  }) => {
    try {
      if (selectedKuis) {
        // Update existing kuis
        await updateKuis({
          kuisId: selectedKuis.id,
          payload: data,
        });

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Kuis berhasil diperbarui",
          confirmButtonColor: "#336D82",
        });
      } else {
        // Create new kuis
        await createKuis({
          materi_id: materiId,
          judul: data.judul,
          jumlah_soal: data.jumlah_soal,
        });

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Kuis berhasil dibuat",
          confirmButtonColor: "#336D82",
        });
      }
    } catch (error: unknown) {
      console.error("Error submitting kuis:", error);

      const errorMessage = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan saat menyimpan kuis"
        : error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan kuis";

      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: errorMessage,
        confirmButtonColor: "#336D82",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-6 space-y-4">
            <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 space-y-4 animate-pulse"
              >
                <div className="h-12 w-12 bg-gray-300 rounded-lg"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-300 rounded flex-1"></div>
                  <div className="h-10 bg-gray-300 rounded flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl poppins-semibold text-gray-800 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 poppins-regular mb-6">
            {error instanceof Error
              ? error.message
              : "Gagal memuat data kuis"}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-r from-[#336D82] to-[#4A8BA0] text-white rounded-lg poppins-medium hover:shadow-lg transition-all"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // Get materi name
  const materiNama = existingKuis?.materi?.judul_materi || "Materi";
  const hasKuis = !!existingKuis;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#336D82] hover:text-[#4A8BA0] poppins-medium mb-4 transition-colors"
          >
            <ArrowBackIcon />
            Kembali
          </button>

          <div className="flex flex-col items-start justify-start">
            <h1 className="text-3xl poppins-bold text-gray-800">
              Kelola Kuis
            </h1>
            <p className="text-gray-600 poppins-regular mt-1">
              {materiNama}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              📌 Setiap materi hanya dapat memiliki 1 kuis
            </p>
          </div>
        </div>

        {/* Kuis Display */}
        {hasKuis ? (
          <div className="w-full mx-auto">
            <KuisCard kuis={existingKuis} onEdit={handleOpenModal} />
          </div>
        ) : (
          // Empty State
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-8xl mb-4">📝</div>
            <h2 className="text-2xl poppins-semibold text-gray-800 mb-2">
              Belum Ada Kuis
            </h2>
            <p className="text-gray-600 poppins-regular mb-2">
              Buat kuis untuk materi ini dengan klik tombol di bawah ini.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Setiap materi hanya dapat memiliki 1 kuis. Anda dapat mengedit
              jumlah soal kapan saja.
            </p>
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#336D82] to-[#4A8BA0] text-white rounded-lg poppins-medium hover:shadow-lg transition-all"
            >
              <AddIcon />
              Buat Kuis
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <KuisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        kuis={selectedKuis}
        materiId={materiId}
        materiNama={materiNama}
      />
    </div>
  );
}
