"use client";

import React, { useState, useEffect } from "react";
import { Close, Save } from "@mui/icons-material";
import { Question } from "./QuestionSection";
import { CustomDropdown, FileUploadArea } from "@/components/guru";
import {
  Badge,
  TextFields,
  AccessTime,
} from "@mui/icons-material";

interface QuestionEditModalProps {
  isOpen: boolean;
  question: Question | null;
  questionNumber: number;
  onClose: () => void;
  onSave: (updatedQuestion: Question) => void;
}

const questionTypeOptions = [
  { value: "Level 1", label: "Level 1 - Mengingat" },
  { value: "Level 2", label: "Level 2 - Memahami" },
  { value: "Level 3", label: "Level 3 - Menerapkan" },
  { value: "Level 4", label: "Level 4 - Menganalisis" },
  { value: "Level 5", label: "Level 5 - Mengevaluasi" },
  { value: "Level 6", label: "Level 6 - Mencipta" },
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

export function QuestionEditModal({
  isOpen,
  question,
  questionNumber,
  onClose,
  onSave,
}: QuestionEditModalProps) {
  const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (question) {
      setEditedQuestion({ ...question });
    }
  }, [question]);

  if (!isOpen || !editedQuestion) return null;

  const handleSave = () => {
    onSave(editedQuestion);
    onClose();
  };

  const handleQuestionFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedQuestion({
          ...editedQuestion,
          questionFile: file,
          questionFilePreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnswerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedQuestion({
          ...editedQuestion,
          answerFile: file,
          answerFilePreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getAnswerIcon = () => {
    switch (editedQuestion.answerType) {
      case "pilihan_ganda":
        return <TextFields sx={{ fontSize: 24 }} />;
      case "pilihan_ganda_kompleks":
        return <TextFields sx={{ fontSize: 24 }} />;
      case "isian_singkat":
        return <TextFields sx={{ fontSize: 24 }} />;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#336d82] to-[#2a5a6d] px-8 py-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-white text-2xl poppins-bold">
              Edit Soal Nomor {questionNumber}
            </h2>
            <p className="text-white/80 text-sm poppins-medium mt-1">
              Ubah detail soal dan simpan perubahan
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
          >
            <Close sx={{ fontSize: 24, color: "white" }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Question Section */}
          <div className="space-y-6">
            <h3 className="text-[#336d82] text-xl poppins-semibold flex items-center gap-2">
              <span className="w-8 h-8 bg-[#336d82] rounded-lg flex items-center justify-center text-white text-sm">
                1
              </span>
              Isi Soal
            </h3>

            {/* Question Type */}
            <div>
              <label className="block text-gray-700 text-sm poppins-medium mb-2">
                Tipe Soal
              </label>
              <CustomDropdown
                value={editedQuestion.questionType}
                options={questionTypeOptions}
                onChange={(value) =>
                  setEditedQuestion({
                    ...editedQuestion,
                    questionType: value as Question["questionType"],
                  })
                }
                leftIcon={
                  <div className="w-10 h-10 bg-[#336d82] rounded-xl flex items-center justify-center">
                    <Badge sx={{ fontSize: 20, color: "white" }} />
                  </div>
                }
              />
            </div>

            {/* Question File Upload */}
            <div>
              <label className="block text-gray-700 text-sm poppins-medium mb-2">
                Upload Gambar Soal (Opsional)
              </label>
              <FileUploadArea
                file={editedQuestion.questionFile}
                filePreview={editedQuestion.questionFilePreview}
                onFileSelect={handleQuestionFileUpload}
                onRemove={() =>
                  setEditedQuestion({
                    ...editedQuestion,
                    questionFile: null,
                    questionFilePreview: null,
                  })
                }
                onPreview={() => { }}
                label="Upload Gambar Soal"
                optional
                variant="primary"
              />
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-gray-700 text-sm poppins-medium mb-2">
                Isi Soal
              </label>
              <textarea
                value={editedQuestion.questionText}
                onChange={(e) =>
                  setEditedQuestion({
                    ...editedQuestion,
                    questionText: e.target.value,
                  })
                }
                placeholder="Tulis pertanyaan soal di sini..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#336d82] focus:outline-none resize-none poppins-regular"
                rows={4}
              />
            </div>
          </div>

          {/* Answer Section */}
          <div className="space-y-6">
            <h3 className="text-[#336d82] text-xl poppins-semibold flex items-center gap-2">
              <span className="w-8 h-8 bg-[#336d82] rounded-lg flex items-center justify-center text-white text-sm">
                2
              </span>
              Isi Jawaban
            </h3>

            {/* Answer Type */}
            <div>
              <label className="block text-gray-700 text-sm poppins-medium mb-2">
                Tipe Jawaban
              </label>
              <CustomDropdown
                value={editedQuestion.answerType}
                options={answerTypeOptions}
                onChange={(value) =>
                  setEditedQuestion({
                    ...editedQuestion,
                    answerType: value as Question["answerType"],
                  })
                }
                leftIcon={
                  <div className="w-10 h-10 bg-[#2ea062] rounded-xl flex items-center justify-center text-white">
                    {getAnswerIcon()}
                  </div>
                }
              />
            </div>

            {/* Answer Input - Conditional */}
            <div>
              <label className="block text-gray-700 text-sm poppins-medium mb-2">
                Isi Jawaban
              </label>

              {/* Template A B C D untuk pilihan_ganda dan pilihan_ganda_kompleks */}
              {(editedQuestion.answerType === "pilihan_ganda" || editedQuestion.answerType === "pilihan_ganda_kompleks") && (
                <div className="space-y-3">
                  {/* Info Banner */}
                  <div className="mb-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-lg">
                    <p className="text-blue-800 text-sm font-medium flex items-center gap-2">
                      <span className="text-lg">ℹ️</span>
                      <span>
                        {editedQuestion.answerType === "pilihan_ganda" ? (
                          <><strong>Pilihan Ganda:</strong> Pilih SATU jawaban yang benar dengan klik pada lingkaran.</>
                        ) : (
                          <><strong>Pilihan Ganda Kompleks:</strong> Pilih BEBERAPA jawaban yang benar dengan klik pada kotak.</>
                        )}
                      </span>
                    </p>
                  </div>

                  {/* Options A B C D */}
                  {['A', 'B', 'C', 'D'].map((label) => {
                    const optionIndex = label.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
                    const option = editedQuestion.multipleChoiceOptions?.[optionIndex] || { label, text: '', isCorrect: false };

                    return (
                      <div key={label} className="bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-[#2ea062] transition-all">
                        <div className="flex items-center gap-3 p-3">
                          {/* Radio/Checkbox */}
                          <div className="flex-shrink-0">
                            {editedQuestion.answerType === "pilihan_ganda" ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const newOptions = (editedQuestion.multipleChoiceOptions || [
                                    { label: 'A', text: '', isCorrect: false },
                                    { label: 'B', text: '', isCorrect: false },
                                    { label: 'C', text: '', isCorrect: false },
                                    { label: 'D', text: '', isCorrect: false },
                                  ]).map((opt, idx) => ({
                                    ...opt,
                                    isCorrect: idx === optionIndex
                                  }));
                                  setEditedQuestion({ ...editedQuestion, multipleChoiceOptions: newOptions });
                                }}
                                className={`w-6 h-6 rounded-full border-3 flex items-center justify-center transition-all ${option.isCorrect
                                    ? 'bg-green-500 border-green-600 shadow-lg'
                                    : 'bg-white border-gray-300 hover:border-green-400'
                                  }`}
                              >
                                {option.isCorrect && (
                                  <div className="w-3 h-3 bg-white rounded-full"></div>
                                )}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  const newOptions = (editedQuestion.multipleChoiceOptions || [
                                    { label: 'A', text: '', isCorrect: false },
                                    { label: 'B', text: '', isCorrect: false },
                                    { label: 'C', text: '', isCorrect: false },
                                    { label: 'D', text: '', isCorrect: false },
                                  ]).map((opt, idx) =>
                                    idx === optionIndex ? { ...opt, isCorrect: !opt.isCorrect } : opt
                                  );
                                  setEditedQuestion({ ...editedQuestion, multipleChoiceOptions: newOptions });
                                }}
                                className={`w-6 h-6 rounded-md border-3 flex items-center justify-center transition-all ${option.isCorrect
                                    ? 'bg-green-500 border-green-600 shadow-lg'
                                    : 'bg-white border-gray-300 hover:border-green-400'
                                  }`}
                              >
                                {option.isCorrect && (
                                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                            )}
                          </div>

                          {/* Label */}
                          <div className="flex-shrink-0 w-10 h-10 bg-[#2ea062] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-base">{label}</span>
                          </div>

                          {/* Input Text */}
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => {
                              const newOptions = (editedQuestion.multipleChoiceOptions || [
                                { label: 'A', text: '', isCorrect: false },
                                { label: 'B', text: '', isCorrect: false },
                                { label: 'C', text: '', isCorrect: false },
                                { label: 'D', text: '', isCorrect: false },
                              ]).map((opt, idx) =>
                                idx === optionIndex ? { ...opt, text: e.target.value } : opt
                              );
                              setEditedQuestion({ ...editedQuestion, multipleChoiceOptions: newOptions });
                            }}
                            placeholder={`Isi pilihan ${label}...`}
                            className="flex-1 px-3 py-2 rounded-lg border-2 border-transparent bg-white text-gray-800 text-base font-medium focus:outline-none focus:border-[#2ea062] transition-all"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Input untuk isian_singkat */}
              {editedQuestion.answerType === "isian_singkat" && (
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2ea062]">
                    {getAnswerIcon()}
                  </div>
                  <input
                    type="text"
                    value={editedQuestion.answerText}
                    onChange={(e) =>
                      setEditedQuestion({
                        ...editedQuestion,
                        answerText: e.target.value,
                      })
                    }
                    placeholder="Masukkan jawaban isian singkat..."
                    className="w-full pl-14 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#2ea062] focus:outline-none poppins-regular"
                  />
                </div>
              )}
            </div>

            {/* Support Image for Answer Explanation */}
            <div>
              <label className="block text-gray-700 text-sm poppins-medium mb-2">
                Gambar Pendukung Penjelasan Jawaban (Opsional)
              </label>
              <FileUploadArea
                file={editedQuestion.answerFile}
                filePreview={editedQuestion.answerFilePreview}
                onFileSelect={handleAnswerFileUpload}
                onRemove={() =>
                  setEditedQuestion({
                    ...editedQuestion,
                    answerFile: null,
                    answerFilePreview: null,
                  })
                }
                onPreview={() => { }}
                label="Upload gambar pendukung penjelasan"
                optional
                variant="secondary"
              />
            </div>
          </div>

          {/* Time Section */}
          <div className="space-y-6">
            <h3 className="text-[#336d82] text-xl poppins-semibold flex items-center gap-2">
              <span className="w-8 h-8 bg-[#336d82] rounded-lg flex items-center justify-center text-white text-sm">
                3
              </span>
              Lama Waktu Menjawab
            </h3>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 text-sm poppins-medium mb-2">
                  Durasi
                </label>
                <input
                  type="number"
                  min="1"
                  value={editedQuestion.timeValue}
                  onChange={(e) =>
                    setEditedQuestion({
                      ...editedQuestion,
                      timeValue: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#336d82] focus:outline-none poppins-regular text-center text-2xl"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 text-sm poppins-medium mb-2">
                  Satuan
                </label>
                <CustomDropdown
                  value={editedQuestion.timeUnit}
                  options={timeUnitOptions}
                  onChange={(value) =>
                    setEditedQuestion({
                      ...editedQuestion,
                      timeUnit: value as Question["timeUnit"],
                    })
                  }
                  leftIcon={
                    <div className="w-10 h-10 bg-[#fcc61d] rounded-xl flex items-center justify-center">
                      <AccessTime sx={{ fontSize: 20, color: "white" }} />
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-8 py-4 border-t-2 border-gray-200 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-xl poppins-semibold transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#2ea062] hover:bg-[#26824f] text-white py-3 rounded-xl poppins-semibold transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Save sx={{ fontSize: 20 }} />
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
