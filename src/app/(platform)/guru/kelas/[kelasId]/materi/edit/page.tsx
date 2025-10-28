"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowBackIos } from "@mui/icons-material";
import {
  UploadTimeline,
  EditableTitleSection,
  EditableFileSection,
  EditableExplanationSection,
} from "@/components/guru";

// Toast notification types
type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// Material data interface
interface MaterialData {
  id: string;
  title: string;
  fileUrl?: string;
  fileName?: string;
  videoUrl?: string;
  videoName?: string;
  explanation: string;
  imageUrls: string[];
}

const EditMateriPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const kelasId = params.kelasId as string;
  const materiId = searchParams.get("id") || ""; // Get materiId from query params

  const [isLoading, setIsLoading] = useState(true);
  const [materialData, setMaterialData] = useState<MaterialData | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Fetch material data on mount
  useEffect(() => {
    if (materiId) {
      fetchMaterialData();
    } else {
      setIsLoading(false);
    }
  }, [materiId]);

  const fetchMaterialData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/materi/${materiId}`);
      // const data = await response.json();

      // Mock data for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData: MaterialData = {
        id: materiId,
        title: "Pecahan biasa & campuran",
        fileName: "File belajar pecahan dasar bilangan",
        videoName: "Video belajar pecahan dasar bilangan",
        explanation:
          "Cara Menghitung Luas Agar Semua Kebagian!\n\nBayangkan kamu punya satu kue yang sangat enak dan kamu ingin berbagi dengan 3 temanmu. Kalau kamu ingin membaginya dengan adil, kue itu perlu dipotong jadi 4 bagian yang sama besar (untuk kamu dan 3 temanmu). Nah, satu potongan kue itu adalah 1/4 (satu per empat) dari seluruh kue!\n\nKenapa disebut 1/4?\n\n1 adalah satu potong (bagian yang kamu punya)\n4 adalah jumlah total potongan (untuk kamu dan temanmu semua)\n\nJadi, pecahan campuran itu kayak kamu punya 1 kue utuh PLUS 1/4 potongan dari kue lagi. Itu artinya kamu sebenarnya punya 1 1/4 kue!",
        imageUrls: [
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
        ],
      };

      setMaterialData(mockData);
    } catch (error) {
      console.error("Failed to fetch material data:", error);
      showToast("Gagal memuat data materi", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Toast notification helper
  const showToast = (message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  // API handlers
  const handleSaveTitle = async (newTitle: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/materi/${materiId}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ title: newTitle }),
      // });

      await new Promise((resolve) => setTimeout(resolve, 500));

      setMaterialData((prev) =>
        prev ? { ...prev, title: newTitle } : null
      );
      showToast("Judul berhasil diperbarui", "success");
    } catch (error) {
      console.error("Failed to save title:", error);
      showToast("Gagal menyimpan judul", "error");
      throw error;
    }
  };

  const handleSaveFile = async (file: File | null) => {
    try {
      // TODO: Replace with actual API call
      // const formData = new FormData();
      // if (file) formData.append('file', file);
      // await fetch(`/api/materi/${materiId}/file`, {
      //   method: 'PATCH',
      //   body: formData,
      // });

      await new Promise((resolve) => setTimeout(resolve, 500));

      setMaterialData((prev) =>
        prev ? { ...prev, fileName: file?.name } : null
      );
      showToast("File berhasil diperbarui", "success");
    } catch (error) {
      console.error("Failed to save file:", error);
      showToast("Gagal menyimpan file", "error");
      throw error;
    }
  };

  const handleDeleteFile = async () => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/materi/${materiId}/file`, { method: 'DELETE' });

      await new Promise((resolve) => setTimeout(resolve, 500));

      setMaterialData((prev) =>
        prev ? { ...prev, fileName: undefined, fileUrl: undefined } : null
      );
      showToast("File berhasil dihapus", "success");
    } catch (error) {
      console.error("Failed to delete file:", error);
      showToast("Gagal menghapus file", "error");
      throw error;
    }
  };

  const handleSaveVideo = async (video: File | null) => {
    try {
      // TODO: Replace with actual API call
      // const formData = new FormData();
      // if (video) formData.append('video', video);
      // await fetch(`/api/materi/${materiId}/video`, {
      //   method: 'PATCH',
      //   body: formData,
      // });

      await new Promise((resolve) => setTimeout(resolve, 500));

      setMaterialData((prev) =>
        prev ? { ...prev, videoName: video?.name } : null
      );
      showToast("Video berhasil diperbarui", "success");
    } catch (error) {
      console.error("Failed to save video:", error);
      showToast("Gagal menyimpan video", "error");
      throw error;
    }
  };

  const handleDeleteVideo = async () => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/materi/${materiId}/video`, { method: 'DELETE' });

      await new Promise((resolve) => setTimeout(resolve, 500));

      setMaterialData((prev) =>
        prev ? { ...prev, videoName: undefined, videoUrl: undefined } : null
      );
      showToast("Video berhasil dihapus", "success");
    } catch (error) {
      console.error("Failed to delete video:", error);
      showToast("Gagal menghapus video", "error");
      throw error;
    }
  };

  const handleSaveExplanation = async (explanation: string, images: File[]) => {
    try {
      // TODO: Replace with actual API call
      // const formData = new FormData();
      // formData.append('explanation', explanation);
      // images.forEach((img, index) => {
      //   formData.append(`images[${index}]`, img);
      // });
      // await fetch(`/api/materi/${materiId}/explanation`, {
      //   method: 'PATCH',
      //   body: formData,
      // });

      await new Promise((resolve) => setTimeout(resolve, 500));

      const newImageUrls = images.map(() =>
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop"
      );

      setMaterialData((prev) =>
        prev
          ? {
              ...prev,
              explanation,
              imageUrls: [...prev.imageUrls, ...newImageUrls],
            }
          : null
      );
      showToast("Penjelasan berhasil diperbarui", "success");
    } catch (error) {
      console.error("Failed to save explanation:", error);
      showToast("Gagal menyimpan penjelasan", "error");
      throw error;
    }
  };

  const handleDeleteExplanation = async () => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/materi/${materiId}/explanation`, { method: 'DELETE' });

      await new Promise((resolve) => setTimeout(resolve, 500));

      setMaterialData((prev) =>
        prev ? { ...prev, explanation: "", imageUrls: [] } : null
      );
      showToast("Penjelasan berhasil dihapus", "success");
    } catch (error) {
      console.error("Failed to delete explanation:", error);
      showToast("Gagal menghapus penjelasan", "error");
      throw error;
    }
  };

  const handleBack = () => {
    router.push(`/guru/kelas/${kelasId}/materi`);
  };

  const handleSubmit = () => {
    showToast("Semua perubahan berhasil disimpan", "success");
    setTimeout(() => {
      router.push(`/guru/kelas/${kelasId}/materi`);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#336d82] mx-auto mb-4"></div>
          <p className="text-gray-600 font-poppins">Memuat data materi...</p>
        </div>
      </div>
    );
  }

  if (!materiId || !materialData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-poppins text-lg mb-4">
            {!materiId ? "ID Materi tidak ditemukan" : "Data materi tidak ditemukan"}
          </p>
          <button
            onClick={handleBack}
            className="mt-4 px-6 py-2 bg-[#336d82] text-white rounded-lg hover:bg-[#2a5a6d] transition-colors font-poppins"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded-xl shadow-lg font-poppins font-semibold text-white animate-slide-in ${
              toast.type === "success"
                ? "bg-gradient-to-r from-[#2ea062] to-[#26824f]"
                : toast.type === "error"
                ? "bg-gradient-to-r from-[#ff1919] to-[#e01515]"
                : "bg-gradient-to-r from-[#336d82] to-[#2a5a6d]"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#336d82] to-[#2a5a6d] py-6 px-4 shadow-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110 backdrop-blur-sm"
              aria-label="Kembali"
            >
              <ArrowBackIos sx={{ fontSize: 18, color: "white", ml: 0.5 }} />
            </button>
            <h1 className="text-[20px] md:text-[24px] font-bold text-white text-center flex-1 font-poppins tracking-wide">
              EDIT MATERI PEMBELAJARAN
            </h1>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-6 px-4 bg-white shadow-sm">
        <UploadTimeline currentStep={2} />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Title Section */}
        <EditableTitleSection
          initialTitle={materialData.title}
          onSave={handleSaveTitle}
        />

        {/* File Section */}
        <EditableFileSection
          title="Unggah materi dalam bentuk file"
          initialFile={null}
          initialFileName={materialData.fileName}
          accept=".pdf,.doc,.docx"
          formatHint="Format: PDF, DOC, DOCX"
          onSave={handleSaveFile}
          onDelete={handleDeleteFile}
        />

        {/* Video Section */}
        <EditableFileSection
          title="Unggah materi dalam bentuk video"
          initialFile={null}
          initialFileName={materialData.videoName}
          accept="video/*"
          formatHint="Format: MP4, AVI, MOV"
          onSave={handleSaveVideo}
          onDelete={handleDeleteVideo}
        />

        {/* Explanation Section */}
        <EditableExplanationSection
          initialExplanation={materialData.explanation}
          initialImages={materialData.imageUrls}
          onSave={handleSaveExplanation}
          onDelete={handleDeleteExplanation}
        />

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            onClick={handleBack}
            className="flex-1 md:flex-none px-12 py-3.5 rounded-xl text-[17px] md:text-[19px] font-semibold transition-all duration-300 font-poppins shadow-md hover:shadow-lg bg-white border-2 border-[#336d82] text-[#336d82] hover:bg-gray-50"
          >
            Kembali
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 md:flex-none px-16 py-3.5 rounded-xl text-[17px] md:text-[19px] font-semibold transition-all duration-300 font-poppins shadow-xl hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-r from-[#336d82] to-[#2a5a6d] text-white hover:from-[#2a5a6d] hover:to-[#1f4550]"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-12"></div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EditMateriPage;
