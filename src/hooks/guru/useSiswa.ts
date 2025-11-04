import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSiswaByKelas, SiswaResponse } from "@/lib/api/user";
import { useRef, useEffect } from "react";

// Transform API response to UI format
function transformSiswaData(siswa: SiswaResponse[]) {
  return siswa.map((s) => ({
    id: s.id,
    nama: s.nama_lengkap || "",
    nis: s.nisn || "-",
    tanggalLahir: s.tanggal_lahir
      ? new Date(s.tanggal_lahir).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-",
    tempatLahir: s.alamat || "-",
    jenisKelamin: (s.jenis_kelamin === "laki-laki"
      ? "Laki-laki"
      : s.jenis_kelamin === "perempuan"
      ? "Perempuan"
      : "-") as "Laki-laki" | "Perempuan",
    email: s.email,
    profilIndex: s.profil_siswa_index,
  }));
}

export function useSiswaList(kelasId: string) {
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return useQuery({
    queryKey: ["guru", "siswa", kelasId, "list"],
    queryFn: async () => {
      const data = await getSiswaByKelas(kelasId);
      return {
        items: transformSiswaData(data.siswa),
        total: data.total,
      };
    },
    enabled: !!kelasId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useSiswaDetail(kelasId: string, siswaId: string) {
  return useQuery({
    queryKey: ["guru", "siswa", kelasId, "detail", siswaId],
    queryFn: async () => {
      const data = await getSiswaByKelas(kelasId);
      const siswa = data.siswa.find((s) => s.id === siswaId);

      if (!siswa) {
        throw new Error("Siswa tidak ditemukan");
      }

      return transformSiswaData([siswa])[0];
    },
    enabled: !!kelasId && !!siswaId,
    staleTime: 5 * 60 * 1000,
  });
}

// TODO: Implement create/update siswa when needed
// export function useCreateSiswa(kelasId: string) {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (data) => createSiswa(kelasId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["guru", "siswa", kelasId, "list"],
//       });
//     },
//   });
// }

// export function useUpdateSiswa(kelasId: string, siswaId: string) {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (data) => updateSiswa(kelasId, siswaId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["guru", "siswa", kelasId],
//       });
//     },
//   });
// }
