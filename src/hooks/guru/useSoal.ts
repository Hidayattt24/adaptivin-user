import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { soalAPI } from "@/lib/api/soal";
import type {
  CreateSoalPayload,
  UpdateSoalPayload,
} from "@/lib/api/soal";

// Get materi dropdown for soal creation
export function useMateriDropdown() {
  return useQuery({
    queryKey: ["soal", "materi-dropdown"],
    queryFn: () => soalAPI.getMateriDropdown(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get all soal with optional filters
export function useSoalList(filters?: {
  materi_id?: string;
  level_soal?: string;
  tipe_jawaban?: string;
}) {
  return useQuery({
    queryKey: ["soal", "list", filters],
    queryFn: () => soalAPI.getAllSoal(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Get soal count by materi
export function useSoalCountByMateri(materi_id?: string) {
  return useQuery({
    queryKey: ["soal", "count", materi_id],
    queryFn: () => soalAPI.getSoalCountByMateri(materi_id!),
    enabled: !!materi_id,
    staleTime: 1 * 60 * 1000,
  });
}

// Get soal detail by ID
export function useSoalDetail(soal_id?: string) {
  return useQuery({
    queryKey: ["soal", "detail", soal_id],
    queryFn: () => soalAPI.getSoalById(soal_id!),
    enabled: !!soal_id,
  });
}

// Create soal mutation
export function useCreateSoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSoalPayload) => soalAPI.createSoal(payload),
    onSuccess: () => {
      // Invalidate all soal queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["soal", "list"] });
      queryClient.invalidateQueries({ queryKey: ["soal", "count"] });
    },
  });
}

// Update soal mutation
export function useUpdateSoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ soal_id, payload }: { soal_id: string; payload: UpdateSoalPayload }) =>
      soalAPI.updateSoal(soal_id, payload),
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["soal", "list"] });
      queryClient.invalidateQueries({ queryKey: ["soal", "count"] });
      queryClient.invalidateQueries({ queryKey: ["soal", "detail", data.soal_id] });
    },
  });
}

// Delete soal mutation
export function useDeleteSoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (soal_id: string) => soalAPI.deleteSoal(soal_id),
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["soal", "list"] });
      queryClient.invalidateQueries({ queryKey: ["soal", "count"] });
    },
  });
}
