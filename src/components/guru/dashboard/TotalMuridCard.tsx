"use client";

import React from "react";

interface TotalMuridCardProps {
  total: number;
  className?: string;
}

const TotalMuridCard: React.FC<TotalMuridCardProps> = ({
  total,
  className = "",
}) => {
  return (
    <div
      className={`bg-[#336d82] rounded-xl sm:rounded-2xl md:rounded-[20px] h-[120px] sm:h-[150px] lg:h-[183px] flex items-center justify-between px-4 sm:px-5 lg:px-8 shadow-lg hover:shadow-xl transition-shadow ${className}`}
    >
      <h3 className="text-white text-xl sm:text-xl lg:text-3xl xl:text-4xl poppins-semibold leading-tight">
        TOTAL<br />MURID
      </h3>
      <p className="text-white text-5xl sm:text-5xl lg:text-7xl xl:text-8xl poppins-semibold leading-none">
        {total}
      </p>
    </div>
  );
};

export default TotalMuridCard;
