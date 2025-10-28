import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { soalApi } from "@/services/guru/api";
import { useRef, useEffect } from "react";
import type { SoalCreateRequest, SoalUpdateRequest } from "@/types/guru/api";

// Dummy data untuk soal
const dummySoalData = {
  items: [
    {
      id: "1",
      soal: "Berapa hasil dari 1/2 + 1/4?",
      materiId: "1",
      level: "C2",
      jawaban: ["1/4", "3/4", "1/6", "2/4"],
      jawabanBenar: "3/4",
      createdAt: "2024-10-20",
    },
    {
      id: "2",
      soal: "Jika 12 ÷ 3 = 4, maka 12 ÷ 4 = ?",
      materiId: "2",
      level: "C1",
      jawaban: ["2", "3", "4", "6"],
      jawabanBenar: "3",
      createdAt: "2024-10-22",
    },
    {
      id: "3",
      soal: "Berapa banyak sisi pada persegi?",
      materiId: "3",
      level: "C1",
      jawaban: ["3", "4", "5", "6"],
      jawabanBenar: "4",
      createdAt: "2024-10-25",
    },
    {
      id: "4",
      soal: "1 jam = ... menit",
      materiId: "4",
      level: "C1",
      jawaban: ["30", "45", "60", "90"],
      jawabanBenar: "60",
      createdAt: "2024-10-26",
    },
    {
      id: "5",
      soal: "Diagram yang menggunakan batang untuk menampilkan data disebut?",
      materiId: "5",
      level: "C2",
      jawaban: ["Diagram Lingkaran", "Diagram Batang", "Diagram Garis", "Tabel"],
      jawabanBenar: "Diagram Batang",
      createdAt: "2024-10-27",
    },
  ],
  totalPages: 1,
  currentPage: 1,
  totalItems: 5,
};

export function useSoalList(
  kelasId: string,
  materiId?: string,
  page: number = 1
) {
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return useQuery({
    queryKey: ["guru", "soal", kelasId, "list", materiId, page],
    queryFn: async () => {
      // Simulasi delay API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Filter berdasarkan materiId jika ada
      let filteredItems = dummySoalData.items;
      if (materiId) {
        filteredItems = dummySoalData.items.filter((s) => s.materiId === materiId);
      }

      // Return dummy data (nanti ganti dengan API real)
      // return soalApi.getList(kelasId, materiId, page, abortControllerRef.current.signal);
      return {
        ...dummySoalData,
        items: filteredItems,
        totalItems: filteredItems.length,
      };
    },
    enabled: !!kelasId,
  });
}

export function useSoalDetail(kelasId: string, soalId: string) {
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return useQuery({
    queryKey: ["guru", "soal", kelasId, "detail", soalId],
    queryFn: async () => {
      // Simulasi delay API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Cari soal berdasarkan ID dari dummy data
      const soal = dummySoalData.items.find((s) => s.id === soalId);

      if (!soal) {
        throw new Error("Soal tidak ditemukan");
      }

      // Return dummy data (nanti ganti dengan API real)
      // return soalApi.getById(kelasId, soalId, abortControllerRef.current.signal);
      return soal;
    },
    enabled: !!kelasId && !!soalId,
  });
}

export function useCreateSoal(kelasId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SoalCreateRequest) => soalApi.create(kelasId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["guru", "soal", kelasId, "list"],
      });
    },
  });
}

export function useUpdateSoal(kelasId: string, soalId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SoalUpdateRequest) => soalApi.update(kelasId, soalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["guru", "soal", kelasId],
      });
    },
  });
}

export function useDeleteSoal(kelasId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (soalId: string) => soalApi.delete(kelasId, soalId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["guru", "soal", kelasId, "list"],
      });
    },
  });
}
