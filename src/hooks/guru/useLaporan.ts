import { useQuery } from "@tanstack/react-query";
import { getLaporanSiswa, getHasilKuisDetail } from "@/lib/api/laporan";

export function useStudentReport(kelasId: string, siswaId: string) {
  return useQuery({
    queryKey: ["guru", "laporan", kelasId, "student", siswaId],
    queryFn: () => getLaporanSiswa(kelasId, siswaId),
    enabled: !!kelasId && !!siswaId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useHasilKuisDetail(
  kelasId: string,
  siswaId: string,
  materiId: string
) {
  return useQuery({
    queryKey: ["guru", "laporan", kelasId, siswaId, "materi", materiId, "hasil-kuis"],
    queryFn: () => getHasilKuisDetail(kelasId, siswaId, materiId),
    enabled: !!kelasId && !!siswaId && !!materiId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
