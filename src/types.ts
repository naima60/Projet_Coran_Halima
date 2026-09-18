export type Riwayah = 'hafs' | 'warsh';

export type AppTabType = 
  | 'reader' 
  | 'live-recitation' 
  | 'memorization-studio' 
  | 'vocabulary' 
  | 'adhkar' 
  | 'prayer-times';

export type ReadingLayoutMode = 'continuous-page' | 'accumulative-page' | 'cards' | 'ayah-focus';

export interface AyahWord {
  id: string;
  text: string;
  textWithoutTashkeel: string;
  normalized?: string;
  translation?: string;
  meaning?: string;
  isDifficult?: boolean;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  textWithoutTashkeel: string;
  words: AyahWord[];
  audioUrl?: string;
  juz: number;
  page: number;
  tafseer?: string;
  difficultWords?: {
    word: string;
    meaning: string;
    root?: string;
    explanation?: string;
  }[];
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  ayahs?: Ayah[];
}

export interface Reciter {
  id: string;
  name: string;
  subname: string;
  identifier: string;
  serverUrl: string;
  riwayah: Riwayah;
}

export interface UserProgress {
  totalVersesReadToday: number;
  dailyGoalVerses: number;
  streakDays: number;
  lastActiveDate: string;
  selectedRiwayah: Riwayah;
  readingLayoutMode: ReadingLayoutMode;
  memorizedAyahs: Record<string, boolean>; // key: `${surahNumber}:${ayahNumber}`
  memorizationScores: Record<string, number>; // key: `${surahNumber}:${ayahNumber}`, val: score %
  savedDifficultWords: string[];
  readingHistory: {
    surahNumber: number;
    ayahNumber: number;
    timestamp: number;
  }[];
  reminderSettings: {
    enabled: boolean;
    morningTime: string;
    eveningTime: string;
    nightTime: string;
    customTime: string;
  };
  level: 'child' | 'beginner' | 'intermediate' | 'advanced';
}

export interface EvaluationResult {
  accuracyScore: number;
  verdict: string;
  wordAnalysis: {
    word: string;
    status: 'correct' | 'mispronounced' | 'missing' | 'extra';
    userSaid?: string;
    comment?: string;
  }[];
  generalFeedback: string;
  tajweedNotes?: string[];
  correctionAdvice?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'fill-in-blank' | 'word-order' | 'next-ayah' | 'word-meaning';
  questionText: string;
  ayahText?: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}
