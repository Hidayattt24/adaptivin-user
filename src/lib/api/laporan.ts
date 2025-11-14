import axios from "axios";
import { getCurrentToken } from "@/lib/storage";
import { extractData } from "./responseHelper";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ==================== TYPES ====================

export interface PerformanceByLevel {
  level: string;
  benar: number;
  salah: number;
}

export interface MateriProgress {
  materiId: string;
  judul: string;
  deskripsi: string;
  progress: number;
  status: "not_started" | "in_progress" | "completed";
  totalKuisDikerjakan: number;
  totalSoalDijawab: number;
  performanceByLevel: PerformanceByLevel[];
  analisis: {
    id: string;
    hasil_kuis_id: string; // IMPORTANT: Added for teacher analysis API
    analisis: string;
    kelebihan: string;
    kelemahan: string;
    level_tertinggi: string;
    level_terendah: string;
    rekomendasi_belajar: string;
    rekomendasi_video: string | object;
  } | null;
  analisisGuru?: {
    id: string;
    hasil_kuis_id: string;
    materi_id: string;
    siswa_id: string;
    diagnosis_pembelajaran: string;
    pola_belajar_siswa: string;
    level_kemampuan_saat_ini: string;
    zona_proximal_development: string;
    rekomendasi_metode_mengajar: string;
    strategi_differensiasi: string;
    aktivitas_pembelajaran:
      | string
      | Array<{
          nama: string;
          deskripsi: string;
          durasi: string;
          tujuan: string;
        }>;
    tips_praktis: string;
    indikator_progress: string;
    rekomendasi_video_guru:
      | string
      | Array<{
          judul?: string;
          url?: string;
          fokus?: string;
          durasi?: string;
          bahasa?: string;
        }>;
    created_at: string;
  } | null;
}

export interface LaporanSiswa {
  siswaId: string;
  nama: string;
  nis: string;
  performanceByLevel: PerformanceByLevel[];
  materiProgress: MateriProgress[];
  totalKuisDikerjakan: number;
  totalSoalDijawab: number;
}

export interface DetailJawaban {
  id: string; // Unique ID from detail_jawaban_siswa table
  soalId: string;
  pertanyaan: string;
  tipeSoal: string;
  jawabanSiswa: string;
  jawabanBenar: string; // Correct answer text
  isCorrect: boolean;
  waktuJawab: number;
}

export interface HasilKuisDetail {
  hasilKuisId: string;
  kuisJudul: string;
  totalBenar: number;
  totalSalah: number;
  totalWaktu: number;
  tanggal: string;
  detailJawaban: DetailJawaban[];
}

// Class overview types
export interface ClassOverviewData {
  level: string;
  benar: number;
  salah: number;
}

export interface StudentCluster {
  siswaId: string;
  nama: string;
  nis: string;
  dominantLevel: number;
  accuracy: number;
  totalCorrect: number;
  totalQuestions: number;
}

// ==================== API FUNCTIONS ====================

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getCurrentToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Get laporan per siswa
 * @param kelasId - ID kelas
 * @param siswaId - ID siswa
 */
export async function getLaporanSiswa(kelasId: string, siswaId: string) {
  const res = await api.get(`/laporan/kelas/${kelasId}/siswa/${siswaId}`);
  return extractData<LaporanSiswa>(res);
}

/**
 * Get detail hasil kuis untuk materi tertentu
 * @param kelasId - ID kelas
 * @param siswaId - ID siswa
 * @param materiId - ID materi
 */
export async function getHasilKuisDetail(
  kelasId: string,
  siswaId: string,
  materiId: string
) {
  const res = await api.get(
    `/laporan/kelas/${kelasId}/siswa/${siswaId}/materi/${materiId}/hasil-kuis`
  );
  return extractData<HasilKuisDetail[]>(res);
}

/**
 * Get class overview by aggregating all student data
 * @param kelasId - ID kelas
 * @param siswaIds - Array of student IDs
 */
export async function getClassOverview(
  kelasId: string,
  siswaIds: string[]
): Promise<{
  overviewData: ClassOverviewData[];
  studentClusters: StudentCluster[];
  totalStudents: number;
  totalCorrect: number;
  totalQuestions: number;
}> {
  // Fetch all student reports in parallel
  const reports = await Promise.all(
    siswaIds.map((siswaId) => getLaporanSiswa(kelasId, siswaId))
  );

  // Aggregate performance by level
  const levelAggregation: Record<string, { benar: number; salah: number }> = {
    level1: { benar: 0, salah: 0 },
    level2: { benar: 0, salah: 0 },
    level3: { benar: 0, salah: 0 },
    level4: { benar: 0, salah: 0 },
    level5: { benar: 0, salah: 0 },
    level6: { benar: 0, salah: 0 },
  };

  let totalCorrect = 0;
  let totalQuestions = 0;

  // Process each student report
  const studentClusters: StudentCluster[] = reports.map((report) => {
    // Aggregate performance by level for this student
    const studentLevelCounts: Record<number, number> = {};

    report.performanceByLevel.forEach((perf) => {
      const levelKey = perf.level as keyof typeof levelAggregation;
      levelAggregation[levelKey].benar += perf.benar;
      levelAggregation[levelKey].salah += perf.salah;

      // Count total correct answers per level for dominant level calculation
      const levelNum = parseInt(perf.level.replace("level", ""));
      studentLevelCounts[levelNum] = perf.benar;

      totalCorrect += perf.benar;
      totalQuestions += perf.benar + perf.salah;
    });

    // Calculate student total questions
    const studentTotal = report.performanceByLevel.reduce(
      (sum, perf) => sum + perf.benar + perf.salah,
      0
    );
    const studentCorrect = report.performanceByLevel.reduce(
      (sum, perf) => sum + perf.benar,
      0
    );

    // If student has no quiz attempts, set dominantLevel to 0
    let dominantLevel = 0;
    
    if (studentTotal > 0) {
      // Calculate dominant level (level with most correct answers)
      let maxCorrect = 0;

      Object.entries(studentLevelCounts).forEach(([level, count]) => {
        if (count > maxCorrect) {
          maxCorrect = count;
          dominantLevel = parseInt(level);
        }
      });

      // If no correct answers but has attempts, use median level
      if (dominantLevel === 0 && studentTotal > 0) {
        dominantLevel = 3; // Default to middle level if student tried but got all wrong
      }
    }

    // Calculate student accuracy
    const accuracy =
      studentTotal > 0 ? (studentCorrect / studentTotal) * 100 : 0;

    return {
      siswaId: report.siswaId,
      nama: report.nama,
      nis: report.nis,
      dominantLevel,
      accuracy: Math.round(accuracy),
      totalCorrect: studentCorrect,
      totalQuestions: studentTotal,
    };
  });

  // Convert aggregation to array format for chart
  const overviewData: ClassOverviewData[] = Object.entries(
    levelAggregation
  ).map(([level, data]) => ({
    level,
    benar: data.benar,
    salah: data.salah,
  }));

  return {
    overviewData,
    studentClusters,
    totalStudents: reports.length,
    totalCorrect,
    totalQuestions,
  };
}
