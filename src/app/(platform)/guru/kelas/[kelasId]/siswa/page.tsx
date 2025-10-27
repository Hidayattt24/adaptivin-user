"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/guru/PageHeader";
import SearchBar from "@/components/guru/SearchBar";
import StudentCard from "@/components/guru/StudentCard";
import TotalMuridCard from "@/components/guru/TotalMuridCard";
import Pagination from "@/components/guru/Pagination";
import EmptyState from "@/components/guru/EmptyState";

const SiswaListPage = () => {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.kelasId;

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const [allSiswaList] = useState([
    {
      id: "1",
      nama: "FARHAN",
      nis: "2208107010063",
      tanggalLahir: "24 Desember 2004",
      tempatLahir: "pango deah",
      jenisKelamin: "Laki-laki" as const,
    },
    {
      id: "2",
      nama: "SITI NURHALIZA",
      nis: "2208107010064",
      tanggalLahir: "15 Januari 2004",
      tempatLahir: "Jakarta",
      jenisKelamin: "Perempuan" as const,
    },
    {
      id: "3",
      nama: "AHMAD FAUZI",
      nis: "2208107010065",
      tanggalLahir: "10 Maret 2004",
      tempatLahir: "Bandung",
      jenisKelamin: "Laki-laki" as const,
    },
    {
      id: "4",
      nama: "DEWI KUSUMA",
      nis: "2208107010066",
      tanggalLahir: "22 Mei 2004",
      tempatLahir: "Surabaya",
      jenisKelamin: "Perempuan" as const,
    },
    {
      id: "5",
      nama: "BUDI SANTOSO",
      nis: "2208107010067",
      tanggalLahir: "8 Juli 2004",
      tempatLahir: "Medan",
      jenisKelamin: "Laki-laki" as const,
    },
  ]);

  // Filter siswa berdasarkan search query
  const filteredSiswaList = useMemo(() => {
    if (!searchQuery.trim()) {
      return allSiswaList;
    }

    const query = searchQuery.toLowerCase();
    return allSiswaList.filter(
      (siswa) =>
        siswa.nama.toLowerCase().includes(query) ||
        siswa.nis.toLowerCase().includes(query) ||
        siswa.tempatLahir.toLowerCase().includes(query)
    );
  }, [searchQuery, allSiswaList]);

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
    <div className="pb-12">
      {/* Header Banner */}
      <PageHeader title="Kelola Murid" className="mb-8" />

      {/* Top Section - Search and Total */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left: Informasi Murid Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-[#336d82] text-4xl poppins-semibold">
            INFORMASI MURID
          </h2>
          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            placeholder="Ketik lalu mulai cari murid.."
          />
        </div>

        {/* Right: Total Murid Card */}
        <div className="lg:col-span-1">
          <TotalMuridCard total={allSiswaList.length} />
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-4">
          <p className="text-[#336d82] poppins-medium">
            Menampilkan {filteredSiswaList.length} hasil untuk &ldquo;{searchQuery}&rdquo;
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
          <div className="space-y-6 mb-8">
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
              className="mt-8"
            />
          )}
        </>
      )}
    </div>
  );
};

export default SiswaListPage;
