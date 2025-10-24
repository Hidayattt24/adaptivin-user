/**
 * Quiz Data - MVP Version
 *
 * Data kuis dummy untuk development
 * Nanti akan diganti dengan API call dari backend
 *
 * TODO: Replace with API endpoint
 * Example: GET /api/materi/{materiId}/kuis
 */

export interface QuizQuestion {
  id: number;
  question: string;
  image: string;
  correctAnswer: number;
  correctAnswerText: string; // e.g., "0,5 potong"
  explanation: string;
  explanationImage?: string;
}

export const quizData: QuizQuestion[] = [
  {
    id: 1,
    question: "Sebuah kue dipotong menjadi 12 bagian sama besar. Rani memakan 1⁄3 bagian kue. Berapa potong kue yang dimakan Rani?",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    correctAnswer: 4,
    correctAnswerText: "4 potong",
    explanation: "Total kue ada 12 potong. Satu per tiga artinya kue dibagi menjadi tiga bagian sama banyak. Dua belas dibagi tiga hasilnya empat. Jadi Rani memakan 4 potong kue.",
  },
  {
    id: 2,
    question: "Seorang petani memiliki 24 apel. Ia memberikan 1⁄4 bagian kepada tetangganya. Berapa apel yang diberikan?",
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=300&fit=crop",
    correctAnswer: 6,
    correctAnswerText: "6 apel",
    explanation: "Total apel ada 24 buah. Satu per empat artinya apel dibagi menjadi empat bagian sama banyak. Dua puluh empat dibagi empat hasilnya enam. Jadi petani memberikan 6 apel.",
  },
  {
    id: 3,
    question: "Ibu membeli 18 permen. Adik memakan 1⁄6 dari permen tersebut. Berapa permen yang dimakan adik?",
    image: "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=400&h=300&fit=crop",
    correctAnswer: 3,
    correctAnswerText: "3 permen",
    explanation: "Total permen ada 18 buah. Satu per enam artinya permen dibagi menjadi enam bagian sama banyak. Delapan belas dibagi enam hasilnya tiga. Jadi adik memakan 3 permen.",
  },
  {
    id: 4,
    question: "Ayah membeli 20 jeruk. Kakak mengambil 2⁄5 bagian untuk dibuat jus. Berapa jeruk yang diambil kakak?",
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop",
    correctAnswer: 8,
    correctAnswerText: "8 jeruk",
    explanation: "Total jeruk ada 20 buah. Dua per lima artinya jeruk dibagi menjadi lima bagian, lalu diambil dua bagian. Dua puluh dibagi lima hasilnya empat, kemudian empat dikali dua hasilnya delapan. Jadi kakak mengambil 8 jeruk.",
  },
  {
    id: 5,
    question: "Sebuah pizza dipotong menjadi 8 bagian sama besar. Jika kamu makan 3⁄8 bagian pizza, berapa potong yang kamu makan?",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    correctAnswer: 3,
    correctAnswerText: "3 potong",
    explanation: "Total pizza ada 8 potong. Tiga per delapan artinya dari delapan potong, kamu mengambil tiga potong. Jadi kamu makan 3 potong pizza.",
  },
];

/**
 * Helper function to get quiz by materi ID
 * Nanti akan diganti dengan API call
 *
 * @param materiId - ID materi
 * @returns Quiz questions array
 */
export const getQuizByMateriId = async (materiId: string): Promise<QuizQuestion[]> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/materi/${materiId}/kuis`);
  // return response.json();

  // For now, return dummy data
  return Promise.resolve(quizData);
};
