"use client";

import { JawabanSoal } from "@/lib/api/kuis";
import AnswerInput from "./AnswerInput";
import ChecklistIcon from "@mui/icons-material/Checklist";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

interface DynamicAnswerInputProps {
  tipeJawaban: "pilihan_ganda" | "pilihan_ganda_kompleks" | "isian_singkat";
  jawaban: JawabanSoal[];
  selectedAnswers: string[];
  userAnswer: string;
  onSelectAnswer: (answerId: string) => void;
  onChangeUserAnswer: (value: string) => void;
}

/**
 * Dynamic Answer Input Component
 *
 * Komponen yang menampilkan input berbeda berdasarkan tipe jawaban:
 * - pilihan_ganda: Radio buttons (pilih 1)
 * - pilihan_ganda_kompleks: Checkboxes (pilih banyak)
 * - isian_singkat: Text input untuk angka
 */
export default function DynamicAnswerInput({
  tipeJawaban,
  jawaban,
  selectedAnswers,
  userAnswer,
  onSelectAnswer,
  onChangeUserAnswer,
}: DynamicAnswerInputProps) {
  // Untuk isian singkat, gunakan komponen AnswerInput yang sudah ada
  if (tipeJawaban === "isian_singkat") {
    return <AnswerInput value={userAnswer} onChange={onChangeUserAnswer} />;
  }

  // Untuk pilihan ganda dan pilihan ganda kompleks
  const isMultipleChoice = tipeJawaban === "pilihan_ganda_kompleks";

  const handleSelect = (jawabanId: string) => {
    if (!isMultipleChoice) {
      // Single choice: replace selection
      onSelectAnswer(jawabanId);
    } else {
      // Multiple choice: toggle selection
      onSelectAnswer(jawabanId);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Fun Header */}
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-[15px] px-4 py-3 shadow-md">
        <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#FFA07A] flex items-center justify-center shadow-lg animate-bounce-slow">
          {isMultipleChoice ? (
            <ChecklistIcon sx={{ color: "white", fontSize: "22px" }} />
          ) : (
            <RadioButtonCheckedIcon sx={{ color: "white", fontSize: "22px" }} />
          )}
        </div>
        <p className="text-[#336D82] text-[15px] font-bold drop-shadow-sm">
          {isMultipleChoice
            ? "Pilih Semua Jawaban yang Benar!"
            : "Pilih Satu Jawaban yang Benar!"}
        </p>
      </div>

      {/* Options Container */}
      <div className="space-y-3">
        {jawaban.map((item, index) => {
          const isSelected = selectedAnswers.includes(item.id);
          const optionLabel = String.fromCharCode(65 + index); // A, B, C, D, ...

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full rounded-[15px] p-4 transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.98] ${
                isSelected
                  ? "bg-gradient-to-r from-[#5B8FC4] to-[#7BA5D1] text-white scale-[1.02] border-2 border-[#336D82]"
                  : "bg-white text-[#336D82] hover:bg-gray-50 border-2 border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Checkbox/Radio indicator for multiple choice kompleks */}
                {isMultipleChoice && (
                  <div className="flex-shrink-0">
                    {isSelected ? (
                      <CheckBoxIcon
                        sx={{
                          color: "white",
                          fontSize: "28px",
                        }}
                      />
                    ) : (
                      <CheckBoxOutlineBlankIcon
                        sx={{
                          color: "#336D82",
                          fontSize: "28px",
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Option Label (A, B, C, D) */}
                <div
                  className={`w-[40px] h-[40px] rounded-full flex items-center justify-center font-bold text-[16px] flex-shrink-0 ${
                    isSelected
                      ? "bg-white text-[#5B8FC4]"
                      : "bg-gradient-to-br from-[#336D82] to-[#4A8FA5] text-white"
                  }`}
                >
                  {optionLabel}
                </div>

                {/* Answer Text */}
                <div className="flex-1 text-left">
                  <p
                    className={`text-[14px] font-medium ${
                      isSelected ? "text-white" : "text-[#336D82]"
                    }`}
                  >
                    {item.isi_jawaban}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Helper Text */}
      {selectedAnswers.length > 0 && (
        <div className="flex items-center justify-center gap-2 animate-fade-in">
          <span className="text-[16px]">⭐</span>
          <p className="text-[#5B8FC4] text-[12px] font-bold">
            {isMultipleChoice
              ? `Kamu sudah pilih ${selectedAnswers.length} jawaban!`
              : "Keren! Sekarang geser tombol di bawah yaa!"}
          </p>
          <span className="text-[16px]">⭐</span>
        </div>
      )}

      {/* Animation styles */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
