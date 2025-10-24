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
}

export const quizData: QuizQuestion[] = [
  {
    id: 1,
    question: "Sebuah kue dipotong menjadi 12 bagian sama besar. Rani memakan 1⁄3 bagian kue. Berapa potong kue yang dimakan Rani?",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    correctAnswer: 4,
  },
  {
    id: 2,
    question: "Seorang petani memiliki 24 apel. Ia memberikan 1⁄4 bagian kepada tetangganya. Berapa apel yang diberikan?",
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=300&fit=crop",
    correctAnswer: 6,
  },
  {
    id: 3,
    question: "Ibu membeli 18 permen. Adik memakan 1⁄6 dari permen tersebut. Berapa permen yang dimakan adik?",
    image: "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=400&h=300&fit=crop",
    correctAnswer: 3,
  },
  {
    id: 4,
    question: "Ayah membeli 20 jeruk. Kakak mengambil 2⁄5 bagian untuk dibuat jus. Berapa jeruk yang diambil kakak?",
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop",
    correctAnswer: 8,
  },
  {
    id: 5,
    question: "Sebuah pizza dipotong menjadi 8 bagian sama besar. Jika kamu makan 3⁄8 bagian pizza, berapa potong yang kamu makan?",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    correctAnswer: 3,
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
