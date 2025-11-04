/**
 * Adaptive Quiz - Logger & Analytics
 *
 * Mengelola logging history jawaban dan analisis performa siswa
 * untuk rekomendasi AI dan laporan guru
 */

import type {
  AnswerInput,
  AnswerResult,
  AnswerSpeed,
  PerformanceSummary,
  QuestionLevel,
  QuizHistoryItem,
} from "./types";
import {
  ACCURACY_THRESHOLDS,
  LEVEL_TO_NUMBER,
  MIN_QUESTIONS_FOR_ANALYSIS,
} from "./constants";

/**
 * Membuat history item dari jawaban dan hasil processing
 *
 * @param answer - Input jawaban siswa
 * @param result - Hasil processing dari rule engine
 * @returns History item untuk logging
 */
export function logAnswerToHistory(
  answer: AnswerInput,
  result: AnswerResult
): QuizHistoryItem {
  return {
    timestamp: new Date(),
    questionId: answer.questionId,
    isCorrect: answer.isCorrect,
    timeSpent: answer.timeSpent,
    speed: result.speed,
    previousLevel: result.previousLevel,
    currentLevel: result.nextLevel,
    streakCorrectAny: result.updatedState.streakCorrectAny,
    streakWrongAtLevel: result.updatedState.streakWrongAtLevel,
    streakCorrectSlow: result.updatedState.streakCorrectSlow,
  };
}

/**
 * Generate performance summary dari history untuk analisis dan rekomendasi AI
 *
 * @param history - History jawaban siswa
 * @param finalLevel - Level akhir siswa
 * @returns Summary performa lengkap
 */
export function generatePerformanceSummary(
  history: QuizHistoryItem[],
  finalLevel: QuestionLevel
): PerformanceSummary {
  const totalQuestions = history.length;
  const totalCorrect = history.filter((item) => item.isCorrect).length;
  const totalWrong = totalQuestions - totalCorrect;
  const accuracyPercent = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  // Inisialisasi distribusi per level
  const levelDistribution: Record<
    QuestionLevel,
    { total: number; correct: number; wrong: number }
  > = {
    C1: { total: 0, correct: 0, wrong: 0 },
    C2: { total: 0, correct: 0, wrong: 0 },
    C3: { total: 0, correct: 0, wrong: 0 },
    C4: { total: 0, correct: 0, wrong: 0 },
    C5: { total: 0, correct: 0, wrong: 0 },
    C6: { total: 0, correct: 0, wrong: 0 },
  };

  // Inisialisasi distribusi kecepatan
  const speedDistribution: Record<AnswerSpeed, number> = {
    cepat: 0,
    sedang: 0,
    lambat: 0,
  };

  // Tracking waktu per level
  const timePerLevel: Record<QuestionLevel, number[]> = {
    C1: [],
    C2: [],
    C3: [],
    C4: [],
    C5: [],
    C6: [],
  };

  // Analisis setiap history item
  history.forEach((item) => {
    const level = item.previousLevel; // Level soal yang dijawab

    // Update distribusi level
    levelDistribution[level].total += 1;
    if (item.isCorrect) {
      levelDistribution[level].correct += 1;
    } else {
      levelDistribution[level].wrong += 1;
    }

    // Update distribusi kecepatan
    speedDistribution[item.speed] += 1;

    // Track waktu untuk rata-rata
    timePerLevel[level].push(item.timeSpent);
  });

  // Hitung rata-rata waktu per level
  const averageTimePerLevel: Record<QuestionLevel, number> = {
    C1: calculateAverage(timePerLevel.C1),
    C2: calculateAverage(timePerLevel.C2),
    C3: calculateAverage(timePerLevel.C3),
    C4: calculateAverage(timePerLevel.C4),
    C5: calculateAverage(timePerLevel.C5),
    C6: calculateAverage(timePerLevel.C6),
  };

  // Identifikasi kelemahan (weakness) dan kekuatan (strength)
  const weaknesses: QuestionLevel[] = [];
  const strengths: QuestionLevel[] = [];

  (Object.keys(levelDistribution) as QuestionLevel[]).forEach((level) => {
    const data = levelDistribution[level];

    // Hanya analisis jika ada cukup soal di level ini
    if (data.total >= MIN_QUESTIONS_FOR_ANALYSIS) {
      const accuracy = data.correct / data.total;

      if (accuracy < ACCURACY_THRESHOLDS.WEAKNESS) {
        weaknesses.push(level);
      } else if (accuracy >= ACCURACY_THRESHOLDS.STRENGTH) {
        strengths.push(level);
      }
    }
  });

  // Sort berdasarkan level number
  weaknesses.sort((a, b) => LEVEL_TO_NUMBER[a] - LEVEL_TO_NUMBER[b]);
  strengths.sort((a, b) => LEVEL_TO_NUMBER[a] - LEVEL_TO_NUMBER[b]);

  return {
    totalQuestions,
    totalCorrect,
    totalWrong,
    accuracyPercent: Math.round(accuracyPercent * 100) / 100, // 2 decimal places
    levelDistribution,
    speedDistribution,
    averageTimePerLevel,
    finalLevel,
    weaknesses,
    strengths,
  };
}

/**
 * Helper untuk menghitung rata-rata
 */
function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / numbers.length) * 100) / 100; // 2 decimal places
}

/**
 * Format performance summary ke string yang readable untuk AI
 *
 * @param summary - Performance summary
 * @returns Formatted string untuk AI analysis
 */
export function formatSummaryForAI(summary: PerformanceSummary): string {
  const lines: string[] = [];

  lines.push("=== RINGKASAN PERFORMA SISWA ===\n");

  // Overall stats
  lines.push("STATISTIK KESELURUHAN:");
  lines.push(`- Total Pertanyaan: ${summary.totalQuestions}`);
  lines.push(`- Jawaban Benar: ${summary.totalCorrect}`);
  lines.push(`- Jawaban Salah: ${summary.totalWrong}`);
  lines.push(`- Akurasi: ${summary.accuracyPercent.toFixed(2)}%`);
  lines.push(`- Level Akhir: ${summary.finalLevel}\n`);

  // Level distribution
  lines.push("DISTRIBUSI PER LEVEL:");
  (Object.keys(summary.levelDistribution) as QuestionLevel[]).forEach((level) => {
    const data = summary.levelDistribution[level];
    if (data.total > 0) {
      const acc = ((data.correct / data.total) * 100).toFixed(1);
      lines.push(
        `- ${level}: ${data.correct}/${data.total} benar (${acc}%) | Rata-rata waktu: ${summary.averageTimePerLevel[level].toFixed(1)}s`
      );
    }
  });
  lines.push("");

  // Speed distribution
  lines.push("DISTRIBUSI KECEPATAN:");
  lines.push(`- Cepat: ${summary.speedDistribution.cepat} jawaban`);
  lines.push(`- Sedang: ${summary.speedDistribution.sedang} jawaban`);
  lines.push(`- Lambat: ${summary.speedDistribution.lambat} jawaban\n`);

  // Strengths
  if (summary.strengths.length > 0) {
    lines.push("KEKUATAN (Level Dikuasai):");
    summary.strengths.forEach((level) => {
      const data = summary.levelDistribution[level];
      const acc = ((data.correct / data.total) * 100).toFixed(1);
      lines.push(`- ${level}: ${acc}% akurasi`);
    });
    lines.push("");
  }

  // Weaknesses
  if (summary.weaknesses.length > 0) {
    lines.push("KELEMAHAN (Perlu Improvement):");
    summary.weaknesses.forEach((level) => {
      const data = summary.levelDistribution[level];
      const acc = ((data.correct / data.total) * 100).toFixed(1);
      lines.push(`- ${level}: ${acc}% akurasi`);
    });
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Export history ke CSV format untuk analisis eksternal
 *
 * @param history - History jawaban
 * @returns CSV string
 */
export function exportHistoryToCSV(history: QuizHistoryItem[]): string {
  const headers = [
    "Timestamp",
    "Question ID",
    "Is Correct",
    "Time Spent (s)",
    "Speed",
    "Previous Level",
    "Current Level",
    "Streak Correct Any",
    "Streak Wrong At Level",
    "Streak Correct Slow",
  ];

  const rows = history.map((item) => [
    item.timestamp.toISOString(),
    item.questionId,
    item.isCorrect ? "TRUE" : "FALSE",
    item.timeSpent.toString(),
    item.speed,
    item.previousLevel,
    item.currentLevel,
    item.streakCorrectAny.toString(),
    item.streakWrongAtLevel.toString(),
    item.streakCorrectSlow.toString(),
  ]);

  const csvLines = [headers.join(","), ...rows.map((row) => row.join(","))];

  return csvLines.join("\n");
}

/**
 * Generate rekomendasi video pembelajaran berdasarkan weakness
 *
 * @param weaknesses - Array level yang menjadi kelemahan
 * @returns Array rekomendasi untuk setiap level weakness
 */
export function generateVideoRecommendations(
  weaknesses: QuestionLevel[]
): Array<{ level: QuestionLevel; recommendation: string }> {
  const recommendations = {
    C1: "Video pembelajaran untuk memperkuat kemampuan mengingat dan mengenali konsep dasar",
    C2: "Video pembelajaran untuk meningkatkan pemahaman konsep dan makna",
    C3: "Video pembelajaran untuk melatih penerapan pengetahuan dalam situasi baru",
    C4: "Video pembelajaran untuk mengasah kemampuan analisis dan pemecahan masalah",
    C5: "Video pembelajaran untuk melatih evaluasi dan penilaian kritis",
    C6: "Video pembelajaran untuk mengembangkan kreativitas dan kemampuan mencipta",
  };

  return weaknesses.map((level) => ({
    level,
    recommendation: recommendations[level],
  }));
}
