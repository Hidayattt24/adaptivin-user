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
      <div className="flex items-center gap-4">
        <div className="flex-1 bg-white border-[5px] border-[#336d82] rounded-[20px] h-[72px] flex items-center px-6 gap-4 shadow-md">
          <div className="w-[54px] h-[54px] bg-[#5a96a8] rounded-full flex items-center justify-center flex-shrink-0">
            <SearchIcon className="text-white" sx={{ fontSize: 24 }} />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 text-[#336d82] text-base poppins-semibold-italic placeholder:text-[#336d82]/70 placeholder:poppins-semibold-italic focus:outline-none bg-transparent"
          />
        </div>
        <button
          type="submit"
          className="w-[74px] h-[74px] bg-[#5a96a8] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#4a8698] transition-all hover:shadow-lg shadow-md"
        >
          <NorthEastIcon className="text-white" sx={{ fontSize: 28 }} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
