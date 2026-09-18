import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  Target,
  Bell,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import { UserProgress } from '../types';
import { SURAHS_LIST, toArabicNumerals } from '../data/quranData';
import { soundManager } from '../utils/soundEffects';

interface ProgressAndRemindersProps {
  progress: UserProgress;
  onUpdateGoal: (newGoal: number) => void;
  onUpdateLevel: (newLevel: UserProgress['level']) => void;
  onUpdateReminders: (newSettings: UserProgress['reminderSettings']) => void;
}

export const ProgressAndReminders: React.FC<ProgressAndRemindersProps> = ({
  progress,
  onUpdateGoal,
  onUpdateLevel,
  onUpdateReminders,
}) => {
  const [notificationStatus, setNotificationStatus] = useState<string>('');

  const memorizedCount = Object.keys(progress.memorizedAyahs).filter(
    (k) => progress.memorizedAyahs[k]
  ).length;

  const totalQuranVerses = 6236;
  const memorizationPercentage = ((memorizedCount / totalQuranVerses) * 100).toFixed(2);
  const dailyProgressPercentage = Math.min(
    100,
    Math.round((progress.totalVersesReadToday / progress.dailyGoalVerses) * 100)
  );

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    soundManager.playTapSound();
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setNotificationStatus('تم تفعيل إشعارات التذكير اليومي بنجاح! 🔔');
        soundManager.playSuccessChime();
        new Notification('رتّل | تذكير الورد القرآني', {
          body: 'مرحباً بك! سيتولى النظام تذكيرك يومياً بورد الحفظ والتلاوة.',
          icon: '/favicon.ico',
        });
      } else {
        setNotificationStatus('لم يتم منح إذن الإشعارات من المتصفح.');
      }
    } else {
      setNotificationStatus('المتصفح لا يدعم الإشعارات المباشرة.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-white border border-[#EADBCE] rounded-3xl p-5 shadow-lg shadow-[#2D5A27]/5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A5800] font-serif-art">أيام الالتزام المتتالية</span>
            <Flame className="w-5 h-5 text-[#D4AF37] animate-pulse" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#8A5800] font-quran">
              {toArabicNumerals(progress.streakDays)}
            </span>
            <span className="text-xs text-[#6B6358] font-serif-art">يوم متواصل 🔥</span>
          </div>
        </div>

        {/* Verses Read Today */}
        <div className="bg-white border border-[#EADBCE] rounded-3xl p-5 shadow-lg shadow-[#2D5A27]/5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2D5A27] font-serif-art">الآيات المقروءة اليوم</span>
            <BookOpen className="w-5 h-5 text-[#2D5A27]" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#2D5A27] font-quran">
              {toArabicNumerals(progress.totalVersesReadToday)}
            </span>
            <span className="text-xs text-[#6B6358] font-serif-art">من {toArabicNumerals(progress.dailyGoalVerses)} آية</span>
          </div>
        </div>

        {/* Memorized Verses Total */}
        <div className="bg-white border border-[#EADBCE] rounded-3xl p-5 shadow-lg shadow-[#2D5A27]/5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2D5A27] font-serif-art">الآيات المحفوظة</span>
            <CheckCircle2 className="w-5 h-5 text-[#2D5A27]" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#2D5A27] font-quran">
              {toArabicNumerals(memorizedCount)}
            </span>
            <span className="text-xs text-[#6B6358] font-serif-art">آية مثبتة</span>
          </div>
        </div>

        {/* Khatmah / Completion % */}
        <div className="bg-white border border-[#EADBCE] rounded-3xl p-5 shadow-lg shadow-[#2D5A27]/5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A5800] font-serif-art">نسبة حفظ المصحف</span>
            <Award className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#8A5800] font-quran">
              {toArabicNumerals(memorizationPercentage)}%
            </span>
            <span className="text-xs text-[#6B6358] font-serif-art">من القرآن الكريم</span>
          </div>
        </div>
      </div>

      {/* Daily Goal & Progress Bar Card */}
      <div className="bg-white border border-[#EADBCE] rounded-3xl p-6 shadow-xl shadow-[#2D5A27]/5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#2D5A27] flex items-center gap-2 font-quran">
              <Target className="w-5 h-5 text-[#2D5A27]" />
              <span>الهدف اليومي للورد القرآني</span>
            </h3>
            <p className="text-xs text-[#6B6358] font-serif-art">
              أنجزت اليوم {toArabicNumerals(progress.totalVersesReadToday)} من أصل {toArabicNumerals(progress.dailyGoalVerses)} آية
            </p>
          </div>

          {/* Goal adjuster */}
          <div className="flex items-center gap-1.5 bg-[#FAF7F0] p-1.5 rounded-2xl border border-[#E5DEC9] text-xs">
            {[3, 5, 10, 20].map((goal) => (
              <button
                key={goal}
                onClick={() => {
                  soundManager.playTapSound();
                  onUpdateGoal(goal);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  progress.dailyGoalVerses === goal
                    ? 'bg-[#2D5A27] text-[#FAF7EE] shadow-md border border-[#D4AF37]/40'
                    : 'text-[#61594F] hover:text-[#2D5A27]'
                }`}
              >
                {toArabicNumerals(goal)} آيات
              </button>
            ))}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="h-4 bg-[#FAF7F0] rounded-full border border-[#E5DEC9] overflow-hidden p-0.5 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${dailyProgressPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-l from-[#D4AF37] to-[#2D5A27] rounded-full shadow-md"
            />
          </div>
          <div className="flex justify-between text-xs text-[#6B6358] font-serif-art">
            <span>نسبة إنجاز اليوم: {toArabicNumerals(dailyProgressPercentage)}%</span>
            {dailyProgressPercentage >= 100 && (
              <span className="text-[#2D5A27] font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>تم إكمال الورد اليومي بنجاح! مبارك!</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Personalized Learning Level Selector */}
      <div className="bg-white border border-[#EADBCE] rounded-3xl p-6 shadow-xl shadow-[#2D5A27]/5 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-[#2D5A27] flex items-center gap-2 font-quran">
            <UserCheck className="w-5 h-5 text-[#2D5A27]" />
            <span>المستوى التعليمي والفئة العمرية</span>
          </h3>
          <p className="text-xs text-[#6B6358] font-serif-art">
            يحدد مستوى صعوبة التمارين ونمط التسميع المناسب لسنك وخبرتك
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'child', title: 'براعم القرآن (الأطفال)', desc: 'نطق بطيء، كلمات ملونة، وتحفيز تفاعلي' },
            { id: 'beginner', title: 'مبتدئ في الحفظ', desc: 'تركيز على قصار السور والتكرار المعلم' },
            { id: 'intermediate', title: 'متوسط', desc: 'تمارين إخفاء كلمات واختبارات معاني' },
            { id: 'advanced', title: 'حافظ متقدم', desc: 'تسميع ذكي مستمر وتدقيق تجويدي كامل' },
          ].map((lvl) => {
            const isSelected = progress.level === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => {
                  soundManager.playTapSound();
                  onUpdateLevel(lvl.id as any);
                }}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-[#F0F7EE] border-[#2D5A27] ring-2 ring-[#2D5A27]/20 text-[#2C2A29]'
                    : 'bg-[#FAF7F0] border-[#E5DEC9] hover:border-[#D4AF37] text-[#4A453E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#2D5A27] font-quran">{lvl.title}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#2D5A27]" />}
                </div>
                <p className="text-xs text-[#6B6358] leading-relaxed font-serif-art">{lvl.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Reminders System Card */}
      <div className="bg-white border border-[#EADBCE] rounded-3xl p-6 shadow-xl shadow-[#2D5A27]/5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EADBCE]">
          <div>
            <h3 className="text-xl font-bold text-[#2D5A27] flex items-center gap-2 font-quran">
              <Bell className="w-5 h-5 text-[#8A5800]" />
              <span>نظام التذكيرات اليومية الذكية</span>
            </h3>
            <p className="text-xs text-[#6B6358] font-serif-art">
              تنبيهات منتظمة لأوقات التلاوة والمراجعة لتثبيت عادة الحفظ اليومية
            </p>
          </div>

          <button
            onClick={requestNotificationPermission}
            className="px-4 py-2 rounded-xl bg-[#9A6200] hover:bg-[#8A5800] text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-md border border-[#D4AF37]/40"
          >
            <Bell className="w-4 h-4" />
            <span>تفعيل إشعارات المتصفح</span>
          </button>
        </div>

        {notificationStatus && (
          <div className="p-3.5 bg-[#F0F7EE] border border-[#A3CF9E] rounded-xl text-xs text-[#2D5A27] font-medium font-serif-art">
            {notificationStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Morning / Fajr */}
          <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E5DEC9] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2C2A29] font-quran text-sm">ورد الفجر (الصباح)</span>
              <Clock className="w-4 h-4 text-[#8A5800]" />
            </div>
            <p className="text-[11px] text-[#6B6358] font-serif-art">بعد صلاة الفجر لبداية مباركة</p>
            <input
              type="time"
              value={progress.reminderSettings.morningTime}
              onChange={(e) => {
                onUpdateReminders({
                  ...progress.reminderSettings,
                  morningTime: e.target.value,
                });
              }}
              className="w-full bg-white border border-[#E5DEC9] rounded-xl p-2 text-[#2C2A29] font-mono text-center text-sm outline-hidden focus:border-[#2D5A27]"
            />
          </div>

          {/* Evening / Asr */}
          <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E5DEC9] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2C2A29] font-quran text-sm">ورد العصر (المساء)</span>
              <Clock className="w-4 h-4 text-[#2D5A27]" />
            </div>
            <p className="text-[11px] text-[#6B6358] font-serif-art">مراجعة ما تم حفظه صباحاً</p>
            <input
              type="time"
              value={progress.reminderSettings.eveningTime}
              onChange={(e) => {
                onUpdateReminders({
                  ...progress.reminderSettings,
                  eveningTime: e.target.value,
                });
              }}
              className="w-full bg-white border border-[#E5DEC9] rounded-xl p-2 text-[#2C2A29] font-mono text-center text-sm outline-hidden focus:border-[#2D5A27]"
            />
          </div>

          {/* Night / Isha */}
          <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E5DEC9] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2C2A29] font-quran text-sm">تثبيت ما قبل النوم</span>
              <Clock className="w-4 h-4 text-[#8A5800]" />
            </div>
            <p className="text-[11px] text-[#6B6358] font-serif-art">سورة الملك وأذكار النوم</p>
            <input
              type="time"
              value={progress.reminderSettings.nightTime}
              onChange={(e) => {
                onUpdateReminders({
                  ...progress.reminderSettings,
                  nightTime: e.target.value,
                });
              }}
              className="w-full bg-white border border-[#E5DEC9] rounded-xl p-2 text-[#2C2A29] font-mono text-center text-sm outline-hidden focus:border-[#2D5A27]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
