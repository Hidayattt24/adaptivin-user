import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: Analyze Quiz Results with Gemini AI
 *
 * This endpoint receives quiz data and returns AI analysis
 *
 * POST /api/analyze-quiz
 * Body: {
 *   userAnswers: { [questionIndex: number]: string },
 *   quizData: QuizQuestion[],
 *   materiTitle: string
 * }
 *
 * TODO: Setup Gemini API
 * 1. Install: npm install @google/generative-ai
 * 2. Add to .env.local: GEMINI_API_KEY=your_api_key_here
 * 3. Get API key from: https://makersuite.google.com/app/apikey
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAnswers, quizData, materiTitle } = body;

    // Calculate basic statistics
    const totalQuestions = quizData.length;
    const correctAnswers = quizData.filter((q: any, index: number) => {
      const userAnswer = parseInt(userAnswers[index] || "0");
      return userAnswer === q.correctAnswer;
    }).length;
    const incorrectQuestions = quizData.filter((q: any, index: number) => {
      const userAnswer = parseInt(userAnswers[index] || "0");
      return userAnswer !== q.correctAnswer;
    });

    // TODO: Uncomment when Gemini API is ready
    /*
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Build context prompt for Gemini
    const prompt = `
      Kamu adalah Mbah AdaptivAI, seorang guru matematika yang ramah dan sabar untuk anak SD.
      Analisis hasil kuis berikut untuk materi "${materiTitle}":

      Total Soal: ${totalQuestions}
      Jawaban Benar: ${correctAnswers}
      Jawaban Salah: ${totalQuestions - correctAnswers}

      Soal yang dijawab salah:
      ${incorrectQuestions.map((q: any, i: number) => `${i + 1}. ${q.question}`).join("\n")}

      Berikan analisis yang:
      1. Ramah dan positif untuk anak-anak
      2. Jelaskan konsep yang masih perlu dipelajari
      3. Berikan motivasi
      4. Gunakan bahasa yang mudah dipahami anak SD
      5. Maksimal 3-4 paragraf

      Format tanpa markdown, langsung text biasa.
    `;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();
    */

    // MVP: Return placeholder analysis
    const analysis = generatePlaceholderAnalysis(
      correctAnswers,
      totalQuestions,
      materiTitle,
      incorrectQuestions
    );

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        statistics: {
          total: totalQuestions,
          correct: correctAnswers,
          incorrect: totalQuestions - correctAnswers,
          percentage: Math.round((correctAnswers / totalQuestions) * 100),
        },
      },
    });
  } catch (error) {
    console.error("Error analyzing quiz:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze quiz",
      },
      { status: 500 }
    );
  }
}

function generatePlaceholderAnalysis(
  correct: number,
  total: number,
  materiTitle: string,
  incorrectQuestions: any[]
): string {
  const percentage = Math.round((correct / total) * 100);

  let analysis = `Hai Adik! Mbah AdaptivAI senang sekali melihat usaha kamu dalam mengerjakan kuis tentang ${materiTitle}.\n\n`;

  if (percentage >= 80) {
    analysis += `Wah, hebat sekali! Kamu berhasil menjawab ${correct} dari ${total} pertanyaan dengan benar! Ini menunjukkan bahwa kamu sudah memahami konsep ${materiTitle} dengan sangat baik. Pertahankan semangat belajarmu ya! 🌟\n\n`;
  } else if (percentage >= 60) {
    analysis += `Bagus! Kamu berhasil menjawab ${correct} dari ${total} pertanyaan dengan benar. Kamu sudah cukup paham tentang ${materiTitle}, tapi masih ada beberapa hal yang perlu dipelajari lebih dalam lagi.\n\n`;
  } else {
    analysis += `Kamu berhasil menjawab ${correct} dari ${total} pertanyaan dengan benar. Tidak apa-apa! Belajar matematika memang butuh waktu dan latihan. Yang penting kamu sudah berani mencoba! 💪\n\n`;
  }

  if (incorrectQuestions.length > 0) {
    analysis += `Untuk soal yang masih salah, yuk kita pelajari lagi konsep dasarnya. Ingat, memahami pecahan itu seperti membagi kue - semakin banyak potongan, semakin kecil ukuran setiap potongannya! Jangan ragu untuk bertanya kepada guru atau orang tua jika ada yang belum dipahami.\n\n`;
  }

  analysis += `Mbah AdaptivAI menyarankan kamu untuk menonton video pembelajaran yang sudah disiapkan di bawah. Video ini akan membantu kamu memahami materi dengan cara yang lebih menarik dan mudah dipahami. Jangan lupa untuk terus berlatih ya!`;

  return analysis;
}
