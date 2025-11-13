"use client";

import React, { useState } from "react";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDeleteMateri, useSubMateriList } from "@/hooks/guru/useMateri";
import Swal from "sweetalert2";
import MateriPreviewModal from "./MateriPreviewModal";

interface MateriCardProps {
  id: string;
  kelasId: string;
  judul_materi: string;
  deskripsi: string | null;
  jumlah_sub_materi: number;
  created_at: string;
}

const MateriCard: React.FC<MateriCardProps> = ({
  id,
  kelasId,
  judul_materi,
  deskripsi,
  jumlah_sub_materi,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const { mutateAsync: deleteMateri, isPending: isDeleting } =
    useDeleteMateri();

  // Fetch sub materi for preview
  const { data: subMateriData, isLoading: isLoadingSubMateri } =
    useSubMateriList(id);

  const handleCardClick = () => {
    setShowPreview(true);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Konfirmasi Hapus",
      text: "Apakah Anda yakin ingin menghapus materi ini?",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteMateri(id);

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Materi berhasil dihapus!",
        confirmButtonColor: "#336d82",
        timer: 2000,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";

      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: `❌ Gagal menghapus materi: ${message}`,
        confirmButtonColor: "#336d82",
      });
    }
  };

  return (
    <>
      <div
        className="relative bg-gradient-to-r from-[#336D82] to-[#ECF3F6] rounded-[12px] sm:rounded-[16px] md:rounded-[18px] min-h-[140px] sm:min-h-[160px] flex flex-col justify-between p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Judul Materi */}
        <div className="mb-3">
          <h2 className="text-white text-3xl poppins-semibold mb-1.5 leading-tight">
            {judul_materi}
          </h2>
          <p className="text-white/90 text-sm poppins-regular">
            {deskripsi || "Tidak ada deskripsi"}
          </p>
          <p className="text-white/70 text-xs poppins-regular mt-2">
            {jumlah_sub_materi} Sub Materi
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 self-end" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleCardClick}
            className="bg-[#4A8BA6] text-white px-4 py-2 rounded-[15px] flex items-center gap-2 hover:bg-[#3d7489] transition-all hover:shadow-lg h-[44px]"
          >
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
              <VisibilityIcon className="text-white" sx={{ fontSize: 16 }} />
            </div>
            <span className="text-xs sm:text-sm poppins-semibold">
              Lihat Preview
            </span>
          </button>
          <Link href={`/guru/kelas/${kelasId}/materi/edit?id=${id}`}>
            <button className="bg-[#336d82] text-white px-4 py-2 rounded-[15px] flex items-center gap-2 hover:bg-[#2a5a6a] transition-all hover:shadow-lg h-[44px]">
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                <EditIcon className="text-white" sx={{ fontSize: 16 }} />
              </div>
              <span className="text-xs sm:text-sm poppins-semibold">
                Kelola materi pembelajaran
              </span>
            </button>
          </Link>
          <Link href={`/guru/kelas/${kelasId}/materi/${id}/kelola-kuis`}>
            <button className="bg-[#336d82] text-white px-4 py-2 rounded-[15px] flex items-center gap-2 hover:bg-[#2a5a6a] transition-all hover:shadow-lg h-[44px]">
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                <EditIcon className="text-white" sx={{ fontSize: 16 }} />
              </div>
              <span className="text-xs sm:text-sm poppins-semibold">
                Kelola Kuis
              </span>
            </button>
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-[#d9534f] text-white px-4 py-2 rounded-[15px] flex items-center gap-2 hover:bg-[#c3423d] transition-all hover:shadow-lg h-[44px] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
              <DeleteIcon className="text-white" sx={{ fontSize: 16 }} />
            </div>
            <span className="text-sm poppins-semibold">
              {isDeleting ? "Menghapus..." : "Hapus Materi"}
            </span>
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      <MateriPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        judul={judul_materi}
        deskripsi={deskripsi}
        subMateri={subMateriData || []}
        isLoading={isLoadingSubMateri}
      />
    </>
  );
};

export default MateriCard;
