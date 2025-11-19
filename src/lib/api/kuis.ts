import axios from "axios";
import { getCookie, StorageKeys } from "@/lib/storage";
import { extractData } from "./responseHelper";

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
  return extractData<Kuis[]>(res);
}

/**
 * Mengambil detail satu kuis
 * @param kuisId - ID kuis
 */
export async function getKuisById(kuisId: string) {
  const res = await api.get(`/kuis/${kuisId}`);
  return extractData<Kuis>(res);
}

/**
 * Mengambil kuis berdasarkan materi ID
 * Karena setiap materi hanya punya 1 kuis, ini akan return kuis tunggal atau null
 * @param materiId - ID materi
 */
export async function getKuisByMateri(materiId: string) {
  const res = await api.get("/kuis", { params: { materi_id: materiId } });
  const kuis = extractData<Kuis[]>(res);
  return kuis.length > 0 ? kuis[0] : null;
}

/**
 * Membuat kuis baru
 * @param payload - Data kuis baru
 */
export async function createKuis(payload: CreateKuisPayload) {
  const res = await api.post(`/kuis`, payload);
  return extractData<Kuis>(res);
}

/**
 * Update kuis
 * @param kuisId - ID kuis
 * @param payload - Data yang akan diupdate
 */
export async function updateKuis(kuisId: string, payload: UpdateKuisPayload) {
  const res = await api.put(`/kuis/${kuisId}`, payload);
  return extractData<Kuis>(res);
}

/**
 * Hapus kuis
 * @param kuisId - ID kuis
 */
export async function deleteKuis(kuisId: string) {
  const res = await api.delete(`/kuis/${kuisId}`);
  return extractData<null>(res);
}

/**
 * Dapatkan jumlah siswa yang sudah mengerjakan kuis
 * @param kuisId - ID kuis
 * @returns Statistics of quiz completion
 */
export async function getKuisCompletionCount(kuisId: string): Promise<{
  total: number;
  completed: number;
  inProgress: number;
}> {
  try {
    // Get all hasil kuis for this kuis using query parameter
    const res = await api.get(`/hasil-kuis`, {
      params: { kuis_id: kuisId }
    });
    
    const hasilKuisList = extractData<Array<{
      id: string;
      selesai: boolean;
      siswa_id: string;
    }>>(res);

    // Calculate statistics based on selesai field
    const completed = hasilKuisList.filter(hasil => hasil.selesai === true).length;
    const inProgress = hasilKuisList.filter(hasil => hasil.selesai === false).length;
    const total = hasilKuisList.length;

    return { total, completed, inProgress };
  } catch (error) {
    console.error("Error fetching quiz completion count:", error);
    return { total: 0, completed: 0, inProgress: 0 };
  }
}

// ==================== ADAPTIVE QUIZ ====================

export interface JawabanSoal {
  id: string;
  soal_id: string;
  isi_jawaban: string;
  is_benar: boolean;
  gambar_jawaban?: string;
  label?: string;
}

export interface SoalAdaptif {
  id: string;
  soal_teks?: string;
  soal_gambar?: string;
  level_soal: string;
  tipe_jawaban: "pilihan_ganda" | "pilihan_ganda_kompleks" | "isian_singkat";
  durasi_soal: number;
  penjelasan?: string;
  gambar_pendukung_jawaban?: string;
  jawaban: JawabanSoal[];
}

/**
 * Mengambil soal adaptif untuk kuis
 * @param kuisId - ID kuis
 * @param currentLevel - Level soal saat ini (optional, default: level3)
 * @param hasilKuisId - ID hasil kuis untuk tracking soal yang sudah muncul (optional)
 */
export async function getSoalForKuis(
  kuisId: string,
  currentLevel?: string,
  hasilKuisId?: string
) {
  const params: Record<string, string> = {};
  if (currentLevel) params.current_level = currentLevel;
  if (hasilKuisId) params.hasil_kuis_id = hasilKuisId;

  const res = await api.get(`/kuis/${kuisId}/soal`, {
    params: Object.keys(params).length > 0 ? params : undefined,
  });
  return extractData<SoalAdaptif>(res);
}

// ==================== DETAIL JAWABAN SISWA ====================

export interface DetailJawabanSiswa {
  id: string;
  hasil_kuis_id: string;
  soal_id: string;
  jawaban_id?: string;
  level_soal: string;
  tipe_jawaban: string;
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

/**
 * Simpan jawaban siswa untuk satu soal
 * @param payload - Data jawaban siswa
 */
export async function createJawabanSiswa(payload: CreateJawabanPayload) {
  const res = await api.post("/jawaban", payload);
  return extractData<CreateJawabanResponse>(res);
}

/**
 * Ambil semua jawaban dalam satu sesi kuis
 * @param hasilKuisId - ID hasil kuis
 */
export async function getJawabanByHasilKuis(hasilKuisId: string) {
  const res = await api.get(`/jawaban/${hasilKuisId}`);
  return extractData<DetailJawabanSiswa[]>(res);
}

// ==================== HASIL KUIS SISWA ====================

export interface HasilKuisSiswa {
  id: string;
  kuis_id: string;
  siswa_id: string;
  total_benar: number;
  total_salah: number;
  total_waktu: number;
  selesai: boolean;
  poin_akumulatif?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Buat hasil kuis baru (saat siswa mulai kuis)
 * @param kuisId - ID kuis
 */
export async function createHasilKuis(kuisId: string) {
  const res = await api.post("/hasil-kuis", { kuis_id: kuisId });
  return extractData<HasilKuisSiswa>(res);
}

/**
 * Tandai kuis selesai
 * @param hasilKuisId - ID hasil kuis
 */
export async function finishHasilKuis(hasilKuisId: string) {
  const res = await api.put(`/hasil-kuis/${hasilKuisId}/selesai`);
  return extractData<HasilKuisSiswa>(res);
}

/**
 * Ambil detail hasil kuis
 * @param hasilKuisId - ID hasil kuis
 */
export async function getHasilKuisById(hasilKuisId: string) {
  const res = await api.get(`/hasil-kuis/${hasilKuisId}`);
  return extractData<HasilKuisSiswa>(res);
}

/**
 * Ambil riwayat kuis siswa untuk materi tertentu
 * @param materiId - ID materi
 */
export async function getRiwayatKuisByMateri(materiId: string) {
  const res = await api.get(`/hasil-kuis/riwayat/materi/${materiId}`);
  return extractData<HasilKuisSiswa[]>(res);
}

/**
 * Cek apakah siswa sudah menyelesaikan kuis untuk materi tertentu
 * @param materiId - ID materi
 */
export async function checkMateriCompletion(materiId: string): Promise<boolean> {
  try {
    const riwayat = await getRiwayatKuisByMateri(materiId);
    // Return true jika ada hasil kuis yang selesai
    return riwayat.some(hasil => hasil.selesai);
  } catch (error) {
    console.error("Error checking materi completion:", error);
    return false;
  }
}

/**
 * Cek banyak materi sekaligus untuk efisiensi
 * @param kelasId - ID kelas
 */
export async function getMateriCompletionStatus(kelasId: string) {
  try {
    const res = await api.get(`/hasil-kuis/riwayat/kelas/${kelasId}`);
    const riwayat = extractData<HasilKuisSiswa[]>(res);
    
    // Group by materi_id dan cek completion
    const completionMap: Record<string, boolean> = {};
    
    for (const hasil of riwayat) {
      // Get kuis info to map to materi
      if (hasil.kuis_id && hasil.selesai) {
        // We'll need to fetch kuis to get materi_id
        try {
          const kuis = await getKuisById(hasil.kuis_id);
          if (kuis.materi_id) {
            completionMap[kuis.materi_id] = true;
          }
        } catch (err) {
          console.error("Error fetching kuis:", err);
        }
      }
    }
    
    return completionMap;
  } catch (error) {
    console.error("Error getting materi completion status:", error);
    return {};
  }
}