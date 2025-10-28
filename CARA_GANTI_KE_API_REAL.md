# Cara Mengganti Dummy Data ke API Real

Saat ini semua halaman guru menggunakan **data dummy** yang sudah terintegrasi dengan sistem lazy loading. Aplikasi tetap berfungsi dengan baik dan menampilkan skeleton loading saat data di-fetch.

## Status Saat Ini

✅ **Lazy loading sudah berjalan** - Data di-fetch setelah halaman render
✅ **Loading states berfungsi** - Skeleton muncul saat loading
✅ **Error handling siap** - Tombol retry tersedia
✅ **Data dummy tersedia** - Aplikasi bisa dijalankan tanpa backend

## Lokasi Dummy Data

Semua dummy data terletak di file hooks:

```
src/hooks/guru/
├── useClasses.ts         → Data kelas (10 kelas)
├── useMateri.ts          → Data materi (5 materi)
├── useSoal.ts            → Data soal (5 soal)
├── useSiswa.ts           → Data siswa (5 siswa)
└── useLaporan.ts         → Data laporan
```

## Cara Migrasi ke API Real

### Langkah 1: Backend Siap

Pastikan backend sudah implement endpoint sesuai dengan yang didefinisikan di:
```
src/services/guru/api.ts
```

**Contoh endpoint yang dibutuhkan:**
```
GET  /api/guru/dashboard                        → Daftar kelas
GET  /api/guru/kelas/:kelasId/materi?page=1    → Daftar materi
GET  /api/guru/kelas/:kelasId/soal?page=1      → Daftar soal
GET  /api/guru/kelas/:kelasId/siswa?page=1     → Daftar siswa
GET  /api/guru/kelas/:kelasId/laporan          → Laporan kelas
```

### Langkah 2: Uncomment API Call

Buka file hook yang ingin diubah, misalnya `src/hooks/guru/useMateri.ts`:

**SEBELUM (menggunakan dummy):**
```typescript
queryFn: async () => {
  // Simulasi delay API
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return dummy data (nanti ganti dengan API real)
  // return materiApi.getList(kelasId, page, abortControllerRef.current.signal);
  return dummyMateriData;
},
```

**SESUDAH (menggunakan API real):**
```typescript
queryFn: async () => {
  // Uncomment line ini untuk pakai API real
  return materiApi.getList(kelasId, page, abortControllerRef.current.signal);

  // Hapus atau comment dummy data
  // return dummyMateriData;
},
```

### Langkah 3: Hapus Dummy Data (Opsional)

Setelah API berjalan dengan baik, Anda bisa hapus constant dummy data:

```typescript
// Hapus bagian ini setelah API siap
const dummyMateriData = {
  items: [...],
  totalPages: 1,
  ...
};
```

### Langkah 4: Test

1. Jalankan aplikasi: `npm run dev`
2. Buka halaman guru
3. Periksa Network tab di DevTools untuk melihat API calls
4. Pastikan skeleton muncul saat loading
5. Pastikan data dari API muncul dengan benar
6. Test error state dengan matikan backend

## Format Response API yang Diharapkan

### Paginated List Response
```json
{
  "items": [...],
  "totalPages": 5,
  "currentPage": 1,
  "totalItems": 50
}
```

### Single Item Response
```json
{
  "id": "1",
  "nama": "...",
  ...
}
```

### Error Response
```json
{
  "message": "Error message dalam bahasa Indonesia",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Testing Checklist

Sebelum deploy, pastikan:

- [ ] Semua endpoint API sudah tersedia
- [ ] Response format sesuai dengan type di `src/types/guru/api.ts`
- [ ] Loading skeleton muncul dengan baik
- [ ] Error state muncul saat API gagal
- [ ] Retry button berfungsi
- [ ] Pagination berfungsi (jika backend support)
- [ ] Search berfungsi (debounced 300-400ms)
- [ ] Request di-cancel saat user navigasi ke halaman lain

## Fitur Lazy Loading yang Sudah Tersedia

✅ **Non-blocking render** - UI muncul langsung tanpa tunggu data
✅ **Skeleton loading** - Placeholder yang match dengan layout asli
✅ **Error handling** - Error message + retry button per section
✅ **Debounced search** - Search tidak spam API
✅ **Request cancellation** - Request otomatis cancel saat unmount
✅ **Caching** - Data di-cache 5 menit, garbage collection 10 menit
✅ **Background refetch** - Auto refetch saat tab focus/reconnect

## Tips Development

### Simulasi Loading State
Tambahkan delay artificial saat development untuk test skeleton:

```typescript
queryFn: async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 detik
  return materiApi.getList(...);
},
```

### Simulasi Error State
Throw error untuk test error handling:

```typescript
queryFn: async () => {
  throw new Error("Simulasi error untuk testing");
},
```

### Debug Network
Buka React Query Devtools (optional):
```bash
npm install @tanstack/react-query-devtools
```

Lalu tambahkan di `src/app/(platform)/guru/layout.tsx`:
```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

## Troubleshooting

### Problem: Data tidak muncul
**Solution:**
1. Check Network tab - apakah request terkirim?
2. Check response format - apakah sesuai dengan type?
3. Check console - ada error?

### Problem: Loading terus menerus
**Solution:**
1. Check `enabled` condition di hook - mungkin required param belum ada
2. Check API endpoint - mungkin timeout atau error

### Problem: Error "Request cancelled"
**Solution:**
Ini normal behavior saat user navigasi cepat. Request akan di-cancel otomatis.

## Pertanyaan?

Lihat dokumentasi lengkap di:
- `LAZY_LOADING_IMPLEMENTATION.md` - Technical details
- `LAZY_LOADING_SUMMARY.md` - Overview & summary
- `src/services/guru/api.ts` - API endpoint definitions
- `src/types/guru/api.ts` - Type definitions
