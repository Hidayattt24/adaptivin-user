/**
 * Adaptive Quiz - Example Test Cases
 *
 * Contoh penggunaan dan test cases untuk validasi algoritma rule-based
 * Jalankan dengan: npm test atau node --loader ts-node/esm example.test.ts
 */

import { QuizStateTracker } from "./tracker";
import { generatePerformanceSummary, formatSummaryForAI } from "./logger";
import type { AnswerInput } from "./types";

// ============================================================================
// TEST UTILITIES
// ============================================================================

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`❌ FAILED: ${message}`);
  }
  console.log(`✅ PASSED: ${message}`);
}

function testSection(title: string) {
  console.log("\n" + "=".repeat(60));
  console.log(title);
  console.log("=".repeat(60));
}

// ============================================================================
// TEST CASES
// ============================================================================

function runAllTests() {
  console.log("\n🧪 ADAPTIVE QUIZ - TEST SUITE\n");

  // Test 1: Benar + Cepat → Naik 1 level
  testSection("TEST 1: Benar + Cepat → Naik 1 Level");
  {
    const tracker = new QuizStateTracker("C4");

    const result = tracker.submitAnswer({
      questionId: "q1",
      questionLevel: "C4",
      isCorrect: true,
      timeSpent: 30,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });

    assert(result.speed === "cepat", "Speed should be 'cepat'");
    assert(result.nextLevel === "C5", "Level should increase from C4 to C5");
    assert(result.levelChanged === true, "Level should change");
    assert(
      result.reason.includes("cepat"),
      "Reason should mention 'cepat'"
    );
    console.log(`📊 Result: ${result.previousLevel} → ${result.nextLevel}`);
    console.log(`📝 Reason: ${result.reason}`);
  }

  // Test 2: Benar + Sedang; 3 benar beruntun → Naik 1 level
  testSection("TEST 2: Benar + Sedang; 3x Beruntun → Naik 1 Level");
  {
    const tracker = new QuizStateTracker("C4");

    // Jawaban 1: Benar + Sedang
    tracker.submitAnswer({
      questionId: "q1",
      questionLevel: "C4",
      isCorrect: true,
      timeSpent: 60,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });
    assert(tracker.getCurrentLevel() === "C4", "Still C4 after 1st correct");

    // Jawaban 2: Benar + Sedang
    tracker.submitAnswer({
      questionId: "q2",
      questionLevel: "C4",
      isCorrect: true,
      timeSpent: 65,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });
    assert(tracker.getCurrentLevel() === "C4", "Still C4 after 2nd correct");

    // Jawaban 3: Benar + Sedang (streak = 3, should level up)
    const result3 = tracker.submitAnswer({
      questionId: "q3",
      questionLevel: "C4",
      isCorrect: true,
      timeSpent: 70,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });

    assert(result3.nextLevel === "C5", "Level should increase to C5");
    assert(result3.levelChanged === true, "Level should change");
    console.log(`📊 Result after 3 correct: ${result3.previousLevel} → ${result3.nextLevel}`);
    console.log(`📝 Reason: ${result3.reason}`);
  }

  // Test 3: Benar + Lambat; 3x konsisten → Naik 1 level
  testSection("TEST 3: Benar + Lambat; 3x Konsisten → Naik 1 Level");
  {
    const tracker = new QuizStateTracker("C3");

    // Jawaban 1: Benar + Lambat
    tracker.submitAnswer({
      questionId: "q1",
      questionLevel: "C3",
      isCorrect: true,
      timeSpent: 100,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });
    assert(tracker.getCurrentLevel() === "C3", "Still C3 after 1st slow correct");

    // Jawaban 2: Benar + Lambat
    tracker.submitAnswer({
      questionId: "q2",
      questionLevel: "C3",
      isCorrect: true,
      timeSpent: 95,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });
    assert(tracker.getCurrentLevel() === "C3", "Still C3 after 2nd slow correct");

    // Jawaban 3: Benar + Lambat (streak slow = 3, should level up)
    const result3 = tracker.submitAnswer({
      questionId: "q3",
      questionLevel: "C3",
      isCorrect: true,
      timeSpent: 92,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });

    assert(result3.nextLevel === "C4", "Level should increase to C4");
    assert(result3.levelChanged === true, "Level should change");
    console.log(`📊 Result after 3 slow correct: ${result3.previousLevel} → ${result3.nextLevel}`);
  }

  // Test 4: Salah + Lambat → Turun 1 level
  testSection("TEST 4: Salah + Lambat → Turun 1 Level");
  {
    const tracker = new QuizStateTracker("C4");

    const result = tracker.submitAnswer({
      questionId: "q1",
      questionLevel: "C4",
      isCorrect: false,
      timeSpent: 100,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });

    assert(result.speed === "lambat", "Speed should be 'lambat'");
    assert(result.nextLevel === "C3", "Level should decrease from C4 to C3");
    assert(result.levelChanged === true, "Level should change");
    console.log(`📊 Result: ${result.previousLevel} → ${result.nextLevel}`);
    console.log(`📝 Reason: ${result.reason}`);
  }

  // Test 5: Salah 2x berturut-turut → Turun 1 level
  testSection("TEST 5: Salah 2x Berturut-Turut → Turun 1 Level");
  {
    const tracker = new QuizStateTracker("C4");

    // Salah 1x (cepat)
    tracker.submitAnswer({
      questionId: "q1",
      questionLevel: "C4",
      isCorrect: false,
      timeSpent: 30,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });
    assert(tracker.getCurrentLevel() === "C4", "Still C4 after 1st wrong");

    // Salah 2x (sedang) → turun
    const result2 = tracker.submitAnswer({
      questionId: "q2",
      questionLevel: "C4",
      isCorrect: false,
      timeSpent: 60,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });

    assert(result2.nextLevel === "C3", "Level should decrease to C3");
    assert(result2.levelChanged === true, "Level should change");
    console.log(`📊 Result after 2 wrong: ${result2.previousLevel} → ${result2.nextLevel}`);
  }

  // Test 6: Level bounds (tidak bisa melewati C1 dan C6)
  testSection("TEST 6: Level Bounds (C1 - C6)");
  {
    // Test maksimum C6
    const trackerMax = new QuizStateTracker("C6");
    const resultMax = trackerMax.submitAnswer({
      questionId: "q1",
      questionLevel: "C6",
      isCorrect: true,
      timeSpent: 30,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });
    assert(resultMax.nextLevel === "C6", "Cannot exceed C6");
    console.log(`📊 Max level test: ${resultMax.nextLevel} (clamped at C6)`);

    // Test minimum C1
    const trackerMin = new QuizStateTracker("C1");
    const resultMin = trackerMin.submitAnswer({
      questionId: "q1",
      questionLevel: "C1",
      isCorrect: false,
      timeSpent: 100,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });
    assert(resultMin.nextLevel === "C1", "Cannot go below C1");
    console.log(`📊 Min level test: ${resultMin.nextLevel} (clamped at C1)`);
  }

  // Test 7: Performance Summary
  testSection("TEST 7: Performance Summary & Analytics");
  {
    const tracker = new QuizStateTracker("C4");

    // Simulasi beberapa jawaban
    const answers: AnswerInput[] = [
      { questionId: "q1", questionLevel: "C4", isCorrect: true, timeSpent: 30, timeFastThreshold: 45, timeSlowThreshold: 90 },
      { questionId: "q2", questionLevel: "C5", isCorrect: true, timeSpent: 40, timeFastThreshold: 45, timeSlowThreshold: 90 },
      { questionId: "q3", questionLevel: "C5", isCorrect: false, timeSpent: 100, timeFastThreshold: 45, timeSlowThreshold: 90 },
      { questionId: "q4", questionLevel: "C4", isCorrect: true, timeSpent: 50, timeFastThreshold: 45, timeSlowThreshold: 90 },
      { questionId: "q5", questionLevel: "C4", isCorrect: true, timeSpent: 35, timeFastThreshold: 45, timeSlowThreshold: 90 },
    ];

    answers.forEach((answer) => tracker.submitAnswer(answer));

    const summary = generatePerformanceSummary(
      tracker.getHistory(),
      tracker.getCurrentLevel()
    );

    assert(summary.totalQuestions === 5, "Total questions should be 5");
    assert(summary.totalCorrect === 4, "Total correct should be 4");
    assert(summary.totalWrong === 1, "Total wrong should be 1");
    assert(summary.accuracyPercent === 80, "Accuracy should be 80%");

    console.log(`\n📊 Performance Summary:`);
    console.log(`   Total Questions: ${summary.totalQuestions}`);
    console.log(`   Correct: ${summary.totalCorrect}`);
    console.log(`   Wrong: ${summary.totalWrong}`);
    console.log(`   Accuracy: ${summary.accuracyPercent}%`);
    console.log(`   Final Level: ${summary.finalLevel}`);
    console.log(`   Strengths: ${summary.strengths.join(", ") || "None yet"}`);
    console.log(`   Weaknesses: ${summary.weaknesses.join(", ") || "None yet"}`);

    // Test format for AI
    const aiText = formatSummaryForAI(summary);
    assert(aiText.includes("RINGKASAN PERFORMA"), "AI format should include summary");
    console.log(`\n📝 AI Format Preview:`);
    console.log(aiText.substring(0, 300) + "...");
  }

  // Test 8: State Persistence
  testSection("TEST 8: State Save/Load");
  {
    const tracker1 = new QuizStateTracker("C4");

    // Submit beberapa jawaban
    tracker1.submitAnswer({
      questionId: "q1",
      questionLevel: "C4",
      isCorrect: true,
      timeSpent: 30,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });

    tracker1.submitAnswer({
      questionId: "q2",
      questionLevel: "C5",
      isCorrect: true,
      timeSpent: 40,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });

    // Export state
    const savedState = tracker1.exportState();

    // Create new tracker dan load state
    const tracker2 = new QuizStateTracker();
    tracker2.loadState(savedState);

    assert(tracker2.getCurrentLevel() === tracker1.getCurrentLevel(), "Loaded level should match");
    assert(tracker2.getTotalAnswered() === tracker1.getTotalAnswered(), "Loaded history should match");
    assert(tracker2.getAccuracy() === tracker1.getAccuracy(), "Loaded accuracy should match");

    console.log(`✅ State successfully saved and loaded`);
    console.log(`   Level: ${tracker2.getCurrentLevel()}`);
    console.log(`   History: ${tracker2.getTotalAnswered()} answers`);
  }

  // Test 9: Streak Tracking
  testSection("TEST 9: Streak Tracking");
  {
    const tracker = new QuizStateTracker("C4");

    // Benar 1x
    tracker.submitAnswer({
      questionId: "q1",
      questionLevel: "C4",
      isCorrect: true,
      timeSpent: 60,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });
    let streak = tracker.getStreakInfo();
    assert(streak.correctAny === 1, "Correct any streak should be 1");
    assert(tracker.isOnCorrectStreak(), "Should be on correct streak");

    // Benar 2x
    tracker.submitAnswer({
      questionId: "q2",
      questionLevel: "C4",
      isCorrect: true,
      timeSpent: 65,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });
    streak = tracker.getStreakInfo();
    assert(streak.correctAny === 2, "Correct any streak should be 2");

    // Salah → reset streak
    tracker.submitAnswer({
      questionId: "q3",
      questionLevel: "C4",
      isCorrect: false,
      timeSpent: 50,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });
    streak = tracker.getStreakInfo();
    assert(streak.correctAny === 0, "Correct streak should reset to 0");
    assert(streak.wrongAtLevel === 1, "Wrong streak should be 1");
    assert(tracker.isOnWrongStreak(), "Should be on wrong streak");

    console.log(`✅ Streak tracking works correctly`);
    console.log(`   Final streak info: ${JSON.stringify(streak)}`);
  }

  // Test 10: Speed Categorization
  testSection("TEST 10: Speed Categorization");
  {
    const tracker = new QuizStateTracker("C4");

    // Cepat
    const r1 = tracker.submitAnswer({
      questionId: "q1",
      questionLevel: "C4",
      isCorrect: true,
      timeSpent: 30,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });
    assert(r1.speed === "cepat", "30s should be 'cepat'");

    // Sedang
    const r2 = tracker.submitAnswer({
      questionId: "q2",
      questionLevel: "C5",
      isCorrect: true,
      timeSpent: 60,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });
    assert(r2.speed === "sedang", "60s should be 'sedang'");

    // Lambat
    const r3 = tracker.submitAnswer({
      questionId: "q3",
      questionLevel: "C5",
      isCorrect: true,
      timeSpent: 100,
      timeFastThreshold: 45,
      timeSlowThreshold: 90,
    });
    assert(r3.speed === "lambat", "100s should be 'lambat'");

    console.log(`✅ Speed categorization works correctly`);
    console.log(`   30s → ${r1.speed}`);
    console.log(`   60s → ${r2.speed}`);
    console.log(`   100s → ${r3.speed}`);
  }

  // Summary
  testSection("🎉 ALL TESTS PASSED!");
  console.log("\nSemua test cases berhasil! Algoritma rule-based bekerja sesuai spesifikasi.\n");
}

// Run tests
try {
  runAllTests();
} catch (error) {
  console.error("\n❌ TEST FAILED:", error);
  process.exit(1);
}
