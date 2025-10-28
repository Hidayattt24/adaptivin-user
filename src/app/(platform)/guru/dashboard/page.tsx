"use client";

import React, { useState, useMemo } from "react";
import ClassCard from "@/components/guru/ClassCard";
import TeacherProfile from "@/components/guru/TeacherProfile";
import { getCardColor } from "@/constants/guru/cardColors";
import { Kelas } from "@/types/guru";
import { Highlighter } from "@/components/ui/highlighter";
import { useClasses } from "@/hooks/guru/useClasses";
import { GridSkeleton } from "@/components/guru/skeletons";
import { ErrorState } from "@/components/guru/ErrorState";
import { useDebounce } from "@/hooks/guru/useDebounce";

const DashboardGuruPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid

  // Lazy load classes data
  const { data: classesData, isLoading, error, refetch } = useClasses();

  // Debounce search to avoid excessive filtering
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter classes based on search
  const filteredClasses = useMemo(() => {
    if (!classesData) return [];

    const allClasses = classesData || [];

    if (!debouncedSearch) return allClasses;

    return allClasses.filter((kelas) =>
      kelas.nama.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [classesData, debouncedSearch]);

  // Pagination
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClasses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClasses, currentPage, itemsPerPage]);

  // Student profile images (first 3)
  const studentProfiles = [
    "/siswa/foto-profil/kocheng-oren.svg",
    "/siswa/foto-profil/bro-kerbuz.svg",
    "/siswa/foto-profil/sin-bunbun.svg",
  ];

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, #336D82 0%, #FFFFFF 100%)",
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #FFFFFF 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-40 left-20 w-96 h-96 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, #FFFFFF 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Header Section */}
      <div className="container mx-auto px-6 md:px-12 lg:px-[135px] pt-16 md:pt-24 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 md:mb-20 gap-6">
          {/* Greeting Text */}
          <div className="flex-1">
            <h1
              className="montserrat-medium text-white mb-4 animate-fade-in"
              style={{
                fontSize: "clamp(32px, 5vw, 50px)",
                lineHeight: "1.3",
              }}
            >
              Hi Isabella,
            </h1>
            <p
              className="montserrat-regular text-white/95 mb-8"
              style={{
                fontSize: "clamp(18px, 2.5vw, 24px)",
                lineHeight: "1.5",
              }}
            >
              Semoga Sehat Selalu
            </p>
            <h2
              className="montserrat-bold text-white tracking-wide"
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                lineHeight: "1.2",
                letterSpacing: "0.05em",
              }}
            >
              <Highlighter action="underline" color="#00d9ff" isView>
                RUANG KERJA
              </Highlighter>
            </h2>
          </div>

          {/* Profile Image */}
          <TeacherProfile
            profileImage="/guru/foto-profil/profil-guru.svg"
            teacherName="Isabella"
          />
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Cari kelas..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full md:w-96 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#336d82] focus:border-transparent"
            aria-label="Cari kelas"
          />
        </div>

        {/* Class Cards - With Lazy Loading */}
        {isLoading ? (
          <div className="pb-24">
            <GridSkeleton count={9} />
          </div>
        ) : error ? (
          <div className="pb-24">
            <ErrorState
              title="Gagal Memuat Kelas"
              message="Terjadi kesalahan saat memuat daftar kelas. Silakan coba lagi."
              onRetry={() => refetch()}
            />
          </div>
        ) : paginatedClasses.length === 0 ? (
          <div className="pb-24">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600">
                {searchQuery
                  ? "Tidak ada kelas yang sesuai dengan pencarian."
                  : "Belum ada kelas."}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8"
              role="list"
              aria-label="Daftar kelas"
            >
              {paginatedClasses.map((kelas, cardIndex) => (
                <ClassCard
                  key={kelas.id}
                  id={kelas.id}
                  nama={kelas.nama}
                  jumlahSiswa={kelas.jumlahSiswa}
                  color={getCardColor(cardIndex)}
                  studentProfiles={studentProfiles}
                  index={cardIndex}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pb-24" role="navigation" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  aria-label="Halaman sebelumnya"
                >
                  Sebelumnya
                </button>

                <span className="px-4 py-2 text-white font-medium" aria-live="polite">
                  Halaman {currentPage} dari {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  aria-label="Halaman selanjutnya"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardGuruPage;
