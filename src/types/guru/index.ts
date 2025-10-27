export interface Kelas {
  id: string;
  nama: string;
  jumlahSiswa: number;
  colorIndex?: number; // Optional: backend can specify color index
}

export interface Siswa {
  id: string;
  nama: string;
  nis: string;
  tanggalLahir: string;
  tempatLahir: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
}

export interface Materi {
  id: string;
  judul: string;
  deskripsi: string;
  topik: string;
  status: "published" | "draft";
  jumlahSiswaSelesai: number;
  totalSiswa: number;
  createdAt: string;
}

export interface PerformanceByLevel {
  level: "C1" | "C2" | "C3" | "C4" | "C5" | "C6";
  benar: number;
  salah: number;
}

export interface MateriProgress {
  materiId: string;
  judul: string;
  progress: number; // 0-100
  status: "completed" | "in_progress" | "not_started";
}

export interface StudentReport {
  siswaId: string;
  nama: string;
  performanceByLevel: PerformanceByLevel[];
  materiProgress: MateriProgress[];
}
