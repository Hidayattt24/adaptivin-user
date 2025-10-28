import type {
  KelasResponse,
  MateriResponse,
  MateriCreateRequest,
  MateriUpdateRequest,
  SoalResponse,
  SoalCreateRequest,
  SoalUpdateRequest,
  SiswaResponse,
  SiswaCreateRequest,
  SiswaUpdateRequest,
  ClassReport,
  StudentReport,
  ProfileUpdateRequest,
  PasswordChangeRequest,
  PaginatedResponse,
} from "@/types/guru/api";

// API base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Helper to create AbortController for each request
export function createAbortController() {
  return new AbortController();
}

// Generic fetch wrapper with abort support
async function fetchWithAbort<T>(
  url: string,
  options: RequestInit = {},
  signal?: AbortSignal
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Terjadi kesalahan",
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Dashboard APIs
export const dashboardApi = {
  getClasses: (signal?: AbortSignal) =>
    fetchWithAbort<KelasResponse[]>("/guru/dashboard", {}, signal),
};

// Materi APIs
export const materiApi = {
  getList: (kelasId: string, page: number = 1, signal?: AbortSignal) =>
    fetchWithAbort<PaginatedResponse<MateriResponse>>(
      `/guru/kelas/${kelasId}/materi?page=${page}`,
      {},
      signal
    ),

  getById: (kelasId: string, materiId: string, signal?: AbortSignal) =>
    fetchWithAbort<MateriResponse>(
      `/guru/kelas/${kelasId}/materi/${materiId}`,
      {},
      signal
    ),

  create: (kelasId: string, data: MateriCreateRequest) =>
    fetchWithAbort<MateriResponse>(`/guru/kelas/${kelasId}/materi`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (kelasId: string, materiId: string, data: MateriUpdateRequest) =>
    fetchWithAbort<MateriResponse>(`/guru/kelas/${kelasId}/materi/${materiId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (kelasId: string, materiId: string) =>
    fetchWithAbort<{ success: boolean }>(`/guru/kelas/${kelasId}/materi/${materiId}`, {
      method: "DELETE",
    }),
};

// Soal APIs
export const soalApi = {
  getList: (
    kelasId: string,
    materiId?: string,
    page: number = 1,
    signal?: AbortSignal
  ) => {
    const queryParams = new URLSearchParams();
    if (materiId) queryParams.append("materiId", materiId);
    queryParams.append("page", page.toString());

    return fetchWithAbort<PaginatedResponse<SoalResponse>>(
      `/guru/kelas/${kelasId}/soal?${queryParams}`,
      {},
      signal
    );
  },

  getById: (kelasId: string, soalId: string, signal?: AbortSignal) =>
    fetchWithAbort<SoalResponse>(`/guru/kelas/${kelasId}/soal/${soalId}`, {}, signal),

  create: (kelasId: string, data: SoalCreateRequest) =>
    fetchWithAbort<SoalResponse>(`/guru/kelas/${kelasId}/soal`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (kelasId: string, soalId: string, data: SoalUpdateRequest) =>
    fetchWithAbort<SoalResponse>(`/guru/kelas/${kelasId}/soal/${soalId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (kelasId: string, soalId: string) =>
    fetchWithAbort<{ success: boolean }>(`/guru/kelas/${kelasId}/soal/${soalId}`, {
      method: "DELETE",
    }),
};

// Siswa APIs
export const siswaApi = {
  getList: (kelasId: string, page: number = 1, signal?: AbortSignal) =>
    fetchWithAbort<PaginatedResponse<SiswaResponse>>(
      `/guru/kelas/${kelasId}/siswa?page=${page}`,
      {},
      signal
    ),

  getById: (kelasId: string, siswaId: string, signal?: AbortSignal) =>
    fetchWithAbort<SiswaResponse>(
      `/guru/kelas/${kelasId}/siswa/${siswaId}`,
      {},
      signal
    ),

  create: (kelasId: string, data: SiswaCreateRequest) =>
    fetchWithAbort<SiswaResponse>(`/guru/kelas/${kelasId}/siswa`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (kelasId: string, siswaId: string, data: SiswaUpdateRequest) =>
    fetchWithAbort<SiswaResponse>(`/guru/kelas/${kelasId}/siswa/${siswaId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Laporan APIs
export const laporanApi = {
  getClassReport: (kelasId: string, signal?: AbortSignal) =>
    fetchWithAbort<ClassReport>(`/guru/kelas/${kelasId}/laporan`, {}, signal),

  getStudentReport: (
    kelasId: string,
    siswaId: string,
    signal?: AbortSignal
  ) =>
    fetchWithAbort<StudentReport>(
      `/guru/kelas/${kelasId}/laporan/${siswaId}`,
      {},
      signal
    ),
};

// Profile APIs
export const profileApi = {
  update: (data: ProfileUpdateRequest) =>
    fetchWithAbort<{ success: boolean }>("/guru/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  changePassword: (data: PasswordChangeRequest) =>
    fetchWithAbort<{ success: boolean }>("/guru/password", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
