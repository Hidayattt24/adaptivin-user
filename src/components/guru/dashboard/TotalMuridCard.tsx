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
      className={`bg-[#336d82] rounded-[20px] h-[183px] flex items-center justify-between px-8 shadow-lg ${className}`}
    >
      <h3 className="text-white text-4xl poppins-semibold leading-tight">
        TOTAL<br />MURID
      </h3>
      <p className="text-white text-8xl poppins-semibold leading-none">
        {total}
      </p>
    </div>
  );
};

export default TotalMuridCard;
