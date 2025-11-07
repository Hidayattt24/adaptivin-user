import axios from "axios";
import { getCookie, StorageKeys } from "../storage";
import { unwrapApiResponse } from "./helpers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  return getCookie(StorageKeys.TOKEN);
}

// Types
export interface MateriDropdownItem {
  materi_id: string;
  judul_materi: string;
  jumlah_soal: number;
  thumbnail_url?: string;
}

export interface JawabanSoal {
  jawaban_id?: string;
  isi_jawaban: string;
  is_benar: boolean;
}

export interface Soal {
  soal_id: string;
  materi_id: string;
  level_soal: "level1" | "level2" | "level3" | "level4" | "level5" | "level6";
  tipe_jawaban: "pilihan_ganda" | "pilihan_ganda_kompleks" | "isian_singkat";
  soal_teks: string;
  soal_gambar?: string;
  penjelasan?: string;
  gambar_pendukung_jawaban?: string;
  durasi_soal: number; // in seconds from backend
  created_at: string;
  updated_at: string;
  jawaban?: JawabanSoal[];
  materi?: {
    judul_materi: string;
  };
}

export interface CreateSoalPayload {
  materi_id: string;
  level_soal: "level1" | "level2" | "level3" | "level4" | "level5" | "level6";
  tipe_jawaban: "pilihan_ganda" | "pilihan_ganda_kompleks" | "isian_singkat";
  soal_teks: string;
  soal_gambar?: File;
  penjelasan?: string;
  gambar_pendukung_jawaban?: File;
  durasi_soal: number; // in minutes, will be converted to seconds
  jawaban: Array<{ isi_jawaban: string; is_benar: boolean }>;
}

export interface UpdateSoalPayload {
  materi_id?: string;
  level_soal?: "level1" | "level2" | "level3" | "level4" | "level5" | "level6";
  tipe_jawaban?: "pilihan_ganda" | "pilihan_ganda_kompleks" | "isian_singkat";
  soal_teks?: string;
  soal_gambar?: File;
  hapus_soal_gambar?: boolean;
  penjelasan?: string;
  gambar_pendukung_jawaban?: File;
  hapus_gambar_pendukung?: boolean;
  durasi_soal?: number; // in minutes
  jawaban?: Array<{ isi_jawaban: string; is_benar: boolean }>;
}

export interface SoalCountByMateri {
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
  level6: number;
  total: number;
}

// Axios instance with auth
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

const mapSoalResponse = (rawData: Array<Record<string, unknown>>): Soal[] =>
  rawData.map((soal) => ({
    ...soal,
    soal_id: soal.id as string,
    jawaban: (soal.jawaban as Array<Record<string, unknown>>)?.map((j) => ({
      ...j,
      jawaban_id: j.id as string,
    })),
  })) as Soal[];

// API Functions
export const soalAPI = {
  // Get materi dropdown list
  getMateriDropdown: async (): Promise<MateriDropdownItem[]> => {
    const res = await api.get(`/soal/materi-dropdown`);
    const payload = unwrapApiResponse<{ data?: MateriDropdownItem[] }>(res);
    return payload.data ?? [];
  },

  // Get all soal with optional filters
  getAllSoal: async (filters?: {
    materi_id?: string;
    level_soal?: string;
    tipe_jawaban?: string;
  }): Promise<Soal[]> => {
    const params: Record<string, string> = {};
    if (filters?.materi_id) params.materi_id = filters.materi_id;
    if (filters?.level_soal) params.level_soal = filters.level_soal;
    if (filters?.tipe_jawaban) params.tipe_jawaban = filters.tipe_jawaban;

    const res = await api.get(`/soal`, { params });
    const payload = unwrapApiResponse<{
      data?: Array<Record<string, unknown>>;
    }>(res);
    const rawData = payload.data ?? [];
    return mapSoalResponse(rawData);
  },

  // Get soal count by materi
  getSoalCountByMateri: async (
    materi_id: string
  ): Promise<SoalCountByMateri> => {
    const res = await api.get(`/soal/materi/${materi_id}/count`);
    const payload = unwrapApiResponse<{ data?: SoalCountByMateri }>(res);
    if (!payload.data) {
      throw new Error("Response tidak mengandung data jumlah soal");
    }
    return payload.data;
  },

  // Get soal by ID
  getSoalById: async (soal_id: string): Promise<Soal> => {
    const res = await api.get(`/soal/${soal_id}`);
    const responsePayload = unwrapApiResponse<{
      data?: Record<string, unknown>;
    }>(res);
    if (!responsePayload.data) {
      throw new Error("Soal tidak ditemukan");
    }
    return mapSoalResponse([responsePayload.data])[0];
  },

  // Create new soal
  createSoal: async (payload: CreateSoalPayload): Promise<Soal> => {
    const formData = new FormData();
    formData.append("materi_id", payload.materi_id);
    formData.append("level_soal", payload.level_soal);
    formData.append("tipe_jawaban", payload.tipe_jawaban);
    formData.append("soal_teks", payload.soal_teks);
    formData.append("durasi_soal", payload.durasi_soal.toString());
    formData.append("jawaban", JSON.stringify(payload.jawaban));

    if (payload.soal_gambar) {
      formData.append("soal_gambar", payload.soal_gambar);
    }
    if (payload.penjelasan) {
      formData.append("penjelasan", payload.penjelasan);
    }
    if (payload.gambar_pendukung_jawaban) {
      formData.append(
        "gambar_pendukung_jawaban",
        payload.gambar_pendukung_jawaban
      );
    }

    const res = await api.post(`/soal`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const responsePayload = unwrapApiResponse<{
      data?: Record<string, unknown>;
    }>(res);
    if (!responsePayload.data) {
      throw new Error("Response tidak mengandung soal");
    }
    return mapSoalResponse([responsePayload.data])[0];
  },

  // Update soal
  updateSoal: async (
    soal_id: string,
    payload: UpdateSoalPayload
  ): Promise<Soal> => {
    const formData = new FormData();

    if (payload.materi_id) formData.append("materi_id", payload.materi_id);
    if (payload.level_soal) formData.append("level_soal", payload.level_soal);
    if (payload.tipe_jawaban)
      formData.append("tipe_jawaban", payload.tipe_jawaban);
    if (payload.soal_teks) formData.append("soal_teks", payload.soal_teks);
    if (payload.durasi_soal)
      formData.append("durasi_soal", payload.durasi_soal.toString());
    if (payload.jawaban)
      formData.append("jawaban", JSON.stringify(payload.jawaban));
    if (payload.penjelasan !== undefined)
      formData.append("penjelasan", payload.penjelasan);

    if (payload.soal_gambar) {
      formData.append("soal_gambar", payload.soal_gambar);
    }
    if (payload.hapus_soal_gambar) {
      formData.append("hapus_soal_gambar", "true");
    }
    if (payload.gambar_pendukung_jawaban) {
      formData.append(
        "gambar_pendukung_jawaban",
        payload.gambar_pendukung_jawaban
      );
    }
    if (payload.hapus_gambar_pendukung) {
      formData.append("hapus_gambar_pendukung", "true");
    }

    const res = await api.put(`/soal/${soal_id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const responsePayload = unwrapApiResponse<{
      data?: Record<string, unknown>;
    }>(res);
    if (!responsePayload.data) {
      throw new Error("Response tidak mengandung soal");
    }
    return mapSoalResponse([responsePayload.data])[0];
  },

  // Delete soal
  deleteSoal: async (soal_id: string): Promise<void> => {
    await api.delete(`/soal/${soal_id}`);
  },
};
