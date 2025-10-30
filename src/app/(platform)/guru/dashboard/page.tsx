"use client";

import React, { useState, useMemo } from "react";
import { ClassCard, TeacherProfile, GridSkeleton, ErrorState } from "@/components/guru";
import { getCardColor } from "@/constants/guru/cardColors";
import { Highlighter } from "@/components/ui/highlighter";
import { useClasses } from "@/hooks/guru/useClasses";
import { useDebounce } from "@/hooks/guru/useDebounce";
import { Search, ChevronLeft, ChevronRight } from "@mui/icons-material";

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
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-[135px] pt-8 sm:pt-12 md:pt-16 lg:pt-24 relative z-10">
        <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 gap-6 md:gap-8">
          {/* Profile Image - Mobile/Tablet: Top Center, Desktop: Right */}
          <div className="order-first md:order-last flex-shrink-0">
            <TeacherProfile
              profileImage="/guru/foto-profil/profil-guru.svg"
              teacherName="Isabella"
            />
          </div>

          {/* Greeting Text - Mobile/Tablet: Below Profile, Desktop: Left */}
          <div className="flex-1 text-center md:text-left w-full md:w-auto">
            <h1
              className="montserrat-medium text-white mb-2 sm:mb-3 md:mb-4"
              style={{
                fontSize: "clamp(28px, 6vw, 50px)",
                lineHeight: "1.3",
              }}
            >
              Hi Isabella,
            </h1>
            <p
              className="montserrat-regular text-white/95 mb-4 sm:mb-6 md:mb-8"
              style={{
                fontSize: "clamp(16px, 3vw, 24px)",
                lineHeight: "1.5",
              }}
            >
              Semoga Sehat Selalu
            </p>
            <h2
              className="montserrat-bold text-white tracking-wide"
              style={{
                fontSize: "clamp(24px, 5vw, 48px)",
                lineHeight: "1.2",
                letterSpacing: "0.05em",
              }}
            >
              <Highlighter action="underline" color="#00d9ff" isView>
                RUANG KERJA
              </Highlighter>
            </h2>
          </div>
        </div>

        {/* Modern Search Bar - Responsive */}
        <div className="mb-8 sm:mb-10 md:mb-12 flex justify-center">
          <div className="relative w-full max-w-3xl">
            <div className="flex gap-2 sm:gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Search sx={{ fontSize: { xs: 20, sm: 24 }, color: "#336d82" }} />
                </div>
                <input
                  type="text"
                  placeholder="Cari kelas berdasarkan nama..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      // Trigger search on Enter
                      e.currentTarget.blur();
                    }
                  }}
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-sm sm:text-base rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-300 text-gray-800 placeholder-gray-500 font-poppins"
                  aria-label="Cari kelas"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Hapus pencarian"
                  >
                    <span className="text-xl sm:text-2xl">×</span>
                  </button>
                )}
              </div>
              {/* Search Button - Icon only on mobile, with text on desktop */}
              <button
                onClick={() => {
                  // Search button - currently search is automatic via onChange
                  // This button provides visual feedback
                  document.querySelector<HTMLInputElement>('input[aria-label="Cari kelas"]')?.blur();
                }}
                className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 font-poppins font-semibold text-[#336d82] flex items-center gap-2"
                aria-label="Cari"
              >
                <Search sx={{ fontSize: { xs: 20, sm: 22 } }} />
                <span className="hidden sm:inline">Cari</span>
              </button>
            </div>
            {searchQuery && (
              <p className="mt-2 sm:mt-3 text-white/90 text-xs sm:text-sm font-poppins text-center">
                Menampilkan {filteredClasses.length} hasil untuk "{searchQuery}"
              </p>
            )}
          </div>
        </div>

        {/* Class Cards - With Lazy Loading */}
        {isLoading ? (
          <div className="pb-12 sm:pb-16 md:pb-20 lg:pb-24">
            <GridSkeleton count={9} />
          </div>
        ) : error ? (
          <div className="pb-12 sm:pb-16 md:pb-20 lg:pb-24">
            <ErrorState
              title="Gagal Memuat Kelas"
              message="Terjadi kesalahan saat memuat daftar kelas. Silakan coba lagi."
              onRetry={() => refetch()}
            />
          </div>
        ) : paginatedClasses.length === 0 ? (
          <div className="pb-12 sm:pb-16 md:pb-20 lg:pb-24 flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-white/50 p-8 sm:p-12 md:p-16 text-center max-w-2xl animate-bounce-slow">
              <div className="mb-4 sm:mb-6">
                <svg
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto text-[#336d82] animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#336d82] mb-2 sm:mb-3 font-poppins">
                {searchQuery ? "Tidak Ditemukan" : "Belum Ada Kelas"}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg font-poppins">
                {searchQuery
                  ? `Tidak ada kelas yang sesuai dengan pencarian "${searchQuery}"`
                  : "Belum ada kelas yang tersedia saat ini"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-[#336d82] text-white rounded-lg sm:rounded-xl hover:bg-[#2a5a6d] transition-colors font-poppins font-semibold shadow-lg hover:shadow-xl"
                >
                  Hapus Pencarian
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 pb-6 sm:pb-8"
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

            {/* Modern Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-3 sm:gap-4 pb-12 sm:pb-16 md:pb-20 lg:pb-24" role="navigation" aria-label="Pagination">
                {/* Page Info */}
                <div className="bg-white/20 backdrop-blur-sm px-4 sm:px-6 py-1.5 sm:py-2 rounded-full">
                  <span className="text-white font-semibold font-poppins text-xs sm:text-sm" aria-live="polite">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="group flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-all duration-300 font-poppins font-semibold text-[#336d82] text-xs sm:text-sm md:text-base"
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft
                      sx={{ fontSize: { xs: 18, sm: 20 } }}
                      className="transition-transform group-hover:-translate-x-1"
                    />
                    <span className="hidden xs:inline">Sebelumnya</span>
                    <span className="xs:hidden">Prev</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="hidden sm:flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-semibold font-poppins transition-all duration-300 text-sm sm:text-base ${currentPage === pageNum
                            ? "bg-white text-[#336d82] shadow-lg scale-110"
                            : "bg-white/20 text-white hover:bg-white/30"
                            }`}
                          aria-label={`Halaman ${pageNum}`}
                          aria-current={currentPage === pageNum ? "page" : undefined}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="group flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-all duration-300 font-poppins font-semibold text-[#336d82] text-xs sm:text-sm md:text-base"
                    aria-label="Halaman selanjutnya"
                  >
                    <span className="hidden xs:inline">Selanjutnya</span>
                    <span className="xs:hidden">Next</span>
                    <ChevronRight
                      sx={{ fontSize: { xs: 18, sm: 20 } }}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardGuruPage;

// Add custom animation styles
const styles = `
  @keyframes bounce-slow {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
