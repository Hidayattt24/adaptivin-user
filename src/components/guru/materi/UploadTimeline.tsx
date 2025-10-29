"use client";

import React from "react";
import { CollectionsBookmark, Autorenew } from "@mui/icons-material";

interface UploadTimelineProps {
  currentStep: 1 | 2;
}

export function UploadTimeline({ currentStep }: UploadTimelineProps) {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 max-w-4xl mx-auto">
      {/* Step 1 */}
      <div className="flex flex-col items-center gap-2">
        <div
          className={`w-[60px] h-[60px] md:w-[65px] md:h-[65px] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            currentStep === 1
              ? "bg-gradient-to-br from-[#fcc61d] to-[#f5b800] text-white scale-110 shadow-[#fcc61d]/50"
              : currentStep === 2
              ? "bg-gradient-to-br from-[#336d82] to-[#2a5a6d] text-white shadow-[#336d82]/30"
              : "bg-white text-gray-400 border-2 border-gray-200"
          }`}
        >
          <CollectionsBookmark sx={{ fontSize: { xs: 26, md: 30 } }} />
        </div>
        <span
          className={`text-[14px] md:text-[16px] font-semibold font-poppins ${
            currentStep === 1 ? "text-[#fcc61d]" : "text-gray-500"
          }`}
        >
          Isi Materi
        </span>
      </div>

      {/* Connector Line - Animated with Gradient */}
      <div className="relative w-[100px] md:w-[140px] h-[4px] bg-gray-200 -mt-8 rounded-full overflow-hidden shadow-inner">
        <div
          className={`absolute h-full bg-gradient-to-r from-[#336d82] to-[#2a5a6d] transition-all duration-700 ease-in-out ${
            currentStep === 2 ? "w-full" : "w-0"
          }`}
        />
      </div>

      {/* Step 2 */}
      <div className="flex flex-col items-center gap-2">
        <div
          className={`w-[60px] h-[60px] md:w-[65px] md:h-[65px] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            currentStep === 2
              ? "bg-gradient-to-br from-[#fcc61d] to-[#f5b800] text-white scale-110 shadow-[#fcc61d]/50"
              : "bg-white text-gray-400 border-2 border-gray-200"
          }`}
        >
          <Autorenew sx={{ fontSize: { xs: 26, md: 30 } }} />
        </div>
        <span
          className={`text-[14px] md:text-[16px] font-semibold font-poppins ${
            currentStep === 2 ? "text-[#fcc61d]" : "text-gray-500"
          }`}
        >
          Tinjau Materi
        </span>
      </div>
    </div>
  );
}
