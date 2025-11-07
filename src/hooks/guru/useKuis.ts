import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllKuis,
  getKuisById,
  getKuisByMateri,
  createKuis,
  updateKuis,
  deleteKuis,
  type CreateKuisPayload,
  type UpdateKuisPayload,
} from "@/lib/api/kuis";

// ==================== QUERY KEYS ====================
export const kuisKeys = {
  all: ["kuis"] as const,
  lists: () => [...kuisKeys.all, "list"] as const,
  list: (materiId?: string) => [...kuisKeys.lists(), { materiId }] as const,
  details: () => [...kuisKeys.all, "detail"] as const,
  detail: (id: string) => [...kuisKeys.details(), id] as const,
};

// ==================== HOOKS ====================

/**
 * Hook untuk mengambil semua kuis
 * @param materiId - Filter by materi ID (optional)
 */
export function useKuisList(materiId?: string) {
  return useQuery({
    queryKey: kuisKeys.list(materiId),
    queryFn: () => getAllKuis(materiId),
  });
}

/**
 * Hook untuk mengambil detail kuis
 * @param kuisId - ID kuis
 */
export function useKuisDetail(kuisId: string) {
  return useQuery({
    queryKey: kuisKeys.detail(kuisId),
    queryFn: () => getKuisById(kuisId),
    enabled: !!kuisId,
  });
}

/**
 * Hook untuk mengambil kuis berdasarkan materi
 * Karena 1 materi = 1 kuis, ini return kuis tunggal atau null
 * @param materiId - ID materi
 */
export function useKuisByMateri(materiId: string) {
  return useQuery({
    queryKey: [...kuisKeys.lists(), "by-materi", materiId],
    queryFn: () => getKuisByMateri(materiId),
    enabled: !!materiId,
  });
}

/**
 * Hook untuk membuat kuis baru
 */
export function useCreateKuis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateKuisPayload) => createKuis(payload),
    onSuccess: (kuis) => {
      // Invalidate list kuis untuk refresh data
      queryClient.invalidateQueries({ queryKey: kuisKeys.lists() });

      // Invalidate list kuis dengan filter materi_id jika ada
      if (kuis.materi_id) {
        queryClient.invalidateQueries({
          queryKey: kuisKeys.list(kuis.materi_id),
        });
      }
    },
  });
}

/**
 * Hook untuk update kuis
 */
export function useUpdateKuis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      kuisId,
      payload,
    }: {
      kuisId: string;
      payload: UpdateKuisPayload;
    }) => updateKuis(kuisId, payload),
    onSuccess: (kuis, variables) => {
      // Invalidate detail kuis
      queryClient.invalidateQueries({
        queryKey: kuisKeys.detail(variables.kuisId),
      });

      // Invalidate list kuis
      queryClient.invalidateQueries({ queryKey: kuisKeys.lists() });

      // Invalidate list kuis dengan filter materi_id
      if (kuis.materi_id) {
        queryClient.invalidateQueries({
          queryKey: kuisKeys.list(kuis.materi_id),
        });
      }
    },
  });
}

/**
 * Hook untuk hapus kuis
 */
export function useDeleteKuis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (kuisId: string) => deleteKuis(kuisId),
    onSuccess: () => {
      // Invalidate semua list kuis
      queryClient.invalidateQueries({ queryKey: kuisKeys.lists() });
    },
  });
}
