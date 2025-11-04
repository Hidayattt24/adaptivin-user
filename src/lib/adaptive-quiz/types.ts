/**
 * Adaptive Quiz - Type Definitions
 *
 * Type definitions untuk sistem rule-based adaptive quiz
 * yang mengatur level kesulitan soal berdasarkan performa siswa
 */

/**
 * Kategori soal berdasarkan Taksonomi Bloom
 * C1: Mengingat
 * C2: Memahami
 * C3: Menerapkan
 * C4: Menganalisis (default starting level)
 * C5: Mengevaluasi
 * C6: Mencipta
 */
export type QuestionLevel = "C1" | "C2" | "C3" | "C4" | "C5" | "C6";

/**
 * Kategori kecepatan menjawab berdasarkan waktu yang dihabiskan
 */
export type AnswerSpeed = "cepat" | "sedang" | "lambat";

/**
 * State dari quiz session untuk tracking performa siswa
 */
export interface QuizState {
  /** Level kesulitan saat ini (C1-C6) */
  currentLevel: QuestionLevel;

  /** Jumlah jawaban benar berturut-turut (any speed) */
  streakCorrectAny: number;

  /** Jumlah jawaban benar lambat berturut-turut */
  streakCorrectSlow: number;

  /** Jumlah jawaban salah berturut-turut di level yang sama */
  streakWrongAtLevel: number;

  /** History semua jawaban untuk analisis */
  history: QuizHistoryItem[];
}

/**
 * Input untuk setiap jawaban siswa
 */
export interface AnswerInput {
  /** ID pertanyaan */
  questionId: string;

  /** Level pertanyaan saat dijawab */
  questionLevel: QuestionLevel;

  /** Apakah jawaban benar */
  isCorrect: boolean;

  /** Waktu yang dihabiskan untuk menjawab (dalam detik) */
  timeSpent: number;

  /** Batas waktu cepat yang ditetapkan guru (dalam detik) */
  timeFastThreshold: number;

  /** Batas waktu lambat yang ditetapkan guru (dalam detik) */
  timeSlowThreshold: number;
}

/**
 * Hasil dari processing jawaban
 */
export interface AnswerResult {
  /** Kecepatan menjawab */
  speed: AnswerSpeed;

  /** Level sebelum update */
  previousLevel: QuestionLevel;

  /** Level setelah update */
  nextLevel: QuestionLevel;

  /** Apakah level berubah */
  levelChanged: boolean;

  /** State terkini setelah update */
  updatedState: QuizState;

  /** Penjelasan alasan perubahan/tidak berubah level */
  reason: string;
}

/**
 * Item history untuk logging dan analisis
 */
export interface QuizHistoryItem {
  /** Timestamp jawaban */
  timestamp: Date;

  /** ID pertanyaan */
  questionId: string;

  /** Apakah jawaban benar */
  isCorrect: boolean;

  /** Waktu yang dihabiskan (detik) */
  timeSpent: number;

  /** Kecepatan menjawab */
  speed: AnswerSpeed;

  /** Level sebelum menjawab */
  previousLevel: QuestionLevel;

  /** Level setelah menjawab */
  currentLevel: QuestionLevel;

  /** Streak correct any saat itu */
  streakCorrectAny: number;

  /** Streak wrong at level saat itu */
  streakWrongAtLevel: number;

  /** Streak correct slow saat itu */
  streakCorrectSlow: number;
}

/**
 * Konfigurasi threshold waktu untuk menentukan kecepatan
 */
export interface TimeThresholds {
  /** Batas waktu untuk kategori "cepat" (detik) */
  fast: number;

  /** Batas waktu untuk kategori "lambat" (detik) */
  slow: number;
}

/**
 * Summary performa siswa untuk rekomendasi AI
 */
export interface PerformanceSummary {
  /** Total pertanyaan dijawab */
  totalQuestions: number;

  /** Total jawaban benar */
  totalCorrect: number;

  /** Total jawaban salah */
  totalWrong: number;

  /** Persentase akurasi */
  accuracyPercent: number;

  /** Distribusi jawaban per level */
  levelDistribution: Record<QuestionLevel, {
    total: number;
    correct: number;
    wrong: number;
  }>;

  /** Distribusi kecepatan jawaban */
  speedDistribution: Record<AnswerSpeed, number>;

  /** Rata-rata waktu menjawab per level (detik) */
  averageTimePerLevel: Record<QuestionLevel, number>;

  /** Level akhir siswa */
  finalLevel: QuestionLevel;

  /** Saran untuk improvement */
  weaknesses: QuestionLevel[];

  /** Level yang sudah dikuasai */
  strengths: QuestionLevel[];
}
