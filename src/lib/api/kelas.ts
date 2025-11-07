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

export interface KelasResponse {
  id: string;
  sekolah_id: string;
  creator_id: string;
  nama_kelas: string;
  tingkat_kelas: string;
  rombel: string | null;
  mata_pelajaran: string | null;
  tahun_ajaran: string | null;
  created_at: string;
  updated_at: string;
  role_dalam_kelas?: "guru" | "siswa";
  jumlah_siswa?: number;
  student_profiles?: string[];
}

export interface KelasPayload {
  nama_kelas: string;
  tingkat_kelas: string;
  rombel?: string | null;
  mata_pelajaran?: string | null;
  tahun_ajaran?: string | null;
  sekolah_id?: string;
}

// Buat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Interceptor untuk selalu menambahkan Authorization header
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

// Fungsi CRUD kelas
export async function getAllKelas(options?: { sekolahId?: string }) {
  const params = options?.sekolahId
    ? { sekolah_id: options.sekolahId }
    : undefined;
  const res = await api.get("/kelas", { params });
  const data = unwrapApiResponse<{ kelas?: KelasResponse[] }>(res);
  return data.kelas ?? [];
}

export async function createKelas(payload: KelasPayload) {
  const res = await api.post("/kelas", payload);
  const data = unwrapApiResponse<{ kelas?: KelasResponse }>(res);
  if (!data.kelas) {
    throw new Error("Kelas payload missing from response");
  }
  return data.kelas;
}

export async function getKelasById(id: string) {
  const res = await api.get(`/kelas/${id}`);
  const data = unwrapApiResponse<{ kelas?: KelasResponse }>(res);
  if (!data.kelas) {
    throw new Error("Kelas not found in response");
  }
  return data.kelas;
}

export async function updateKelas(id: string, payload: Partial<KelasPayload>) {
  const res = await api.put(`/kelas/${id}`, payload);
  const data = unwrapApiResponse<{ kelas?: KelasResponse }>(res);
  if (!data.kelas) {
    throw new Error("Kelas payload missing from response");
  }
  return data.kelas;
}

export async function deleteKelas(id: string) {
  const res = await api.delete(`/kelas/${id}`);
  const data = unwrapApiResponse<{ kelas?: KelasResponse }>(res);
  if (!data.kelas) {
    throw new Error("Kelas payload missing from response");
  }
  return data.kelas;
}
