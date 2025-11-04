"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowBackIos, Add, CheckCircle } from "@mui/icons-material";
import {
  PreviewModal,
  QuestionSection,
  MateriDropdownSelector,
  type Question,
} from "@/components/guru";
import {
  useMateriDropdown,
  useCreateSoal,
} from "@/hooks/guru/useSoal";
import Swal from "sweetalert2";

const TambahSoalPage = () => {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.kelasId as string;

  // Fetch materi dropdown from API
  const { data: materiList = [], isLoading: isLoadingMateri } = useMateriDropdown();

  // Create soal mutation
  const createSoalMutation = useCreateSoal();

  const [selectedMateri, setSelectedMateri] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      questionType: "C1",
      questionFile: null,
      questionFilePreview: null,
      questionText: "",
      answerType: "isian_singkat",
      answerFile: null,
      answerFilePreview: null,
      answerText: "",
      explanation: "",
      timeValue: 5,
      timeUnit: "Menit",
    },
  ]);

  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    type: "image" | "video" | "pdf";
    src: string;
    fileName: string;
  }>({
    isOpen: false,
    type: "image",
    src: "",
    fileName: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add new question section
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      questionType: "C1",
      questionFile: null,
      questionFilePreview: null,
      questionText: "",
      answerType: "isian_singkat",
      answerFile: null,
      answerFilePreview: null,
      answerText: "",
      explanation: "",
      timeValue: 5,
      timeUnit: "Menit",
    };
    setQuestions([...questions, newQuestion]);
  };

  // Remove question section
  const handleRemoveQuestion = (id: string) => {
    if (questions.length === 1) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian!",
        text: "Minimal harus ada 1 soal!",
        confirmButtonColor: "#336d82",
      });
      return;
    }
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Update question field
  const updateQuestion = <K extends keyof Question>(id: string, field: K, value: Question[K]) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  // Handle file upload for question
  const handleQuestionFileUpload = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update both fields at once to prevent state batching issues
        setQuestions(
          questions.map((q) =>
            q.id === id
              ? { ...q, questionFile: file, questionFilePreview: reader.result as string }
              : q
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file upload for answer
  const handleAnswerFileUpload = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update both fields at once to prevent state batching issues
        setQuestions(
          questions.map((q) =>
            q.id === id
              ? { ...q, answerFile: file, answerFilePreview: reader.result as string }
              : q
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded file
  const handleRemoveFile = (id: string, type: "question" | "answer") => {
    // Update both fields at once to prevent state batching issues
    if (type === "question") {
      setQuestions(
        questions.map((q) =>
          q.id === id
            ? { ...q, questionFile: null, questionFilePreview: null }
            : q
        )
      );
    } else {
      setQuestions(
        questions.map((q) =>
          q.id === id
            ? { ...q, answerFile: null, answerFilePreview: null }
            : q
        )
      );
    }
  };

  // Preview file
  const handlePreviewFile = (src: string, fileName: string) => {
    const fileType = fileName.toLowerCase().endsWith(".pdf")
      ? "pdf"
      : fileName.match(/\.(mp4|webm|ogg)$/i)
        ? "video"
        : "image";

    setPreviewModal({
      isOpen: true,
      type: fileType,
      src,
      fileName,
    });
  };

  // Validate form
  const validateForm = () => {
    // Check if materi is selected
    if (!selectedMateri) {
      Swal.fire({
        icon: "warning",
        title: "Materi Belum Dipilih",
        text: "Silakan pilih materi terlebih dahulu!",
        confirmButtonColor: "#336d82",
      });
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim() && !q.questionFile) {
        Swal.fire({
          icon: "warning",
          title: "Pertanyaan Kosong",
          text: `Soal nomor ${i + 1} harus memiliki pertanyaan (teks atau file)!`,
          confirmButtonColor: "#336d82",
        });
        return false;
      }
      if (!q.answerText.trim() && !q.answerFile) {
        Swal.fire({
          icon: "warning",
          title: "Jawaban Kosong",
          text: `Soal nomor ${i + 1} harus memiliki jawaban (teks atau file)!`,
          confirmButtonColor: "#336d82",
        });
        return false;
      }
      if (q.timeValue <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Durasi Tidak Valid",
          text: `Waktu menjawab soal nomor ${i + 1} harus lebih dari 0!`,
          confirmButtonColor: "#336d82",
        });
        return false;
      }
    }
    return true;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const selectedMateriName =
      materiList.find((m) => m.materi_id === selectedMateri)?.judul_materi || "";

    const result = await Swal.fire({
      title: "Konfirmasi Penyimpanan",
      html: `Anda akan menyimpan <strong>${questions.length} soal</strong> untuk materi <strong>"${selectedMateriName}"</strong>. Lanjutkan?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#336d82",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Simpan!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);

    try {
      // Process each question
      let successCount = 0;
      let errorCount = 0;

      for (const q of questions) {
        try {
          // Parse jawaban berdasarkan answerType
          let jawaban: Array<{ isi_jawaban: string; is_benar: boolean }> = [];

          if (q.answerType === "pilihan_ganda") {
            // Split by new lines or commas for multiple choice
            const answers = q.answerText
              .split(/[\n,]/)
              .map((a) => a.trim())
              .filter((a) => a.length > 0);

            if (answers.length === 0) {
              throw new Error("Jawaban tidak valid");
            }

            // Untuk pilihan ganda, setiap pilihan adalah entry terpisah
            // Jawaban pertama dianggap benar
            jawaban = answers.map((ans, idx) => ({
              isi_jawaban: ans,
              is_benar: idx === 0, // Jawaban pertama dianggap benar
            }));
          } else if (q.answerType === "isian_singkat") {
            // Isian singkat - hanya 1 jawaban benar
            jawaban = [{ isi_jawaban: q.answerText.trim(), is_benar: true }];
          } else if (q.answerType === "angka") {
            // Angka - hanya 1 jawaban benar
            jawaban = [{ isi_jawaban: q.answerText.trim(), is_benar: true }];
          }

          // Create soal payload
          const payload = {
            materi_id: selectedMateri!,
            level_soal: q.questionType.toLowerCase() as "c1" | "c2" | "c3" | "c4" | "c5" | "c6",
            tipe_jawaban: q.answerType, // Langsung gunakan value dari dropdown
            soal_teks: q.questionText,
            soal_gambar: q.questionFile || undefined,
            penjelasan: q.explanation || undefined,
            gambar_pendukung_jawaban: q.answerFile || undefined,
            durasi_soal: q.timeValue, // Already in minutes, backend will convert
            jawaban: jawaban,
          };

          await createSoalMutation.mutateAsync(payload);
          successCount++;
        } catch (error) {
          console.error("Error creating soal:", error);
          errorCount++;
        }
      }

      setIsSubmitting(false);

      if (errorCount === 0) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: `${successCount} soal berhasil disimpan untuk materi "${selectedMateriName}"!`,
          confirmButtonColor: "#336d82",
        });
        router.push(`/guru/kelas/${kelasId}/soal`);
      } else {
        await Swal.fire({
          icon: "warning",
          title: "Sebagian Berhasil",
          text: `${successCount} soal berhasil disimpan, ${errorCount} soal gagal. Silakan coba lagi.`,
          confirmButtonColor: "#336d82",
        });
      }
    } catch {
      setIsSubmitting(false);
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menyimpan soal. Silakan coba lagi.",
        confirmButtonColor: "#336d82",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#e8f4f8] via-white to-[#f0f9fc] py-8 px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-gradient-to-r from-[#336d82] to-[#2a5a6d] rounded-2xl px-6 py-4 flex items-center gap-4 shadow-xl">
            <button
              onClick={() => router.push(`/guru/kelas/${kelasId}/soal`)}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
            >
              <ArrowBackIos sx={{ fontSize: 18, color: "#336d82", ml: 0.5 }} />
            </button>
            <h1 className="text-2xl font-bold text-white font-poppins flex-1 text-center">
              TAMBAH SOAL
            </h1>
          </div>
        </div>

        {/* Materi Selector */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-[#336d82]/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-2xl">📚</span>
              </div>
              <div>
                <h2 className="text-[#336d82] text-lg poppins-semibold">
                  Pilih Materi
                </h2>
                <p className="text-gray-600 text-sm poppins-regular">
                  Soal-soal ini akan dikaitkan dengan materi yang dipilih
                </p>
              </div>
            </div>

            {isLoadingMateri ? (
              <div className="animate-pulse bg-gray-200 h-12 rounded-lg"></div>
            ) : (
              <MateriDropdownSelector
                materiList={materiList.map((m) => ({
                  id: m.materi_id,
                  judul: m.judul_materi,
                }))}
                selectedMateri={selectedMateri}
                onSelectMateri={setSelectedMateri}
              />
            )}

            {!selectedMateri && !isLoadingMateri && (
              <p className="text-amber-600 text-sm poppins-medium mt-3 flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                Silakan pilih materi terlebih dahulu sebelum membuat soal
              </p>
            )}
          </div>
        </div>

        {/* Questions Container */}
        <div className="max-w-4xl mx-auto space-y-6">
          {questions.map((question, index) => (
            <QuestionSection
              key={question.id}
              question={question}
              index={index}
              onUpdate={updateQuestion}
              onRemove={handleRemoveQuestion}
              onQuestionFileUpload={handleQuestionFileUpload}
              onAnswerFileUpload={handleAnswerFileUpload}
              onRemoveFile={handleRemoveFile}
              onPreviewFile={handlePreviewFile}
              canDelete={questions.length > 1}
            />
          ))}

          {/* Add Question Button - Full Width */}
          <div className="w-full">
            <button
              onClick={handleAddQuestion}
              type="button"
              className="w-full bg-white text-[#336d82] px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all font-poppins shadow-lg flex items-center justify-center gap-3 border-2 border-[#336d82] hover:scale-[1.02] text-lg"
            >
              <Add sx={{ fontSize: 28 }} />
              Tambah Soal Baru
            </button>
          </div>

          {/* Submit Button - Full Width */}
          <div className="w-full pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              type="button"
              className="w-full bg-gradient-to-r from-[#336d82] to-[#2a5a6d] text-white px-12 py-5 rounded-2xl font-bold hover:from-[#2a5a6d] hover:to-[#336d82] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-poppins shadow-xl flex items-center justify-center gap-3 text-xl hover:scale-[1.02]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Menyimpan Soal...
                </>
              ) : (
                <>
                  <CheckCircle sx={{ fontSize: 28 }} />
                  Konfirmasi & Simpan ({questions.length} Soal)
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={previewModal.isOpen}
        onClose={() =>
          setPreviewModal({ ...previewModal, isOpen: false })
        }
        type={previewModal.type}
        src={previewModal.src}
        fileName={previewModal.fileName}
      />
    </>
  );
};

export default TambahSoalPage;
