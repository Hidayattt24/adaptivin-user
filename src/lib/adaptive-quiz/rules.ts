/**
 * Adaptive Quiz - Rule-Based Algorithm
 *
 * Core algorithm untuk menentukan level kesulitan soal berikutnya
 * berdasarkan performa siswa (akurasi dan kecepatan)
 *
 * Algoritma ini mengimplementasikan rule-based system yang:
 * 1. Menghitung kecepatan jawaban (cepat/sedang/lambat)
 * 2. Menentukan apakah level naik, turun, atau tetap
 * 3. Tracking streak (berturut-turut) untuk konsistensi
 */

import type { AnswerInput, AnswerSpeed, AnswerResult, QuestionLevel, QuizState } from "./types";
import {
  LEVEL_TO_NUMBER,
  NUMBER_TO_LEVEL,
  L_MIN,
  L_MAX,
  STREAK_CORRECT_SEDANG_THRESHOLD,
  STREAK_CORRECT_SLOW_THRESHOLD,
  STREAK_WRONG_THRESHOLD,
} from "./constants";

/**
 * Menentukan kategori kecepatan menjawab berdasarkan waktu
 *
 * Rules:
 * - IF time ≤ T_FAST      → "cepat"
 * - ELSE IF time ≤ T_SLOW → "sedang"
 * - ELSE                  → "lambat"
 *
 * @param timeSpent - Waktu yang dihabiskan siswa (detik)
 * @param timeFastThreshold - Batas waktu untuk kategori cepat (detik)
 * @param timeSlowThreshold - Batas waktu untuk kategori lambat (detik)
 * @returns Kategori kecepatan
 */
export function categorizeSpeed(
  timeSpent: number,
  timeFastThreshold: number,
  timeSlowThreshold: number
): AnswerSpeed {
  if (timeSpent <= timeFastThreshold) {
    return "cepat";
  } else if (timeSpent <= timeSlowThreshold) {
    return "sedang";
  } else {
    return "lambat";
  }
}

/**
 * Clamp level agar tetap dalam range L_MIN sampai L_MAX
 *
 * @param level - Level yang akan di-clamp
 * @returns Level yang valid dalam range
 */
export function clampLevel(level: QuestionLevel): QuestionLevel {
  const levelNum = LEVEL_TO_NUMBER[level];
  const minNum = LEVEL_TO_NUMBER[L_MIN];
  const maxNum = LEVEL_TO_NUMBER[L_MAX];

  const clampedNum = Math.max(minNum, Math.min(maxNum, levelNum));
  return NUMBER_TO_LEVEL[clampedNum];
}

/**
 * Menaikkan level sebanyak step
 *
 * @param currentLevel - Level saat ini
 * @param step - Jumlah level yang ingin dinaikkan (default: 1)
 * @returns Level baru setelah dinaikkan dan di-clamp
 */
export function increaseLevelBy(currentLevel: QuestionLevel, step: number = 1): QuestionLevel {
  const currentNum = LEVEL_TO_NUMBER[currentLevel];
  const newNum = currentNum + step;
  const newLevel = NUMBER_TO_LEVEL[Math.min(newNum, LEVEL_TO_NUMBER[L_MAX])];
  return clampLevel(newLevel);
}

/**
 * Menurunkan level sebanyak step
 *
 * @param currentLevel - Level saat ini
 * @param step - Jumlah level yang ingin diturunkan (default: 1)
 * @returns Level baru setelah diturunkan dan di-clamp
 */
export function decreaseLevelBy(currentLevel: QuestionLevel, step: number = 1): QuestionLevel {
  const currentNum = LEVEL_TO_NUMBER[currentLevel];
  const newNum = currentNum - step;
  const newLevel = NUMBER_TO_LEVEL[Math.max(newNum, LEVEL_TO_NUMBER[L_MIN])];
  return clampLevel(newLevel);
}

/**
 * Core rule-based algorithm untuk memproses jawaban siswa
 * dan menentukan level soal berikutnya
 *
 * Algoritma lengkap sesuai spesifikasi:
 *
 * CASE PENENTUAN HASIL:
 *   IF is_correct:
 *      streak_correct_any += 1
 *      streak_wrong_at_level = 0
 *
 *      CASE LEVEL NAIK:
 *        1) Benar + cepat → naik 1
 *        2) Benar + sedang; 3 benar beruntun → naik 1
 *        3) Benar + lambat → tetap; tapi hitung konsistensi
 *           - IF streak_correct_slow ≥ 3 → naik 1
 *
 *   ELSE: // jawaban salah
 *      streak_correct_any = 0
 *      streak_correct_slow = 0
 *      streak_wrong_at_level += 1
 *
 *      CASE LEVEL TURUN:
 *        1) Salah + lambat → turun 1
 *        2) Salah 2x berturut-turut di level ini → turun 1
 *        3) Salah + cepat/sedang (baru 1x) → level tetap
 *
 * BATAS LEVEL: next_level = clamp(next_level, L_MIN, L_MAX)
 * JIKA LEVEL BERUBAH → reset streak_wrong_at_level
 *
 * @param currentState - State quiz saat ini
 * @param answer - Input jawaban siswa
 * @returns Hasil processing beserta state baru
 */
export function processAnswer(currentState: QuizState, answer: AnswerInput): AnswerResult {
  // 1. Tentukan kecepatan menjawab
  const speed = categorizeSpeed(
    answer.timeSpent,
    answer.timeFastThreshold,
    answer.timeSlowThreshold
  );

  // Clone state untuk update
  let streakCorrectAny = currentState.streakCorrectAny;
  let streakCorrectSlow = currentState.streakCorrectSlow;
  let streakWrongAtLevel = currentState.streakWrongAtLevel;
  let nextLevel = currentState.currentLevel;
  let reason = "";

  const previousLevel = currentState.currentLevel;

  // 2. Proses berdasarkan benar/salah
  if (answer.isCorrect) {
    // === JAWABAN BENAR ===
    streakCorrectAny += 1;
    streakWrongAtLevel = 0;

    // Tentukan apakah level naik
    if (speed === "cepat") {
      // 1) Benar + cepat → naik 1 level
      nextLevel = increaseLevelBy(currentState.currentLevel, 1);
      streakCorrectSlow = 0;
      reason = "Jawaban benar dan cepat → naik 1 level";
    } else if (speed === "sedang") {
      if (streakCorrectAny >= STREAK_CORRECT_SEDANG_THRESHOLD) {
        // 2) Benar + sedang; 3 benar beruntun → naik 1 level
        nextLevel = increaseLevelBy(currentState.currentLevel, 1);
        streakCorrectSlow = 0;
        reason = `Jawaban benar sedang dengan ${streakCorrectAny} benar beruntun (≥${STREAK_CORRECT_SEDANG_THRESHOLD}) → naik 1 level`;
      } else {
        // Benar + sedang tapi belum 3 beruntun → tetap
        nextLevel = currentState.currentLevel;
        streakCorrectSlow = 0;
        reason = `Jawaban benar sedang tapi baru ${streakCorrectAny} beruntun (<${STREAK_CORRECT_SEDANG_THRESHOLD}) → level tetap`;
      }
    } else if (speed === "lambat") {
      // 3) Benar + lambat → tetap; tapi hitung konsistensi
      streakCorrectSlow += 1;

      if (streakCorrectSlow >= STREAK_CORRECT_SLOW_THRESHOLD) {
        // Konsisten benar meski lambat → naik 1 level
        nextLevel = increaseLevelBy(currentState.currentLevel, 1);
        streakCorrectSlow = 0;
        reason = `Jawaban benar lambat konsisten ${streakCorrectSlow}x (≥${STREAK_CORRECT_SLOW_THRESHOLD}) → naik 1 level`;
      } else {
        nextLevel = currentState.currentLevel;
        reason = `Jawaban benar tapi lambat (${streakCorrectSlow}/${STREAK_CORRECT_SLOW_THRESHOLD}) → level tetap, hitung konsistensi`;
      }
    }
  } else {
    // === JAWABAN SALAH ===
    streakCorrectAny = 0;
    streakCorrectSlow = 0;
    streakWrongAtLevel += 1;

    // Tentukan apakah level turun
    if (speed === "lambat") {
      // 1) Salah + lambat → turun 1 level
      nextLevel = decreaseLevelBy(currentState.currentLevel, 1);
      streakWrongAtLevel = 0; // Reset setelah turun
      reason = "Jawaban salah dan lambat → turun 1 level";
    } else if (streakWrongAtLevel >= STREAK_WRONG_THRESHOLD) {
      // 2) Salah 2x berturut-turut di level ini → turun 1 level
      nextLevel = decreaseLevelBy(currentState.currentLevel, 1);
      streakWrongAtLevel = 0; // Reset setelah turun
      reason = `Jawaban salah ${streakWrongAtLevel}x berturut-turut (≥${STREAK_WRONG_THRESHOLD}) → turun 1 level`;
    } else {
      // 3) Salah + cepat/sedang (baru 1x) → level tetap
      nextLevel = currentState.currentLevel;
      reason = `Jawaban salah ${speed} (${streakWrongAtLevel}/${STREAK_WRONG_THRESHOLD}) → level tetap`;
    }
  }

  // 3. Clamp level ke batas yang valid
  nextLevel = clampLevel(nextLevel);

  // 4. Reset streak_wrong_at_level jika level berubah
  const levelChanged = nextLevel !== previousLevel;
  if (levelChanged) {
    streakWrongAtLevel = 0;
  }

  // 5. Return hasil
  return {
    speed,
    previousLevel,
    nextLevel,
    levelChanged,
    updatedState: {
      currentLevel: nextLevel,
      streakCorrectAny,
      streakCorrectSlow,
      streakWrongAtLevel,
      history: currentState.history, // Will be updated by tracker
    },
    reason,
  };
}

/**
 * Helper untuk mendapatkan informasi apakah sudah di level maksimum/minimum
 */
export function isAtMaxLevel(level: QuestionLevel): boolean {
  return level === L_MAX;
}

export function isAtMinLevel(level: QuestionLevel): boolean {
  return level === L_MIN;
}
