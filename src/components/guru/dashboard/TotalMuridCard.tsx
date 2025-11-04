"use client";

import React from "react";

interface TotalMuridCardProps {
  jumlahSiswa: number;
  className?: string;
}

const TotalMuridCard: React.FC<TotalMuridCardProps> = ({
  jumlahSiswa,
  className = "",
}) => {
  return (
    <div
      className={`bg-[#336d82] rounded-xl sm:rounded-2xl md:rounded-[20px] h-[120px] sm:h-[150px] lg:h-[183px] flex items-center justify-between px-4 sm:px-5 lg:px-8 shadow-lg hover:shadow-xl transition-shadow ${className}`}
    >
      <h3 className="text-white text-4xl poppins-semibold leading-tight">
        TOTAL
        <br />
        SISWA
      </h3>
      <p className="text-white text-8xl poppins-semibold leading-none">
        {jumlahSiswa}
      </p>
    </div>
  );
};

export default TotalMuridCard;
