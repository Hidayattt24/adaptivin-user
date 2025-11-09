"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowLeft, Clock, Trophy, Target } from "lucide-react";
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
  jawaban_siswa_object?: Array<{ id: string; isi_jawaban: string; is_benar: boolean }> | { id: string; isi_jawaban: string; is_benar: boolean } | null;
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
  jawaban_siswa_object: Array<{ id: string; isi_jawaban: string; is_benar: boolean }> | { id: string; isi_jawaban: string; is_benar: boolean } | null;
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
  const hasilKuisId = searchParams.get("hasilKuisId");

  const [loading, setLoading] = useState(true);
  const [riwayat, setRiwayat] = useState<JawabanDetail[]>([]);
  const [totalBenar, setTotalBenar] = useState(0);
  const [totalSoal, setTotalSoal] = useState(0);

  // State untuk analisis AI
  const [analisisStatus, setAnalisisStatus] = useState<AnalisisStatus | null>(null);
  const [analisisData, setAnalisisData] = useState<AnalisisAI | null>(null);
  const [loadingAnalisis, setLoadingAnalisis] = useState(false);

  const fetchRiwayatKuis = useCallback(async () => {
    if (!hasilKuisId) return;

    try {
      // Gunakan API function dari lib/api/jawaban.ts
      const data = await getJawabanByHasilKuis(hasilKuisId);

      console.log("Raw data from API:", data);

      // Transform data jika diperlukan
      const transformedData = (data as DetailJawabanSiswaExtended[]).map((item) => {
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
      });

      console.log("Transformed data:", transformedData);

      setRiwayat(transformedData);
      setTotalSoal(transformedData.length);
      setTotalBenar(transformedData.filter((item: JawabanDetail) => item.benar).length);
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
          setTotalBenar(responseData.data.filter((item: JawabanDetail) => item.benar).length);
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
      const analisisElement = document.getElementById('analisis-section');
      if (analisisElement) {
        analisisElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      setAnalisisStatus(prev => ({
        ...prev!,
        is_analyzed: false,
        analisis_id: null,
      }));

      console.log("Analisis lama berhasil dihapus. Silakan klik tombol 'Analisis dengan AI' untuk analisis ulang.");
    } catch (error) {
      console.error("Error deleting analysis:", error);
      alert("Gagal menghapus analisis lama. Silakan coba lagi.");
      throw error;
    }
  };

  const handleKembaliKeMateri = () => {
    // Navigate back 2 levels: /kuis/hasil -> /kuis -> /materi/[materiId]
    router.back();
    setTimeout(() => router.back(), 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderJawabanSiswa = (item: JawabanDetail) => {
    const { soal, jawaban_siswa_object, all_jawaban, jawaban_siswa_text } = item;

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
                {all_jawaban.find(j => j.is_benar)?.isi_jawaban}
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
              icon = <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />;
              statusText = <p className="text-xs text-green-600 mt-1">✓ Benar dipilih</p>;
            } else if (!isSelected && isCorrect) {
              // Tidak dipilih tapi seharusnya dipilih 🟡 (kuning - terlewat)
              bgColor = "bg-yellow-50 dark:bg-yellow-950/30";
              borderColor = "border-yellow-500";
              icon = <CheckCircle2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />;
              statusText = <p className="text-xs text-yellow-600 mt-1">⚠ Harusnya dipilih</p>;
            } else if (isSelected && !isCorrect) {
              // Dipilih tapi salah ❌ (merah)
              bgColor = "bg-red-50 dark:bg-red-950/30";
              borderColor = "border-red-500";
              icon = <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />;
              statusText = <p className="text-xs text-red-600 mt-1">✗ Tidak perlu dipilih</p>;
            } else {
              // Tidak dipilih dan memang salah (abu-abu - benar tidak dipilih)
              bgColor = "bg-gray-50 dark:bg-gray-900";
              borderColor = "border-gray-200 dark:border-gray-700";
              icon = <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />;
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
    const selectedId = typeof jawaban_siswa_object === "object" && jawaban_siswa_object !== null && !Array.isArray(jawaban_siswa_object)
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
                    <p className="text-xs text-yellow-600 mt-1">Jawaban yang benar</p>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat hasil kuis...</p>
        </div>
      </div>
    );
  }

  const skor = totalSoal > 0 ? Math.round((totalBenar / totalSoal) * 100) : 0;

  // Debug render logic
  console.log("=== RENDER LOGIC DEBUG ===");
  console.log("loadingAnalisis:", loadingAnalisis);
  console.log("analisisStatus:", analisisStatus);
  console.log("analisisData:", analisisData);
  console.log("Should show analisis:", analisisStatus?.is_analyzed && analisisData);
  console.log("Should show button:", analisisStatus?.is_completed && hasilKuisId && !analisisData);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <Card className="mb-6 border-teal-200 dark:border-teal-800">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-950 dark:to-green-950">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-teal-600" />
            <CardTitle className="text-2xl">Hasil Kuis</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 p-4 rounded-lg text-center border border-teal-200 dark:border-teal-800">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-4 h-4 text-teal-600" />
                <p className="text-sm text-teal-700 dark:text-teal-300 font-medium">Total Soal</p>
              </div>
              <p className="text-3xl font-bold text-teal-600">{totalSoal}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4 rounded-lg text-center border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">Benar</p>
              </div>
              <p className="text-3xl font-bold text-green-600">{totalBenar}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 rounded-lg text-center border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Skor</p>
              </div>
              <p className="text-3xl font-bold text-blue-600">{skor}%</p>
            </div>
          </div>

          <Button
            onClick={handleKembaliKeMateri}
            className="w-full mt-6"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Materi
          </Button>
        </CardContent>
      </Card>

      {/* Analisis AI Section */}
      <div id="analisis-section">
        {loadingAnalisis ? (
          <Card className="mb-6">
            <CardContent className="py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Memuat analisis AI...</p>
              </div>
            </CardContent>
          </Card>
        ) : analisisStatus?.is_analyzed && analisisData ? (
          <div className="mb-6">
            <AnalisisAISection
              analisis={analisisData}
              hasilKuisId={hasilKuisId!}
              onReAnalyze={handleReAnalyze}
            />
          </div>
        ) : analisisStatus?.is_completed && hasilKuisId ? (
          <div className="mb-6">
            <AnalisisAIButton
              hasilKuisId={hasilKuisId}
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
        ) : null}
      </div>

      {/* Riwayat Soal */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">📝 Riwayat Jawaban</h2>

        {riwayat.map((item, index) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={item.benar ? "default" : "destructive"}>
                    {item.benar ? "✓ Benar" : "✗ Salah"}
                  </Badge>
                  <Badge variant="outline">{item.level_soal}</Badge>
                  <Badge variant="secondary">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(item.waktu_dijawab)}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  Soal #{index + 1}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Soal */}
              <div>
                <p className="font-medium mb-2">Pertanyaan:</p>
                <p className="text-sm text-muted-foreground">
                  {item.soal.soal_teks}
                </p>
                {item.soal.soal_gambar && (
                  <Image
                    src={item.soal.soal_gambar}
                    alt="Soal"
                    width={400}
                    height={300}
                    className="mt-2 rounded-lg max-h-48 object-contain"
                  />
                )}
              </div>

              {/* Jawaban */}
              <div>
                <p className="font-medium mb-2">Jawaban:</p>
                {renderJawabanSiswa(item)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
