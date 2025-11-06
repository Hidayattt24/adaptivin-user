import { useQuery } from "@tanstack/react-query";
import {
  getMateriByKelas,
  getMateriById,
  getSubMateriByMateri,
  getSubMateriById,
  type Materi,
  type MateriDetail,
  type SubMateri,
} from "@/lib/api/materi";

/**
 * Query key constants untuk materi siswa
 */
export const SISWA_MATERI_QUERY_KEYS = {
  byKelas: (kelasId: string) => ["siswa", "materi", "kelas", kelasId] as const,
  detail: (materiId: string) => ["siswa", "materi", materiId] as const,
  subMateri: (materiId: string) => ["siswa", "sub-materi", materiId] as const,
  subMateriDetail: (subMateriId: string) => ["siswa", "sub-materi", "detail", subMateriId] as const,
};

/**
 * Hook untuk mendapatkan semua materi by kelas ID
 */
export function useMateriByKelas(kelasId: string | null) {
  return useQuery<Materi[]>({
    queryKey: SISWA_MATERI_QUERY_KEYS.byKelas(kelasId || ""),
    queryFn: () => getMateriByKelas(kelasId!),
    enabled: !!kelasId, // Only run if kelasId exists
    staleTime: 3 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook untuk mendapatkan detail materi dengan semua sub_materi
 */
export function useMateriById(materiId: string | null) {
  return useQuery<MateriDetail>({
    queryKey: SISWA_MATERI_QUERY_KEYS.detail(materiId || ""),
    queryFn: () => getMateriById(materiId!),
    enabled: !!materiId,
    staleTime: 3 * 60 * 1000,
  });
}

/**
 * Hook untuk mendapatkan sub materi by materi ID
 */
export function useSubMateriByMateri(materiId: string | null) {
  return useQuery<SubMateri[]>({
    queryKey: SISWA_MATERI_QUERY_KEYS.subMateri(materiId || ""),
    queryFn: () => getSubMateriByMateri(materiId!),
    enabled: !!materiId,
    staleTime: 3 * 60 * 1000,
  });
}

/**
 * Hook untuk mendapatkan detail single sub materi by ID
 */
export function useSubMateriById(subMateriId: string | null) {
  return useQuery<SubMateri>({
    queryKey: SISWA_MATERI_QUERY_KEYS.subMateriDetail(subMateriId || ""),
    queryFn: () => getSubMateriById(subMateriId!),
    enabled: !!subMateriId,
    staleTime: 3 * 60 * 1000,
  });
}
