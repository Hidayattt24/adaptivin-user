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
  const [showResults, setShowResults] = useState(true); // Auto-expand by default
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
  const [isRamalanLoading, setIsRamalanLoading] = useState(false);

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

  const handleInfoClick = (item: JawabanDetail, index: number) => {
    setSelectedQuestion({ ...item, questionNumber: index + 1 } as any);
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

    // Stop loading ramalan
    setIsRamalanLoading(false);

    // Auto-expand hasil keseluruhan
    setShowResults(true);

    // Auto-expand detail analisis
    setTimeout(() => {
      const detailSection = document.getElementById("analisis-detail");
      const icon = document.getElementById("analisis-icon");
      if (detailSection && icon) {
        detailSection.classList.remove("hidden");
        icon.classList.add("rotate-180");
      }
    }, 300);

    // Scroll ke analisis
    setTimeout(() => {
      const analisisElement = document.getElementById("analisis-section");
      if (analisisElement) {
        analisisElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 500);
  };

  // Handler untuk tombol "Ramal Sekarang!"
  const handleRamalSekarang = () => {
    setIsRamalanLoading(true);

    // Trigger analisis button
    const element = document.querySelector("[data-analisis-button]");
    if (element instanceof HTMLElement) {
      element.click();
    }
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
            let textColor = "text-gray-700";
            let icon = null;
            let statusText = null;

            if (isSelected && isCorrect) {
              // Dipilih dan benar ✅ (hijau)
              bgColor = "bg-green-50 dark:bg-green-950/30";
              borderColor = "border-green-500";
              textColor = "text-green-800";
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
              textColor = "text-yellow-800";
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
              textColor = "text-red-800";
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
              textColor = "text-gray-700";
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
                    <p className={`text-sm font-medium ${textColor}`}>
                      {jawaban.isi_jawaban}
                    </p>
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
          let textColor = "text-gray-700";
          let icon = null;

          if (isSelected && isCorrect) {
            bgColor = "bg-green-50 dark:bg-green-950/30";
            borderColor = "border-green-500";
            textColor = "text-green-800";
            icon = <CheckCircle2 className="w-5 h-5 text-green-600" />;
          } else if (isSelected && !isCorrect) {
            bgColor = "bg-red-50 dark:bg-red-950/30";
            borderColor = "border-red-500";
            textColor = "text-red-800";
            icon = <XCircle className="w-5 h-5 text-red-600" />;
          } else if (!isSelected && isCorrect) {
            bgColor = "bg-yellow-50 dark:bg-yellow-950/30";
            borderColor = "border-yellow-500";
            textColor = "text-yellow-800";
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
                  <p className={`text-sm font-medium ${textColor}`}>
                    {jawaban.isi_jawaban}
                  </p>
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
    <div className="relative w-full min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden pb-8 md:pb-12">
      {/* Content Container - Desktop Centered */}
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-8 pt-6 md:pt-12 pb-4 md:pb-6">
          <h1 className="text-[#336D82] text-[18px] md:text-3xl font-bold">
            📊 Hasil Kuis
          </h1>
          <button
            onClick={handleClose}
            className="w-[40px] h-[40px] md:w-[52px] md:h-[52px] bg-[#336D82] rounded-full flex items-center justify-center hover:bg-[#2a5868] active:scale-95 transition-all shadow-lg"
          >
            <span className="material-symbols-outlined text-white text-[20px] md:text-[28px]">
              close
            </span>
          </button>
        </div>

        {/* Summary Card */}
        <div className="px-4 md:px-8 mb-4 md:mb-8">
          <div className="rounded-[20px] md:rounded-[32px] overflow-hidden shadow-xl md:shadow-2xl">
            {/* Header Section with Gradient */}
            <div
              className="relative p-4 md:p-8 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #336D82 0%, #7AB0C4 100%)",
              }}
            >
              {/* Decorative elements */}
              <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute w-24 h-24 md:w-32 md:h-32 bg-white rounded-full -top-12 -right-12 md:-top-16 md:-right-16 animate-pulse"></div>
                <div className="absolute w-20 h-20 md:w-24 md:h-24 bg-white rounded-full -bottom-10 -left-10 md:-bottom-12 md:-left-12 animate-pulse delay-75"></div>
                <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full top-1/2 left-8 md:left-10 animate-pulse delay-100"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Materi Badge */}
                <div className="inline-flex items-center gap-1.5 md:gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-2 md:mb-3">
                  <span className="text-white/90 text-[11px] md:text-sm font-medium">
                    📚 Materi
                  </span>
                </div>

                {/* Materi Title */}
                <h2 className="text-white text-lg md:text-3xl font-bold mb-0.5 md:mb-1 drop-shadow-md">
                  {materiNama}
                </h2>
                <p className="text-white/90 text-xs md:text-base">
                  Hasil Kuis Kamu
                </p>
              </div>
            </div>

            {/* Score Section with Modern Design */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
              <div className="flex flex-col items-center gap-4 md:gap-6">
                {/* Circular Progress with Enhanced Design */}
                <div className="relative flex-shrink-0">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-[#336D82]/20 rounded-full blur-xl md:blur-2xl animate-pulse"></div>

                  {/* Progress Circle */}
                  <div className="relative">
                    <CircularProgress
                      correct={totalBenar}
                      total={totalSoal}
                      size={100}
                    />
                  </div>
                </div>

                {/* Score Details - Centered on All Screens */}
                <div className="flex-1 text-center w-full">
                  {/* Score Badge */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#336D82]/10 to-[#7AB0C4]/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-2 md:mb-3 border border-[#336D82]/20">
                    <span className="text-xl md:text-2xl">🎯</span>
                    <span className="text-[#336D82] text-xs md:text-base font-bold">
                      Skor: {Math.round((totalBenar / totalSoal) * 100)}%
                    </span>
                  </div>

                  {/* Score Text */}
                  <div className="space-y-1 md:space-y-2">
                    <p className="text-gray-700 text-sm md:text-lg font-semibold">
                      Jawaban Benar
                    </p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-3xl md:text-5xl font-bold text-[#336D82]">
                        {totalBenar}
                      </span>
                      <span className="text-lg md:text-2xl text-gray-400 font-medium">
                        / {totalSoal}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs md:text-base">
                      pertanyaan dijawab dengan benar
                    </p>
                  </div>

                  {/* Achievement Badge */}
                  {skor >= 80 ? (
                    <div className="mt-3 md:mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full border-2 border-yellow-300">
                      <span className="text-xl md:text-2xl">🏆</span>
                      <span className="text-orange-700 text-xs md:text-base font-bold">
                        Luar Biasa!
                      </span>
                    </div>
                  ) : skor >= 60 ? (
                    <div className="mt-3 md:mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full border-2 border-green-300">
                      <span className="text-xl md:text-2xl">⭐</span>
                      <span className="text-green-700 text-xs md:text-base font-bold">
                        Bagus!
                      </span>
                    </div>
                  ) : (
                    <div className="mt-3 md:mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full border-2 border-blue-300">
                      <span className="text-xl md:text-2xl">💪</span>
                      <span className="text-blue-700 text-xs md:text-base font-bold">
                        Tetap Semangat!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dropdown Toggle */}
        <div className="px-4 md:px-8 mb-4 md:mb-6">
          <div className="flex gap-2 md:gap-3 justify-center">
            <button
              onClick={() => setShowResults(!showResults)}
              className="bg-[#336D82] rounded-[16px] md:rounded-[20px] h-[36px] md:h-[44px] px-4 md:px-7 text-white text-[13px] md:text-base font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              📋 Hasil Keseluruhan
            </button>
            <button
              onClick={() => setShowResults(!showResults)}
              className="bg-[#336D82] rounded-[16px] md:rounded-[20px] h-[36px] md:h-[44px] w-[60px] md:w-[80px] flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <span
                className={`material-symbols-outlined text-white text-[22px] md:text-[28px] transition-transform duration-300 ${
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
          <div className="px-4 md:px-8 space-y-2 md:space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 mb-4 md:mb-8 animate-fade-in">
            {riwayat.map((item, index) => (
              <QuizResultItem
                key={item.id}
                questionNumber={index + 1}
                question={item.soal.soal_teks}
                isCorrect={item.benar}
                onInfoClick={() => handleInfoClick(item, index)}
              />
            ))}
          </div>
        )}

        {/* Analisis AI Section */}
        <div id="analisis-section" className="px-4 md:px-8 mb-4 md:mb-8">
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
                <div className="flex gap-2 md:gap-3 justify-center">
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
                    className="bg-[#336D82] rounded-[16px] md:rounded-[20px] h-[36px] md:h-[44px] px-4 md:px-7 text-white text-[13px] md:text-base font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all"
                  >
                    🔮 Detail Analisis Mbah
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
                    className="bg-[#336D82] rounded-[16px] md:rounded-[20px] h-[36px] md:h-[44px] w-[60px] md:w-[80px] flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all"
                  >
                    <span
                      id="analisis-icon"
                      className="material-symbols-outlined text-white text-[22px] md:text-[28px] transition-transform duration-300 rotate-180"
                    >
                      expand_more
                    </span>
                  </button>
                </div>
              </div>

              {/* Detail Analisis (Auto-expanded by default) */}
              <div id="analisis-detail" className="animate-fade-in">
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
                      <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/30 animate-spin-slow"></div>

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
                        <p className="text-white text-sm md:text-base leading-relaxed">
                          Dengan kekuatan AI-ku, aku bisa tau kelebihan dan
                          kelemahan kamu, terus kasih saran belajar yang cocok
                          buat kamu! Keren kan? 😎
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {!isRamalanLoading ? (
                    <button
                      onClick={handleRamalSekarang}
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
                  ) : (
                    <div className="w-full bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 py-6 md:py-8 rounded-2xl shadow-2xl border-2 border-purple-200">
                      {/* Mystical Loading Animation */}
                      <div className="flex flex-col items-center gap-4">
                        {/* Crystal Ball Animation */}
                        <div className="relative">
                          {/* Outer glow rings */}
                          <div className="absolute inset-0 animate-ping-slow">
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-purple-400/30 blur-xl"></div>
                          </div>
                          <div className="absolute inset-0 animate-ping-slower">
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-pink-400/20 blur-2xl"></div>
                          </div>

                          {/* Main crystal ball */}
                          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-400 via-purple-300 to-pink-300 flex items-center justify-center shadow-2xl animate-pulse-glow">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-200/50 to-pink-200/50 backdrop-blur-sm flex items-center justify-center">
                              <span className="text-4xl md:text-5xl animate-spin-slow">
                                🔮
                              </span>
                            </div>
                            {/* Sparkles around ball */}
                            <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                              ✨
                            </div>
                            <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce delay-100">
                              ⭐
                            </div>
                            <div className="absolute top-0 -left-3 text-xl animate-bounce delay-75">
                              💫
                            </div>
                            <div className="absolute bottom-0 -right-3 text-xl animate-bounce delay-150">
                              🌟
                            </div>
                          </div>
                        </div>

                        {/* Loading Text */}
                        <div className="text-center px-4">
                          <p className="text-purple-800 font-bold text-lg md:text-xl mb-2 animate-pulse">
                            🔮 Mbah Sedang Meramal... 🔮
                          </p>
                          <p className="text-purple-600 text-sm md:text-base font-medium animate-fade-in-out">
                            Tunggu sebentar ya, lagi baca bola kristal nih... ✨
                          </p>
                        </div>

                        {/* Mystical Dots */}
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce"></div>
                          <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce delay-100"></div>
                          <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fun Fact */}
                  <p className="text-white/80 text-xs md:text-sm text-center mt-4 italic">
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-3 md:p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] md:rounded-[32px] w-full max-w-md md:max-w-2xl max-h-[95vh] overflow-hidden shadow-2xl animate-scale-in">
            {/* Header with Clean Design */}
            <div
              className="relative pt-5 pb-4 px-5 md:px-6"
              style={{
                background: selectedQuestion.benar
                  ? "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                  : "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
              }}
            >
              {/* Close button - Top Right */}
              <button
                onClick={closeDetailModal}
                className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center transition-all active:scale-95 shadow-md hover:bg-gray-50"
                aria-label="Tutup"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>

              {/* Question Number Badge */}
              <div className="text-center mb-3">
                <p className="text-white/80 text-xs font-medium mb-2">
                  Soal Nomor #{(selectedQuestion as any).questionNumber}
                </p>

                {/* Icon */}
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    {selectedQuestion.benar ? (
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500" />
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-white text-xl md:text-2xl font-bold mb-3">
                  {selectedQuestion.benar
                    ? "Jawaban Benar! 🎉"
                    : "Jawaban Salah"}
                </h3>

                {/* Info Badges */}
                <div className="flex justify-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <span className="text-white text-xs font-semibold">
                      Level: {selectedQuestion.level_soal.toUpperCase()}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-white" />
                    <span className="text-white text-xs font-semibold">
                      Waktu: {formatTime(selectedQuestion.waktu_dijawab)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content - Scrollable with Better Layout */}
            <div className="overflow-y-auto max-h-[calc(95vh-240px)] bg-white">
              {/* Soal Section */}
              <div className="p-4 md:p-5 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-6 h-6 bg-[#336D82] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">?</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#336D82] uppercase tracking-wider">
                    Pertanyaan
                  </h4>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <p className="text-gray-800 text-sm md:text-base leading-relaxed">
                    {selectedQuestion.soal.soal_teks}
                  </p>
                  {selectedQuestion.soal.soal_gambar && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={selectedQuestion.soal.soal_gambar}
                        alt="Gambar Soal"
                        width={600}
                        height={400}
                        className="w-full h-auto object-contain bg-gray-50"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Jawaban Section */}
              <div className="p-4 md:p-5">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-6 h-6 bg-[#336D82] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#336D82] uppercase tracking-wider">
                    Detail Jawaban
                  </h4>
                </div>
                <div className="space-y-2">
                  {renderJawabanSiswa(selectedQuestion)}
                </div>
              </div>

              {/* Info Footer */}
              <div className="p-4 md:p-5 bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
                <div className="flex flex-wrap justify-center gap-2">
                  {/* Type Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="text-base">📝</span>
                    <span className="text-xs md:text-sm text-blue-700 font-semibold">
                      {selectedQuestion.soal.tipe_jawaban === "pilihan_ganda"
                        ? "Pilihan Ganda"
                        : selectedQuestion.soal.tipe_jawaban ===
                          "pilihan_ganda_kompleks"
                        ? "Pilihan Kompleks"
                        : "Isian Singkat"}
                    </span>
                  </div>

                  {/* Level Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-xl border border-orange-200">
                    <span className="text-base">⚡</span>
                    <span className="text-xs md:text-sm text-orange-700 font-semibold">
                      Level {selectedQuestion.level_soal.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Button */}
            <div className="p-4 bg-white border-t border-gray-200">
              <button
                onClick={closeDetailModal}
                className="w-full bg-[#336D82] hover:bg-[#2a5868] text-white py-3 rounded-2xl font-bold text-sm md:text-base transition-all active:scale-[0.98] shadow-md"
              >
                Tutup Detail
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

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        :global(.animate-scale-in) {
          animation: scale-in 0.3s ease-out;
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

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%,
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        :global(.animate-ping-slow) {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping-slower {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%,
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        :global(.animate-ping-slower) {
          animation: ping-slower 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.4),
              0 0 40px rgba(236, 72, 153, 0.2);
          }
          50% {
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.6),
              0 0 60px rgba(236, 72, 153, 0.4);
          }
        }

        :global(.animate-pulse-glow) {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes fade-in-out {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        :global(.animate-fade-in-out) {
          animation: fade-in-out 2s ease-in-out infinite;
        }

        :global(.delay-75) {
          animation-delay: 75ms;
        }

        :global(.delay-100) {
          animation-delay: 100ms;
        }

        :global(.delay-150) {
          animation-delay: 150ms;
        }

        :global(.delay-200) {
          animation-delay: 200ms;
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
