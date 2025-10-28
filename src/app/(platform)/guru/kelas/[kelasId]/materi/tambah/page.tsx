"use client";

import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

interface MateriFormData {
  judul: string;
  fileMateri: File | null;
  videoMateri: File | null;
  penjelasan: string;
  images: File[];
}

const TambahMateriPage = () => {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.kelasId as string;

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<MateriFormData>({
    judul: "",
    fileMateri: null,
    videoMateri: null,
    penjelasan: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "file" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "file") {
        setFormData({ ...formData, fileMateri: file });
      } else if (type === "video") {
        setFormData({ ...formData, videoMateri: file });
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Add new images to existing ones
      const newImages = [...formData.images, ...files];
      setFormData({ ...formData, images: newImages });

      // Create previews for new images
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);

    // Remove from both arrays
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const handleRemoveFile = (type: "file" | "video") => {
    if (type === "file") {
      setFormData({ ...formData, fileMateri: null });
    } else if (type === "video") {
      setFormData({ ...formData, videoMateri: null });
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent, type: "file" | "video") => {
    e.preventDefault();
    if (type === "file") {
      setIsDraggingFile(true);
    } else {
      setIsDraggingVideo(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent, type: "file" | "video") => {
    e.preventDefault();
    if (type === "file") {
      setIsDraggingFile(false);
    } else {
      setIsDraggingVideo(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: "file" | "video") => {
    e.preventDefault();
    if (type === "file") {
      setIsDraggingFile(false);
    } else {
      setIsDraggingVideo(false);
    }

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (type === "file" && (file.type.includes("pdf") || file.type.includes("document"))) {
        setFormData({ ...formData, fileMateri: file });
      } else if (type === "video" && file.type.includes("video")) {
        setFormData({ ...formData, videoMateri: file });
      }
    }
  };

  const handleSubmit = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Clean up image previews
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

    router.push(`/guru/kelas/${kelasId}/materi`);
  };

  return (
    <div className="min-h-screen bg-white py-6 px-4 md:px-8">
      {/* Header Card - Compact and Aligned */}
      <div className="mx-auto mb-5 max-w-4xl">
        <div className="bg-[#336d82] text-white rounded-[20px] flex items-center px-5 py-4 gap-3">
          <button
            onClick={() => router.push(`/guru/kelas/${kelasId}/materi`)}
            className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Kembali"
          >
            <ArrowBackIosIcon
              sx={{ fontSize: { xs: 18, md: 20 }, color: "#336d82", ml: 1 }}
            />
          </button>
          <h1 className="text-[20px] md:text-[26px] lg:text-[28px] font-bold text-center flex-1">
            UPLOAD MATERI PEMBELAJARAN
          </h1>
        </div>
      </div>

      {/* Timeline - Responsive */}
      <div className="flex items-center justify-center gap-4 md:gap-6 mb-6 max-w-4xl mx-auto">
        {/* Step 1 */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-[60px] h-[60px] md:w-[70px] md:h-[70px] rounded-full flex items-center justify-center ${
              currentStep === 1
                ? "bg-[#336d82] text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            <CollectionsBookmarkIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
          </div>
          <span
            className={`text-[16px] md:text-[18px] font-semibold ${
              currentStep === 1 ? "text-[#336d82]" : "text-gray-400"
            }`}
          >
            Isi Materi
          </span>
        </div>

        {/* Connector Line */}
        <div className="w-[100px] md:w-[150px] h-[2px] bg-gray-300 -mt-8" />

        {/* Step 2 */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-[60px] h-[60px] md:w-[70px] md:h-[70px] rounded-full flex items-center justify-center ${
              currentStep === 2
                ? "bg-[#336d82] text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            <AutorenewIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
          </div>
          <span
            className={`text-[16px] md:text-[18px] font-semibold ${
              currentStep === 2 ? "text-[#336d82]" : "text-gray-400"
            }`}
          >
            Tinjau Materi
          </span>
        </div>
      </div>

      {/* Main Content */}
      {currentStep === 1 && (
        <div className="mx-auto max-w-5xl">
          {/* Dashed Border Container */}
          <div className="border-2 border-dashed border-[#336d82] rounded-[20px] p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Section 1: Isi Judul Materi */}
            <div className="bg-[#336d82] rounded-[20px] p-4 md:p-6">
              <h2 className="text-[20px] md:text-[22px] font-semibold text-white mb-3">
                Isi judul materi
              </h2>
              <input
                type="text"
                value={formData.judul}
                onChange={(e) =>
                  setFormData({ ...formData, judul: e.target.value })
                }
                placeholder="Ketik disini untuk menulis judul materi...."
                className="w-full px-4 py-2 md:py-3 rounded-[20px] text-[14px] italic border-none focus:outline-none focus:ring-2 focus:ring-white"
              />
              <div className="flex justify-end gap-2 md:gap-3 mt-3">
                <button
                  onClick={() => setFormData({ ...formData, judul: "" })}
                  className="bg-[#ff1919] text-white px-6 md:px-8 py-2 rounded-[20px] text-[12px] font-semibold hover:bg-red-600 transition-colors"
                >
                  Hapus
                </button>
                <button className="bg-[#2ea062] text-white px-6 md:px-8 py-2 rounded-[20px] text-[12px] font-semibold hover:bg-green-600 transition-colors">
                  Konfirmasi
                </button>
              </div>
            </div>

            {/* Section 2: Unggah File */}
            <div className="bg-[#336d82] rounded-[20px] p-4 md:p-6">
              <h2 className="text-[20px] md:text-[22px] font-semibold text-white mb-3">
                Unggah materi dalam bentuk file (Opsional)
              </h2>
              <div className="bg-white rounded-[10px] p-6 md:p-8 text-center">
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileSelect(e, "file")}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-block"
                >
                  <CloudUploadIcon
                    sx={{ fontSize: 48, color: "#999", mb: 2 }}
                  />
                  <div className="bg-[#d9d9d9] text-[#336d82] px-6 py-2 rounded-[10px] text-[12px] font-semibold hover:bg-gray-400 transition-colors inline-block">
                    Pilih file
                  </div>
                </label>
                {formData.fileMateri && (
                  <p className="mt-3 text-sm text-gray-700">
                    {formData.fileMateri.name}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 md:gap-3 mt-3">
                <button
                  onClick={() => handleRemoveFile("file")}
                  className="bg-[#ff1919] text-white px-6 md:px-8 py-2 rounded-[20px] text-[12px] font-semibold hover:bg-red-600 transition-colors"
                >
                  Hapus
                </button>
                <button className="bg-[#2ea062] text-white px-6 md:px-8 py-2 rounded-[20px] text-[12px] font-semibold hover:bg-green-600 transition-colors">
                  Konfirmasi
                </button>
              </div>
            </div>

            {/* Section 3: Unggah Video */}
            <div className="bg-[#336d82] rounded-[20px] p-4 md:p-6">
              <h2 className="text-[20px] md:text-[22px] font-semibold text-white mb-3">
                Unggah materi dalm bentuk video (Opsional)
              </h2>
              <div className="bg-white rounded-[10px] p-6 md:p-8 text-center">
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={(e) => handleFileSelect(e, "video")}
                  className="hidden"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer inline-block"
                >
                  <CloudUploadIcon
                    sx={{ fontSize: 48, color: "#999", mb: 2 }}
                  />
                  <div className="bg-[#d9d9d9] text-[#336d82] px-6 py-2 rounded-[10px] text-[12px] font-semibold hover:bg-gray-400 transition-colors inline-block">
                    Pilih file
                  </div>
                </label>
                {formData.videoMateri && (
                  <p className="mt-3 text-sm text-gray-700">
                    {formData.videoMateri.name}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 md:gap-3 mt-3">
                <button
                  onClick={() => handleRemoveFile("video")}
                  className="bg-[#ff1919] text-white px-6 md:px-8 py-2 rounded-[20px] text-[12px] font-semibold hover:bg-red-600 transition-colors"
                >
                  Hapus
                </button>
                <button className="bg-[#2ea062] text-white px-6 md:px-8 py-2 rounded-[20px] text-[12px] font-semibold hover:bg-green-600 transition-colors">
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Isi Penjelasan Materi (Outside dashed border) */}
          <div className="bg-[#336d82] rounded-[20px] p-4 md:p-6 mt-4 md:mt-6">
            <h2 className="text-[20px] md:text-[22px] font-semibold text-white mb-3">
              Isi penjelasan materi
            </h2>

            {/* Image Previews - Display above textarea */}
            {imagePreviews.length > 0 && (
              <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-white"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      aria-label="Hapus gambar"
                    >
                      <CloseIcon sx={{ fontSize: 18 }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              value={formData.penjelasan}
              onChange={(e) =>
                setFormData({ ...formData, penjelasan: e.target.value })
              }
              placeholder="Ketik disini untuk menulis materi...."
              className="w-full px-4 py-3 rounded-[20px] text-[14px] italic border-none focus:outline-none focus:ring-2 focus:ring-white resize-none"
              rows={3}
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-3">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
              <label htmlFor="image-upload">
                <button
                  type="button"
                  onClick={() => document.getElementById("image-upload")?.click()}
                  className="bg-[#fcc61d] text-white px-4 md:px-6 py-2 rounded-[20px] text-[12px] font-semibold hover:bg-yellow-600 transition-colors flex items-center gap-2"
                >
                  <AddPhotoAlternateIcon sx={{ fontSize: 18 }} />
                  Tambah Gambar
                </button>
              </label>
              <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setFormData({ ...formData, penjelasan: "", images: [] })}
                  className="flex-1 sm:flex-none bg-[#ff1919] text-white px-6 md:px-8 py-2 rounded-[20px] text-[12px] font-semibold hover:bg-red-600 transition-colors"
                >
                  Hapus
                </button>
                <button className="flex-1 sm:flex-none bg-[#2ea062] text-white px-6 md:px-8 py-2 rounded-[20px] text-[12px] font-semibold hover:bg-green-600 transition-colors">
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>

          {/* Lanjut Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-[#336d82] text-white px-16 md:px-24 lg:px-32 py-3 md:py-4 rounded-[20px] text-[20px] md:text-[22px] font-medium hover:bg-[#2a5a6d] transition-colors w-full max-w-2xl"
            >
              Lanjut
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="mx-auto max-w-5xl">
          <div className="bg-white rounded-[20px] border-2 border-[#336d82] p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-[#336d82]">
                Tinjau Materi
              </h2>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-[#336d82] hover:underline text-sm font-medium"
              >
                Edit
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Judul Materi
                </label>
                <p className="text-gray-900">{formData.judul || "-"}</p>
              </div>

              {formData.fileMateri && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    File Materi
                  </label>
                  <p className="text-gray-900">{formData.fileMateri.name}</p>
                </div>
              )}

              {formData.videoMateri && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Video Materi
                  </label>
                  <p className="text-gray-900">{formData.videoMateri.name}</p>
                </div>
              )}

              {formData.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Gambar ({formData.images.length})
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                    {imagePreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {formData.penjelasan && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Penjelasan Materi
                  </label>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {formData.penjelasan}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 mt-6 border-t">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 border-2 border-[#336d82] text-[#336d82] rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Kembali
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-[#336d82] text-white rounded-lg hover:bg-[#2a5a6d] transition-colors font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TambahMateriPage;
