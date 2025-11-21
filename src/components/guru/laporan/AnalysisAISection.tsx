"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Video,
  Target,
  AlertCircle,
  RefreshCw,
  Play,
  Sparkles,
  BookOpen,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Printer,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/siswa/kuis/MarkdownRenderer";
import { AnalysisFormatter } from "@/components/siswa/kuis/AnalysisFormatter";
import { createTeacherAnalysis, AnalisisAIGuru, getTeacherAnalysisByHasilKuis, deleteTeacherAnalysis } from "@/lib/api/analisis";

interface AnalisisData {
  hasil_kuis_id?: string;
  analisis: string;
  level_tertinggi: string;
  level_terendah: string;
  kelebihan: string;
  kelemahan: string;
  rekomendasi_belajar: string;
  rekomendasi_video: string | object | null;
}

interface PerformanceDataItem {
  level: string;
  benar: number;
  salah: number;
}

interface AnalysisAISectionProps {
  studentName: string;
  materiTitle: string;
  analisisData?: AnalisisData | null;
  analisisGuru?: AnalisisAIGuru | null; // Teacher analysis from database
  isLoading?: boolean;
  className?: string;
  hasilKuisId?: string; // For teacher re-analysis
  onAnalysisComplete?: () => void; // Callback after teacher analysis
  performanceData?: PerformanceDataItem[]; // Performance data for print
}

const AnalysisAISection: React.FC<AnalysisAISectionProps> = ({
  studentName,
  materiTitle,
  analisisData,
  analisisGuru,
  isLoading = false,
  className = "",
  hasilKuisId,
  onAnalysisComplete,
  performanceData = [],
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [teacherAnalysis, setTeacherAnalysis] = useState<AnalisisAIGuru | null>(analisisGuru || null);
  const [showTeacherAnalysis, setShowTeacherAnalysis] = useState(!!analisisGuru);

  // Collapsible states
  const [isStudentAnalysisOpen, setIsStudentAnalysisOpen] = useState(true);
  const [isTeacherAnalysisOpen, setIsTeacherAnalysisOpen] = useState(true);

  // Helper function to convert markdown to HTML with inline styles for print
  const markdownToHtml = (text: string): string => {
    if (!text) return '';

    // Convert \n literal to actual newlines
    let html = text.replace(/\\n/g, '\n');

    // Convert headers (do this before bold to avoid conflicts)
    html = html.replace(/^### (.+)$/gm, '<h3 style="font-size: 11pt; font-weight: bold; margin: 0.3cm 0 0.2cm 0;">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 style="font-size: 12pt; font-weight: bold; margin: 0.4cm 0 0.3cm 0;">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 style="font-size: 13pt; font-weight: bold; margin: 0.5cm 0 0.3cm 0;">$1</h1>');

    // Convert bold text first: **text** or __text__ (non-greedy)
    html = html.replace(/\*\*([^*]+?)\*\*/g, '<strong style="font-weight: bold; color: #000;">$1</strong>');
    html = html.replace(/__([^_]+?)__/g, '<strong style="font-weight: bold; color: #000;">$1</strong>');

    // Convert bullet points: • or - or * at start of line
    html = html.replace(/^[\s]*[•\-\*]\s+(.+)$/gm, '<li style="margin-left: 0.5cm; margin-bottom: 0.2cm; list-style-type: disc;">$1</li>');

    // Wrap consecutive <li> tags in <ul>
    const lines = html.split('\n');
    let inList = false;
    let result = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isListItem = line.trim().startsWith('<li');

      if (isListItem && !inList) {
        result += '<ul style="margin: 0.3cm 0; padding-left: 0.5cm;">\n';
        inList = true;
      } else if (!isListItem && inList) {
        result += '</ul>\n';
        inList = false;
      }

      result += line + '\n';
    }

    if (inList) {
      result += '</ul>\n';
    }

    html = result;

    // Convert double newlines to paragraph breaks
    html = html.replace(/\n\n+/g, '<br/><br/>');
    // Convert remaining single newlines to <br>
    html = html.replace(/\n/g, '<br/>');

    return html;
  };

  // Simple print handler with validation
  const handlePrint = () => {
    const printElement = document.getElementById('print-report');
    if (!printElement) {
      console.error('Print report element not found');
      alert('Gagal mempersiapkan laporan untuk dicetak. Silakan refresh halaman.');
      return;
    }

    if (!analisisData) {
      alert('Data analisis tidak tersedia. Silakan tunggu data selesai dimuat.');
      return;
    }

    console.log('Print report element found, proceeding to print...');
    window.print();
  };

  // Helper function to parse JSON strings and format as markdown
  const parseAndFormatJSON = (data: string | object | unknown[]): string => {
    if (!data) return "Data tidak tersedia";

    // If already a string and not JSON, return as is
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return parseAndFormatJSON(parsed);
      } catch {
        // Not JSON, return as is
        return data;
      }
    }

    // If it's an array
    if (Array.isArray(data)) {
      if (data.length === 0) return "Tidak ada data";

      // Check if it's a simple string array
      const isSimpleStringArray = data.every(item => typeof item === 'string');

      if (isSimpleStringArray) {
        // Format simple string arrays as a nice bullet list
        return data.map((item, index) => `**${index + 1}.** ${item}`).join('\n\n');
      }

      // Format as markdown list with better styling for object arrays
      return data.map((item, index) => {
        if (typeof item === 'object') {
          // For objects with nama and penjelasan, create a beautiful formatted section
          if (item.nama || item.judul) {
            const title = item.nama || item.judul;
            const description = item.penjelasan || item.deskripsi || item.keterangan || '';

            // Format: heading with title, then description
            let formatted = `### ${index + 1}. ${title}\n\n`;

            if (description) {
              formatted += `${description}\n`;
            }

            // Add any other fields (excluding nama, judul, penjelasan, deskripsi, keterangan)
            const otherFields = Object.entries(item)
              .filter(([key]) => !['nama', 'judul', 'penjelasan', 'deskripsi', 'keterangan'].includes(key))
              .filter(([, value]) => value !== null && value !== undefined);

            if (otherFields.length > 0) {
              formatted += '\n';
              otherFields.forEach(([key, value]) => {
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                formatted += `**${formattedKey}**: ${value}\n\n`;
              });
            }

            return formatted;
          }

          // Fallback for objects without nama/judul
          const entries = Object.entries(item)
            .filter(([, value]) => value !== null && value !== undefined)
            .map(([key, value]) => {
              const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              return `- **${formattedKey}**: ${value}`;
            });
          return `**${index + 1}.**\n${entries.join('\n')}\n`;
        }
        return `${index + 1}. ${item}`;
      }).join('\n\n');
    }

    // If it's an object
    if (typeof data === 'object') {
      // Special handling for strategi_differensiasi structure
      if ('konten' in data || 'proses' in data || 'produk' in data) {
        const strategiData = data as { konten?: string; proses?: string; produk?: string };
        let formatted = '';

        if (strategiData.konten) {
          formatted += `### 📚 Diferensiasi Konten\n\n${strategiData.konten}\n\n`;
        }

        if (strategiData.proses) {
          formatted += `### ⚙️ Diferensiasi Proses\n\n${strategiData.proses}\n\n`;
        }

        if (strategiData.produk) {
          formatted += `### 🎯 Diferensiasi Produk\n\n${strategiData.produk}\n\n`;
        }

        return formatted.trim();
      }

      // General object formatting
      const entries = Object.entries(data)
        .filter(([, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
          const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          return `- **${formattedKey}**: ${value}`;
        });
      return entries.join('\n');
    }

    return String(data);
  };

  // Fetch existing teacher analysis when component mounts or hasilKuisId changes
  useEffect(() => {
    const fetchTeacherAnalysis = async () => {
      if (hasilKuisId && !analisisGuru) {
        try {
          const analysis = await getTeacherAnalysisByHasilKuis(hasilKuisId);
          if (analysis) {
            setTeacherAnalysis(analysis);
            setShowTeacherAnalysis(true);
          }
        } catch {
          // Silently fail - teacher analysis might not exist yet
          console.log("No teacher analysis found yet");
        }
      } else if (analisisGuru) {
        setTeacherAnalysis(analisisGuru);
        setShowTeacherAnalysis(true);
      }
    };

    fetchTeacherAnalysis();
  }, [hasilKuisId, analisisGuru]);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(\?v=))([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[8].length === 11 ? match[8] : null;
  };

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (url: string): string => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return "";
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  // Handler for teacher re-analysis
  const handleTeacherAnalysis = async () => {
    if (!hasilKuisId) {
      console.error("ID hasil kuis tidak ditemukan");
      return;
    }

    // Check if this is re-analysis (analysis already exists)
    const isReanalysis = !!teacherAnalysis;

    // Set loading state immediately
    setIsAnalyzing(true);
    try {
      // If re-analysis, delete the old analysis first
      if (isReanalysis && teacherAnalysis?.id) {
        try {
          await deleteTeacherAnalysis(teacherAnalysis.id);
        } catch (deleteError) {
          console.error("Error deleting old analysis:", deleteError);
          // Continue with creating new analysis even if delete fails
        }
      }

      const analysis = await createTeacherAnalysis(hasilKuisId);
      setTeacherAnalysis(analysis);
      setShowTeacherAnalysis(true);

      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (error) {
      console.error("Error creating teacher analysis:", error);
      const errorMessage = error instanceof Error ? error.message : "Gagal membuat analisis. Silakan coba lagi.";
      // Show error in console, could add toast notification here if needed
      console.error("Analisis gagal:", errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };
  // Show loading state
  const showLoading = isLoading;
  const showNoData = !isLoading && !analisisData;

  // Parse video recommendations if available
  let videoLinks: Array<{ judul?: string; url: string }> = [];
  if (analisisData && analisisData.rekomendasi_video) {
    try {
      let parsedData: string[] | Array<{ judul?: string; url: string }>;
      if (typeof analisisData.rekomendasi_video === 'string') {
        parsedData = JSON.parse(analisisData.rekomendasi_video);
      } else {
        parsedData = analisisData.rekomendasi_video as string[] | Array<{ judul?: string; url: string }>;
      }

      // Handle array of strings or array of objects
      if (Array.isArray(parsedData)) {
        videoLinks = parsedData
          .map((item) => {
            if (typeof item === 'string') {
              return { url: item };
            } else if (item && typeof item === 'object' && item.url) {
              return { judul: item.judul, url: item.url };
            }
            return null;
          })
          .filter((item): item is { judul?: string; url: string } => item !== null);
      }
    } catch {
      videoLinks = [];
    }
  }

  // Calculate statistics for print
  const totalQuestions = analisisData ? (analisisData.analisis.match(/Dari (\d+) soal/)?.[1] || '0') : '0';
  const correctAnswers = analisisData?.analisis.match(/(\d+) soal dengan benar/)?.[1] || '0';
  const wrongAnswers = analisisData ? (parseInt(totalQuestions) - parseInt(correctAnswers)).toString() : '0';
  const accuracy = analisisData ? ((parseInt(correctAnswers) / parseInt(totalQuestions)) * 100).toFixed(1) : '0';

  return (
    <>
      {/* Print-Only Styles */}
      <style>{`
        #print-report {
          display: none;
        }
        
        @media print {
          @page {
            size: A4 portrait;
            margin: 2cm 1.5cm;
          }
          
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* Hide web elements */
          body * {
            visibility: hidden;
          }
          
          /* Show print report */
          #print-report,
          #print-report * {
            visibility: visible;
          }
          
          #print-report {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {/* Hidden Print-Only Report Structure - Only render if has data */}
      {analisisData && (
        <div id="print-report">
          <div style={{ fontFamily: "'Times New Roman', serif", fontSize: '12pt', lineHeight: '1.6' }}>
            {/* Report Header */}
            <div style={{ textAlign: 'center', marginBottom: '2cm' }}>
              <h1 style={{ fontSize: '18pt', fontWeight: 'bold', margin: '0 0 0.5cm 0', textTransform: 'uppercase' }}>
                LAPORAN ANALISIS PEMBELAJARAN SISWA
              </h1>
              <div style={{ borderBottom: '2px solid #000', width: '100%', marginBottom: '1cm' }}></div>
            </div>

            {/* Student Information */}
            <div style={{ marginBottom: '1cm' }}>
              <table style={{ width: '100%', border: 'none', fontSize: '11pt' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '30%', padding: '4px 0' }}>Nama Siswa</td>
                    <td style={{ width: '2%' }}>:</td>
                    <td style={{ fontWeight: 'bold' }}>{studentName}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0' }}>Materi</td>
                    <td>:</td>
                    <td style={{ fontWeight: 'bold' }}>{materiTitle}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0' }}>Tanggal Cetak</td>
                    <td>:</td>
                    <td>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Statistics Summary */}
            <div style={{ marginBottom: '1cm' }}>
              <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.5cm', borderBottom: '1px solid #000', paddingBottom: '0.2cm' }}>
                I. RINGKASAN STATISTIK
              </h2>
              <table style={{ width: '100%', border: '1px solid #000', borderCollapse: 'collapse', fontSize: '11pt' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Indikator</th>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', width: '25%' }}>Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>Total Soal</td>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{totalQuestions}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>Jawaban Benar</td>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold', color: 'green' }}>{correctAnswers}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>Jawaban Salah</td>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold', color: 'red' }}>{wrongAnswers}</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold' }}>Tingkat Akurasi</td>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '12pt' }}>{accuracy}%</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>Level Tertinggi Dikuasai</td>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>{analisisData?.level_tertinggi}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>Level Perlu Ditingkatkan</td>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>{analisisData?.level_terendah}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Performance Table (replaces chart for print) */}
            {performanceData && performanceData.length > 0 && (
              <div style={{ marginBottom: '1cm' }}>
                <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.5cm', borderBottom: '1px solid #000', paddingBottom: '0.2cm' }}>
                  II. PERFORMA PER LEVEL KESULITAN
                </h2>
                <table style={{ width: '100%', border: '1px solid #000', borderCollapse: 'collapse', fontSize: '11pt' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                      <th style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', width: '25%' }}>Level</th>
                      <th style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', width: '25%' }}>Benar</th>
                      <th style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', width: '25%' }}>Salah</th>
                      <th style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', width: '25%' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.map((item, index) => {
                      const total = item.benar + item.salah;
                      const percentage = total > 0 ? ((item.benar / total) * 100).toFixed(0) : '0';
                      return (
                        <tr key={index}>
                          <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {item.level}
                          </td>
                          <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', color: 'green', fontWeight: 'bold' }}>
                            {item.benar}
                          </td>
                          <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', color: 'red', fontWeight: 'bold' }}>
                            {item.salah}
                          </td>
                          <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center' }}>
                            {total} ({percentage}%)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Analysis Results */}
            <div style={{ marginBottom: '1cm', pageBreakBefore: 'auto' }}>
              <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.5cm', borderBottom: '1px solid #000', paddingBottom: '0.2cm' }}>
                III. HASIL ANALISIS
              </h2>
              <div
                style={{ textAlign: 'justify', marginBottom: '0.5cm' }}
                dangerouslySetInnerHTML={{ __html: markdownToHtml(analisisData?.analisis || '') }}
              />
            </div>

            {/* Strengths */}
            <div style={{ marginBottom: '1cm' }}>
              <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '0.3cm' }}>A. Kelebihan</h3>
              <div
                style={{ textAlign: 'justify', paddingLeft: '0.5cm' }}
                dangerouslySetInnerHTML={{ __html: markdownToHtml(analisisData?.kelebihan || '') }}
              />
            </div>

            {/* Weaknesses */}
            <div style={{ marginBottom: '1cm' }}>
              <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '0.3cm' }}>B. Kelemahan</h3>
              <div
                style={{ textAlign: 'justify', paddingLeft: '0.5cm' }}
                dangerouslySetInnerHTML={{ __html: markdownToHtml(analisisData?.kelemahan || '') }}
              />
            </div>

            {/* Recommendations */}
            <div style={{ marginBottom: '1cm', pageBreakBefore: 'auto' }}>
              <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.5cm', borderBottom: '1px solid #000', paddingBottom: '0.2cm' }}>
                IV. REKOMENDASI PEMBELAJARAN
              </h2>
              <div
                style={{ textAlign: 'justify' }}
                dangerouslySetInnerHTML={{ __html: markdownToHtml(analisisData?.rekomendasi_belajar || '') }}
              />
            </div>

            {/* Teacher Analysis if exists */}
            {teacherAnalysis && (
              <>
                <div style={{ pageBreakBefore: 'always' }}></div>
                <div style={{ marginBottom: '1cm' }}>
                  <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.5cm', borderBottom: '1px solid #000', paddingBottom: '0.2cm' }}>
                    V. ANALISIS STRATEGI PEMBELAJARAN (UNTUK GURU)
                  </h2>

                  <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '0.3cm', marginTop: '0.5cm' }}>A. Diagnosis Pembelajaran</h3>
                  <div
                    style={{ textAlign: 'justify', paddingLeft: '0.5cm', marginBottom: '0.5cm' }}
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(teacherAnalysis.diagnosis_pembelajaran || '') }}
                  />

                  <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '0.3cm' }}>B. Pola Belajar Siswa</h3>
                  <div
                    style={{ textAlign: 'justify', paddingLeft: '0.5cm', marginBottom: '0.5cm' }}
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(teacherAnalysis.pola_belajar_siswa || '') }}
                  />

                  <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '0.3cm' }}>C. Zona Proximal Development</h3>
                  <div
                    style={{ textAlign: 'justify', paddingLeft: '0.5cm', marginBottom: '0.5cm' }}
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(teacherAnalysis.zona_proximal_development || '') }}
                  />

                  <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '0.3cm' }}>D. Strategi Differensiasi</h3>
                  <div
                    style={{ textAlign: 'justify', paddingLeft: '0.5cm', marginBottom: '0.5cm' }}
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(parseAndFormatJSON(teacherAnalysis.strategi_differensiasi)) }}
                  />

                  <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '0.3cm' }}>E. Tips Praktis</h3>
                  <div
                    style={{ textAlign: 'justify', paddingLeft: '0.5cm' }}
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(parseAndFormatJSON(teacherAnalysis.tips_praktis)) }}
                  />
                </div>
              </>
            )}

            {/* Footer */}
            <div style={{ marginTop: '2cm', borderTop: '1px solid #000', paddingTop: '0.5cm' }}>
              <p style={{ fontSize: '9pt', color: '#666', textAlign: 'center' }}>
                Dokumen ini digenerate secara otomatis oleh sistem Adaptivin | {new Date().toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Original Web View */}
      <div id="analysis-section" className={`space-y-6 ${className} print:hidden`}>
        {/* Loading State */}
        {showLoading && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {showNoData && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 border-2 border-blue-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-200 rounded-full mb-4">
                <AlertCircle className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl poppins-bold text-blue-800 mb-3">
                Siswa Belum Menganalisis Hasil Kuis
              </h3>
              <p className="text-blue-700 poppins-regular mb-6 max-w-md mx-auto">
                Siswa <span className="poppins-semibold">{studentName}</span> belum
                melakukan analisis AI untuk materi{" "}
                <span className="poppins-semibold">{materiTitle}</span>.
              </p>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
                <p className="text-sm text-blue-600 poppins-medium">
                  💡 <span className="poppins-semibold">Tips:</span> Analisis AI
                  akan tersedia setelah siswa menyelesaikan kuis dan melakukan
                  analisis hasil kuisnya.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Only show if has data */}
        {!showLoading && !showNoData && analisisData && (
          <>
            {/* Header with Toggle */}
            <div className="bg-gradient-to-r from-[#336D82] to-[#4A8BA6] rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-white/20 rounded-xl">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl poppins-bold text-white mb-2">
                        Analisis AI untuk {studentName}
                      </h2>
                      <p className="text-white/90 poppins-regular">
                        Materi: <span className="poppins-semibold">{materiTitle}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setIsStudentAnalysisOpen(!isStudentAnalysisOpen)}
                      className="no-print p-2 hover:bg-white/20 rounded-lg transition-all"
                    >
                      {isStudentAnalysisOpen ? (
                        <ChevronUp className="w-6 h-6 text-white" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible Student Analysis Content */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${isStudentAnalysisOpen ? "max-h-[10000px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              <div className="space-y-6">
                {/* Main Analysis */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Brain className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl poppins-bold text-gray-800">
                      Ringkasan Analisis
                    </h3>
                  </div>
                  {/* Check if content has question format pattern */}
                  {analisisData.analisis.includes("🔍 Soal #") || analisisData.analisis.includes("Soal #") ? (
                    <AnalysisFormatter content={analisisData.analisis} />
                  ) : (
                    <MarkdownRenderer
                      content={analisisData.analisis}
                      className="text-gray-700 poppins-regular leading-relaxed"
                    />
                  )}
                </div>

                {/* Level Performance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Highest Level */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-green-200 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-green-700" />
                      </div>
                      <h3 className="text-lg poppins-bold text-green-800">
                        Level Tertinggi Dikuasai
                      </h3>
                    </div>
                    <p className="text-3xl poppins-bold text-green-700 mb-2">
                      {analisisData.level_tertinggi.toUpperCase()}
                    </p>
                    <p className="text-sm text-green-600 poppins-regular">
                      Siswa menunjukkan pemahaman baik pada level ini
                    </p>
                  </div>

                  {/* Lowest Level */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-orange-200 rounded-xl">
                        <TrendingDown className="w-6 h-6 text-orange-700" />
                      </div>
                      <h3 className="text-lg poppins-bold text-orange-800">
                        Level Perlu Ditingkatkan
                      </h3>
                    </div>
                    <p className="text-3xl poppins-bold text-orange-700 mb-2">
                      {analisisData.level_terendah.toUpperCase()}
                    </p>
                    <p className="text-sm text-orange-600 poppins-regular">
                      Fokus pembelajaran pada level ini
                    </p>
                  </div>
                </div>

                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Target className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg poppins-bold text-gray-800">Kelebihan</h3>
                    </div>
                    <MarkdownRenderer
                      content={analisisData.kelebihan}
                      className="text-gray-700 poppins-regular text-sm leading-relaxed"
                    />
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-orange-100 rounded-xl">
                        <AlertCircle className="w-6 h-6 text-orange-600" />
                      </div>
                      <h3 className="text-lg poppins-bold text-gray-800">Kelemahan</h3>
                    </div>
                    <MarkdownRenderer
                      content={analisisData.kelemahan}
                      className="text-gray-700 poppins-regular text-sm leading-relaxed"
                    />
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-200 rounded-xl">
                      <Lightbulb className="w-6 h-6 text-purple-700" />
                    </div>
                    <h3 className="text-lg poppins-bold text-purple-800">
                      Rekomendasi Pembelajaran
                    </h3>
                  </div>
                  <MarkdownRenderer
                    content={analisisData.rekomendasi_belajar}
                    className="text-gray-700 poppins-regular text-sm leading-relaxed"
                  />
                </div>

                {/* Video Recommendations */}
                {videoLinks.length > 0 && (
                  <div className="no-print bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-red-100 rounded-xl">
                        <Video className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="text-lg poppins-bold text-gray-800">
                        Rekomendasi Video Pembelajaran
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {videoLinks.map((video, index) => {
                        const thumbnail = getYouTubeThumbnail(video.url);
                        const videoId = getYouTubeVideoId(video.url);

                        return (
                          <a
                            key={index}
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-red-300"
                          >
                            {/* Video Thumbnail */}
                            <div className="relative aspect-video bg-gray-200">
                              {thumbnail && videoId ? (
                                <>
                                  <img
                                    src={thumbnail}
                                    alt={video.judul || `Video ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  {/* Play Button Overlay */}
                                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                                    </div>
                                  </div>
                                  {/* Duration Badge (if available) */}
                                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded poppins-semibold">
                                    YouTube
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Video className="w-12 h-12 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Video Info */}
                            <div className="p-4">
                              <p className="text-sm poppins-semibold text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors mb-1">
                                {video.judul || `Video Pembelajaran ${index + 1}`}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {video.url}
                              </p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Teacher Analysis Section */}
            {showTeacherAnalysis && teacherAnalysis && (
              <div className="mt-8 space-y-6 border-t-4 border-purple-300 pt-8">
                <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-white/20 rounded-xl">
                      <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-6 h-6 text-yellow-300" />
                            <h2 className="text-2xl poppins-bold text-white">
                              Analisis Strategi Pembelajaran (Guru)
                            </h2>
                          </div>
                          <p className="text-white/90 poppins-regular">
                            Rekomendasi khusus untuk pengajaran efektif
                          </p>
                        </div>
                        <button
                          onClick={() => setIsTeacherAnalysisOpen(!isTeacherAnalysisOpen)}
                          className="no-print p-2 hover:bg-white/20 rounded-lg transition-all"
                        >
                          {isTeacherAnalysisOpen ? (
                            <ChevronUp className="w-6 h-6 text-white" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collapsible Teacher Analysis Content */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isTeacherAnalysisOpen ? "max-h-[10000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="space-y-6">
                    {/* Diagnosis Pembelajaran */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-purple-100 rounded-xl">
                          <Brain className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl poppins-bold text-gray-800">
                          Diagnosis Pembelajaran
                        </h3>
                      </div>
                      <MarkdownRenderer
                        content={teacherAnalysis.diagnosis_pembelajaran}
                        className="text-gray-700 poppins-regular leading-relaxed"
                      />
                    </div>

                    {/* Pola Belajar & Level Kemampuan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border-2 border-indigo-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-indigo-200 rounded-xl">
                            <Target className="w-6 h-6 text-indigo-700" />
                          </div>
                          <h3 className="text-lg poppins-bold text-indigo-800">
                            Pola Belajar Siswa
                          </h3>
                        </div>
                        <MarkdownRenderer
                          content={teacherAnalysis.pola_belajar_siswa}
                          className="text-gray-700 poppins-regular text-sm leading-relaxed"
                        />
                      </div>

                      <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 border-2 border-teal-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-teal-200 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-teal-700" />
                          </div>
                          <h3 className="text-lg poppins-bold text-teal-800">
                            Level Kemampuan Saat Ini
                          </h3>
                        </div>
                        <MarkdownRenderer
                          content={teacherAnalysis.level_kemampuan_saat_ini}
                          className="text-gray-700 poppins-regular text-sm leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Zona Proximal Development */}
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border-2 border-amber-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-amber-200 rounded-xl">
                          <Lightbulb className="w-6 h-6 text-amber-700" />
                        </div>
                        <h3 className="text-lg poppins-bold text-amber-800">
                          Zona Proximal Development (ZPD)
                        </h3>
                      </div>
                      <MarkdownRenderer
                        content={teacherAnalysis.zona_proximal_development}
                        className="text-gray-700 poppins-regular leading-relaxed"
                      />
                    </div>

                    {/* Strategi Differensiasi & Metode Mengajar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-purple-100 rounded-xl">
                            <BookOpen className="w-6 h-6 text-purple-600" />
                          </div>
                          <h3 className="text-lg poppins-bold text-gray-800">
                            Strategi Differensiasi
                          </h3>
                        </div>
                        <MarkdownRenderer
                          content={parseAndFormatJSON(teacherAnalysis.strategi_differensiasi)}
                          className="text-gray-700 poppins-regular text-sm leading-relaxed"
                        />
                      </div>

                      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-indigo-100 rounded-xl">
                            <GraduationCap className="w-6 h-6 text-indigo-600" />
                          </div>
                          <h3 className="text-lg poppins-bold text-gray-800">
                            Rekomendasi Metode Mengajar
                          </h3>
                        </div>
                        <MarkdownRenderer
                          content={parseAndFormatJSON(teacherAnalysis.rekomendasi_metode_mengajar)}
                          className="text-gray-700 poppins-regular text-sm leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Tips Praktis & Indikator Progress */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-green-200 rounded-xl">
                            <Lightbulb className="w-6 h-6 text-green-700" />
                          </div>
                          <h3 className="text-lg poppins-bold text-green-800">
                            Tips Praktis
                          </h3>
                        </div>
                        <MarkdownRenderer
                          content={parseAndFormatJSON(teacherAnalysis.tips_praktis)}
                          className="text-gray-700 poppins-regular text-sm leading-relaxed"
                        />
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-blue-200 rounded-xl">
                            <Target className="w-6 h-6 text-blue-700" />
                          </div>
                          <h3 className="text-lg poppins-bold text-blue-800">
                            Indikator Progress
                          </h3>
                        </div>
                        <MarkdownRenderer
                          content={parseAndFormatJSON(teacherAnalysis.indikator_progress)}
                          className="text-gray-700 poppins-regular text-sm leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Aktivitas Pembelajaran */}
                    <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-6 border-2 border-rose-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-rose-200 rounded-xl">
                          <BookOpen className="w-6 h-6 text-rose-700" />
                        </div>
                        <h3 className="text-lg poppins-bold text-rose-800">
                          Aktivitas Pembelajaran
                        </h3>
                      </div>
                      <MarkdownRenderer
                        content={parseAndFormatJSON(teacherAnalysis.aktivitas_pembelajaran)}
                        className="text-gray-700 poppins-regular leading-relaxed"
                      />
                    </div>

                    {/* Rekomendasi Video Untuk Guru */}
                    {(() => {
                      // Parse teacher video recommendations
                      let teacherVideoLinks: Array<{ judul?: string; url: string; fokus?: string; durasi?: string }> = [];
                      if (teacherAnalysis.rekomendasi_video_guru) {
                        try {
                          let parsedData: string[] | Array<{ judul?: string; url: string; fokus?: string; durasi?: string }>;
                          if (typeof teacherAnalysis.rekomendasi_video_guru === 'string') {
                            parsedData = JSON.parse(teacherAnalysis.rekomendasi_video_guru);
                          } else {
                            parsedData = teacherAnalysis.rekomendasi_video_guru as string[] | Array<{ judul?: string; url: string; fokus?: string; durasi?: string }>;
                          }

                          // Handle array of strings or array of objects
                          if (Array.isArray(parsedData)) {
                            teacherVideoLinks = parsedData
                              .map((item) => {
                                if (typeof item === 'string') {
                                  return { url: item };
                                } else if (item && typeof item === 'object' && item.url) {
                                  return { judul: item.judul, url: item.url, fokus: item.fokus, durasi: item.durasi };
                                }
                                return null;
                              })
                              .filter((item): item is { judul?: string; url: string; fokus?: string; durasi?: string } => item !== null);
                          }
                        } catch {
                          teacherVideoLinks = [];
                        }
                      }

                      if (teacherVideoLinks.length > 0) {
                        return (
                          <div className="no-print bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-3 bg-purple-100 rounded-xl">
                                <Video className="w-6 h-6 text-purple-600" />
                              </div>
                              <h3 className="text-lg poppins-bold text-gray-800">
                                Rekomendasi Video untuk Guru
                              </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {teacherVideoLinks.map((video, index) => {
                                const thumbnail = getYouTubeThumbnail(video.url);
                                const videoId = getYouTubeVideoId(video.url);

                                return (
                                  <a
                                    key={index}
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-purple-300"
                                  >
                                    {/* Video Thumbnail */}
                                    <div className="relative aspect-video bg-gray-200">
                                      {thumbnail && videoId ? (
                                        <>
                                          <img
                                            src={thumbnail}
                                            alt={video.judul || `Video ${index + 1}`}
                                            className="w-full h-full object-cover"
                                          />
                                          {/* Play Button Overlay */}
                                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                              <Play className="w-8 h-8 text-white ml-1" fill="white" />
                                            </div>
                                          </div>
                                          {/* Duration Badge */}
                                          {video.durasi && (
                                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded poppins-semibold">
                                              {video.durasi}
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <Video className="w-12 h-12 text-gray-400" />
                                        </div>
                                      )}
                                    </div>

                                    {/* Video Info */}
                                    <div className="p-4">
                                      <p className="text-sm poppins-semibold text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors mb-1">
                                        {video.judul || `Video Pembelajaran ${index + 1}`}
                                      </p>
                                      {video.fokus && (
                                        <p className="text-xs text-gray-600 poppins-regular line-clamp-2">
                                          {video.fokus}
                                        </p>
                                      )}
                                      <div className="flex items-center gap-1 mt-2 text-purple-600">
                                        <Play className="w-3 h-3" />
                                        <span className="text-xs poppins-medium">Tonton Video</span>
                                      </div>
                                    </div>
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Teacher Analysis Action Card */}
            {hasilKuisId && !teacherAnalysis && !isAnalyzing && (
              <div className="no-print mt-8">
                <button
                  onClick={handleTeacherAnalysis}
                  disabled={isAnalyzing}
                  className="group w-full bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-3xl p-8 border-2 border-purple-300 hover:border-purple-500 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 text-left relative overflow-hidden"
                >
                  {/* Decorative Elements */}
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-200/30 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-200/30 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

                  {/* Gradient Accent Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 rounded-t-3xl"></div>

                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    {/* Mbah Adaptivin Avatar Section */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                        <div className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-3xl p-4 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          <div className="bg-white rounded-2xl p-3 w-24 h-24 flex items-center justify-center">
                            <Image
                              src="/mascot/mbah-adaptivin.svg"
                              alt="Mbah Adaptivin - AI Guru"
                              width={80}
                              height={80}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2">
                          <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                        </div>
                        <div className="absolute -bottom-2 -left-2">
                          <GraduationCap className="w-7 h-7 text-purple-600 bg-white rounded-full p-1 shadow-md" />
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 text-center md:text-left space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <Brain className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
                          <h3 className="text-2xl md:text-3xl poppins-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Analisis Strategi Pembelajaran
                          </h3>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <div className="px-3 py-1 bg-purple-100 rounded-full">
                            <span className="text-xs poppins-bold text-purple-700">Powered by Mbah Adaptivin AI</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 poppins-medium text-base md:text-lg leading-relaxed max-w-3xl">
                        Dapatkan rekomendasi strategi mengajar yang disesuaikan dengan kebutuhan belajar siswa ini. Analisis berbasis AI akan memberikan insight mendalam tentang pola belajar, zona proximal development, dan metode pengajaran yang efektif.
                      </p>

                      {/* Features Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                        <div className="bg-white/80 backdrop-blur rounded-xl p-3 border-2 border-purple-200 group-hover:border-purple-400 group-hover:shadow-md transition-all">
                          <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                          <p className="text-xs poppins-semibold text-gray-700 text-center">Diagnosis Pembelajaran</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur rounded-xl p-3 border-2 border-indigo-200 group-hover:border-indigo-400 group-hover:shadow-md transition-all">
                          <Lightbulb className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                          <p className="text-xs poppins-semibold text-gray-700 text-center">Zona Proximal</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur rounded-xl p-3 border-2 border-purple-200 group-hover:border-purple-400 group-hover:shadow-md transition-all">
                          <BookOpen className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                          <p className="text-xs poppins-semibold text-gray-700 text-center">Strategi Differensiasi</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur rounded-xl p-3 border-2 border-indigo-200 group-hover:border-indigo-400 group-hover:shadow-md transition-all">
                          <Video className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                          <p className="text-xs poppins-semibold text-gray-700 text-center">Video Referensi</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Arrow */}
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full p-4 group-hover:scale-110 group-hover:translate-x-2 transition-all duration-300 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Loading State for Teacher Analysis */}
            {isAnalyzing && (
              <div className="no-print mt-8">
                <div className="w-full bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-3xl p-8 border-2 border-purple-300 shadow-xl relative overflow-hidden">
                  {/* Gradient Accent Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 rounded-t-3xl"></div>

                  <div className="flex flex-col items-center gap-6 text-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500 rounded-3xl opacity-20 blur-2xl animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-4">
                        <div className="bg-white rounded-2xl p-3 w-24 h-24 flex items-center justify-center">
                          <Image
                            src="/mascot/mbah-adaptivin.svg"
                            alt="Mbah Adaptivin sedang bekerja"
                            width={80}
                            height={80}
                            className="w-full h-full object-contain animate-pulse"
                          />
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <RefreshCw className="w-8 h-8 text-purple-600 bg-white rounded-full p-1 shadow-md animate-spin" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl poppins-bold text-purple-600 mb-2">
                        Mbah Adaptivin Sedang Menganalisis...
                      </h3>
                      <p className="text-gray-600 poppins-medium max-w-2xl">
                        AI sedang menyusun rekomendasi pembelajaran yang disesuaikan dengan kebutuhan siswa. Proses ini membutuhkan waktu beberapa saat.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Re-analyze Button (when teacher analysis exists) */}
            {hasilKuisId && teacherAnalysis && !isAnalyzing && (
              <div className="no-print mt-6 flex gap-4 justify-end">
                <button
                  onClick={handleTeacherAnalysis}
                  className="group px-8 py-4 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white rounded-xl poppins-semibold hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center gap-3">
                    <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                    <Brain className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-lg">Analisis Ulang untuk Guru</span>
                  </div>
                </button>
              </div>
            )}

            {/* Print Button */}
            <div className="no-print mt-6 flex justify-end">
              <button
                onClick={handlePrint}
                disabled={!analisisData}
                className={`group px-8 py-4 bg-gradient-to-r from-[#336D82] to-[#5a96a8] text-white rounded-xl poppins-semibold hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 ${!analisisData ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
              >
                <Printer className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-lg">Cetak Laporan Analisis</span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AnalysisAISection;
