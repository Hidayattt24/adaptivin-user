"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  StudentSearchBar,
  PerformanceChart,
  MateriProgressCard,
  CardSkeleton,
  ChartSkeleton,
  ErrorState,
  GrafikPerkembanganModal,
  HasilKuisModal,
  AnalisaAIModal,
} from "@/components/guru";
import { useStudentReport, useHasilKuisDetail } from "@/hooks/guru/useLaporan";
import { useSiswaList } from "@/hooks/guru/useSiswa";

const LaporanKelasPage = () => {
  const params = useParams();
  const kelasId = params.kelasId as string;

  // States
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedCardMateri, setSelectedCardMateri] = useState<string | null>(null);
  const [showGrafikModal, setShowGrafikModal] = useState(false);
  const [showKuisModal, setShowKuisModal] = useState(false);
  const [showAnalisaModal, setShowAnalisaModal] = useState(false);

  // Queries
  const siswaQuery = useSiswaList(kelasId);
  const siswaItems = useMemo(() => siswaQuery.data?.items || [], [siswaQuery.data?.items]);

  // Initialize selected student when data loads
  React.useEffect(() => {
    if (!selectedStudent && siswaItems.length > 0) {
      setSelectedStudent(siswaItems[0].id);
    }
  }, [siswaItems, selectedStudent]);

  // Get student report
  const studentReport = useStudentReport(
    kelasId,
    selectedStudent || ""
  );

  // Get hasil kuis detail for selected material
  const hasilKuisDetail = useHasilKuisDetail(
    kelasId,
    selectedStudent || "",
    selectedCardMateri || ""
  );

  const currentReport = studentReport.data;
  const isLoading = siswaQuery.isLoading || studentReport.isLoading;
  const error = siswaQuery.error || studentReport.error;

  // Get performance data for chart - shows overall performance
  // Transform level names from "level1" to "C1" format for chart compatibility
  const performanceData = useMemo(() => {
    if (!currentReport) return [];

    const levelMap: Record<string, string> = {
      level1: "C1",
      level2: "C2",
      level3: "C3",
      level4: "C4",
      level5: "C5",
      level6: "C6",
    };

    return currentReport.performanceByLevel.map((item) => ({
      level: levelMap[item.level] || item.level,
      benar: item.benar,
      salah: item.salah,
    })) as Array<{ level: "C1" | "C2" | "C3" | "C4" | "C5" | "C6"; benar: number; salah: number }>;
  }, [currentReport]);

  // Get all materials for the selected student
  const studentMaterials = useMemo(() => {
    if (!currentReport) return [];
    return currentReport.materiProgress;
  }, [currentReport]);

  // Get the currently selected material for the card
  const currentCardMateri = useMemo(() => {
    if (!currentReport || !studentMaterials.length) return null;

    // If a material is selected, use it
    if (selectedCardMateri) {
      return studentMaterials.find(m => m.materiId === selectedCardMateri) || studentMaterials[0];
    }

    // Default to first material
    return studentMaterials[0];
  }, [currentReport, studentMaterials, selectedCardMateri]);

  // Set initial selected material when student changes
  React.useEffect(() => {
    if (studentMaterials.length > 0 && !selectedCardMateri) {
      setSelectedCardMateri(studentMaterials[0].materiId);
    }
  }, [studentMaterials, selectedCardMateri]);

  // Reset selected material when student changes
  React.useEffect(() => {
    if (studentMaterials.length > 0) {
      setSelectedCardMateri(studentMaterials[0].materiId);
    }
  }, [selectedStudent, studentMaterials]);

  // Prepare data for modals based on selected material
  const currentMaterialData = useMemo(() => {
    if (!currentCardMateri) return null;
    return {
      performanceByLevel: currentCardMateri.performanceByLevel || [],
      analisis: currentCardMateri.analisis,
    };
  }, [currentCardMateri]);

  // Prepare quiz results for modal
  const quizResults = useMemo(() => {
    if (!hasilKuisDetail.data || hasilKuisDetail.data.length === 0) return [];

    // Get the latest quiz result
    const latestQuiz = hasilKuisDetail.data[0];

    return latestQuiz.detailJawaban.map((detail) => ({
      id: detail.id, // Add unique id for React key
      soalId: detail.soalId,
      pertanyaan: detail.pertanyaan,
      tipesoal: detail.tipeSoal,
      jawabanSiswa: detail.jawabanSiswa,
      jawabanBenar: detail.jawabanBenar, // Use actual correct answer from backend
      isCorrect: detail.isCorrect,
      waktuJawab: detail.waktuJawab,
    }));
  }, [hasilKuisDetail.data]);

  const refetch = () => {
    siswaQuery.refetch();
    studentReport.refetch();
  };

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 lg:p-6 pb-20 sm:pb-20 lg:pb-6">
      {/* Header Section with Search */}
      <div className="mb-4 sm:mb-5 lg:mb-6">
        <div className="bg-gradient-to-r from-[#336D82] to-[#ECF3F6] rounded-xl sm:rounded-2xl lg:rounded-[20px] p-4 sm:p-5 lg:p-6">
          <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl poppins-semibold mb-3 sm:mb-4">
            Laporan & Analisis
          </h1>

          {/* Student Search Bar */}
          {isLoading || siswaQuery.isLoading ? (
            <div className="h-12 sm:h-14 lg:h-16 bg-white/20 rounded-lg animate-pulse"></div>
          ) : (
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Dropdown pilih siswa */}
              <div>
                <label className="block text-white/90 text-sm mb-1">Pilih Siswa</label>
                <select
                  value={selectedStudent ?? ""}
                  onChange={(e) => setSelectedStudent(e.target.value || null)}
                  className="w-full bg-white text-[#336D82] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/60"
                  aria-label="Dropdown pilih siswa"
                >
                  {siswaItems.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} {s.nis ? `- ${s.nis}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search untuk mencari siswa */}
              <StudentSearchBar
                students={siswaItems.map(s => ({ id: s.id, nama: s.nama, nis: s.nis }))}
                selectedStudent={selectedStudent}
                onSelectStudent={setSelectedStudent}
                aria-label="Cari siswa untuk memilih laporan"
              />
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <>
          {/* Performance Chart Skeleton */}
          <div className="mb-6">
            <ChartSkeleton />
          </div>

          {/* Materials Section Skeleton */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 bg-gray-200 rounded w-80 animate-pulse"></div>
              <div className="h-14 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <CardSkeleton />
          </div>
        </>
      ) : error ? (
        /* Error State */
        <ErrorState
          title="Gagal Memuat Laporan"
          message="Terjadi kesalahan saat memuat laporan kelas. Silakan coba lagi."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          {/* Performance Chart Section - Overall Performance */}
          <div className="mb-4 sm:mb-5 lg:mb-6">
            {currentReport && performanceData.length > 0 ? (
              <PerformanceChart
                data={performanceData}
                materiTitle="Performa Pembelajaran Keseluruhan"
                studentName={currentReport.nama}
              />
            ) : (
              <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#336d82] text-xl sm:text-2xl poppins-semibold">
                    Performa Pembelajaran Keseluruhan
                  </h3>
                </div>
                <div className="h-64 bg-gray-50 border border-dashed border-gray-200 rounded flex items-center justify-center">
                  <p className="text-gray-400 poppins-medium">Data performa belum tersedia</p>
                </div>
              </div>
            )}
          </div>

          {/* Materials Section */}
          <div className="mb-4 sm:mb-5 lg:mb-6">
            <div className="mb-4 sm:mb-5 lg:mb-6">
              <h2 className="text-[#336d82] text-2xl sm:text-3xl lg:text-4xl poppins-semibold">
                MATERI DIPELAJARI
              </h2>
            </div>

            {/* Material Progress Card - Single Card Display */}
            {currentCardMateri ? (
              <MateriProgressCard
                materi={currentCardMateri}
                allMaterials={studentMaterials}
                onViewGrafik={() => setShowGrafikModal(true)}
                onViewHasilKuis={() => setShowKuisModal(true)}
                onViewAnalisa={() => setShowAnalisaModal(true)}
                onMateriChange={(materiId) => setSelectedCardMateri(materiId)}
              />
            ) : (
              <div className="bg-white rounded-[20px] p-12 shadow-lg text-center">
                <p className="text-gray-500 text-xl poppins-medium">
                  Belum ada data materi untuk siswa ini
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      {currentReport && currentCardMateri && (
        <>
          <GrafikPerkembanganModal
            isOpen={showGrafikModal}
            onClose={() => setShowGrafikModal(false)}
            studentName={currentReport.nama}
            materiTitle={currentCardMateri.judul}
            data={performanceData}
          />

          <HasilKuisModal
            isOpen={showKuisModal}
            onClose={() => setShowKuisModal(false)}
            studentName={currentReport.nama}
            materiTitle={currentCardMateri.judul}
            results={quizResults.length > 0 ? quizResults : []}
          />

          <AnalisaAIModal
            isOpen={showAnalisaModal}
            onClose={() => setShowAnalisaModal(false)}
            studentName={currentReport.nama}
            studentId={currentReport.siswaId}
            materiTitle={currentCardMateri.judul}
            materiId={currentCardMateri.materiId}
            hasilKuisId={currentCardMateri.analisis?.hasil_kuis_id} // IMPORTANT: Pass hasil_kuis_id untuk API teacher analysis
            analisisData={currentCardMateri.analisis} // Pass analisis data from backend
            quizSummary={{
              totalQuestions: currentMaterialData?.performanceByLevel.reduce((sum, d) => sum + d.benar + d.salah, 0) || 0,
              correctAnswers: currentMaterialData?.performanceByLevel.reduce((sum, d) => sum + d.benar, 0) || 0,
              incorrectAnswers: currentMaterialData?.performanceByLevel.reduce((sum, d) => sum + d.salah, 0) || 0,
              score: currentMaterialData?.performanceByLevel.reduce((sum, d) => sum + d.benar + d.salah, 0)
                ? Math.round(
                  (currentMaterialData.performanceByLevel.reduce((sum, d) => sum + d.benar, 0) /
                    currentMaterialData.performanceByLevel.reduce((sum, d) => sum + d.benar + d.salah, 0)) *
                  100
                )
                : 0,
            }}
          />
        </>
      )}
    </div>
  );
};

export default LaporanKelasPage;
