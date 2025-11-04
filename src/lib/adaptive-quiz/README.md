# Adaptive Quiz - Rule-Based Algorithm

Sistem **Rule-Based Adaptive Quiz** untuk mengukur dan menyesuaikan tingkat kesulitan soal berdasarkan performa siswa (akurasi dan kecepatan).

## Konsep Dasar

### Kategori Soal (Taksonomi Bloom)

Sistem menggunakan 6 level kesulitan berdasarkan Taksonomi Bloom:

- **C1** - Mengingat: Kemampuan mengingat dan mengenali informasi dasar
- **C2** - Memahami: Kemampuan memahami makna dan konsep
- **C3** - Menerapkan: Kemampuan menerapkan pengetahuan dalam situasi baru
- **C4** - Menganalisis: Kemampuan menganalisis dan memecah informasi kompleks (**Default Starting Level**)
- **C5** - Mengevaluasi: Kemampuan mengevaluasi dan membuat penilaian
- **C6** - Mencipta: Kemampuan mencipta dan menghasilkan sesuatu yang baru

### Kategori Kecepatan

Kecepatan menjawab dikategorikan berdasarkan threshold waktu dari guru:

- **Cepat**: `timeSpent ≤ timeFastThreshold`
- **Sedang**: `timeFastThreshold < timeSpent ≤ timeSlowThreshold`
- **Lambat**: `timeSpent > timeSlowThreshold`

## Algoritma Rule-Based

### Prinsip Dasar

Algoritma akan menentukan level soal berikutnya berdasarkan:

1. **Kebenaran jawaban** (benar/salah)
2. **Kecepatan menjawab** (cepat/sedang/lambat)
3. **Konsistensi** (streak berturut-turut)

### Rules untuk Jawaban Benar

| Kondisi | Aksi | Keterangan |
|---------|------|------------|
| Benar + Cepat | **Naik 1 level** | Langsung naik karena menguasai dengan cepat |
| Benar + Sedang (≥3x beruntun) | **Naik 1 level** | Konsisten benar, layak naik |
| Benar + Sedang (<3x beruntun) | **Tetap** | Masih perlu konsistensi |
| Benar + Lambat (≥3x beruntun) | **Naik 1 level** | Konsisten benar meski lambat |
| Benar + Lambat (<3x beruntun) | **Tetap** | Perlu konsistensi lebih |

### Rules untuk Jawaban Salah

| Kondisi | Aksi | Keterangan |
|---------|------|------------|
| Salah + Lambat | **Turun 1 level** | Langsung turun karena tidak menguasai |
| Salah ≥2x beruntun di level sama | **Turun 1 level** | Soal terlalu sulit |
| Salah + Cepat/Sedang (1x) | **Tetap** | Beri kesempatan lagi |

### Streak Tracking

Sistem melacak 3 jenis streak:

1. **streakCorrectAny**: Jumlah jawaban benar berturut-turut (any speed)
2. **streakCorrectSlow**: Jumlah jawaban benar lambat berturut-turut
3. **streakWrongAtLevel**: Jumlah jawaban salah berturut-turut di level yang sama

## Penggunaan

### 1. Setup Basic

```typescript
import { QuizStateTracker } from '@/lib/adaptive-quiz';

// Buat tracker baru (default start di C4)
const tracker = new QuizStateTracker();

// Atau start di level custom
const tracker = new QuizStateTracker('C3');
```

### 2. Submit Jawaban

```typescript
const result = tracker.submitAnswer({
  questionId: "q1",
  questionLevel: "C4",
  isCorrect: true,
  timeSpent: 30,              // 30 detik
  timeFastThreshold: 45,      // Batas cepat: 45 detik
  timeSlowThreshold: 90       // Batas lambat: 90 detik
});

console.log(result.nextLevel);    // "C5" (naik karena benar + cepat)
console.log(result.speed);        // "cepat"
console.log(result.reason);       // "Jawaban benar dan cepat → naik 1 level"
console.log(result.levelChanged); // true
```

### 3. Get State & Stats

```typescript
// Get current level
const currentLevel = tracker.getCurrentLevel();

// Get full state
const state = tracker.getState();

// Get statistics
const totalAnswered = tracker.getTotalAnswered();
const totalCorrect = tracker.getTotalCorrect();
const accuracy = tracker.getAccuracy();

// Check streak
const isOnStreak = tracker.isOnCorrectStreak();
const streakInfo = tracker.getStreakInfo();
console.log(streakInfo);
// {
//   correctAny: 3,
//   correctSlow: 0,
//   wrongAtLevel: 0
// }
```

### 4. Performance Summary & Analytics

```typescript
import { generatePerformanceSummary, formatSummaryForAI } from '@/lib/adaptive-quiz';

// Generate summary setelah quiz selesai
const summary = generatePerformanceSummary(
  tracker.getHistory(),
  tracker.getCurrentLevel()
);

console.log(summary);
// {
//   totalQuestions: 10,
//   totalCorrect: 8,
//   totalWrong: 2,
//   accuracyPercent: 80,
//   levelDistribution: { ... },
//   speedDistribution: { ... },
//   averageTimePerLevel: { ... },
//   finalLevel: "C5",
//   weaknesses: ["C2"],
//   strengths: ["C4", "C5"]
// }

// Format untuk AI
const aiText = formatSummaryForAI(summary);
console.log(aiText);
// === RINGKASAN PERFORMA SISWA ===
// ...
```

### 5. Save & Load State

```typescript
// Save state ke sessionStorage/localStorage
const stateToSave = tracker.exportState();
sessionStorage.setItem('quizState', JSON.stringify(stateToSave));

// Load state dari storage
const savedState = JSON.parse(sessionStorage.getItem('quizState'));
tracker.loadState(savedState);

// Atau dengan serialization helper
import { serializeState, deserializeState } from '@/lib/adaptive-quiz';

const jsonString = serializeState(tracker.getState());
localStorage.setItem('quiz', jsonString);

const loadedState = deserializeState(localStorage.getItem('quiz'));
tracker.loadState(loadedState);
```

### 6. Export untuk Analisis

```typescript
import { exportHistoryToCSV, generateVideoRecommendations } from '@/lib/adaptive-quiz';

// Export ke CSV
const csv = exportHistoryToCSV(tracker.getHistory());
// Download atau kirim ke server

// Generate rekomendasi video
const recommendations = generateVideoRecommendations(summary.weaknesses);
console.log(recommendations);
// [
//   {
//     level: "C2",
//     recommendation: "Video pembelajaran untuk meningkatkan pemahaman konsep..."
//   }
// ]
```

## Integrasi dengan Quiz Page

### Di Quiz Page (saat menjawab soal)

```typescript
// src/app/(platform)/siswa/materi/[...]/kuis/page.tsx

import { QuizStateTracker } from '@/lib/adaptive-quiz';
import { useState, useEffect } from 'react';

export default function KuisPage() {
  const [tracker] = useState(() => new QuizStateTracker());
  const [currentLevel, setCurrentLevel] = useState(tracker.getCurrentLevel());
  const [questionStartTime, setQuestionStartTime] = useState<number>();

  // Load state dari sessionStorage jika ada
  useEffect(() => {
    const saved = sessionStorage.getItem('adaptiveQuizState');
    if (saved) {
      tracker.loadState(JSON.parse(saved));
      setCurrentLevel(tracker.getCurrentLevel());
    }
    setQuestionStartTime(Date.now());
  }, []);

  const handleSubmitAnswer = (userAnswer: string, correctAnswer: string) => {
    const timeSpent = Math.floor((Date.now() - questionStartTime!) / 1000);
    const isCorrect = userAnswer === correctAnswer;

    // Submit ke tracker
    const result = tracker.submitAnswer({
      questionId: currentQuestion.id,
      questionLevel: currentLevel,
      isCorrect,
      timeSpent,
      timeFastThreshold: currentQuestion.timeFast || 45,
      timeSlowThreshold: currentQuestion.timeSlow || 90,
    });

    // Update UI
    setCurrentLevel(result.nextLevel);

    // Save state
    sessionStorage.setItem(
      'adaptiveQuizState',
      JSON.stringify(tracker.exportState())
    );

    // Navigate ke hasil dengan info level change
    router.push(`/kuis/hasil?levelChanged=${result.levelChanged}&nextLevel=${result.nextLevel}`);
  };

  // Fetch soal berdasarkan currentLevel
  // ...
}
```

### Di Hasil Keseluruhan (analisis AI)

```typescript
// src/app/(platform)/siswa/materi/[...]/kuis/hasil/hasil-keseluruhan/page.tsx

import { generatePerformanceSummary, formatSummaryForAI } from '@/lib/adaptive-quiz';

export default function HasilKeseluruhanPage() {
  const [summary, setSummary] = useState<PerformanceSummary>();

  useEffect(() => {
    const saved = sessionStorage.getItem('adaptiveQuizState');
    if (saved) {
      const state = JSON.parse(saved);
      const perfSummary = generatePerformanceSummary(
        state.history,
        state.currentLevel
      );
      setSummary(perfSummary);
    }
  }, []);

  const handleAIAnalysis = async () => {
    if (!summary) return;

    const aiPrompt = formatSummaryForAI(summary);

    // Kirim ke AI untuk analisis
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ performanceData: aiPrompt }),
    });

    const aiRecommendation = await response.json();
    // Tampilkan rekomendasi AI ke siswa
  };

  // Render summary dan tombol AI analysis
}
```

## Testing

Lihat `example.test.ts` untuk contoh lengkap test cases.

## Konfigurasi

Anda dapat menyesuaikan threshold dan constants di `constants.ts`:

- `DEFAULT_STARTING_LEVEL`: Level awal siswa
- `STREAK_CORRECT_SEDANG_THRESHOLD`: Jumlah benar beruntun untuk naik
- `STREAK_CORRECT_SLOW_THRESHOLD`: Jumlah benar lambat beruntun untuk naik
- `STREAK_WRONG_THRESHOLD`: Jumlah salah beruntun untuk turun
- `ACCURACY_THRESHOLDS`: Threshold untuk menentukan strength/weakness

## Struktur Folder

```
src/lib/adaptive-quiz/
├── types.ts        # Type definitions
├── constants.ts    # Konfigurasi & constants
├── rules.ts        # Core rule-based algorithm
├── tracker.ts      # State management & tracking
├── logger.ts       # History logging & analytics
├── index.ts        # Main exports
├── README.md       # Dokumentasi ini
└── example.test.ts # Test cases & examples
```

## Catatan Penting

1. **Time Thresholds dari Guru**: Waktu cepat/lambat harus diinput oleh guru untuk setiap soal
2. **State Persistence**: Simpan state ke sessionStorage/localStorage agar tidak hilang saat refresh
3. **Level Bounds**: Level akan selalu di-clamp antara C1 dan C6
4. **Streak Reset**: Streak akan reset saat level berubah atau kondisi tertentu
5. **History Logging**: Semua jawaban dicatat untuk analisis dan rekomendasi AI

## Referensi

- Taksonomi Bloom: https://en.wikipedia.org/wiki/Bloom%27s_taxonomy
- Adaptive Learning: https://en.wikipedia.org/wiki/Adaptive_learning
