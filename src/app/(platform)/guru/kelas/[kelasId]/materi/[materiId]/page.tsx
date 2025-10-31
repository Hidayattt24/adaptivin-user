"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowBack, Edit, Add, PlayArrow, PictureAsPdf } from "@mui/icons-material";

/**
 * Guru - Detail Materi Page
 * 
 * Halaman untuk melihat detail materi yang sudah dibuat
 * Menampilkan:
 * - Materi Utama
 * - Sub-Materi (jika ada)
 * - Tombol untuk edit dan tambah kuis
 * 
 * Responsive: Mobile & Desktop optimized
 */

interface IsiMateri {
  id: string;
  title: string;
  hasFile: boolean;
  hasVideo: boolean;
  hasExplanation: boolean;
  imageCount: number;
}

export default function GuruDetailMateriPage() {
  const params = useParams();
  const router = useRouter();
  
  const kelasId = params?.kelasId as string;
  const materiId = params?.materiId as string;

  // Mock data - replace with API call
  const [materiData] = useState({
    mainTitle: "Pecahan Biasa & Campuran",
    mainMateri: {
      id: "main-1",
      title: "Pecahan Biasa & Campuran",
      hasFile: true,
      hasVideo: true,
      hasExplanation: true,
      imageCount: 2,
    } as IsiMateri,
    subMateri: [
      {
        id: "sub-1",
        title: "Pecahan Biasa",
        hasFile: true,
        hasVideo: false,
        hasExplanation: true,
        imageCount: 1,
      },
      {
        id: "sub-2",
        title: "Pecahan Campuran",
        hasFile: false,
        hasVideo: true,
        hasExplanation: true,
        imageCount: 3,
      },
    ] as IsiMateri[],
  });

  const handleViewIsiMateri = (isiMateriId: string) => {
    router.push(`/guru/kelas/${kelasId}/materi/${materiId}/${isiMateriId}`);
  };

  const handleEditMateri = () => {
    router.push(`/guru/kelas/${kelasId}/materi/edit?materiId=${materiId}`);
  };

  const handleAddKuis = (isiMateriId: string) => {
    router.push(`/guru/kelas/${kelasId}/materi/${materiId}/${isiMateriId}/tambah-kuis`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f4f8] via-white to-[#f0f9fc] py-4 md:py-6 px-4 md:px-8">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#336d82]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#fcc61d]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border-2 border-[#336d82]/20 p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push(`/guru/kelas/${kelasId}/materi`)}
              className="flex items-center gap-2 text-[#336d82] hover:bg-[#336d82]/10 px-3 py-2 rounded-lg transition-all"
            >
              <ArrowBack sx={{ fontSize: 20 }} />
              <span className="text-sm font-medium font-poppins">Kembali</span>
            </button>

            <button
              onClick={handleEditMateri}
              className="flex items-center gap-2 bg-gradient-to-r from-[#fcc61d] to-[#f5b800] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              <Edit sx={{ fontSize: 18 }} />
              <span className="text-sm font-semibold font-poppins">Edit Materi</span>
            </button>
          </div>

          <h1 className="text-xl md:text-3xl font-bold text-[#336d82] font-poppins">
            {materiData.mainTitle}
          </h1>
          <p className="text-sm text-gray-600 mt-2 font-poppins">
            Kelola konten pembelajaran dan kuis untuk materi ini
          </p>
        </div>

        {/* Main Material Card */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#336d82]/30 to-transparent"></div>
            <span className="text-sm font-semibold text-[#336d82] font-poppins px-4 py-1.5 bg-white rounded-full shadow-sm border border-[#336d82]/20">
              📚 Materi Utama
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#336d82]/30 to-transparent"></div>
          </div>

          <IsiMateriCard
            data={materiData.mainMateri}
            onView={() => handleViewIsiMateri(materiData.mainMateri.id)}
            onAddKuis={() => handleAddKuis(materiData.mainMateri.id)}
            isMain={true}
          />
        </div>

        {/* Sub Material Cards */}
        {materiData.subMateri.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#336d82]/30 to-transparent"></div>
              <span className="text-sm font-semibold text-[#336d82] font-poppins px-4 py-1.5 bg-white rounded-full shadow-sm border border-[#336d82]/20">
                📖 Sub-Materi ({materiData.subMateri.length})
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#336d82]/30 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materiData.subMateri.map((sub) => (
                <IsiMateriCard
                  key={sub.id}
                  data={sub}
                  onView={() => handleViewIsiMateri(sub.id)}
                  onAddKuis={() => handleAddKuis(sub.id)}
                  isMain={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Isi Materi Card Component
interface IsiMateriCardProps {
  data: IsiMateri;
  onView: () => void;
  onAddKuis: () => void;
  isMain: boolean;
}

function IsiMateriCard({ data, onView, onAddKuis, isMain }: IsiMateriCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 ${isMain ? 'border-[#336d82]' : 'border-[#336d82]/30'} p-4 md:p-5 hover:shadow-xl transition-all`}>
      {/* Title */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isMain ? 'bg-gradient-to-br from-[#336d82] to-[#2a5a6d]' : 'bg-gradient-to-br from-[#fcc61d] to-[#f5b800]'}`}>
          <span className="text-white text-lg">{isMain ? '📚' : '📖'}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-bold text-[#336d82] font-poppins truncate">
            {data.title}
          </h3>
          <p className="text-xs text-gray-600 font-poppins">
            {isMain ? 'Topik Utama' : 'Sub-Topik'}
          </p>
        </div>
      </div>

      {/* Content Info */}
      <div className="space-y-2 mb-4">
        {data.hasFile && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <PictureAsPdf sx={{ fontSize: 16, color: '#ef4444' }} />
            <span className="font-poppins">File PDF tersedia</span>
          </div>
        )}
        {data.hasVideo && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <PlayArrow sx={{ fontSize: 16, color: '#3b82f6' }} />
            <span className="font-poppins">Video tersedia</span>
          </div>
        )}
        {data.hasExplanation && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-base">📝</span>
            <span className="font-poppins">Penjelasan tersedia</span>
          </div>
        )}
        {data.imageCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-base">🖼️</span>
            <span className="font-poppins">{data.imageCount} gambar</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 bg-[#336d82] text-white py-2 rounded-lg hover:bg-[#2a5a6d] transition-all text-sm font-semibold font-poppins"
        >
          Lihat Detail
        </button>
        <button
          onClick={onAddKuis}
          className="flex items-center justify-center gap-1 bg-gradient-to-r from-[#fcc61d] to-[#f5b800] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
        >
          <Add sx={{ fontSize: 18 }} />
          <span className="text-sm font-semibold font-poppins">Kuis</span>
        </button>
      </div>
    </div>
  );
}
