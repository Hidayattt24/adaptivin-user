"use client";

import { useState } from "react";

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Answer Input Component
 *
 * Input field modern dan menarik untuk anak SD:
 * - Colorful design dengan gradient
 * - Icon yang fun
 * - Animasi saat focus
 * - Hanya accept angka
 */
export default function AnswerInput({ value, onChange }: AnswerInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Only allow numbers
    if (newValue === "" || /^\d+$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Fun Header - More Visible */}
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-[15px] px-4 py-3 shadow-md">
        <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#FFA07A] flex items-center justify-center shadow-lg animate-bounce-slow">
          <span className="material-symbols-outlined text-white text-[22px]">
            lightbulb
          </span>
        </div>
        <p className="text-[#336D82] text-[15px] font-bold drop-shadow-sm">
          Tulis Jawabanmu Disini!
        </p>
      </div>

      {/* Input Container */}
      <div
        className={`relative bg-white rounded-[20px] overflow-hidden transition-all duration-300 ${
          isFocused
            ? "shadow-2xl scale-[1.02]"
            : "shadow-lg"
        }`}
      >
        {/* Colorful Top Border - Static, no change on focus */}
        <div className="h-[4px] bg-gradient-to-r from-[#FF6B9D] via-[#FFD93D] to-[#4ECDC4]" />

        {/* Input Field */}
        <div className="p-5">
          <div className="flex items-center gap-3">
            {/* Pencil Icon - Full Rounded Circle */}
            <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-[#336D82] to-[#4A8FA5] flex items-center justify-center shadow-md flex-shrink-0">
              <span className="material-symbols-outlined text-white text-[26px]">
                stylus
              </span>
            </div>

            {/* Input */}
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ketik angka..."
              className="flex-1 text-[#336D82] text-[32px] font-bold focus:outline-none bg-transparent placeholder:text-[#B8D8E0] placeholder:text-[20px]"
            />

            {/* Success Indicator - Fixed Circle Design */}
            {value && (
              <div className="w-[50px] h-[50px] rounded-full bg-[#2EA062] flex items-center justify-center shadow-md flex-shrink-0 animate-scale-in">
                <span className="material-symbols-outlined text-white text-[28px] font-bold">
                  check
                </span>
              </div>
            )}
          </div>

          {/* Helper Text */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#FFD93D] to-transparent" />
            <p className="text-[#7BACC4] text-[10px] italic font-medium">
              {value
                ? `Jawabanmu: ${value} 🎯`
                : "Hanya bisa ketik angka yaa... ✏️"}
            </p>
            <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#FFD93D] to-transparent" />
          </div>
        </div>
      </div>

      {/* Fun Encouragement */}
      {value && (
        <div className="flex items-center justify-center gap-2 animate-fade-in">
          <span className="text-[16px]">⭐</span>
          <p className="text-[#2EA062] text-[12px] font-bold">
            Keren! Sekarang geser tombol di bawah yaa!
          </p>
          <span className="text-[16px]">⭐</span>
        </div>
      )}
    </div>
  );
}
