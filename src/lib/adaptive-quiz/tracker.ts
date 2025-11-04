/**
 * Adaptive Quiz - State Tracker
 *
 * Mengelola state quiz session dan tracking performa siswa
 * selama mengerjakan quiz
 */

import type { AnswerInput, AnswerResult, QuizHistoryItem, QuizState } from "./types";
import { DEFAULT_STARTING_LEVEL } from "./constants";
import { processAnswer } from "./rules";
import { logAnswerToHistory } from "./logger";

/**
 * Membuat initial state baru untuk quiz session
 *
 * @param startingLevel - Level awal (default: C4)
 * @returns Initial quiz state
 */
export function createInitialState(
  startingLevel = DEFAULT_STARTING_LEVEL
): QuizState {
  return {
    currentLevel: startingLevel,
    streakCorrectAny: 0,
    streakCorrectSlow: 0,
    streakWrongAtLevel: 0,
    history: [],
  };
}

/**
 * Class untuk mengelola state quiz session
 *
 * Menyediakan interface yang mudah untuk:
 * - Submit jawaban
 * - Track state
 * - Get history
 * - Get recommendations
 */
export class QuizStateTracker {
  private state: QuizState;

  constructor(startingLevel = DEFAULT_STARTING_LEVEL) {
    this.state = createInitialState(startingLevel);
  }

  /**
   * Mendapatkan state terkini
   */
  public getState(): Readonly<QuizState> {
    return { ...this.state };
  }

  /**
   * Mendapatkan level saat ini
   */
  public getCurrentLevel() {
    return this.state.currentLevel;
  }

  /**
   * Mendapatkan history jawaban
   */
  public getHistory(): ReadonlyArray<QuizHistoryItem> {
    return [...this.state.history];
  }

  /**
   * Submit jawaban siswa dan update state
   *
   * @param answer - Input jawaban siswa
   * @returns Hasil processing jawaban
   */
  public submitAnswer(answer: AnswerInput): AnswerResult {
    // Process jawaban dengan rule-based algorithm
    const result = processAnswer(this.state, answer);

    // Update state dengan hasil baru
    this.state = result.updatedState;

    // Log ke history
    const historyItem = logAnswerToHistory(answer, result);
    this.state.history.push(historyItem);

    return result;
  }

  /**
   * Reset state (mulai quiz baru)
   *
   * @param startingLevel - Level awal baru
   */
  public reset(startingLevel = DEFAULT_STARTING_LEVEL): void {
    this.state = createInitialState(startingLevel);
  }

  /**
   * Load state dari existing data (misalnya dari database/sessionStorage)
   *
   * @param savedState - State yang disimpan sebelumnya
   */
  public loadState(savedState: QuizState): void {
    this.state = { ...savedState };
  }

  /**
   * Export state untuk disimpan (ke database/sessionStorage)
   *
   * @returns State yang bisa diserialisasi
   */
  public exportState(): QuizState {
    return {
      ...this.state,
      history: this.state.history.map((item) => ({
        ...item,
        timestamp: item.timestamp,
      })),
    };
  }

  /**
   * Get total pertanyaan yang sudah dijawab
   */
  public getTotalAnswered(): number {
    return this.state.history.length;
  }

  /**
   * Get total jawaban benar
   */
  public getTotalCorrect(): number {
    return this.state.history.filter((item) => item.isCorrect).length;
  }

  /**
   * Get total jawaban salah
   */
  public getTotalWrong(): number {
    return this.state.history.filter((item) => !item.isCorrect).length;
  }

  /**
   * Get akurasi (persentase jawaban benar)
   */
  public getAccuracy(): number {
    const total = this.getTotalAnswered();
    if (total === 0) return 0;

    const correct = this.getTotalCorrect();
    return (correct / total) * 100;
  }

  /**
   * Check apakah sedang dalam streak benar
   */
  public isOnCorrectStreak(): boolean {
    return this.state.streakCorrectAny > 0;
  }

  /**
   * Check apakah sedang dalam streak salah
   */
  public isOnWrongStreak(): boolean {
    return this.state.streakWrongAtLevel > 0;
  }

  /**
   * Get informasi streak saat ini
   */
  public getStreakInfo() {
    return {
      correctAny: this.state.streakCorrectAny,
      correctSlow: this.state.streakCorrectSlow,
      wrongAtLevel: this.state.streakWrongAtLevel,
    };
  }
}

/**
 * Serialize QuizState ke JSON string untuk penyimpanan
 *
 * @param state - State yang akan diserialisasi
 * @returns JSON string
 */
export function serializeState(state: QuizState): string {
  return JSON.stringify({
    ...state,
    history: state.history.map((item) => ({
      ...item,
      timestamp: item.timestamp.toISOString(),
    })),
  });
}

/**
 * Deserialize JSON string kembali ke QuizState
 *
 * @param json - JSON string
 * @returns QuizState object
 */
export function deserializeState(json: string): QuizState {
  const parsed = JSON.parse(json);

  return {
    ...parsed,
    history: parsed.history.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    })),
  };
}
