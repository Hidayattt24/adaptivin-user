// API Response Types for Guru Portal

export interface PaginatedResponse<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Kelas
export interface KelasResponse {
  id: string;
  nama: string;
  jumlahSiswa: number;
  colorIndex?: number;
}

// Materi
export interface MateriResponse {
  id: string;
  judul: string;
  deskripsi: string;
  topik: string;
  status: "published" | "draft";
  jumlahSiswaSelesai: number;
  totalSiswa: number;
  createdAt: string;
}

export interface MateriCreateRequest {
  judul: string;
  deskripsi: string;
  topik: string;
  status?: "published" | "draft";
}

export type MateriUpdateRequest = Partial<MateriCreateRequest>;

// Soal/Quiz
export interface SoalResponse {
  id: string;
  soal: string;
  materiId: string;
  level: string;
  jawaban: string[];
  jawabanBenar: string;
  createdAt: string;
}

export interface SoalCreateRequest {
  soal: string;
  materiId: string;
  level: string;
  jawaban: string[];
  jawabanBenar: string;
}

export type SoalUpdateRequest = Partial<SoalCreateRequest>;

// Siswa
export interface SiswaResponse {
  id: string;
  nama: string;
  nis: string;
  tanggalLahir: string;
  tempatLahir: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
}

export interface SiswaCreateRequest {
  nama: string;
  nis: string;
  tanggalLahir: string;
  tempatLahir: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
}

export type SiswaUpdateRequest = Partial<SiswaCreateRequest>;

// Laporan
export interface PerformanceByLevel {
  level: "C1" | "C2" | "C3" | "C4" | "C5" | "C6";
  benar: number;
  salah: number;
}

export interface MateriProgress {
  materiId: string;
  judul: string;
  progress: number;
  status: "completed" | "in_progress" | "not_started";
}

export interface StudentReport {
  siswaId: string;
  nama: string;
  performanceByLevel: PerformanceByLevel[];
  materiProgress: MateriProgress[];
}

export interface ClassReport {
  kelasId: string;
  totalSiswa: number;
  studentReports: StudentReport[];
}

// Profile
export interface ProfileUpdateRequest {
  nama?: string;
  email?: string;
  phone?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
