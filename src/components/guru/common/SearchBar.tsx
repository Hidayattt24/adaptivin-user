"use client";

import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import NorthEastIcon from "@mui/icons-material/NorthEast";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Cari...",
  className = "",
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-4">
        <div className="flex-1 bg-white border-[3px] sm:border-[3px] lg:border-[5px] border-[#336d82] rounded-[12px] sm:rounded-[14px] lg:rounded-[20px] h-[56px] sm:h-[58px] lg:h-[72px] flex items-center px-3 sm:px-3.5 lg:px-6 gap-2 sm:gap-2.5 lg:gap-4 shadow-md">
          <div className="w-[40px] h-[40px] sm:w-[42px] sm:h-[42px] lg:w-[54px] lg:h-[54px] bg-[#5a96a8] rounded-full flex items-center justify-center flex-shrink-0">
            <SearchIcon className="text-white" sx={{ fontSize: { xs: 18, sm: 18, lg: 24 } }} />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 text-[#336d82] text-sm sm:text-sm lg:text-base poppins-semibold-italic placeholder:text-[#336d82]/70 placeholder:poppins-semibold-italic focus:outline-none bg-transparent"
          />
        </div>
        <button
          type="submit"
          className="w-[56px] h-[56px] sm:w-[58px] sm:h-[58px] lg:w-[74px] lg:h-[74px] bg-[#5a96a8] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#4a8698] active:bg-[#3a7688] transition-all hover:shadow-lg shadow-md"
        >
          <NorthEastIcon className="text-white" sx={{ fontSize: { xs: 20, sm: 22, lg: 28 } }} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
