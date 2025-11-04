import { useQuery } from "@tanstack/react-query";
import { getAllKelas, getKelasById, type KelasResponse } from "@/lib/api/kelas";

/**
 * Query key constants untuk kelas siswa
 */
export const SISWA_KELAS_QUERY_KEYS = {
  all: ["siswa", "kelas"] as const,
  detail: (id: string) => ["siswa", "kelas", id] as const,
};

/**
 * Hook untuk mendapatkan semua kelas siswa
 * Mengambil data dari table kelas_users
 */
export function useSiswaKelas() {
  return useQuery<KelasResponse[]>({
    queryKey: SISWA_KELAS_QUERY_KEYS.all,
    queryFn: getAllKelas,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook untuk mendapatkan detail kelas by ID
 */
export function useKelasById(kelasId: string | null) {
  return useQuery<KelasResponse>({
    queryKey: SISWA_KELAS_QUERY_KEYS.detail(kelasId || ""),
    queryFn: () => getKelasById(kelasId!),
    enabled: !!kelasId, // Only run if kelasId exists
    staleTime: 5 * 60 * 1000,
  });
}
