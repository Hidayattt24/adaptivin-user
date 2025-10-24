# Data Folder

Folder ini berisi data dummy untuk development (MVP).

## Files

### `quizData.ts`

Data kuis untuk halaman kuis siswa.

**Interface:**
```typescript
interface QuizQuestion {
  id: number;
  question: string;
  image: string;
  correctAnswer: number;
}
```

**Usage:**
```typescript
import { quizData, getQuizByMateriId } from "@/data/quizData";

// Direct import (current MVP)
const questions = quizData;

// Helper function untuk simulasi API call (siap untuk future migration)
const questions = await getQuizByMateriId(materiId);
```

## Migration ke Backend

Ketika backend API sudah ready, ganti import dengan fetch call:

### Before (MVP):
```typescript
import { quizData } from "@/data/quizData";

export default function KuisPage() {
  // ... use quizData directly
}
```

### After (With Backend):
```typescript
export default function KuisPage() {
  const [quizData, setQuizData] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await fetch(`/api/materi/${materiId}/kuis`);
      const data = await response.json();
      setQuizData(data);
    };
    fetchQuiz();
  }, [materiId]);
}
```

Atau gunakan helper function yang sudah disediakan:
```typescript
import { getQuizByMateriId } from "@/data/quizData";

// Tinggal update implementation di getQuizByMateriId function
const questions = await getQuizByMateriId(materiId);
```

## TODO

- [ ] Replace dengan API endpoint dari backend
- [ ] Add loading state
- [ ] Add error handling
- [ ] Add validation
