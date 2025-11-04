"use client";

import React from "react";
import {
  Delete,
  TextFields,
  Numbers,
  Image as ImageIcon,
  AccessTime,
} from "@mui/icons-material";
import { CustomDropdown, FileUploadArea } from "@/components/guru";

export type QuestionType = "C1" | "C2" | "C3" | "C4" | "C5" | "C6";
export type AnswerType = "pilihan_ganda" | "isian_singkat" | "angka";
export type TimeUnit = "Menit";

export interface Question {
  id: string;
  questionType: QuestionType;
  questionFile: File | null;
  questionFilePreview: string | null;
  questionText: string;
  answerType: AnswerType;
  answerFile: File | null;
  answerFilePreview: string | null;
  answerText: string;
  explanation: string;
  timeValue: number;
  timeUnit: TimeUnit;
}

interface QuestionSectionProps {
  question: Question;
  index: number;
  onUpdate: <K extends keyof Question>(id: string, field: K, value: Question[K]) => void;
  onRemove: (id: string) => void;
  onQuestionFileUpload: (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onAnswerFileUpload: (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onRemoveFile: (id: string, type: "question" | "answer") => void;
  onPreviewFile: (src: string, fileName: string) => void;
  canDelete: boolean;
}

const questionTypeOptions = [
  { value: "C1", label: "C1 - Mengingat" },
  { value: "C2", label: "C2 - Memahami" },
  { value: "C3", label: "C3 - Menerapkan" },
  { value: "C4", label: "C4 - Menganalisis" },
  { value: "C5", label: "C5 - Mengevaluasi" },
  { value: "C6", label: "C6 - Mencipta" },
];

const answerTypeOptions = [
  { value: "pilihan_ganda", label: "Pilihan Ganda" },
  { value: "isian_singkat", label: "Isian Singkat" },
  { value: "angka", label: "Angka" },
];

const timeUnitOptions = [
  { value: "Menit", label: "Menit" },
  { value: "Detik", label: "Detik" },
];

export default function QuestionSection({
  question,
  index,
  onUpdate,
  onRemove,
  onQuestionFileUpload,
  onAnswerFileUpload,
  onRemoveFile,
  onPreviewFile,
  canDelete,
}: QuestionSectionProps) {
  const getAnswerIcon = () => {
    switch (question.answerType) {
      case "pilihan_ganda":
        return <TextFields sx={{ fontSize: 24, color: "#336d82" }} />;
      case "isian_singkat":
        return <TextFields sx={{ fontSize: 24, color: "#336d82" }} />;
      case "angka":
        return <Numbers sx={{ fontSize: 24, color: "#336d82" }} />;

    }
  };

  return (
    <div className="bg-gradient-to-br from-[#336d82] to-[#4a8a9e] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-dashed border-white/30">
      {/* Question Section */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-base sm:text-xl font-bold text-white font-poppins mb-3 sm:mb-4">
          Isi Soal Nomor {index + 1}
        </h2>

        {/* Question Type Dropdown - Commented out */}
        <div className="mb-3 sm:mb-4">
          <CustomDropdown
            value={question.questionType}
            options={questionTypeOptions}
            onChange={(value) => onUpdate(question.id, "questionType", value as QuestionType)}
            leftIcon={
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#336d82] rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm sm:text-base">
                  {question.questionType}
                </span>
              </div>
            }
          />
        </div>


        {/* Question File Upload */}
        <div className="mb-3 sm:mb-4">
          <FileUploadArea
            file={question.questionFile}
            filePreview={question.questionFilePreview}
            onFileSelect={(e) => onQuestionFileUpload(question.id, e)}
            onRemove={() => onRemoveFile(question.id, "question")}
            onPreview={() =>
              onPreviewFile(
                question.questionFilePreview!,
                question.questionFile?.name || "preview"
              )
            }
            label="Upload Gambar Soal"
            optional
            variant="primary"
          />
        </div>

        {/* Question Text Input */}
        <textarea
          value={question.questionText}
          onChange={(e) =>
            onUpdate(question.id, "questionText", e.target.value)
          }
          placeholder="Isi soal anda disini..."
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-white/30 bg-white/95 backdrop-blur-sm text-gray-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white shadow-md resize-none"
          rows={4}
        />
      </div>

      {/* Answer Section */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-base sm:text-xl font-bold text-white font-poppins mb-3 sm:mb-4">
          Isi Jawaban Nomor {index + 1}
        </h2>

        {/* Answer Type Dropdown */}
        <div className="mb-3 sm:mb-4">
          <CustomDropdown
            value={question.answerType}
            options={answerTypeOptions}
            onChange={(value) => onUpdate(question.id, "answerType", value as AnswerType)}
            leftIcon={getAnswerIcon()}
          />
        </div>

        {/* Answer Text Input */}
        <div className="mb-6">
          {/* Info untuk pilihan ganda */}
          {question.answerType === "pilihan_ganda" && (
            <div className="mb-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-lg">
              <p className="text-blue-800 text-xs sm:text-sm font-medium flex items-center gap-2">
                <span className="text-lg">ℹ️</span>
                <span>
                  <strong>Untuk Pilihan Ganda:</strong> Pisahkan setiap pilihan dengan enter atau koma.
                  Pilihan pertama akan menjadi jawaban yang benar.
                </span>
              </p>
              <p className="text-blue-700 text-xs mt-1 ml-7">
                Contoh: <code className="bg-blue-100 px-1 rounded">A. Jakarta, B. Bandung, C. Surabaya</code>
              </p>
            </div>
          )}

          <div className="relative">
            <div className="absolute left-4 top-4 pointer-events-none">
              {getAnswerIcon()}
            </div>
            {question.answerType === "pilihan_ganda" ? (
              <textarea
                value={question.answerText}
                onChange={(e) =>
                  onUpdate(question.id, "answerText", e.target.value)
                }
                placeholder="Masukkan jawaban pilihan ganda...&#10;&#10;Pisahkan dengan enter atau koma:&#10;A. Pilihan 1&#10;B. Pilihan 2&#10;C. Pilihan 3&#10;&#10;Pilihan pertama akan menjadi jawaban yang benar."
                className="w-full pl-11 sm:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-white/30 bg-white/95 backdrop-blur-sm text-gray-800 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-white focus:border-white shadow-lg hover:shadow-xl transition-all placeholder:text-gray-400 resize-none"
                rows={5}
              />
            ) : question.answerType === "isian_singkat" ? (
              <input
                type="text"
                value={question.answerText}
                onChange={(e) =>
                  onUpdate(question.id, "answerText", e.target.value)
                }
                placeholder="Masukkan jawaban isian singkat..."
                className="w-full pl-11 sm:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-white/30 bg-white/95 backdrop-blur-sm text-gray-800 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-white focus:border-white shadow-lg hover:shadow-xl transition-all placeholder:text-gray-400"
              />
            ) : (
              <input
                type="number"
                value={question.answerText}
                onChange={(e) =>
                  onUpdate(question.id, "answerText", e.target.value)
                }
                placeholder="Masukkan jawaban dalam angka..."
                className="w-full pl-11 sm:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-white/30 bg-white/95 backdrop-blur-sm text-gray-800 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-white focus:border-white shadow-lg hover:shadow-xl transition-all placeholder:text-gray-400"
              />
            )}
          </div>
        </div>
        {/* Explanation Section */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white">Penjelasan</h3>
          <p className="text-gray-300">
            <input
              type="text"
              value={question.explanation}
              onChange={(e) =>
                onUpdate(question.id, "explanation", e.target.value)
              }
              placeholder="Berikan penjelasan untuk jawaban ini..."
              className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-white/30 bg-white/95 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-white shadow-md"
            />
          </p>
        </div>

        {/* Optional Support Image for Answer Explanation */}
        <div className="mt-6">
          <p className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
            <ImageIcon sx={{ fontSize: 18 }} />
            Gambar Pendukung Penjelasan Jawaban (Opsional)
          </p>
          <FileUploadArea
            file={question.answerFile}
            filePreview={question.answerFilePreview}
            onFileSelect={(e) => onAnswerFileUpload(question.id, e)}
            onRemove={() => onRemoveFile(question.id, "answer")}
            onPreview={() =>
              onPreviewFile(
                question.answerFilePreview!,
                question.answerFile?.name || "preview"
              )
            }
            label="Upload gambar pendukung penjelasan"
            optional
            variant="secondary"
          />
        </div>
      </div>

      {/* Time Section */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-base sm:text-xl font-bold text-white font-poppins mb-3 sm:mb-4 flex items-center gap-2">
          <AccessTime sx={{ fontSize: 20 }} className="sm:text-2xl" />
          <span>Lama waktu menjawab</span>
        </h2>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative flex-1 max-w-[120px] sm:max-w-xs">
            <input
              type="number"
              min="1"
              value={question.timeValue}
              onChange={(e) =>
                onUpdate(
                  question.id,
                  "timeValue",
                  parseInt(e.target.value) || 1
                )
              }
              className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-white/30 bg-white/95 backdrop-blur-sm text-gray-800 font-bold text-center text-xl sm:text-2xl focus:outline-none focus:ring-2 focus:ring-white focus:border-white shadow-lg hover:shadow-xl transition-all"
            />
          </div>
          <div className="flex-1 max-w-[180px] sm:max-w-xs">
            <CustomDropdown
              value={question.timeUnit}
              options={timeUnitOptions}
              onChange={(value) => onUpdate(question.id, "timeUnit", value as TimeUnit)}
              leftIcon={
                <AccessTime
                  sx={{ fontSize: 20, color: "#336d82" }}
                  className="sm:text-2xl"
                />
              }
            />
          </div>
        </div>
      </div>

      {/* Delete Button */}
      {canDelete && (
        <div className="flex justify-end">
          <button
            onClick={() => onRemove(question.id)}
            type="button"
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 text-white rounded-lg sm:rounded-xl hover:bg-red-600 active:bg-red-700 transition-colors flex items-center gap-2 font-poppins font-semibold shadow-lg text-sm sm:text-base"
          >
            <Delete sx={{ fontSize: 18 }} className="sm:text-xl" />
            <span>Hapus Soal Ini</span>
          </button>
        </div>
      )}
    </div>
  );
}
