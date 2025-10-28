"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowBackIos,
  Autorenew,
  InsertDriveFile,
} from "@mui/icons-material";
import {
  UploadTimeline,
  FileUploadCard,
  TextInputSection,
  ImagePreviewCard,
} from "@/components/guru";

interface MateriFormData {
  judul: string;
  fileMateri: File | null;
  videoMateri: File | null;
  penjelasan: string;
  images: File[];
}

interface ConfirmationStates {
  judul: boolean;
  fileMateri: boolean;
  videoMateri: boolean;
  penjelasan: boolean;
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [confirmed, setConfirmed] = useState<ConfirmationStates>({
    judul: false,
    fileMateri: false,
    videoMateri: false,
    penjelasan: false,
  });

  // File upload handlers
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "file" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "file") {
        setFormData({ ...formData, fileMateri: file });
        setConfirmed({ ...confirmed, fileMateri: false });
      } else if (type === "video") {
        setFormData({ ...formData, videoMateri: file });
        setConfirmed({ ...confirmed, videoMateri: false });
      }
    }
  };

  const handleRemoveFile = (type: "file" | "video") => {
    if (type === "file") {
      setFormData({ ...formData, fileMateri: null });
      setConfirmed({ ...confirmed, fileMateri: false });
    } else if (type === "video") {
      setFormData({ ...formData, videoMateri: null });
      setConfirmed({ ...confirmed, videoMateri: false });
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent, type: "file" | "video") => {
    e.preventDefault();
    type === "file" ? setIsDraggingFile(true) : setIsDraggingVideo(true);
  };

  const handleDragLeave = (e: React.DragEvent, type: "file" | "video") => {
    e.preventDefault();
    type === "file" ? setIsDraggingFile(false) : setIsDraggingVideo(false);
  };

  const handleDrop = (e: React.DragEvent, type: "file" | "video") => {
    e.preventDefault();
    type === "file" ? setIsDraggingFile(false) : setIsDraggingVideo(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (
        type === "file" &&
        (file.type.includes("pdf") || file.type.includes("document"))
      ) {
        setFormData({ ...formData, fileMateri: file });
        setConfirmed({ ...confirmed, fileMateri: false });
      } else if (type === "video" && file.type.includes("video")) {
        setFormData({ ...formData, videoMateri: file });
        setConfirmed({ ...confirmed, videoMateri: false });
      }
    }
  };

  // Image handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = [...formData.images, ...files];
      setFormData({ ...formData, images: newImages });

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
      setConfirmed({ ...confirmed, penjelasan: false });
    }
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  // Confirmation handlers
  const handleConfirm = (field: keyof ConfirmationStates) => {
    setConfirmed({ ...confirmed, [field]: true });
  };

  const handleDelete = (field: keyof MateriFormData) => {
    if (field === "judul") {
      setFormData({ ...formData, judul: "" });
      setConfirmed({ ...confirmed, judul: false });
    } else if (field === "penjelasan") {
      setFormData({ ...formData, penjelasan: "", images: [] });
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      setImagePreviews([]);
      setConfirmed({ ...confirmed, penjelasan: false });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    router.push(`/guru/kelas/${kelasId}/materi`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f4f8] via-white to-[#f0f9fc] py-6 px-4 md:px-8">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#336d82]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#fcc61d]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header Card */}
        <div className="mx-auto mb-6 max-w-4xl">
          <div className="bg-gradient-to-r from-[#336d82] to-[#2a5a6d] text-white rounded-2xl flex items-center px-6 py-4 gap-4 shadow-xl hover:shadow-2xl transition-shadow">
            <button
              onClick={() => router.push(`/guru/kelas/${kelasId}/materi`)}
              className="w-[45px] h-[45px] bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 flex-shrink-0 shadow-md"
              aria-label="Kembali"
            >
              <ArrowBackIos sx={{ fontSize: 18, color: "#336d82", ml: 0.5 }} />
            </button>
            <h1 className="text-[20px] md:text-[24px] font-bold text-center flex-1 font-poppins tracking-wide">
              UPLOAD MATERI PEMBELAJARAN
            </h1>
          </div>
        </div>

        {/* Timeline */}
        <UploadTimeline currentStep={currentStep} />

        {/* Step 1: Form */}
        {currentStep === 1 && (
          <div className="mx-auto max-w-4xl">
            {/* Dashed Border Container */}
            <div className="border-2 border-dashed border-[#336d82]/40 rounded-2xl p-4 md:p-5 space-y-4 bg-white/50 backdrop-blur-sm shadow-lg">
              {/* Judul Materi */}
              <TextInputSection
                sectionNumber={1}
                title="Isi judul materi"
                value={formData.judul}
                placeholder="Ketik disini untuk menulis judul materi...."
                confirmed={confirmed.judul}
                onChange={(value) => {
                  setFormData({ ...formData, judul: value });
                  setConfirmed({ ...confirmed, judul: false });
                }}
                onDelete={() => handleDelete("judul")}
                onConfirm={() => handleConfirm("judul")}
              />

              {/* File Upload */}
              <FileUploadCard
                sectionNumber={2}
                title="Unggah materi dalam bentuk file (Opsional)"
                file={formData.fileMateri}
                accept=".pdf,.doc,.docx"
                formatHint="Format: PDF, DOC, DOCX"
                confirmed={confirmed.fileMateri}
                isDragging={isDraggingFile}
                onFileSelect={(e) => handleFileSelect(e, "file")}
                onRemove={() => handleRemoveFile("file")}
                onConfirm={() => handleConfirm("fileMateri")}
                onDragOver={(e) => handleDragOver(e, "file")}
                onDragLeave={(e) => handleDragLeave(e, "file")}
                onDrop={(e) => handleDrop(e, "file")}
                inputId="file-upload"
              />

              {/* Video Upload */}
              <FileUploadCard
                sectionNumber={3}
                title="Unggah materi dalam bentuk video (Opsional)"
                file={formData.videoMateri}
                accept="video/*"
                formatHint="Format: MP4, AVI, MOV"
                confirmed={confirmed.videoMateri}
                isDragging={isDraggingVideo}
                onFileSelect={(e) => handleFileSelect(e, "video")}
                onRemove={() => handleRemoveFile("video")}
                onConfirm={() => handleConfirm("videoMateri")}
                onDragOver={(e) => handleDragOver(e, "video")}
                onDragLeave={(e) => handleDragLeave(e, "video")}
                onDrop={(e) => handleDrop(e, "video")}
                inputId="video-upload"
              />
            </div>

            {/* Penjelasan Materi */}
            <div className="bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-xl p-5 mt-4 shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-[17px] md:text-[19px] font-semibold text-white mb-3 font-poppins flex items-center gap-2">
                <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">
                  4
                </span>
                Isi penjelasan materi
              </h2>

              <ImagePreviewCard
                previews={imagePreviews}
                onRemove={handleRemoveImage}
              />

              <textarea
                value={formData.penjelasan}
                onChange={(e) => {
                  setFormData({ ...formData, penjelasan: e.target.value });
                  setConfirmed({ ...confirmed, penjelasan: false });
                }}
                placeholder="Ketik disini untuk menulis materi...."
                className="w-full px-4 py-3 rounded-xl text-[14px] border-none focus:outline-none focus:ring-2 focus:ring-white/50 resize-none font-poppins shadow-inner bg-white text-gray-900"
                rows={5}
                disabled={confirmed.penjelasan}
              />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-3">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={confirmed.penjelasan}
                />
                <label htmlFor="image-upload">
                  <button
                    type="button"
                    onClick={() =>
                      !confirmed.penjelasan &&
                      document.getElementById("image-upload")?.click()
                    }
                    disabled={confirmed.penjelasan}
                    className={`px-5 py-2.5 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg ${
                      confirmed.penjelasan
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#fcc61d] to-[#f5b800] text-white hover:-translate-y-0.5"
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    Tambah Gambar
                  </button>
                </label>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleDelete("penjelasan")}
                    disabled={confirmed.penjelasan}
                    className={`flex-1 sm:flex-none px-7 py-2 rounded-xl text-[12px] font-semibold transition-all font-poppins shadow-md hover:shadow-lg ${
                      confirmed.penjelasan
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-[#ff1919] text-white hover:bg-[#e01515] hover:-translate-y-0.5"
                    }`}
                  >
                    Hapus
                  </button>
                  <button
                    onClick={() => handleConfirm("penjelasan")}
                    disabled={!formData.penjelasan || confirmed.penjelasan}
                    className={`flex-1 sm:flex-none px-7 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-2 font-poppins shadow-md hover:shadow-lg ${
                      confirmed.penjelasan
                        ? "bg-[#2ea062] text-white cursor-default"
                        : !formData.penjelasan
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-[#2ea062] text-white hover:bg-[#26824f] hover:-translate-y-0.5"
                    }`}
                  >
                    {confirmed.penjelasan && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    )}
                    Konfirmasi
                  </button>
                </div>
              </div>
            </div>

            {/* Lanjut Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-gradient-to-r from-[#336d82] to-[#2a5a6d] text-white px-24 md:px-36 py-3.5 rounded-xl text-[17px] md:text-[19px] font-semibold hover:from-[#2a5a6d] hover:to-[#1f4550] transition-all duration-300 w-full max-w-md font-poppins shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Lanjut
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review */}
        {currentStep === 2 && (
          <div className="mx-auto max-w-4xl">
            <div className="bg-white rounded-2xl border-2 border-[#336d82]/20 p-6 md:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
                <h2 className="text-xl md:text-2xl font-bold text-[#336d82] font-poppins flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-xl flex items-center justify-center text-white shadow-md">
                    <Autorenew sx={{ fontSize: 24 }} />
                  </div>
                  Tinjau Materi
                </h2>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-[#336d82] hover:bg-[#336d82]/10 px-4 py-2 rounded-lg text-sm font-medium font-poppins transition-all"
                >
                  ✏️ Edit
                </button>
              </div>

              <div className="space-y-5">
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-500 mb-2 font-poppins">
                    📝 Judul Materi
                  </label>
                  <p className="text-gray-900 font-poppins text-base">
                    {formData.judul || "-"}
                  </p>
                </div>

                {formData.fileMateri && (
                  <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                    <label className="block text-sm font-semibold text-gray-500 mb-2 font-poppins">
                      📄 File Materi
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                        <InsertDriveFile sx={{ fontSize: 22, color: "#666" }} />
                      </div>
                      <p className="text-gray-900 text-sm font-poppins">
                        {formData.fileMateri.name}
                      </p>
                    </div>
                  </div>
                )}

                {formData.videoMateri && (
                  <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                    <label className="block text-sm font-semibold text-gray-500 mb-2 font-poppins">
                      🎥 Video Materi
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                        <InsertDriveFile sx={{ fontSize: 22, color: "#666" }} />
                      </div>
                      <p className="text-gray-900 text-sm font-poppins">
                        {formData.videoMateri.name}
                      </p>
                    </div>
                  </div>
                )}

                {formData.penjelasan && (
                  <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                    <label className="block text-sm font-semibold text-gray-500 mb-2 font-poppins">
                      📖 Penjelasan Materi
                    </label>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm font-poppins leading-relaxed">
                      {formData.penjelasan}
                    </p>
                  </div>
                )}

                {imagePreviews.length > 0 && (
                  <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                    <label className="block text-sm font-semibold text-gray-500 mb-3 font-poppins">
                      🖼️ Gambar ({formData.images.length})
                    </label>
                    <div className="space-y-3">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl p-3 shadow-md border border-gray-200"
                        >
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-auto max-h-[350px] object-contain rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 mt-6 border-t-2 border-gray-100">
                <button
                  onClick={() => setCurrentStep(1)}
                  disabled={isSubmitting}
                  className="px-8 py-3 border-2 border-[#336d82] text-[#336d82] rounded-xl hover:bg-[#336d82]/5 transition-all font-semibold font-poppins disabled:opacity-50 shadow-md hover:shadow-lg"
                >
                  ← Kembali
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-10 py-3 bg-gradient-to-r from-[#336d82] to-[#2a5a6d] text-white rounded-xl hover:from-[#2a5a6d] hover:to-[#1f4550] transition-all font-semibold font-poppins disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Submit ✓"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TambahMateriPage;
