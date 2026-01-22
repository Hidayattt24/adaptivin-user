# 🎓 Adaptivin User App

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**Platform Pembelajaran Adaptif Numerasi untuk Siswa Sekolah Dasar**

🏆 **Finalis LIDM 2025 - Top 20**

[Live Demo](#) • [Panduan](#) • [Feedback](https://github.com/yourusername/adaptivin/issues)

</div>

---

## 📖 Tentang

**Adaptivin User App** adalah aplikasi pembelajaran interaktif berbasis web yang dirancang khusus untuk siswa sekolah dasar dalam meningkatkan kemampuan numerasi. Dengan pendekatan **Rule-Based Adaptive Learning System**, aplikasi ini menyesuaikan tingkat kesulitan soal secara real-time berdasarkan performa siswa.

### 🎯 Masalah yang Diselesaikan

- ✅ Kesenjangan kemampuan numerasi siswa SD
- ✅ Keterbatasan asesmen konvensional dalam memetakan kesulitan individual
- ✅ Kurangnya personalisasi pembelajaran
- ✅ Monitoring progres belajar yang tidak real-time

### 💡 Solusi yang Ditawarkan

- 🧠 **Adaptive Learning Engine** - Soal menyesuaikan kemampuan siswa
- 🤖 **AI-Powered Recommendations** - Rekomendasi belajar dari Gemini AI
- 📊 **Real-time Progress Tracking** - Pantau perkembangan secara langsung
- 🎮 **Gamified Learning** - Pembelajaran yang fun dan engaging
- 📱 **Responsive Design** - Bisa diakses dari berbagai device

## 🌟 Fitur Utama

### 🎯 Adaptive Learning System
```
Siswa Mulai Latihan
    ↓
Jawab Soal → Benar? → Tingkat Kesulitan Naik ⬆️
    ↓
    Salah? → Tingkat Kesulitan Turun ⬇️
    ↓
Rekomendasi AI Personal
```

### 🎮 Gamifikasi
- 🏆 **Points & Achievements** - Dapatkan poin setiap jawaban benar
- ⭐ **Level System** - Naik level sesuai progres
- 🎯 **Daily Challenges** - Tantangan harian untuk motivasi
- 🏅 **Leaderboard** - Kompetisi sehat antar siswa
- 🎉 **Rewards & Badges** - Koleksi badge pencapaian

### 📊 Dashboard Siswa
- 📈 Grafik progres pembelajaran
- 📝 Riwayat latihan dan hasil
- 🎯 Target belajar personal
- 💪 Statistik kekuatan dan kelemahan
- 🤖 Rekomendasi AI untuk perbaikan

### 🧩 Soal Interaktif
- 📚 Beragam tipe soal numerasi
- 🖼️ Visualisasi soal yang menarik
- ⏱️ Mode latihan dengan/tanpa timer
- 💡 Hint dan pembahasan
- 🔄 Soal yang selalu berbeda

### 🎨 User Experience
- 🌈 **Colorful & Kid-Friendly UI** - Design yang menarik untuk anak
- 🎭 **Smooth Animations** - Framer Motion untuk interaksi smooth
- 🎊 **Celebration Effects** - Confetti saat berhasil!
- 😊 **Emoji & Icons** - Visual yang menyenangkan
- 📱 **Mobile Responsive** - Nyaman di HP, tablet, atau laptop

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 15.5 (App Router) |
| **Language** | TypeScript 5.0 |
| **UI Library** | React 19.1 |
| **Styling** | Tailwind CSS v4 |
| **Component Library** | Material-UI v7.3 + Lucide React |
| **Animation** | Framer Motion + Canvas Confetti |
| **State Management** | TanStack React Query + Context API |
| **Charts** | Recharts |
| **Backend** | Supabase (Auth & Database) |
| **HTTP Client** | Axios |
| **Markdown** | React Markdown + Remark GFM |
| **Icons** | Lucide Icons + Pixel Art Icons |
| **Lottie** | DotLottie React |

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x atau lebih baru
- npm / yarn / pnpm
- Git

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/adaptivin.git
   cd adaptivin/adaptivin-user
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

3. **Environment Setup**

   Buat file `.env.local`:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Backend API
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

   # App Config
   NEXT_PUBLIC_APP_NAME=Adaptivin
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open App**

   Browser akan membuka [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build aplikasi
npm run build

# Start production server
npm start

# Analyze bundle size
npm run analyze
```

## 📁 Struktur Project

```
adaptivin-user/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (main)/         # Main app pages
│   │   │   ├── dashboard/  # Student dashboard
│   │   │   ├── practice/   # Practice mode
│   │   │   ├── adaptive/   # Adaptive quiz
│   │   │   ├── results/    # Quiz results
│   │   │   └── profile/    # Student profile
│   │   └── layout.tsx
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components
│   │   ├── quiz/           # Quiz components
│   │   ├── dashboard/      # Dashboard widgets
│   │   ├── animations/     # Animation components
│   │   └── shared/         # Shared components
│   ├── contexts/            # React Context
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useQuiz.ts
│   │   └── useProgress.ts
│   ├── lib/                 # Utilities & configs
│   │   ├── supabase.ts
│   │   └── api.ts
│   ├── types/               # TypeScript types
│   ├── utils/               # Helper functions
│   └── constants/           # App constants
├── public/                  # Static assets
│   ├── images/
│   ├── animations/
│   └── sounds/
└── package.json
```

## 🎯 Cara Kerja Adaptive System

### 1. Initial Assessment
```typescript
// Siswa mulai dengan soal tingkat medium (level 2)
const initialLevel = 2;
```

### 2. Dynamic Adjustment
```typescript
// Rule-based adjustment
if (isCorrect) {
  if (responseTime < averageTime) {
    level += 2; // Naik 2 level jika cepat dan benar
  } else {
    level += 1; // Naik 1 level jika benar
  }
} else {
  level -= 1; // Turun 1 level jika salah
}

// Level dibatasi antara 1-5
level = Math.max(1, Math.min(5, level));
```

### 3. AI Recommendation
```typescript
// Setelah quiz selesai, analisis dengan Gemini AI
const analysis = await analyzePerformance({
  correctAnswers,
  wrongAnswers,
  timeSpent,
  difficultyProgression
});

// Return: rekomendasi personal untuk siswa
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.ts`:
```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color',
      }
    }
  }
}
```

### Quiz Settings

Edit `src/config/quiz.ts`:
```typescript
export const QUIZ_CONFIG = {
  questionsPerSession: 10,
  timePerQuestion: 60, // seconds
  pointsPerCorrect: 10,
  minimumLevel: 1,
  maximumLevel: 5,
};
```

## 📊 Integrasi dengan Backend

### API Endpoints yang Digunakan

```typescript
// Authentication
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout

// Quiz
GET    /api/questions/adaptive      // Get adaptive question
POST   /api/quiz/submit-answer      // Submit answer
POST   /api/quiz/complete           // Complete quiz session

// Student Data
GET    /api/student/profile         // Get student profile
GET    /api/student/progress        // Get learning progress
GET    /api/student/history         // Get quiz history

// AI Recommendations
POST   /api/ai/analyze              // Get AI analysis
GET    /api/ai/recommendations      // Get recommendations
```

### Example Usage

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true
});

// Get adaptive question
const getQuestion = async (level: number) => {
  const response = await api.get('/questions/adaptive', {
    params: { level, subject: 'numerasi' }
  });
  return response.data;
};

// Submit answer
const submitAnswer = async (questionId: string, answer: string) => {
  const response = await api.post('/quiz/submit-answer', {
    questionId,
    answer,
    timestamp: new Date().toISOString()
  });
  return response.data;
};
```

## 🧪 Testing

```bash
# Linting
npm run lint

# Type check
tsc --noEmit

# Build test
npm run build
```

## 📈 Performance

- ✅ Lighthouse Score: 95+ (Performance)
- ✅ First Contentful Paint: < 1.5s
- ✅ Time to Interactive: < 3s
- ✅ SEO Optimized
- ✅ Accessible (WCAG AA)

### Optimization Techniques
- Server-side rendering untuk initial load
- Image optimization dengan Next.js Image
- Code splitting dan lazy loading
- React Query untuk caching
- Memoization untuk expensive computations

## 🔒 Security

- ✅ JWT-based authentication
- ✅ HTTP-only cookies untuk token storage
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ Input validation & sanitization
- ✅ Rate limiting pada API calls

## 🌍 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Kami menerima kontribusi! Silakan baca [CONTRIBUTING.md](../CONTRIBUTING.md) untuk guidelines.

## 📝 License

Developed untuk LIDM 2025. Hubungi tim untuk informasi lisensi.

## 🏆 Tentang LIDM 2025

**Adaptivin** adalah **Finalis LIDM 2025 - Top 20**

### Latar Belakang

Kesenjangan kemampuan numerasi siswa sekolah dasar dan keterbatasan asesmen konvensional dalam memetakan kesulitan individual mendorong perlunya inovasi teknologi pendidikan yang adaptif dan berbasis data.

### Metodologi Pengembangan

Pengembangan mengikuti **metode Scrum Agile** melalui tahap:
1. Analisis kebutuhan
2. Perancangan arsitektur
3. Implementasi iteratif
4. Integrasi Gemini API dan GCP
5. Pengujian melalui validasi ahli, blackbox testing
6. Uji coba lapangan di **SDN 16 Banda Aceh**

### Hasil & Impact

- ✅ Stabil secara teknis
- ✅ Valid secara pedagogis
- ✅ Efektif meningkatkan motivasi siswa
- ✅ Meningkatkan pengalaman belajar siswa
- ✅ Mendukung guru dalam asesmen formatif berbasis data
- ✅ Selaras dengan pencapaian **SDGs 4** tentang pendidikan berkualitas

## 👥 Tim Pengembang

Dikembangkan dengan ❤️ oleh Tim Adaptivin untuk LIDM 2025

## 📞 Support & Feedback

- 📧 Email: support@adaptivin.com
- 🐛 Bug Report: [GitHub Issues](https://github.com/yourusername/adaptivin/issues)
- 💡 Feature Request: [Discussions](https://github.com/yourusername/adaptivin/discussions)
- 📖 Documentation: [Wiki](https://github.com/yourusername/adaptivin/wiki)

---

<div align="center">

### 🎯 Visi Kami

**"Meningkatkan literasi numerasi siswa Indonesia melalui pembelajaran adaptif yang personal, fun, dan berbasis data"**

### 🌱 Kontribusi terhadap SDG 4

**Pendidikan Berkualitas untuk Semua**

---

Made with 💚 untuk Pendidikan Indonesia

**#LIDM2025 #AdaptiveLearning #EdTech #Numerasi #SDGs**

</div>
