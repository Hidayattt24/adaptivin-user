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
export type AnswerType = "Tulisan" | "Angka" | "Foto";
export type TimeUnit = "Menit" | "Detik";

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
  // onUpdate: (id: string, field: keyof Question, value: any) => void;
  onRemove: (id: string) => void;
  onQuestionFileUpload: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onAnswerFileUpload: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
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
  { value: "Tulisan", label: "Tulisan" },
  { value: "Angka", label: "Angka" },
  { value: "Foto", label: "Foto" },
];

const timeUnitOptions = [
  { value: "Menit", label: "Menit" },
  { value: "Detik", label: "Detik" },
];

export default function QuestionSection({
  question,
  index,
  // onUpdate,
  onRemove,
  onQuestionFileUpload,
  onAnswerFileUpload,
  onRemoveFile,
  onPreviewFile,
  canDelete,
}: QuestionSectionProps) {
  const getAnswerIcon = () => {
    switch (question.answerType) {
      case "Tulisan":
        return <TextFields sx={{ fontSize: 24, color: "#336d82" }} />;
      case "Angka":
        return <Numbers sx={{ fontSize: 24, color: "#336d82" }} />;
      case "Foto":
        return <ImageIcon sx={{ fontSize: 24, color: "#336d82" }} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#336d82] to-[#4a8a9e] rounded-3xl p-6 shadow-2xl border-2 border-dashed border-white/30">
      {/* Question Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white font-poppins mb-4">
          Isi Soal Nomor {index + 1}
        </h2>

        {/* Question Type Dropdown */}
        <div className="mb-4">
          {/* <CustomDropdown
            value={question.questionType}
            options={questionTypeOptions}
            onChange={(value) => onUpdate(question.id, "questionType", value)}
            leftIcon={
              <div className="w-10 h-10 bg-[#336d82] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-base">
                  {question.questionType}
                </span>
              </div>
            }
          /> */}
        </div>

        {/* Question File Upload */}
        <div className="mb-4">
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
          // onChange={(e) => onUpdate(question.id, "questionText", e.target.value)}
          placeholder="Isi soal anda disini..."
          className="w-full px-4 py-3 rounded-xl border-2 border-white/30 bg-white/95 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-white shadow-md resize-none"
          rows={4}
        />
      </div>

      {/* Answer Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white font-poppins mb-4">
          Isi Jawaban Nomor {index + 1}
        </h2>

        {/* Answer Type Dropdown */}
        <div className="mb-4">
          {/* <CustomDropdown
            value={question.answerType}
            options={answerTypeOptions}
            onChange={(value) => onUpdate(question.id, "answerType", value)}
            leftIcon={getAnswerIcon()}
          /> */}
        </div>

        {/* Answer File Upload (if Foto selected) */}
        {question.answerType === "Foto" && (
          <div className="mb-4">
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
              label="Upload Gambar Jawaban"
              variant="primary"
            />
          </div>
        )}

        {/* Answer Text Input */}
        {question.answerType !== "Foto" && (
          <div className="relative mb-6">
            <div className="absolute left-4 top-4 pointer-events-none">
              {getAnswerIcon()}
            </div>
            <input
              type={question.answerType === "Angka" ? "number" : "text"}
              value={question.answerText}
              // onChange={(e) => onUpdate(question.id, "answerText", e.target.value)}
              placeholder={
                question.answerType === "Angka"
                  ? "Masukkan jawaban dalam angka..."
                  : "Masukkan jawaban dalam teks..."
              }
              className="w-full pl-14 pr-4 py-4 rounded-2xl border-2 border-white/30 bg-white/95 backdrop-blur-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-white focus:border-white shadow-lg hover:shadow-xl transition-all placeholder:text-gray-400"
            />
          </div>
        )}

        {/* Explanation Section */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white">Penjelasan</h3>
          <p className="text-gray-300">
            <input
              type="text"
              value={question.explanation}
              // onChange={(e) => onUpdate(question.id, "explanation", e.target.value)}
              placeholder="Berikan penjelasan untuk jawaban ini..."
              className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-white/30 bg-white/95 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-white shadow-md"
            />
          </p>
        </div>

        {/* Optional Support Image for Text/Number */}
        {question.answerType !== "Foto" && (
          <div className="mt-6">
            <p className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
              <ImageIcon sx={{ fontSize: 18 }} />
              Gambar Pendukung Jawaban (Opsional)
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
              label="Upload gambar pendukung"
              optional
              variant="secondary"
            />
          </div>
        )}
      </div>

      {/* Time Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white font-poppins mb-4 flex items-center gap-2">
          <AccessTime sx={{ fontSize: 24 }} />
          Lama waktu menjawab
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-xs">
            {/* <input
              type="number"
              min="1"
              value={question.timeValue}
              onChange={(e) =>
                // onUpdate(question.id, "timeValue", parseInt(e.target.value) || 1)
              }
              className="w-full px-6 py-4 rounded-2xl border-2 border-white/30 bg-white/95 backdrop-blur-sm text-gray-800 font-bold text-center text-2xl focus:outline-none focus:ring-2 focus:ring-white focus:border-white shadow-lg hover:shadow-xl transition-all"
            />
          </div>
          <div className="flex-1 max-w-xs">
            {/* <CustomDropdown
              value={question.timeUnit}
              options={timeUnitOptions}
              onChange={(value) => onUpdate(question.id, "timeUnit", value)}
              leftIcon={<AccessTime sx={{ fontSize: 24, color: "#336d82" }} />}
            /> */}
          </div>
        </div>
      </div>

      {/* Delete Button */}
      {canDelete && (
        <div className="flex justify-end">
          <button
            onClick={() => onRemove(question.id)}
            type="button"
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2 font-poppins font-semibold shadow-lg"
          >
            <Delete sx={{ fontSize: 20 }} />
            Hapus Soal Ini
          </button>
        </div>
      )}
    </div>
  );
}
