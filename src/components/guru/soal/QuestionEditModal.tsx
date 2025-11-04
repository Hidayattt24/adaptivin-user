"use client";

import React, { useState, useEffect } from "react";
import { Close, Save } from "@mui/icons-material";
import { Question } from "./QuestionSection";
import { CustomDropdown, FileUploadArea } from "@/components/guru";
import {
  Badge,
  TextFields,
  Numbers,
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
      case "isian_singkat":
        return <TextFields sx={{ fontSize: 24 }} />;
      case "angka":
        return <Numbers sx={{ fontSize: 24 }} />;
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
              {editedQuestion.answerType === "pilihan_ganda" ? (
                <textarea
                  value={editedQuestion.answerText}
                  onChange={(e) =>
                    setEditedQuestion({
                      ...editedQuestion,
                      answerText: e.target.value,
                    })
                  }
                  placeholder="Masukkan jawaban pilihan ganda (pisahkan dengan enter atau koma)&#10;A. Pilihan 1&#10;B. Pilihan 2&#10;C. Pilihan 3"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#2ea062] focus:outline-none poppins-regular resize-none"
                  rows={5}
                />
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2ea062]">
                    {getAnswerIcon()}
                  </div>
                  <input
                    type={editedQuestion.answerType === "angka" ? "number" : "text"}
                    value={editedQuestion.answerText}
                    onChange={(e) =>
                      setEditedQuestion({
                        ...editedQuestion,
                        answerText: e.target.value,
                      })
                    }
                    placeholder={
                      editedQuestion.answerType === "angka"
                        ? "Masukkan jawaban dalam angka..."
                        : "Masukkan jawaban isian singkat..."
                    }
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
