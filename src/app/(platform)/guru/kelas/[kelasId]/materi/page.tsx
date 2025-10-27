"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import SearchBar from "@/components/guru/SearchBar";
import MateriCard from "@/components/guru/MateriCard";
import EmptyState from "@/components/guru/EmptyState";
import PageHeader from "@/components/guru/PageHeader";

const MateriListPage = () => {
  const params = useParams();
  const kelasId = params.kelasId;

  // Dummy data untuk kelas
  const kelasData = {
    nama: "MATEMATIKA KELAS IV",
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [allMateriList] = useState([
    {
      id: "1",
      judul: "Pecahan Dasar & Bilangan",
      topik: "Bilangan",
      status: "published" as const,
      deskripsi: "Pengenalan konsep pecahan dan operasi dasar bilangan",
      jumlahSiswaSelesai: 25,
      totalSiswa: 30,
      createdAt: "2024-10-20",
    },
    {
      id: "2",
      judul: "Perkalian & Pembagian",
      topik: "Operasi Hitung",
      status: "published" as const,
      deskripsi: "Mempelajari operasi perkalian dan pembagian bilangan cacah",
      jumlahSiswaSelesai: 28,
      totalSiswa: 30,
      createdAt: "2024-10-22",
    },
    {
      id: "3",
      judul: "Geometri Bangun Datar",
      topik: "Geometri",
      status: "published" as const,
      deskripsi: "Mengenal berbagai bangun datar dan sifat-sifatnya",
      jumlahSiswaSelesai: 20,
      totalSiswa: 30,
      createdAt: "2024-10-25",
    },
    {
      id: "4",
      judul: "Pengukuran Waktu",
      topik: "Pengukuran",
      status: "draft" as const,
      deskripsi: "Memahami konsep waktu dan cara mengukurnya",
      jumlahSiswaSelesai: 0,
      totalSiswa: 30,
      createdAt: "2024-10-26",
    },
    {
      id: "5",
      judul: "Statistika Sederhana",
      topik: "Statistika",
      status: "published" as const,
      deskripsi: "Pengenalan diagram batang dan pengolahan data sederhana",
      jumlahSiswaSelesai: 15,
      totalSiswa: 30,
      createdAt: "2024-10-27",
    },
  ]);

  // Filter materi berdasarkan search query
  const filteredMateriList = useMemo(() => {
    if (!searchQuery.trim()) {
      return allMateriList;
    }

    const query = searchQuery.toLowerCase();
    return allMateriList.filter(
      (materi) =>
        materi.judul.toLowerCase().includes(query) ||
        materi.topik.toLowerCase().includes(query) ||
        materi.deskripsi.toLowerCase().includes(query)
    );
  }, [searchQuery, allMateriList]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search sudah dilakukan secara realtime lewat useMemo
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
        onChange={setSearchQuery}
        onSubmit={handleSearch}
        placeholder="Cari materi pembelajaran...."
        className="mb-8"
      />

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-4">
          <p className="text-[#336d82] poppins-medium">
            Menampilkan {filteredMateriList.length} hasil untuk "{searchQuery}"
          </p>
        </div>
      )}

      {/* Materi List */}
      {filteredMateriList.length === 0 ? (
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
        <div className="space-y-6">
          {filteredMateriList.map((materi) => (
            <MateriCard
              key={materi.id}
              id={materi.id}
              kelasId={kelasId as string}
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
    </div>
  );
};

export default MateriListPage;
