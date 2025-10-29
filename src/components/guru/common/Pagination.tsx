"use client";

import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className="w-[28px] h-[28px] bg-[#336d82] rounded-[10px] flex items-center justify-center hover:bg-[#2a5a6a] transition-colors"
        >
          <span className="text-white text-[10px] poppins-semibold">{i}</span>
        </button>
      );
    }
    return pages;
  };

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      {/* Back Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
      >
        <ArrowBackIosIcon
          className="text-[#336d82]"
          sx={{ fontSize: 13 }}
        />
        <span className="text-[#336d82] text-[13px] poppins-semibold">
          Kembali
        </span>
      </button>

      {/* Page Numbers */}
      <div className="flex gap-2">{renderPageNumbers()}</div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
      >
        <span className="text-[#336d82] text-[13px] poppins-semibold">
          Lanjut
        </span>
        <ArrowForwardIosIcon
          className="text-[#336d82]"
          sx={{ fontSize: 13 }}
        />
      </button>
    </div>
  );
};

export default Pagination;
