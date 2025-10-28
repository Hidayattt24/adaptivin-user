"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import DownloadIcon from "@mui/icons-material/Download";
import StudentSearchBar from "@/components/guru/StudentSearchBar";
import PerformanceChart from "@/components/guru/PerformanceChart";
import MateriProgressCard from "@/components/guru/MateriProgressCard";
import { Siswa, Materi, StudentReport } from "@/types/guru";
import { useClassReport } from "@/hooks/guru/useLaporan";
import { CardSkeleton } from "@/components/guru/skeletons/CardSkeleton";
import { ChartSkeleton } from "@/components/guru/skeletons/ChartSkeleton";
import { ErrorState } from "@/components/guru/ErrorState";

const LaporanKelasPage = () => {
  const params = useParams();
  const kelasId = params.kelasId as string;

  // Lazy load class report data with React Query
  const { data: reportData, isLoading, error, refetch } = useClassReport(kelasId);

  // TODO: Replace with actual API data when backend is ready
  // For now, use dummy data as fallback
  const studentList: Siswa[] = [
    { id: "1", nama: "FARHAN", nis: "001", tanggalLahir: "2010-05-15", tempatLahir: "Jakarta", jenisKelamin: "Laki-laki" },
    { id: "2", nama: "SITI", nis: "002", tanggalLahir: "2010-08-20", tempatLahir: "Bandung", jenisKelamin: "Perempuan" },
    { id: "3", nama: "BUDI", nis: "003", tanggalLahir: "2010-03-10", tempatLahir: "Surabaya", jenisKelamin: "Laki-laki" },
    { id: "4", nama: "AISYAH", nis: "004", tanggalLahir: "2010-06-22", tempatLahir: "Medan", jenisKelamin: "Perempuan" },
    { id: "5", nama: "DIMAS", nis: "005", tanggalLahir: "2010-09-18", tempatLahir: "Semarang", jenisKelamin: "Laki-laki" },
  ];

  // Dummy data for materials
  const materiList: Materi[] = [
    {
      id: "m1",
      judul: "Pecahan biasa & Campuran",
      deskripsi: "Materi tentang pecahan biasa dan campuran",
      topik: "Matematika",
      status: "published",
      jumlahSiswaSelesai: 25,
      totalSiswa: 30,
      createdAt: "2024-01-01",
    },
    {
      id: "m2",
      judul: "Aljabar Dasar",
      deskripsi: "Pengenalan aljabar untuk pemula",
      topik: "Matematika",
      status: "published",
      jumlahSiswaSelesai: 20,
      totalSiswa: 30,
      createdAt: "2024-01-15",
    },
    {
      id: "m3",
      judul: "Geometri Bidang",
      deskripsi: "Materi tentang geometri bidang datar",
      topik: "Matematika",
      status: "published",
      jumlahSiswaSelesai: 18,
      totalSiswa: 30,
      createdAt: "2024-02-01",
    },
  ];

  // Dummy student reports data
  const studentReports: Record<string, StudentReport> = {
    "1": {
      siswaId: "1",
      nama: "FARHAN",
      performanceByLevel: [
        { level: "C1", benar: 25, salah: 20 },
        { level: "C2", benar: 30, salah: 15 },
        { level: "C3", benar: 22, salah: 18 },
        { level: "C4", benar: 28, salah: 12 },
        { level: "C5", benar: 30, salah: 10 },
        { level: "C6", benar: 27, salah: 13 },
      ],
      materiProgress: [
        { materiId: "m1", judul: "Pecahan biasa & Campuran", progress: 90, status: "in_progress" },
        { materiId: "m2", judul: "Aljabar Dasar", progress: 75, status: "in_progress" },
        { materiId: "m3", judul: "Geometri Bidang", progress: 60, status: "in_progress" },
      ],
    },
    "2": {
      siswaId: "2",
      nama: "SITI",
      performanceByLevel: [
        { level: "C1", benar: 30, salah: 15 },
        { level: "C2", benar: 32, salah: 13 },
        { level: "C3", benar: 28, salah: 17 },
        { level: "C4", benar: 31, salah: 14 },
        { level: "C5", benar: 33, salah: 12 },
        { level: "C6", benar: 29, salah: 16 },
      ],
      materiProgress: [
        { materiId: "m1", judul: "Pecahan biasa & Campuran", progress: 95, status: "completed" },
        { materiId: "m2", judul: "Aljabar Dasar", progress: 85, status: "in_progress" },
        { materiId: "m3", judul: "Geometri Bidang", progress: 70, status: "in_progress" },
      ],
    },
    "3": {
      siswaId: "3",
      nama: "BUDI",
      performanceByLevel: [
        { level: "C1", benar: 20, salah: 25 },
        { level: "C2", benar: 22, salah: 23 },
        { level: "C3", benar: 18, salah: 27 },
        { level: "C4", benar: 24, salah: 21 },
        { level: "C5", benar: 26, salah: 19 },
        { level: "C6", benar: 23, salah: 22 },
      ],
      materiProgress: [
        { materiId: "m1", judul: "Pecahan biasa & Campuran", progress: 65, status: "in_progress" },
        { materiId: "m2", judul: "Aljabar Dasar", progress: 50, status: "in_progress" },
        { materiId: "m3", judul: "Geometri Bidang", progress: 40, status: "not_started" },
      ],
    },
    "4": {
      siswaId: "4",
      nama: "AISYAH",
      performanceByLevel: [
        { level: "C1", benar: 28, salah: 17 },
        { level: "C2", benar: 31, salah: 14 },
        { level: "C3", benar: 26, salah: 19 },
        { level: "C4", benar: 29, salah: 16 },
        { level: "C5", benar: 32, salah: 13 },
        { level: "C6", benar: 30, salah: 15 },
      ],
      materiProgress: [
        { materiId: "m1", judul: "Pecahan biasa & Campuran", progress: 88, status: "in_progress" },
        { materiId: "m2", judul: "Aljabar Dasar", progress: 72, status: "in_progress" },
        { materiId: "m3", judul: "Geometri Bidang", progress: 55, status: "in_progress" },
      ],
    },
    "5": {
      siswaId: "5",
      nama: "DIMAS",
      performanceByLevel: [
        { level: "C1", benar: 23, salah: 22 },
        { level: "C2", benar: 25, salah: 20 },
        { level: "C3", benar: 21, salah: 24 },
        { level: "C4", benar: 27, salah: 18 },
        { level: "C5", benar: 29, salah: 16 },
        { level: "C6", benar: 26, salah: 19 },
      ],
      materiProgress: [
        { materiId: "m1", judul: "Pecahan biasa & Campuran", progress: 78, status: "in_progress" },
        { materiId: "m2", judul: "Aljabar Dasar", progress: 63, status: "in_progress" },
        { materiId: "m3", judul: "Geometri Bidang", progress: 48, status: "in_progress" },
      ],
    },
  };

  const [selectedStudent, setSelectedStudent] = useState<string | null>("1");
  const [selectedCardMateri, setSelectedCardMateri] = useState<string | null>(null);

  // Get current student report
  const currentReport = selectedStudent ? studentReports[selectedStudent] : null;

  // Get performance data for chart - shows overall performance
  const performanceData = currentReport?.performanceByLevel || [];

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
    if (studentMaterials.length > 0) {
      setSelectedCardMateri(studentMaterials[0].materiId);
    }
  }, [selectedStudent, studentMaterials]);

  const handleDownloadPDF = () => {
    console.log("Downloading PDF...");
    // TODO: Implement PDF download functionality
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header Section with Search */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-[#336D82] to-[#ECF3F6] rounded-[20px] p-6">
          <h1 className="text-white text-4xl poppins-semibold mb-4">
            Laporan & Analisis
          </h1>

          {/* Student Search Bar */}
          {isLoading ? (
            <div className="h-12 bg-white/20 rounded-lg animate-pulse"></div>
          ) : (
            <StudentSearchBar
              students={studentList.map(s => ({ id: s.id, nama: s.nama, nis: s.nis }))}
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
              aria-label="Pilih siswa untuk melihat laporan"
            />
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
          {currentReport && performanceData.length > 0 && (
            <div className="mb-6">
              <PerformanceChart
                data={performanceData}
                materiTitle="Performa Pembelajaran Keseluruhan"
                studentName={currentReport.nama}
              />
            </div>
          )}

          {/* Materials Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#336d82] text-4xl poppins-semibold">
                MATERI DIPELAJARI
              </h2>

              {/* Download PDF Button */}
              <button
                onClick={handleDownloadPDF}
                className="bg-[#336d82] rounded-[18px] h-[54px] px-6 flex items-center gap-3 hover:bg-[#2a5a6a] transition-colors shadow-lg"
                aria-label="Download laporan PDF"
              >
                <div className="bg-white rounded-full w-[40px] h-[40px] flex items-center justify-center">
                  <DownloadIcon sx={{ fontSize: 20, color: "#336d82" }} />
                </div>
                <span className="text-white text-base poppins-semibold">
                  Download PDF
                </span>
              </button>
            </div>

            {/* Material Progress Card - Single Card Display */}
            {currentCardMateri ? (
              <MateriProgressCard
                materi={currentCardMateri}
                allMaterials={studentMaterials}
                onViewGrafik={() => console.log("View Grafik", currentCardMateri.materiId)}
                onViewHasilKuis={() => console.log("View Hasil Kuis", currentCardMateri.materiId)}
                onViewAnalisa={() => console.log("View Analisa", currentCardMateri.materiId)}
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
    </div>
  );
};

export default LaporanKelasPage;
