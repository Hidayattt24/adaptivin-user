import axios from "axios";
import { getCookie, StorageKeys } from "@/lib/storage";
import { extractData } from "./responseHelper";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Ambil token dari cookie
function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  return getCookie(StorageKeys.TOKEN);
}

// ==================== TYPES ====================

export interface AnalisisStatus {
  hasil_kuis_id: string;
  is_analyzed: boolean;
  analisis_id: string | null;
  is_completed: boolean;
}

export interface RekomendasiVideo {
  judul?: string;
  url?: string;
  durasi?: string;
}

export interface AnalisisAI {
  id: string;
  hasil_kuis_id: string;
  materi_id: string;
  siswa_id: string;
  analisis: string;
  level_tertinggi: string;
  level_terendah: string;
  kelebihan: string;
  kelemahan: string;
  rekomendasi_belajar: string;
  rekomendasi_video: RekomendasiVideo[] | string;
  created_at: string;
  updated_at?: string;
  hasil_kuis?: {
    id: string;
    total_benar: number;
    total_salah: number;
    total_waktu: number;
    kuis?: {
      id: string;
      judul: string;
    };
    siswa?: {
      id: string;
      nama_lengkap: string;
    };
  };
  materi?: {
    id: string;
    judul_materi: string;
    deskripsi: string;
  };
}

// ==================== API FUNCTIONS ====================

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Mengecek apakah hasil kuis sudah dianalisis atau belum
 * @param hasilKuisId - ID hasil kuis
 */
export async function checkAnalisisStatus(hasilKuisId: string) {
  console.log("=== API: checkAnalisisStatus ===");
  console.log("hasilKuisId:", hasilKuisId);
  const res = await api.get(`/analisis/check/${hasilKuisId}`);
  console.log("Response from backend:", res.data);
  const result = extractData<AnalisisStatus>(res);
  console.log("Extracted data:", result);
  return result;
}

/**
 * Membuat analisis AI untuk hasil kuis
 * @param hasilKuisId - ID hasil kuis
 */
export async function createAnalisis(hasilKuisId: string) {
  const res = await api.post(`/analisis/${hasilKuisId}`);
  return extractData<AnalisisAI>(res);
}

/**
 * Mengambil analisis AI berdasarkan hasil kuis
 * @param hasilKuisId - ID hasil kuis
 */
export async function getAnalisisByHasilKuis(hasilKuisId: string) {
  const res = await api.get(`/analisis/${hasilKuisId}`);
  return extractData<AnalisisAI>(res);
}

/**
 * Mengambil semua analisis (dengan filter optional)
 * @param filters - Filter untuk siswa_id atau kuis_id
 */
export async function getAllAnalisis(filters?: {
  siswa_id?: string;
  kuis_id?: string;
}) {
  const res = await api.get("/analisis", { params: filters });
  return extractData<AnalisisAI[]>(res);
}

/**
 * Mengambil analisis berdasarkan materi (untuk guru)
 * @param materiId - ID materi
 */
export async function getAnalisisByMateri(materiId: string) {
  const res = await api.get(`/analisis/materi/${materiId}`);
  return extractData<AnalisisAI[]>(res);
}

/**
 * Menghapus analisis
 * @param analisisId - ID analisis
 */
export async function deleteAnalisis(analisisId: string) {
  const res = await api.delete(`/analisis/${analisisId}`);
  // DELETE operation mengembalikan null data, jadi kita cek success saja
  const body = res.data as { success: boolean; status: string; message: string; data: null };

  if (body.success && body.status === "success") {
    return true; // Return true jika berhasil
  }

  throw new Error(body.message || "Gagal menghapus analisis");
}

// ==================== TEACHER ANALYSIS API ====================

export interface AnalisisGuruStatus {
  hasil_kuis_id: string;
  is_analyzed: boolean;
  analisis_id: string | null;
  is_completed: boolean;
}

export interface AktivitasPembelajaran {
  nama: string;
  deskripsi: string;
  durasi: string;
  tujuan: string;
}

export interface RekomendasiVideoGuru {
  judul?: string;
  url?: string;
  fokus?: string;
  durasi?: string;
  bahasa?: string;
}

export interface AnalisisAIGuru {
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
  aktivitas_pembelajaran: AktivitasPembelajaran[] | string;
  tips_praktis: string;
  indikator_progress: string;
  rekomendasi_video_guru: RekomendasiVideoGuru[] | string;
  created_at: string;
  updated_at?: string;
  hasil_kuis?: {
    id: string;
    total_benar: number;
    total_salah: number;
    total_waktu: number;
    kuis?: {
      id: string;
      judul: string;
    };
    siswa?: {
      id: string;
      nama_lengkap: string;
      email: string;
    };
  };
  materi?: {
    id: string;
    judul_materi: string;
    deskripsi: string;
  };
}

/**
 * Mengecek apakah hasil kuis sudah dianalisis untuk guru
 * @param hasilKuisId - ID hasil kuis
 */
export async function checkTeacherAnalysisStatus(hasilKuisId: string) {
  console.log("=== API: checkTeacherAnalysisStatus ===");
  console.log("hasilKuisId:", hasilKuisId);
  const res = await api.get(`/analisis/guru/check/${hasilKuisId}`);
  console.log("Response from backend:", res.data);
  const result = extractData<AnalisisGuruStatus>(res);
  console.log("Extracted data:", result);
  return result;
}

/**
 * Membuat analisis strategi pembelajaran untuk guru
 * @param hasilKuisId - ID hasil kuis
 */
export async function createTeacherAnalysis(hasilKuisId: string) {
  console.log("=== API: createTeacherAnalysis ===");
  console.log("hasilKuisId:", hasilKuisId);
  const res = await api.post(`/analisis/guru/${hasilKuisId}`);
  console.log("Response from backend:", res.data);
  return extractData<AnalisisAIGuru>(res);
}

/**
 * Mengambil analisis guru berdasarkan hasil kuis
 * @param hasilKuisId - ID hasil kuis
 */
export async function getTeacherAnalysisByHasilKuis(hasilKuisId: string) {
  console.log("=== API: getTeacherAnalysisByHasilKuis ===");
  console.log("hasilKuisId:", hasilKuisId);
  const res = await api.get(`/analisis/guru/${hasilKuisId}`);
  console.log("Response from backend:", res.data);
  return extractData<AnalisisAIGuru>(res);
}

/**
 * Mengambil analisis guru berdasarkan materi
 * @param materiId - ID materi
 */
export async function getTeacherAnalysisByMateri(materiId: string) {
  const res = await api.get(`/analisis/guru/materi/${materiId}`);
  return extractData<AnalisisAIGuru[]>(res);
}

/**
 * Mengambil analisis guru berdasarkan siswa
 * @param siswaId - ID siswa
 */
export async function getTeacherAnalysisBySiswa(siswaId: string) {
  const res = await api.get(`/analisis/guru/siswa/${siswaId}`);
  return extractData<AnalisisAIGuru[]>(res);
}

/**
 * Menghapus analisis guru
 * @param analisisId - ID analisis guru
 */
export async function deleteTeacherAnalysis(analisisId: string) {
  const res = await api.delete(`/analisis/guru/${analisisId}`);
  const body = res.data as { success: boolean; status: string; message: string; data: null };

  if (body.success && body.status === "success") {
    return true;
  }

  throw new Error(body.message || "Gagal menghapus analisis guru");
}
