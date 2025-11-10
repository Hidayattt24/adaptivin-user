import React, { useState } from "react";
import { HasilKuisSiswa } from "@/lib/api/kuis";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TimerIcon from "@mui/icons-material/Timer";
import SchoolIcon from "@mui/icons-material/School";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface QuizHistoryCardProps {
  riwayat: HasilKuisSiswa[];
  onViewDetail: (hasilKuisId: string) => void;
}

const QuizHistoryCard: React.FC<QuizHistoryCardProps> = ({
  riwayat,
  onViewDetail,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (riwayat.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatWaktu = (totalDetik: number) => {
    const menit = Math.floor(totalDetik / 60);
    const detik = totalDetik % 60;
    return `${menit}m ${detik}d`;
  };

  const hitungNilai = (benar: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((benar / total) * 100);
  };

  return (
    <div className="relative">
      {/* Mbah Adaptivin Card - Collapsed State */}
      <div
        className={`relative overflow-hidden rounded-[24px] shadow-2xl transition-all duration-300 ${
          isExpanded ? "mb-6" : ""
        }`}
        style={{
          background: "linear-gradient(135deg, #336D82 0%, #7AB0C4 100%)",
        }}
      >
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-40 h-40 bg-white rounded-full -top-10 -left-10 animate-pulse" />
          <div className="absolute w-32 h-32 bg-white rounded-full -bottom-10 -right-10 animate-pulse delay-75" />
        </div>

        <div className="relative p-6 md:p-8">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-4">
            {/* Mbah Adaptivin Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white p-2 shadow-lg">
                <Image
                  src="/mascot/mbah-adaptivin.svg"
                  alt="Mbah Adaptivin"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                <span className="text-xs">🎯</span>
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                Hai Anak Pintar! 👋
              </h3>
              <p className="text-white/90 text-sm md:text-base">
                Mbah mau lihat hasil belajar kamu sebelumnya nih! 📚✨
              </p>
            </div>
          </div>

          {/* Stats Preview (when collapsed) */}
          {!isExpanded && riwayat.length > 0 && (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <p className="text-white/80 text-xs">Percobaan Terakhir</p>
                    <p className="text-white font-bold text-lg">
                      {hitungNilai(
                        riwayat[0].total_benar,
                        riwayat[0].total_benar + riwayat[0].total_salah
                      )}
                      <span className="text-sm ml-1">poin</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-xs">Total Percobaan</p>
                  <p className="text-white font-bold text-lg">
                    {riwayat.length}x
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full bg-white hover:bg-gray-50 text-[#336D82] py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            <span className="text-xl">{isExpanded ? "📤" : "👀"}</span>
            {isExpanded ? "Sembunyikan Riwayat" : "Lihat Riwayat Bersama Mbah"}
            <span
              className={`material-symbols-outlined transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </button>
        </div>
      </div>

      {/* Expanded History List */}
      {isExpanded && (
        <div className="space-y-4 animate-fade-in">
          {riwayat.map((hasil, index) => {
            const totalSoal = hasil.total_benar + hasil.total_salah;
            const nilai = hitungNilai(hasil.total_benar, totalSoal);
            const isLatest = index === 0;

            return (
              <div
                key={hasil.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] ${
                  isLatest
                    ? "border-[#336D82] ring-4 ring-[#336D82]/20"
                    : "border-gray-200"
                }`}
              >
                {/* Latest Badge */}
                {isLatest && (
                  <div className="absolute top-0 right-0">
                    <div
                      className="px-4 py-1 rounded-bl-2xl text-white text-xs font-bold"
                      style={{
                        background:
                          "linear-gradient(135deg, #336D82 0%, #7AB0C4 100%)",
                      }}
                    >
                      🌟 Terbaru
                    </div>
                  </div>
                )}

                <div className="p-5">
                  {/* Date */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-500">
                      📅 {formatDate(hasil.created_at)}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircleIcon
                          sx={{ color: "#10b981", fontSize: "18px" }}
                        />
                        <p className="text-xs text-green-700 font-semibold">
                          Benar
                        </p>
                      </div>
                      <p className="font-bold text-xl text-green-700">
                        {hasil.total_benar}
                      </p>
                    </div>

                    <div className="bg-red-50 rounded-xl p-3 border border-red-200">
                      <div className="flex items-center gap-2 mb-1">
                        <CancelIcon
                          sx={{ color: "#ef4444", fontSize: "18px" }}
                        />
                        <p className="text-xs text-red-700 font-semibold">
                          Salah
                        </p>
                      </div>
                      <p className="font-bold text-xl text-red-700">
                        {hasil.total_salah}
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <TimerIcon
                          sx={{ color: "#3b82f6", fontSize: "18px" }}
                        />
                        <p className="text-xs text-blue-700 font-semibold">
                          Waktu
                        </p>
                      </div>
                      <p className="font-bold text-xl text-blue-700">
                        {formatWaktu(hasil.total_waktu)}
                      </p>
                    </div>

                    <div
                      className="rounded-xl p-3 border-2"
                      style={{
                        background:
                          "linear-gradient(135deg, #336D82 0%, #7AB0C4 100%)",
                        borderColor: "#336D82",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <SchoolIcon sx={{ color: "white", fontSize: "18px" }} />
                        <p className="text-xs text-white font-semibold">
                          Nilai
                        </p>
                      </div>
                      <p className="font-bold text-xl text-white">{nilai}</p>
                    </div>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => onViewDetail(hasil.id)}
                    className="w-full py-3 rounded-xl font-bold text-white transition-all active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #336D82 0%, #7AB0C4 100%)",
                    }}
                  >
                    <VisibilityIcon sx={{ fontSize: "20px" }} />
                    Lihat Detail Bersama Mbah
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .delay-75 {
          animation-delay: 75ms;
        }
      `}</style>
    </div>
  );
};

export default QuizHistoryCard;
