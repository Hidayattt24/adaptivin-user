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
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#2ea062] to-[#3bc97a] p-6 rounded-t-3xl flex items-center justify-between z-10 shadow-md">
          <div>
            <h2 className="text-white text-2xl poppins-bold">Hasil Kuis</h2>
            <p className="text-white/90 text-sm poppins-medium">{studentName} • {materiTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Tutup"
          >
            <Close sx={{ fontSize: 28 }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Score Card - Prominent */}
          <div className={`bg-gradient-to-br ${scoreStatus.color} rounded-2xl p-8 text-center mb-6 relative overflow-hidden shadow-lg`}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

            <div className="relative z-10">
              <p className="text-white/90 text-sm poppins-medium mb-1">Nilai Akhir</p>
              <p className="text-white text-7xl poppins-bold mb-2">{stats.skor}</p>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full">
                <p className="text-white text-base poppins-semibold">{scoreStatus.label}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Correct */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle sx={{ fontSize: 18, color: "#10b981" }} />
                <p className="text-gray-600 text-xs poppins-medium">Benar</p>
              </div>
              <p className="text-emerald-700 text-4xl poppins-bold">{stats.totalBenar}</p>
              <p className="text-emerald-600 text-xs poppins-medium mt-1">soal</p>
            </div>

            {/* Incorrect */}
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Cancel sx={{ fontSize: 18, color: "#f43f5e" }} />
                <p className="text-gray-600 text-xs poppins-medium">Salah</p>
              </div>
              <p className="text-rose-700 text-4xl poppins-bold">{stats.totalSalah}</p>
              <p className="text-rose-600 text-xs poppins-medium mt-1">soal</p>
            </div>

            {/* Time */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Timer sx={{ fontSize: 18, color: "#3b82f6" }} />
                <p className="text-gray-600 text-xs poppins-medium">Rata-rata</p>
              </div>
              <p className="text-blue-700 text-3xl poppins-bold">{formatWaktu(stats.rataRataWaktu)}</p>
              <p className="text-blue-600 text-xs poppins-medium mt-1">per soal</p>
            </div>
          </div>

          {/* Performance by Level - Compact */}
          <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200 mb-6">
            <h3 className="text-[#336d82] text-lg poppins-bold mb-4">
              Performa per Tingkat
            </h3>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {["C1", "C2", "C3", "C4", "C5", "C6"].map((level) => {
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
                    className={`bg-gradient-to-br ${levelColors} rounded-xl p-3 border-2 text-center`}
                  >
                    <p className="text-white text-sm poppins-bold mb-1">{level}</p>
                    {levelData.total > 0 ? (
                      <>
                        <p className="text-white text-2xl poppins-bold">{accuracy}%</p>
                        <p className="text-white/90 text-xs poppins-medium">
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
            className="w-full bg-gradient-to-r from-[#2ea062] to-[#3bc97a] text-white px-6 py-4 rounded-2xl poppins-semibold hover:from-[#27875a] hover:to-[#33a969] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-between group mb-6"
          >
            <span className="text-base">
              {showDetails ? "Sembunyikan" : "Lihat"} Detail Semua Soal
            </span>
            {showDetails ? (
              <ExpandLess sx={{ fontSize: 28 }} className="group-hover:scale-110 transition-transform" />
            ) : (
              <ExpandMore sx={{ fontSize: 28 }} className="group-hover:scale-110 transition-transform" />
            )}
          </button>

          {/* Quiz Details - Expandable */}
          {showDetails && (
            <div className="space-y-4 animate-slideDown">
              <h4 className="text-[#336d82] text-lg poppins-bold mb-4">
                Detail Jawaban ({results.length} Soal)
              </h4>

              {results.map((result, index) => (
                <div
                  key={result.soalId}
                  className={`rounded-2xl p-5 border-2 transition-all ${
                    result.isCorrect
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-rose-50 border-rose-200"
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`rounded-full p-2 flex-shrink-0 ${
                        result.isCorrect ? "bg-emerald-200" : "bg-rose-200"
                      }`}>
                        {result.isCorrect ? (
                          <CheckCircle sx={{ fontSize: 20, color: "#10b981" }} />
                        ) : (
                          <Cancel sx={{ fontSize: 20, color: "#f43f5e" }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-gray-700 text-sm poppins-bold">
                            Soal #{index + 1}
                          </span>
                          <span className="bg-white px-2 py-1 rounded-lg text-xs poppins-semibold text-gray-600 border border-gray-300">
                            {result.tipesoal}
                          </span>
                          <div className="bg-white px-2 py-1 rounded-lg border border-gray-300 flex items-center gap-1">
                            <Timer sx={{ fontSize: 14, color: "#6b7280" }} />
                            <span className="text-gray-700 text-xs poppins-bold">
                              {formatWaktu(result.waktuJawab)}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-800 text-sm poppins-regular leading-relaxed">
                          {result.pertanyaan}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Answers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
                    {/* Student Answer */}
                    <div className="bg-white rounded-xl p-3 border-2 border-gray-300">
                      <p className="text-gray-500 text-xs poppins-semibold mb-1 uppercase">
                        Jawaban Siswa:
                      </p>
                      <p className={`text-sm poppins-bold ${
                        result.isCorrect ? "text-emerald-700" : "text-rose-700"
                      }`}>
                        {result.jawabanSiswa}
                      </p>
                    </div>

                    {/* Correct Answer */}
                    <div className="bg-white rounded-xl p-3 border-2 border-emerald-300">
                      <p className="text-gray-500 text-xs poppins-semibold mb-1 uppercase">
                        Jawaban Benar:
                      </p>
                      <p className="text-emerald-700 text-sm poppins-bold">
                        {result.jawabanBenar}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-3xl border-t-2 border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#2ea062] text-white px-8 py-3 rounded-xl poppins-semibold hover:bg-[#27875a] transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default HasilKuisModal;
