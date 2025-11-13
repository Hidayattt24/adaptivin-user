"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CardSkeleton,
  ChartSkeleton,
  ErrorState,
  ClassOverviewChart,
  StudentClusterSection,
} from "@/components/guru";
import {
  useClassOverview,
} from "@/hooks/guru/useLaporan";
import { useSiswaList } from "@/hooks/guru/useSiswa";

const LaporanKelasPage = () => {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.kelasId as string;

  // Queries
  const siswaQuery = useSiswaList(kelasId);
  const siswaItems = useMemo(
    () => siswaQuery.data?.items || [],
    [siswaQuery.data?.items]
  );

  // Get class overview data (aggregate all students)
  const siswaIds = useMemo(() => siswaItems.map((s) => s.id), [siswaItems]);
  const classOverview = useClassOverview(kelasId, siswaIds);

  const isLoading = siswaQuery.isLoading || classOverview.isLoading;
  const error = siswaQuery.error || classOverview.error;

  // Handler for student selection from cluster - Navigate to individual page
  const handleStudentSelect = (siswaId: string) => {
    router.push(`/guru/kelas/${kelasId}/laporan/siswa/${siswaId}`);
  };

  const refetch = () => {
    siswaQuery.refetch();
    classOverview.refetch();
  };

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 lg:p-6 pb-20 sm:pb-20 lg:pb-6">
      {/* Header Section */}
      <div className="mb-4 sm:mb-5 lg:mb-6">
        <div className="bg-gradient-to-r from-[#336D82] to-[#ECF3F6] rounded-xl sm:rounded-2xl lg:rounded-[20px] p-4 sm:p-5 lg:p-6">
          <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl poppins-semibold mb-2">
            Laporan & Analisis Kelas
          </h1>
          <p className="text-white/90 text-sm sm:text-base poppins-regular">
            Lihat performa kelas secara keseluruhan dan detail per siswa
          </p>
        </div>
      </div>

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
          message="Terjadi kesalahan saat memuat laporan kelas. Silakan coba lagi."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          {/* Class Overview Section */}
          {classOverview.data && (
            <div className="mb-6">
              <ClassOverviewChart
                data={classOverview.data.overviewData.map((item) => ({
                  level: item.level as
                    | "level1"
                    | "level2"
                    | "level3"
                    | "level4"
                    | "level5"
                    | "level6",
                  benar: item.benar,
                  salah: item.salah,
                }))}
                totalStudents={classOverview.data.totalStudents}
                totalCorrect={classOverview.data.totalCorrect}
                totalQuestions={classOverview.data.totalQuestions}
              />
            </div>
          )}

          {/* Student Clustering Section */}
          {classOverview.data && classOverview.data.studentClusters.length > 0 && (
            <div className="mb-6">
              <StudentClusterSection
                students={classOverview.data.studentClusters}
                onStudentSelect={handleStudentSelect}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LaporanKelasPage;
