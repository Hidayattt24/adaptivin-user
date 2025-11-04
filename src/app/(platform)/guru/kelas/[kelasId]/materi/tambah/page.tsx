"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Autorenew,
  InsertDriveFile,
  Add,
} from "@mui/icons-material";
import {
  UploadTimeline,
  MainMateriTitle,
  MateriSection,
  MateriPageHeader,
  type MainMateriData,
  type MateriSectionData,
} from "@/components/guru";
import { useCreateMateri, useCreateSubMateri } from "@/hooks/guru/useMateri";
import Swal from "sweetalert2";

const TambahMateriPage = () => {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.kelasId as string;

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // A. MAIN MATERIAL TITLE (Always exists, cannot be deleted)
  const [mainMateri, setMainMateri] = useState<MainMateriData>({
    title: "",
    file: null,
    video: null,
    explanation: "",
    images: [],
    imagePreviews: [],
    confirmed: {
      title: false,
      file: false,
      video: false,
      explanation: false,
    },
  });

  // Drag states for main material
  const [isDraggingMainFile, setIsDraggingMainFile] = useState(false);
  const [isDraggingMainVideo, setIsDraggingMainVideo] = useState(false);

  // B. SUB-MATERIAL SECTIONS (Dynamic, can add/delete)
  const createNewSubSection = (): MateriSectionData => ({
    id: `section-${Date.now()}-${Math.random()}`,
    title: "",
    file: null,
    video: null,
    explanation: "",
    images: [],
    imagePreviews: [],
    confirmed: {
      title: false,
      file: false,
      video: false,
      explanation: false,
    },
  });

  const [subSections, setSubSections] = useState<MateriSectionData[]>([]);

  // Drag states for sub-sections
  const [activeDragSection, setActiveDragSection] = useState<string | null>(null);
  const [dragType, setDragType] = useState<"file" | "video" | null>(null);

  // ==================== MAIN MATERIAL HANDLERS ====================

  const handleMainFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "file" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainMateri({
        ...mainMateri,
        [type === "file" ? "file" : "video"]: file,
        confirmed: {
          ...mainMateri.confirmed,
          [type === "file" ? "file" : "video"]: false,
        },
      });
    }
  };

  const handleMainImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = [...mainMateri.images, ...files];
      const newPreviews = files.map((file) => URL.createObjectURL(file));

      setMainMateri({
        ...mainMateri,
        images: newImages,
        imagePreviews: [...mainMateri.imagePreviews, ...newPreviews],
        confirmed: { ...mainMateri.confirmed, explanation: false },
      });
    }
  };

  const handleMainRemoveImage = (index: number) => {
    URL.revokeObjectURL(mainMateri.imagePreviews[index]);
    setMainMateri({
      ...mainMateri,
      images: mainMateri.images.filter((_, i) => i !== index),
      imagePreviews: mainMateri.imagePreviews.filter((_, i) => i !== index),
    });
  };

  const handleMainDragOver = (e: React.DragEvent, type: "file" | "video") => {
    e.preventDefault();
    type === "file" ? setIsDraggingMainFile(true) : setIsDraggingMainVideo(true);
  };

  const handleMainDragLeave = (e: React.DragEvent, type: "file" | "video") => {
    e.preventDefault();
    type === "file" ? setIsDraggingMainFile(false) : setIsDraggingMainVideo(false);
  };

  const handleMainDrop = (e: React.DragEvent, type: "file" | "video") => {
    e.preventDefault();
    type === "file" ? setIsDraggingMainFile(false) : setIsDraggingMainVideo(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (
        type === "file" &&
        (file.type.includes("pdf") || file.type.includes("document"))
      ) {
        setMainMateri({
          ...mainMateri,
          file: file,
          confirmed: { ...mainMateri.confirmed, file: false },
        });
      } else if (type === "video" && file.type.includes("video")) {
        setMainMateri({
          ...mainMateri,
          video: file,
          confirmed: { ...mainMateri.confirmed, video: false },
        });
      }
    }
  };

  // ==================== SUB-SECTION HANDLERS ====================

  const handleAddSubSection = () => {
    setSubSections([...subSections, createNewSubSection()]);
  };

  const handleRemoveSubSection = (sectionId: string) => {
    const sectionToRemove = subSections.find((s) => s.id === sectionId);
    if (sectionToRemove) {
      sectionToRemove.imagePreviews.forEach((preview) =>
        URL.revokeObjectURL(preview)
      );
    }
    setSubSections(subSections.filter((s) => s.id !== sectionId));
  };

  const handleUpdateSubSection = (
    sectionId: string,
    updatedSection: MateriSectionData
  ) => {
    setSubSections(
      subSections.map((s) => (s.id === sectionId ? updatedSection : s))
    );
  };

  const handleSubFileSelect = (
    sectionId: string,
    e: React.ChangeEvent<HTMLInputElement>,
    type: "file" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const section = subSections.find((s) => s.id === sectionId);
      if (section) {
        const updatedSection = {
          ...section,
          [type === "file" ? "file" : "video"]: file,
          confirmed: {
            ...section.confirmed,
            [type === "file" ? "file" : "video"]: false,
          },
        };
        handleUpdateSubSection(sectionId, updatedSection);
      }
    }
  };

  const handleSubImageSelect = (
    sectionId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const section = subSections.find((s) => s.id === sectionId);
      if (section) {
        const newImages = [...section.images, ...files];
        const newPreviews = files.map((file) => URL.createObjectURL(file));

        const updatedSection = {
          ...section,
          images: newImages,
          imagePreviews: [...section.imagePreviews, ...newPreviews],
          confirmed: { ...section.confirmed, explanation: false },
        };
        handleUpdateSubSection(sectionId, updatedSection);
      }
    }
  };

  const handleSubRemoveImage = (sectionId: string, imageIndex: number) => {
    const section = subSections.find((s) => s.id === sectionId);
    if (section) {
      URL.revokeObjectURL(section.imagePreviews[imageIndex]);

      const updatedSection = {
        ...section,
        images: section.images.filter((_, i) => i !== imageIndex),
        imagePreviews: section.imagePreviews.filter((_, i) => i !== imageIndex),
      };
      handleUpdateSubSection(sectionId, updatedSection);
    }
  };

  const handleSubDragOver = (
    sectionId: string,
    e: React.DragEvent,
    type: "file" | "video"
  ) => {
    e.preventDefault();
    setActiveDragSection(sectionId);
    setDragType(type);
  };

  const handleSubDragLeave = (e: React.DragEvent, type: "file" | "video") => {
    e.preventDefault();
    setActiveDragSection(null);
    setDragType(null);
  };

  const handleSubDrop = (
    sectionId: string,
    e: React.DragEvent,
    type: "file" | "video"
  ) => {
    e.preventDefault();
    setActiveDragSection(null);
    setDragType(null);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const section = subSections.find((s) => s.id === sectionId);
      if (section) {
        if (
          type === "file" &&
          (file.type.includes("pdf") || file.type.includes("document"))
        ) {
          const updatedSection = {
            ...section,
            file: file,
            confirmed: { ...section.confirmed, file: false },
          };
          handleUpdateSubSection(sectionId, updatedSection);
        } else if (type === "video" && file.type.includes("video")) {
          const updatedSection = {
            ...section,
            video: file,
            confirmed: { ...section.confirmed, video: false },
          };
          handleUpdateSubSection(sectionId, updatedSection);
        }
      }
    }
  };

  // ==================== MUTATION HOOKS ====================
  const createMateriMutation = useCreateMateri();
  const createSubMateriMutation = useCreateSubMateri();

  // ==================== SUBMIT HANDLER ====================

  const handleSubmit = async () => {
    // Validate main title is filled
    if (!mainMateri.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan!",
        text: "⚠️ Judul materi utama wajib diisi!",
        confirmButtonColor: "#336d82",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create parent materi
      const deskripsiMateri = mainMateri.explanation || "Materi pembelajaran";
      const createdMateri = await createMateriMutation.mutateAsync({
        kelas_id: kelasId,
        judul_materi: mainMateri.title,
        deskripsi: deskripsiMateri,
      });

      // Step 2: Create main material as first sub_materi (urutan 0)
      // HANYA jika ada file/video/gambar yang di-upload
      // Deskripsi TIDAK termasuk karena sudah disimpan di parent materi.deskripsi
      const mainFiles: File[] = [];
      if (mainMateri.file) mainFiles.push(mainMateri.file);
      if (mainMateri.video) mainFiles.push(mainMateri.video);
      if (mainMateri.images.length > 0) mainFiles.push(...mainMateri.images);

      if (mainFiles.length > 0) {
        await createSubMateriMutation.mutateAsync({
          data: {
            materi_id: createdMateri.id,
            judul_sub_materi: mainMateri.title,
            isi_materi: "", // Kosong karena deskripsi ada di parent
            urutan: 0,
          },
          files: mainFiles,
        });
      }

      // Step 3: Create sub-sections as sub_materi (urutan 1, 2, 3...)
      for (let i = 0; i < subSections.length; i++) {
        const section = subSections[i];

        // Collect files for this section
        const sectionFiles: File[] = [];
        if (section.file) sectionFiles.push(section.file);
        if (section.video) sectionFiles.push(section.video);
        if (section.images.length > 0) sectionFiles.push(...section.images);

        await createSubMateriMutation.mutateAsync({
          data: {
            materi_id: createdMateri.id,
            judul_sub_materi: section.title || `Sub Materi ${i + 1}`,
            isi_materi: section.explanation ?? "",
            urutan: i + 1,
          },
          files: sectionFiles.length > 0 ? sectionFiles : undefined,
        });
      }

      // Clean up all image previews
      mainMateri.imagePreviews.forEach((preview) =>
        URL.revokeObjectURL(preview)
      );
      subSections.forEach((section) => {
        section.imagePreviews.forEach((preview) =>
          URL.revokeObjectURL(preview)
        );
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Materi berhasil dibuat!",
        confirmButtonColor: "#336d82",
        timer: 2000,
      });
      router.push(`/guru/kelas/${kelasId}/materi`);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Gagal membuat materi";

      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: errorMsg,
        confirmButtonColor: "#336d82",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f4f8] via-white to-[#f0f9fc] py-4 sm:py-5 md:py-6 px-3 sm:px-4 md:px-8 pb-24 md:pb-8">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#336d82]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#fcc61d]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header Card */}
        <MateriPageHeader
          kelasId={kelasId}
          title="BUAT MATERI PEMBELAJARAN"
        />

        {/* Timeline */}
        <UploadTimeline currentStep={currentStep} />

        {/* Step 1: Form */}
        {currentStep === 1 && (
          <div className="mx-auto max-w-4xl space-y-4 sm:space-y-5 md:space-y-6">
            {/* Info Banner */}
            <div className="bg-gradient-to-r from-[#336d82]/10 to-[#2a5a6d]/10 border-l-4 border-[#336d82] rounded-lg p-3 sm:p-4 shadow-sm">
              <p className="text-xs sm:text-sm text-gray-800 font-poppins leading-relaxed">
                <strong className="text-[#336d82]">ℹ️ Cara Kerja:</strong>
                <br />
                1. Isi <strong>Judul Materi Utama</strong> (wajib) - Contoh: &quot;Pecahan&quot;
                <br />
                2. Tambahkan <strong>Sub-Materi</strong> (opsional) - Contoh: &quot;Pecahan Biasa&quot;, &quot;Pecahan Campuran&quot;
              </p>
            </div>

            {/* A. MAIN MATERIAL TITLE */}
            <MainMateriTitle
              materiData={mainMateri}
              isDraggingFile={isDraggingMainFile}
              isDraggingVideo={isDraggingMainVideo}
              onUpdate={setMainMateri}
              onFileSelect={handleMainFileSelect}
              onImageSelect={handleMainImageSelect}
              onRemoveImage={handleMainRemoveImage}
              onDragOver={handleMainDragOver}
              onDragLeave={handleMainDragLeave}
              onDrop={handleMainDrop}
            />

            {/* B. SUB-MATERIAL SECTIONS */}
            {subSections.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#336d82]/30 to-transparent"></div>
                  <span className="text-xs sm:text-sm font-semibold text-[#336d82] font-poppins px-2 sm:px-3 py-1 bg-white rounded-full shadow-sm border border-[#336d82]/20 whitespace-nowrap">
                    📖 Sub-Materi ({subSections.length})
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#336d82]/30 to-transparent"></div>
                </div>

                {subSections.map((section, index) => (
                  <MateriSection
                    key={section.id}
                    section={section}
                    sectionIndex={index}
                    totalSections={subSections.length}
                    isDraggingFile={
                      activeDragSection === section.id && dragType === "file"
                    }
                    isDraggingVideo={
                      activeDragSection === section.id && dragType === "video"
                    }
                    onUpdate={(updated) =>
                      handleUpdateSubSection(section.id, updated)
                    }
                    onDelete={() => handleRemoveSubSection(section.id)}
                    onFileSelect={(e, type) =>
                      handleSubFileSelect(section.id, e, type)
                    }
                    onImageSelect={(e) => handleSubImageSelect(section.id, e)}
                    onRemoveImage={(imgIndex) =>
                      handleSubRemoveImage(section.id, imgIndex)
                    }
                    onDragOver={(e, type) =>
                      handleSubDragOver(section.id, e, type)
                    }
                    onDragLeave={(e, type) => handleSubDragLeave(e, type)}
                    onDrop={(e, type) => handleSubDrop(section.id, e, type)}
                  />
                ))}
              </div>
            )}

            {/* Add Sub-Section Button */}
            <div className="flex justify-center pt-3 sm:pt-4">
              <button
                onClick={handleAddSubSection}
                className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-dashed border-[#fcc61d] text-[#336d82] rounded-lg sm:rounded-xl hover:bg-[#fcc61d]/5 hover:border-solid transition-all font-semibold font-poppins shadow-md hover:shadow-lg group text-sm sm:text-base"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#fcc61d] to-[#f5b800] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md flex-shrink-0">
                  <Add sx={{ fontSize: { xs: 18, sm: 20 }, color: "white" }} />
                </div>
                Tambah Sub-Materi
              </button>
            </div>

            {/* Lanjut Button */}
            <div className="flex justify-center pt-4 sm:pt-5 md:pt-6">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!mainMateri.title.trim()}
                className="bg-gradient-to-r from-[#336d82] to-[#2a5a6d] text-white px-8 sm:px-16 md:px-24 lg:px-36 py-3 sm:py-3.5 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-[17px] lg:text-[19px] font-semibold hover:from-[#2a5a6d] hover:to-[#1f4550] transition-all duration-300 w-full sm:max-w-sm md:max-w-md font-poppins shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lanjut ke Tinjau
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review */}
        {currentStep === 2 && (
          <div className="mx-auto max-w-4xl">
            <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-[#336d82]/20 p-4 sm:p-5 md:p-6 lg:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 md:mb-6 pb-3 sm:pb-4 border-b-2 border-gray-100 gap-3 sm:gap-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#336d82] font-poppins flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-md">
                    <Autorenew sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
                  </div>
                  Tinjau Materi
                </h2>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-[#336d82] hover:bg-[#336d82]/10 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium font-poppins transition-all w-full sm:w-auto"
                >
                  ✏️ Edit
                </button>
              </div>

              {/* Main Material Review */}
              <div className="border-2 border-[#336d82] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 bg-gradient-to-br from-[#336d82]/5 to-white mb-4 sm:mb-5 md:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b-2 border-[#336d82]/20">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-white font-bold text-base sm:text-lg">📚</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#336d82] font-poppins truncate">
                      {mainMateri.title || "Materi Utama"}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-600 font-poppins">
                      Topik Utama Pembelajaran
                    </p>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {mainMateri.file && (
                    <div className="bg-white p-2 sm:p-3 rounded-lg border border-gray-100">
                      <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1 font-poppins">
                        📄 File
                      </label>
                      <div className="flex items-center gap-2">
                        <InsertDriveFile sx={{ fontSize: { xs: 16, sm: 18 }, color: "#666" }} />
                        <p className="text-gray-900 text-[10px] sm:text-xs font-poppins truncate">
                          {mainMateri.file.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {mainMateri.video && (
                    <div className="bg-white p-2 sm:p-3 rounded-lg border border-gray-100">
                      <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1 font-poppins">
                        🎥 Video
                      </label>
                      <div className="flex items-center gap-2">
                        <InsertDriveFile sx={{ fontSize: { xs: 16, sm: 18 }, color: "#666" }} />
                        <p className="text-gray-900 text-[10px] sm:text-xs font-poppins truncate">
                          {mainMateri.video.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {mainMateri.explanation && (
                    <div className="bg-white p-2 sm:p-3 rounded-lg border border-gray-100">
                      <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-1 font-poppins">
                        📖 Penjelasan
                      </label>
                      <p className="text-gray-700 whitespace-pre-wrap text-[10px] sm:text-xs font-poppins leading-relaxed">
                        {mainMateri.explanation}
                      </p>
                    </div>
                  )}

                  {mainMateri.imagePreviews.length > 0 && (
                    <div className="bg-white p-2 sm:p-3 rounded-lg border border-gray-100">
                      <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 mb-2 font-poppins">
                        🖼️ Gambar ({mainMateri.images.length})
                      </label>
                      <div className="space-y-2">
                        {mainMateri.imagePreviews.map((preview, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={preview}
                            alt={`Preview ${imgIndex + 1}`}
                            className="w-full h-auto max-h-[150px] sm:max-h-[200px] object-contain rounded-lg border border-gray-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sub-Sections Review */}
              {subSections.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#336d82]/30 to-transparent"></div>
                    <span className="text-xs sm:text-sm font-semibold text-[#336d82] font-poppins whitespace-nowrap">
                      Sub-Materi ({subSections.length})
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#336d82]/30 to-transparent"></div>
                  </div>

                  {subSections.map((section, index) => (
                    <div
                      key={section.id}
                      className="border-2 border-dashed border-[#336d82]/30 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white/70"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 pb-2 border-b border-gray-200">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#fcc61d] to-[#f5b800] rounded-lg flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0">
                          <span className="text-xs sm:text-sm">{index + 1}</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-[#336d82] font-poppins truncate flex-1 min-w-0">
                          {section.title || `Sub-Materi ${index + 1}`}
                        </h4>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
                        {section.file && (
                          <div className="flex items-center gap-2">
                            <InsertDriveFile sx={{ fontSize: { xs: 14, sm: 16 } }} />
                            <span className="font-poppins truncate">{section.file.name}</span>
                          </div>
                        )}
                        {section.video && (
                          <div className="flex items-center gap-2">
                            <InsertDriveFile sx={{ fontSize: { xs: 14, sm: 16 } }} />
                            <span className="font-poppins truncate">{section.video.name}</span>
                          </div>
                        )}
                        {section.explanation && (
                          <p className="text-gray-700 font-poppins line-clamp-3">
                            {section.explanation}
                          </p>
                        )}
                        {section.imagePreviews.length > 0 && (
                          <p className="text-gray-600 font-poppins">
                            🖼️ {section.images.length} gambar
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 pt-4 sm:pt-5 md:pt-6 mt-4 sm:mt-5 md:mt-6 border-t-2 border-gray-100">
                <button
                  onClick={() => setCurrentStep(1)}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-[#336d82] text-[#336d82] rounded-lg sm:rounded-xl hover:bg-[#336d82]/5 transition-all text-sm sm:text-base font-semibold font-poppins disabled:opacity-50 shadow-md hover:shadow-lg"
                >
                  ← Kembali
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 sm:px-10 py-2.5 sm:py-3 bg-gradient-to-r from-[#336d82] to-[#2a5a6d] text-white rounded-lg sm:rounded-xl hover:from-[#2a5a6d] hover:to-[#1f4550] transition-all text-sm sm:text-base font-semibold font-poppins disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs sm:text-sm md:text-base">Menyimpan...</span>
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
