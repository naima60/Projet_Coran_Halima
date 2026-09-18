import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Sparkles, Loader2, Volume2, Bookmark, Check, RotateCcw, Search, Globe } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface WordMeaningModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: string;
  ayahContext: string;
  surahName: string;
  predefinedMeaning?: {
    meaning: string;
    root?: string;
    explanation?: string;
  };
  onSaveWord?: (word: string) => void;
  isSaved?: boolean;
}

export const WordMeaningModal: React.FC<WordMeaningModalProps> = ({
  isOpen,
  onClose,
  word: initialWord,
  ayahContext,
  surahName,
  predefinedMeaning,
  onSaveWord,
  isSaved,
}) => {
  const [currentWord, setCurrentWord] = useState<string>(initialWord);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'fr' | 'en'>('ar');

  // Fetch AI explanation & multilingual translation
  const fetchExplanationForWord = useCallback(
    async (targetWord: string) => {
      if (!targetWord) return;
      setLoadingAi(true);
      try {
        const res = await fetch('/api/gemini/word-explanation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
          body: JSON.stringify({
            word: targetWord,
            ayahContext,
            surahName,
            _t: Date.now(),
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setAiExplanation(data);
        }
      } catch (e) {
        console.error('Error fetching word explanation:', e);
      } finally {
        setLoadingAi(false);
      }
    },
    [ayahContext, surahName]
  );

  // Automatically reset cache and reload when modal is opened or target word changes
  useEffect(() => {
    if (isOpen && initialWord) {
      setCurrentWord(initialWord);
      setSearchInput('');
      setShowSearchBox(false);
      setAiExplanation(null);
      fetchExplanationForWord(initialWord);
    }
  }, [isOpen, initialWord, fetchExplanationForWord]);

  // Reset button action: Clears cached memory & resets lookup
  const handleResetModal = () => {
    soundManager.playTapSound();
    setAiExplanation(null);
    setShowSearchBox(true);
    setSearchInput('');
    setCurrentWord(initialWord || '');
  };

  // Custom manual word lookup
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    soundManager.playTapSound();
    setCurrentWord(searchInput.trim());
    setAiExplanation(null);
    fetchExplanationForWord(searchInput.trim());
    setShowSearchBox(false);
  };

  const speakWord = (textToSpeak: string) => {
    soundManager.playTapSound();
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(textToSpeak);
      utter.lang = 'ar-SA';
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    }
  };

  if (!isOpen) return null;

  const displayRoot = aiExplanation?.root || predefinedMeaning?.root;
  const displayArabicMeaning = predefinedMeaning?.meaning || aiExplanation?.meaning;
  const displayFrTranslation = aiExplanation?.translationFr;
  const displayEnTranslation = aiExplanation?.translationEn;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[#FAF7F0] border-2 border-[#D4AF37]/50 rounded-3xl shadow-2xl overflow-hidden text-[#2C2A29] flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="relative px-6 py-4 bg-white border-b border-[#EADBCE] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0F7EE] border border-[#A3CF9E] flex items-center justify-center text-[#2D5A27]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2D5A27] font-quran">معنى الكلمة وترجمتها</h3>
                <p className="text-xs text-[#6B6358] font-serif-art">سورة {surahName} • شرح وترجمة فورية</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Reset Button (Réinitialiser) */}
              <button
                onClick={handleResetModal}
                className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] hover:bg-[#F2ECE0] text-[#6B6358] hover:text-[#2D5A27] border border-[#E5DEC9] flex items-center gap-1 text-xs font-semibold transition-colors"
                title="إعادة ضبط ومسح الذاكرة / Réinitialiser"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">إعادة ضبط</span>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-[#FAF7F0] hover:bg-[#F2ECE0] text-[#6B6358] hover:text-[#2C2A29] border border-[#E5DEC9] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search / Lookup Bar (if toggled or on reset) */}
          {showSearchBox && (
            <form onSubmit={handleSearchSubmit} className="p-4 bg-[#F5EFE6] border-b border-[#EADBCE] flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="اكتب أي كلمة قرآنية للبحث عن معناها وترجمتها..."
                  className="w-full pl-3 pr-9 py-2 rounded-xl bg-white border border-[#D4AF37]/50 text-sm font-quran text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                  autoFocus
                />
                <Search className="w-4 h-4 text-[#8C8477] absolute right-3 top-2.5" />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#2D5A27] text-white rounded-xl text-xs font-bold hover:bg-[#23471e] transition-colors cursor-pointer"
              >
                ترجمة وشرح
              </button>
            </form>
          )}

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-4">
            {/* Word Display Box */}
            <div className="bg-white border-2 border-[#D4AF37]/40 rounded-2xl p-5 text-center relative overflow-hidden shadow-xs">
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <button
                  onClick={() => speakWord(currentWord)}
                  title="استمع لنطق الكلمة"
                  className="p-2 rounded-lg bg-[#FAF7F0] hover:bg-[#F2ECE0] text-[#2D5A27] border border-[#E5DEC9] transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                {onSaveWord && (
                  <button
                    onClick={() => {
                      soundManager.playTapSound();
                      onSaveWord(currentWord);
                    }}
                    title={isSaved ? 'محفوظة في المفردات' : 'حفظ الكلمة في المعجم الشخصي'}
                    className={`p-2 rounded-lg transition-colors ${
                      isSaved
                        ? 'bg-[#FFF2D6] text-[#8A5800] border border-[#D4AF37]'
                        : 'bg-[#FAF7F0] hover:bg-[#F2ECE0] text-[#8C8477] border border-[#E5DEC9]'
                    }`}
                  >
                    {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                )}
              </div>

              <span className="text-xs px-2.5 py-1 rounded-full bg-[#F0F7EE] text-[#2D5A27] border border-[#A3CF9E] font-medium font-serif-art">
                مفردة قرآنية
              </span>

              <div className="my-3">
                <h2 className="text-3xl sm:text-4xl font-bold font-quran text-[#2D5A27] tracking-wide">
                  {currentWord}
                </h2>
              </div>

              {/* Root if available */}
              {displayRoot && (
                <p className="text-xs text-[#6B6358] font-medium font-serif-art">
                  الجذر اللغوي: <span className="font-bold text-[#8A5800] font-quran text-sm">[{displayRoot}]</span>
                </p>
              )}
            </div>

            {/* Language Selector Tabs for Translations */}
            <div className="flex items-center justify-center gap-1.5 p-1 bg-[#EFE9DF] rounded-xl border border-[#E5DEC9]">
              <button
                onClick={() => {
                  soundManager.playTapSound();
                  setActiveLangTab('ar');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLangTab === 'ar' ? 'bg-white text-[#2D5A27] shadow-xs' : 'text-[#6B6358] hover:text-[#2C2A29]'
                }`}
              >
                العربية (التفسير)
              </button>
              <button
                onClick={() => {
                  soundManager.playTapSound();
                  setActiveLangTab('fr');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  activeLangTab === 'fr' ? 'bg-white text-[#2D5A27] shadow-xs' : 'text-[#6B6358] hover:text-[#2C2A29]'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Français (Traduction)</span>
              </button>
              <button
                onClick={() => {
                  soundManager.playTapSound();
                  setActiveLangTab('en');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  activeLangTab === 'en' ? 'bg-white text-[#2D5A27] shadow-xs' : 'text-[#6B6358] hover:text-[#2C2A29]'
                }`}
              >
                <span>English</span>
              </button>
            </div>

            {/* Tab 1: Arabic Meaning & Tafseer */}
            {activeLangTab === 'ar' && (
              <div className="space-y-3">
                <div className="bg-white border border-[#EADBCE] rounded-xl p-4 space-y-2 shadow-xs">
                  <h4 className="text-xs font-bold text-[#2D5A27] flex items-center gap-1.5 font-serif-art">
                    <span>المعنى في سياق الآية الكريمة:</span>
                  </h4>
                  {loadingAi && !displayArabicMeaning ? (
                    <div className="flex items-center gap-2 text-sm text-[#8A5800] py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري استخراج المعنى بالذكاء الاصطناعي...</span>
                    </div>
                  ) : (
                    <p className="text-[#2C2A29] text-base leading-relaxed font-medium font-serif-art">
                      {displayArabicMeaning || 'المعنى متاح في التفسير التفصيلي.'}
                    </p>
                  )}
                  {predefinedMeaning?.explanation && (
                    <p className="text-xs text-[#6B6358] pt-2 border-t border-[#EADBCE] leading-normal font-serif-art">
                      {predefinedMeaning.explanation}
                    </p>
                  )}
                </div>

                {/* Deep Tafseer */}
                {aiExplanation?.detailedExplanation && (
                  <div className="bg-white border border-[#D4AF37]/50 rounded-xl p-4 space-y-2 shadow-xs">
                    <div className="flex items-center gap-1.5 text-[#2D5A27] font-bold text-xs font-serif-art">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>الشرح اللغوي والبيان:</span>
                    </div>
                    <p className="text-sm text-[#2C2A29] leading-relaxed font-serif-art">
                      {aiExplanation.detailedExplanation}
                    </p>
                    {aiExplanation.reflection && (
                      <div className="p-3 bg-[#FFFDF9] border-r-3 border-[#D4AF37] rounded-lg text-xs text-[#8A5800] leading-relaxed font-serif-art mt-2">
                        <span className="font-bold text-[#2D5A27] ml-1">وقفة تدبر:</span>
                        {aiExplanation.reflection}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: French Translation */}
            {activeLangTab === 'fr' && (
              <div className="bg-white border border-[#EADBCE] rounded-xl p-4 space-y-3 shadow-xs text-left" dir="ltr">
                <div className="flex items-center justify-between pb-2 border-b border-[#EADBCE]">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Traduction & Signification</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">Français</span>
                </div>

                {loadingAi && !displayFrTranslation ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Chargement de la traduction française...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-[#F0F7FF] rounded-xl border border-blue-100">
                      <span className="text-xs text-blue-900 font-semibold block mb-1">Traduction du mot:</span>
                      <p className="text-base font-bold text-blue-950">
                        {displayFrTranslation || `Sens du terme coranique: ${currentWord}`}
                      </p>
                    </div>

                    <div className="text-xs text-gray-600 leading-relaxed pt-1">
                      <span className="font-semibold text-gray-800">Contexte: </span>
                      {ayahContext ? `« ${ayahContext} »` : `Sourate ${surahName}`}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: English Translation */}
            {activeLangTab === 'en' && (
              <div className="bg-white border border-[#EADBCE] rounded-xl p-4 space-y-3 shadow-xs text-left" dir="ltr">
                <div className="flex items-center justify-between pb-2 border-b border-[#EADBCE]">
                  <span className="text-xs font-bold text-[#2D5A27] uppercase tracking-wider">English Translation</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold">English</span>
                </div>

                {loadingAi && !displayEnTranslation ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-[#2D5A27]" />
                    <span>Loading English translation...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-[#F0F7EE] rounded-xl border border-emerald-100">
                      <span className="text-xs text-emerald-900 font-semibold block mb-1">Contextual Meaning:</span>
                      <p className="text-base font-bold text-emerald-950">
                        {displayEnTranslation || `Quranic meaning for: ${currentWord}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Ayah Context */}
            {ayahContext && (
              <div className="bg-[#FFFDF9] border border-[#EADBCE] rounded-xl p-3.5 space-y-1.5">
                <h5 className="text-xs text-[#6B6358] font-medium font-serif-art">سياق الآية الكريمة:</h5>
                <p className="font-quran text-[#2C2A29] text-base leading-loose">
                  « {ayahContext} »
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 bg-white border-t border-[#EADBCE] flex items-center justify-between">
            <button
              onClick={() => setShowSearchBox(!showSearchBox)}
              className="text-xs text-[#2D5A27] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{showSearchBox ? 'إخفاء البحث' : 'بحث عن كلمة أخرى'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#F2ECE0] text-[#4A453E] border border-[#E5DEC9] text-sm font-semibold transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
