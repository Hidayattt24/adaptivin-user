"use client";

import React, { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowBackIos,
  Visibility,
  RemoveCircle,
  CheckCircle,
  PlaylistAddCheck,
  Edit,
  Delete,
} from "@mui/icons-material";

// Types
interface Question {
  id: string;
  type: "C1" | "C2" | "C3" | "C4" | "C5" | "C6";
  question: string;
  fullQuestion?: string;
  options?: string[];
  correctAnswer?: string;
  isInQuiz: boolean;
}

type QuestionType = "C1" | "C2" | "C3" | "C4" | "C5" | "C6";

const EditKuisPage = () => {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.kelasId as string;
  const materiId = params.materiId as string;

  // Mock data - replace with API call
  const [allQuestions] = useState<Question[]>([
    {
      id: "1",
      type: "C1",
      question: "Apa itu pecahan?",
      fullQuestion:
        "Apa itu pecahan? Pecahan adalah bilangan yang menyatakan bagian dari keseluruhan. Contoh: 1/2, 3/4, 2/5",
      options: [
        "Bilangan bulat",
        "Bagian dari keseluruhan",
        "Bilangan negatif",
        "Bilangan desimal",
      ],
      correctAnswer: "Bagian dari keseluruhan",
      isInQuiz: false,
    },
    {
      id: "2",
      type: "C1",
      question: "Berapa nilai dari 1/2?",
      fullQuestion: "Berapa nilai dari 1/2 jika diubah ke desimal?",
      options: ["0.25", "0.5", "0.75", "1.0"],
      correctAnswer: "0.5",
      isInQuiz: false,
    },
    {
      id: "3",
      type: "C2",
      question: "Jelaskan perbedaan pecahan biasa dan campuran",
      fullQuestion:
        "Jelaskan perbedaan antara pecahan biasa dan pecahan campuran dengan contoh!",
      isInQuiz: false,
    },
    {
      id: "4",
      type: "C2",
      question: "Bagaimana cara mengubah pecahan biasa ke campuran?",
      fullQuestion:
        "Bagaimana cara mengubah pecahan biasa menjadi pecahan campuran? Berikan langkah-langkahnya!",
      isInQuiz: false,
    },
    {
      id: "5",
      type: "C3",
      question: "Terapkan konsep pecahan dalam kehidupan sehari-hari",
      fullQuestion:
        "Berikan 3 contoh penerapan konsep pecahan dalam kehidupan sehari-hari dan jelaskan!",
      isInQuiz: false,
    },
    {
      id: "6",
      type: "C3",
      question: "Hitung: 2/3 + 1/4 = ?",
      fullQuestion: "Hitunglah hasil dari 2/3 + 1/4 dan jelaskan caranya!",
      options: ["5/7", "11/12", "3/7", "5/12"],
      correctAnswer: "11/12",
      isInQuiz: false,
    },
    {
      id: "7",
      type: "C4",
      question: "Analisis soal cerita tentang pecahan",
      fullQuestion:
        "Ibu membeli 3/4 kg gula. Digunakan untuk membuat kue 1/2 kg. Berapa sisa gula ibu?",
      options: ["1/4 kg", "1/2 kg", "3/4 kg", "1 kg"],
      correctAnswer: "1/4 kg",
      isInQuiz: false,
    },
    {
      id: "8",
      type: "C4",
      question: "Bandingkan pecahan: 3/5 dan 2/3",
      fullQuestion:
        "Bandingkan pecahan 3/5 dan 2/3. Mana yang lebih besar? Jelaskan dengan cara!",
      isInQuiz: false,
    },
    {
      id: "9",
      type: "C5",
      question: "Evaluasi strategi penyelesaian soal pecahan",
      fullQuestion:
        "Evaluasi 2 strategi berbeda untuk menyelesaikan 1/2 + 1/3. Mana yang lebih efisien?",
      isInQuiz: false,
    },
    {
      id: "10",
      type: "C5",
      question: "Nilai kebenaran pernyataan tentang pecahan",
      fullQuestion:
        "Pernyataan: 'Semua pecahan bisa diubah ke desimal'. Evaluasi pernyataan ini!",
      isInQuiz: false,
    },
    {
      id: "11",
      type: "C6",
      question: "Buat soal cerita tentang pecahan",
      fullQuestion:
        "Buatlah soal cerita yang melibatkan operasi pecahan (penjumlahan dan pengurangan) beserta jawabannya!",
      isInQuiz: false,
    },
    {
      id: "12",
      type: "C6",
      question: "Rancang metode pembelajaran pecahan",
      fullQuestion:
        "Rancanglah metode pembelajaran pecahan yang mudah dipahami untuk siswa SD!",
      isInQuiz: false,
    },
  ]);

  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedQuestion, setDraggedQuestion] = useState<Question | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [visibleCounts, setVisibleCounts] = useState<
    Record<QuestionType, number>
  >({
    C1: 2,
    C2: 2,
    C3: 2,
    C4: 2,
    C5: 2,
    C6: 2,
  });

  // Add question to quiz
  const addToQuiz = useCallback(
    (question: Question) => {
      if (!quizQuestions.find((q) => q.id === question.id)) {
        setQuizQuestions([...quizQuestions, { ...question, isInQuiz: true }]);
        setSelectedQuestions(new Set([...selectedQuestions, question.id]));
      }
    },
    [quizQuestions, selectedQuestions]
  );

  // Remove from quiz
  const removeFromQuiz = useCallback(
    (questionId: string) => {
      setQuizQuestions(quizQuestions.filter((q) => q.id !== questionId));
      const newSelected = new Set(selectedQuestions);
      newSelected.delete(questionId);
      setSelectedQuestions(newSelected);
    },
    [quizQuestions, selectedQuestions]
  );

  // Toggle checkbox
  const toggleCheckbox = useCallback(
    (questionId: string) => {
      const newSelected = new Set(selectedQuestions);
      if (newSelected.has(questionId)) {
        newSelected.delete(questionId);
      } else {
        newSelected.add(questionId);
      }
      setSelectedQuestions(newSelected);
    },
    [selectedQuestions]
  );

  // Drag and drop handlers
  const handleDragStart = (question: Question) => {
    setDraggedQuestion(question);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (draggedQuestion) {
      addToQuiz(draggedQuestion);
      setDraggedQuestion(null);
    }
  };

  // Load more questions
  const loadMore = (type: QuestionType) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 2,
    }));
  };

  // Submit quiz
  const handleSubmit = async () => {
    if (quizQuestions.length === 0) {
      alert("Pilih minimal satu soal untuk kuis!");
      return;
    }

    if (
      !confirm(
        `Anda akan menyimpan ${quizQuestions.length} soal ke kuis. Lanjutkan?`
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    // TODO: API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Kuis berhasil disimpan!");
    router.push(`/guru/kelas/${kelasId}/materi`);
  };

  // Group questions by type
  const groupedQuestions = allQuestions.reduce((acc, q) => {
    if (!acc[q.type]) acc[q.type] = [];
    acc[q.type].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  // Type descriptions
  const typeDescriptions: Record<QuestionType, string> = {
    C1: "Mengingat - Pengetahuan dasar",
    C2: "Memahami - Pemahaman konsep",
    C3: "Menerapkan - Aplikasi pengetahuan",
    C4: "Menganalisis - Analisis informasi",
    C5: "Mengevaluasi - Penilaian dan kritik",
    C6: "Mencipta - Kreasi dan inovasi",
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#e8f4f8] via-white to-[#f0f9fc] py-8 px-4">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-gradient-to-r from-[#336d82] to-[#2a5a6d] rounded-2xl px-6 py-4 flex items-center gap-4 shadow-xl">
            <button
              onClick={() => router.push(`/guru/kelas/${kelasId}/materi`)}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
            >
              <ArrowBackIos sx={{ fontSize: 18, color: "#336d82", ml: 0.5 }} />
            </button>
            <h1 className="text-2xl font-bold text-white font-poppins flex-1 text-center">
              Edit Kuis Materi
            </h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Preview Kuis Section */}
          <div
            className={`bg-gradient-to-br from-[#336d82] to-[#4a8a9e] rounded-3xl p-6 shadow-2xl transition-all duration-300 ${
              isDraggingOver ? "ring-4 ring-white/50 scale-[1.02]" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white font-poppins">
                Soal Terpilih untuk Kuis
              </h2>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white font-semibold text-sm">
                  {quizQuestions.length} Soal
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6 min-h-[200px]">
              {quizQuestions.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-dashed border-white/30">
                  <PlaylistAddCheck
                    sx={{ fontSize: 64, color: "white", opacity: 0.5 }}
                  />
                  <p className="text-white/70 mt-4 font-poppins text-lg">
                    {isDraggingOver
                      ? "Lepaskan soal di sini"
                      : "Drag soal ke sini atau klik 'Tambah ke Kuis'"}
                  </p>
                </div>
              ) : (
                quizQuestions.map((q, index) => (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-lg hover:shadow-xl transition-all animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-16 h-16 bg-[#336d82] rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                      {q.type}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-poppins line-clamp-2 font-semibold">
                        {q.question}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        {typeDescriptions[q.type]}
                      </p>
                    </div>
                    <button
                      onClick={() => setPreviewQuestion(q)}
                      className="px-4 py-2 bg-[#336d82] text-white rounded-full hover:bg-[#2a5a6d] transition-colors flex items-center gap-2 font-poppins text-sm shadow-md hover:shadow-lg whitespace-nowrap"
                    >
                      <Visibility sx={{ fontSize: 18 }} />
                      Preview
                    </button>
                    <button
                      onClick={() => setEditingQuestion(q)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2 font-poppins text-sm shadow-md hover:shadow-lg whitespace-nowrap"
                    >
                      <Edit sx={{ fontSize: 18 }} />
                      Edit
                    </button>
                    <button
                      onClick={() => removeFromQuiz(q.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center gap-2 font-poppins text-sm shadow-md hover:shadow-lg whitespace-nowrap"
                    >
                      <Delete sx={{ fontSize: 18 }} />
                      Hapus
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end items-center">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || quizQuestions.length === 0}
                className="bg-[#336d82] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2a5a6d] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-poppins shadow-lg flex items-center gap-2 hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle sx={{ fontSize: 20 }} />
                    Simpan Kuis ({quizQuestions.length})
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Kumpulan Soal Section */}
          <div className="bg-gradient-to-br from-[#336d82] to-[#4a8a9e] rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white font-poppins mb-6 text-center">
              Bank Soal (C1 - C6)
            </h2>

            <div className="space-y-6">
              {Object.entries(groupedQuestions).map(([type, questions]) => {
                const visibleQuestions = questions.slice(
                  0,
                  visibleCounts[type as QuestionType]
                );
                const hasMore =
                  questions.length > visibleCounts[type as QuestionType];

                return (
                  <div
                    key={type}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#336d82] font-poppins">
                          Tipe {type}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {typeDescriptions[type as QuestionType]}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="bg-[#336d82]/10 text-[#336d82] px-3 py-1 rounded-full text-sm font-semibold">
                          {questions.length} soal
                        </span>
                        <button
                          onClick={() => {
                            const newSelected = new Set(selectedQuestions);
                            questions.forEach((q) => {
                              if (
                                !quizQuestions.find((quiz) => quiz.id === q.id)
                              ) {
                                newSelected.add(q.id);
                              }
                            });
                            setSelectedQuestions(newSelected);
                          }}
                          className="bg-[#336d82] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#2a5a6d] transition-colors shadow-md"
                        >
                          Pilih Semua
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {visibleQuestions.map((q) => {
                        const isSelected = selectedQuestions.has(q.id);
                        const isInQuiz = quizQuestions.find(
                          (quiz) => quiz.id === q.id
                        );

                        return (
                          <div
                            key={q.id}
                            draggable={!isInQuiz}
                            onDragStart={() => handleDragStart(q)}
                            className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                              isInQuiz
                                ? "bg-[#336d82] text-white"
                                : "bg-[#336d82]/10 hover:bg-[#336d82]/20 hover:shadow-md cursor-grab active:cursor-grabbing"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected || !!isInQuiz}
                              onChange={() => !isInQuiz && toggleCheckbox(q.id)}
                              disabled={!!isInQuiz}
                              className="w-6 h-6 rounded border-2 border-[#336d82] cursor-pointer disabled:opacity-50 accent-[#336d82]"
                            />
                            <p
                              className={`flex-1 font-poppins line-clamp-2 ${
                                isInQuiz ? "text-white" : "text-gray-800"
                              }`}
                            >
                              {q.question}
                            </p>
                            <button
                              onClick={() => !isInQuiz && addToQuiz(q)}
                              disabled={!!isInQuiz}
                              className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 font-poppins text-sm shadow-md whitespace-nowrap ${
                                isInQuiz
                                  ? "bg-white/20 text-white cursor-not-allowed"
                                  : "bg-[#336d82] text-white hover:bg-[#2a5a6d] hover:shadow-lg"
                              }`}
                            >
                              {isInQuiz ? (
                                <>
                                  <CheckCircle sx={{ fontSize: 18 }} />
                                  Sudah Dipilih
                                </>
                              ) : (
                                <>
                                  <PlaylistAddCheck sx={{ fontSize: 18 }} />
                                  Tambah ke Kuis
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {hasMore && (
                      <button
                        onClick={() => loadMore(type as QuestionType)}
                        className="w-full mt-4 bg-[#336d82] text-white py-3 rounded-full font-semibold hover:bg-[#2a5a6d] transition-colors font-poppins shadow-md hover:shadow-lg"
                      >
                        Tampilkan lebih Banyak (
                        {questions.length - visibleCounts[type as QuestionType]}{" "}
                        lagi)
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  const selected = allQuestions.filter((q) =>
                    selectedQuestions.has(q.id)
                  );
                  selected.forEach((q) => addToQuiz(q));
                }}
                disabled={selectedQuestions.size === 0}
                className="bg-[#336d82] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2a5a6d] transition-all font-poppins shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tambah {selectedQuestions.size} Soal Terpilih ke Kuis
              </button>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {previewQuestion && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPreviewQuestion(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#336d82] rounded-xl flex items-center justify-center text-white font-bold">
                      {previewQuestion.type}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#336d82] font-poppins">
                        Preview Soal
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {typeDescriptions[previewQuestion.type]}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewQuestion(null)}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-gray-600 text-2xl leading-none">
                      ×
                    </span>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-800 font-poppins text-lg leading-relaxed mb-4">
                  {previewQuestion.fullQuestion || previewQuestion.question}
                </p>
                {previewQuestion.options && (
                  <div className="space-y-2 mt-4">
                    <p className="font-semibold text-gray-700">Pilihan Jawaban:</p>
                    {previewQuestion.options.map((option, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg ${
                          option === previewQuestion.correctAnswer
                            ? "bg-green-100 border-2 border-green-500"
                            : "bg-gray-100"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}. {option}
                        {option === previewQuestion.correctAnswer && (
                          <span className="ml-2 text-green-600 font-semibold">
                            ✓ Jawaban Benar
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setPreviewQuestion(null)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors font-poppins font-semibold"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => {
                      if (
                        !quizQuestions.find((q) => q.id === previewQuestion.id)
                      ) {
                        addToQuiz(previewQuestion);
                      }
                      setPreviewQuestion(null);
                    }}
                    disabled={
                      !!quizQuestions.find((q) => q.id === previewQuestion.id)
                    }
                    className="px-6 py-2 bg-[#336d82] text-white rounded-full hover:bg-[#2a5a6d] transition-colors font-poppins font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <PlaylistAddCheck sx={{ fontSize: 18 }} />
                    {quizQuestions.find((q) => q.id === previewQuestion.id)
                      ? "Sudah di Kuis"
                      : "Tambah ke Kuis"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default EditKuisPage;
