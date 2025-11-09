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

export interface DetailJawabanSiswa {
  id: string;
  hasil_kuis_id: string;
  soal_id: string;
  jawaban_id?: string;
  level_soal: string;
  tipe_jawaban: "pilihan_ganda" | "pilihan_ganda_kompleks" | "isian_singkat";
  jawaban_siswa: string;
  benar: boolean;
  waktu_dijawab: number;
  created_at: string;
  soal?: {
    id: string;
    soal_teks?: string;
    soal_gambar?: string;
    level_soal: string;
    durasi_soal: number;
  };
  jawaban?: {
    id: string;
    isi_jawaban: string;
  };
}

export interface CreateJawabanPayload {
  hasil_kuis_id: string;
  soal_id: string;
  jawaban_id?: string;
  jawaban_siswa: string;
  waktu_dijawab: number;
}

export interface JawabanFeedback {
  is_correct: boolean;
  is_fast: boolean;
  speed: "cepat" | "sedang" | "lambat";
  next_level: string;
  level_change: "naik" | "tetap" | "turun";
  reasoning: string;
  points: number;
  analysis: {
    totalPoints: number;
    consecutiveCorrect: number;
    consecutiveWrong: number;
    consecutiveFastCorrect: number;
    consecutiveMediumCorrect: number;
    consecutiveSlowCorrect: number;
    recentAnswers: Array<{
      index: number;
      correct: boolean;
      speed: string;
      points: number;
      questionLevel: number;
      timeTaken: number;
      medianTime: number;
    }>;
  };
}

export interface CreateJawabanResponse {
  detail_jawaban: DetailJawabanSiswa;
  feedback: JawabanFeedback;
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
 * Menyimpan jawaban siswa untuk satu soal
 * @param payload - Data jawaban siswa
 * @returns Response dengan detail jawaban dan feedback (next level, reasoning, dll)
 */
export async function createJawaban(payload: CreateJawabanPayload) {
  const res = await api.post("/jawaban", payload);
  return extractData<CreateJawabanResponse>(res);
}

/**
 * Mengambil semua jawaban dalam satu sesi kuis
 * @param hasilKuisId - ID hasil kuis
 */
export async function getJawabanByHasilKuis(hasilKuisId: string) {
  const res = await api.get(`/jawaban/${hasilKuisId}`);
  return extractData<DetailJawabanSiswa[]>(res);
}

/**
 * Update jawaban (untuk retry)
 * @param jawabanId - ID jawaban
 * @param payload - Data yang akan diupdate
 */
export async function updateJawaban(
  jawabanId: string,
  payload: { jawaban_siswa?: string; waktu_dijawab?: number }
) {
  const res = await api.put(`/jawaban/${jawabanId}`, payload);
  return extractData<DetailJawabanSiswa>(res);
}

/**
 * Hapus jawaban (admin only)
 * @param jawabanId - ID jawaban
 */
export async function deleteJawaban(jawabanId: string) {
  const res = await api.delete(`/jawaban/${jawabanId}`);
  return extractData<null>(res);
}
