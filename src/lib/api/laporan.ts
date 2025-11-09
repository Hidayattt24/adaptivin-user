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
    analisis: string;
    kelebihan: string;
    kelemahan: string;
    level_tertinggi: string;
    level_terendah: string;
    rekomendasi_belajar: string;
    rekomendasi_video: string | object;
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
