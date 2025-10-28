import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/services/guru/api";
import { useRef, useEffect } from "react";

// Dummy data untuk kelas
const dummyClassesData = [
  {
    id: "1",
    nama: "Matematika Kelas IV A",
    jumlahSiswa: 28,
  },
  {
    id: "2",
    nama: "Matematika Kelas IV B",
    jumlahSiswa: 30,
  },
  {
    id: "3",
    nama: "Matematika Kelas V A",
    jumlahSiswa: 25,
  },
  {
    id: "4",
    nama: "Matematika Kelas V B",
    jumlahSiswa: 27,
  },
  {
    id: "5",
    nama: "Matematika Kelas VI A",
    jumlahSiswa: 26,
  },
  {
    id: "6",
    nama: "Matematika Kelas VI B",
    jumlahSiswa: 29,
  },
  {
    id: "7",
    nama: "Matematika Kelas IV C",
    jumlahSiswa: 31,
  },
  {
    id: "8",
    nama: "Matematika Kelas V C",
    jumlahSiswa: 28,
  },
  {
    id: "9",
    nama: "Matematika Kelas VI C",
    jumlahSiswa: 30,
  },
  {
    id: "10",
    nama: "Matematika Kelas IV D",
    jumlahSiswa: 27,
  },
];

export function useClasses() {
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return useQuery({
    queryKey: ["guru", "classes"],
    queryFn: async () => {
      // Simulasi delay API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Return dummy data (nanti ganti dengan API real)
      // return dashboardApi.getClasses(abortControllerRef.current.signal);
      return dummyClassesData;
    },
  });
}
