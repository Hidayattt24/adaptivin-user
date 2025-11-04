import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyProfile,
  updateMyProfile,
  updateMyPassword,
  getCurrentUser,
  type UserResponse,
} from "@/lib/api/user";

// Query key constants
export const SISWA_QUERY_KEYS = {
  profile: ["siswa", "profile"],
};

/**
 * Hook untuk mendapatkan profile siswa yang sedang login
 */
export function useSiswaProfile() {
  return useQuery<UserResponse>({
    queryKey: SISWA_QUERY_KEYS.profile,
    queryFn: getMyProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
      profil_siswa_index?: number;
    }) => updateMyProfile(data),
    onSuccess: (updatedUser) => {
      // Update cache
      queryClient.setQueryData(SISWA_QUERY_KEYS.profile, updatedUser);
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
