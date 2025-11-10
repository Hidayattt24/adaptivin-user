"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QuizIcon from "@mui/icons-material/Quiz";
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
  const kelasId = params.kelasId as string;

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
  const handleSubmit = async (data: { judul: string; jumlah_soal: number }) => {
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
      <div className="pb-12 sm:pb-16 md:pb-20">
        {/* Header Skeleton */}
        <div className="mb-6 sm:mb-7 md:mb-8">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
          <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
        </div>

        {/* Card Skeleton */}
        <div className="bg-white rounded-[12px] sm:rounded-[16px] border border-gray-200 p-5 animate-pulse">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
              <div>
                <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
          <div className="mb-4 py-3 px-4 bg-gray-50 rounded-lg">
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
            <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pb-12 sm:pb-16 md:pb-20">
        <div className="bg-white rounded-[12px] sm:rounded-[16px] border border-red-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-xl sm:text-2xl poppins-semibold text-gray-800 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 poppins-regular mb-6">
            {error instanceof Error ? error.message : "Gagal memuat data kuis"}
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#336d82] text-white rounded-lg poppins-medium hover:bg-[#2a5a6a] transition-all"
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
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
    <div className="pb-12 sm:pb-16 md:pb-20">
      {/* Back Button */}
      <div className="mb-4 sm:mb-5">
        <button
          onClick={() => router.push(`/guru/kelas/${kelasId}/materi`)}
          className="inline-flex items-center gap-2 text-[#336d82] hover:text-[#2a5a6a] poppins-medium transition-colors text-sm sm:text-base"
        >
          <ArrowBackIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          Kembali ke Daftar Materi
        </button>
      </div>

      {/* Header */}
      <div className="mb-6 sm:mb-7 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl poppins-bold text-gray-800 mb-2">
              Kelola Kuis
            </h1>
            <p className="text-gray-600 poppins-regular text-sm sm:text-base">
              {materiNama}
            </p>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
              <QuizIcon sx={{ fontSize: 16, color: "#336d82" }} />
              <p className="text-xs sm:text-sm text-[#336d82] poppins-medium">
                Setiap materi hanya dapat memiliki 1 kuis
              </p>
            </div>
          </div>

          {/* Create Button - Only show if no kuis exists */}
          {!hasKuis && (
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#336d82] text-white rounded-lg poppins-medium hover:bg-[#2a5a6a] transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <AddIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              Buat Kuis
            </button>
          )}
        </div>
      </div>

      {/* Kuis Display */}
      {hasKuis ? (
        <div className="max-w-2xl">
          <KuisCard kuis={existingKuis} onEdit={handleOpenModal} />
        </div>
      ) : (
        // Empty State
        <div className="bg-white rounded-[12px] sm:rounded-[16px] border-2 border-dashed border-gray-300 p-8 sm:p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <QuizIcon sx={{ fontSize: 48, color: "#9ca3af" }} />
          </div>
          <h2 className="text-xl sm:text-2xl poppins-semibold text-gray-800 mb-2">
            Belum Ada Kuis
          </h2>
          <p className="text-gray-600 poppins-regular mb-2 text-sm sm:text-base max-w-md mx-auto">
            Buat kuis untuk materi ini dengan klik tombol &quot;Buat Kuis&quot;
            di atas.
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            Anda dapat mengedit judul dan jumlah soal kapan saja.
          </p>
        </div>
      )}

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
