"use client";

import React from "react";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";

interface MateriCardProps {
  id: string;
  kelasId: string;
  judul: string;
  deskripsi: string;
  topik: string;
  status: "published" | "draft";
  jumlahSiswaSelesai: number;
  totalSiswa: number;
  onKelolaMaterial?: () => void;
  onKelolaKuis?: () => void;
}

const MateriCard: React.FC<MateriCardProps> = ({
  id,
  kelasId,
  judul,
  deskripsi,
  topik,
  status,
  jumlahSiswaSelesai,
  totalSiswa,
  onKelolaMaterial,
  onKelolaKuis,
}) => {
  return (
    <div className="relative bg-gradient-to-r from-[#336D82] to-[#ECF3F6] rounded-[18px] min-h-[160px] flex flex-col justify-between p-5 shadow-lg hover:shadow-xl transition-shadow">
      {/* Judul Materi */}
      <div className="mb-3">
        <h2 className="text-white text-3xl poppins-semibold mb-1.5 leading-tight">
          {judul}
        </h2>
        <p className="text-white/90 text-sm poppins-regular">{deskripsi}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 self-end">
        <Link href={`/guru/kelas/${kelasId}/materi/edit?id=${id}`}>
          <button
            onClick={onKelolaMaterial}
            className="bg-[#336d82] text-white px-4 py-2 rounded-[15px] flex items-center gap-2 hover:bg-[#2a5a6a] transition-all hover:shadow-lg h-[44px]"
          >
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
              <AddIcon className="text-white" sx={{ fontSize: 16 }} />
            </div>
            <span className="text-sm poppins-semibold">
              Kelola materi pembelajaran
            </span>
          </button>
        </Link>
        <Link href={`/guru/kelas/${kelasId}/materi/${id}/edit-kuis`}>
          <button
            onClick={onKelolaKuis}
            className="bg-[#336d82] text-white px-4 py-2 rounded-[15px] flex items-center gap-2 hover:bg-[#2a5a6a] transition-all hover:shadow-lg h-[44px]"
          >
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
              <AddIcon className="text-white" sx={{ fontSize: 16 }} />
            </div>
            <span className="text-sm poppins-semibold">Kelola Kuis</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MateriCard;
