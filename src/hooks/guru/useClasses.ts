import { useQuery } from "@tanstack/react-query";
import { getAllKelas, KelasResponse } from "@/lib/api/kelas";

// Transform backend response ke format yang dibutuhkan UI
interface TransformedKelas {
  id: string;
  nama: string;
  jumlahSiswa: number;
  tingkatKelas: string;
  rombel: string | null;
  mataPelajaran: string | null;
  tahunAjaran: string | null;
  roleDalamKelas?: "guru" | "siswa";
}

function transformKelasData(kelas: KelasResponse[]): TransformedKelas[] {
  return kelas.map((k) => ({
    id: k.id,
    nama: k.nama_kelas,
    jumlahSiswa: k.jumlah_siswa ?? 0,
    tingkatKelas: k.tingkat_kelas,
    rombel: k.rombel,
    mataPelajaran: k.mata_pelajaran,
    tahunAjaran: k.tahun_ajaran,
    roleDalamKelas: k.role_dalam_kelas,
  }));
}

export function useClasses() {
  return useQuery({
    queryKey: ["guru", "classes"],
    queryFn: async () => {
      try {
        // Fetch kelas dari API
        // Backend akan otomatis filter berdasarkan guru yang login (dari kelas_users)
        const kelasData = await getAllKelas();

        // Transform data untuk UI
        return transformKelasData(kelasData);
      } catch (error) {
        console.error("Error fetching classes:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache selama 5 menit
    retry: 2, // Retry 2x jika gagal
  });
}
