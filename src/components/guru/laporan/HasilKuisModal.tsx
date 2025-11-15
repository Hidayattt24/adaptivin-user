"use client";

import React, { useMemo, useState } from "react";
import { Close, CheckCircle, Cancel, Timer, ExpandMore, ExpandLess, CalendarToday } from "@mui/icons-material";

interface QuizResult {
  id?: string; // Unique identifier from backend
  soalId: string;
  pertanyaan: string;
  tipesoal: string;
  jawabanSiswa: string;
  jawabanBenar: string;
  isCorrect: boolean;
  waktuJawab: number; // dalam detik
  // Tambahan untuk mapping pilihan ganda
  jawabanSiswaId?: string;
  jawabanBenarId?: string;
}

interface QuizAttempt {
  hasilKuisId: string;
  tanggal: string;
  totalBenar: number;
  totalSalah: number;
  totalWaktu: number;
  detailJawaban: QuizResult[];
}

interface HasilKuisModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  materiTitle: string;
  attempts: QuizAttempt[]; // Changed from results to attempts
}

const HasilKuisModal: React.FC<HasilKuisModalProps> = ({
  isOpen,
  onClose,
  studentName,
  materiTitle,
  attempts,
}) => {
  const [selectedAttemptIndex, setSelectedAttemptIndex] = useState(0);
  const [expandedAttempts, setExpandedAttempts] = useState<Set<number>>(new Set([0])); // First attempt expanded by default

  const toggleAttempt = (index: number) => {
    const newExpanded = new Set(expandedAttempts);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedAttempts(newExpanded);
  };

  // Calculate statistics for each attempt
  const calculateStats = (results: QuizResult[]) => {
    const totalBenar = results.filter((r) => r.isCorrect).length;
    const totalSalah = results.length - totalBenar;
    const totalWaktu = results.reduce((sum, r) => sum + r.waktuJawab, 0);
    const rataRataWaktu = Math.round(totalWaktu / (results.length || 1));
    const skor = Math.round((totalBenar / (results.length || 1)) * 100);

    // Calculate by taxonomy level
    const byLevel: Record<string, { benar: number; salah: number; total: number }> = {};

    results.forEach((r) => {
      // Extract level from tipesoal (e.g., "level3" or "C3")
      const levelMatch = r.tipesoal.match(/level(\d)/i) || r.tipesoal.match(/C(\d)/i);
      const levelNum = levelMatch ? levelMatch[1] : "1";
      const level = `Level ${levelNum}`;
      
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
  };

  // Format waktu
  const formatWaktu = (detik: number) => {
    const menit = Math.floor(detik / 60);
    const sisaDetik = detik % 60;
    if (menit > 0) {
      return `${menit}m ${sisaDetik}s`;
    }
    return `${sisaDetik}s`;
  };

  // Format tanggal
  const formatTanggal = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Check if string is UUID and format it for display
  const formatJawaban = (jawaban: string) => {
    if (!jawaban) return "-";

    // Check if it's a single UUID
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (uuidPattern.test(jawaban)) {
      // Single UUID (pilihan ganda)
      return "[ID Jawaban - Backend perlu mengirim teks jawaban]";
    }

    // Check if it's multiple UUIDs separated by comma (pilihan ganda kompleks)
    const multipleUuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(,[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})+$/i;
    
    if (multipleUuidPattern.test(jawaban)) {
      // Multiple UUIDs (pilihan ganda kompleks)
      const count = jawaban.split(',').length;
      return `[${count} ID Jawaban - Backend perlu mengirim teks jawaban]`;
    }
    
    return jawaban;
  };

  // Get score status
  const getScoreStatus = (score: number) => {
    if (score >= 80) {
      return {
        color: "from-emerald-500 to-emerald-600",
        bgColor: "bg-emerald-500",
        label: "Luar Biasa!",
        textColor: "text-white",
      };
    }
    if (score >= 60) {
      return {
        color: "from-yellow-500 to-yellow-600",
        bgColor: "bg-yellow-500",
        label: "Cukup Baik",
        textColor: "text-white",
      };
    }
    return {
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-500",
      label: "Perlu Perbaikan",
      textColor: "text-white",
    };
  };

  if (!isOpen || attempts.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-slideUp">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#2ea062] to-[#3bc97a] rounded-t-3xl shadow-lg">
          {/* Top Bar */}
          <div className="p-4 sm:p-6 flex items-center justify-between">
            <div>
              <h2 className="text-white text-xl sm:text-2xl poppins-bold">Riwayat Hasil Kuis</h2>
              <p className="text-white/90 text-xs sm:text-sm poppins-medium">{studentName} • {materiTitle}</p>
              <p className="text-white/80 text-xs poppins-regular mt-1">{attempts.length} percobaan kuis</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors flex-shrink-0"
              aria-label="Tutup"
            >
              <Close sx={{ fontSize: 28 }} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
            
            {/* List of Attempts */}
            {attempts.map((attempt, attemptIndex) => {
              const stats = calculateStats(attempt.detailJawaban);
              const scoreStatus = getScoreStatus(stats.skor);
              const isExpanded = expandedAttempts.has(attemptIndex);

              return (
                <div
                  key={attempt.hasilKuisId}
                  className="bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                >
                  {/* Attempt Header - Always Visible */}
                  <button
                    onClick={() => toggleAttempt(attemptIndex)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      {/* Attempt Number Badge */}
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center ${scoreStatus.bgColor} shadow-md`}>
                        <span className="text-white text-lg sm:text-xl poppins-bold">#{attemptIndex + 1}</span>
                      </div>
                      
                      {/* Attempt Info */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <CalendarToday sx={{ fontSize: { xs: 14, sm: 16 }, color: "#6b7280" }} />
                          <p className="text-gray-700 text-xs sm:text-sm poppins-semibold">
                            {formatTanggal(attempt.tanggal)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-1">
                            <span className="text-2xl sm:text-3xl poppins-bold text-gray-900">{stats.skor}</span>
                            <span className="text-xs sm:text-sm poppins-medium text-gray-500">poin</span>
                          </div>
                          <div className={`px-2 sm:px-3 py-1 rounded-lg ${scoreStatus.bgColor} bg-opacity-20`}>
                            <span className={`text-[10px] sm:text-xs poppins-semibold ${scoreStatus.textColor}`}>
                              {scoreStatus.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <div className="ml-2">
                      {isExpanded ? (
                        <ExpandLess sx={{ fontSize: { xs: 24, sm: 28 }, color: "#6b7280" }} />
                      ) : (
                        <ExpandMore sx={{ fontSize: { xs: 24, sm: 28 }, color: "#6b7280" }} />
                      )}
                    </div>
                  </button>

                  {/* Attempt Details - Expandable */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 border-t-2 border-gray-100 space-y-4 sm:space-y-5 animate-slideDown">
                      
                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {/* Correct */}
                        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-2 sm:p-3 text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <CheckCircle sx={{ fontSize: { xs: 14, sm: 16 }, color: "#10b981" }} />
                            <p className="text-gray-600 text-[10px] sm:text-xs poppins-medium">Benar</p>
                          </div>
                          <p className="text-emerald-700 text-2xl sm:text-3xl poppins-bold">{stats.totalBenar}</p>
                          <p className="text-emerald-600 text-[10px] poppins-medium mt-0.5">soal</p>
                        </div>

                        {/* Incorrect */}
                        <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-2 sm:p-3 text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Cancel sx={{ fontSize: { xs: 14, sm: 16 }, color: "#f43f5e" }} />
                            <p className="text-gray-600 text-[10px] sm:text-xs poppins-medium">Salah</p>
                          </div>
                          <p className="text-rose-700 text-2xl sm:text-3xl poppins-bold">{stats.totalSalah}</p>
                          <p className="text-rose-600 text-[10px] poppins-medium mt-0.5">soal</p>
                        </div>

                        {/* Time */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-2 sm:p-3 text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Timer sx={{ fontSize: { xs: 14, sm: 16 }, color: "#3b82f6" }} />
                            <p className="text-gray-600 text-[10px] sm:text-xs poppins-medium">Rata-rata</p>
                          </div>
                          <p className="text-blue-700 text-xl sm:text-2xl poppins-bold">{formatWaktu(stats.rataRataWaktu)}</p>
                          <p className="text-blue-600 text-[10px] poppins-medium mt-0.5">per soal</p>
                        </div>
                      </div>

                      {/* Performance by Level - Compact */}
                      <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border-2 border-gray-200">
                        <h3 className="text-[#336d82] text-sm sm:text-base poppins-bold mb-2 sm:mb-3">
                          Performa per Tingkat
                        </h3>

                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
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
                                className={`bg-gradient-to-br ${levelColors} rounded-lg p-2 border-2 text-center`}
                              >
                                <p className="text-white text-[10px] sm:text-xs poppins-bold mb-0.5">{level}</p>
                                {levelData.total > 0 ? (
                                  <>
                                    <p className="text-white text-lg sm:text-xl poppins-bold">{accuracy}%</p>
                                    <p className="text-white/90 text-[10px] poppins-medium">
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

                      {/* Detail Jawaban */}
                      <div className="space-y-2 sm:space-y-3">
                        <h4 className="text-[#336d82] text-sm sm:text-base poppins-bold">
                          Detail Jawaban ({attempt.detailJawaban.length} Soal)
                        </h4>

                        {attempt.detailJawaban.map((result, index) => (
                          <div
                            key={result.id || `${result.soalId}-${index}`}
                            className={`rounded-xl p-3 sm:p-4 border-2 transition-all ${result.isCorrect
                              ? "bg-emerald-50 border-emerald-200"
                              : "bg-rose-50 border-rose-200"
                              }`}
                          >
                            {/* Question Header */}
                            <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                              <div className={`rounded-full p-1 sm:p-1.5 flex-shrink-0 ${result.isCorrect ? "bg-emerald-200" : "bg-rose-200"
                                }`}>
                                {result.isCorrect ? (
                                  <CheckCircle sx={{ fontSize: { xs: 16, sm: 18 }, color: "#10b981" }} />
                                ) : (
                                  <Cancel sx={{ fontSize: { xs: 16, sm: 18 }, color: "#f43f5e" }} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                  <span className="text-gray-700 text-xs sm:text-sm poppins-bold">
                                    Soal #{index + 1}
                                  </span>
                                  <span className="bg-white px-1.5 py-0.5 rounded text-[10px] sm:text-xs poppins-semibold text-gray-600 border border-gray-300">
                                    {result.tipesoal}
                                  </span>
                                  <div className="bg-white px-1.5 py-0.5 rounded border border-gray-300 flex items-center gap-0.5">
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

                            {/* Answers */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-0 sm:pl-8">
                              {/* Student Answer */}
                              <div className="bg-white rounded-lg p-2 sm:p-2.5 border-2 border-gray-300">
                                <p className="text-gray-500 text-[10px] poppins-semibold mb-1 uppercase">
                                  Jawaban Siswa:
                                </p>
                                <p className={`text-xs sm:text-sm poppins-bold break-words ${result.isCorrect ? "text-emerald-700" : "text-rose-700"
                                  }`}>
                                  {formatJawaban(result.jawabanSiswa)}
                                </p>
                              </div>

                              {/* Correct Answer */}
                              <div className="bg-white rounded-lg p-2 sm:p-2.5 border-2 border-emerald-300">
                                <p className="text-gray-500 text-[10px] poppins-semibold mb-1 uppercase">
                                  Jawaban Benar:
                                </p>
                                <p className="text-emerald-700 text-xs sm:text-sm poppins-bold break-words">
                                  {formatJawaban(result.jawabanBenar)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
