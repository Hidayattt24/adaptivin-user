"use client";

import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QuizIcon from "@mui/icons-material/Quiz";
import { useDeleteKuis } from "@/hooks/guru/useKuis";
import Swal from "sweetalert2";
import type { Kuis } from "@/lib/api/kuis";

interface KuisCardProps {
  kuis: Kuis;
  onEdit: (kuis: Kuis) => void;
}

const KuisCard: React.FC<KuisCardProps> = ({ kuis, onEdit }) => {
  const { mutateAsync: deleteKuis, isPending: isDeleting } = useDeleteKuis();

  const handleDelete = async () => {
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

    try {
      await deleteKuis(kuis.id);

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kuis berhasil dihapus!",
        confirmButtonColor: "#336d82",
        timer: 2000,
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
        <div className="grid grid-cols-2 gap-3 text-sm">
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
