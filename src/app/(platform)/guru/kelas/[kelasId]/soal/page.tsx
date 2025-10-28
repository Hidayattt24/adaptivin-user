"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "@/components/guru/PageHeader";
import QuizCard from "@/components/guru/QuizCard";
import TotalSoalCards from "@/components/guru/TotalSoalCards";
import MateriSelector from "@/components/guru/MateriSelector";
import Pagination from "@/components/guru/Pagination";
import EmptyState from "@/components/guru/EmptyState";
import { useSoalList } from "@/hooks/guru/useSoal";
import { CardSkeleton } from "@/components/guru/skeletons/CardSkeleton";
import { ErrorState } from "@/components/guru/ErrorState";

const SoalListPage = () => {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.kelasId as string;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [selectedMateri, setSelectedMateri] = useState<string | null>("1");

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
      difficulty: "C1" as const,
      normalTime: 5,
    },
    {
      id: "2",
      materiId: "1",
      question:
        "Jika 2/5 dari sebuah pizza dimakan oleh Budi, berapa bagian pizza yang tersisa?",
      difficulty: "C2" as const,
      normalTime: 7,
    },
    {
      id: "3",
      materiId: "1",
      question:
        "Hitunglah hasil dari 3/4 + 1/2. Berikan jawaban dalam bentuk pecahan paling sederhana.",
      difficulty: "C1" as const,
      normalTime: 6,
    },
    {
      id: "4",
      materiId: "2",
      question: "Berapa hasil dari 15 × 24?",
      difficulty: "C1" as const,
      normalTime: 4,
    },
    {
      id: "5",
      materiId: "2",
      question: "Selesaikan pembagian berikut: 144 ÷ 12 = ?",
      difficulty: "C2" as const,
      normalTime: 5,
    },
  ];

  // Filter quiz by selected material
  const filteredQuizList = useMemo(() => {
    if (!selectedMateri) return allQuizList;
    return allQuizList.filter((quiz) => quiz.materiId === selectedMateri);
  }, [selectedMateri, allQuizList]);

  // Calculate statistics
  const totalSoal = filteredQuizList.length;
  const totalC1 = filteredQuizList.filter((q) => q.difficulty === "C1").length;
  const totalC2 = filteredQuizList.filter((q) => q.difficulty === "C2").length;

  // Pagination
  const totalPages = Math.ceil(filteredQuizList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuizList = filteredQuizList.slice(startIndex, endIndex);

  const handleEdit = (quizId: string) => {
    router.push(`/guru/kelas/${kelasId}/soal/${quizId}/edit`);
  };

  const handleDelete = (quizId: string) => {
    // Implement delete logic
    console.log("Delete quiz:", quizId);
  };

  const selectedMateriName =
    materiList.find((m) => m.id === selectedMateri)?.nama || "";

  return (
    <div className="pb-12">
      {/* Header Banner */}
      <PageHeader
        title="Kelola Soal"
        actionLabel="Tambah Soal"
        actionHref={`/guru/kelas/${kelasId}/soal/tambah`}
        actionIcon={<AddIcon className="text-white" sx={{ fontSize: 20 }} />}
        className="mb-8"
      />

      {/* Selected Material Name & Material Selector */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#336d82] text-3xl poppins-semibold">
          {selectedMateriName}
        </h2>
        <MateriSelector
          materiList={materiList}
          selectedMateri={selectedMateri}
          onSelectMateri={(materiId) => {
            setSelectedMateri(materiId);
            setCurrentPage(1);
          }}
          className="w-[305px]"
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <>
          {/* Skeleton for Total Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>

          {/* Section Title Skeleton */}
          <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>

          {/* Skeleton for Quiz Cards */}
          <div className="space-y-6 mb-8">
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
            totalC1={totalC1}
            totalC2={totalC2}
            className="mb-8"
          />

          {/* Section Title */}
          <h3 className="text-[#336d82] text-2xl poppins-semibold mb-6">
            Kumpulan Bank Soal
          </h3>

          {/* Quiz List */}
          {filteredQuizList.length === 0 ? (
            <EmptyState
              type="empty"
              title="Belum Ada Soal"
              message="Mulai buat soal pertama untuk materi ini"
            />
          ) : (
            <>
              <div className="space-y-6 mb-8" role="list" aria-label="Daftar soal">
                {currentQuizList.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    id={quiz.id}
                    question={quiz.question}
                    difficulty={quiz.difficulty}
                    normalTime={quiz.normalTime}
                    onEdit={() => handleEdit(quiz.id)}
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
                  className="mt-8"
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SoalListPage;
