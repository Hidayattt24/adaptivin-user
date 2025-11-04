"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Close, TrendingUp, TrendingDown, Lightbulb } from "@mui/icons-material";

interface PerformanceData {
  level: string;
  benar: number;
  salah: number;
}

interface GrafikPerkembanganModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  materiTitle: string;
  data: PerformanceData[];
}

const GrafikPerkembanganModal: React.FC<GrafikPerkembanganModalProps> = ({
  isOpen,
  onClose,
  studentName,
  materiTitle,
  data,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    }
  }, [isOpen]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalBenar = data.reduce((sum, d) => sum + d.benar, 0);
    const totalSalah = data.reduce((sum, d) => sum + d.salah, 0);
    const total = totalBenar + totalSalah;
    const avgAccuracy = total > 0 ? Math.round((totalBenar / total) * 100) : 0;

    // Calculate trend
    const midPoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midPoint);
    const secondHalf = data.slice(midPoint);

    const firstHalfAccuracy =
      firstHalf.reduce((sum, d) => {
        const total = d.benar + d.salah;
        return sum + (total > 0 ? (d.benar / total) * 100 : 0);
      }, 0) / (firstHalf.length || 1);

    const secondHalfAccuracy =
      secondHalf.reduce((sum, d) => {
        const total = d.benar + d.salah;
        return sum + (total > 0 ? (d.benar / total) * 100 : 0);
      }, 0) / (secondHalf.length || 1);

    const trend = secondHalfAccuracy - firstHalfAccuracy;

    return {
      totalBenar,
      totalSalah,
      total,
      avgAccuracy,
      trend,
      isImproving: trend > 0,
    };
  }, [data]);

  // Calculate accuracy for each level
  const chartData = useMemo(() => {
    return data.map((item) => {
      const total = item.benar + item.salah;
      const accuracy = total > 0 ? Math.round((item.benar / total) * 100) : 0;
      return {
        level: item.level,
        accuracy,
        benar: item.benar,
        salah: item.salah,
        total,
      };
    });
  }, [data]);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "text-emerald-600";
    if (accuracy >= 60) return "text-yellow-600";
    return "text-rose-600";
  };

  const getAccuracyBg = (accuracy: number) => {
    if (accuracy >= 80) return "bg-emerald-100 border-emerald-300";
    if (accuracy >= 60) return "bg-yellow-100 border-yellow-300";
    return "bg-rose-100 border-rose-300";
  };

  const maxValue = Math.max(...data.map((d) => Math.max(d.benar, d.salah)), 1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#336d82] to-[#5a96a8] p-6 rounded-t-3xl flex items-center justify-between z-10 shadow-md">
          <div>
            <h2 className="text-white text-2xl poppins-bold">Grafik Perkembangan</h2>
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
          {/* Summary Stats - Compact Row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* Average Accuracy */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 text-center">
              <p className="text-gray-600 text-xs poppins-medium mb-1">Akurasi Rata-rata</p>
              <p className="text-blue-600 text-4xl poppins-bold">{stats.avgAccuracy}%</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {stats.isImproving ? (
                  <>
                    <TrendingUp sx={{ fontSize: 18, color: "#16a34a" }} />
                    <span className="text-emerald-600 text-xs poppins-semibold">
                      +{Math.abs(stats.trend).toFixed(1)}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown sx={{ fontSize: 18, color: "#dc2626" }} />
                    <span className="text-rose-600 text-xs poppins-semibold">
                      {stats.trend.toFixed(1)}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Total Correct */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 text-center">
              <p className="text-gray-600 text-xs poppins-medium mb-1">Total Benar</p>
              <p className="text-emerald-600 text-4xl poppins-bold">{stats.totalBenar}</p>
              <p className="text-emerald-600 text-xs poppins-medium mt-2">
                dari {stats.total} soal
              </p>
            </div>

            {/* Total Incorrect */}
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 text-center">
              <p className="text-gray-600 text-xs poppins-medium mb-1">Total Salah</p>
              <p className="text-rose-600 text-4xl poppins-bold">{stats.totalSalah}</p>
              <p className="text-rose-600 text-xs poppins-medium mt-2">
                perlu review
              </p>
            </div>
          </div>

          {/* Chart Section - Simplified */}
          <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#336d82] text-xl poppins-bold">
                Performa per Tingkat (C1-C6)
              </h3>
              {/* Compact Legend */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-700 poppins-medium">Benar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <span className="text-gray-700 poppins-medium">Salah</span>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="space-y-5">
              {chartData.map((item, index) => {
                const benarWidth = maxValue > 0 ? (item.benar / maxValue) * 100 : 0;
                const salahWidth = maxValue > 0 ? (item.salah / maxValue) * 100 : 0;

                return (
                  <div key={item.level} className="space-y-2">
                    {/* Level Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#336d82] text-white rounded-lg px-3 py-1.5 min-w-[3.5rem] text-center">
                          <span className="text-base poppins-bold">{item.level}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-lg border-2 ${getAccuracyBg(item.accuracy)}`}>
                          <span className={`text-sm poppins-bold ${getAccuracyColor(item.accuracy)}`}>
                            {item.accuracy}%
                          </span>
                        </div>
                      </div>
                      <span className="text-gray-600 text-sm poppins-medium">
                        {item.benar} benar • {item.salah} salah
                      </span>
                    </div>

                    {/* Progress Bars - Side by Side */}
                    <div className="flex gap-2 h-12">
                      {/* Correct Bar */}
                      <div className="relative flex-1 bg-gray-200 rounded-lg overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-lg transition-all duration-700 ease-out flex items-center justify-end pr-3"
                          style={{
                            width: mounted ? `${benarWidth}%` : "0%",
                          }}
                        >
                          {item.benar > 0 && (
                            <span className="text-white text-sm poppins-bold">
                              {item.benar}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Incorrect Bar */}
                      <div className="relative flex-1 bg-gray-200 rounded-lg overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-rose-400 to-rose-600 h-full rounded-lg transition-all duration-700 ease-out flex items-center justify-end pr-3"
                          style={{
                            width: mounted ? `${salahWidth}%` : "0%",
                          }}
                        >
                          {item.salah > 0 && (
                            <span className="text-white text-sm poppins-bold">
                              {item.salah}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insight Card - Compact */}
          <div className={`rounded-2xl p-5 border-2 ${stats.isImproving
            ? "bg-emerald-50 border-emerald-200"
            : "bg-yellow-50 border-yellow-200"
            }`}>
            <div className="flex items-start gap-3">
              <div className={`rounded-lg p-2 ${stats.isImproving ? "bg-emerald-200" : "bg-yellow-200"
                }`}>
                <Lightbulb sx={{ fontSize: 24, color: stats.isImproving ? "#047857" : "#d97706" }} />
              </div>
              <div className="flex-1">
                <h4 className={`text-base poppins-bold mb-1 ${stats.isImproving ? "text-emerald-800" : "text-yellow-800"
                  }`}>
                  Insight Pembelajaran
                </h4>
                <p className={`text-sm poppins-regular leading-relaxed ${stats.isImproving ? "text-emerald-700" : "text-yellow-700"
                  }`}>
                  {stats.isImproving ? (
                    <>
                      Siswa menunjukkan <strong>peningkatan yang baik</strong> dengan
                      trend positif {Math.abs(stats.trend).toFixed(1)}%. Pertahankan momentum belajar ini!
                    </>
                  ) : (
                    <>
                      Siswa memerlukan <strong>perhatian tambahan</strong> dengan
                      trend menurun {Math.abs(stats.trend).toFixed(1)}%. Berikan latihan tambahan dan review materi dasar.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-3xl border-t-2 border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#336d82] text-white px-8 py-3 rounded-xl poppins-semibold hover:bg-[#2a5a6d] transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrafikPerkembanganModal;
