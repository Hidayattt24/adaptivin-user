import axios from "axios";
import { getCookie, StorageKeys } from "@/lib/storage";
import { unwrapApiResponse } from "./helpers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Ambil token dari cookie dengan prefix
function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  return getCookie(StorageKeys.TOKEN);
}

// ==================== TYPES ====================

export interface Kuis {
  id: string;
  materi_id: string;
  guru_id: string;
  judul: string;
  jumlah_soal: number;
  created_at: string;
  updated_at: string;
  materi?: {
    id: string;
    judul_materi: string;
    deskripsi: string;
  };
  guru?: {
    id: string;
    nama_lengkap: string;
  };
}

export interface CreateKuisPayload {
  materi_id: string;
  judul: string;
  jumlah_soal: number;
}

export interface UpdateKuisPayload {
  judul?: string;
  jumlah_soal?: number;
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
 * Mengambil semua kuis
 * @param materiId - Filter by materi ID (optional)
 */
export async function getAllKuis(materiId?: string) {
  const params = materiId ? { materi_id: materiId } : undefined;
  const res = await api.get("/kuis", { params });
  return unwrapApiResponse<Kuis[]>(res);
}

/**
 * Mengambil detail satu kuis
 * @param kuisId - ID kuis
 */
export async function getKuisById(kuisId: string) {
  const res = await api.get(`/kuis/${kuisId}`);
  return unwrapApiResponse<Kuis>(res);
}

/**
 * Mengambil kuis berdasarkan materi ID
 * Karena setiap materi hanya punya 1 kuis, ini akan return kuis tunggal atau null
 * @param materiId - ID materi
 */
export async function getKuisByMateri(materiId: string) {
  const res = await api.get("/kuis", { params: { materi_id: materiId } });
  const kuis = unwrapApiResponse<Kuis[]>(res);
  return kuis.length > 0 ? kuis[0] : null;
}

/**
 * Membuat kuis baru
 * @param payload - Data kuis baru
 */
export async function createKuis(payload: CreateKuisPayload) {
  const res = await api.post(`/kuis`, payload);
  return unwrapApiResponse<Kuis>(res);
}

/**
 * Update kuis
 * @param kuisId - ID kuis
 * @param payload - Data yang akan diupdate
 */
export async function updateKuis(kuisId: string, payload: UpdateKuisPayload) {
  const res = await api.put(`/kuis/${kuisId}`, payload);
  return unwrapApiResponse<Kuis>(res);
}

/**
 * Hapus kuis
 * @param kuisId - ID kuis
 */
export async function deleteKuis(kuisId: string) {
  const res = await api.delete(`/kuis/${kuisId}`);
  return unwrapApiResponse<null>(res);
}
