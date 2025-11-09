"use client";

import React from "react";
import {
  Delete,
  TextFields,
  Image as ImageIcon,
  AccessTime,
} from "@mui/icons-material";
import { CustomDropdown, FileUploadArea } from "@/components/guru";

export type QuestionType = "level1" | "level2" | "level3" | "level4" | "level5" | "level6";
export type AnswerType = "pilihan_ganda" | "pilihan_ganda_kompleks" | "isian_singkat";
export type TimeUnit = "Menit";

export interface MultipleChoiceOption {
  label: string;
  text: string;
  isCorrect: boolean;
}

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
  multipleChoiceOptions?: MultipleChoiceOption[];
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
  { value: "level1", label: "Level 1" },
  { value: "level2", label: "Level 2" },
  { value: "level3", label: "Level 3" },
  { value: "level4", label: "Level 4" },
  { value: "level5", label: "Level 5" },
  { value: "level6", label: "Level 6" },
];

const answerTypeOptions = [
  { value: "pilihan_ganda", label: "Pilihan Ganda" },
  { value: "pilihan_ganda_kompleks", label: "Pilihan Ganda Kompleks" },
  { value: "isian_singkat", label: "Isian Singkat" },
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
      case "pilihan_ganda_kompleks":
        return <TextFields sx={{ fontSize: 24, color: "#336d82" }} />;
      case "isian_singkat":
        return <TextFields sx={{ fontSize: 24, color: "#336d82" }} />;
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
          {/* Template A B C D untuk pilihan_ganda dan pilihan_ganda_kompleks */}
          {(question.answerType === "pilihan_ganda" || question.answerType === "pilihan_ganda_kompleks") && (
            <div className="space-y-4">
              {/* Info Banner */}
              <div className="mb-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-lg">
                <p className="text-blue-800 text-xs sm:text-sm font-medium flex items-center gap-2">
                  <span className="text-lg">ℹ️</span>
                  <span>
                    {question.answerType === "pilihan_ganda" ? (
                      <><strong>Pilihan Ganda:</strong> Pilih SATU jawaban yang benar dengan klik pada lingkaran.</>
                    ) : (
                      <><strong>Pilihan Ganda Kompleks:</strong> Pilih BEBERAPA jawaban yang benar dengan klik pada kotak.</>
                    )}
                  </span>
                </p>
              </div>

              {/* Options A B C D */}
              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map((label) => {
                  const optionIndex = label.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
                  const option = question.multipleChoiceOptions?.[optionIndex] || { label, text: '', isCorrect: false };

                  return (
                    <div key={label} className="bg-white/95 backdrop-blur-sm rounded-xl border-2 border-white/30 shadow-md hover:shadow-lg transition-all">
                      <div className="flex items-center gap-3 p-3 sm:p-4">
                        {/* Radio/Checkbox */}
                        <div className="flex-shrink-0">
                          {question.answerType === "pilihan_ganda" ? (
                            <button
                              type="button"
                              onClick={() => {
                                const newOptions = (question.multipleChoiceOptions || [
                                  { label: 'A', text: '', isCorrect: false },
                                  { label: 'B', text: '', isCorrect: false },
                                  { label: 'C', text: '', isCorrect: false },
                                  { label: 'D', text: '', isCorrect: false },
                                ]).map((opt, idx) => ({
                                  ...opt,
                                  isCorrect: idx === optionIndex
                                }));
                                onUpdate(question.id, "multipleChoiceOptions", newOptions);
                              }}
                              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-3 flex items-center justify-center transition-all ${option.isCorrect
                                ? 'bg-green-500 border-green-600 shadow-lg'
                                : 'bg-white border-gray-300 hover:border-green-400'
                                }`}
                            >
                              {option.isCorrect && (
                                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-white rounded-full"></div>
                              )}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const newOptions = (question.multipleChoiceOptions || [
                                  { label: 'A', text: '', isCorrect: false },
                                  { label: 'B', text: '', isCorrect: false },
                                  { label: 'C', text: '', isCorrect: false },
                                  { label: 'D', text: '', isCorrect: false },
                                ]).map((opt, idx) =>
                                  idx === optionIndex ? { ...opt, isCorrect: !opt.isCorrect } : opt
                                );
                                onUpdate(question.id, "multipleChoiceOptions", newOptions);
                              }}
                              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md border-3 flex items-center justify-center transition-all ${option.isCorrect
                                ? 'bg-green-500 border-green-600 shadow-lg'
                                : 'bg-white border-gray-300 hover:border-green-400'
                                }`}
                            >
                              {option.isCorrect && (
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Label */}
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#336d82] rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-base sm:text-lg">{label}</span>
                        </div>

                        {/* Input Text */}
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => {
                            const newOptions = (question.multipleChoiceOptions || [
                              { label: 'A', text: '', isCorrect: false },
                              { label: 'B', text: '', isCorrect: false },
                              { label: 'C', text: '', isCorrect: false },
                              { label: 'D', text: '', isCorrect: false },
                            ]).map((opt, idx) =>
                              idx === optionIndex ? { ...opt, text: e.target.value } : opt
                            );
                            onUpdate(question.id, "multipleChoiceOptions", newOptions);
                          }}
                          placeholder={`Isi pilihan ${label}...`}
                          className="flex-1 px-3 py-2 sm:py-2.5 rounded-lg border-2 border-transparent bg-gray-50 text-gray-800 text-sm sm:text-base font-medium focus:outline-none focus:bg-white focus:border-[#336d82] transition-all"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input untuk isian_singkat */}
          {question.answerType === "isian_singkat" && (
            <div className="relative">
              <div className="absolute left-4 top-4 pointer-events-none">
                {getAnswerIcon()}
              </div>
              <input
                type="text"
                value={question.answerText}
                onChange={(e) =>
                  onUpdate(question.id, "answerText", e.target.value)
                }
                placeholder="Masukkan jawaban isian singkat..."
                className="w-full pl-11 sm:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-white/30 bg-white/95 backdrop-blur-sm text-gray-800 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-white focus:border-white shadow-lg hover:shadow-xl transition-all placeholder:text-gray-400"
              />
            </div>
          )}
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
