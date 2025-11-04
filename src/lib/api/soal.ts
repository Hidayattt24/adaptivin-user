import axios from "axios";
import { getCookie, StorageKeys } from "../storage";

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
  level_soal: "c1" | "c2" | "c3" | "c4" | "c5" | "c6";
  tipe_jawaban: "pilihan_ganda" | "isian_singkat" | "angka";
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
  level_soal: "c1" | "c2" | "c3" | "c4" | "c5" | "c6";
  tipe_jawaban: "pilihan_ganda" | "isian_singkat" | "angka";
  soal_teks: string;
  soal_gambar?: File;
  penjelasan?: string;
  gambar_pendukung_jawaban?: File;
  durasi_soal: number; // in minutes, will be converted to seconds
  jawaban: Array<{ isi_jawaban: string; is_benar: boolean }>;
}

export interface UpdateSoalPayload {
  materi_id?: string;
  level_soal?: "c1" | "c2" | "c3" | "c4" | "c5" | "c6";
  tipe_jawaban?: "pilihan_ganda" | "isian_singkat" | "angka";
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
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  c5: number;
  c6: number;
  total: number;
}

// Axios instance with auth
const getAuthHeaders = () => {
  const token = getTokenFromCookie();
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// API Functions
export const soalAPI = {
  // Get materi dropdown list
  getMateriDropdown: async (): Promise<MateriDropdownItem[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/soal/materi-dropdown`, {
      headers: getAuthHeaders(),
    });
    return data.data;
  },

  // Get all soal with optional filters
  getAllSoal: async (filters?: {
    materi_id?: string;
    level_soal?: string;
    tipe_jawaban?: string;
  }): Promise<Soal[]> => {
    const params = new URLSearchParams();
    if (filters?.materi_id) params.append("materi_id", filters.materi_id);
    if (filters?.level_soal) params.append("level_soal", filters.level_soal);
    if (filters?.tipe_jawaban)
      params.append("tipe_jawaban", filters.tipe_jawaban);

    const { data } = await axios.get(
      `${API_BASE_URL}/soal?${params.toString()}`,
      {
        headers: getAuthHeaders(),
      }
    );

    // Map response: backend returns 'id', frontend expects 'soal_id'
    const rawData = data.data as Array<Record<string, unknown>>;
    return rawData.map((soal) => ({
      ...soal,
      soal_id: soal.id as string,
      jawaban: (soal.jawaban as Array<Record<string, unknown>>)?.map((j) => ({
        ...j,
        jawaban_id: j.id as string,
      })),
    })) as Soal[];
  },

  // Get soal count by materi
  getSoalCountByMateri: async (
    materi_id: string
  ): Promise<SoalCountByMateri> => {
    const { data } = await axios.get(
      `${API_BASE_URL}/soal/materi/${materi_id}/count`,
      {
        headers: getAuthHeaders(),
      }
    );
    return data.data;
  },

  // Get soal by ID
  getSoalById: async (soal_id: string): Promise<Soal> => {
    const { data } = await axios.get(`${API_BASE_URL}/soal/${soal_id}`, {
      headers: getAuthHeaders(),
    });

    // Map response: backend returns 'id', frontend expects 'soal_id'
    const rawData = data.data as Record<string, unknown>;
    return {
      ...rawData,
      soal_id: rawData.id as string,
      jawaban: (rawData.jawaban as Array<Record<string, unknown>>)?.map(
        (j) => ({
          ...j,
          jawaban_id: j.id as string,
        })
      ),
    } as Soal;
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

    const { data } = await axios.post(`${API_BASE_URL}/soal`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });

    // Map response: backend returns 'id', frontend expects 'soal_id'
    const rawData = data.data as Record<string, unknown>;
    return {
      ...rawData,
      soal_id: rawData.id as string,
      jawaban: (rawData.jawaban as Array<Record<string, unknown>>)?.map(
        (j) => ({
          ...j,
          jawaban_id: j.id as string,
        })
      ),
    } as Soal;
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

    const { data } = await axios.put(
      `${API_BASE_URL}/soal/${soal_id}`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Map response: backend returns 'id', frontend expects 'soal_id'
    const rawData = data.data as Record<string, unknown>;
    return {
      ...rawData,
      soal_id: rawData.id as string,
      jawaban: (rawData.jawaban as Array<Record<string, unknown>>)?.map(
        (j) => ({
          ...j,
          jawaban_id: j.id as string,
        })
      ),
    } as Soal;
  },

  // Delete soal
  deleteSoal: async (soal_id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/soal/${soal_id}`, {
      headers: getAuthHeaders(),
    });
  },
};
