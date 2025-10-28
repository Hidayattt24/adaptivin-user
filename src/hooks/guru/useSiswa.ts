import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { siswaApi } from "@/services/guru/api";
import { useRef, useEffect } from "react";
import type { SiswaCreateRequest, SiswaUpdateRequest } from "@/types/guru/api";

// Dummy data untuk siswa
const dummySiswaData = {
  items: [
    {
      id: "1",
      nama: "Ahmad Fauzi",
      nis: "20240001",
      tanggalLahir: "2015-05-15",
      tempatLahir: "Jakarta",
      jenisKelamin: "Laki-laki" as const,
    },
    {
      id: "2",
      nama: "Siti Nurhaliza",
      nis: "20240002",
      tanggalLahir: "2015-08-22",
      tempatLahir: "Bandung",
      jenisKelamin: "Perempuan" as const,
    },
    {
      id: "3",
      nama: "Budi Santoso",
      nis: "20240003",
      tanggalLahir: "2015-03-10",
      tempatLahir: "Surabaya",
      jenisKelamin: "Laki-laki" as const,
    },
    {
      id: "4",
      nama: "Dewi Lestari",
      nis: "20240004",
      tanggalLahir: "2015-11-30",
      tempatLahir: "Yogyakarta",
      jenisKelamin: "Perempuan" as const,
    },
    {
      id: "5",
      nama: "Rina Amelia",
      nis: "20240005",
      tanggalLahir: "2015-07-18",
      tempatLahir: "Medan",
      jenisKelamin: "Perempuan" as const,
    },
  ],
  totalPages: 1,
  currentPage: 1,
  totalItems: 5,
};

export function useSiswaList(kelasId: string, page: number = 1) {
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return useQuery({
    queryKey: ["guru", "siswa", kelasId, "list", page],
    queryFn: async () => {
      // Simulasi delay API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Return dummy data (nanti ganti dengan API real)
      // return siswaApi.getList(kelasId, page, abortControllerRef.current.signal);
      return dummySiswaData;
    },
    enabled: !!kelasId,
  });
}

export function useSiswaDetail(kelasId: string, siswaId: string) {
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return useQuery({
    queryKey: ["guru", "siswa", kelasId, "detail", siswaId],
    queryFn: async () => {
      // Simulasi delay API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Cari siswa berdasarkan ID dari dummy data
      const siswa = dummySiswaData.items.find((s) => s.id === siswaId);

      if (!siswa) {
        throw new Error("Siswa tidak ditemukan");
      }

      // Return dummy data (nanti ganti dengan API real)
      // return siswaApi.getById(kelasId, siswaId, abortControllerRef.current.signal);
      return siswa;
    },
    enabled: !!kelasId && !!siswaId,
  });
}

export function useCreateSiswa(kelasId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SiswaCreateRequest) => siswaApi.create(kelasId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["guru", "siswa", kelasId, "list"],
      });
    },
  });
}

export function useUpdateSiswa(kelasId: string, siswaId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SiswaUpdateRequest) => siswaApi.update(kelasId, siswaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["guru", "siswa", kelasId],
      });
    },
  });
}
