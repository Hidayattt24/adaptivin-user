"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowDropDown } from "@mui/icons-material";

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  leftIcon?: React.ReactNode;
  placeholder?: string;
  className?: string;
}

export default function CustomDropdown({
  value,
  options,
  onChange,
  leftIcon,
  placeholder = "Pilih...",
  className = "",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/95 backdrop-blur-sm rounded-2xl h-[63px] w-full flex items-center justify-between px-6 shadow-lg hover:shadow-xl transition-all border-2 border-white/30 hover:border-white"
      >
        <div className="flex items-center gap-3">
          {leftIcon && <div className="flex-shrink-0">{leftIcon}</div>}
          <span className="text-[#336d82] text-lg poppins-semibold">
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <ArrowDropDown
          className="text-[#336d82] flex-shrink-0"
          sx={{ fontSize: 32 }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border-2 border-[#336d82] max-h-[300px] overflow-y-auto z-50">
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-6 py-4 text-left hover:bg-[#336d82]/10 transition-colors ${
                index === 0 ? "rounded-t-2xl" : ""
              } ${index === options.length - 1 ? "rounded-b-2xl" : ""} ${
                value === option.value
                  ? "bg-[#336d82]/20 text-[#336d82] poppins-semibold"
                  : "text-gray-700 poppins-medium"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
