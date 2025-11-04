"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PageHeader,
  SearchBar,
  StudentCard,
  TotalMuridCard,
  Pagination,
  EmptyState,
  CardSkeleton,
  ErrorState,
} from "@/components/guru";
import { useSiswaList } from "@/hooks/guru/useSiswa";
import { useDebounce } from "@/hooks/guru/useDebounce";

const SiswaListPage = () => {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.kelasId as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Debounce search to avoid excessive filtering
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Load siswa data with React Query
  const { data: siswaData, isLoading, error, refetch } = useSiswaList(kelasId);

  // Get siswa list from API
  const allSiswaList = siswaData?.items || [];

  // Filter siswa berdasarkan debounced search query
  const filteredSiswaList = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return allSiswaList;
    }

    const query = debouncedSearch.toLowerCase();
    return allSiswaList.filter(
      (siswa) =>
        siswa.nama?.toLowerCase().includes(query) ||
        siswa.nis?.toLowerCase().includes(query) ||
        siswa.tempatLahir?.toLowerCase().includes(query)
    );
  }, [debouncedSearch, allSiswaList]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSiswaList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSiswaList = filteredSiswaList.slice(startIndex, endIndex);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleEdit = (siswaId: string) => {
    router.push(`/guru/kelas/${kelasId}/siswa/${siswaId}/edit`);
  };

  const handleDelete = (siswaId: string) => {
    // Implement delete logic
    console.log("Delete student:", siswaId);
  };

  return (
    <div className="pb-20 sm:pb-20 md:pb-8">
      {/* Header Banner */}
      <PageHeader title="Kelola Murid" className="mb-6 sm:mb-7 md:mb-8" />

      {/* Loading State */}
      {isLoading ? (
        <>
          {/* Top Section Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-7 md:mb-8">
            <div className="md:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
              <div className="h-8 sm:h-9 md:h-10 bg-gray-200 rounded w-full sm:w-80 animate-pulse"></div>
              <div className="h-10 sm:h-11 md:h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="md:col-span-1">
              <CardSkeleton />
            </div>
          </div>

          {/* Student List Skeleton */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-6 sm:mb-7 md:mb-8">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </>
      ) : error ? (
        /* Error State */
        <ErrorState
          title="Gagal Memuat Data Siswa"
          message="Terjadi kesalahan saat memuat daftar siswa. Silakan coba lagi."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          {/* Top Section - Search and Total */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-4 lg:gap-6 mb-6 sm:mb-6 lg:mb-8">
            {/* Left: Informasi Murid Section */}
            <div className="md:col-span-2 space-y-4 sm:space-y-4 lg:space-y-6">
              <h2 className="text-[#336d82] text-2xl sm:text-2xl lg:text-4xl poppins-semibold">
                INFORMASI MURID
              </h2>
              {/* Search Bar */}
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={handleSearch}
                placeholder="Ketik lalu mulai cari murid.."
                aria-label="Cari siswa berdasarkan nama, NIS, atau tempat lahir"
              />
            </div>

            {/* Right: Total Murid Card */}
            <div className="lg:col-span-1">
              <TotalMuridCard jumlahSiswa={siswaData?.total || 0} />
            </div>
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="mb-3 sm:mb-4">
              <p className="text-[#336d82] text-sm sm:text-base poppins-medium">
                Menampilkan {filteredSiswaList.length} hasil untuk &ldquo;
                {searchQuery}&rdquo;
              </p>
            </div>
          )}

          {/* Student List */}
          {filteredSiswaList.length === 0 ? (
            <EmptyState
              type={searchQuery ? "search" : "empty"}
              searchQuery={searchQuery}
              title={searchQuery ? "Tidak Ada Hasil" : "Belum Ada Siswa"}
              message={
                searchQuery
                  ? undefined
                  : "Mulai tambahkan siswa pertama untuk kelas ini"
              }
              actionLabel={searchQuery ? "Hapus Pencarian" : undefined}
              onAction={searchQuery ? () => setSearchQuery("") : undefined}
            />
          ) : (
            <>
              <div
                className="space-y-4 sm:space-y-5 md:space-y-6 mb-6 sm:mb-7 md:mb-8"
                role="list"
                aria-label="Daftar siswa"
              >
                {currentSiswaList.map((siswa) => (
                  <StudentCard
                    key={siswa.id}
                    id={siswa.id}
                    nama={siswa.nama}
                    nis={siswa.nis}
                    tanggalLahir={siswa.tanggalLahir}
                    tempatLahir={siswa.tempatLahir}
                    jenisKelamin={siswa.jenisKelamin}
                    onEdit={() => handleEdit(siswa.id)}
                    onDelete={() => handleDelete(siswa.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="mt-6 sm:mt-7 md:mt-8"
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SiswaListPage;
