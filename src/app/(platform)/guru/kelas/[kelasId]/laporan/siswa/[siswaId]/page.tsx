"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  PerformanceChart,
  MateriProgressCard,
  CardSkeleton,
  ChartSkeleton,
  ErrorState,
  GrafikPerkembanganModal,
  HasilKuisModal,
  AnalysisAISection,
} from "@/components/guru";
import {
  useStudentReport,
  useHasilKuisDetail,
} from "@/hooks/guru/useLaporan";

const LaporanSiswaPage = () => {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.kelasId as string;
  const siswaId = params.siswaId as string;

  // States
  const [selectedCardMateri, setSelectedCardMateri] = useState<string | null>(
    null
  );
  const [showGrafikModal, setShowGrafikModal] = useState(false);
  const [showKuisModal, setShowKuisModal] = useState(false);

  // Get individual student report
  const studentReport = useStudentReport(kelasId, siswaId);

  // Get hasil kuis detail for selected material
  const hasilKuisDetail = useHasilKuisDetail(
    kelasId,
    siswaId,
    selectedCardMateri || ""
  );

  const currentReport = studentReport.data;
  const isLoading = studentReport.isLoading;
  const error = studentReport.error;

  // Get performance data for individual student chart
  const performanceData = useMemo(() => {
    if (!currentReport) return [];

    const levelMap: Record<string, string> = {
      level1: "level1",
      level2: "level2",
      level3: "level3",
      level4: "level4",
      level5: "level5",
      level6: "level6",
    };

    return currentReport.performanceByLevel.map((item) => ({
      level: levelMap[item.level] || item.level,
      benar: item.benar,
      salah: item.salah,
    })) as Array<{
      level: "level1" | "level2" | "level3" | "level4" | "level5" | "level6";
      benar: number;
      salah: number;
    }>;
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
      return (
        studentMaterials.find((m) => m.materiId === selectedCardMateri) ||
        studentMaterials[0]
      );
    }

    // Default to first material
    return studentMaterials[0];
  }, [currentReport, studentMaterials, selectedCardMateri]);

  // Set initial selected material when data loads
  React.useEffect(() => {
    if (studentMaterials.length > 0 && !selectedCardMateri) {
      setSelectedCardMateri(studentMaterials[0].materiId);
    }
  }, [studentMaterials, selectedCardMateri]);

  // Prepare quiz results for modal
  const quizResults = useMemo(() => {
    if (!hasilKuisDetail.data || hasilKuisDetail.data.length === 0) return [];

    // Get the latest quiz result
    const latestQuiz = hasilKuisDetail.data[0];

    return latestQuiz.detailJawaban.map((detail) => ({
      id: detail.id,
      soalId: detail.soalId,
      pertanyaan: detail.pertanyaan,
      tipesoal: detail.tipeSoal,
      jawabanSiswa: detail.jawabanSiswa,
      jawabanBenar: detail.jawabanBenar,
      isCorrect: detail.isCorrect,
      waktuJawab: detail.waktuJawab,
    }));
  }, [hasilKuisDetail.data]);

  // Handler for back button
  const handleBack = () => {
    router.push(`/guru/kelas/${kelasId}/laporan`);
  };

  const refetch = () => {
    studentReport.refetch();
  };

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 lg:p-6 pb-20 sm:pb-20 lg:pb-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mb-4 flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#336D82] text-[#336D82] rounded-xl hover:bg-[#336D82] hover:text-white transition-all duration-200 poppins-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Kembali ke Laporan Kelas
      </button>

      {/* Loading State */}
      {isLoading ? (
        <>
          <div className="mb-6">
            <ChartSkeleton />
          </div>
          <div className="mb-6">
            <CardSkeleton />
          </div>
        </>
      ) : error ? (
        /* Error State */
        <ErrorState
          title="Gagal Memuat Laporan"
          message="Terjadi kesalahan saat memuat laporan siswa. Silakan coba lagi."
          onRetry={() => refetch()}
        />
      ) : currentReport ? (
        <>
          {/* Student Header */}
          <div className="mb-4 sm:mb-5 lg:mb-6">
            <div className="bg-gradient-to-r from-[#336D82] to-[#ECF3F6] rounded-xl sm:rounded-2xl lg:rounded-[20px] p-4 sm:p-5 lg:p-6">
              <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl poppins-semibold mb-2">
                Laporan Individual: {currentReport.nama}
              </h1>
              <p className="text-white/90 text-sm sm:text-base poppins-regular">
                NIS: {currentReport.nis}
              </p>
            </div>
          </div>

          {/* Performance Chart - Individual Student */}
          <div className="mb-4 sm:mb-5 lg:mb-6">
            {performanceData.length > 0 ? (
              <PerformanceChart
                data={performanceData}
                materiTitle="Performa Pembelajaran Keseluruhan"
                studentName={currentReport.nama}
              />
            ) : (
              <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-lg">
                <h3 className="text-[#336d82] text-xl sm:text-2xl poppins-semibold mb-4">
                  Performa Pembelajaran Keseluruhan
                </h3>
                <div className="h-64 bg-gray-50 border border-dashed border-gray-200 rounded flex items-center justify-center">
                  <p className="text-gray-400 poppins-medium">
                    Data performa belum tersedia
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Materials Section */}
          <div className="mb-4 sm:mb-5 lg:mb-6">
            <h2 className="text-[#336d82] text-2xl sm:text-3xl lg:text-4xl poppins-semibold mb-4">
              MATERI DIPELAJARI
            </h2>

            {currentCardMateri ? (
              <MateriProgressCard
                materi={currentCardMateri}
                allMaterials={studentMaterials}
                onViewGrafik={() => setShowGrafikModal(true)}
                onViewHasilKuis={() => setShowKuisModal(true)}
                onViewAnalisa={() => { }} // No longer used
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

          {/* AI Analysis Section - Displayed prominently */}
          {currentCardMateri?.analisis && (
            <div className="mb-6">
              <AnalysisAISection
                studentName={currentReport.nama}
                materiTitle={currentCardMateri.judul}
                analisisData={currentCardMateri.analisis}
                hasilKuisId={currentCardMateri.analisis.hasil_kuis_id}
                onAnalysisComplete={() => {
                  // Refresh data after teacher analysis
                  studentReport.refetch();
                }}
              />
            </div>
          )}

          {/* Modals */}
          {currentCardMateri && (
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
            </>
          )}
        </>
      ) : null}
    </div>
  );
};

export default LaporanSiswaPage;
