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
import { Siswa, StudentReport } from "@/types/guru";
import { useClassReport } from "@/hooks/guru/useLaporan";

const LaporanKelasPage = () => {
  const params = useParams();
  const kelasId = params.kelasId as string;

  // Lazy load class report data with React Query
  const { isLoading, error, refetch } = useClassReport(kelasId);

  // TODO: Replace with actual API data when backend is ready
  // For now, use dummy data as fallback
  const studentList: Siswa[] = [
    { id: "1", nama: "FARHAN", nis: "001", tanggalLahir: "2010-05-15", tempatLahir: "Jakarta", jenisKelamin: "Laki-laki" },
    { id: "2", nama: "SITI", nis: "002", tanggalLahir: "2010-08-20", tempatLahir: "Bandung", jenisKelamin: "Perempuan" },
    { id: "3", nama: "BUDI", nis: "003", tanggalLahir: "2010-03-10", tempatLahir: "Surabaya", jenisKelamin: "Laki-laki" },
    { id: "4", nama: "AISYAH", nis: "004", tanggalLahir: "2010-06-22", tempatLahir: "Medan", jenisKelamin: "Perempuan" },
    { id: "5", nama: "DIMAS", nis: "005", tanggalLahir: "2010-09-18", tempatLahir: "Semarang", jenisKelamin: "Laki-laki" },
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
        { materiId: "m1", judul: "Pecahan biasa & Campuran", progress: 100, status: "completed" },
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
        { materiId: "m1", judul: "Pecahan biasa & Campuran", progress: 100, status: "completed" },
        { materiId: "m2", judul: "Aljabar Dasar", progress: 100, status: "completed" },
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
        { materiId: "m2", judul: "Aljabar Dasar", progress: 0, status: "not_started" },
        { materiId: "m3", judul: "Geometri Bidang", progress: 0, status: "not_started" },
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
  
  // Modal states
  const [showGrafikModal, setShowGrafikModal] = useState(false);
  const [showKuisModal, setShowKuisModal] = useState(false);
  const [showAnalisaModal, setShowAnalisaModal] = useState(false);

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
    if (studentMaterials.length > 0 && !selectedCardMateri) {
      setSelectedCardMateri(studentMaterials[0].materiId);
    }
  }, [studentMaterials, selectedCardMateri]);

  // Reset selected material when student changes
  React.useEffect(() => {
    if (studentMaterials.length > 0) {
      setSelectedCardMateri(studentMaterials[0].materiId);
    }
  }, [selectedStudent]);

  // Dummy data for modals
  const dummyQuizResults = [
    {
      soalId: "1",
      pertanyaan: "Sebuah kue dipotong menjadi 12 bagian yang sama. Jika Ani mengambil 3 bagian, berapa pecahan yang diambil Ani?",
      tipesoal: "C1 - Mengingat",
      jawabanSiswa: "3/12",
      jawabanBenar: "3/12 atau 1/4",
      isCorrect: true,
      waktuJawab: 45,
    },
    {
      soalId: "2",
      pertanyaan: "Ubahlah pecahan 2/5 menjadi pecahan desimal!",
      tipesoal: "C2 - Memahami",
      jawabanSiswa: "0.4",
      jawabanBenar: "0.4",
      isCorrect: true,
      waktuJawab: 62,
    },
    {
      soalId: "3",
      pertanyaan: "Hitunglah hasil dari 1/2 + 1/4!",
      tipesoal: "C3 - Menerapkan",
      jawabanSiswa: "2/6",
      jawabanBenar: "3/4",
      isCorrect: false,
      waktuJawab: 120,
    },
    {
      soalId: "4",
      pertanyaan: "Bandingkan pecahan 2/3 dan 3/4, mana yang lebih besar?",
      tipesoal: "C4 - Menganalisis",
      jawabanSiswa: "3/4",
      jawabanBenar: "3/4",
      isCorrect: true,
      waktuJawab: 90,
    },
    {
      soalId: "5",
      pertanyaan: "Jika 1/3 dari sebuah pizza dimakan, berapa persen pizza yang tersisa?",
      tipesoal: "C5 - Mengevaluasi",
      jawabanSiswa: "66%",
      jawabanBenar: "66.67% atau 2/3",
      isCorrect: true,
      waktuJawab: 105,
    },
  ];

  const dummyAIAnalysis = `Halo Guru! Saya Mbah AdaptivAI, dan saya sudah menganalisis hasil belajar ${currentReport?.nama || 'siswa'} pada materi "${currentCardMateri?.judul || 'ini'}". Berikut adalah hasil analisis saya:

📊 PERFORMA KESELURUHAN
Siswa menunjukkan pemahaman yang baik terhadap materi pecahan dengan skor rata-rata 80%. Kemampuan dasar sudah cukup kuat, namun masih ada beberapa area yang perlu ditingkatkan.

✅ KEKUATAN SISWA
1. Sangat baik dalam mengidentifikasi dan membaca pecahan sederhana (C1)
2. Mampu mengubah pecahan ke bentuk desimal dengan akurat (C2)
3. Kecepatan menjawab soal tingkat dasar di atas rata-rata
4. Konsisten dalam menjawab soal pemahaman konsep
5. Menunjukkan antusiasme yang baik dalam belajar

⚠️ AREA YANG PERLU DIPERBAIKI
1. Kesulitan dalam operasi penjumlahan pecahan dengan penyebut berbeda
2. Membutuhkan waktu lebih lama untuk soal analisis (C4-C6)
3. Terkadang terburu-buru dalam menghitung tanpa menyederhanakan hasil
4. Perlu lebih teliti dalam membaca soal cerita

💡 REKOMENDASI UNTUK GURU
Berdasarkan analisis saya, berikut beberapa saran untuk membantu siswa:

1. Berikan latihan tambahan untuk operasi pecahan dengan penyebut berbeda, gunakan pendekatan visual seperti diagram lingkaran atau batang pecahan
2. Latih siswa untuk selalu menyederhanakan hasil akhir sebelum menjawab
3. Berikan soal cerita yang lebih bervariasi untuk meningkatkan kemampuan analisis
4. Dorong siswa untuk mengecek kembali jawaban sebelum submit
5. Berikan apresiasi untuk setiap kemajuan yang dicapai siswa

🎯 POLA PEMBELAJARAN
- Topik Tercepat: Membaca Pecahan (C1) - rata-rata 30 detik per soal
- Topik Terlambat: Operasi Pecahan Campuran (C3) - rata-rata 120 detik per soal
- Paling Akurat: Konversi Pecahan ke Desimal (C2) - 90% benar
- Kurang Akurat: Penjumlahan Pecahan Berbeda Penyebut (C3) - 60% benar

🔮 PREDIKSI & KESIMPULAN
Dengan latihan yang konsisten dan pendekatan yang tepat, siswa diprediksi akan mencapai tingkat mahir dalam 2-3 minggu ke depan. Fokus pada operasi pecahan akan mempercepat progress. Potensi untuk mencapai skor 90+ sangat tinggi jika area perbaikan ditangani dengan baik.

Siswa ini memiliki fondasi yang kuat dan dengan bimbingan yang tepat, akan mampu menguasai materi dengan baik. Terus berikan dukungan dan motivasi ya, Guru! 💪

Salam hangat,
Mbah AdaptivAI 👴`;

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 lg:p-6 pb-20 sm:pb-20 lg:pb-6">
      {/* Header Section with Search */}
      <div className="mb-4 sm:mb-5 lg:mb-6">
        <div className="bg-gradient-to-r from-[#336D82] to-[#ECF3F6] rounded-xl sm:rounded-2xl lg:rounded-[20px] p-4 sm:p-5 lg:p-6">
          <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl poppins-semibold mb-3 sm:mb-4">
            Laporan & Analisis
          </h1>

          {/* Student Search Bar */}
          {isLoading ? (
            <div className="h-12 sm:h-14 lg:h-16 bg-white/20 rounded-lg animate-pulse"></div>
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
            <div className="mb-4 sm:mb-5 lg:mb-6">
              <PerformanceChart
                data={performanceData}
                materiTitle="Performa Pembelajaran Keseluruhan"
                studentName={currentReport.nama}
              />
            </div>
          )}

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
            results={dummyQuizResults}
          />

          <AnalisaAIModal
            isOpen={showAnalisaModal}
            onClose={() => setShowAnalisaModal(false)}
            studentName={currentReport.nama}
            materiTitle={currentCardMateri.judul}
            quizSummary={{
              totalQuestions: performanceData.reduce((sum, d) => sum + d.benar + d.salah, 0),
              correctAnswers: performanceData.reduce((sum, d) => sum + d.benar, 0),
              incorrectAnswers: performanceData.reduce((sum, d) => sum + d.salah, 0),
              score: Math.round(
                (performanceData.reduce((sum, d) => sum + d.benar, 0) /
                  performanceData.reduce((sum, d) => sum + d.benar + d.salah, 0)) *
                  100
              ),
            }}
          />
        </>
      )}
    </div>
  );
};

export default LaporanKelasPage;
