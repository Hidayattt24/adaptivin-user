/**
 * Adaptive Quiz - Constants
 *
 * Konstanta dan konfigurasi untuk sistem rule-based adaptive quiz
 */

import type { QuestionLevel } from "./types";

/**
 * Level minimum yang bisa dicapai siswa
 */
export const L_MIN: QuestionLevel = "C1";

/**
 * Level maksimum yang bisa dicapai siswa
 */
export const L_MAX: QuestionLevel = "C6";

/**
 * Level default saat siswa mulai quiz
 * Berdasarkan spesifikasi: default pengerjaan awal adalah C4
 */
export const DEFAULT_STARTING_LEVEL: QuestionLevel = "C4";

/**
 * Mapping level ke nilai numerik untuk perhitungan naik/turun level
 */
export const LEVEL_TO_NUMBER: Record<QuestionLevel, number> = {
  C1: 1,
  C2: 2,
  C3: 3,
  C4: 4,
  C5: 5,
  C6: 6,
};

/**
 * Mapping nilai numerik kembali ke level
 */
export const NUMBER_TO_LEVEL: Record<number, QuestionLevel> = {
  1: "C1",
  2: "C2",
  3: "C3",
  4: "C4",
  5: "C5",
  6: "C6",
};

/**
 * Jumlah jawaban benar berturut-turut (sedang) untuk naik level
 */
export const STREAK_CORRECT_SEDANG_THRESHOLD = 3;

/**
 * Jumlah jawaban benar lambat berturut-turut untuk naik level
 */
export const STREAK_CORRECT_SLOW_THRESHOLD = 3;

/**
 * Jumlah jawaban salah berturut-turut di level yang sama untuk turun level
 */
export const STREAK_WRONG_THRESHOLD = 2;

/**
 * Label deskriptif untuk setiap level (Taksonomi Bloom)
 */
export const LEVEL_LABELS: Record<QuestionLevel, string> = {
  C1: "Mengingat",
  C2: "Memahami",
  C3: "Menerapkan",
  C4: "Menganalisis",
  C5: "Mengevaluasi",
  C6: "Mencipta",
};

/**
 * Deskripsi kemampuan untuk setiap level
 */
export const LEVEL_DESCRIPTIONS: Record<QuestionLevel, string> = {
  C1: "Kemampuan mengingat dan mengenali informasi dasar",
  C2: "Kemampuan memahami makna dan konsep",
  C3: "Kemampuan menerapkan pengetahuan dalam situasi baru",
  C4: "Kemampuan menganalisis dan memecah informasi kompleks",
  C5: "Kemampuan mengevaluasi dan membuat penilaian",
  C6: "Kemampuan mencipta dan menghasilkan sesuatu yang baru",
};

/**
 * Default time thresholds jika tidak ada input dari guru
 * Catatan: Ini hanya fallback. Waktu sebenarnya akan diambil dari input guru per soal
 */
export const DEFAULT_TIME_THRESHOLDS = {
  /** 50% dari total waktu = cepat */
  FAST_PERCENTAGE: 0.5,

  /** 100% dari total waktu = batas lambat */
  SLOW_PERCENTAGE: 1.0,
};

/**
 * Threshold persentase akurasi untuk menentukan strength/weakness
 */
export const ACCURACY_THRESHOLDS = {
  /** Level dianggap strength jika akurasi >= 80% */
  STRENGTH: 0.8,

  /** Level dianggap weakness jika akurasi < 50% */
  WEAKNESS: 0.5,
};

/**
 * Minimum jumlah soal di suatu level untuk dianggap valid dalam analisis
 */
export const MIN_QUESTIONS_FOR_ANALYSIS = 2;
