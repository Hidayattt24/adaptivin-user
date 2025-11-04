import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMateriByKelas,
  getMateriById,
  createMateri,
  updateMateri,
  deleteMateri,
  getSubMateriByMateri,
  createSubMateri,
  updateSubMateri,
  deleteSubMateri,
  uploadMedia,
  deleteMedia,
  type CreateMateriDto,
  type UpdateMateriDto,
  type CreateSubMateriDto,
  type UpdateSubMateriDto,
} from "@/lib/api/materi";

// ==================== MATERI HOOKS ====================

/**
 * Hook untuk get all materi by kelas
 */
export function useMateriList(kelasId: string) {
  return useQuery({
    queryKey: ["materi", "kelas", kelasId],
    queryFn: () => getMateriByKelas(kelasId),
    enabled: !!kelasId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook untuk get single materi by ID
 */
export function useMateriDetail(materiId: string) {
  return useQuery({
    queryKey: ["materi", materiId],
    queryFn: () => getMateriById(materiId),
    enabled: !!materiId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook untuk create materi
 */
export function useCreateMateri() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMateriDto) => createMateri(data),
    onSuccess: (_, variables) => {
      // Invalidate materi list for this kelas
      queryClient.invalidateQueries({
        queryKey: ["materi", "kelas", variables.kelas_id],
      });
    },
  });
}

/**
 * Hook untuk update materi
 */
export function useUpdateMateri() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      materiId,
      data,
    }: {
      materiId: string;
      data: UpdateMateriDto;
    }) => updateMateri(materiId, data),
    onSuccess: (data) => {
      // Invalidate specific materi and its list
      queryClient.invalidateQueries({ queryKey: ["materi", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["materi", "kelas", data.kelas_id],
      });
    },
  });
}

/**
 * Hook untuk delete materi
 */
export function useDeleteMateri() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (materiId: string) => deleteMateri(materiId),
    onSuccess: () => {
      // Invalidate all materi queries
      queryClient.invalidateQueries({ queryKey: ["materi"] });
    },
  });
}

// ==================== SUB_MATERI HOOKS ====================

/**
 * Hook untuk get all sub_materi by materi
 */
export function useSubMateriList(materiId: string) {
  return useQuery({
    queryKey: ["sub-materi", "materi", materiId],
    queryFn: () => getSubMateriByMateri(materiId),
    enabled: !!materiId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook untuk create sub_materi
 */
export function useCreateSubMateri() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      files,
    }: {
      data: CreateSubMateriDto;
      files?: File[];
    }) => createSubMateri(data, files),
    onSuccess: (result) => {
      // Invalidate sub_materi list and materi detail
      queryClient.invalidateQueries({
        queryKey: ["sub-materi", "materi", result.materi_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["materi", result.materi_id],
      });
    },
  });
}

/**
 * Hook untuk update sub_materi
 */
export function useUpdateSubMateri() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subMateriId,
      data,
    }: {
      subMateriId: string;
      data: UpdateSubMateriDto;
    }) => updateSubMateri(subMateriId, data),
    onSuccess: (result) => {
      // Invalidate sub_materi list and materi detail
      queryClient.invalidateQueries({
        queryKey: ["sub-materi", "materi", result.materi_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["materi", result.materi_id],
      });
    },
  });
}

/**
 * Hook untuk delete sub_materi
 */
export function useDeleteSubMateri() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subMateriId: string) => deleteSubMateri(subMateriId),
    onSuccess: () => {
      // Invalidate all sub_materi queries
      queryClient.invalidateQueries({ queryKey: ["sub-materi"] });
      queryClient.invalidateQueries({ queryKey: ["materi"] });
    },
  });
}

// ==================== MEDIA HOOKS ====================

/**
 * Hook untuk upload media
 */
export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subMateriId,
      file,
      tipeMedia,
    }: {
      subMateriId: string;
      file: File;
      tipeMedia: "pdf" | "video" | "gambar";
    }) => uploadMedia(subMateriId, file, tipeMedia),
    onSuccess: () => {
      // Invalidate sub_materi to refresh media list
      queryClient.invalidateQueries({
        queryKey: ["sub-materi"],
      });
      queryClient.invalidateQueries({
        queryKey: ["materi"],
      });
    },
  });
}

/**
 * Hook untuk delete media
 */
export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mediaId: string) => deleteMedia(mediaId),
    onSuccess: () => {
      // Invalidate sub_materi to refresh media list
      queryClient.invalidateQueries({ queryKey: ["sub-materi"] });
      queryClient.invalidateQueries({ queryKey: ["materi"] });
    },
  });
}
