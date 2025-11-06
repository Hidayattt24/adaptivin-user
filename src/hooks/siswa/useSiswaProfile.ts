import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyProfile,
  updateMyProfile,
  updateMyPassword,
  getCurrentUser,
  getAllKarakter,
  type UserResponse,
  type KarakterInfo,
} from "@/lib/api/user";

// Query key constants
export const SISWA_QUERY_KEYS = {
  profile: ["siswa", "profile"],
  karakter: ["siswa", "karakter"],
};

/**
 * Hook untuk mendapatkan profile siswa yang sedang login
 */
export function useSiswaProfile() {
  return useQuery<UserResponse>({
    queryKey: SISWA_QUERY_KEYS.profile,
    queryFn: getMyProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true, // PENTING: Selalu refetch saat component mount
    refetchOnWindowFocus: true, // Refetch saat window focus untuk memastikan data fresh
  });
}

/**
 * Hook untuk mendapatkan profile dari local storage (sync)
 */
export function useCurrentSiswa() {
  return getCurrentUser();
}

/**
 * Hook untuk update profile siswa (nama, avatar, dll)
 */
export function useUpdateSiswaProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      nama_lengkap?: string;
      jenis_kelamin?: string;
      alamat?: string;
      tanggal_lahir?: string;
      karakter_id?: string;
    }) => updateMyProfile(data),
    onSuccess: (updatedUser) => {
      // Update cache dengan data terbaru
      queryClient.setQueryData(SISWA_QUERY_KEYS.profile, updatedUser);
      // Refetch untuk memastikan data benar-benar fresh dari server
      queryClient.refetchQueries({ queryKey: SISWA_QUERY_KEYS.profile });
    },
    onError: () => {
      // Meskipun error, invalidate cache untuk refetch data terbaru dari server
      // Karena user bilang data sudah tersimpan di database meskipun ada error 400
      queryClient.invalidateQueries({ queryKey: SISWA_QUERY_KEYS.profile });
    },
  });
}

/**
 * Hook untuk update password siswa
 */
export function useUpdateSiswaPassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      updateMyPassword(data),
  });
}

/**
 * Hook untuk mendapatkan list karakter yang tersedia
 */
export function useKarakter() {
  return useQuery<{ karakter: KarakterInfo[]; total: number }>({
    queryKey: SISWA_QUERY_KEYS.karakter,
    queryFn: getAllKarakter,
    staleTime: 10 * 60 * 1000, // 10 minutes (data karakter jarang berubah)
  });
}
