import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  BookMarked,
  Search,
  Volume2,
  Sparkles,
  Bookmark,
  BookOpen,
  Filter,
  Check,
} from 'lucide-react';
import { Surah } from '../types';
import { CURATED_SURAHS, SURAHS_LIST, toArabicNumerals } from '../data/quranData';
import { soundManager } from '../utils/soundEffects';

interface VocabularyPanelProps {
  currentSurah: Surah;
  onSelectWord: (word: string, ayahContext: string, predefinedMeaning?: any) => void;
  savedWords: string[];
  onToggleSaveWord: (word: string) => void;
}

export const VocabularyPanel: React.FC<VocabularyPanelProps> = ({
  currentSurah,
  onSelectWord,
  savedWords,
  onToggleSaveWord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'current_surah' | 'all' | 'saved'>('current_surah');

  // Aggregate all difficult words across available surahs
  const allDifficultWords = useMemo(() => {
    const list: {
      surahNumber: number;
      surahName: string;
      ayahNumber: number;
      ayahText: string;
      word: string;
      meaning: string;
      root?: string;
      explanation?: string;
    }[] = [];

    Object.entries(CURATED_SURAHS).forEach(([sNumStr, ayahs]) => {
      const sNum = parseInt(sNumStr, 10);
      const sMeta = SURAHS_LIST.find((s) => s.number === sNum);
      const sName = sMeta?.name || `سورة ${sNum}`;

      ayahs.forEach((ayahItem, aIdx) => {
        const ayahNumber = aIdx + 1;
        if (ayahItem.difficultWords) {
          ayahItem.difficultWords.forEach((dw) => {
            list.push({
              surahNumber: sNum,
              surahName: sName,
              ayahNumber,
              ayahText: ayahItem.text,
              word: dw.word,
              meaning: dw.meaning,
              root: dw.root,
              explanation: dw.explanation,
            });
          });
        }
      });
    });

    return list;
  }, []);

  // Filter words
  const filteredWords = useMemo(() => {
    return allDifficultWords.filter((item) => {
      // Filter by category
      if (filterMode === 'current_surah' && item.surahNumber !== currentSurah.number) {
        return false;
      }
      if (filterMode === 'saved' && !savedWords.includes(item.word)) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim();
        const matchWord = item.word.includes(q);
        const matchMeaning = item.meaning.includes(q);
        const matchRoot = item.root?.includes(q);
        const matchSurah = item.surahName.includes(q);
        return matchWord || matchMeaning || matchRoot || matchSurah;
      }

      return true;
    });
  }, [allDifficultWords, currentSurah.number, filterMode, savedWords, searchQuery]);

  const speak = (text: string) => {
    soundManager.playTapSound();
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ar-SA';
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Box */}
      <div className="bg-white border border-[#EADBCE] rounded-3xl p-5 sm:p-6 shadow-xl shadow-[#2D5A27]/5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EADBCE]">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#2D5A27] via-[#244b1f] to-[#173313] flex items-center justify-center text-[#F3E5AB] shadow-lg shadow-[#2D5A27]/20 border border-[#D4AF37]/40">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#2D5A27] font-quran">
                تفسير الكلمات الصعبة
              </h2>
              <p className="text-xs text-[#6B6358] font-serif-art">
                فهم معاني المفردات القرآنية وأصولها اللغوية لتسهيل الحفظ والتدبر
              </p>
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5 bg-[#FAF7F0] p-1.5 rounded-2xl border border-[#E5DEC9] text-xs">
            <button
              onClick={() => {
                soundManager.playTapSound();
                setFilterMode('current_surah');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterMode === 'current_surah'
                  ? 'bg-[#2D5A27] text-[#FAF7EE] shadow-md border border-[#D4AF37]/40'
                  : 'text-[#61594F] hover:text-[#2D5A27]'
              }`}
            >
              سورة {currentSurah.name}
            </button>
            <button
              onClick={() => {
                soundManager.playTapSound();
                setFilterMode('all');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-[#2D5A27] text-[#FAF7EE] shadow-md border border-[#D4AF37]/40'
                  : 'text-[#61594F] hover:text-[#2D5A27]'
              }`}
            >
              جميع السور
            </button>
            <button
              onClick={() => {
                soundManager.playTapSound();
                setFilterMode('saved');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                filterMode === 'saved'
                  ? 'bg-[#9A6200] text-[#FAF7EE] shadow-md border border-[#D4AF37]/40'
                  : 'text-[#8A5800] hover:text-[#9A6200]'
              }`}
            >
              <span>المحفوظات</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white text-[10px] text-[#8A5800] font-bold border border-[#E5DEC9]">
                {toArabicNumerals(savedWords.length)}
              </span>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن كلمة، جذر لغوي (مثل: رحم)، أو معنى..."
            className="w-full bg-[#FAF7F0] border border-[#E5DEC9] rounded-2xl py-3.5 pr-11 pl-4 text-[#2C2A29] text-sm placeholder:text-[#9E9589] outline-hidden focus:border-[#2D5A27] focus:bg-white transition-colors"
          />
          <Search className="w-5 h-5 text-[#8C8477] absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Words Grid */}
      {filteredWords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWords.map((item, idx) => {
            const isSaved = savedWords.includes(item.word);

            return (
              <motion.div
                key={`${item.surahNumber}-${item.ayahNumber}-${idx}`}
                layout
                className="bg-white border border-[#EADBCE] hover:border-[#D4AF37] rounded-3xl p-5 sm:p-6 transition-all duration-300 shadow-md shadow-[#2D5A27]/5 flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top metadata */}
                  <div className="flex items-center justify-between text-xs text-[#6B6358] mb-3 pb-2 border-b border-[#EADBCE]">
                    <span className="font-bold text-[#2D5A27] font-quran text-sm">
                      سورة {item.surahName} • آية {toArabicNumerals(item.ayahNumber)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => speak(item.word)}
                        className="p-1.5 rounded-lg bg-[#FAF7F0] hover:bg-[#F2ECE0] text-[#4A453E] hover:text-[#2D5A27] border border-[#E5DEC9] transition-colors"
                        title="استمع لنطق الكلمة"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onToggleSaveWord(item.word)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSaved
                            ? 'bg-[#FFF2D6] text-[#9A6200] border border-[#D4AF37]'
                            : 'bg-[#FAF7F0] text-[#8C8477] hover:text-[#2C2A29] border border-[#E5DEC9]'
                        }`}
                        title={isSaved ? 'محفوظة' : 'حفظ الكلمة'}
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Word and Root */}
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <h3 className="font-quran text-3xl font-bold text-[#2D5A27] group-hover:text-[#1F431B] transition-colors">
                      {item.word}
                    </h3>
                    {item.root && (
                      <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#FAF7F0] text-[#8A5800] border border-[#E5DEC9] font-medium">
                        الجذر: [{item.root}]
                      </span>
                    )}
                  </div>

                  {/* Meaning */}
                  <p className="text-[#2C2A29] text-sm font-medium leading-relaxed mb-2 font-serif-art">
                    {item.meaning}
                  </p>

                  {/* Explanation if present */}
                  {item.explanation && (
                    <p className="text-xs text-[#6B6358] leading-normal bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E5DEC9] font-serif-art">
                      {item.explanation}
                    </p>
                  )}
                </div>

                {/* Bottom CTA to open full AI modal */}
                <button
                  onClick={() => {
                    soundManager.playTapSound();
                    onSelectWord(item.word, item.ayahText, {
                      meaning: item.meaning,
                      root: item.root,
                      explanation: item.explanation,
                    });
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#FAF7F0] hover:bg-[#2D5A27] text-[#2D5A27] hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#E5DEC9] hover:border-[#2D5A27] shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>الشرح اللغوي والتفسير الشامل</span>
                </button>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-[#EADBCE] rounded-3xl p-12 text-center space-y-3 shadow-md">
          <BookOpen className="w-10 h-10 text-[#8C8477] mx-auto" />
          <p className="text-[#2C2A29] font-bold text-base font-quran">لا توجد كلمات مطابقة للبحث</p>
          <p className="text-xs text-[#6B6358] font-serif-art">
            يمكنك النقر مباشرة على أي كلمة في المصحف لاستخراج معناها فوراً بالذكاء الاصطناعي
          </p>
        </div>
      )}
    </div>
  );
};
