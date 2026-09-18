import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Mic,
  Brain,
  BookMarked,
  TrendingUp,
  Sparkles,
  Heart,
  Share2,
} from 'lucide-react';
import { Surah, Reciter, UserProgress, Riwayah } from './types';
import { SURAHS_LIST, RECITERS, getRecitersByRiwayah, getSurahWithAyahs } from './data/quranData';
import { Header } from './components/Header';
import { ProgressiveReader } from './components/ProgressiveReader';
import { LiveRecitationTester } from './components/LiveRecitationTester';
import { MemorizationStudio } from './components/MemorizationStudio';
import { VocabularyPanel } from './components/VocabularyPanel';
import { ProgressAndReminders } from './components/ProgressAndReminders';
import { WordMeaningModal } from './components/WordMeaningModal';
import { soundManager } from './utils/soundEffects';

const INITIAL_PROGRESS: UserProgress = {
  totalVersesReadToday: 0,
  dailyGoalVerses: 5,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  memorizedAyahs: {
    '1:1': true,
    '1:2': true,
    '1:3': true,
    '1:4': true,
    '1:5': true,
    '1:6': true,
    '1:7': true,
    '112:1': true,
    '112:2': true,
    '112:3': true,
    '112:4': true,
  },
  memorizationScores: {},
  savedDifficultWords: ['الصَّمَدُ', 'الْفَلَقِ', 'غَاسِقٍ', 'الْكَوْثَرَ', 'تَبَارَكَ'],
  readingHistory: [],
  selectedRiwayah: 'hafs',
  readingLayoutMode: 'continuous-page',
  reminderSettings: {
    enabled: true,
    morningTime: '05:30',
    eveningTime: '17:00',
    nightTime: '21:30',
    customTime: '08:00',
  },
  level: 'beginner',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'reader' | 'live-recitation' | 'memorization-studio' | 'vocabulary' | 'progress'>('reader');
  const [selectedRiwayah, setSelectedRiwayah] = useState<Riwayah>(() => {
    try {
      const stored = localStorage.getItem('ratel_selected_riwayah');
      if (stored === 'warsh' || stored === 'hafs') return stored;
    } catch (e) {
      // ignore
    }
    return 'hafs';
  });

  const [currentSurahNumber, setCurrentSurahNumber] = useState<number>(1);
  const [currentReciter, setCurrentReciter] = useState<Reciter>(() => {
    const matched = getRecitersByRiwayah(selectedRiwayah);
    return matched[0] || RECITERS[0];
  });

  const [currentSurah, setCurrentSurah] = useState<Surah>({
    ...SURAHS_LIST[0],
    ayahs: [],
  });
  const [isLoadingSurah, setIsLoadingSurah] = useState<boolean>(true);

  // User Progress stored in localStorage
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem('ratel_user_progress');
      if (stored) {
        const parsed = JSON.parse(stored);
        const today = new Date().toISOString().split('T')[0];
        // If it's a new day, reset today's verses count
        if (parsed.lastActiveDate !== today) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          const streak = parsed.lastActiveDate === yesterday ? parsed.streakDays + 1 : 1;
          return {
            ...parsed,
            totalVersesReadToday: 0,
            streakDays: streak,
            lastActiveDate: today,
          };
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not load progress from storage:', e);
    }
    return INITIAL_PROGRESS;
  });

  // Word explanation modal state
  const [wordModalData, setWordModalData] = useState<{
    isOpen: boolean;
    word: string;
    ayahContext: string;
    surahName: string;
    predefinedMeaning?: any;
  }>({
    isOpen: false,
    word: '',
    ayahContext: '',
    surahName: '',
  });

  // Save Riwayah choice to localStorage
  const handleSelectRiwayah = (riwayah: Riwayah) => {
    setSelectedRiwayah(riwayah);
    try {
      localStorage.setItem('ratel_selected_riwayah', riwayah);
    } catch (e) {
      // ignore
    }
    const recitersForRiwayah = getRecitersByRiwayah(riwayah);
    if (recitersForRiwayah.length > 0) {
      setCurrentReciter(recitersForRiwayah[0]);
    }
  };

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('ratel_user_progress', JSON.stringify(userProgress));
    } catch (e) {
      // ignore
    }
  }, [userProgress]);

  // Load Surah details & Ayahs
  useEffect(() => {
    let isMounted = true;
    setIsLoadingSurah(true);

    getSurahWithAyahs(currentSurahNumber, currentReciter, selectedRiwayah).then((surahData) => {
      if (isMounted) {
        setCurrentSurah(surahData);
        setIsLoadingSurah(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [currentSurahNumber, currentReciter, selectedRiwayah]);

  // Handle word click anywhere
  const handleWordClick = (word: string, ayahContext: string, predefinedMeaning?: any) => {
    setWordModalData({
      isOpen: true,
      word,
      ayahContext,
      surahName: currentSurah.name,
      predefinedMeaning,
    });
  };

  // When user reads/completes an Ayah
  const handleAyahCompleted = (surahNumber: number, ayahNumber: number) => {
    setUserProgress((prev) => {
      const today = new Date().toISOString().split('T')[0];
      return {
        ...prev,
        totalVersesReadToday: prev.totalVersesReadToday + 1,
        lastActiveDate: today,
        readingHistory: [
          { surahNumber, ayahNumber, timestamp: Date.now() },
          ...prev.readingHistory.slice(0, 100),
        ],
      };
    });
  };

  // Check if Ayah is memorized
  const isAyahMemorized = (surahNumber: number, ayahNumber: number) => {
    return !!userProgress.memorizedAyahs[`${surahNumber}:${ayahNumber}`];
  };

  // Toggle Ayah memorized
  const handleToggleMemorized = (surahNumber: number, ayahNumber: number) => {
    soundManager.playTapSound();
    setUserProgress((prev) => {
      const key = `${surahNumber}:${ayahNumber}`;
      const newMemorized = { ...prev.memorizedAyahs };
      if (newMemorized[key]) {
        delete newMemorized[key];
      } else {
        newMemorized[key] = true;
        soundManager.playSuccessChime();
      }
      return {
        ...prev,
        memorizedAyahs: newMemorized,
      };
    });
  };

  // Toggle Save word in vocabulary
  const handleToggleSaveWord = (word: string) => {
    soundManager.playTapSound();
    setUserProgress((prev) => {
      const exists = prev.savedDifficultWords.includes(word);
      const updated = exists
        ? prev.savedDifficultWords.filter((w) => w !== word)
        : [...prev.savedDifficultWords, word];
      return {
        ...prev,
        savedDifficultWords: updated,
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] bg-parchment text-[#2C2A29] flex flex-col selection:bg-[#2D5A27] selection:text-white">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentSurah={currentSurah}
        onSelectSurah={setCurrentSurahNumber}
        progress={userProgress}
        selectedRiwayah={selectedRiwayah}
        onSelectRiwayah={handleSelectRiwayah}
        currentReciter={currentReciter}
        onSelectReciter={setCurrentReciter}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoadingSurah ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-quran text-2xl text-[#2D5A27]">
              جاري فتح المصحف الشريف برواية {selectedRiwayah === 'warsh' ? 'ورش عن نافع' : 'حفص عن عاصم'}...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${selectedRiwayah}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'reader' && (
                <ProgressiveReader
                  surah={currentSurah}
                  currentReciter={currentReciter}
                  onSelectReciter={setCurrentReciter}
                  onSelectSurah={setCurrentSurahNumber}
                  onWordClick={handleWordClick}
                  onAyahCompleted={handleAyahCompleted}
                  isAyahMemorized={isAyahMemorized}
                  onToggleMemorized={handleToggleMemorized}
                  versesReadToday={userProgress.totalVersesReadToday}
                  selectedRiwayah={selectedRiwayah}
                  onSelectRiwayah={handleSelectRiwayah}
                />
              )}

              {activeTab === 'live-recitation' && (
                <LiveRecitationTester
                  surah={currentSurah}
                  currentReciter={currentReciter}
                  onSelectReciter={setCurrentReciter}
                  onAyahCompleted={handleAyahCompleted}
                  onWordClick={handleWordClick}
                  selectedRiwayah={selectedRiwayah}
                />
              )}

              {activeTab === 'memorization-studio' && (
                <MemorizationStudio
                  surah={currentSurah}
                  userLevel={userProgress.level}
                  onAyahCompleted={handleAyahCompleted}
                />
              )}

              {activeTab === 'vocabulary' && (
                <VocabularyPanel
                  currentSurah={currentSurah}
                  onSelectWord={handleWordClick}
                  savedWords={userProgress.savedDifficultWords}
                  onToggleSaveWord={handleToggleSaveWord}
                />
              )}

              {activeTab === 'progress' && (
                <ProgressAndReminders
                  progress={userProgress}
                  onUpdateGoal={(newGoal) => {
                    setUserProgress((p) => ({ ...p, dailyGoalVerses: newGoal }));
                  }}
                  onUpdateLevel={(newLevel) => {
                    setUserProgress((p) => ({ ...p, level: newLevel }));
                  }}
                  onUpdateReminders={(newSettings) => {
                    setUserProgress((p) => ({ ...p, reminderSettings: newSettings }));
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Word Meaning & AI Tafseer Modal */}
      <WordMeaningModal
        isOpen={wordModalData.isOpen}
        onClose={() => setWordModalData((prev) => ({ ...prev, isOpen: false }))}
        word={wordModalData.word}
        ayahContext={wordModalData.ayahContext}
        surahName={wordModalData.surahName}
        predefinedMeaning={wordModalData.predefinedMeaning}
        onSaveWord={handleToggleSaveWord}
        isSaved={userProgress.savedDifficultWords.includes(wordModalData.word)}
      />

      {/* App Footer */}
      <footer className="border-t border-[#EADBCE] bg-[#F7F4EB] py-6 mt-12 text-center text-xs text-[#6B6358] space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="font-bold text-[#2D5A27] font-quran text-base">
            منصة حليمة لتعلم و حفظ القرآن الكريم
          </span>
          <span className="text-[#C5A059]">•</span>
          <span className="font-serif-art font-semibold text-[#4A453E]">قال رسول الله ﷺ: «خَيْرُكُمْ مَنْ تَعَلَّمَ القُرْآنَ وَعَلَّمَهُ»</span>
        </div>
        <p className="text-[#877E72]">
          مصحف إلكتروني بروايتي حفص وورش مع الاستماع الصوتي المعتمد والمصحح الذكي الفوري
        </p>
      </footer>
    </div>
  );
}
