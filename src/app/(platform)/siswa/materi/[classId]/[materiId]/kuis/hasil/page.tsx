"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, X, Sparkles } from "lucide-react";
import Image from "next/image";
import { getJawabanByHasilKuis, DetailJawabanSiswa } from "@/lib/api/jawaban";
import {
  checkAnalisisStatus,
  getAnalisisByHasilKuis,
  deleteAnalisis,
  AnalisisAI,
  AnalisisStatus,
} from "@/lib/api/analisis";
import {
  AnalisisAISection,
  AnalisisAIButton,
} from "@/components/siswa/kuis/AnalisisAISection";
import { getMateriById } from "@/lib/api/materi";
import CircularProgress from "@/components/siswa/kuis/CircularProgress";
import QuizResultItem from "@/components/siswa/kuis/QuizResultItem";

interface JawabanObject {
  id: string;
  isi_jawaban: string;
  is_benar: boolean;
}

// Extended interface untuk response backend yang menyertakan informasi tambahan
interface DetailJawabanSiswaExtended extends DetailJawabanSiswa {
  all_jawaban?: Array<{
    id: string;
    isi_jawaban: string;
    is_benar: boolean;
  }>;
  jawaban_siswa_object?:
    | Array<{ id: string; isi_jawaban: string; is_benar: boolean }>
    | { id: string; isi_jawaban: string; is_benar: boolean }
    | null;
}

interface JawabanDetail {
  id: string;
  soal_id: string;
  jawaban_id: string | null;
  jawaban_siswa_text: string;
  benar: boolean;
  waktu_dijawab: number;
  level_soal: string;
  soal: {
    id: string;
    soal_teks: string;
    soal_gambar: string | null;
    level_soal: string;
    durasi_soal: number;
    tipe_jawaban: string;
  };
  all_jawaban: Array<{
    id: string;
    isi_jawaban: string;
    is_benar: boolean;
  }>;
  jawaban_siswa_object:
    | Array<{ id: string; isi_jawaban: string; is_benar: boolean }>
    | { id: string; isi_jawaban: string; is_benar: boolean }
    | null;
}

/**
 * Quiz Result Page - Adaptive Quiz
 *
 * Halaman hasil kuis setelah siswa menyelesaikan kuis adaptif
 * - Menampilkan summary (total soal, benar, skor)
 * - Riwayat semua soal yang dijawab (benar/salah)
 * - Tampilkan jawaban siswa vs jawaban benar
 * - Support semua tipe soal (isian_singkat, pilihan_ganda, pilihan_ganda_kompleks)
 * - Tombol kembali ke materi
 *
 * Query params:
 * - hasilKuisId: ID hasil kuis dari database
 */

export default function HasilKuisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const hasilKuisId = searchParams.get("hasilKuisId");
  const classId = params.classId as string;
  const materiId = params.materiId as string;

  const [loading, setLoading] = useState(true);
  const [riwayat, setRiwayat] = useState<JawabanDetail[]>([]);
  const [totalBenar, setTotalBenar] = useState(0);
  const [totalSoal, setTotalSoal] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [materiNama, setMateriNama] = useState("Materi");
  const [selectedQuestion, setSelectedQuestion] =
    useState<JawabanDetail | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // State untuk analisis AI
  const [analisisStatus, setAnalisisStatus] = useState<AnalisisStatus | null>(
    null
  );
  const [analisisData, setAnalisisData] = useState<AnalisisAI | null>(null);
  const [loadingAnalisis, setLoadingAnalisis] = useState(false);

  // Fetch materi info
  useEffect(() => {
    if (materiId) {
      getMateriById(materiId)
        .then((data) => {
          if (data) {
            setMateriNama(data.judul_materi);
          }
        })
        .catch((err) => console.error("Error fetching materi:", err));
    }
  }, [materiId]);

  const handleClose = () => {
    router.push(`/siswa/materi/${classId}/${materiId}`);
  };

  const handleInfoClick = (item: JawabanDetail) => {
    setSelectedQuestion(item);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedQuestion(null);
  };

  const fetchRiwayatKuis = useCallback(async () => {
    if (!hasilKuisId) return;

    try {
      // Gunakan API function dari lib/api/jawaban.ts
      const data = await getJawabanByHasilKuis(hasilKuisId);

      console.log("Raw data from API:", data);

      // Transform data jika diperlukan
      const transformedData = (data as DetailJawabanSiswaExtended[]).map(
        (item) => {
          console.log("Transforming item:", item);
          console.log("soal object:", item.soal);

          return {
            id: item.id,
            soal_id: item.soal_id,
            jawaban_id: item.jawaban_id || null,
            jawaban_siswa_text: item.jawaban_siswa || "",
            benar: item.benar,
            waktu_dijawab: item.waktu_dijawab,
            level_soal: item.level_soal,
            soal: {
              id: item.soal?.id || item.soal_id,
              soal_teks: item.soal?.soal_teks || "",
              soal_gambar: item.soal?.soal_gambar || null,
              level_soal: item.level_soal,
              durasi_soal: item.soal?.durasi_soal || 0,
              tipe_jawaban: item.tipe_jawaban || "pilihan_ganda",
            },
            all_jawaban: item.all_jawaban || [],
            jawaban_siswa_object: item.jawaban_siswa_object || null,
          };
        }
      );

      console.log("Transformed data:", transformedData);

      setRiwayat(transformedData);
      setTotalSoal(transformedData.length);
      setTotalBenar(
        transformedData.filter((item: JawabanDetail) => item.benar).length
      );
    } catch (error) {
      console.error("Error fetching riwayat kuis:", error);
      // Fallback ke method lama jika API function gagal
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `http://localhost:5000/api/jawaban/${hasilKuisId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseData = await response.json();

        if (responseData.success) {
          setRiwayat(responseData.data);
          setTotalSoal(responseData.data.length);
          setTotalBenar(
            responseData.data.filter((item: JawabanDetail) => item.benar).length
          );
        }
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  }, [hasilKuisId]);

  // Function untuk cek dan load analisis
  const checkAndLoadAnalisis = useCallback(async () => {
    if (!hasilKuisId) return;

    try {
      setLoadingAnalisis(true);

      // Cek status analisis
      const status = await checkAnalisisStatus(hasilKuisId);
      console.log("=== CHECK ANALISIS STATUS ===");
      console.log("Status analisis:", status);
      console.log("is_analyzed:", status.is_analyzed);
      console.log("analisis_id:", status.analisis_id);
      setAnalisisStatus(status);

      // Jika sudah ada analisis, load data analisis
      if (status.is_analyzed && status.analisis_id) {
        console.log("=== LOADING ANALISIS DATA ===");
        console.log("Analisis ID:", status.analisis_id);
        const analisis = await getAnalisisByHasilKuis(hasilKuisId);
        console.log("Analisis data loaded:", analisis);
        console.log("Analisis fields:", {
          id: analisis.id,
          analisis: analisis.analisis,
          kelebihan: analisis.kelebihan,
          kelemahan: analisis.kelemahan,
          level_tertinggi: analisis.level_tertinggi,
          level_terendah: analisis.level_terendah,
        });
        setAnalisisData(analisis);
        console.log("=== ANALISIS STATE UPDATED ===");
      } else {
        console.log("=== NO ANALISIS FOUND ===");
        setAnalisisData(null);
      }
    } catch (error) {
      console.error("Error checking analisis:", error);
    } finally {
      setLoadingAnalisis(false);
    }
  }, [hasilKuisId]);

  useEffect(() => {
    if (!hasilKuisId) {
      router.push("/siswa/materi");
      return;
    }

    fetchRiwayatKuis();
    checkAndLoadAnalisis();
  }, [hasilKuisId, router, fetchRiwayatKuis, checkAndLoadAnalisis]);

  // Handler ketika analisis berhasil dibuat atau diupdate
  const handleAnalysisComplete = (analisis: AnalisisAI) => {
    console.log("Analysis complete, updating state:", analisis);
    setAnalisisData(analisis);
    setAnalisisStatus({
      hasil_kuis_id: hasilKuisId || "",
      is_analyzed: true,
      analisis_id: analisis.id,
      is_completed: true,
    });

    // Scroll ke analisis
    setTimeout(() => {
      const analisisElement = document.getElementById("analisis-section");
      if (analisisElement) {
        analisisElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Handler untuk re-analyze
  const handleReAnalyze = async () => {
    if (!analisisData?.id) return;

    try {
      // 1. Delete analisis lama
      await deleteAnalisis(analisisData.id);

      // 2. Reset state - analisis sudah dihapus
      setAnalisisData(null);
      setAnalisisStatus((prev) => ({
        ...prev!,
        is_analyzed: false,
        analisis_id: null,
      }));

      console.log(
        "Analisis lama berhasil dihapus. Silakan klik tombol 'Analisis dengan AI' untuk analisis ulang."
      );
    } catch (error) {
      console.error("Error deleting analysis:", error);
      alert("Gagal menghapus analisis lama. Silakan coba lagi.");
      throw error;
    }
  };

  const handleKembaliKeMateri = () => {
    router.push(`/siswa/materi/${classId}/${materiId}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderJawabanSiswa = (item: JawabanDetail) => {
    const { soal, jawaban_siswa_object, all_jawaban, jawaban_siswa_text } =
      item;

    if (soal.tipe_jawaban === "isian_singkat") {
      // Tampilkan jawaban text siswa
      return (
        <div className="space-y-2">
          <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Jawaban Kamu:
            </p>
            <p className="text-base text-blue-800 dark:text-blue-200 mt-1">
              {jawaban_siswa_text}
            </p>
          </div>

          {!item.benar && all_jawaban.length > 0 && (
            <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg border-l-4 border-green-500">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Jawaban Benar:
              </p>
              <p className="text-base text-green-800 dark:text-green-200 mt-1">
                {all_jawaban.find((j) => j.is_benar)?.isi_jawaban}
              </p>
            </div>
          )}
        </div>
      );
    }

    if (soal.tipe_jawaban === "pilihan_ganda_kompleks") {
      // Multiple choice - show selected vs correct
      const selectedIds = Array.isArray(jawaban_siswa_object)
        ? jawaban_siswa_object.map((j: JawabanObject) => j.id)
        : [];

      return (
        <div className="space-y-2">
          {all_jawaban.map((jawaban) => {
            const isSelected = selectedIds.includes(jawaban.id);
            const isCorrect = jawaban.is_benar;

            let bgColor = "bg-gray-50 dark:bg-gray-900";
            let borderColor = "border-gray-200 dark:border-gray-700";
            let icon = null;
            let statusText = null;

            if (isSelected && isCorrect) {
              // Dipilih dan benar ✅ (hijau)
              bgColor = "bg-green-50 dark:bg-green-950/30";
              borderColor = "border-green-500";
              icon = (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              );
              statusText = (
                <p className="text-xs text-green-600 mt-1">✓ Benar dipilih</p>
              );
            } else if (!isSelected && isCorrect) {
              // Tidak dipilih tapi seharusnya dipilih 🟡 (kuning - terlewat)
              bgColor = "bg-yellow-50 dark:bg-yellow-950/30";
              borderColor = "border-yellow-500";
              icon = (
                <CheckCircle2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              );
              statusText = (
                <p className="text-xs text-yellow-600 mt-1">
                  ⚠ Harusnya dipilih
                </p>
              );
            } else if (isSelected && !isCorrect) {
              // Dipilih tapi salah ❌ (merah)
              bgColor = "bg-red-50 dark:bg-red-950/30";
              borderColor = "border-red-500";
              icon = (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              );
              statusText = (
                <p className="text-xs text-red-600 mt-1">
                  ✗ Tidak perlu dipilih
                </p>
              );
            } else {
              // Tidak dipilih dan memang salah (abu-abu - benar tidak dipilih)
              bgColor = "bg-gray-50 dark:bg-gray-900";
              borderColor = "border-gray-200 dark:border-gray-700";
              icon = (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
              );
            }

            return (
              <div
                key={jawaban.id}
                className={`p-3 rounded-lg border-2 ${borderColor} ${bgColor}`}
              >
                <div className="flex items-start gap-3">
                  {icon}
                  <div className="flex-1">
                    <p className="text-sm">{jawaban.isi_jawaban}</p>
                    {statusText}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // pilihan_ganda (single choice)
    const selectedId =
      typeof jawaban_siswa_object === "object" &&
      jawaban_siswa_object !== null &&
      !Array.isArray(jawaban_siswa_object)
        ? jawaban_siswa_object.id
        : item.jawaban_id;

    return (
      <div className="space-y-2">
        {all_jawaban.map((jawaban) => {
          const isSelected = jawaban.id === selectedId;
          const isCorrect = jawaban.is_benar;

          let bgColor = "bg-gray-50 dark:bg-gray-900";
          let borderColor = "border-gray-200 dark:border-gray-700";
          let icon = null;

          if (isSelected && isCorrect) {
            bgColor = "bg-green-50 dark:bg-green-950/30";
            borderColor = "border-green-500";
            icon = <CheckCircle2 className="w-5 h-5 text-green-600" />;
          } else if (isSelected && !isCorrect) {
            bgColor = "bg-red-50 dark:bg-red-950/30";
            borderColor = "border-red-500";
            icon = <XCircle className="w-5 h-5 text-red-600" />;
          } else if (!isSelected && isCorrect) {
            bgColor = "bg-yellow-50 dark:bg-yellow-950/30";
            borderColor = "border-yellow-500";
            icon = <CheckCircle2 className="w-5 h-5 text-yellow-600" />;
          }

          return (
            <div
              key={jawaban.id}
              className={`p-3 rounded-lg border-2 ${borderColor} ${bgColor}`}
            >
              <div className="flex items-start gap-3">
                {icon}
                <div className="flex-1">
                  <p className="text-sm">{jawaban.isi_jawaban}</p>
                  {!isSelected && isCorrect && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Jawaban yang benar
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#336D82] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat hasil kuis...</p>
        </div>
      </div>
    );
  }

  const skor = totalSoal > 0 ? Math.round((totalBenar / totalSoal) * 100) : 0;

  return (
    <div className="relative w-full min-h-screen bg-white overflow-x-hidden pb-8 md:pb-12">
      {/* Content Container - Desktop Centered */}
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-8 pt-8 md:pt-12 pb-4 md:pb-6">
          <h1 className="text-[#336D82] text-[20px] md:text-3xl font-semibold">
            Riview Jawaban
          </h1>
          <button
            onClick={handleClose}
            className="w-[42px] h-[42px] md:w-[52px] md:h-[52px] bg-[#336D82] rounded-full flex items-center justify-center hover:bg-[#2a5868] active:scale-95 transition-all shadow-lg"
          >
            <span className="material-symbols-outlined text-white text-[24px] md:text-[28px]">
              close
            </span>
          </button>
        </div>

        {/* Summary Card */}
        <div className="px-6 md:px-8 mb-6 md:mb-8">
          <div
            className="rounded-[20px] md:rounded-[30px] p-6 md:p-8 shadow-xl"
            style={{
              background: "linear-gradient(180deg, #336D82 0%, #7AB0C4 100%)",
            }}
          >
            {/* Materi Info */}
            <div className="mb-4 md:mb-6">
              <p className="text-white text-[14px] md:text-base font-medium mb-1">
                Materi
              </p>
              <p className="text-white text-[15px] md:text-xl font-semibold">
                {materiNama}
              </p>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-t-[10px] md:rounded-t-[15px] p-4 md:p-6 flex items-center gap-4 md:gap-6">
              {/* Circular Progress */}
              <CircularProgress
                correct={totalBenar}
                total={totalSoal}
                size={100}
              />

              {/* Score Text */}
              <div>
                <p className="text-[#336D82] text-[11px] md:text-sm font-medium leading-relaxed">
                  Jawaban kamu benar
                </p>
                <p className="text-[#336D82] text-[11px] md:text-sm font-medium leading-relaxed">
                  {totalBenar} dari {totalSoal} pertanyaan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dropdown Toggle */}
        <div className="px-6 md:px-8 mb-4 md:mb-6">
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowResults(!showResults)}
              className="bg-[#336D82] rounded-[20px] h-[34px] md:h-[44px] px-5 md:px-7 text-white text-[14px] md:text-base font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              Hasil Keseluruhan
            </button>
            <button
              onClick={() => setShowResults(!showResults)}
              className="bg-[#336D82] rounded-[20px] h-[34px] md:h-[44px] w-[69px] md:w-[80px] flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <span
                className={`material-symbols-outlined text-white text-[24px] md:text-[28px] transition-transform duration-300 ${
                  showResults ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>
          </div>
        </div>

        {/* Results List - Desktop Grid */}
        {showResults && (
          <div className="px-6 md:px-8 space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 mb-6 md:mb-8 animate-fade-in">
            {riwayat.map((item, index) => (
              <QuizResultItem
                key={item.id}
                questionNumber={index + 1}
                question={item.soal.soal_teks}
                isCorrect={item.benar}
                onInfoClick={() => handleInfoClick(item)}
              />
            ))}
          </div>
        )}

        {/* Analisis AI Section */}
        <div id="analisis-section" className="px-6 md:px-8 mb-6 md:mb-8">
          {loadingAnalisis ? (
            <Card className="border-2 border-blue-200 rounded-[20px] overflow-hidden">
              <CardContent className="py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Memuat analisis AI...</p>
                </div>
              </CardContent>
            </Card>
          ) : analisisStatus?.is_analyzed && analisisData ? (
            <div>
              {/* Dropdown Toggle untuk Analisis Detail */}
              <div className="mb-4">
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      const detailSection =
                        document.getElementById("analisis-detail");
                      const icon = document.getElementById("analisis-icon");
                      if (detailSection && icon) {
                        const isHidden =
                          detailSection.classList.contains("hidden");
                        if (isHidden) {
                          detailSection.classList.remove("hidden");
                          icon.classList.add("rotate-180");
                        } else {
                          detailSection.classList.add("hidden");
                          icon.classList.remove("rotate-180");
                        }
                      }
                    }}
                    className="bg-[#336D82] rounded-[20px] h-[34px] md:h-[44px] px-5 md:px-7 text-white text-[14px] md:text-base font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all"
                  >
                    Detail Analisis Mbah Adaptivin
                  </button>
                  <button
                    onClick={() => {
                      const detailSection =
                        document.getElementById("analisis-detail");
                      const icon = document.getElementById("analisis-icon");
                      if (detailSection && icon) {
                        const isHidden =
                          detailSection.classList.contains("hidden");
                        if (isHidden) {
                          detailSection.classList.remove("hidden");
                          icon.classList.add("rotate-180");
                        } else {
                          detailSection.classList.add("hidden");
                          icon.classList.remove("rotate-180");
                        }
                      }
                    }}
                    className="bg-[#336D82] rounded-[20px] h-[34px] md:h-[44px] w-[69px] md:w-[80px] flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all"
                  >
                    <span
                      id="analisis-icon"
                      className="material-symbols-outlined text-white text-[24px] md:text-[28px] transition-transform duration-300"
                    >
                      expand_more
                    </span>
                  </button>
                </div>
              </div>

              {/* Detail Analisis (Hidden by default) */}
              <div id="analisis-detail" className="hidden animate-fade-in">
                <AnalisisAISection
                  analisis={analisisData}
                  hasilKuisId={hasilKuisId!}
                  onReAnalyze={handleReAnalyze}
                />
              </div>
            </div>
          ) : analisisStatus?.is_completed && hasilKuisId ? (
            <div className="relative group">
              {/* Decorative Background Glow */}
              <div
                className="absolute inset-0 rounded-[24px] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, #336D82 0%, #7AB0C4 100%)",
                }}
              />

              {/* Main Card */}
              <div
                className="relative overflow-hidden rounded-[24px] shadow-2xl transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, #5a8ca0 0%, #8fc5d8 100%)",
                }}
              >
                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <div className="absolute w-40 h-40 bg-white rounded-full -top-10 -left-10 animate-pulse" />
                  <div className="absolute w-32 h-32 bg-white rounded-full -bottom-10 -right-10 animate-pulse delay-75" />
                  <div className="absolute w-24 h-24 bg-white rounded-full top-1/2 right-10 animate-pulse delay-100" />
                </div>

                <div className="relative p-6 md:p-8">
                  {/* Header Section with Mbah Adaptivin */}
                  <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    {/* Mbah Adaptivin Avatar with Mystical Effects */}
                    <div className="relative flex-shrink-0">
                      {/* Outer Glow Ring */}
                      <div className="absolute inset-0 rounded-full bg-yellow-300/20 blur-xl animate-pulse pointer-events-none"></div>

                      {/* Rotating Ring */}
                      <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/20 animate-spin-slow pointer-events-none"></div>

                      {/* Main Avatar */}
                      <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-white p-3 shadow-2xl">
                        <Image
                          src="/mascot/mbah-adaptivin.svg"
                          alt="Mbah Adaptivin"
                          width={96}
                          height={96}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Sparkle Effects */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce pointer-events-none">
                        <span className="text-lg">✨</span>
                      </div>
                      <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-100 pointer-events-none">
                        <span className="text-lg">🔮</span>
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md mb-2 flex items-center justify-center md:justify-start gap-2">
                        <span>Hai Anak Pintar!</span>
                        <span className="animate-wave inline-block">👋</span>
                      </h3>
                      <p className="text-white drop-shadow text-base md:text-lg leading-relaxed mb-3">
                        Aku Mbah Adaptivin punya kekuatan istimewa lho! 🔮✨
                      </p>
                      <p className="text-white drop-shadow font-semibold text-lg md:text-xl">
                        "Mau aku ramal dan prediksi hasil belajar kamu?" 🎯
                      </p>
                    </div>
                  </div>

                  {/* Mystical Description Box */}
                  <div className="bg-white/25 backdrop-blur-sm rounded-2xl p-4 mb-6 border-2 border-white/40">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl flex-shrink-0">🌟</span>
                      <div>
                        <p className="text-white drop-shadow text-sm md:text-base leading-relaxed">
                          Dengan kekuatan AI-ku, aku bisa tau kelebihan dan
                          kelemahan kamu, terus kasih saran belajar yang cocok
                          buat kamu! Keren kan? 😎
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      const element = document.querySelector(
                        "[data-analisis-button]"
                      );
                      if (element instanceof HTMLElement) {
                        element.click();
                      }
                    }}
                    className="w-full bg-white hover:bg-gray-50 text-[#336D82] py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3 group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      🔮
                    </span>
                    <span>Ramal Sekarang!</span>
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      ✨
                    </span>
                  </button>

                  {/* Fun Fact */}
                  <p className="text-white drop-shadow text-xs md:text-sm text-center mt-4 italic">
                    💡 Psst... Hasil ramalan Mbah sangat akurat lho!
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Hidden button untuk trigger analisis */}
          {analisisStatus?.is_completed && hasilKuisId && !analisisData && (
            <div className="hidden">
              <AnalisisAIButton
                hasilKuisId={hasilKuisId}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail Jawaban */}
      {showDetailModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] md:rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div
              className="p-6 md:p-8 text-white relative overflow-hidden"
              style={{
                background: selectedQuestion.benar
                  ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              }}
            >
              {/* Decorative circles - behind content */}
              <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute w-32 h-32 bg-white rounded-full -top-16 -left-16"></div>
                <div className="absolute w-24 h-24 bg-white rounded-full -bottom-12 -right-12"></div>
              </div>

              {/* Close button - on top layer */}
              <button
                onClick={closeDetailModal}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all active:scale-95 z-10"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Content - on top of decorative circles */}
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    selectedQuestion.benar ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {selectedQuestion.benar ? (
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  ) : (
                    <XCircle className="w-10 h-10 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    {selectedQuestion.benar
                      ? "Jawaban Benar! 🎉"
                      : "Jawaban Salah 😔"}
                  </h3>
                  <p className="text-white/90 text-sm md:text-base mt-1">
                    Level: {selectedQuestion.level_soal.toUpperCase()} • Waktu:{" "}
                    {formatTime(selectedQuestion.waktu_dijawab)}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Soal */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Pertanyaan
                </h4>
                <p className="text-gray-900 text-base md:text-lg leading-relaxed">
                  {selectedQuestion.soal.soal_teks}
                </p>
                {selectedQuestion.soal.soal_gambar && (
                  <div className="mt-4 rounded-xl overflow-hidden border-2 border-gray-200">
                    <Image
                      src={selectedQuestion.soal.soal_gambar}
                      alt="Gambar Soal"
                      width={600}
                      height={400}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Jawaban Detail */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                  Detail Jawaban
                </h4>
                {renderJawabanSiswa(selectedQuestion)}
              </div>

              {/* Info Badge */}
              <div className="mt-6 flex items-center gap-3 flex-wrap">
                <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-xs text-blue-700 font-medium">
                    {selectedQuestion.soal.tipe_jawaban === "pilihan_ganda"
                      ? "Pilihan Ganda"
                      : selectedQuestion.soal.tipe_jawaban ===
                        "pilihan_ganda_kompleks"
                      ? "Pilihan Ganda Kompleks"
                      : "Isian Singkat"}
                  </span>
                </div>
                <div className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                  <span className="text-xs text-purple-700 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(selectedQuestion.waktu_dijawab)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <button
                onClick={closeDetailModal}
                className="w-full bg-[#336D82] hover:bg-[#2a5868] text-white py-3 md:py-4 rounded-xl font-semibold transition-all active:scale-[0.98] shadow-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Google Material Symbols */}
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

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        :global(.animate-spin-slow) {
          animation: spin-slow 3s linear infinite;
        }

        :global(.delay-75) {
          animation-delay: 75ms;
        }

        :global(.delay-100) {
          animation-delay: 100ms;
        }

        @keyframes wave {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(20deg);
          }
          75% {
            transform: rotate(-20deg);
          }
        }

        :global(.animate-wave) {
          animation: wave 1.5s ease-in-out infinite;
          transform-origin: 70% 70%;
        }
      `}</style>
    </div>
  );
}
