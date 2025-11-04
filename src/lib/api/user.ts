import axios from "axios";
import { getCookie, StorageKeys, getStorage, setStorage } from "@/lib/storage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Ambil token dari cookie dengan prefix
function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  return getCookie(StorageKeys.TOKEN);
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
  profil_siswa_index?: number | null;
  created_at?: string;
  updated_at?: string;
}

// Avatar options for siswa (5 avatars available)
export const STUDENT_AVATARS = [
  "/siswa/foto-profil/kocheng-oren.svg",
  "/siswa/foto-profil/bro-kerbuz.svg",
  "/siswa/foto-profil/sin-bunbun.svg",
  "/siswa/foto-profil/sis-monyet.svg",
  "/siswa/foto-profil/sis-nyanyuk.svg",
];

// Get avatar path by index
export function getStudentAvatar(index?: number | null): string {
  if (
    index === null ||
    index === undefined ||
    index < 0 ||
    index >= STUDENT_AVATARS.length
  ) {
    return STUDENT_AVATARS[0]; // Default to first avatar
  }
  return STUDENT_AVATARS[index];
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
  return res.data.user as UserResponse;
}

// Get current user's profile (refresh data dari server)
export async function getMyProfile() {
  const res = await api.get(`/users/me`);
  return res.data.user as UserResponse;
}

// Update user profile
export async function updateMyProfile(payload: {
  nama_lengkap?: string;
  jenis_kelamin?: string;
  alamat?: string;
  tanggal_lahir?: string;
  profil_siswa_index?: number;
}) {
  const res = await api.put(`/users/me`, payload);

  // Update storage dengan prefix
  const updatedUser = res.data.user;
  setStorage(StorageKeys.USER, updatedUser);

  return updatedUser as UserResponse;
}

// Update password
export async function updateMyPassword(payload: {
  currentPassword: string;
  newPassword: string;
}) {
  const res = await api.put(`/users/me/password`, payload);
  return res.data;
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
  profil_siswa_index: number | null;
  created_at: string;
  updated_at: string;
}

// Get siswa list by kelas
export async function getSiswaByKelas(kelasId: string) {
  const res = await api.get(`/users/kelas/${kelasId}/siswa`);
  return {
    siswa: res.data.siswa as SiswaResponse[],
    total: res.data.total as number,
  };
}
