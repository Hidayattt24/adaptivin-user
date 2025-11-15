"use client";

import React from "react";

interface AnalysisFormatterProps {
  content: string;
  className?: string;
}

/**
 * AnalysisFormatter - Format analisis AI menjadi poin-poin yang mudah dibaca
 * 
 * Akan memecah teks panjang menjadi sections berdasarkan pattern:
 * - Soal #X
 * - Jawaban kamu:
 * - Kenapa salah:
 * - Solusi:
 */
export function AnalysisFormatter({
  content,
  className = "",
}: AnalysisFormatterProps) {
  const parseAnalysis = (text: string) => {
    // Remove literal \n and replace with actual newlines
    const cleanText = text.replace(/\\n/g, "\n").trim();

    // Split by "🔍 Soal #" to get individual questions
    const questions = cleanText.split(/(?=🔍\s*Soal\s*#\d+)/);

    return questions
      .filter((q) => q.trim())
      .map((question, index) => {
        // Extract question number and level
        const questionMatch = question.match(/🔍\s*Soal\s*#(\d+)\s*\(Level\s*(\d+)\)/i);
        const questionNumber = questionMatch ? questionMatch[1] : index + 1;
        const level = questionMatch ? questionMatch[2] : "?";

        // Extract sections using flexible patterns
        const sections = {
          soal: extractSection(question, /Soal:\s*['"](.+?)['"]|Soal:\s*([\s\S]+?)(?=Jawaban kamu:|$)/i),
          jawabanKamu: extractSection(question, /Jawaban kamu:\s*([\s\S]+?)(?=Kenapa salah:|$)/i),
          kenapaSalah: extractSection(question, /Kenapa salah:\s*([\s\S]+?)(?=Solusi:|$)/i),
          solusi: extractSection(question, /Solusi:\s*([\s\S]+?)(?=🔍|$)/i),
        };

        return {
          questionNumber,
          level,
          ...sections,
        };
      });
  };

  const extractSection = (text: string, pattern: RegExp): string => {
    const match = text.match(pattern);
    if (match) {
      // Return the first captured group that has content
      return (match[1] || match[2] || "").trim();
    }
    return "";
  };

  const parsedQuestions = parseAnalysis(content);

  if (parsedQuestions.length === 0) {
    // Fallback: display as is if parsing fails
    return (
      <div className={`text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-wrap ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {parsedQuestions.map((q, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border-2 border-gray-200 p-4 md:p-5 hover:border-[#336D82]/40 transition-colors"
        >
          {/* Question Header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-[#336D82] to-[#7AB0C4] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">#{q.questionNumber}</span>
            </div>
            <div>
              <h4 className="text-[#336D82] font-bold text-base md:text-lg">
                Soal #{q.questionNumber}
              </h4>
              <p className="text-gray-500 text-xs md:text-sm">Level {q.level}</p>
            </div>
          </div>

          {/* Soal */}
          {q.soal && (
            <div className="mb-4">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg flex-shrink-0">📝</span>
                <h5 className="font-bold text-[#336D82] text-sm md:text-base">Pertanyaan:</h5>
              </div>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed ml-7 bg-gray-50 p-3 rounded-lg border-l-4 border-[#336D82]">
                {q.soal}
              </p>
            </div>
          )}

          {/* Jawaban Kamu */}
          {q.jawabanKamu && (
            <div className="mb-4">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg flex-shrink-0">💭</span>
                <h5 className="font-bold text-orange-600 text-sm md:text-base">
                  Jawaban Kamu:
                </h5>
              </div>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed ml-7 bg-orange-50 p-3 rounded-lg border-l-4 border-orange-500">
                {q.jawabanKamu}
              </p>
            </div>
          )}

          {/* Kenapa Salah */}
          {q.kenapaSalah && (
            <div className="mb-4">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg flex-shrink-0">❓</span>
                <h5 className="font-bold text-red-600 text-sm md:text-base">
                  Kenapa Salah:
                </h5>
              </div>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed ml-7 bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
                {q.kenapaSalah}
              </p>
            </div>
          )}

          {/* Solusi */}
          {q.solusi && (
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg flex-shrink-0">💡</span>
                <h5 className="font-bold text-green-600 text-sm md:text-base">
                  Solusi & Tips:
                </h5>
              </div>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed ml-7 bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                {q.solusi}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default AnalysisFormatter;

