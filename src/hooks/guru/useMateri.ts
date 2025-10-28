import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { materiApi } from "@/services/guru/api";
import { useRef, useEffect } from "react";
import type { MateriCreateRequest, MateriUpdateRequest } from "@/types/guru/api";

// Dummy data untuk materi
const dummyMateriData = {
  items: [
    {
      id: "1",
      judul: "Pecahan Dasar & Bilangan",
      topik: "Bilangan",
      status: "published" as const,
      deskripsi: "Pengenalan konsep pecahan dan operasi dasar bilangan",
      jumlahSiswaSelesai: 25,
      totalSiswa: 30,
      createdAt: "2024-10-20",
    },
    {
      id: "2",
      judul: "Perkalian & Pembagian",
      topik: "Operasi Hitung",
      status: "published" as const,
      deskripsi: "Mempelajari operasi perkalian dan pembagian bilangan cacah",
      jumlahSiswaSelesai: 28,
      totalSiswa: 30,
      createdAt: "2024-10-22",
    },
    {
      id: "3",
      judul: "Geometri Bangun Datar",
      topik: "Geometri",
      status: "published" as const,
      deskripsi: "Mengenal berbagai bangun datar dan sifat-sifatnya",
      jumlahSiswaSelesai: 20,
      totalSiswa: 30,
      createdAt: "2024-10-25",
    },
    {
      id: "4",
      judul: "Pengukuran Waktu",
      topik: "Pengukuran",
      status: "draft" as const,
      deskripsi: "Memahami konsep waktu dan cara mengukurnya",
      jumlahSiswaSelesai: 0,
      totalSiswa: 30,
      createdAt: "2024-10-26",
    },
    {
      id: "5",
      judul: "Statistika Sederhana",
      topik: "Statistika",
      status: "published" as const,
      deskripsi: "Pengenalan diagram batang dan pengolahan data sederhana",
      jumlahSiswaSelesai: 15,
      totalSiswa: 30,
      createdAt: "2024-10-27",
    },
  ],
  totalPages: 1,
  currentPage: 1,
  totalItems: 5,
};

export function useMateriList(kelasId: string, page: number = 1) {
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return useQuery({
    queryKey: ["guru", "materi", kelasId, "list", page],
    queryFn: async () => {
      // Simulasi delay API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Return dummy data (nanti ganti dengan API real)
      // return materiApi.getList(kelasId, page, abortControllerRef.current.signal);
      return dummyMateriData;
    },
    enabled: !!kelasId,
  });
}

export function useMateriDetail(kelasId: string, materiId: string) {
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return useQuery({
    queryKey: ["guru", "materi", kelasId, "detail", materiId],
    queryFn: async () => {
      // Simulasi delay API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Cari materi berdasarkan ID dari dummy data
      const materi = dummyMateriData.items.find((m) => m.id === materiId);

      if (!materi) {
        throw new Error("Materi tidak ditemukan");
      }

      // Return dummy data (nanti ganti dengan API real)
      // return materiApi.getById(kelasId, materiId, abortControllerRef.current.signal);
      return materi;
    },
    enabled: !!kelasId && !!materiId,
  });
}

export function useCreateMateri(kelasId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MateriCreateRequest) => materiApi.create(kelasId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["guru", "materi", kelasId, "list"],
      });
    },
  });
}

export function useUpdateMateri(kelasId: string, materiId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MateriUpdateRequest) => materiApi.update(kelasId, materiId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["guru", "materi", kelasId],
      });
    },
  });
}

export function useDeleteMateri(kelasId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (materiId: string) => materiApi.delete(kelasId, materiId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["guru", "materi", kelasId, "list"],
      });
    },
  });
}
