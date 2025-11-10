"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowBackIos, CheckCircle } from "@mui/icons-material";
import {
  PreviewModal,
  QuestionSection,
  MateriDropdownSelector,
  CardSkeleton,
  ErrorState,
  type Question,
} from "@/components/guru";
import {
  useMateriDropdown,
  useSoalDetail,
  useUpdateSoal,
} from "@/hooks/guru/useSoal";
import Swal from "sweetalert2";

const EditSoalPage = () => {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.kelasId as string;
  const soalId = params.soalId as string;

  // Fetch materi dropdown from API
  const { data: materiList = [], isLoading: isLoadingMateri } = useMateriDropdown();

  // Fetch soal detail
  const { data: soalData, isLoading: isLoadingSoal, error: errorSoal } = useSoalDetail(soalId);

  // Update soal mutation
  const updateSoalMutation = useUpdateSoal();

  const [selectedMateri, setSelectedMateri] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);

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

  // Load soal data when fetched
  useEffect(() => {
    if (soalData) {
      setSelectedMateri(soalData.materi_id);

      // Convert soal data to Question format
      let correctAnswer = "";
      const multipleChoiceOptions: Array<{ label: string; text: string; isCorrect: boolean }> = [
        { label: 'A', text: '', isCorrect: false },
        { label: 'B', text: '', isCorrect: false },
        { label: 'C', text: '', isCorrect: false },
        { label: 'D', text: '', isCorrect: false },
      ];

      if (soalData.tipe_jawaban === "pilihan_ganda" || soalData.tipe_jawaban === "pilihan_ganda_kompleks") {
        // Parse jawaban dari backend ke format multipleChoiceOptions
        if (soalData.jawaban && soalData.jawaban.length > 0) {
          soalData.jawaban.forEach((jawab, idx) => {
            if (idx < 4) { // Maksimal 4 pilihan (A, B, C, D)
              // Extract text dari format "A. text" atau langsung "text"
              const text = jawab.isi_jawaban.replace(/^[A-D]\.\s*/, '');
              multipleChoiceOptions[idx] = {
                label: String.fromCharCode(65 + idx), // A, B, C, D
                text: text,
                isCorrect: jawab.is_benar,
              };
            }
          });
        }
        correctAnswer = ""; // Tidak perlu answerText untuk pilihan ganda
      } else {
        correctAnswer = soalData.jawaban?.find((j) => j.is_benar)?.isi_jawaban || "";
      }

      setQuestion({
        id: soalData.soal_id,
        questionType: soalData.level_soal.toUpperCase() as "level1" | "level2" | "level3" | "level4" | "level5" | "level6",
        questionFile: null,
        questionFilePreview: soalData.soal_gambar || null,
        questionText: soalData.soal_teks,
        answerType: soalData.tipe_jawaban,
        answerFile: null,
        answerFilePreview: soalData.gambar_pendukung_jawaban || null,
        answerText: correctAnswer,
        explanation: soalData.penjelasan || "",
        // ⭐ Backend menyimpan dalam detik, convert untuk display
        timeValue: soalData.durasi_soal, // Store dalam detik
        timeUnit: "Detik", // Default ke Detik
        multipleChoiceOptions: multipleChoiceOptions,
      });
    }
  }, [soalData]);

  // Update question field
  const updateQuestion = <K extends keyof Question>(id: string, field: K, value: Question[K]) => {
    if (question && question.id === id) {
      setQuestion({ ...question, [field]: value });
    }
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
        if (question && question.id === id) {
          setQuestion({
            ...question,
            questionFile: file,
            questionFilePreview: reader.result as string
          });
        }
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
        if (question && question.id === id) {
          setQuestion({
            ...question,
            answerFile: file,
            answerFilePreview: reader.result as string
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded file
  const handleRemoveFile = (id: string, type: "question" | "answer") => {
    if (question && question.id === id) {
      if (type === "question") {
        setQuestion({ ...question, questionFile: null, questionFilePreview: null });
      } else {
        setQuestion({ ...question, answerFile: null, answerFilePreview: null });
      }
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

    if (!question) return false;

    if (!question.questionText.trim() && !question.questionFile && !question.questionFilePreview) {
      Swal.fire({
        icon: "warning",
        title: "Pertanyaan Kosong",
        text: "Soal harus memiliki pertanyaan (teks atau gambar)!",
        confirmButtonColor: "#336d82",
      });
      return false;
    }

    // Validasi jawaban berdasarkan tipe
    if (question.answerType === "pilihan_ganda" || question.answerType === "pilihan_ganda_kompleks") {
      // Check apakah ada pilihan yang diisi
      const hasOptions = question.multipleChoiceOptions?.some(opt => opt.text.trim().length > 0);
      if (!hasOptions) {
        Swal.fire({
          icon: "warning",
          title: "Pilihan Kosong",
          text: "Soal harus memiliki minimal 1 pilihan jawaban!",
          confirmButtonColor: "#336d82",
        });
        return false;
      }

      // Check apakah ada jawaban yang dipilih sebagai benar
      const hasCorrectAnswer = question.multipleChoiceOptions?.some(opt => opt.isCorrect && opt.text.trim().length > 0);
      if (!hasCorrectAnswer) {
        Swal.fire({
          icon: "warning",
          title: "Jawaban Benar Belum Dipilih",
          text: "Soal harus memiliki minimal 1 jawaban yang ditandai benar!",
          confirmButtonColor: "#336d82",
        });
        return false;
      }
    } else if (question.answerType === "isian_singkat") {
      if (!question.answerText.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Jawaban Kosong",
          text: "Soal harus memiliki jawaban!",
          confirmButtonColor: "#336d82",
        });
        return false;
      }
    }

    if (question.timeValue <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Durasi Tidak Valid",
        text: "Waktu menjawab harus lebih dari 0!",
        confirmButtonColor: "#336d82",
      });
      return false;
    }
    return true;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm() || !question) return;

    const selectedMateriName =
      materiList.find((m) => m.materi_id === selectedMateri)?.judul_materi || "";

    const result = await Swal.fire({
      title: "Konfirmasi Update",
      html: `Anda akan mengupdate soal untuk materi <strong>"${selectedMateriName}"</strong>. Lanjutkan?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#336d82",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Update!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);

    try {
      // Parse jawaban berdasarkan answerType
      let jawaban: Array<{ isi_jawaban: string; is_benar: boolean }> = [];

      if (question.answerType === "pilihan_ganda") {
        // Gunakan multipleChoiceOptions untuk pilihan ganda
        if (!question.multipleChoiceOptions || question.multipleChoiceOptions.every(opt => !opt.text.trim())) {
          throw new Error("Jawaban pilihan ganda tidak valid");
        }

        // Filter options yang ada textnya dan map ke format jawaban
        jawaban = question.multipleChoiceOptions
          .filter(opt => opt.text.trim().length > 0)
          .map((opt) => ({
            isi_jawaban: `${opt.label}. ${opt.text}`,
            is_benar: opt.isCorrect,
          }));

        // Validasi minimal ada 1 jawaban benar
        if (!jawaban.some(j => j.is_benar)) {
          throw new Error("Pilihan ganda harus memiliki minimal 1 jawaban benar");
        }
      } else if (question.answerType === "pilihan_ganda_kompleks") {
        // Gunakan multipleChoiceOptions untuk pilihan ganda kompleks
        if (!question.multipleChoiceOptions || question.multipleChoiceOptions.every(opt => !opt.text.trim())) {
          throw new Error("Jawaban pilihan ganda kompleks tidak valid");
        }

        // Filter options yang ada textnya dan map ke format jawaban
        jawaban = question.multipleChoiceOptions
          .filter(opt => opt.text.trim().length > 0)
          .map((opt) => ({
            isi_jawaban: `${opt.label}. ${opt.text}`,
            is_benar: opt.isCorrect,
          }));

        // Validasi minimal ada 1 jawaban benar
        if (!jawaban.some(j => j.is_benar)) {
          throw new Error("Pilihan ganda kompleks harus memiliki minimal 1 jawaban benar");
        }
      } else if (question.answerType === "isian_singkat") {
        jawaban = [{ isi_jawaban: question.answerText.trim(), is_benar: true }];
      }

      // ⭐ Convert durasi_soal to minutes if input is in seconds (same as create)
      let durasiMenit = question.timeValue;
      if (question.timeUnit === "Detik") {
        // Convert detik ke menit (backend expects minutes)
        durasiMenit = question.timeValue / 60;
      }

      // Create update payload with proper typing
      const payload: {
        materi_id: string;
        level_soal: "level1" | "level2" | "level3" | "level4" | "level5" | "level6";
        tipe_jawaban: "pilihan_ganda" | "pilihan_ganda_kompleks" | "isian_singkat";
        soal_teks: string;
        penjelasan?: string;
        durasi_soal: number;
        jawaban: Array<{ isi_jawaban: string; is_benar: boolean }>;
        soal_gambar?: File;
        hapus_soal_gambar?: boolean;
        gambar_pendukung_jawaban?: File;
        hapus_gambar_pendukung?: boolean;
      } = {
        materi_id: selectedMateri!,
        level_soal: question.questionType.toLowerCase() as "level1" | "level2" | "level3" | "level4" | "level5" | "level6",
        tipe_jawaban: question.answerType,
        soal_teks: question.questionText,
        penjelasan: question.explanation || undefined,
        durasi_soal: durasiMenit,
        jawaban: jawaban,
      };

      // Debug: Check question state before processing files
      console.log("[EDIT] Question state before processing:", {
        questionFile: question.questionFile,
        questionFilePreview: question.questionFilePreview ? "exists" : "null",
        answerFile: question.answerFile,
        answerFilePreview: question.answerFilePreview ? "exists" : "null",
      });

      // Handle question image
      if (question.questionFile) {
        payload.soal_gambar = question.questionFile;
        console.log("[EDIT] Adding soal_gambar File:", question.questionFile.name, question.questionFile.type);
      } else if (!question.questionFilePreview && soalData?.soal_gambar) {
        payload.hapus_soal_gambar = true;
        console.log("[EDIT] Marking soal_gambar for deletion");
      } else {
        console.log("[EDIT] No soal_gambar changes");
      }

      // Handle answer image
      if (question.answerFile) {
        payload.gambar_pendukung_jawaban = question.answerFile;
        console.log("[EDIT] Adding gambar_pendukung_jawaban File:", question.answerFile.name, question.answerFile.type);
      } else if (!question.answerFilePreview && soalData?.gambar_pendukung_jawaban) {
        payload.hapus_gambar_pendukung = true;
        console.log("[EDIT] Marking gambar_pendukung for deletion");
      } else {
        console.log("[EDIT] No gambar_pendukung changes");
      }

      console.log("[EDIT] Final payload:", {
        ...payload,
        soal_gambar: payload.soal_gambar ? `File: ${payload.soal_gambar.name}` : undefined,
        gambar_pendukung_jawaban: payload.gambar_pendukung_jawaban ? `File: ${payload.gambar_pendukung_jawaban.name}` : undefined,
      });

      await updateSoalMutation.mutateAsync({
        soal_id: soalId,
        payload,
      });

      setIsSubmitting(false);

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Soal berhasil diupdate!",
        confirmButtonColor: "#336d82",
      });
      router.push(`/guru/kelas/${kelasId}/soal`);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error updating soal:", error);
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat mengupdate soal. Silakan coba lagi.",
        confirmButtonColor: "#336d82",
      });
    }
  };

  // Loading state
  if (isLoadingSoal || isLoadingMateri) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f4f8] via-white to-[#f0f9fc] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <CardSkeleton />
          <div className="mt-6">
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (errorSoal || !soalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f4f8] via-white to-[#f0f9fc] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <ErrorState
            title="Soal Tidak Ditemukan"
            message="Soal yang Anda cari tidak ditemukan atau sudah dihapus."
            onRetry={() => router.push(`/guru/kelas/${kelasId}/soal`)}
          />
        </div>
      </div>
    );
  }

  if (!question) return null;

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
              EDIT SOAL
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
                  Soal ini akan dikaitkan dengan materi yang dipilih
                </p>
              </div>
            </div>

            <MateriDropdownSelector
              materiList={materiList.map((m) => ({
                id: m.materi_id,
                judul: m.judul_materi,
              }))}
              selectedMateri={selectedMateri}
              onSelectMateri={setSelectedMateri}
            />
          </div>
        </div>

        {/* Question Section */}
        <div className="max-w-4xl mx-auto space-y-6">
          <QuestionSection
            question={question}
            index={0}
            onUpdate={updateQuestion}
            onRemove={() => { }}
            onQuestionFileUpload={handleQuestionFileUpload}
            onAnswerFileUpload={handleAnswerFileUpload}
            onRemoveFile={handleRemoveFile}
            onPreviewFile={handlePreviewFile}
            canDelete={false}
          />

          {/* Submit Button */}
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
                  Mengupdate Soal...
                </>
              ) : (
                <>
                  <CheckCircle sx={{ fontSize: 28 }} />
                  Update Soal
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

export default EditSoalPage;
