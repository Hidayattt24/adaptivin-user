/**
 * Adaptive Quiz - Main Export
 *
 * Central export untuk semua modul adaptive quiz system
 *
 * Usage Example:
 * ```typescript
 * import { QuizStateTracker, processAnswer, generatePerformanceSummary } from '@/lib/adaptive-quiz';
 *
 * // Create tracker
 * const tracker = new QuizStateTracker();
 *
 * // Submit answer
 * const result = tracker.submitAnswer({
 *   questionId: "q1",
 *   questionLevel: "C4",
 *   isCorrect: true,
 *   timeSpent: 30,
 *   timeFastThreshold: 45,
 *   timeSlowThreshold: 90
 * });
 *
 * // Check result
 * console.log(`Next level: ${result.nextLevel}`);
 * console.log(`Reason: ${result.reason}`);
 *
 * // Get performance summary
 * const summary = generatePerformanceSummary(
 *   tracker.getHistory(),
 *   tracker.getCurrentLevel()
 * );
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================
export type {
  QuestionLevel,
  AnswerSpeed,
  QuizState,
  AnswerInput,
  AnswerResult,
  QuizHistoryItem,
  TimeThresholds,
  PerformanceSummary,
} from "./types";

// ============================================================================
// CONSTANTS
// ============================================================================
export {
  L_MIN,
  L_MAX,
  DEFAULT_STARTING_LEVEL,
  LEVEL_TO_NUMBER,
  NUMBER_TO_LEVEL,
  LEVEL_LABELS,
  LEVEL_DESCRIPTIONS,
  STREAK_CORRECT_SEDANG_THRESHOLD,
  STREAK_CORRECT_SLOW_THRESHOLD,
  STREAK_WRONG_THRESHOLD,
  DEFAULT_TIME_THRESHOLDS,
  ACCURACY_THRESHOLDS,
  MIN_QUESTIONS_FOR_ANALYSIS,
} from "./constants";

// ============================================================================
// RULE ENGINE
// ============================================================================
export {
  categorizeSpeed,
  clampLevel,
  increaseLevelBy,
  decreaseLevelBy,
  processAnswer,
  isAtMaxLevel,
  isAtMinLevel,
} from "./rules";

// ============================================================================
// STATE TRACKER
// ============================================================================
export {
  createInitialState,
  QuizStateTracker,
  serializeState,
  deserializeState,
} from "./tracker";

// ============================================================================
// LOGGER & ANALYTICS
// ============================================================================
export {
  logAnswerToHistory,
  generatePerformanceSummary,
  formatSummaryForAI,
  exportHistoryToCSV,
  generateVideoRecommendations,
} from "./logger";
