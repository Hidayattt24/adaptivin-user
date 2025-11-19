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
import {
  useMateriDropdown,
  useSoalList,
  useSoalCountByMateri,
  useDeleteSoal,
} from "@/hooks/guru/useSoal";
import Swal from "sweetalert2";

const SoalListPage = () => {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.kelasId as string;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedMateri, setSelectedMateri] = useState<string | null>(null);
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [previewNumber, setPreviewNumber] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch materi dropdown filtered by kelas_id
  const { data: materiList = [], isLoading: isLoadingMateri } = useMateriDropdown(kelasId);

  // Fetch soal list with kelas_id and filters
  const {
    data: soalList = [],
    isLoading: isLoadingSoal,
    error,
    refetch,
  } = useSoalList(
    kelasId,
    selectedMateri
      ? {
        materi_id: selectedMateri,
      }
      : undefined
  );

  // Fetch soal count by materi
  const { data: soalCount } = useSoalCountByMateri(selectedMateri || undefined);

  // Delete soal mutation
  const deleteSoalMutation = useDeleteSoal();

  const isLoading = isLoadingMateri || isLoadingSoal;

  // Filter soal based on search query
  const filteredSoalList = useMemo(() => {
    if (!searchQuery.trim()) return soalList;

    const searchLower = searchQuery.toLowerCase();
    return soalList.filter((soal) => {
      // Search in question text
      const inQuestionText = soal.soal_teks?.toLowerCase().includes(searchLower);
      
      // Search in answers
      const inAnswers = soal.jawaban?.some((jawab) =>
        jawab.isi_jawaban.toLowerCase().includes(searchLower)
      );
      
      // Search in explanation
      const inExplanation = soal.penjelasan?.toLowerCase().includes(searchLower);
      
      // Search in level
      const inLevel = soal.level_soal?.toLowerCase().includes(searchLower);

      return inQuestionText || inAnswers || inExplanation || inLevel;
    });
  }, [soalList, searchQuery]);

  // Calculate statistics from backend data or from current soalList
  const totalSoal = soalList.length;
  const levelStats = {
    Level1: soalCount?.level1 || soalList.filter(s => s.level_soal === 'level1').length,
    Level2: soalCount?.level2 || soalList.filter(s => s.level_soal === 'level2').length,
    Level3: soalCount?.level3 || soalList.filter(s => s.level_soal === 'level3').length,
    Level4: soalCount?.level4 || soalList.filter(s => s.level_soal === 'level4').length,
    Level5: soalCount?.level5 || soalList.filter(s => s.level_soal === 'level5').length,
    Level6: soalCount?.level6 || soalList.filter(s => s.level_soal === 'level6').length,
  };

  // Pagination - use filtered list
  const totalPages = Math.ceil(filteredSoalList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSoalList = filteredSoalList.slice(startIndex, endIndex);

  // Convert backend soal data to Question format for preview
  const convertSoalToQuestion = (soal: typeof soalList[0]): Question => {
    // Prepare answer data based on type
    let correctAnswer = "";
    let multipleChoiceOptions: Array<{ label: string; text: string; isCorrect: boolean }> | undefined;

    if (soal.tipe_jawaban === "pilihan_ganda" || soal.tipe_jawaban === "pilihan_ganda_kompleks") {
      // For multiple choice, prepare all options with correct indicator
      const labels = ["A", "B", "C", "D", "E", "F", "G", "H"];
      multipleChoiceOptions = soal.jawaban?.map((j, index) => ({
        label: labels[index] || `${index + 1}`,
        text: j.isi_jawaban,
        isCorrect: j.is_benar,
      })) || [];
      
      // For backward compatibility, also set answerText to correct answers only
      correctAnswer = soal.jawaban?.filter((j) => j.is_benar).map((j) => j.isi_jawaban).join(", ") || "";
    } else {
      // For essay/isian, just get the correct answer
      correctAnswer = soal.jawaban?.find((j) => j.is_benar)?.isi_jawaban || "";
    }

    return {
      id: soal.soal_id,
      questionType: soal.level_soal as "level1" | "level2" | "level3" | "level4" | "level5" | "level6",
      questionFile: null, // Backend returns URL string, not File
      questionFilePreview: soal.soal_gambar || null,
      questionText: soal.soal_teks,
      answerType: soal.tipe_jawaban, // Langsung gunakan dari backend
      answerFile: null, // Backend returns URL string, not File
      answerFilePreview: soal.gambar_pendukung_jawaban || null,
      answerText: correctAnswer,
      multipleChoiceOptions, // Add multiple choice options
      explanation: soal.penjelasan || "",
      timeValue: Math.floor(soal.durasi_soal / 60), // Convert seconds to minutes
      timeUnit: "Menit",
    };
  };

  const handlePreview = (soalId: string) => {
    console.log("[PREVIEW] Looking for soalId:", soalId);
    const soal = soalList.find((s) => s.soal_id === soalId);
    console.log("[PREVIEW] Found soal:", soal);
    if (soal) {
      const question = convertSoalToQuestion(soal);
      const number = soalList.findIndex((s) => s.soal_id === soalId) + 1;
      console.log("[PREVIEW] Converted question:", question);
      console.log("[PREVIEW] Question number:", number);
      setPreviewQuestion(question);
      setPreviewNumber(number);
    }
  };

  const handleEdit = (soalId: string) => {
    router.push(`/guru/kelas/${kelasId}/soal/edit/${soalId}`);
  };

  const handleDelete = async (soalId: string) => {
    const number = soalList.findIndex((s) => s.soal_id === soalId) + 1;

    const result = await Swal.fire({
      title: "Hapus Soal?",
      html: `Apakah Anda yakin ingin menghapus <strong>Soal Nomor ${number}</strong>?<br/><small class="text-gray-600">Tindakan ini tidak dapat dibatalkan.</small>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff1919",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteSoalMutation.mutateAsync(soalId);

        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Soal berhasil dihapus",
          confirmButtonColor: "#336d82",
          timer: 2000,
        });
      } catch {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Terjadi kesalahan saat menghapus soal",
          confirmButtonColor: "#336d82",
        });
      }
    }
  };

  const selectedMateriName =
    materiList.find((m) => m.materi_id === selectedMateri)?.judul_materi || "";

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
          materiList={materiList.map((m) => ({
            id: m.materi_id,
            nama: m.judul_materi,
          }))}
          selectedMateri={selectedMateri}
          onSelectMateri={(materiId) => {
            setSelectedMateri(materiId);
            setCurrentPage(1);
          }}
          className="w-full sm:w-[280px] md:w-[305px]"
        />
      </div>

      {/* Search Bar */}
      <div className="mb-4 sm:mb-5 md:mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari soal berdasarkan teks, jawaban, penjelasan, atau level..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="w-full pl-11 sm:pl-12 pr-11 sm:pr-12 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base rounded-xl sm:rounded-2xl bg-white border-2 border-gray-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#336d82] focus:border-[#336d82] transition-all duration-300 text-gray-800 placeholder-gray-500 poppins-regular"
          />
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-[#336d82]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-xs sm:text-sm text-gray-600 poppins-medium">
            Menampilkan {filteredSoalList.length} hasil dari {soalList.length} soal untuk &quot;{searchQuery}&quot;
          </p>
        )}
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
            levelStats={levelStats}
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

          {/* Soal List */}
          {soalList.length === 0 ? (
            <EmptyState
              type="empty"
              title="Belum Ada Soal"
              message="Mulai buat soal pertama untuk materi ini"
            />
          ) : filteredSoalList.length === 0 && searchQuery ? (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-8 sm:p-12 text-center">
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-gray-700 text-xl sm:text-2xl poppins-bold mb-2">
                Tidak Ada Hasil
              </h3>
              <p className="text-gray-600 text-sm sm:text-base poppins-regular mb-4">
                Tidak ada soal yang sesuai dengan pencarian &quot;{searchQuery}&quot;
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="bg-[#336d82] hover:bg-[#2a5a6d] text-white px-6 py-2.5 rounded-lg poppins-semibold transition-colors text-sm"
              >
                Hapus Pencarian
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-6 sm:mb-7 md:mb-8" role="list" aria-label="Daftar soal">
                {currentSoalList.map((soal, index) => (
                  <QuizCard
                    key={`soal-${soal.soal_id}-${index}`}
                    id={soal.soal_id}
                    question={soal.soal_teks}
                    difficulty={soal.level_soal.toUpperCase() as "Level 1" | "Level 2" | "Level 3" | "Level 4" | "Level 5" | "Level 6"}
                    normalTime={Math.floor(soal.durasi_soal / 60)}
                    onPreview={() => handlePreview(soal.soal_id)}
                    onEdit={() => handleEdit(soal.soal_id)}
                    onDelete={() => handleDelete(soal.soal_id)}
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
