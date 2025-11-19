"use client";

import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QuizIcon from "@mui/icons-material/Quiz";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDeleteKuis } from "@/hooks/guru/useKuis";
import { getKuisCompletionCount } from "@/lib/api/kuis";
import Swal from "sweetalert2";
import type { Kuis } from "@/lib/api/kuis";

interface KuisCardProps {
  kuis: Kuis;
  onEdit: (kuis: Kuis) => void;
}

const KuisCard: React.FC<KuisCardProps> = ({ kuis, onEdit }) => {
  const { mutateAsync: deleteKuis, isPending: isDeleting } = useDeleteKuis();
  const [completionStats, setCompletionStats] = useState<{
    total: number;
    completed: number;
    inProgress: number;
  }>({ total: 0, completed: 0, inProgress: 0 });

  useEffect(() => {
    const fetchCompletionStats = async () => {
      const stats = await getKuisCompletionCount(kuis.id);
      setCompletionStats(stats);
    };
    fetchCompletionStats();
  }, [kuis.id]);

  const handleDelete = async () => {
    // Check if there are any student results
    if (completionStats.total > 0) {
      const confirmResult = await Swal.fire({
        icon: "warning",
        title: "Perhatian!",
        html: `
          <div class="text-left">
            <p class="mb-3">Kuis ini sudah dikerjakan oleh <strong>${completionStats.total} siswa</strong>:</p>
            <ul class="list-disc pl-5 mb-3">
              <li>${completionStats.completed} siswa sudah selesai</li>
              <li>${completionStats.inProgress} siswa sedang mengerjakan</li>
            </ul>
            <p class="text-red-600 font-semibold">⚠️ Jika kuis dihapus, semua hasil kuis siswa akan ikut terhapus!</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, saya mengerti. Hapus!",
        cancelButtonText: "Batal",
      });

      if (!confirmResult.isConfirmed) return;
    } else {
      const result = await Swal.fire({
        icon: "warning",
        title: "Konfirmasi Hapus",
        text: `Apakah Anda yakin ingin menghapus kuis "${kuis.judul}"?`,
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
      });

      if (!result.isConfirmed) return;
    }

    try {
      await deleteKuis(kuis.id);

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kuis berhasil dihapus!",
        confirmButtonColor: "#336d82",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";

      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: `❌ Gagal menghapus kuis: ${message}`,
        confirmButtonColor: "#336d82",
      });
    }
  };

  return (
    <div className="bg-white rounded-[12px] sm:rounded-[16px] border border-gray-200 hover:shadow-lg transition-shadow p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#336D82] to-[#4A8BA0] rounded-xl flex items-center justify-center">
            <QuizIcon className="text-white" sx={{ fontSize: 24 }} />
          </div>
          <div>
            <h3 className="text-lg poppins-semibold text-gray-800">
              {kuis.judul}
            </h3>
            <p className="text-sm poppins-regular text-gray-500">
              {kuis.jumlah_soal} Soal
            </p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mb-4 py-3 px-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div>
            <p className="poppins-regular text-gray-500">Materi</p>
            <p className="poppins-medium text-gray-800">
              {kuis.materi?.judul_materi || "—"}
            </p>
          </div>
          <div>
            <p className="poppins-regular text-gray-500">Dibuat</p>
            <p className="poppins-medium text-gray-800">
              {new Date(kuis.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Completion Stats */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PeopleIcon sx={{ fontSize: 18, color: "#336d82" }} />
              <span className="poppins-semibold text-gray-700 text-sm">
                Pengerjaan Siswa:
              </span>
            </div>
            <span className="poppins-bold text-[#336d82] text-lg">
              {completionStats.total}
            </span>
          </div>
          {completionStats.total > 0 && (
            <div className="mt-2 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircleIcon sx={{ fontSize: 14, color: "#10b981" }} />
                <span className="poppins-medium text-gray-600">
                  {completionStats.completed} selesai
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="poppins-medium text-gray-600">
                  {completionStats.inProgress} progress
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(kuis)}
          className="flex-1 bg-[#336d82] text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#2a5a6a] transition-all text-sm poppins-medium"
        >
          <EditIcon sx={{ fontSize: 18 }} />
          Edit Kuis
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-[#d9534f] text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#c3423d] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm poppins-medium"
        >
          <DeleteIcon sx={{ fontSize: 18 }} />
          {isDeleting ? "..." : "Hapus"}
        </button>
      </div>
    </div>
  );
};

export default KuisCard;
