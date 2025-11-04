import { useQuery } from "@tanstack/react-query";
import {
  getMateriByKelas,
  getMateriById,
  getSubMateriByMateri,
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
};

/**
 * Hook untuk mendapatkan semua materi by kelas ID
 */
export function useMateriByKelas(kelasId: string | null) {
  return useQuery<Materi[]>({
    queryKey: SISWA_MATERI_QUERY_KEYS.byKelas(kelasId || ""),
    queryFn: () => getMateriByKelas(kelasId!),
    enabled: !!kelasId, // Only run if kelasId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
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
    staleTime: 5 * 60 * 1000,
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
    staleTime: 5 * 60 * 1000,
  });
}
