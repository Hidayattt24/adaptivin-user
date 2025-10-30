"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Add as AddIcon, FolderCopy } from "@mui/icons-material";
import {
  PageHeader,
  QuizCard,
  TotalSoalCards,
  MateriSelector,
  Pagination,
  EmptyState,
  CardSkeleton,
  ErrorState,
  QuestionPreviewModal,
  type Question,
} from "@/components/guru";
import { useSoalList } from "@/hooks/guru/useSoal";
import Swal from "sweetalert2";

const SoalListPage = () => {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.kelasId as string;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [selectedMateri, setSelectedMateri] = useState<string | null>("1");
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [previewNumber, setPreviewNumber] = useState(0);

  // Lazy load soal data with React Query
  const { data: soalData, isLoading, error, refetch } = useSoalList(
    kelasId,
    selectedMateri || undefined,
    currentPage
  );

  // TODO: Replace with actual API data when backend is ready
  // For now, use dummy data as fallback
  const materiList = [
    { id: "1", nama: "Pecahan biasa & campuran" },
    { id: "2", nama: "Perkalian & Pembagian" },
    { id: "3", nama: "Geometri Bangun Datar" },
  ];

  const allQuizList = [
    {
      id: "1",
      materiId: "1",
      question:
        "Sebuah kue dipotong menjadi 12 bagian sama besar. Rani memakan 1⁄3 bagian kue. Berapa potong kue yang........",
      difficulty: "C1" as "C1" | "C2" | "C3" | "C4" | "C5" | "C6",
      normalTime: 5,
    },
    {
      id: "2",
      materiId: "1",
      question:
        "Jika 2/5 dari sebuah pizza dimakan oleh Budi, berapa bagian pizza yang tersisa?",
      difficulty: "C2" as "C1" | "C2" | "C3" | "C4" | "C5" | "C6",
      normalTime: 7,
    },
    {
      id: "3",
      materiId: "1",
      question:
        "Hitunglah hasil dari 3/4 + 1/2. Berikan jawaban dalam bentuk pecahan paling sederhana.",
      difficulty: "C3" as "C1" | "C2" | "C3" | "C4" | "C5" | "C6",
      normalTime: 6,
    },
    {
      id: "4",
      materiId: "2",
      question: "Berapa hasil dari 15 × 24?",
      difficulty: "C4" as "C1" | "C2" | "C3" | "C4" | "C5" | "C6",
      normalTime: 4,
    },
    {
      id: "5",
      materiId: "2",
      question: "Selesaikan pembagian berikut: 144 ÷ 12 = ?",
      difficulty: "C5" as "C1" | "C2" | "C3" | "C4" | "C5" | "C6",
      normalTime: 5,
    },
    {
      id: "6",
      materiId: "1",
      question: "Buatlah soal cerita tentang pecahan!",
      difficulty: "C6" as "C1" | "C2" | "C3" | "C4" | "C5" | "C6",
      normalTime: 10,
    },
  ];

  // Filter quiz by selected material
  const filteredQuizList = useMemo(() => {
    if (!selectedMateri) return allQuizList;
    return allQuizList.filter((quiz) => quiz.materiId === selectedMateri);
  }, [selectedMateri, allQuizList]);

  // Calculate statistics
  const totalSoal = filteredQuizList.length;
  const bloomStats = {
    C1: filteredQuizList.filter((q) => q.difficulty === "C1").length,
    C2: filteredQuizList.filter((q) => q.difficulty === "C2").length,
    C3: filteredQuizList.filter((q) => q.difficulty === "C3").length,
    C4: filteredQuizList.filter((q) => q.difficulty === "C4").length,
    C5: filteredQuizList.filter((q) => q.difficulty === "C5").length,
    C6: filteredQuizList.filter((q) => q.difficulty === "C6").length,
  };

  // Pagination
  const totalPages = Math.ceil(filteredQuizList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuizList = filteredQuizList.slice(startIndex, endIndex);

  // Convert quiz data to Question format for preview
  const convertToQuestion = (quiz: typeof allQuizList[0]): Question => {
    return {
      id: quiz.id,
      questionType: quiz.difficulty,
      questionFile: null,
      questionFilePreview: null,
      questionText: quiz.question,
      answerType: "Tulisan",
      answerFile: null,
      answerFilePreview: null,
      answerText: "Jawaban untuk soal ini", // Dummy answer
      timeValue: quiz.normalTime,
      timeUnit: "Menit",
    };
  };

  const handlePreview = (quizId: string) => {
    const quiz = allQuizList.find((q) => q.id === quizId);
    if (quiz) {
      const question = convertToQuestion(quiz);
      const number = allQuizList.findIndex((q) => q.id === quizId) + 1;
      setPreviewQuestion(question);
      setPreviewNumber(number);
    }
  };

  const handleDelete = (quizId: string) => {
    const quiz = allQuizList.find((q) => q.id === quizId);
    const number = allQuizList.findIndex((q) => q.id === quizId) + 1;

    Swal.fire({
      title: "Hapus Soal?",
      html: `Apakah Anda yakin ingin menghapus <strong>Soal Nomor ${number}</strong>?<br/><small class="text-gray-600">Tindakan ini tidak dapat dibatalkan.</small>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff1919",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Implement actual delete logic with API
        console.log("Delete quiz:", quizId);

        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Soal berhasil dihapus",
          confirmButtonColor: "#336d82",
          timer: 2000,
        });
      }
    });
  };

  const selectedMateriName =
    materiList.find((m) => m.id === selectedMateri)?.nama || "";

  return (
    <div className="pb-20 sm:pb-20 md:pb-8">
      {/* Header Banner */}
      <PageHeader
        title="Kelola Soal"
        actionLabel="Tambah Soal"
        actionHref={`/guru/kelas/${kelasId}/soal/tambah`}
        actionIcon={<AddIcon className="text-white" sx={{ fontSize: { xs: 18, sm: 20 } }} />}
        className="mb-6 sm:mb-7 md:mb-8"
      />

      {/* Selected Material Name & Material Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
        <h2 className="text-[#336d82] text-xl sm:text-2xl md:text-3xl poppins-semibold">
          {selectedMateriName}
        </h2>
        <MateriSelector
          materiList={materiList}
          selectedMateri={selectedMateri}
          onSelectMateri={(materiId) => {
            setSelectedMateri(materiId);
            setCurrentPage(1);
          }}
          className="w-full sm:w-[280px] md:w-[305px]"
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <>
          {/* Skeleton for Total Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-7 md:mb-8">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>

          {/* Section Title Skeleton */}
          <div className="h-6 sm:h-7 md:h-8 bg-gray-200 rounded w-48 sm:w-56 md:w-64 mb-4 sm:mb-5 md:mb-6 animate-pulse"></div>

          {/* Skeleton for Quiz Cards */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-6 sm:mb-7 md:mb-8">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </>
      ) : error ? (
        /* Error State */
        <ErrorState
          title="Gagal Memuat Soal"
          message="Terjadi kesalahan saat memuat daftar soal. Silakan coba lagi."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          {/* Total Soal Cards */}
          <TotalSoalCards
            totalSoal={totalSoal}
            bloomStats={bloomStats}
            className="mb-6 sm:mb-7 md:mb-8"
          />

          {/* Section Title with Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
            <h3 className="text-[#336d82] text-lg sm:text-xl md:text-2xl poppins-semibold">
              Kumpulan Bank Soal
            </h3>
            <button
              onClick={() => router.push(`/guru/kelas/${kelasId}/soal/bank`)}
              className="bg-gradient-to-r from-[#336d82] to-[#2a5a6d] hover:from-[#2a5a6d] hover:to-[#1f4a5a] text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base poppins-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <FolderCopy sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <span className="hidden sm:inline">Lihat Semua Bank Soal</span>
              <span className="sm:hidden">Bank Soal</span>
            </button>
          </div>

          {/* Quiz List */}
          {filteredQuizList.length === 0 ? (
            <EmptyState
              type="empty"
              title="Belum Ada Soal"
              message="Mulai buat soal pertama untuk materi ini"
            />
          ) : (
            <>
              <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-6 sm:mb-7 md:mb-8" role="list" aria-label="Daftar soal">
                {currentQuizList.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    id={quiz.id}
                    question={quiz.question}
                    difficulty={quiz.difficulty}
                    normalTime={quiz.normalTime}
                    onPreview={() => handlePreview(quiz.id)}
                    onDelete={() => handleDelete(quiz.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="mt-6 sm:mt-7 md:mt-8"
                />
              )}
            </>
          )}
        </>
      )}

      {/* Preview Modal */}
      <QuestionPreviewModal
        isOpen={!!previewQuestion}
        question={previewQuestion}
        questionNumber={previewNumber}
        onClose={() => setPreviewQuestion(null)}
      />
    </div>
  );
};

export default SoalListPage;
