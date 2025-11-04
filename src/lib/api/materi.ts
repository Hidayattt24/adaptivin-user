import axios from "axios";
import { getCookie, StorageKeys } from "@/lib/storage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Ambil token dari cookie dengan prefix
function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  return getCookie(StorageKeys.TOKEN);
}

// ==================== TYPES ====================
export interface Materi {
  id: string;
  kelas_id: string;
  judul_materi: string;
  deskripsi: string | null;
  jumlah_sub_materi: number;
  created_at: string;
  updated_at: string;
}

export interface SubMateriMedia {
  id: string;
  tipe_media: "pdf" | "video" | "gambar";
  url: string;
  created_at: string;
}

export interface SubMateri {
  id: string;
  materi_id: string;
  judul_sub_materi: string;
  isi_materi: string | null;
  urutan: number;
  created_at: string;
  updated_at: string;
  sub_materi_media?: SubMateriMedia[];
}

export interface MateriDetail extends Materi {
  sub_materi: SubMateri[];
}

export interface CreateMateriDto {
  kelas_id: string;
  judul_materi: string;
  deskripsi?: string;
}

export interface UpdateMateriDto {
  judul_materi: string;
  deskripsi?: string;
}

export interface CreateSubMateriDto {
  materi_id: string;
  judul_sub_materi: string;
  isi_materi?: string;
  urutan: number;
}

export interface UpdateSubMateriDto {
  judul_sub_materi?: string;
  isi_materi?: string;
  urutan?: number;
}

// ==================== API CLIENT ====================
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

// ==================== MATERI CRUD ====================

/**
 * Get all materi by kelas
 */
export async function getMateriByKelas(kelasId: string): Promise<Materi[]> {
  const response = await api.get(`/materi/materi/kelas/${kelasId}`);
  return response.data.materi || [];
}

/**
 * Get single materi by ID with all sub_materi
 */
export async function getMateriById(materiId: string): Promise<MateriDetail> {
  const response = await api.get(`/materi/materi/${materiId}`);
  return response.data.materi;
}

/**
 * Create new materi
 */
export async function createMateri(data: CreateMateriDto): Promise<Materi> {
  const response = await api.post("/materi/materi", data);
  return response.data.materi;
}

/**
 * Update materi
 */
export async function updateMateri(
  materiId: string,
  data: UpdateMateriDto
): Promise<Materi> {
  const response = await api.put(`/materi/materi/${materiId}`, data);
  return response.data.materi;
}

/**
 * Delete materi
 */
export async function deleteMateri(materiId: string): Promise<void> {
  await api.delete(`/materi/materi/${materiId}`);
}

// ==================== SUB_MATERI CRUD ====================

/**
 * Get all sub_materi for a materi
 */
export async function getSubMateriByMateri(
  materiId: string
): Promise<SubMateri[]> {
  const response = await api.get(`/materi/sub-materi/materi/${materiId}`);
  return response.data.sub_materi || [];
}

/**
 * Get single sub_materi by ID
 */
export async function getSubMateriById(
  subMateriId: string
): Promise<SubMateri> {
  const response = await api.get(`/materi/sub-materi/${subMateriId}`);
  return response.data.sub_materi;
}

/**
 * Create sub_materi with optional file upload
 */
export async function createSubMateri(
  data: CreateSubMateriDto,
  files?: File[]
): Promise<SubMateri> {
  const formData = new FormData();
  formData.append("materi_id", data.materi_id);
  formData.append("judul_sub_materi", data.judul_sub_materi);
  formData.append("isi_materi", data.isi_materi ?? "");
  formData.append("urutan", data.urutan.toString());

  // Add files if provided
  if (files && files.length > 0) {
    files.forEach((file, index) => {
      // Determine tipe_media from file type
      let tipeMedia = "pdf";
      if (file.type.startsWith("image/")) tipeMedia = "gambar";
      else if (file.type.startsWith("video/")) tipeMedia = "video";

      formData.append(`${tipeMedia}_${index}`, file);
    });
  }

  const response = await api.post("/materi/sub-materi", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.sub_materi;
}

/**
 * Update sub_materi (text only)
 */
export async function updateSubMateri(
  subMateriId: string,
  data: UpdateSubMateriDto
): Promise<SubMateri> {
  const response = await api.put(`/materi/sub-materi/${subMateriId}`, data);
  return response.data.sub_materi;
}

/**
 * Delete sub_materi
 */
export async function deleteSubMateri(subMateriId: string): Promise<void> {
  await api.delete(`/materi/sub-materi/${subMateriId}`);
}

// ==================== MEDIA CRUD ====================

/**
 * Upload media to existing sub_materi
 */
export async function uploadMedia(
  subMateriId: string,
  file: File,
  tipeMedia: "pdf" | "video" | "gambar"
): Promise<SubMateriMedia> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("tipe_media", tipeMedia);

  const response = await api.post(
    `/materi/media/sub-materi/${subMateriId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.media;
}

/**
 * Delete media
 */
export async function deleteMedia(mediaId: string): Promise<void> {
  await api.delete(`/materi/media/${mediaId}`);
}

/**
 * Get all media for sub_materi
 */
export async function getMediaBySubMateri(
  subMateriId: string
): Promise<SubMateriMedia[]> {
  const response = await api.get(`/materi/media/sub-materi/${subMateriId}`);
  return response.data.media || [];
}
