/**
 * Mock Materials Data
 *
 * This file contains mock data for materials organized by class
 * TODO: Replace with actual API calls when backend is ready
 */

export interface Material {
  id: string;
  classId: string;
  title: string;
  description: string;
  icon: string; // pixelarticons name
  isLocked: boolean;
  content?: {
    introduction?: string;
    sections?: Array<{
      title: string;
      content: string;
      examples?: string[];
    }>;
    videoUrl?: string;
    pdfUrl?: string;
  };
}

/**
 * Materials for Kelas 4 (Green Theme)
 */
const KELAS_4_MATERIALS: Material[] = [
  {
    id: 'pecahan-biasa-campuran-4',
    classId: '4',
    title: 'Pecahan Biasa & Campuran',
    description: 'Belajar membagi pizza dan kue secara adil! Kamu akan jadi ahli memotong apa pun menjadi bagian yang sama besar dan membandingkannya.',
    icon: 'book',
    isLocked: false,
    content: {
      introduction: 'Mari belajar tentang pecahan dengan cara yang menyenangkan!',
      sections: [
        {
          title: 'Apa itu Pecahan?',
          content: 'Pecahan adalah bagian dari suatu keseluruhan. Misalnya, jika kamu membagi pizza menjadi 4 bagian yang sama, setiap bagian adalah 1/4 pizza.',
          examples: ['1/2', '1/4', '3/4'],
        },
        {
          title: 'Pecahan Campuran',
          content: 'Pecahan campuran adalah kombinasi bilangan bulat dan pecahan. Contohnya: 2 1/2 berarti 2 pizza utuh ditambah setengah pizza.',
          examples: ['1 1/2', '2 1/4', '3 2/3'],
        },
      ],
    },
  },
  {
    id: 'operasi-hitung-pecahan-4',
    classId: '4',
    title: 'Operasi Hitung Pecahan',
    description: 'Menjumlah, mengurang, mengali, dan membagi pecahan dengan cara yang mudah dan menyenangkan!',
    icon: 'calculator',
    isLocked: false,
    content: {
      introduction: 'Yuk belajar menghitung dengan pecahan!',
      sections: [
        {
          title: 'Penjumlahan Pecahan',
          content: 'Untuk menjumlahkan pecahan dengan penyebut sama, jumlahkan pembilangnya saja.',
          examples: ['1/4 + 2/4 = 3/4', '1/3 + 1/3 = 2/3'],
        },
      ],
    },
  },
  {
    id: 'pecahan-desimal-4',
    classId: '4',
    title: 'Pecahan Desimal',
    description: 'Memahami hubungan antara pecahan biasa dan pecahan desimal. Belajar mengubah bentuk pecahan dengan mudah!',
    icon: 'percent',
    isLocked: true,
  },
];

/**
 * Materials for Kelas 5 (Yellow Theme)
 */
const KELAS_5_MATERIALS: Material[] = [
  {
    id: 'pecahan-lanjutan-5',
    classId: '5',
    title: 'Pecahan Lanjutan',
    description: 'Mendalami konsep pecahan dengan soal-soal yang lebih menantang dan aplikasi dalam kehidupan sehari-hari.',
    icon: 'book',
    isLocked: false,
    content: {
      introduction: 'Mari tingkatkan pemahaman pecahan ke level berikutnya!',
      sections: [
        {
          title: 'Menyederhanakan Pecahan',
          content: 'Pecahan dapat disederhanakan dengan membagi pembilang dan penyebut dengan FPB (Faktor Persekutuan Terbesar).',
          examples: ['6/8 = 3/4', '10/15 = 2/3'],
        },
      ],
    },
  },
  {
    id: 'perbandingan-skala-5',
    classId: '5',
    title: 'Perbandingan dan Skala',
    description: 'Memahami konsep perbandingan dalam berbagai situasi dan menerapkan skala pada peta dan denah.',
    icon: 'scale',
    isLocked: false,
  },
  {
    id: 'geometri-bangun-datar-5',
    classId: '5',
    title: 'Geometri Bangun Datar',
    description: 'Mempelajari berbagai bangun datar, sifat-sifatnya, serta cara menghitung luas dan keliling.',
    icon: 'box',
    isLocked: true,
  },
];

/**
 * Materials for Kelas 6 (Purple Theme)
 */
const KELAS_6_MATERIALS: Material[] = [
  {
    id: 'bilangan-bulat-6',
    classId: '6',
    title: 'Bilangan Bulat',
    description: 'Memahami bilangan bulat positif dan negatif, serta operasi hitung yang melibatkan bilangan bulat.',
    icon: 'book',
    isLocked: false,
    content: {
      introduction: 'Mari eksplorasi dunia bilangan bulat!',
      sections: [
        {
          title: 'Bilangan Bulat Positif dan Negatif',
          content: 'Bilangan bulat terdiri dari bilangan positif, negatif, dan nol. Contoh: ..., -3, -2, -1, 0, 1, 2, 3, ...',
          examples: ['+5', '-3', '0'],
        },
      ],
    },
  },
  {
    id: 'statistika-data-6',
    classId: '6',
    title: 'Statistika dan Data',
    description: 'Mengumpulkan, mengolah, dan menyajikan data dalam bentuk tabel, diagram, serta menghitung rata-rata.',
    icon: 'chart-bar',
    isLocked: false,
  },
  {
    id: 'bangun-ruang-6',
    classId: '6',
    title: 'Bangun Ruang',
    description: 'Mempelajari berbagai bangun ruang seperti kubus, balok, prisma, dan cara menghitung volume serta luas permukaan.',
    icon: 'box',
    isLocked: true,
  },
];

/**
 * All materials organized by class
 */
export const MATERIALS_BY_CLASS: Record<string, Material[]> = {
  '4': KELAS_4_MATERIALS,
  '5': KELAS_5_MATERIALS,
  '6': KELAS_6_MATERIALS,
};

/**
 * Get materials for a specific class
 */
export function getMaterialsByClass(classId: string): Material[] {
  return MATERIALS_BY_CLASS[classId] || [];
}

/**
 * Get a specific material by ID
 */
export function getMaterialById(materiId: string): Material | undefined {
  for (const materials of Object.values(MATERIALS_BY_CLASS)) {
    const found = materials.find(m => m.id === materiId);
    if (found) return found;
  }
  return undefined;
}

/**
 * Get material by ID and verify it belongs to the specified class
 */
export function getMaterialByIdAndClass(
  materiId: string,
  classId: string
): Material | undefined {
  const materials = getMaterialsByClass(classId);
  return materials.find(m => m.id === materiId);
}
