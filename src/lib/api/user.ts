import axios from "axios";
import { getCookie, StorageKeys, getStorage, setStorage } from "@/lib/storage";
import { unwrapApiResponse } from "./helpers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Ambil token dari cookie dengan prefix
function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  return getCookie(StorageKeys.TOKEN);
}

// Interface untuk Kelas
export interface KelasInfo {
  id: string;
  nama_kelas: string;
  tingkat_kelas: string;
  rombel: string | null;
  mata_pelajaran: string | null;
  tahun_ajaran: string | null;
  sekolah_id: string | null;
}

// Interface untuk Sekolah
export interface SekolahInfo {
  id: string;
  nama_sekolah: string;
}

// Interface untuk Karakter
export interface KarakterInfo {
  id: string;
  index: number;
  karakter_url: string;
  poto_profil_url: string;
}

// Interface untuk User (Guru/Siswa)
export interface UserResponse {
  id: string;
  nama_lengkap: string;
  email: string;
  role: "guru" | "siswa";
  jenis_kelamin?: string | null;
  nip?: string | null;
  nisn?: string | null;
  alamat?: string | null;
  tanggal_lahir?: string | null;
  sekolah_id?: string | null;
  karakter_id?: string | null;
  created_at?: string;
  updated_at?: string;
  kelas?: KelasInfo | null;
  sekolah?: SekolahInfo | null;
  karakter?: KarakterInfo | null;
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

// Get current user profile (dari storage dengan prefix)
export function getCurrentUser(): UserResponse | null {
  if (typeof window === "undefined") return null;

  // Import getStorage dari storage utility
  const user = getStorage(StorageKeys.USER);
  return user as UserResponse | null;
}

// Get user by ID
export async function getUserById(id: string) {
  const res = await api.get(`/users/${id}`);
  const data = unwrapApiResponse<{ user?: UserResponse }>(res);
  if (!data.user) {
    throw new Error("User not found in response");
  }
  return data.user;
}

// Get current user's profile (refresh data dari server)
export async function getMyProfile() {
  const res = await api.get(`/users/me`);
  const data = unwrapApiResponse<{ user?: UserResponse }>(res);
  if (!data.user) {
    throw new Error("User not found in response");
  }
  const userData = data.user;

  // PENTING: Update localStorage dengan data terbaru dari server
  // Ini memastikan getCurrentUser() selalu return data yang benar
  setStorage(StorageKeys.USER, userData);

  return userData;
}

// Update user profile
export async function updateMyProfile(payload: {
  nama_lengkap?: string;
  jenis_kelamin?: string;
  alamat?: string;
  tanggal_lahir?: string;
  karakter_id?: string;
}) {
  const res = await api.put(`/users/me`, payload);

  // Update storage dengan prefix
  const data = unwrapApiResponse<{ user?: UserResponse }>(res);
  if (!data.user) {
    throw new Error("User not found in response");
  }
  const updatedUser = data.user;
  setStorage(StorageKeys.USER, updatedUser);

  return updatedUser as UserResponse;
}

// Update password
export async function updateMyPassword(payload: {
  currentPassword: string;
  newPassword: string;
}) {
  const res = await api.put(`/users/me/password`, payload);
  return unwrapApiResponse<Record<string, unknown>>(res);
}

// Interface untuk Siswa di kelas
export interface SiswaResponse {
  id: string;
  nama_lengkap: string;
  email: string | null;
  nisn: string | null;
  jenis_kelamin: string | null;
  tanggal_lahir: string | null;
  alamat: string | null;
  karakter_id: string | null;
  created_at: string;
  updated_at: string;
  karakter?: KarakterInfo | null;
}

// Get siswa list by kelas
export async function getSiswaByKelas(kelasId: string) {
  const res = await api.get(`/users/kelas/${kelasId}/siswa`);
  const data = unwrapApiResponse<{ siswa?: SiswaResponse[]; total?: number }>(
    res
  );

  return {
    siswa: data.siswa ?? [],
    total: data.total ?? 0,
  };
}

// Get all available karakter (for pilih karakter page)
export async function getAllKarakter() {
  const res = await api.get(`/users/karakter`);
  const data = unwrapApiResponse<{
    karakter?: KarakterInfo[];
    total?: number;
  }>(res);

  return {
    karakter: data.karakter ?? [],
    total: data.total ?? 0,
  };
}
