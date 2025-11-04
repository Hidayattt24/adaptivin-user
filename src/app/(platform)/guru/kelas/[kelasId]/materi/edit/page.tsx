"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Autorenew, Add, Delete, Save } from "@mui/icons-material";
import {
  UploadTimeline,
  MainMateriTitle,
  MateriSection,
  MateriPageHeader,
  type MainMateriData,
  type MateriSectionData,
} from "@/components/guru";
import {
  useMateriDetail,
  useUpdateMateri,
  useUpdateSubMateri,
  useCreateSubMateri,
  useUploadMedia,
  useDeleteMedia,
} from "@/hooks/guru/useMateri";
import type { SubMateriMedia } from "@/lib/api/materi";
import Swal from "sweetalert2";

type MediaGroup = {
  pdf?: SubMateriMedia;
  video?: SubMateriMedia;
  images: SubMateriMedia[];
};

type EditSubSection = MateriSectionData & {
  dbId?: string;
  originalUrutan?: number;
  existingMedia: MediaGroup;
  removedMediaIds: string[];
};

type MainSubMeta = {
  dbId?: string;
  existingMedia: MediaGroup;
  removedMediaIds: string[];
};

const EditMateriPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const kelasId = params.kelasId as string;
  const materiId = searchParams.get("id") || "";

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Mutation hooks
  const updateMateriMutation = useUpdateMateri();
  const updateSubMateriMutation = useUpdateSubMateri();
  const createSubMateriMutation = useCreateSubMateri();
  const uploadMediaMutation = useUploadMedia();
  const deleteMediaMutation = useDeleteMedia();
  // A. MAIN MATERIAL TITLE (judul_materi parent)
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

  const [mainSubMeta, setMainSubMeta] = useState<MainSubMeta>({
    existingMedia: { images: [] },
    removedMediaIds: [],
  });

  // B. SUB-MATERIAL SECTIONS (dari database sub_materi)
  const [subSections, setSubSections] = useState<EditSubSection[]>([]);

  // Drag states for sub-sections
  const [activeDragSection, setActiveDragSection] = useState<string | null>(
    null
  );
  const [dragType, setDragType] = useState<"file" | "video" | null>(null);

  // Fetch data from API
  const { data: materiDetail } = useMateriDetail(materiId);

  // Load data into state
  useEffect(() => {
    if (!materiDetail) return;

    const subMateriList = materiDetail.sub_materi ?? [];
    const mainSub = subMateriList.find((sub) => sub.urutan === 0);
    const otherSubs = subMateriList
      .filter((sub) => sub.urutan !== 0)
      .sort((a, b) => a.urutan - b.urutan);

    const mainPdf = mainSub?.sub_materi_media?.find(
      (media) => media.tipe_media === "pdf"
    );
    const mainVideo = mainSub?.sub_materi_media?.find(
      (media) => media.tipe_media === "video"
    );
    const mainImages =
      mainSub?.sub_materi_media?.filter((media) => media.tipe_media === "gambar") || [];

    setMainMateri((prev) => ({
      ...prev,
      title: materiDetail.judul_materi,
      file: null,
      video: null,
      explanation: materiDetail.deskripsi || "",
      images: [],
      imagePreviews: mainImages.map((media) => media.url),
      confirmed: {
        title: false,
        file: false,
        video: false,
        explanation: false,
      },
    }));

    setMainSubMeta({
      dbId: mainSub?.id,
      existingMedia: {
        pdf: mainPdf,
        video: mainVideo,
        images: mainImages,
      },
      removedMediaIds: [],
    });

    const mappedSections: EditSubSection[] = otherSubs.map((sub) => {
      const pdfMedia = sub.sub_materi_media?.find((m) => m.tipe_media === "pdf");
      const videoMedia = sub.sub_materi_media?.find((m) => m.tipe_media === "video");
      const imageMedia =
        sub.sub_materi_media?.filter((m) => m.tipe_media === "gambar") || [];

      return {
        id: `section-${sub.id}`,
        dbId: sub.id,
        originalUrutan: sub.urutan,
        title: sub.judul_sub_materi,
        file: null,
        video: null,
        explanation: sub.isi_materi || "",
        images: [],
        imagePreviews: imageMedia.map((m) => m.url),
        confirmed: {
          title: false,
          file: false,
          video: false,
          explanation: false,
        },
        existingMedia: {
          pdf: pdfMedia,
          video: videoMedia,
          images: imageMedia,
        },
        removedMediaIds: [],
      };
    });

    setSubSections(mappedSections);
    setIsLoading(false);
  }, [materiDetail]);

  // ==================== MAIN MATERIAL HANDLERS ====================

  const handleMainFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "file" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "file" && mainSubMeta.existingMedia.pdf) {
        setMainSubMeta((prev) => {
          const media = prev.existingMedia.pdf;
          if (!media) return prev;
          return {
            ...prev,
            existingMedia: { ...prev.existingMedia, pdf: undefined },
            removedMediaIds: prev.removedMediaIds.includes(media.id)
              ? prev.removedMediaIds
              : [...prev.removedMediaIds, media.id],
          };
        });
      }
      if (type === "video" && mainSubMeta.existingMedia.video) {
        setMainSubMeta((prev) => {
          const media = prev.existingMedia.video;
          if (!media) return prev;
          return {
            ...prev,
            existingMedia: { ...prev.existingMedia, video: undefined },
            removedMediaIds: prev.removedMediaIds.includes(media.id)
              ? prev.removedMediaIds
              : [...prev.removedMediaIds, media.id],
          };
        });
      }

      setMainMateri((prev) => ({
        ...prev,
        [type === "file" ? "file" : "video"]: file,
        confirmed: {
          ...prev.confirmed,
          [type === "file" ? "file" : "video"]: false,
        },
      }));
    }
  };

  const handleMainImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));

      setMainMateri((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
        imagePreviews: [...prev.imagePreviews, ...newPreviews],
        confirmed: { ...prev.confirmed, explanation: false },
      }));
    }
  };

  const handleMainRemoveImage = (index: number) => {
    const existingCount = mainSubMeta.existingMedia.images.length;
    const isExisting = index < existingCount;
    const preview = mainMateri.imagePreviews[index];

    if (isExisting) {
      const target = mainSubMeta.existingMedia.images[index];
      setMainSubMeta((prev) => ({
        ...prev,
        existingMedia: {
          ...prev.existingMedia,
          images: prev.existingMedia.images.filter((img) => img.id !== target?.id),
        },
        removedMediaIds:
          target && !prev.removedMediaIds.includes(target.id)
            ? [...prev.removedMediaIds, target.id]
            : prev.removedMediaIds,
      }));
    } else {
      const blobIndex = index - existingCount;
      setMainMateri((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== blobIndex),
        imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
        confirmed: { ...prev.confirmed, explanation: false },
      }));
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      return;
    }

    setMainMateri((prev) => ({
      ...prev,
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
      confirmed: { ...prev.confirmed, explanation: false },
    }));
  };

  const handleMainDragOver = (
    e: React.DragEvent,
    type: "file" | "video"
  ) => {
    e.preventDefault();
    if (type === "file") setIsDraggingMainFile(true);
    else setIsDraggingMainVideo(true);
  };

  const handleMainDragLeave = (
    e: React.DragEvent,
    type: "file" | "video"
  ) => {
    e.preventDefault();
    if (type === "file") setIsDraggingMainFile(false);
    else setIsDraggingMainVideo(false);
  };

  const handleMainDrop = (e: React.DragEvent, type: "file" | "video") => {
    e.preventDefault();
    if (type === "file") setIsDraggingMainFile(false);
    else setIsDraggingMainVideo(false);

    const file = e.dataTransfer.files?.[0];
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

  // ==================== SUB-SECTION HANDLERS ====================

  const createNewSubSection = (): EditSubSection => ({
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
    existingMedia: {
      images: [],
    },
    removedMediaIds: [],
  });

  const handleAddSubSection = () => {
    setSubSections((prev) => [...prev, createNewSubSection()]);
  };

  const handleDeleteSubSection = (sectionId: string) => {
    const sectionToRemove = subSections.find((section) => section.id === sectionId);
    if (sectionToRemove) {
      const existingImageCount = sectionToRemove.existingMedia.images.length;
      sectionToRemove.imagePreviews.forEach((preview, index) => {
        if (index >= existingImageCount && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    }
    setSubSections((prev) => prev.filter((section) => section.id !== sectionId));
  };

  const handleUpdateSubSection = (
    sectionId: string,
    updatedSection: MateriSectionData
  ) => {
    setSubSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            ...updatedSection,
          }
          : section
      )
    );
  };

  const handleSubFileSelect = (
    sectionId: string,
    e: React.ChangeEvent<HTMLInputElement>,
    type: "file" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSubSections((prev) =>
        prev.map((section) => {
          if (section.id !== sectionId) return section;

          const isFile = type === "file";
          let updatedExisting = section.existingMedia;
          let updatedRemoved = section.removedMediaIds;

          if (isFile && section.existingMedia.pdf) {
            const media = section.existingMedia.pdf;
            updatedExisting = { ...updatedExisting, pdf: undefined };
            if (media && !updatedRemoved.includes(media.id)) {
              updatedRemoved = [...updatedRemoved, media.id];
            }
          }

          if (!isFile && section.existingMedia.video) {
            const media = section.existingMedia.video;
            updatedExisting = { ...updatedExisting, video: undefined };
            if (media && !updatedRemoved.includes(media.id)) {
              updatedRemoved = [...updatedRemoved, media.id];
            }
          }

          return {
            ...section,
            existingMedia: updatedExisting,
            removedMediaIds: updatedRemoved,
            [isFile ? "file" : "video"]: file,
            confirmed: {
              ...section.confirmed,
              [isFile ? "file" : "video"]: false,
            },
          };
        })
      );
    }
  };

  const handleSubImageSelect = (
    sectionId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));

      setSubSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? {
              ...section,
              images: [...section.images, ...files],
              imagePreviews: [...section.imagePreviews, ...newPreviews],
              confirmed: { ...section.confirmed, explanation: false },
            }
            : section
        )
      );
    }
  };

  const handleSubRemoveImage = (sectionId: string, imageIndex: number) => {
    setSubSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;

        const existingCount = section.existingMedia.images.length;
        const isExistingImage = imageIndex < existingCount;
        const newImagePreviews = section.imagePreviews.filter((_, i) => i !== imageIndex);
        let newImages = section.images;
        let newExistingMedia = section.existingMedia;
        let newRemoved = section.removedMediaIds;

        if (isExistingImage) {
          const target = section.existingMedia.images[imageIndex];
          newExistingMedia = {
            ...section.existingMedia,
            images: section.existingMedia.images.filter((img) => img.id !== target.id),
          };
          newRemoved = target ? [...section.removedMediaIds, target.id] : section.removedMediaIds;
        } else {
          const blobIndex = imageIndex - existingCount;
          newImages = section.images.filter((_, idx) => idx !== blobIndex);
          const preview = section.imagePreviews[imageIndex];
          if (preview?.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
          }
        }

        return {
          ...section,
          images: newImages,
          imagePreviews: newImagePreviews,
          existingMedia: newExistingMedia,
          removedMediaIds: newRemoved,
          confirmed: { ...section.confirmed, explanation: false },
        };
      })
    );
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

  const handleSubDragLeave = (
    e: React.DragEvent,
    type: "file" | "video"
  ) => {
    e.preventDefault();
    void type;
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
      setSubSections((prev) =>
        prev.map((section) => {
          if (section.id !== sectionId) return section;

          const isFile = type === "file";
          let updatedExisting = section.existingMedia;
          let updatedRemoved = section.removedMediaIds;

          if (isFile && section.existingMedia.pdf) {
            const media = section.existingMedia.pdf;
            updatedExisting = { ...updatedExisting, pdf: undefined };
            if (media && !updatedRemoved.includes(media.id)) {
              updatedRemoved = [...updatedRemoved, media.id];
            }
          }

          if (!isFile && section.existingMedia.video) {
            const media = section.existingMedia.video;
            updatedExisting = { ...updatedExisting, video: undefined };
            if (media && !updatedRemoved.includes(media.id)) {
              updatedRemoved = [...updatedRemoved, media.id];
            }
          }

          return {
            ...section,
            existingMedia: updatedExisting,
            removedMediaIds: updatedRemoved,
            [isFile ? "file" : "video"]: file,
            confirmed: {
              ...section.confirmed,
              [isFile ? "file" : "video"]: false,
            },
          };
        })
      );
    }
  };

  // ==================== SAVE HANDLERS ====================

  const inferMediaType = (file: File): "pdf" | "video" | "gambar" => {
    if (file.type.startsWith("image/")) return "gambar";
    if (file.type.startsWith("video/")) return "video";
    return "pdf";
  };

  const handleSave = async () => {
    // Validate main title
    if (!mainMateri.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan!",
        text: "⚠️ Judul materi utama wajib diisi!",
        confirmButtonColor: "#336d82",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Step 1: Update parent materi (title only)
      await updateMateriMutation.mutateAsync({
        materiId,
        data: {
          judul_materi: mainMateri.title,
          deskripsi: mainMateri.explanation ?? "",
        },
      });

      console.log("✅ Materi updated");

      // Step 2: Update or create main sub-materi (urutan 0)
      const mainSectionFiles: File[] = [];
      if (mainMateri.file) mainSectionFiles.push(mainMateri.file);
      if (mainMateri.video) mainSectionFiles.push(mainMateri.video);
      if (mainMateri.images.length > 0) mainSectionFiles.push(...mainMateri.images);

      // Hanya buat/update sub-materi jika ada files (BUKAN deskripsi, karena deskripsi disimpan di parent materi)
      const hasMainContent = mainSectionFiles.length > 0;

      if (mainSubMeta.dbId) {
        // Update existing main sub-materi
        // Note: isi_materi dikosongkan karena deskripsi sekarang disimpan di parent materi.deskripsi
        await updateSubMateriMutation.mutateAsync({
          subMateriId: mainSubMeta.dbId,
          data: {
            judul_sub_materi: mainMateri.title || "Materi Utama",
            isi_materi: "",
            urutan: 0,
          },
        });

        console.log("✅ Sub-materi utama diperbarui");

        // Delete removed media
        const uniqueRemoved = Array.from(new Set(mainSubMeta.removedMediaIds));
        for (const mediaId of uniqueRemoved) {
          await deleteMediaMutation.mutateAsync(mediaId);
        }

        // Upload new media
        const mainSubId = mainSubMeta.dbId;
        if (mainSubId) {
          if (mainMateri.file) {
            await uploadMediaMutation.mutateAsync({
              subMateriId: mainSubId,
              file: mainMateri.file,
              tipeMedia: inferMediaType(mainMateri.file),
            });
          }

          if (mainMateri.video) {
            await uploadMediaMutation.mutateAsync({
              subMateriId: mainSubId,
              file: mainMateri.video,
              tipeMedia: inferMediaType(mainMateri.video),
            });
          }

          if (mainMateri.images.length > 0) {
            for (const imageFile of mainMateri.images) {
              await uploadMediaMutation.mutateAsync({
                subMateriId: mainSubId,
                file: imageFile,
                tipeMedia: "gambar",
              });
            }
          }
        }
      } else if (hasMainContent) {
        // Only create if there's actual files (not explanation, as explanation is saved in parent materi.deskripsi)
        await createSubMateriMutation.mutateAsync({
          data: {
            materi_id: materiId,
            judul_sub_materi: mainMateri.title || "Materi Utama",
            isi_materi: "",
            urutan: 0,
          },
          files: mainSectionFiles.length > 0 ? mainSectionFiles : undefined,
        });

        console.log("✅ Sub-materi utama dibuat");
      }

      // Step 3: Update/Create sub_materi sections
      for (let i = 0; i < subSections.length; i++) {
        const section = subSections[i];
        const urutan = i + 1; // urutan 0 reserved for main materi

        // Collect files for this section
        const sectionFiles: File[] = [];
        if (section.file) sectionFiles.push(section.file);
        if (section.video) sectionFiles.push(section.video);
        if (section.images.length > 0) sectionFiles.push(...section.images);

        if (section.dbId) {
          // Update existing sub_materi
          await updateSubMateriMutation.mutateAsync({
            subMateriId: section.dbId,
            data: {
              judul_sub_materi: section.title || `Sub Materi ${i + 1}`,
              isi_materi: section.explanation ?? "",
              urutan,
            },
          });

          console.log(`✅ Sub-materi ${i + 1} updated`);

          const uniqueRemoved = Array.from(new Set(section.removedMediaIds));
          for (const mediaId of uniqueRemoved) {
            await deleteMediaMutation.mutateAsync(mediaId);
          }

          const targetSubId = section.dbId;
          if (targetSubId) {
            if (section.file) {
              await uploadMediaMutation.mutateAsync({
                subMateriId: targetSubId,
                file: section.file,
                tipeMedia: inferMediaType(section.file),
              });
            }

            if (section.video) {
              await uploadMediaMutation.mutateAsync({
                subMateriId: targetSubId,
                file: section.video,
                tipeMedia: inferMediaType(section.video),
              });
            }

            if (section.images.length > 0) {
              for (const imageFile of section.images) {
                await uploadMediaMutation.mutateAsync({
                  subMateriId: targetSubId,
                  file: imageFile,
                  tipeMedia: "gambar",
                });
              }
            }
          }
        } else {
          // Create new sub_materi
          await createSubMateriMutation.mutateAsync({
            data: {
              materi_id: materiId,
              judul_sub_materi: section.title || `Sub Materi ${i + 1}`,
              isi_materi: section.explanation ?? "",
              urutan,
            },
            files: sectionFiles.length > 0 ? sectionFiles : undefined,
          });

          console.log(`✅ Sub-materi ${i + 1} created`);
        }
      }

      // Clean up image previews
      mainMateri.imagePreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
      });
      subSections.forEach((section) => {
        section.imagePreviews.forEach((preview) => {
          if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
        });
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Materi berhasil diperbarui!",
        confirmButtonColor: "#336d82",
        timer: 2000,
      });
      router.push(`/guru/kelas/${kelasId}/materi`);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Gagal memperbarui materi";
      
        Swal.fire({
        icon: "error",
        title: "Error!",
        text: `❌ ${errorMsg}`,
        confirmButtonColor: "#336d82",
      });
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/guru/kelas/${kelasId}/materi`);
  };

  // ==================== RENDER ====================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Autorenew
            className="animate-spin text-[#336d82]"
            sx={{ fontSize: 48 }}
          />
          <p className="text-gray-600 font-poppins text-sm">
            Memuat data materi...
          </p>
        </div>
      </div>
    );
  }

  if (!materiId || !materiDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-poppins">Materi tidak ditemukan</p>
          <button
            onClick={handleBack}
            className="mt-4 px-6 py-2 bg-[#336d82] text-white rounded-lg hover:bg-[#2a5a6d] transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="py-6 px-4 sticky top-0 z-40 bg-gradient-to-br from-gray-50 to-white">
        <MateriPageHeader
          kelasId={kelasId}
          title="EDIT MATERI PEMBELAJARAN"
          onBack={handleBack}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-32">
        {/* Upload Timeline */}
        <div className="mb-8">
          <UploadTimeline currentStep={1} />
        </div>

        {/* A. MAIN MATERIAL TITLE */}
        <div className="mb-6">
          <MainMateriTitle
            materiData={mainMateri}
            onUpdate={setMainMateri}
            onFileSelect={handleMainFileSelect}
            onImageSelect={handleMainImageSelect}
            onRemoveImage={handleMainRemoveImage}
            onDragOver={handleMainDragOver}
            onDragLeave={handleMainDragLeave}
            onDrop={handleMainDrop}
            isDraggingFile={isDraggingMainFile}
            isDraggingVideo={isDraggingMainVideo}
            existingPdf={mainSubMeta.existingMedia.pdf}
            existingVideo={mainSubMeta.existingMedia.video}
          />
        </div>

        {/* Divider */}
        <div className="my-8 border-t-2 border-dashed border-gray-300"></div>

        {/* B. SUB-MATERIAL SECTIONS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 font-poppins">
              Sub Materi
            </h2>
            <button
              onClick={handleAddSubSection}
              className="px-4 py-2 bg-gradient-to-r from-[#fcc61d] to-[#f5b800] text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <Add sx={{ fontSize: 20 }} />
              Tambah Sub Materi
            </button>
          </div>

          {subSections.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500 font-poppins">
                Belum ada sub materi. Klik tombol di atas untuk menambahkan.
              </p>
            </div>
          )}

          {subSections.map((section, index) => (
            <div key={section.id}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-700 font-poppins">
                  Sub Materi {index + 1}
                </h3>
                <button
                  onClick={() => handleDeleteSubSection(section.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-red-600 transition-colors text-sm"
                >
                  <Delete sx={{ fontSize: 18 }} />
                  Hapus
                </button>
              </div>

              <MateriSection
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
                onDelete={() => handleDeleteSubSection(section.id)}
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
                onDragLeave={handleSubDragLeave}
                onDrop={(e, type) => handleSubDrop(section.id, e, type)}
                existingPdf={section.existingMedia?.pdf}
                existingVideo={section.existingMedia?.video}
              />

              {/* Divider between sections */}
              {index < subSections.length - 1 && (
                <div className="my-8 border-t-2 border-dashed border-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={isSaving}
            className="px-6 py-3 bg-gray-400 text-white rounded-xl font-semibold hover:bg-gray-500 transition-colors disabled:opacity-50 font-poppins"
          >
            Batal
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || !mainMateri.title.trim()}
            className="px-8 py-3 bg-gradient-to-r from-[#2ea062] to-[#26824f] text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-poppins"
          >
            {isSaving ? (
              <>
                <Autorenew className="animate-spin" sx={{ fontSize: 20 }} />
                Menyimpan...
              </>
            ) : (
              <>
                <Save sx={{ fontSize: 20 }} />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMateriPage;
