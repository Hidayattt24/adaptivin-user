"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import {
  SearchBar,
  MateriCard,
  EmptyState,
  PageHeader,
  TableSkeleton,
  ErrorState,
} from "@/components/guru";
import { useMateriList } from "@/hooks/guru/useMateri";
import { useDebounce } from "@/hooks/guru/useDebounce";

const MateriListPage = () => {
  const params = useParams();
  const kelasId = params.kelasId as string;

  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 350);

  // Load materi data from API
  const {
    data: materiList,
    isLoading,
    error,
    refetch,
  } = useMateriList(kelasId);

  // Dummy data untuk kelas (should come from parent layout or API)
  const kelasData = {
    nama: "MATEMATIKA KELAS IV",
  };

  // Filter materi berdasarkan search query
  const filteredMateriList = useMemo(() => {
    const list = materiList || [];

    if (!debouncedSearch.trim()) {
      return list;
    }

    const query = debouncedSearch.toLowerCase();
    return list.filter(
      (materi) =>
        materi.judul_materi.toLowerCase().includes(query) ||
        (materi.deskripsi && materi.deskripsi.toLowerCase().includes(query))
    );
  }, [materiList, debouncedSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="pb-12 sm:pb-16 md:pb-20">
      {/* Header Banner */}
      <PageHeader
        title={kelasData.nama}
        actionLabel="Tambah Materi"
        actionHref={`/guru/kelas/${kelasId}/materi/tambah`}
        actionIcon={
          <AddIcon
            className="text-white"
            sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }}
          />
        }
        className="mb-6 sm:mb-7 md:mb-8"
      />

      {/* Search Bar Component */}
      <SearchBar
        value={searchQuery}
        onChange={(value) => setSearchQuery(value)}
        onSubmit={handleSearch}
        placeholder="Cari materi pembelajaran...."
        className="mb-6 sm:mb-7 md:mb-8"
      />

      {/* Search Results Info */}
      {searchQuery && !isLoading && (
        <div className="mb-3 sm:mb-4" role="status" aria-live="polite">
          <p className="text-[#336d82] text-sm sm:text-base poppins-medium">
            Menampilkan {filteredMateriList.length} hasil untuk &ldquo;
            {searchQuery}&rdquo;
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : error ? (
        <ErrorState
          title="Gagal Memuat Materi"
          message="Terjadi kesalahan saat memuat daftar materi. Silakan coba lagi."
          onRetry={() => refetch()}
        />
      ) : filteredMateriList.length === 0 ? (
        <EmptyState
          type={searchQuery ? "search" : "empty"}
          searchQuery={searchQuery}
          title={searchQuery ? "Tidak Ada Hasil" : "Belum Ada Materi"}
          message={
            searchQuery
              ? undefined
              : "Mulai buat materi pembelajaran pertama untuk kelas ini"
          }
          actionLabel={searchQuery ? "Hapus Pencarian" : undefined}
          onAction={searchQuery ? () => setSearchQuery("") : undefined}
        />
      ) : (
        <div
          className="space-y-4 sm:space-y-5 md:space-y-6"
          role="list"
          aria-label="Daftar materi"
        >
          {filteredMateriList.map((materi) => (
            <MateriCard
              key={materi.id}
              id={materi.id}
              kelasId={kelasId}
              judul_materi={materi.judul_materi}
              deskripsi={materi.deskripsi}
              jumlah_sub_materi={materi.jumlah_sub_materi}
              created_at={materi.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MateriListPage;
