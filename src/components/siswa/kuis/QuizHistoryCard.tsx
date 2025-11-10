import React from "react";
import { HasilKuisSiswa } from "@/lib/api/kuis";
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerIcon from '@mui/icons-material/Timer';
import SchoolIcon from '@mui/icons-material/School';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface QuizHistoryCardProps {
  riwayat: HasilKuisSiswa[];
  onViewDetail: (hasilKuisId: string) => void;
}

const QuizHistoryCard: React.FC<QuizHistoryCardProps> = ({
  riwayat,
  onViewDetail,
}) => {
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
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <HistoryIcon sx={{ color: '#336D82', fontSize: '48px', marginRight: '12px' }} />
        <h3 className="text-xl font-bold text-[#336D82]">Riwayat Kuis</h3>
      </div>

      <div className="space-y-3">
        {riwayat.map((hasil, index) => {
          const totalSoal = hasil.total_benar + hasil.total_salah;
          const nilai = hitungNilai(hasil.total_benar, totalSoal);
          const isLatest = index === 0;

          return (
            <div
              key={hasil.id}
              className={`border rounded-xl p-4 transition-all hover:shadow-md ${isLatest
                  ? "border-[#336D82] bg-[#336D82]/5"
                  : "border-gray-200"
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {isLatest && (
                      <span className="bg-[#336D82] text-white text-xs px-2 py-1 rounded-full">
                        Terbaru
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {formatDate(hasil.created_at)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon sx={{ color: '#10b981', fontSize: '20px' }} />
                      <div>
                        <p className="text-xs text-gray-500">Benar</p>
                        <p className="font-semibold text-gray-900">
                          {hasil.total_benar}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CancelIcon sx={{ color: '#ef4444', fontSize: '20px' }} />
                      <div>
                        <p className="text-xs text-gray-500">Salah</p>
                        <p className="font-semibold text-gray-900">
                          {hasil.total_salah}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <TimerIcon sx={{ color: '#3b82f6', fontSize: '20px' }} />
                      <div>
                        <p className="text-xs text-gray-500">Waktu</p>
                        <p className="font-semibold text-gray-900">
                          {formatWaktu(hasil.total_waktu)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <SchoolIcon sx={{ color: '#336D82', fontSize: '20px' }} />
                      <div>
                        <p className="text-xs text-gray-500">Nilai</p>
                        <p className="font-semibold text-gray-900">{nilai}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onViewDetail(hasil.id)}
                  className="ml-4 px-4 py-2 bg-[#336D82] text-white rounded-lg text-sm font-medium hover:bg-[#2a5a6d] transition-colors flex items-center gap-1"
                >
                  <VisibilityIcon sx={{ fontSize: '14px' }} />
                  Lihat
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizHistoryCard;
