import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Eye,
  EyeOff,
  Layers,
  Shuffle,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { Surah, Ayah, QuizQuestion } from '../types';
import { soundManager } from '../utils/soundEffects';
import { toArabicNumerals } from '../data/quranData';

interface MemorizationStudioProps {
  surah: Surah;
  userLevel: 'child' | 'beginner' | 'intermediate' | 'advanced';
  onAyahCompleted: (surahNumber: number, ayahNumber: number) => void;
}

export const MemorizationStudio: React.FC<MemorizationStudioProps> = ({
  surah,
  userLevel,
  onAyahCompleted,
}) => {
  const [activeTab, setActiveTab] = useState<'cloze' | 'unscramble' | 'next-ayah' | 'ai-quiz'>('cloze');
  const [selectedAyahIndex, setSelectedAyahIndex] = useState<number>(0);

  // Exercise 1: Cloze (Word Hiding) State
  const [hidePercentage, setHidePercentage] = useState<25 | 50 | 75 | 100>(50);
  const [revealedWords, setRevealedWords] = useState<Record<number, boolean>>({});

  // Exercise 2: Word Unscramble State
  const [scrambledWords, setScrambledWords] = useState<{ id: string; text: string; originalIndex: number }[]>([]);
  const [selectedWordOrder, setSelectedWordOrder] = useState<{ id: string; text: string; originalIndex: number }[]>([]);
  const [unscrambleStatus, setUnscrambleStatus] = useState<'in_progress' | 'correct' | 'wrong'>('in_progress');

  // Exercise 3: Next Ayah Quiz State
  const [nextAyahOptions, setNextAyahOptions] = useState<string[]>([]);
  const [selectedNextAyahOption, setSelectedNextAyahOption] = useState<string | null>(null);
  const [nextAyahQuizFeedback, setNextAyahQuizFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Exercise 4: AI Generated Quiz
  const [aiQuiz, setAiQuiz] = useState<QuizQuestion[]>([]);
  const [loadingAiQuiz, setLoadingAiQuiz] = useState<boolean>(false);
  const [currentAiQuestionIdx, setCurrentAiQuestionIdx] = useState<number>(0);
  const [selectedAiAnswer, setSelectedAiAnswer] = useState<string | null>(null);
  const [aiScore, setAiScore] = useState<number>(0);

  const currentAyah = surah.ayahs?.[selectedAyahIndex] || surah.ayahs?.[0];
  const ayahWords = currentAyah?.words || [];

  // Reset cloze state on Ayah or Hide percentage change
  useEffect(() => {
    setRevealedWords({});
  }, [selectedAyahIndex, hidePercentage, surah.number]);

  // Setup unscramble puzzle on Ayah change
  useEffect(() => {
    if (!currentAyah || ayahWords.length === 0) return;
    const mapped = ayahWords.map((w, idx) => ({
      id: w.id,
      text: w.text,
      originalIndex: idx,
    }));
    // Shuffle words randomly
    const shuffled = [...mapped].sort(() => Math.random() - 0.5);
    setScrambledWords(shuffled);
    setSelectedWordOrder([]);
    setUnscrambleStatus('in_progress');
  }, [selectedAyahIndex, surah.number]);

  // Setup Next Ayah Quiz
  useEffect(() => {
    if (!surah.ayahs || surah.ayahs.length < 2) return;
    const correctNextAyah = surah.ayahs[selectedAyahIndex + 1]?.text;
    if (!correctNextAyah) return;

    // Pick 2-3 distractor ayahs
    const otherAyahs = surah.ayahs
      .filter((_, idx) => idx !== selectedAyahIndex + 1 && idx !== selectedAyahIndex)
      .map((a) => a.text);
    const shuffledDistractors = otherAyahs.sort(() => Math.random() - 0.5).slice(0, 2);
    const allOptions = [correctNextAyah, ...shuffledDistractors].sort(() => Math.random() - 0.5);

    setNextAyahOptions(allOptions);
    setSelectedNextAyahOption(null);
    setNextAyahQuizFeedback(null);
  }, [selectedAyahIndex, surah.number]);

  // Helper to determine if a word is hidden in Cloze mode
  const isWordHidden = (wordIdx: number) => {
    if (revealedWords[wordIdx]) return false;
    if (hidePercentage === 100) return true;
    if (hidePercentage === 75) return wordIdx % 4 !== 0;
    if (hidePercentage === 50) return wordIdx % 2 === 1;
    if (hidePercentage === 25) return wordIdx % 4 === 1;
    return false;
  };

  const toggleWordReveal = (wordIdx: number) => {
    soundManager.playTapSound();
    setRevealedWords((prev) => ({
      ...prev,
      [wordIdx]: !prev[wordIdx],
    }));
  };

  // Handle Unscramble word click
  const handlePickWord = (wordItem: { id: string; text: string; originalIndex: number }) => {
    soundManager.playTapSound();
    const newSelected = [...selectedWordOrder, wordItem];
    setSelectedWordOrder(newSelected);
    setScrambledWords((prev) => prev.filter((w) => w.id !== wordItem.id));

    // If all picked, check correctness
    if (newSelected.length === ayahWords.length) {
      const isCorrect = newSelected.every((item, idx) => item.originalIndex === idx);
      if (isCorrect) {
        setUnscrambleStatus('correct');
        soundManager.playSuccessChime();
        onAyahCompleted(surah.number, currentAyah.numberInSurah);
      } else {
        setUnscrambleStatus('wrong');
        soundManager.playErrorBeep();
      }
    }
  };

  // Remove word from picked unscramble
  const handleUnpickWord = (wordItem: { id: string; text: string; originalIndex: number }) => {
    soundManager.playTapSound();
    setSelectedWordOrder((prev) => prev.filter((w) => w.id !== wordItem.id));
    setScrambledWords((prev) => [...prev, wordItem]);
    setUnscrambleStatus('in_progress');
  };

  // Next Ayah check
  const handleSelectNextAyahOption = (option: string) => {
    soundManager.playTapSound();
    setSelectedNextAyahOption(option);
    const correctNextAyah = surah.ayahs?.[selectedAyahIndex + 1]?.text;

    if (option === correctNextAyah) {
      setNextAyahQuizFeedback('correct');
      soundManager.playSuccessChime();
      onAyahCompleted(surah.number, currentAyah.numberInSurah);
    } else {
      setNextAyahQuizFeedback('wrong');
      soundManager.playErrorBeep();
    }
  };

  // Fetch AI generated quiz
  const generateAiQuiz = async () => {
    soundManager.playTapSound();
    setLoadingAiQuiz(true);
    setAiQuiz([]);
    setCurrentAiQuestionIdx(0);
    setSelectedAiAnswer(null);
    setAiScore(0);

    try {
      const res = await fetch('/api/gemini/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surahName: surah.name,
          level: userLevel,
          verses: surah.ayahs?.map((a) => ({ number: a.numberInSurah, text: a.text })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setAiQuiz(data.questions);
        }
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
    } finally {
      setLoadingAiQuiz(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Banner */}
      <div className="bg-white border border-[#EADBCE] rounded-3xl p-5 sm:p-6 shadow-xl shadow-[#2D5A27]/5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-[#EADBCE]">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#2D5A27] via-[#244b1f] to-[#173313] flex items-center justify-center text-[#F3E5AB] shadow-lg shadow-[#2D5A27]/20 border border-[#D4AF37]/40">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#2D5A27] font-quran">استوديو الحفظ والتمارين التفاعلية</h2>
              <p className="text-xs text-[#6B6358] font-serif-art">
                طرق علمية وتدريجية لتثبيت حفظ الآيات لكل الأعمار
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF7F0] p-1.5 rounded-2xl border border-[#E5DEC9]">
            <button
              onClick={() => {
                soundManager.playTapSound();
                setActiveTab('cloze');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'cloze'
                  ? 'bg-[#2D5A27] text-[#FAF7EE] shadow-md border border-[#D4AF37]/40'
                  : 'text-[#61594F] hover:text-[#2D5A27]'
              }`}
            >
              👁️ إخفاء الكلمات
            </button>
            <button
              onClick={() => {
                soundManager.playTapSound();
                setActiveTab('unscramble');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'unscramble'
                  ? 'bg-[#2D5A27] text-[#FAF7EE] shadow-md border border-[#D4AF37]/40'
                  : 'text-[#61594F] hover:text-[#2D5A27]'
              }`}
            >
              🧩 ترتيب الكلمات
            </button>
            <button
              onClick={() => {
                soundManager.playTapSound();
                setActiveTab('next-ayah');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'next-ayah'
                  ? 'bg-[#2D5A27] text-[#FAF7EE] shadow-md border border-[#D4AF37]/40'
                  : 'text-[#61594F] hover:text-[#2D5A27]'
              }`}
            >
              ⏭️ الآية التالية
            </button>
            <button
              onClick={() => {
                soundManager.playTapSound();
                setActiveTab('ai-quiz');
                if (aiQuiz.length === 0) generateAiQuiz();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ai-quiz'
                  ? 'bg-[#9A6200] text-[#FAF7EE] shadow-md border border-[#D4AF37]/40'
                  : 'text-[#8A5800] hover:text-[#9A6200]'
              }`}
            >
              ✨ اختبار الذكاء الاصطناعي
            </button>
          </div>
        </div>

        {/* Ayah Selector (for Cloze, Unscramble, Next-Ayah) */}
        {activeTab !== 'ai-quiz' && (
          <div className="flex items-center justify-between gap-3 bg-[#FAF7F0] p-3.5 rounded-2xl border border-[#E5DEC9] mb-6">
            <button
              onClick={() => {
                soundManager.playTapSound();
                if (selectedAyahIndex > 0) setSelectedAyahIndex(selectedAyahIndex - 1);
              }}
              disabled={selectedAyahIndex === 0}
              className="p-2.5 rounded-xl bg-white hover:bg-[#F4EFE6] disabled:opacity-30 text-[#4A453E] border border-[#E5DEC9] transition-colors shadow-xs"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <span className="text-[#2D5A27] font-bold font-quran text-base sm:text-lg">
              سورة {surah.name} • الآية [{toArabicNumerals(selectedAyahIndex + 1)}] من [{toArabicNumerals(surah.numberOfAyahs)}]
            </span>

            <button
              onClick={() => {
                soundManager.playTapSound();
                if (surah.ayahs && selectedAyahIndex < surah.ayahs.length - 1) {
                  setSelectedAyahIndex(selectedAyahIndex + 1);
                }
              }}
              disabled={!surah.ayahs || selectedAyahIndex >= surah.ayahs.length - 1}
              className="p-2.5 rounded-xl bg-white hover:bg-[#F4EFE6] disabled:opacity-30 text-[#4A453E] border border-[#E5DEC9] transition-colors shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* TAB 1: Progressive Cloze / Word Hiding */}
        {activeTab === 'cloze' && (
          <div className="space-y-6">
            {/* Percentage options */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs text-[#6B6358] font-serif-art">نسبة الإخفاء للتسميع:</span>
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    soundManager.playTapSound();
                    setHidePercentage(pct as any);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    hidePercentage === pct
                      ? 'bg-[#2D5A27] text-white border-[#2D5A27] shadow-xs'
                      : 'bg-[#FAF7F0] text-[#4A453E] border-[#E5DEC9] hover:bg-[#F2ECE0]'
                  }`}
                >
                  {toArabicNumerals(pct)}% إخفاء
                </button>
              ))}
            </div>

            {/* Ayah display with masked words */}
            <div className="bg-[#FFFDF9] border-2 border-[#D4AF37]/60 rounded-3xl p-6 sm:p-8 text-center shadow-md">
              {selectedAyahIndex === 0 && surah.number !== 9 && surah.number !== 1 && (
                <div className="text-center pb-4 mb-4 border-b border-[#D4AF37]/30">
                  <span className="font-quran text-2xl sm:text-3xl text-[#2D5A27] tracking-wider select-none block">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </span>
                  <p className="text-[11px] text-[#8A5800] font-serif-art mt-1">
                    الاستفتاح بالبسملة سنة مباركة عند بداية السورة، وتبدأ الآية الأولى بعدها
                  </p>
                </div>
              )}

              <p className="text-xs text-[#6B6358] font-serif-art mb-4">
                💡 اقرأ غيباً وانقر على الكلمة المخفية لكشفها والتحقق من حفظك:
              </p>

              <div className="font-quran text-3xl sm:text-4xl leading-[2.8] text-[#2C2A29] select-none">
                {ayahWords.map((wordObj, idx) => {
                  const hidden = isWordHidden(idx);
                  return (
                    <span
                      key={wordObj.id}
                      onClick={() => toggleWordReveal(idx)}
                      className={`inline-block mx-1.5 px-3 py-1 rounded-xl cursor-pointer transition-all duration-200 ${
                        hidden
                          ? 'bg-[#F2ECE0] text-transparent border-2 border-dashed border-[#D4AF37] hover:border-[#2D5A27] select-none min-w-[70px] text-center'
                          : 'bg-[#FFF2D6] text-[#2D5A27] font-bold border border-[#E5C368] hover:bg-[#FFECC2]'
                      }`}
                    >
                      {hidden ? '••••' : wordObj.text}
                    </span>
                  );
                })}
                <span className="inline-block mr-2 text-[#D4AF37] font-quran text-2xl">
                  ۝{toArabicNumerals(currentAyah.numberInSurah)}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  soundManager.playTapSound();
                  setRevealedWords({});
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#F2ECE0] text-[#4A453E] border border-[#E5DEC9] text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إخفاء الكل مجدداً</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playTapSound();
                  const allRevealed: Record<number, boolean> = {};
                  ayahWords.forEach((_, i) => (allRevealed[i] = true));
                  setRevealedWords(allRevealed);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#386d31] text-[#FAF7EE] text-xs font-bold flex items-center gap-2 transition-colors shadow-md shadow-[#2D5A27]/20 border border-[#D4AF37]/40"
              >
                <Eye className="w-4 h-4" />
                <span>كشف كامل الآية</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Word Unscramble Puzzle */}
        {activeTab === 'unscramble' && (
          <div className="space-y-6">
            {selectedAyahIndex === 0 && surah.number !== 9 && surah.number !== 1 && (
              <div className="text-center py-3 px-4 bg-[#FAF7EE] border border-[#D4AF37]/30 rounded-2xl">
                <span className="font-quran text-xl sm:text-2xl text-[#2D5A27] tracking-wide select-none block">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
                <p className="text-[11px] text-[#8A5800] font-serif-art mt-0.5">
                  استفتح بالبسملة، ثم رتّب كلمات الآية الأولى أدناه
                </p>
              </div>
            )}

            <p className="text-xs text-center text-[#6B6358] font-serif-art">
              🧩 رتب كلمات الآية التالية بالترتيب الصحيح من اليمين إلى اليسار:
            </p>

            {/* Dropped / Picked sequence box */}
            <div
              className={`min-h-[100px] p-6 rounded-3xl border-2 transition-all flex flex-wrap items-center justify-center gap-2.5 ${
                unscrambleStatus === 'correct'
                  ? 'bg-[#F0F7EE] border-[#2D5A27] ring-2 ring-[#2D5A27]/20'
                  : unscrambleStatus === 'wrong'
                  ? 'bg-[#FFF0F0] border-[#EF4444]'
                  : 'bg-[#FFFDF9] border-[#EADBCE]'
              }`}
            >
              {selectedWordOrder.length === 0 ? (
                <span className="text-[#9E9589] text-sm italic font-serif-art">
                  انقر على الكلمات بالأسفل لتجميع الآية هنا...
                </span>
              ) : (
                selectedWordOrder.map((item) => (
                  <motion.button
                    key={item.id}
                    layout
                    onClick={() => handleUnpickWord(item)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-l from-[#2D5A27] to-[#1F431B] text-[#FAF7EE] font-quran text-2xl hover:bg-rose-800 transition-colors shadow-md border border-[#D4AF37]/40"
                  >
                    {item.text}
                  </motion.button>
                ))
              )}
            </div>

            {/* Status indicator banner */}
            {unscrambleStatus === 'correct' && (
              <div className="p-3.5 bg-[#F0F7EE] border border-[#A3CF9E] rounded-2xl text-center text-[#2D5A27] font-bold text-sm flex items-center justify-center gap-2 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#2D5A27]" />
                <span>أحسنت! ترتيب الآية متقن وصحيح 100% ✨</span>
              </div>
            )}
            {unscrambleStatus === 'wrong' && (
              <div className="p-3.5 bg-[#FFF0F0] border border-[#FCA5A5] rounded-2xl text-center text-[#991B1B] font-bold text-sm flex items-center justify-center gap-2 shadow-xs">
                <XCircle className="w-5 h-5 text-[#DC2626]" />
                <span>الترتيب غير صحيح، انقر على الكلمات لإزالتها والمحاولة مجدداً</span>
              </div>
            )}

            {/* Pool of scattered words */}
            <div className="p-6 bg-[#FAF7F0] rounded-3xl border border-[#E5DEC9] flex flex-wrap items-center justify-center gap-3">
              {scrambledWords.map((item) => (
                <motion.button
                  key={item.id}
                  layout
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePickWord(item)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#F4EFE6] text-[#2C2A29] font-quran text-2xl border border-[#E5DEC9] shadow-xs transition-colors"
                >
                  {item.text}
                </motion.button>
              ))}
            </div>

            {/* Reset button */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  soundManager.playTapSound();
                  const mapped = ayahWords.map((w, idx) => ({
                    id: w.id,
                    text: w.text,
                    originalIndex: idx,
                  }));
                  setScrambledWords([...mapped].sort(() => Math.random() - 0.5));
                  setSelectedWordOrder([]);
                  setUnscrambleStatus('in_progress');
                }}
                className="px-5 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#F2ECE0] text-[#4A453E] border border-[#E5DEC9] text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
              >
                <Shuffle className="w-4 h-4" />
                <span>إعادة خلط الكلمات</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Next Ayah Quiz */}
        {activeTab === 'next-ayah' && (
          <div className="space-y-6">
            {/* Prompt Ayah */}
            <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/60 text-center space-y-3 shadow-md">
              <span className="text-xs px-3 py-1 rounded-full bg-[#F0F7EE] text-[#2D5A27] border border-[#A3CF9E] font-bold">
                الآية الحالية [رقم {toArabicNumerals(selectedAyahIndex + 1)}]
              </span>
              <p className="font-quran text-2xl sm:text-3xl leading-[2.5] text-[#2C2A29]">
                {currentAyah.text}
              </p>
            </div>

            <p className="text-xs text-center text-[#6B6358] font-bold font-serif-art">
              ❓ ما هي الآية الكريمة التالية مباشرة في سياق السورة؟
            </p>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {nextAyahOptions.map((opt, i) => {
                const isSelected = selectedNextAyahOption === opt;
                const isCorrectOption = opt === surah.ayahs?.[selectedAyahIndex + 1]?.text;

                let optClass = 'bg-white border-[#EADBCE] hover:border-[#D4AF37] text-[#2C2A29] shadow-xs';
                if (isSelected) {
                  if (nextAyahQuizFeedback === 'correct') {
                    optClass = 'bg-[#F0F7EE] border-[#2D5A27] text-[#2D5A27] ring-2 ring-[#2D5A27]/20';
                  } else if (nextAyahQuizFeedback === 'wrong') {
                    optClass = 'bg-[#FFF0F0] border-[#EF4444] text-[#991B1B]';
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={nextAyahQuizFeedback !== null}
                    onClick={() => handleSelectNextAyahOption(opt)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border text-right transition-all font-quran text-xl leading-relaxed flex items-center justify-between gap-3 ${optClass}`}
                  >
                    <span>{opt}</span>
                    {isSelected && nextAyahQuizFeedback === 'correct' && (
                      <CheckCircle2 className="w-5 h-5 text-[#2D5A27] shrink-0" />
                    )}
                    {isSelected && nextAyahQuizFeedback === 'wrong' && (
                      <XCircle className="w-5 h-5 text-[#DC2626] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: AI Comprehensive Quiz */}
        {activeTab === 'ai-quiz' && (
          <div className="space-y-6">
            {loadingAiQuiz ? (
              <div className="py-12 text-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#9A6200] mx-auto" />
                <p className="text-sm font-bold text-[#8A5800] font-serif-art">
                  جاري توليد أسئلة حفظ مخصصة لسورة {surah.name} بالذكاء الاصطناعي...
                </p>
              </div>
            ) : aiQuiz.length > 0 ? (
              <div className="space-y-6">
                {/* Quiz Progress */}
                <div className="flex items-center justify-between text-xs text-[#6B6358] pb-2 border-b border-[#EADBCE]">
                  <span>
                    السؤال {toArabicNumerals(currentAiQuestionIdx + 1)} من {toArabicNumerals(aiQuiz.length)}
                  </span>
                  <span className="text-[#8A5800] font-bold">
                    النقاط: {toArabicNumerals(aiScore)} / {toArabicNumerals(aiQuiz.length)}
                  </span>
                </div>

                {/* Current Question */}
                {aiQuiz[currentAiQuestionIdx] && (
                  <div className="space-y-4">
                    <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#D4AF37]/40 space-y-2 shadow-xs">
                      <h4 className="text-base font-bold text-[#2D5A27] leading-relaxed">
                        {aiQuiz[currentAiQuestionIdx].questionText}
                      </h4>
                      {aiQuiz[currentAiQuestionIdx].ayahText && (
                        <p className="font-quran text-xl text-[#2C2A29] pt-2 border-t border-[#EADBCE]">
                          {aiQuiz[currentAiQuestionIdx].ayahText}
                        </p>
                      )}
                    </div>

                    {/* Options */}
                    <div className="space-y-2.5">
                      {aiQuiz[currentAiQuestionIdx].options.map((option, idx) => {
                        const isChosen = selectedAiAnswer === option;
                        const isCorrect = option === aiQuiz[currentAiQuestionIdx].correctAnswer;

                        let style = 'bg-white border-[#EADBCE] hover:border-[#D4AF37] text-[#2C2A29] shadow-xs';
                        if (selectedAiAnswer) {
                          if (isCorrect) {
                            style = 'bg-[#F0F7EE] border-[#2D5A27] text-[#2D5A27] font-bold';
                          } else if (isChosen && !isCorrect) {
                            style = 'bg-[#FFF0F0] border-[#EF4444] text-[#991B1B]';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={selectedAiAnswer !== null}
                            onClick={() => {
                              soundManager.playTapSound();
                              setSelectedAiAnswer(option);
                              if (option === aiQuiz[currentAiQuestionIdx].correctAnswer) {
                                soundManager.playSuccessChime();
                                setAiScore((s) => s + 1);
                              } else {
                                soundManager.playErrorBeep();
                              }
                            }}
                            className={`w-full p-4 rounded-xl border text-right transition-all font-medium text-sm flex items-center justify-between ${style}`}
                          >
                            <span>{option}</span>
                            {selectedAiAnswer && isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-[#2D5A27] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation and Next Question */}
                    {selectedAiAnswer && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-[#FAF7F0] rounded-xl border border-[#E5DEC9] space-y-3"
                      >
                        {aiQuiz[currentAiQuestionIdx].explanation && (
                          <p className="text-xs text-[#4A453E] leading-relaxed">
                            💡 <span className="font-bold text-[#8A5800]">التوضيح:</span>{' '}
                            {aiQuiz[currentAiQuestionIdx].explanation}
                          </p>
                        )}

                        <div className="flex justify-end">
                          {currentAiQuestionIdx < aiQuiz.length - 1 ? (
                            <button
                              onClick={() => {
                                soundManager.playTapSound();
                                setCurrentAiQuestionIdx((prev) => prev + 1);
                                setSelectedAiAnswer(null);
                              }}
                              className="px-5 py-2 rounded-xl bg-[#9A6200] hover:bg-[#8A5800] text-white text-xs font-bold transition-colors"
                            >
                              السؤال التالي
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                soundManager.playSuccessChime();
                                generateAiQuiz();
                              }}
                              className="px-5 py-2 rounded-xl bg-[#2D5A27] hover:bg-[#386d31] text-white text-xs font-bold transition-colors shadow-md"
                            >
                              إكمال الاختبار وإنشاء اختبار جديد
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <button
                  onClick={generateAiQuiz}
                  className="px-6 py-3 rounded-2xl bg-[#9A6200] hover:bg-[#8A5800] text-white font-bold text-sm transition-colors shadow-lg"
                >
                  إنشاء اختبار حفظ ذكي جديد
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
