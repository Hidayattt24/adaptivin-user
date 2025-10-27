# Guru Components

Reusable components untuk halaman-halaman guru (teacher).

## 📦 Components Available

### 1. **SearchBar**
Search bar dengan design custom untuk mencari data.

**Props:**
- `value: string` - Nilai search query
- `onChange: (value: string) => void` - Handler untuk perubahan value
- `onSubmit?: (e: React.FormEvent) => void` - Handler untuk submit form
- `placeholder?: string` - Placeholder text (default: "Cari...")
- `className?: string` - Custom className tambahan

**Usage:**
```tsx
import { SearchBar } from "@/components/guru";

<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  onSubmit={handleSearch}
  placeholder="Cari materi pembelajaran...."
  className="mb-8"
/>
```

---

### 2. **MateriCard**
Card untuk menampilkan informasi materi pembelajaran.

**Props:**
- `id: string` - ID materi
- `kelasId: string` - ID kelas
- `judul: string` - Judul materi
- `deskripsi: string` - Deskripsi materi
- `topik: string` - Topik materi
- `status: "published" | "draft"` - Status publikasi
- `jumlahSiswaSelesai: number` - Jumlah siswa yang selesai
- `totalSiswa: number` - Total siswa
- `onKelolaMaterial?: () => void` - Handler untuk button kelola materi
- `onKelolaKuis?: () => void` - Handler untuk button kelola kuis

**Usage:**
```tsx
import { MateriCard } from "@/components/guru";

<MateriCard
  id="1"
  kelasId="kelas-123"
  judul="Pecahan Dasar & Bilangan"
  deskripsi="Pengenalan konsep pecahan dan operasi dasar bilangan"
  topik="Bilangan"
  status="published"
  jumlahSiswaSelesai={25}
  totalSiswa={30}
/>
```

---

### 3. **EmptyState**
Component untuk menampilkan empty state dengan animasi.

**Props:**
- `type?: "search" | "empty"` - Tipe empty state (default: "empty")
- `searchQuery?: string` - Query pencarian (untuk type "search")
- `title?: string` - Judul custom
- `message?: string` - Message custom
- `actionLabel?: string` - Label untuk button action
- `onAction?: () => void` - Handler untuk button action

**Usage:**
```tsx
import { EmptyState } from "@/components/guru";

// Empty state untuk search
<EmptyState
  type="search"
  searchQuery={searchQuery}
  actionLabel="Hapus Pencarian"
  onAction={() => setSearchQuery("")}
/>

// Empty state biasa
<EmptyState
  type="empty"
  title="Belum Ada Materi"
  message="Mulai buat materi pembelajaran pertama untuk kelas ini"
/>
```

---

### 4. **PageHeader**
Header banner dengan gradient background dan action button.

**Props:**
- `title: string` - Judul halaman
- `actionLabel?: string` - Label untuk action button
- `actionHref?: string` - Link untuk action button
- `actionIcon?: React.ReactNode` - Icon untuk action button
- `onAction?: () => void` - Handler untuk action button
- `className?: string` - Custom className tambahan

**Usage:**
```tsx
import { PageHeader } from "@/components/guru";
import AddIcon from "@mui/icons-material/Add";

<PageHeader
  title="MATEMATIKA KELAS IV"
  actionLabel="Tambah Materi"
  actionHref="/guru/kelas/123/materi/tambah"
  actionIcon={<AddIcon className="text-white" />}
  className="mb-8"
/>
```

---

### 5. **KelasNavigationSidebar**
Sidebar navigasi untuk halaman kelas dengan toggle functionality.

**Props:**
- `kelasId: string` - ID kelas
- `isOpen: boolean` - Status sidebar (open/close)

**Usage:**
```tsx
import { KelasNavigationSidebar } from "@/components/guru";

<KelasNavigationSidebar kelasId="123" isOpen={isSidebarOpen} />
```

---

## 🎨 Design System

### Colors
- **Primary**: `#336D82` (Teal dark)
- **Secondary**: `#ECF3F6` (Light gray)
- **Accent**: `#5a96a8` (Teal medium)

### Typography
- **Font**: Poppins (via Google Fonts)
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Spacing
- Cards: `p-8`
- Gaps: `gap-4`, `gap-6`
- Margins: `mb-8`, `mb-6`

### Shadows
- Cards: `shadow-lg hover:shadow-xl`
- Buttons: `shadow-md`

---

## 🚀 Quick Import

Import multiple components at once:

```tsx
import {
  SearchBar,
  MateriCard,
  EmptyState,
  PageHeader,
  KelasNavigationSidebar
} from "@/components/guru";
```

---

## 📝 Notes

- Semua components menggunakan **Framer Motion** untuk animasi
- Icons dari **@mui/icons-material**
- Styling dengan **Tailwind CSS**
- TypeScript support penuh dengan proper typing
