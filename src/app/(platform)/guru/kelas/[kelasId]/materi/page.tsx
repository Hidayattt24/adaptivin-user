"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import SearchBar from "@/components/guru/SearchBar";
import MateriCard from "@/components/guru/MateriCard";
import EmptyState from "@/components/guru/EmptyState";
import PageHeader from "@/components/guru/PageHeader";
import { useMateriList } from "@/hooks/guru/useMateri";
import { useDebounce } from "@/hooks/guru/useDebounce";
import { TableSkeleton } from "@/components/guru/skeletons";
import { ErrorState } from "@/components/guru/ErrorState";

const MateriListPage = () => {
  const params = useParams();
  const kelasId = params.kelasId as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 350);

  // Lazy load materi data
  const { data, isLoading, error, refetch } = useMateriList(kelasId, currentPage);

  // Dummy data untuk kelas (should come from parent layout or API)
  const kelasData = {
    nama: "MATEMATIKA KELAS IV",
  };

  // Filter materi berdasarkan search query
  const filteredMateriList = useMemo(() => {
    const materiList = data?.items || [];

    if (!debouncedSearch.trim()) {
      return materiList;
    }

    const query = debouncedSearch.toLowerCase();
    return materiList.filter(
      (materi) =>
        materi.judul.toLowerCase().includes(query) ||
        materi.topik.toLowerCase().includes(query) ||
        materi.deskripsi.toLowerCase().includes(query)
    );
  }, [data, debouncedSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className="pb-12">
      {/* Header Banner */}
      <PageHeader
        title={kelasData.nama}
        actionLabel="Tambah Materi"
        actionHref={`/guru/kelas/${kelasId}/materi/tambah`}
        actionIcon={<AddIcon className="text-white" sx={{ fontSize: 20 }} />}
        className="mb-8"
      />

      {/* Search Bar Component */}
      <SearchBar
        value={searchQuery}
        onChange={(value) => {
          setSearchQuery(value);
          setCurrentPage(1);
        }}
        onSubmit={handleSearch}
        placeholder="Cari materi pembelajaran...."
        className="mb-8"
      />

      {/* Search Results Info */}
      {searchQuery && !isLoading && (
        <div className="mb-4" role="status" aria-live="polite">
          <p className="text-[#336d82] poppins-medium">
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
        <div className="space-y-6" role="list" aria-label="Daftar materi">
          {filteredMateriList.map((materi) => (
            <MateriCard
              key={materi.id}
              id={materi.id}
              kelasId={kelasId}
              judul={materi.judul}
              deskripsi={materi.deskripsi}
              topik={materi.topik}
              status={materi.status}
              jumlahSiswaSelesai={materi.jumlahSiswaSelesai}
              totalSiswa={materi.totalSiswa}
            />
          ))}
        </div>
      )}

      {/* Pagination - if API returns pagination data */}
      {data?.totalPages && data.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8" role="navigation" aria-label="Pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Halaman sebelumnya"
          >
            Sebelumnya
          </button>

          <span className="px-4 py-2 font-medium" aria-live="polite">
            Halaman {currentPage} dari {data.totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(data.totalPages, prev + 1))}
            disabled={currentPage === data.totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Halaman selanjutnya"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
};

export default MateriListPage;
