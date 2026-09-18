import React, { useState } from 'react';
import {
  BookOpen,
  Mic,
  Brain,
  BookMarked,
  TrendingUp,
  Search,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Surah, UserProgress, Riwayah, Reciter } from '../types';
import { SURAHS_LIST, getRecitersByRiwayah, RECITERS } from '../data/quranData';
import { soundManager } from '../utils/soundEffects';

interface HeaderProps {
  activeTab: 'reader' | 'live-recitation' | 'memorization-studio' | 'vocabulary' | 'progress';
  onSelectTab: (tab: 'reader' | 'live-recitation' | 'memorization-studio' | 'vocabulary' | 'progress') => void;
  currentSurah: Surah;
  onSelectSurah: (surahNumber: number) => void;
  progress: UserProgress;
  selectedRiwayah: Riwayah;
  onSelectRiwayah: (riwayah: Riwayah) => void;
  currentReciter?: Reciter;
  onSelectReciter?: (reciter: Reciter) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  currentSurah,
  onSelectSurah,
  progress,
  selectedRiwayah,
  onSelectRiwayah,
  currentReciter,
  onSelectReciter,
}) => {
  const [surahDropdownOpen, setSurahDropdownOpen] = useState(false);
  const [surahSearch, setSurahSearch] = useState('');

  const recitersForRiwayah = getRecitersByRiwayah(selectedRiwayah);

  const filteredSurahs = SURAHS_LIST.filter(
    (s) =>
      s.name.includes(surahSearch) ||
      s.englishName.toLowerCase().includes(surahSearch.toLowerCase()) ||
      s.number.toString().includes(surahSearch)
  );

  interface TabItem {
    id: 'reader' | 'live-recitation' | 'memorization-studio' | 'vocabulary' | 'progress';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }

  const navTabs: TabItem[] = [
    { id: 'reader', label: 'القراءة و الاستماع', icon: BookOpen },
    { id: 'live-recitation', label: 'تسجيل التلاوة و الاستماع', icon: Mic },
    { id: 'memorization-studio', label: 'التدرب على الحفظ', icon: Brain },
    { id: 'vocabulary', label: 'تفسير الكلمات الصعبة', icon: BookMarked },
    { id: 'progress', label: 'التقدم والتذكيرات', icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F0] border-b border-[#D4AF37]/40 shadow-sm backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2.5 space-y-2.5">
        
        {/* 1. Main Title Banner (منصة حليمة لتعلم و حفظ القرآن الكريم) */}
        <div className="w-full bg-[#FAF7F0] border-2 border-[#2D5A27]/80 rounded-2xl py-2 px-3 text-center shadow-xs">
          <h1 className="text-base sm:text-xl font-bold font-quran text-[#2D5A27] tracking-wide">
            منصة حليمة لتعلم و حفظ القرآن الكريم
          </h1>
        </div>

        {/* 2. Second Row: [المصحف] and [حفص / ورش] */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 items-center">
          
          {/* Riwayah Selector: [حفص] [ورش] */}
          <div className="flex items-center justify-center p-1 bg-[#EAE2CE]/70 rounded-xl border-2 border-[#2D5A27]/40">
            <button
              onClick={() => {
                soundManager.playTapSound();
                onSelectRiwayah('hafs');
              }}
              className={`flex-1 py-1.5 px-2 text-xs sm:text-sm font-bold rounded-lg transition-all text-center ${
                selectedRiwayah === 'hafs'
                  ? 'bg-[#C8E6C9] text-[#1B5E20] border border-[#81C784] shadow-xs'
                  : 'text-[#4E483E] hover:bg-white/40'
              }`}
            >
              حفص
            </button>
            <button
              onClick={() => {
                soundManager.playTapSound();
                onSelectRiwayah('warsh');
              }}
              className={`flex-1 py-1.5 px-2 text-xs sm:text-sm font-bold rounded-lg transition-all text-center ${
                selectedRiwayah === 'warsh'
                  ? 'bg-[#D6EAF8] text-[#1A5276] border border-[#85C1E9] shadow-xs'
                  : 'text-[#4E483E] hover:bg-white/40'
              }`}
            >
              ورش
            </button>
          </div>

          {/* Surah Picker: [المصحف] */}
          <div className="relative">
            <button
              onClick={() => setSurahDropdownOpen(!surahDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 sm:py-2 rounded-xl bg-white border-2 border-[#2D5A27]/40 hover:border-[#2D5A27] text-[#2C2A29] transition-all shadow-xs"
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs sm:text-sm font-bold text-[#2D5A27] font-quran">
                  المصحف : سورة {currentSurah.name}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#2D5A27] shrink-0" />
            </button>

            {/* Surah Dropdown Dialog */}
            {surahDropdownOpen && (
              <div className="absolute top-full left-0 right-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-80 max-h-96 bg-white border-2 border-[#2D5A27]/50 rounded-2xl shadow-2xl p-2.5 z-50 flex flex-col">
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={surahSearch}
                    onChange={(e) => setSurahSearch(e.target.value)}
                    placeholder="ابحث برقم أو اسم السورة..."
                    className="w-full bg-[#FAF7F0] border border-[#E5DEC9] rounded-xl py-2 pr-9 pl-3 text-xs text-[#2C2A29] placeholder:text-[#9E9589] outline-hidden focus:border-[#2D5A27]"
                    autoFocus
                  />
                  <Search className="w-4 h-4 text-[#8C8275] absolute right-3 top-1/2 -translate-y-1/2" />
                </div>

                <div className="overflow-y-auto space-y-1 pr-1 max-h-64">
                  {filteredSurahs.map((s) => (
                    <button
                      key={s.number}
                      onClick={() => {
                        soundManager.playTapSound();
                        onSelectSurah(s.number);
                        setSurahDropdownOpen(false);
                        setSurahSearch('');
                      }}
                      className={`w-full p-2 rounded-xl text-right text-xs flex items-center justify-between transition-all ${
                        currentSurah.number === s.number
                          ? 'bg-[#2D5A27] text-white font-bold shadow-xs'
                          : 'hover:bg-[#F4EFE6] text-[#423D33]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                          currentSurah.number === s.number
                            ? 'bg-[#1F431B] text-[#F3E5AB]'
                            : 'bg-[#EFE9DC] text-[#4A453E]'
                        }`}>
                          {s.number}
                        </span>
                        <span className="font-quran text-sm">سورة {s.name}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        currentSurah.number === s.number ? 'bg-white/20 text-white' : 'text-[#877E72]'
                      }`}>
                        {s.numberOfAyahs} آية
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Third Row: القراء : [الاسماء] */}
        {currentReciter && onSelectReciter && (
          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-bold text-[#2D5A27] shrink-0 font-serif-art">
              القراء :
            </span>
            <div className="flex-1 bg-white border-2 border-[#2D5A27]/40 rounded-xl px-2.5 py-1 shadow-xs">
              <select
                value={currentReciter.id}
                onChange={(e) => {
                  const found = RECITERS.find((r) => r.id === e.target.value);
                  if (found) {
                    soundManager.playTapSound();
                    onSelectReciter(found);
                  }
                }}
                className="w-full bg-transparent font-bold text-xs sm:text-sm text-[#2D5A27] outline-hidden cursor-pointer py-1 truncate"
                title="اختر القارئ"
              >
                {recitersForRiwayah.map((r) => (
                  <option key={r.id} value={r.id}>
                    🎙️ {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 4. Fourth Row: الفهرس : [Tabs] */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-[#2D5A27] shrink-0 font-serif-art">
              الفهرس :
            </span>
          </div>

          <div className="flex-1 grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundManager.playTapSound();
                    onSelectTab(tab.id);
                  }}
                  className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-center border ${
                    isActive
                      ? 'bg-[#2D5A27] text-white border-[#2D5A27] shadow-sm'
                      : 'bg-white text-[#4A453E] border-[#2D5A27]/30 hover:border-[#2D5A27] hover:bg-[#F2ECE0]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </header>
  );
};
