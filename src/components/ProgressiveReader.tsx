import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Settings2,
  Bookmark,
  Sparkles,
  Repeat,
  FastForward,
  Eye,
  EyeOff,
  CheckCircle2,
  Award,
  Layers,
  FileText,
  PlusCircle,
  VolumeX,
} from 'lucide-react';
import { Surah, Ayah, Reciter, Riwayah, ReadingLayoutMode } from '../types';
import { RECITERS, getRecitersByRiwayah, toArabicNumerals } from '../data/quranData';
import { soundManager } from '../utils/soundEffects';

interface ProgressiveReaderProps {
  surah: Surah;
  currentReciter: Reciter;
  onSelectReciter: (reciter: Reciter) => void;
  onSelectSurah: (surahNumber: number) => void;
  onWordClick: (word: string, ayahContext: string, predefinedMeaning?: any) => void;
  onAyahCompleted: (surahNumber: number, ayahNumber: number) => void;
  isAyahMemorized: (surahNumber: number, ayahNumber: number) => boolean;
  onToggleMemorized: (surahNumber: number, ayahNumber: number) => void;
  versesReadToday: number;
  selectedRiwayah: Riwayah;
  onSelectRiwayah: (riwayah: Riwayah) => void;
}

export const ProgressiveReader: React.FC<ProgressiveReaderProps> = ({
  surah,
  currentReciter,
  onSelectReciter,
  onSelectSurah,
  onWordClick,
  onAyahCompleted,
  isAyahMemorized,
  onToggleMemorized,
  versesReadToday,
  selectedRiwayah,
  onSelectRiwayah,
}) => {
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [repeatCount, setRepeatCount] = useState<number>(1); // 1, 3, 5, 10
  const [currentRepeatIteration, setCurrentRepeatIteration] = useState<number>(1);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const [showTafseer, setShowTafseer] = useState<boolean>(false);
  const [selectedAyahForTafseer, setSelectedAyahForTafseer] = useState<Ayah | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Page display modes:
  // 'continuous-page': All verses flow like a continuous real Mushaf page
  // 'accumulative-page': Verses append progressively one by one on the same page as read!
  // 'cards': Traditional separated cards view
  const [layoutMode, setLayoutMode] = useState<'continuous-page' | 'accumulative-page' | 'cards'>('continuous-page');
  
  // For accumulative mode: how many verses have been appended to the current screen
  const [accumulatedAyahCount, setAccumulatedAyahCount] = useState<number>(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wordIntervalRef = useRef<any>(null);
  const activeWordElemRef = useRef<HTMLSpanElement | null>(null);

  const totalAyahs = surah.ayahs?.length || 0;
  const currentAyah = surah.ayahs?.[currentAyahIndex] || surah.ayahs?.[0];

  // Available reciters filtered by active Riwayah
  const filteredReciters = getRecitersByRiwayah(selectedRiwayah);

  // Reset when surah changes
  useEffect(() => {
    setCurrentAyahIndex(0);
    setAccumulatedAyahCount(1);
    setIsPlaying(false);
    setActiveWordIndex(null);
    clearInterval(wordIntervalRef.current);
  }, [surah.number]);

  // Keep reciter synced with Riwayah
  useEffect(() => {
    if (currentReciter.riwayah !== selectedRiwayah) {
      const matched = filteredReciters[0] || RECITERS[0];
      onSelectReciter(matched);
    }
  }, [selectedRiwayah]);

  // Handle audio play/pause
  const togglePlay = () => {
    soundManager.playTapSound();
    if (!audioRef.current || !currentAyah) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      clearInterval(wordIntervalRef.current);
    } else {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          startWordProgression();
        })
        .catch((err) => {
          console.warn('Audio playback issue:', err);
          setIsPlaying(true);
          startWordProgression();
        });
    }
  };

  // Start word-by-word highlighted progressive reading
  const startWordProgression = () => {
    clearInterval(wordIntervalRef.current);
    if (!currentAyah || !currentAyah.words || currentAyah.words.length === 0) return;

    const wordsCount = currentAyah.words.length;
    const audioDuration = audioRef.current?.duration || Math.max(2.5, wordsCount * 0.65);
    const timePerWordMs = (audioDuration / wordsCount / playbackSpeed) * 1000;

    let wordIdx = 0;
    setActiveWordIndex(0);

    wordIntervalRef.current = setInterval(() => {
      wordIdx++;
      if (wordIdx < wordsCount) {
        setActiveWordIndex(wordIdx);
      } else {
        clearInterval(wordIntervalRef.current);
      }
    }, Math.max(300, timePerWordMs));
  };

  // When an ayah audio ends
  const handleAudioEnded = () => {
    clearInterval(wordIntervalRef.current);
    setActiveWordIndex(null);

    // Count this verse as completed!
    if (currentAyah) {
      onAyahCompleted(surah.number, currentAyah.numberInSurah);
    }

    // Check repetition
    if (currentRepeatIteration < repeatCount) {
      setCurrentRepeatIteration((prev) => prev + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        startWordProgression();
      }
    } else {
      // Move to next Ayah
      setCurrentRepeatIteration(1);
      if (surah.ayahs && currentAyahIndex < surah.ayahs.length - 1) {
        const nextIndex = currentAyahIndex + 1;
        setCurrentAyahIndex(nextIndex);
        setAccumulatedAyahCount((prev) => Math.max(prev, nextIndex + 1));

        // Autoplay next ayah smoothly
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().then(() => {
              setIsPlaying(true);
              startWordProgression();
            });
          }
        }, 350);
      } else {
        setIsPlaying(false);
        soundManager.playSuccessChime();
      }
    }
  };

  const handleNextAyah = () => {
    soundManager.playTapSound();
    if (surah.ayahs && currentAyahIndex < surah.ayahs.length - 1) {
      const nextIndex = currentAyahIndex + 1;
      setCurrentAyahIndex(nextIndex);
      setAccumulatedAyahCount((prev) => Math.max(prev, nextIndex + 1));
      setCurrentRepeatIteration(1);
      setActiveWordIndex(null);
      if (isPlaying && audioRef.current) {
        setTimeout(() => {
          audioRef.current?.play();
          startWordProgression();
        }, 200);
      }
    }
  };

  const handlePrevAyah = () => {
    soundManager.playTapSound();
    if (currentAyahIndex > 0) {
      setCurrentAyahIndex((prev) => prev - 1);
      setCurrentRepeatIteration(1);
      setActiveWordIndex(null);
      if (isPlaying && audioRef.current) {
        setTimeout(() => {
          audioRef.current?.play();
          startWordProgression();
        }, 200);
      }
    }
  };

  const selectAyah = (index: number) => {
    soundManager.playTapSound();
    setCurrentAyahIndex(index);
    setAccumulatedAyahCount((prev) => Math.max(prev, index + 1));
    setCurrentRepeatIteration(1);
    setActiveWordIndex(null);
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play();
        startWordProgression();
      }, 200);
    }
  };

  // Font size classes
  const fontSizes = {
    normal: 'text-2xl sm:text-3xl leading-[2.4]',
    large: 'text-3xl sm:text-4xl leading-[2.7]',
    huge: 'text-4xl sm:text-5xl leading-[3.0]',
  };

  // Ayahs to display depending on layout mode
  const displayedAyahs = (surah.ayahs || []).filter((_, idx) => {
    if (layoutMode === 'accumulative-page') {
      return idx < accumulatedAyahCount;
    }
    return true; // continuous or cards
  });

  return (
    <div className="space-y-6">
      {/* Hidden Audio Element */}
      {currentAyah?.audioUrl && (
        <audio
          ref={audioRef}
          src={currentAyah.audioUrl}
          onEnded={handleAudioEnded}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          preload="auto"
        />
      )}

      {/* Top Header & Mode Control Bar */}
      <div className="bg-white border border-[#EADBCE] rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          {/* Surah Identification & Riwayah */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#2D5A27] via-[#244b1f] to-[#173313] flex items-center justify-center text-[#F3E5AB] font-bold font-quran text-lg sm:text-xl shadow-xs border border-[#D4AF37]/40 shrink-0">
              {toArabicNumerals(surah.number)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 className="text-lg sm:text-2xl font-bold text-[#2D5A27] font-quran">
                  سورة {surah.name}
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#F0F7EE] text-[#2D5A27] border border-[#A3CF9E] font-medium font-serif-art">
                  {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold border ${
                  selectedRiwayah === 'warsh'
                    ? 'bg-[#FFF8E7] text-[#8A5800] border-[#E5C368]'
                    : 'bg-[#F0F7EE] text-[#2D5A27] border-[#A3CF9E]'
                }`}>
                  رواية {selectedRiwayah === 'warsh' ? 'ورش' : 'حفص'}
                </span>
              </div>
              <p className="text-xs text-[#6B6358] font-serif-art mt-0.5">
                {toArabicNumerals(surah.numberOfAyahs)} آية • الآية المحددة:{' '}
                <span className="text-[#8A5800] font-bold font-quran text-sm sm:text-base">
                  {toArabicNumerals(currentAyahIndex + 1)}
                </span>
              </p>
            </div>
          </div>

          {/* Reciter & Display Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
            {/* Display Mode Switcher (Continuous Mushaf / Progressive Accumulation / Cards) */}
            <div className="flex items-center p-0.5 bg-[#FAF7F0] border border-[#E5DEC9] rounded-xl shadow-xs">
              <button
                onClick={() => {
                  soundManager.playTapSound();
                  setLayoutMode('continuous-page');
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  layoutMode === 'continuous-page'
                    ? 'bg-[#2D5A27] text-white shadow-xs'
                    : 'text-[#61594F] hover:text-[#2D5A27]'
                }`}
                title="عرض المصحف المتصل"
              >
                <BookOpen className="w-3 h-3" />
                <span>المصحف المتصل</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playTapSound();
                  setLayoutMode('accumulative-page');
                  setAccumulatedAyahCount(Math.max(1, currentAyahIndex + 1));
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  layoutMode === 'accumulative-page'
                    ? 'bg-[#8A5800] text-white shadow-xs'
                    : 'text-[#61594F] hover:text-[#8A5800]'
                }`}
                title="إضافة الآيات تدريجياً"
              >
                <PlusCircle className="w-3 h-3" />
                <span>إضافة تراكمية</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playTapSound();
                  setLayoutMode('cards');
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  layoutMode === 'cards'
                    ? 'bg-[#2D5A27] text-white shadow-xs'
                    : 'text-[#61594F] hover:text-[#2D5A27]'
                }`}
                title="عرض بطاقات"
              >
                <Layers className="w-3 h-3" />
                <span>بطاقات</span>
              </button>
            </div>

            <button
              onClick={() => {
                soundManager.playTapSound();
                setShowSettings(!showSettings);
              }}
              className={`p-2 rounded-xl border transition-colors ${
                showSettings
                  ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                  : 'bg-[#FAF7F0] text-[#4A453E] border-[#E5DEC9] hover:bg-[#F2ECE0]'
              }`}
              title="خيارات القراءة والخط"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Settings */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-4 mt-4 border-t border-[#EADBCE]"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Font Size */}
                <div className="bg-[#FAF7F0] p-3.5 rounded-2xl border border-[#E5DEC9] space-y-2">
                  <span className="text-[#6B6358] font-medium block">حجم الخط القرآني</span>
                  <div className="flex items-center gap-1.5">
                    {(['normal', 'large', 'huge'] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setFontSize(sz)}
                        className={`flex-1 py-1.5 rounded-lg border text-center font-bold ${
                          fontSize === sz
                            ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                            : 'bg-white text-[#6B6358] border-[#E5DEC9] hover:bg-[#F4EFE6]'
                        }`}
                      >
                        {sz === 'normal' ? 'متوسط' : sz === 'large' ? 'كبير' : 'كبير جداً'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Repetition */}
                <div className="bg-[#FAF7F0] p-3.5 rounded-2xl border border-[#E5DEC9] space-y-2">
                  <span className="text-[#6B6358] font-medium block">تكرار الآية للحفظ</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 3, 5, 10].map((rep) => (
                      <button
                        key={rep}
                        onClick={() => {
                          setRepeatCount(rep);
                          setCurrentRepeatIteration(1);
                        }}
                        className={`flex-1 py-1.5 rounded-lg border text-center font-bold ${
                          repeatCount === rep
                            ? 'bg-[#8A5800] text-white border-[#8A5800]'
                            : 'bg-white text-[#6B6358] border-[#E5DEC9] hover:bg-[#F4EFE6]'
                        }`}
                      >
                        {toArabicNumerals(rep)}×
                      </button>
                    ))}
                  </div>
                </div>

                {/* Speed */}
                <div className="bg-[#FAF7F0] p-3.5 rounded-2xl border border-[#E5DEC9] space-y-2">
                  <span className="text-[#6B6358] font-medium block">سرعة التلاوة</span>
                  <div className="flex items-center gap-1.5">
                    {[0.75, 1.0, 1.25].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => {
                          setPlaybackSpeed(spd);
                          if (audioRef.current) audioRef.current.playbackRate = spd;
                        }}
                        className={`flex-1 py-1.5 rounded-lg border text-center font-bold ${
                          playbackSpeed === spd
                            ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                            : 'bg-white text-[#6B6358] border-[#E5DEC9] hover:bg-[#F4EFE6]'
                        }`}
                      >
                        {spd}×
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Audio Controller Bar */}
      <div className="sticky top-20 z-40 bg-[#FAF7F0]/95 border border-[#D4AF37]/50 rounded-3xl p-3.5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrevAyah}
              disabled={currentAyahIndex === 0}
              className="p-2.5 rounded-xl bg-white hover:bg-[#F4EFE6] disabled:opacity-30 text-[#4A453E] border border-[#E5DEC9] transition-colors shadow-xs"
              title="الآية السابقة"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#2D5A27] to-[#1F431B] hover:from-[#376930] hover:to-[#275322] text-[#FAF7EE] font-bold flex items-center gap-2.5 shadow-lg shadow-[#2D5A27]/20 border border-[#D4AF37]/40 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>إيقاف مؤقت</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>استمع ورتّل</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextAyah}
              disabled={!surah.ayahs || currentAyahIndex >= surah.ayahs.length - 1}
              className="p-2.5 rounded-xl bg-white hover:bg-[#F4EFE6] disabled:opacity-30 text-[#4A453E] border border-[#E5DEC9] transition-colors shadow-xs"
              title="الآية التالية"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Current Ayah status indicator */}
          <div className="flex items-center gap-3">
            {repeatCount > 1 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF8E7] border border-[#E5C368] text-[#8A5800] text-xs font-bold shadow-xs">
                <Repeat className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  تكرار {toArabicNumerals(currentRepeatIteration)} من {toArabicNumerals(repeatCount)}
                </span>
              </div>
            )}

            <div className="text-xs text-[#6B6358] font-serif-art hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2D5A27] animate-pulse" />
              <span>
                {layoutMode === 'accumulative-page'
                  ? `عرض ${toArabicNumerals(accumulatedAyahCount)} من ${toArabicNumerals(totalAyahs)} آية على الصفحة`
                  : 'قراءة متصلة مع تمييز الكلمة المقروءة'}
              </span>
            </div>

            {/* Quick Tafseer toggle for current verse */}
            <button
              onClick={() => {
                soundManager.playTapSound();
                setSelectedAyahForTafseer(selectedAyahForTafseer ? null : currentAyah);
              }}
              className={`p-2 rounded-xl text-xs border transition-all ${
                selectedAyahForTafseer
                  ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                  : 'bg-white text-[#4A453E] border-[#E5DEC9] hover:bg-[#F2ECE0]'
              }`}
              title="عرض تفسير الآية الحالية"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tafseer Popover Box */}
      <AnimatePresence>
        {selectedAyahForTafseer && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 bg-[#FAF7F0] border border-[#D4AF37]/60 rounded-3xl space-y-2 shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-[#EADBCE] pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2D5A27]" />
                <span className="font-bold text-[#2D5A27] text-sm font-serif-art">
                  تفسير الآية رقم {toArabicNumerals(selectedAyahForTafseer.numberInSurah)}
                </span>
              </div>
              <button
                onClick={() => setSelectedAyahForTafseer(null)}
                className="text-xs text-[#8A5800] hover:underline"
              >
                إغلاق
              </button>
            </div>
            <p className="text-xs sm:text-sm text-[#4A453E] leading-relaxed">
              {selectedAyahForTafseer.tafseer || 'التفسير الميسر لهذه الآية الكريمة.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 1. CONTINUOUS MUSHAF & ACCUMULATIVE PAGE VIEW (المصحف المتصل على صفحة واحدة) */}
      {/* ========================================================================= */}
      {layoutMode !== 'cards' ? (
        <div className="relative bg-[#FFFDF9] border-8 border-double border-[#D4AF37]/50 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl space-y-6">
          {/* Ornate Mushaf Surah Header Frame */}
          <div className="relative text-center py-4 border-y-2 border-[#D4AF37]/40 bg-[#FAF7EE] rounded-2xl shadow-inner my-2">
            <div className="font-quran text-2xl sm:text-3xl text-[#2D5A27] font-bold tracking-wide">
              سُورَةُ {surah.name}
            </div>
            <div className="text-[11px] text-[#8A5800] font-serif-art mt-0.5">
              {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • آياتها {toArabicNumerals(surah.numberOfAyahs)} • {selectedRiwayah === 'warsh' ? 'برواية ورش عن نافع' : 'برواية حفص عن عاصم'}
            </div>
          </div>

          {/* Basmalah */}
          {surah.number !== 9 && surah.number !== 1 && (
            <div className="text-center py-3">
              <span className="font-quran text-2xl sm:text-3xl text-[#2D5A27] tracking-wider select-none">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
            </div>
          )}

          {/* Unified continuous text paragraph */}
          <div
            className={`font-quran text-justify text-right ${fontSizes[fontSize]} tracking-wide text-[#2C2A29] leading-loose select-none`}
            dir="rtl"
          >
            {displayedAyahs.map((ayah, ayahIdx) => {
              const isCurrentAyah = ayahIdx === currentAyahIndex;
              const isMemorized = isAyahMemorized(surah.number, ayah.numberInSurah);

              return (
                <span
                  key={ayah.numberInSurah}
                  className={`transition-all duration-300 rounded-2xl px-1.5 py-0.5 inline ${
                    isCurrentAyah
                      ? 'bg-[#FFF3D6]/70 ring-2 ring-[#D4AF37]/60 shadow-xs'
                      : ''
                  }`}
                >
                  {ayah.words.map((wordObj, wIdx) => {
                    const isWordActive = isCurrentAyah && activeWordIndex === wIdx;
                    const hasDifficultMeaning = ayah.difficultWords?.some(
                      (dw) =>
                        dw.word.includes(wordObj.textWithoutTashkeel) ||
                        wordObj.textWithoutTashkeel.includes(dw.word)
                    );

                    return (
                      <span
                        key={wordObj.id}
                        ref={isWordActive ? (el) => (activeWordElemRef.current = el) : null}
                        onClick={() => {
                          soundManager.playTapSound();
                          const def = ayah.difficultWords?.find(
                            (dw) =>
                              dw.word.includes(wordObj.textWithoutTashkeel) ||
                              wordObj.textWithoutTashkeel.includes(dw.word)
                          );
                          onWordClick(wordObj.text, ayah.text, def);
                        }}
                        className={`inline-block mx-1 px-1.5 py-0.5 rounded-xl cursor-pointer transition-all duration-200 relative group ${
                          isWordActive
                            ? 'bg-[#2D5A27] text-[#FAF7EE] font-extrabold scale-105 shadow-md ring-2 ring-[#D4AF37]'
                            : 'text-[#2C2A29] hover:bg-[#F4EFE6] hover:text-[#2D5A27]'
                        } ${
                          hasDifficultMeaning
                            ? 'border-b-2 border-dotted border-[#D4AF37]'
                            : ''
                        }`}
                      >
                        {wordObj.text}

                        {/* Hover hint */}
                        <span className="absolute -top-7 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-[#2C2A29] text-[#FAF7EE] text-[10px] px-2 py-0.5 rounded-md border border-[#D4AF37] shadow-md whitespace-nowrap font-cairo z-20">
                          {hasDifficultMeaning ? 'انقر للشرح والمفردة' : 'معنى الكلمة'}
                        </span>
                      </span>
                    );
                  })}

                  {/* Ayah End Marker */}
                  <span
                    onClick={() => selectAyah(ayahIdx)}
                    className={`inline-flex items-center justify-center mx-1.5 cursor-pointer font-quran text-2xl select-none align-middle transition-transform hover:scale-110 ${
                      isCurrentAyah
                        ? 'text-[#2D5A27] font-bold drop-shadow-sm'
                        : isMemorized
                        ? 'text-[#2D5A27]'
                        : 'text-[#D4AF37]'
                    }`}
                    title={`انقر للانتقال للآية ${ayah.numberInSurah}`}
                  >
                    ۝{toArabicNumerals(ayah.numberInSurah)}
                  </span>
                </span>
              );
            })}
          </div>

          {/* Progressive Mode Info Banner & Add Next Verse Button */}
          {layoutMode === 'accumulative-page' && (
            <div className="pt-6 border-t border-[#EADBCE] flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-[#6B6358] font-serif-art">
                تظهر الآيات تدريجياً واحدة تلو الأخرى مع الاستماع والقراءة.
              </div>

              {accumulatedAyahCount < totalAyahs && (
                <button
                  onClick={() => {
                    soundManager.playTapSound();
                    setAccumulatedAyahCount((prev) => Math.min(totalAyahs, prev + 1));
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#F2ECE0] text-[#2D5A27] border border-[#A3CF9E] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>إظهار الآية التالية ({toArabicNumerals(accumulatedAyahCount + 1)}) على الصفحة</span>
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. TRADITIONAL SEPARATED CARDS VIEW (نمط البطاقات المنفصلة) */
        /* ========================================================================= */
        <div className="space-y-4">
          {/* Surah & Basmalah Ornate Header in Cards View */}
          <div className="relative text-center py-4 px-6 border-2 border-[#D4AF37]/40 bg-[#FAF7EE] rounded-3xl shadow-inner mb-2 space-y-2">
            <div className="font-quran text-2xl sm:text-3xl text-[#2D5A27] font-bold tracking-wide">
              سُورَةُ {surah.name}
            </div>
            <div className="text-[11px] text-[#8A5800] font-serif-art">
              {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • آياتها {toArabicNumerals(surah.numberOfAyahs)} • {selectedRiwayah === 'warsh' ? 'برواية ورش عن نافع' : 'برواية حفص عن عاصم'}
            </div>
            {surah.number !== 9 && surah.number !== 1 && (
              <div className="pt-2 border-t border-[#D4AF37]/25">
                <span className="font-quran text-2xl sm:text-3xl text-[#2D5A27] tracking-wider select-none">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
              </div>
            )}
          </div>

          {surah.ayahs?.map((ayah, index) => {
            const isCurrent = index === currentAyahIndex;
            const isMemorized = isAyahMemorized(surah.number, ayah.numberInSurah);

            return (
              <motion.div
                key={ayah.numberInSurah}
                layout
                className={`relative rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#FFFDF9] border-[#2D5A27] shadow-xl ring-2 ring-[#2D5A27]/15'
                    : 'bg-white border-[#EADBCE] hover:border-[#D4AF37]/70 shadow-xs'
                }`}
              >
                {/* Ayah Header Strip */}
                <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#EADBCE]">
                  <div className="flex items-center gap-2.5">
                    <span
                      onClick={() => selectAyah(index)}
                      className={`cursor-pointer w-8 h-8 rounded-xl flex items-center justify-center font-quran text-sm font-bold transition-colors ${
                        isCurrent
                          ? 'bg-[#2D5A27] text-[#FAF7EE]'
                          : 'bg-[#F4EFE6] text-[#4A453E] hover:bg-[#EAE2D2]'
                      }`}
                    >
                      {toArabicNumerals(ayah.numberInSurah)}
                    </span>
                    <span className="text-xs text-[#7A7265] font-serif-art">
                      الآية {toArabicNumerals(ayah.numberInSurah)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleMemorized(surah.number, ayah.numberInSurah)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isMemorized
                          ? 'bg-[#F0F7EE] text-[#2D5A27] border border-[#A3CF9E]'
                          : 'bg-[#FAF7F0] text-[#7A7265] border border-[#E5DEC9] hover:text-[#2C2A29]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isMemorized ? 'تم الحفظ' : 'تحديد كمحفوظ'}</span>
                    </button>

                    <button
                      onClick={() => selectAyah(index)}
                      className={`p-2 rounded-xl text-xs transition-colors border ${
                        isCurrent && isPlaying
                          ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                          : 'bg-[#FAF7F0] text-[#4A453E] border-[#E5DEC9] hover:bg-[#F2ECE0]'
                      }`}
                      title="تلاوة هذه الآية"
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Ayah Words */}
                <div
                  className={`font-quran text-right ${fontSizes[fontSize]} tracking-wide select-none`}
                >
                  {ayah.words.map((wordObj, wIdx) => {
                    const isWordActive = isCurrent && activeWordIndex === wIdx;
                    const hasDifficultMeaning = ayah.difficultWords?.some(
                      (dw) =>
                        dw.word.includes(wordObj.textWithoutTashkeel) ||
                        wordObj.textWithoutTashkeel.includes(dw.word)
                    );

                    return (
                      <span
                        key={wordObj.id}
                        onClick={() => {
                          soundManager.playTapSound();
                          const def = ayah.difficultWords?.find(
                            (dw) =>
                              dw.word.includes(wordObj.textWithoutTashkeel) ||
                              wordObj.textWithoutTashkeel.includes(dw.word)
                          );
                          onWordClick(wordObj.text, ayah.text, def);
                        }}
                        className={`inline-block mx-1.5 px-2 py-0.5 rounded-xl cursor-pointer transition-all duration-200 relative group ${
                          isWordActive
                            ? 'bg-[#2D5A27] text-white font-extrabold scale-105 shadow-sm'
                            : 'text-[#2C2A29] hover:bg-[#F4EFE6] hover:text-[#2D5A27]'
                        } ${
                          hasDifficultMeaning
                            ? 'border-b-2 border-dotted border-[#D4AF37]'
                            : ''
                        }`}
                      >
                        {wordObj.text}
                      </span>
                    );
                  })}

                  <span className="inline-block mr-2 text-[#D4AF37] font-quran text-2xl align-middle">
                    ۝{toArabicNumerals(ayah.numberInSurah)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
