import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, getMyProfile } from "@/lib/api/user";

export function useTeacherProfile() {
  return useQuery({
    queryKey: ["teacher", "profile"],
    queryFn: async () => {
      try {
        // Get current user from localStorage first (faster)
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
          throw new Error("User not authenticated");
        }

        // Refresh data dari server untuk data terbaru
        const profileData = await getMyProfile();
        
        return {
          id: profileData.id,
          nama_lengkap: profileData.nama_lengkap,
          email: profileData.email,
          role: profileData.role,
          jenis_kelamin: profileData.jenis_kelamin,
          nip: profileData.nip,
          alamat: profileData.alamat,
          sekolah_id: profileData.sekolah_id,
        };
      } catch (error) {
        console.error("Error fetching teacher profile:", error);
        
        // Fallback ke localStorage jika API gagal
        const currentUser = getCurrentUser();
        if (currentUser) {
          return currentUser;
        }
        
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // Cache 10 menit (profile jarang berubah)
    retry: 1,
  });
}
