import { useQuery } from "@tanstack/react-query";
import { getAllKelas, KelasResponse } from "@/lib/api/kelas";
import { getMateriByKelas } from "@/lib/api/materi";

// Transform backend response ke format yang dibutuhkan UI
interface TransformedKelas {
  id: string;
  nama: string;
  jumlahSiswa: number;
  jumlahMateri: number;
  tingkatKelas: string;
  rombel: string | null;
  mataPelajaran: string | null;
  tahunAjaran: string | null;
  roleDalamKelas?: "guru" | "siswa";
  studentProfiles: string[]; // Array foto profil siswa (max 3)
}

async function transformKelasData(kelas: KelasResponse[]): Promise<TransformedKelas[]> {
  const transformedKelas = await Promise.all(
    kelas.map(async (k) => {
      // Fetch material count for each class
      let materiCount = 0;
      try {
        const materiList = await getMateriByKelas(k.id);
        materiCount = materiList.length;
      } catch (error) {
        console.error(`Error fetching materi for class ${k.id}:`, error);
      }

      return {
        id: k.id,
        nama: k.nama_kelas,
        jumlahSiswa: k.jumlah_siswa ?? 0,
        jumlahMateri: materiCount,
        tingkatKelas: k.tingkat_kelas,
        rombel: k.rombel,
        mataPelajaran: k.mata_pelajaran,
        tahunAjaran: k.tahun_ajaran,
        roleDalamKelas: k.role_dalam_kelas,
        studentProfiles: k.student_profiles ?? [], // Foto profil dari database
      };
    })
  );

  return transformedKelas;
}

export function useClasses() {
  return useQuery({
    queryKey: ["guru", "classes"],
    queryFn: async () => {
      try {
        // Fetch kelas dari API
        // Backend akan otomatis filter berdasarkan guru yang login (dari kelas_users)
        const kelasData = await getAllKelas();

        // Transform data untuk UI with material count
        return await transformKelasData(kelasData);
      } catch (error) {
        console.error("Error fetching classes:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache selama 5 menit
    retry: 2, // Retry 2x jika gagal
  });
}
