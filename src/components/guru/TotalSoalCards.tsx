"use client";

import React from "react";

interface TotalSoalCardsProps {
  totalSoal: number;
  totalC1: number;
  totalC2: number;
  className?: string;
}

const TotalSoalCards: React.FC<TotalSoalCardsProps> = ({
  totalSoal,
  totalC1,
  totalC2,
  className = "",
}) => {
  return (
    <div className={`flex gap-6 ${className}`}>
      {/* Total Soal Card */}
      <div className="bg-[#336d82] rounded-[20px] h-[183px] flex-1 flex flex-col items-center justify-center px-8 shadow-lg">
        <h3 className="text-white text-4xl poppins-semibold mb-2 text-center leading-tight">
          TOTAL SOAL
        </h3>
        <p className="text-white text-8xl poppins-semibold leading-none">
          {totalSoal}
        </p>
      </div>

      {/* Total C1 Card */}
      <div className="bg-[#336d82] rounded-[20px] h-[183px] flex-1 flex flex-col items-center justify-center px-8 shadow-lg">
        <h3 className="text-white text-4xl poppins-semibold mb-2 text-center leading-tight">
          TOTAL C1
        </h3>
        <p className="text-white text-8xl poppins-semibold leading-none">
          {totalC1}
        </p>
      </div>

      {/* Total C2 Card */}
      <div className="bg-[#336d82] rounded-[20px] h-[183px] flex-1 flex flex-col items-center justify-center px-8 shadow-lg">
        <h3 className="text-white text-4xl poppins-semibold mb-2 text-center leading-tight">
          TOTAL C2
        </h3>
        <p className="text-white text-8xl poppins-semibold leading-none">
          {totalC2}
        </p>
      </div>
    </div>
  );
};

export default TotalSoalCards;
