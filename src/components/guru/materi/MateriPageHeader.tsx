"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowBackIos } from "@mui/icons-material";

interface MateriPageHeaderProps {
  kelasId: string;
  title: string;
  onBack?: () => void;
}

export default function MateriPageHeader({
  kelasId,
  title,
  onBack,
}: MateriPageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push(`/guru/kelas/${kelasId}/materi`);
    }
  };

  return (
    <div className="mx-auto mb-6 max-w-4xl">
      <div className="bg-gradient-to-r from-[#336d82] to-[#2a5a6d] text-white rounded-2xl flex items-center px-6 py-4 gap-4 shadow-xl hover:shadow-2xl transition-shadow">
        <button
          onClick={handleBack}
          className="w-[45px] h-[45px] bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 flex-shrink-0 shadow-md"
          aria-label="Kembali"
        >
          <ArrowBackIos sx={{ fontSize: 18, color: "#336d82", ml: 0.5 }} />
        </button>
        <h1 className="text-[20px] md:text-[24px] font-bold text-center flex-1 font-poppins tracking-wide">
          {title}
        </h1>
      </div>
    </div>
  );
}
