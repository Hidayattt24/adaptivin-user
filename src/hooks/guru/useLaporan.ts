import { useQuery } from "@tanstack/react-query";
import { laporanApi } from "@/services/guru/api";
import { useRef, useEffect } from "react";

// Dummy data untuk laporan kelas
const dummyClassReportData = {
  kelasId: "1",
  totalSiswa: 30,
  studentReports: [
    {
      siswaId: "1",
      nama: "Ahmad Fauzi",
      performanceByLevel: [
        { level: "Level 1" as const, benar: 8, salah: 2 },
        { level: "Level 2" as const, benar: 7, salah: 3 },
        { level: "Level 3" as const, benar: 6, salah: 4 },
        { level: "Level 4" as const, benar: 5, salah: 5 },
        { level: "Level 5" as const, benar: 4, salah: 6 },
        { level: "Level 6" as const, benar: 3, salah: 7 },
      ],
      materiProgress: [
        {
          materiId: "1",
          judul: "Pecahan Dasar & Bilangan",
          progress: 80,
          status: "in_progress" as const,
        },
        {
          materiId: "2",
          judul: "Perkalian & Pembagian",
          progress: 100,
          status: "completed" as const,
        },
      ],
    },
  ],
};

export function useClassReport(kelasId: string) {
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return useQuery({
    queryKey: ["guru", "laporan", kelasId, "class"],
    queryFn: async () => {
      // Simulasi delay API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Return dummy data (nanti ganti dengan API real)
      // return laporanApi.getClassReport(kelasId, abortControllerRef.current.signal);
      return dummyClassReportData;
    },
    enabled: !!kelasId,
  });
}

export function useStudentReport(kelasId: string, siswaId: string) {
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return useQuery({
    queryKey: ["guru", "laporan", kelasId, "student", siswaId],
    queryFn: async () => {
      // Simulasi delay API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Cari student report dari dummy data
      const studentReport = dummyClassReportData.studentReports.find(
        (r) => r.siswaId === siswaId
      );

      if (!studentReport) {
        // Return data default jika tidak ditemukan
        return {
          siswaId,
          nama: "Siswa",
          performanceByLevel: [
            { level: "Level 1" as const, benar: 0, salah: 0 },
            { level: "Level 2" as const, benar: 0, salah: 0 },
            { level: "Level 3" as const, benar: 0, salah: 0 },
            { level: "Level 4" as const, benar: 0, salah: 0 },
            { level: "Level 5" as const, benar: 0, salah: 0 },
            { level: "Level 6" as const, benar: 0, salah: 0 },
          ],
          materiProgress: [],
        };
      }

      // Return dummy data (nanti ganti dengan API real)
      // return laporanApi.getStudentReport(kelasId, siswaId, abortControllerRef.current.signal);
      return studentReport;
    },
    enabled: !!kelasId && !!siswaId,
  });
}
