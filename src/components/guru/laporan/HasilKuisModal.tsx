"use client";

import React, { useMemo, useState } from "react";
import { Close, CheckCircle, Cancel, Timer, ExpandMore, ExpandLess } from "@mui/icons-material";

interface QuizResult {
  soalId: string;
  pertanyaan: string;
  tipesoal: string;
  jawabanSiswa: string;
  jawabanBenar: string;
  isCorrect: boolean;
  waktuJawab: number; // dalam detik
}

interface HasilKuisModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  materiTitle: string;
  results: QuizResult[];
}

const HasilKuisModal: React.FC<HasilKuisModalProps> = ({
  isOpen,
  onClose,
  studentName,
  materiTitle,
  results,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalBenar = results.filter((r) => r.isCorrect).length;
    const totalSalah = results.length - totalBenar;
    const totalWaktu = results.reduce((sum, r) => sum + r.waktuJawab, 0);
    const rataRataWaktu = Math.round(totalWaktu / (results.length || 1));
    const skor = Math.round((totalBenar / (results.length || 1)) * 100);

    // Calculate by taxonomy level
    const byLevel: Record<string, { benar: number; salah: number; total: number }> = {};

    results.forEach((r) => {
      const level = r.tipesoal.split(" ")[0]; // Extract C1, C2, etc.
      if (!byLevel[level]) {
        byLevel[level] = { benar: 0, salah: 0, total: 0 };
      }
      byLevel[level].total++;
      if (r.isCorrect) {
        byLevel[level].benar++;
      } else {
        byLevel[level].salah++;
      }
    });

    return {
      totalBenar,
      totalSalah,
      totalWaktu,
      rataRataWaktu,
      skor,
      byLevel,
    };
  }, [results]);

  // Format waktu
  const formatWaktu = (detik: number) => {
    const menit = Math.floor(detik / 60);
    const sisaDetik = detik % 60;
    if (menit > 0) {
      return `${menit}m ${sisaDetik}s`;
    }
    return `${sisaDetik}s`;
  };

  // Get score status
  const getScoreStatus = (score: number) => {
    if (score >= 80) {
      return {
        color: "from-emerald-500 to-emerald-600",
        label: "Luar Biasa!",
        textColor: "text-emerald-600",
      };
    }
    if (score >= 60) {
      return {
        color: "from-yellow-500 to-yellow-600",
        label: "Cukup Baik",
        textColor: "text-yellow-600",
      };
    }
    return {
      color: "from-rose-500 to-rose-600",
      label: "Perlu Perbaikan",
      textColor: "text-rose-600",
    };
  };

  const scoreStatus = getScoreStatus(stats.skor);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-slideUp">
        {/* Sticky Header with Score */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#2ea062] to-[#3bc97a] rounded-t-3xl shadow-lg">
          {/* Top Bar */}
          <div className="p-4 sm:p-6 flex items-center justify-between border-b border-white/20">
            <div>
              <h2 className="text-white text-xl sm:text-2xl poppins-bold">Hasil Kuis</h2>
              <p className="text-white/90 text-xs sm:text-sm poppins-medium">{studentName} • {materiTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors flex-shrink-0"
              aria-label="Tutup"
            >
              <Close sx={{ fontSize: 28 }} />
            </button>
          </div>

          {/* Score Display - Compact in Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center gap-4 sm:gap-6">
            {/* Score */}
            <div className="text-center">
              <p className="text-white/80 text-[10px] sm:text-xs poppins-medium mb-0.5">Nilai Akhir</p>
              <p className="text-white text-4xl sm:text-5xl poppins-bold leading-none">{stats.skor}</p>
            </div>

            {/* Divider */}
            <div className="w-px h-12 sm:h-14 bg-white/30"></div>

            {/* Status Badge */}
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <p className="text-white text-xs sm:text-sm poppins-semibold">{scoreStatus.label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8">

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {/* Correct */}
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle sx={{ fontSize: { xs: 16, sm: 18 }, color: "#10b981" }} />
                  <p className="text-gray-600 text-[10px] sm:text-xs poppins-medium">Benar</p>
                </div>
                <p className="text-emerald-700 text-3xl sm:text-4xl poppins-bold">{stats.totalBenar}</p>
                <p className="text-emerald-600 text-[10px] sm:text-xs poppins-medium mt-1">soal</p>
              </div>

              {/* Incorrect */}
              <div className="bg-rose-50 border-2 border-rose-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Cancel sx={{ fontSize: { xs: 16, sm: 18 }, color: "#f43f5e" }} />
                  <p className="text-gray-600 text-[10px] sm:text-xs poppins-medium">Salah</p>
                </div>
                <p className="text-rose-700 text-3xl sm:text-4xl poppins-bold">{stats.totalSalah}</p>
                <p className="text-rose-600 text-[10px] sm:text-xs poppins-medium mt-1">soal</p>
              </div>

              {/* Time */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Timer sx={{ fontSize: { xs: 16, sm: 18 }, color: "#3b82f6" }} />
                  <p className="text-gray-600 text-[10px] sm:text-xs poppins-medium">Rata-rata</p>
                </div>
                <p className="text-blue-700 text-2xl sm:text-3xl poppins-bold">{formatWaktu(stats.rataRataWaktu)}</p>
                <p className="text-blue-600 text-[10px] sm:text-xs poppins-medium mt-1">per soal</p>
              </div>
            </div>

            {/* Performance by Level - Compact */}
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-gray-200 mb-4 sm:mb-6">
              <h3 className="text-[#336d82] text-base sm:text-lg poppins-bold mb-3 sm:mb-4">
                Performa per Tingkat
              </h3>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
                {["Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6"].map((level) => {
                  const levelData = stats.byLevel[level] || { benar: 0, salah: 0, total: 0 };
                  const accuracy = levelData.total > 0
                    ? Math.round((levelData.benar / levelData.total) * 100)
                    : 0;

                  const levelColors =
                    accuracy >= 80
                      ? "from-emerald-400 to-emerald-500 border-emerald-300"
                      : accuracy >= 60
                        ? "from-yellow-400 to-yellow-500 border-yellow-300"
                        : levelData.total === 0
                          ? "from-gray-300 to-gray-400 border-gray-300"
                          : "from-rose-400 to-rose-500 border-rose-300";

                  return (
                    <div
                      key={level}
                      className={`bg-gradient-to-br ${levelColors} rounded-lg sm:rounded-xl p-2 sm:p-3 border-2 text-center`}
                    >
                      <p className="text-white text-xs sm:text-sm poppins-bold mb-0.5 sm:mb-1">{level}</p>
                      {levelData.total > 0 ? (
                        <>
                          <p className="text-white text-xl sm:text-2xl poppins-bold">{accuracy}%</p>
                          <p className="text-white/90 text-[10px] sm:text-xs poppins-medium">
                            {levelData.benar}/{levelData.total}
                          </p>
                        </>
                      ) : (
                        <p className="text-white/90 text-xs poppins-medium">-</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Toggle Details Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full bg-gradient-to-r from-[#2ea062] to-[#3bc97a] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl poppins-semibold hover:from-[#27875a] hover:to-[#33a969] active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-between group mb-4 sm:mb-6"
            >
              <span className="text-sm sm:text-base">
                {showDetails ? "Sembunyikan" : "Lihat"} Detail Semua Soal
              </span>
              {showDetails ? (
                <ExpandLess sx={{ fontSize: { xs: 24, sm: 28 } }} className="group-hover:scale-110 transition-transform" />
              ) : (
                <ExpandMore sx={{ fontSize: { xs: 24, sm: 28 } }} className="group-hover:scale-110 transition-transform" />
              )}
            </button>

            {/* Quiz Details - Expandable */}
            {showDetails && (
              <div className="space-y-3 sm:space-y-4 animate-slideDown">
                <h4 className="text-[#336d82] text-base sm:text-lg poppins-bold mb-3 sm:mb-4">
                  Detail Jawaban ({results.length} Soal)
                </h4>

                {results.map((result, index) => (
                  <div
                    key={result.soalId}
                    className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 transition-all ${result.isCorrect
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-rose-50 border-rose-200"
                      }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-start gap-2 sm:gap-3 flex-1">
                        <div className={`rounded-full p-1.5 sm:p-2 flex-shrink-0 ${result.isCorrect ? "bg-emerald-200" : "bg-rose-200"
                          }`}>
                          {result.isCorrect ? (
                            <CheckCircle sx={{ fontSize: { xs: 18, sm: 20 }, color: "#10b981" }} />
                          ) : (
                            <Cancel sx={{ fontSize: { xs: 18, sm: 20 }, color: "#f43f5e" }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                            <span className="text-gray-700 text-xs sm:text-sm poppins-bold">
                              Soal #{index + 1}
                            </span>
                            <span className="bg-white px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs poppins-semibold text-gray-600 border border-gray-300">
                              {result.tipesoal}
                            </span>
                            <div className="bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg border border-gray-300 flex items-center gap-0.5 sm:gap-1">
                              <Timer sx={{ fontSize: { xs: 12, sm: 14 }, color: "#6b7280" }} />
                              <span className="text-gray-700 text-[10px] sm:text-xs poppins-bold">
                                {formatWaktu(result.waktuJawab)}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-800 text-xs sm:text-sm poppins-regular leading-relaxed">
                            {result.pertanyaan}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Answers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 pl-0 md:pl-11">
                      {/* Student Answer */}
                      <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 border-2 border-gray-300">
                        <p className="text-gray-500 text-[10px] sm:text-xs poppins-semibold mb-1 uppercase">
                          Jawaban Siswa:
                        </p>
                        <p className={`text-xs sm:text-sm poppins-bold ${result.isCorrect ? "text-emerald-700" : "text-rose-700"
                          }`}>
                          {result.jawabanSiswa}
                        </p>
                      </div>

                      {/* Correct Answer */}
                      <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 border-2 border-emerald-300">
                        <p className="text-gray-500 text-[10px] sm:text-xs poppins-semibold mb-1 uppercase">
                          Jawaban Benar:
                        </p>
                        <p className="text-emerald-700 text-xs sm:text-sm poppins-bold">
                          {result.jawabanBenar}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 rounded-b-3xl border-t-2 border-gray-100 flex justify-end z-10">
          <button
            onClick={onClose}
            className="bg-[#2ea062] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base poppins-semibold hover:bg-[#27875a] transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default HasilKuisModal;
