import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Heart, 
  Check, 
  RotateCcw, 
  Search, 
  Copy, 
  BookOpen,
  Clock
} from 'lucide-react';
import { 
  MORNING_ADHKAR, 
  EVENING_ADHKAR, 
  POST_PRAYER_ADHKAR, 
  ANSWERED_DUAS, 
  TASBIH_PRESETS,
  DhikrItem 
} from '../data/adhkarData';
import { soundManager } from '../utils/soundEffects';

type AdhkarTab = 'morning' | 'evening' | 'after-prayer' | 'duas' | 'tasbih';
type DuaSubCategory = 'all' | 'parents' | 'relief' | 'health' | 'guidance';

export const AdhkarAndDuas: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdhkarTab>('morning');
  const [searchQuery, setSearchQuery] = useState('');
  const [duaFilter, setDuaFilter] = useState<DuaSubCategory>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Repetition counters state stored locally: key is dhikr id, value is completed counts
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('adhkar_counts_today');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Digital Tasbih State
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [tasbihCount, setTasbihCount] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('tasbih_current_count')) || 0;
    } catch {
      return 0;
    }
  });
  const [tasbihTarget, setTasbihTarget] = useState(33);

  const handleDhikrClick = (item: DhikrItem) => {
    const current = counts[item.id] || 0;
    if (current < item.count) {
      soundManager.playTapSound();
      const newCount = current + 1;
      const updated = { ...counts, [item.id]: newCount };
      setCounts(updated);
      try {
        localStorage.setItem('adhkar_counts_today', JSON.stringify(updated));
      } catch {}
      if (newCount === item.count) {
        soundManager.playSuccessChime();
      }
    }
  };

  const resetSectionCounts = (items: DhikrItem[]) => {
    soundManager.playTapSound();
    const updated = { ...counts };
    items.forEach((item) => {
      delete updated[item.id];
    });
    setCounts(updated);
    try {
      localStorage.setItem('adhkar_counts_today', JSON.stringify(updated));
    } catch {}
  };

  const copyToClipboard = (id: string, text: string) => {
    soundManager.playTapSound();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Tasbih handlers
  const handleTasbihTap = () => {
    soundManager.playTapSound();
    const next = tasbihCount + 1;
    setTasbihCount(next);
    try {
      localStorage.setItem('tasbih_current_count', next.toString());
    } catch {}

    if (tasbihTarget > 0 && next % tasbihTarget === 0) {
      soundManager.playSuccessChime();
      if (navigator.vibrate) {
        navigator.vibrate([80, 50, 80]);
      }
    }
  };

  const resetTasbih = () => {
    soundManager.playTapSound();
    setTasbihCount(0);
    try {
      localStorage.setItem('tasbih_current_count', '0');
    } catch {}
  };

  // Filter items based on active tab & search
  const getCurrentItems = (): DhikrItem[] => {
    let list: DhikrItem[] = [];
    if (activeTab === 'morning') list = MORNING_ADHKAR;
    else if (activeTab === 'evening') list = EVENING_ADHKAR;
    else if (activeTab === 'after-prayer') list = POST_PRAYER_ADHKAR;
    else if (activeTab === 'duas') {
      list = ANSWERED_DUAS.filter(
        (d) => duaFilter === 'all' || d.duaCategory === duaFilter
      );
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (item) =>
        item.text.toLowerCase().includes(q) ||
        (item.virtue && item.virtue.toLowerCase().includes(q)) ||
        (item.source && item.source.toLowerCase().includes(q))
    );
  };

  const currentItems = getCurrentItems();

  // Calculate completion progress for the current category
  const getProgress = (items: DhikrItem[]) => {
    if (items.length === 0) return { completed: 0, total: 0, percentage: 0 };
    let completed = 0;
    items.forEach((item) => {
      const c = counts[item.id] || 0;
      if (c >= item.count) completed++;
    });
    return {
      completed,
      total: items.length,
      percentage: Math.round((completed / items.length) * 100),
    };
  };

  const currentProgress = getProgress(
    activeTab === 'morning'
      ? MORNING_ADHKAR
      : activeTab === 'evening'
      ? EVENING_ADHKAR
      : activeTab === 'after-prayer'
      ? POST_PRAYER_ADHKAR
      : ANSWERED_DUAS
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[#2D5A27] via-[#23471f] to-[#1a3817] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#D4AF37]/30 relative overflow-hidden">
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-white/5 blur-xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-right space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              حصن المسلم والأدعية المباركة
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-quran tracking-wide text-white">
              أذكار الصباح والمساء والأدعية المستجابة
            </h2>
            <p className="text-sm text-[#E2E8F0]/90 max-w-xl font-serif-art">
              «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ» • أذكار مؤكدة ومأثورة من القرآن الكريم وصحيح السنة النبوية مع عداد التكرار والسبحة الإلكترونية.
            </p>
          </div>

          {/* Quick Counter / Progress pill for active set */}
          {activeTab !== 'tasbih' && (
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 min-w-[140px] text-center">
              <span className="text-xs text-white/80 font-medium">نسبة الإنجاز</span>
              <span className="text-2xl font-extrabold font-sans text-[#D4AF37]">
                {currentProgress.completed} / {currentProgress.total}
              </span>
              <div className="w-24 bg-white/20 rounded-full h-2 mt-1.5 overflow-hidden">
                <div 
                  className="bg-[#D4AF37] h-full rounded-full transition-all duration-300"
                  style={{ width: `${currentProgress.percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-[#FAF7F0] border-2 border-[#D4AF37]/30 rounded-2xl p-1.5 shadow-xs flex flex-wrap gap-1.5">
        <button
          onClick={() => {
            soundManager.playTapSound();
            setActiveTab('morning');
          }}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'morning'
              ? 'bg-[#2D5A27] text-white shadow-sm border border-[#D4AF37]'
              : 'text-[#4A453E] hover:bg-white/60'
          }`}
        >
          <Sun className={`w-4 h-4 ${activeTab === 'morning' ? 'text-[#FFD700]' : 'text-[#D97706]'}`} />
          أذكار الصباح
        </button>

        <button
          onClick={() => {
            soundManager.playTapSound();
            setActiveTab('evening');
          }}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'evening'
              ? 'bg-[#2D5A27] text-white shadow-sm border border-[#D4AF37]'
              : 'text-[#4A453E] hover:bg-white/60'
          }`}
        >
          <Moon className={`w-4 h-4 ${activeTab === 'evening' ? 'text-[#93C5FD]' : 'text-[#2563EB]'}`} />
          أذكار المساء
        </button>

        <button
          onClick={() => {
            soundManager.playTapSound();
            setActiveTab('after-prayer');
          }}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'after-prayer'
              ? 'bg-[#2D5A27] text-white shadow-sm border border-[#D4AF37]'
              : 'text-[#4A453E] hover:bg-white/60'
          }`}
        >
          <Clock className="w-4 h-4 text-[#059669]" />
          أذكار بعد الصلاة
        </button>

        <button
          onClick={() => {
            soundManager.playTapSound();
            setActiveTab('duas');
          }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'duas'
              ? 'bg-[#2D5A27] text-white shadow-sm border border-[#D4AF37]'
              : 'text-[#4A453E] hover:bg-white/60'
          }`}
        >
          <Heart className="w-4 h-4 text-[#DC2626]" />
          أدعية مستجابة
        </button>

        <button
          onClick={() => {
            soundManager.playTapSound();
            setActiveTab('tasbih');
          }}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'tasbih'
              ? 'bg-[#2D5A27] text-white shadow-sm border border-[#D4AF37]'
              : 'text-[#4A453E] hover:bg-white/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          السبحة الذكية
        </button>
      </div>

      {/* Sub-bar: Search & Actions */}
      {activeTab !== 'tasbih' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/70 p-3 rounded-2xl border border-[#EADBCE]">
          
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8C8275] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الذكر، الفضل، أو المصدر..."
              className="w-full pl-3 pr-9 py-2 text-xs sm:text-sm bg-white border border-[#EADBCE] rounded-xl focus:outline-hidden focus:border-[#2D5A27] transition-all text-[#2D2A26]"
            />
          </div>

          {/* Duas specific subcategories filter */}
          {activeTab === 'duas' && (
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'parents', label: 'للأمهات والوالدين' },
                { id: 'relief', label: 'الفرج والرزق' },
                { id: 'health', label: 'الشفاء والعافية' },
                { id: 'guidance', label: 'العلم والهداية' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundManager.playTapSound();
                    setDuaFilter(cat.id as DuaSubCategory);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    duaFilter === cat.id
                      ? 'bg-[#2D5A27] text-white shadow-xs'
                      : 'bg-[#FAF7F0] text-[#6B6358] border border-[#EADBCE] hover:bg-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Reset progress button */}
          <button
            onClick={() => resetSectionCounts(currentItems)}
            className="flex items-center gap-1.5 text-xs text-[#8C8275] hover:text-[#DC2626] font-medium py-1.5 px-3 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap self-end sm:self-auto"
            title="إعادة ضبط العدادات لهذا القسم"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            إعادة تعيين العدادات
          </button>
        </div>
      )}

      {/* VIEW 1: Adhkar / Duas Cards List */}
      {activeTab !== 'tasbih' && (
        <div className="grid grid-cols-1 gap-4">
          {currentItems.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-[#EADBCE] p-6 space-y-3">
              <BookOpen className="w-10 h-10 text-[#C4B5A5] mx-auto" />
              <h4 className="font-bold text-[#4A453E]">لا توجد نتائج مطابقة لبحثك</h4>
              <p className="text-xs text-[#8C8275]">يرجى تجربة كلمة بحث أخرى أو مسح حقل البحث.</p>
            </div>
          ) : (
            currentItems.map((item, index) => {
              const currentCount = counts[item.id] || 0;
              const isCompleted = currentCount >= item.count;
              const remaining = Math.max(0, item.count - currentCount);

              return (
                <div
                  key={item.id}
                  className={`bg-[#FFFDF9] rounded-2xl p-5 sm:p-6 border-2 transition-all relative overflow-hidden ${
                    isCompleted
                      ? 'border-[#2D5A27]/60 bg-[#F4F9F2] shadow-xs'
                      : 'border-[#EADBCE] hover:border-[#D4AF37] shadow-sm'
                  }`}
                >
                  {/* Card Header: Number & Tag */}
                  <div className="flex items-center justify-between mb-3 text-xs text-[#8C8275]">
                    <span className="font-bold text-[#2D5A27] bg-[#E8F0E6] px-2.5 py-1 rounded-lg">
                      #{index + 1}
                    </span>
                    {item.source && (
                      <span className="font-serif-art text-[11px] text-[#8A5800] bg-[#FFF8E7] border border-[#F0D59E] px-2 py-0.5 rounded-full">
                        {item.source}
                      </span>
                    )}
                  </div>

                  {/* Dhikr Arabic Text */}
                  <div className="my-3">
                    <p className="font-quran text-lg sm:text-xl md:text-2xl text-[#1E3B1A] leading-loose select-text">
                      {item.text}
                    </p>
                  </div>

                  {/* Virtue (فضل الذكر) */}
                  {item.virtue && (
                    <div className="bg-[#FAF7F0] border-r-4 border-[#D4AF37] p-3 rounded-lg text-xs sm:text-sm text-[#5C5449] mb-4">
                      <span className="font-bold text-[#8A5800] ml-1">فضل الذكر:</span>
                      {item.virtue}
                    </div>
                  )}

                  {/* Card Bottom: Actions and Counter */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EADBCE]/70">
                    
                    {/* Copy button */}
                    <button
                      onClick={() => copyToClipboard(item.id, item.text)}
                      className="flex items-center gap-1 text-xs text-[#6B6358] hover:text-[#2D5A27] py-1 px-2.5 rounded-lg hover:bg-[#F2ECE0] transition-colors"
                      title="نسخ الذكر"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#2D5A27]" />
                          <span className="text-[#2D5A27] font-bold">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ الذكر</span>
                        </>
                      )}
                    </button>

                    {/* Interactive Count Button */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#7A7062]">
                        التكرار المطلوب: <strong className="text-[#2D5A27] font-sans">{item.count}</strong>
                      </span>

                      <button
                        onClick={() => handleDhikrClick(item)}
                        disabled={isCompleted}
                        className={`py-2 px-5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all transform active:scale-95 shadow-xs ${
                          isCompleted
                            ? 'bg-[#2D5A27] text-white cursor-default'
                            : 'bg-gradient-to-r from-[#D4AF37] to-[#B89028] text-white hover:brightness-105'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <Check className="w-4 h-4" />
                            تم بنجاح ({item.count})
                          </>
                        ) : (
                          <>
                            <span>اضغط للذكر</span>
                            <span className="bg-white/30 text-white px-2 py-0.5 rounded-full text-xs font-sans">
                              متبقي {remaining}
                            </span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 2: Interactive Smart Digital Tasbih (السبحة الذكية) */}
      {activeTab === 'tasbih' && (
        <div className="bg-[#FFFDF9] border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-10 shadow-lg text-center space-y-6 max-w-2xl mx-auto relative overflow-hidden">
          
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#8A5800] bg-[#FFF8E7] border border-[#F0D59E] px-3 py-1 rounded-full">
              السبحة الإلكترونية المباركة
            </span>
            <h3 className="text-2xl font-bold font-quran text-[#2D5A27] pt-2">
              {TASBIH_PRESETS[selectedPresetIndex].title}
            </h3>
            <p className="text-xs text-[#6B6358]">
              اضغط على الدائرة المركزية للتسبيح مع ارتداد صوتي وعداد دقيق
            </p>
          </div>

          {/* Preset Selector Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {TASBIH_PRESETS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  soundManager.playTapSound();
                  setSelectedPresetIndex(idx);
                  setTasbihTarget(p.target);
                }}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  selectedPresetIndex === idx
                    ? 'bg-[#2D5A27] text-white shadow-xs border border-[#D4AF37]'
                    : 'bg-[#F5EFE6] text-[#5A5245] hover:bg-[#EAE2CE]'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>

          {/* Center Circular Clicker Button */}
          <div className="py-4">
            <button
              onClick={handleTasbihTap}
              className="group relative mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-[#2D5A27] via-[#23471f] to-[#173215] text-white shadow-2xl flex flex-col items-center justify-center border-4 border-[#D4AF37] hover:scale-105 active:scale-95 transition-all duration-150 ring-8 ring-[#2D5A27]/20 focus:outline-hidden"
            >
              <span className="text-xs sm:text-sm font-medium text-[#D4AF37] mb-1">
                العدد الحالي
              </span>
              <span className="text-5xl sm:text-6xl font-extrabold font-sans tracking-tight text-white group-hover:scale-110 transition-transform">
                {tasbihCount}
              </span>
              <span className="text-[11px] text-white/70 mt-2 bg-white/10 px-3 py-0.5 rounded-full">
                الهدف: {tasbihTarget > 0 ? tasbihTarget : 'حر'}
              </span>
            </button>
          </div>

          {/* Target controls & reset */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 bg-[#F5EFE6] px-3 py-1.5 rounded-xl text-xs text-[#5A5245]">
              <span className="font-bold">تحديد الهدف:</span>
              {[33, 100, 500, 1000].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    soundManager.playTapSound();
                    setTasbihTarget(t);
                  }}
                  className={`px-2 py-0.5 rounded-md font-bold font-sans transition-all ${
                    tasbihTarget === t
                      ? 'bg-[#2D5A27] text-white'
                      : 'hover:bg-white text-[#4A453E]'
                  }`}
                >
                  {t}
                </button>
              ))}
              <button
                onClick={() => {
                  soundManager.playTapSound();
                  setTasbihTarget(0);
                }}
                className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                  tasbihTarget === 0
                    ? 'bg-[#2D5A27] text-white'
                    : 'hover:bg-white text-[#4A453E]'
                }`}
              >
                مفتوح
              </button>
            </div>

            <button
              onClick={resetTasbih}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors border border-red-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              تصفير العداد
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
