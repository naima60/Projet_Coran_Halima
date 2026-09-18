import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  Play,
  Square,
  CheckCircle2,
  RefreshCw,
  Award,
  ChevronLeft,
  ChevronRight,
  Pause,
  ArrowRight,
  Volume1,
  BookOpen,
} from 'lucide-react';
import { Surah, Ayah, Reciter, Riwayah } from '../types';
import { getRecitersByRiwayah, RECITERS } from '../data/quranData';
import { soundManager } from '../utils/soundEffects';
import { toArabicNumerals } from '../utils/arabicUtils';

interface LiveRecitationTesterProps {
  surah: Surah;
  currentReciter: Reciter;
  onSelectReciter?: (reciter: Reciter) => void;
  onAyahCompleted: (surahNumber: number, ayahNumber: number) => void;
  onWordClick: (word: string, ayahContext: string, predefinedMeaning?: any) => void;
  selectedRiwayah?: Riwayah;
}

export const LiveRecitationTester: React.FC<LiveRecitationTesterProps> = ({
  surah,
  currentReciter,
  onSelectReciter,
  onAyahCompleted,
  onWordClick,
  selectedRiwayah = 'hafs' as Riwayah,
}) => {
  const [selectedAyahIndex, setSelectedAyahIndex] = useState<number>(0);
  const [isRecordingAudio, setIsRecordingAudio] = useState<boolean>(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [isPlayingReference, setIsPlayingReference] = useState<boolean>(false);
  const [isUserPlaybackPlaying, setIsUserPlaybackPlaying] = useState<boolean>(false);

  // Filter reciters for selected Riwayah
  const availableReciters = getRecitersByRiwayah(selectedRiwayah);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const referenceAudioRef = useRef<HTMLAudioElement | null>(null);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const currentAyah = surah.ayahs?.[selectedAyahIndex] || surah.ayahs?.[0];
  const ayahWords = currentAyah?.words || [];

  // Reset states when changing Ayah or Surah
  useEffect(() => {
    stopRecording();
    setAudioBlobUrl(null);
    setIsUserPlaybackPlaying(false);
  }, [selectedAyahIndex, surah.number]);

  // Start Audio Recording
  const startRecording = async () => {
    soundManager.playTapSound();
    setAudioBlobUrl(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(audioUrl);
        // Stop audio tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
        
        soundManager.playSuccessChime();
        if (currentAyah) {
          onAyahCompleted(surah.number, currentAyah.numberInSurah);
        }
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
    } catch (err) {
      console.warn('Microphone recording error:', err);
      alert('يرجى السماح بالوصول إلى الميكروفون لتسجيل تلاوتك.');
    }
  };

  // Stop Audio Recording
  const stopRecording = () => {
    soundManager.playTapSound();
    setIsRecordingAudio(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
  };

  // Full reset helper
  const handleFullReset = () => {
    soundManager.playTapSound();
    stopRecording();
    setAudioBlobUrl(null);
    setIsUserPlaybackPlaying(false);
  };

  // Play Reference Sheikh Audio for this Ayah
  const togglePlayReference = () => {
    soundManager.playTapSound();
    if (!referenceAudioRef.current || !currentAyah?.audioUrl) return;

    if (isPlayingReference) {
      referenceAudioRef.current.pause();
      setIsPlayingReference(false);
    } else {
      // Pause user audio if playing
      if (userAudioPlayerRef.current) {
        userAudioPlayerRef.current.pause();
        setIsUserPlaybackPlaying(false);
      }
      referenceAudioRef.current.play();
      setIsPlayingReference(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden Reference Audio */}
      {currentAyah?.audioUrl && (
        <audio
          key={`${currentAyah.audioUrl}-${currentReciter.id}`}
          ref={referenceAudioRef}
          src={currentAyah.audioUrl}
          onEnded={() => setIsPlayingReference(false)}
          onPause={() => setIsPlayingReference(false)}
          onPlay={() => setIsPlayingReference(true)}
        />
      )}

      {/* Main Recitation Card */}
      <div className="bg-white border border-[#EADBCE] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#2D5A27]/5 space-y-6">
        {/* Top Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EADBCE]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2D5A27] via-[#244b1f] to-[#173313] flex items-center justify-center text-[#F3E5AB] font-bold font-quran text-xl shadow-md border border-[#D4AF37]/40">
              {toArabicNumerals(currentAyah?.numberInSurah || 1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#2D5A27] font-quran">
                  سورة {surah.name} • الآية {toArabicNumerals(currentAyah?.numberInSurah || 1)}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFF8E7] text-[#8A5800] border border-[#E5C368] font-bold">
                  {selectedRiwayah === 'warsh' ? 'رواية ورش عن نافع' : 'رواية حفص عن عاصم'}
                </span>
              </div>
              <p className="text-xs text-[#6B6358] font-serif-art mt-0.5">
                تسجيل التلاوة بصوتك والاستماع ومقارنتها مع صوت الشيخ المعلم
              </p>
            </div>
          </div>

          {/* Ayah Navigation & Reciter Selection & Reference Playback */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Reciter Selector */}
            {onSelectReciter && (
              <select
                value={currentReciter.id}
                onChange={(e) => {
                  const found = RECITERS.find((r) => r.id === e.target.value);
                  if (found) onSelectReciter(found);
                }}
                className="bg-[#FAF7F0] text-xs text-[#2C2A29] border border-[#E5DEC9] rounded-xl px-2.5 py-2 outline-hidden focus:border-[#2D5A27] transition-colors cursor-pointer"
                title="تغيير القارئ المرجعي"
              >
                {availableReciters.map((r) => (
                  <option key={r.id} value={r.id}>
                    🎙️ {r.name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setSelectedAyahIndex((prev) => Math.max(0, prev - 1))}
              disabled={selectedAyahIndex === 0}
              className="p-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#F2ECE0] disabled:opacity-30 text-[#4A453E] border border-[#E5DEC9] transition-colors cursor-pointer"
              title="الآية السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlayReference}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border shadow-xs cursor-pointer ${
                isPlayingReference
                  ? 'bg-[#2D5A27] text-white border-[#2D5A27] scale-102'
                  : 'bg-[#FAF7F0] text-[#2D5A27] border-[#A3CF9E] hover:bg-[#F0F7EE]'
              }`}
              title="الاستماع لتلاوة الشيخ"
            >
              {isPlayingReference ? (
                <>
                  <Pause className="w-4 h-4 animate-pulse" />
                  <span>إيقاف تلاوة الشيخ</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>استمع للشيخ ({currentReciter.name.split(' ')[0]})</span>
                </>
              )}
            </button>

            <button
              onClick={() =>
                setSelectedAyahIndex((prev) =>
                  Math.min((surah.ayahs?.length || 1) - 1, prev + 1)
                )
              }
              disabled={!surah.ayahs || selectedAyahIndex >= surah.ayahs.length - 1}
              className="p-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#F2ECE0] disabled:opacity-30 text-[#4A453E] border border-[#E5DEC9] transition-colors cursor-pointer"
              title="الآية التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Informational Guidance Banner */}
        <div
          className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
            isRecordingAudio
              ? 'bg-[#FFF0F0] border-[#FCA5A5] text-[#991B1B]'
              : audioBlobUrl
              ? 'bg-[#F0F7EE] border-[#A3CF9E] text-[#2D5A27]'
              : 'bg-[#FAF7F0] border-[#E5DEC9] text-[#4A453E]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0 shadow-xs ${
                isRecordingAudio
                  ? 'bg-[#DC2626] text-white animate-pulse'
                  : audioBlobUrl
                  ? 'bg-[#2D5A27] text-white'
                  : 'bg-[#E5DEC9] text-[#61594F]'
              }`}
            >
              {isRecordingAudio ? '🎙' : audioBlobUrl ? '✓' : '📖'}
            </div>
            <div>
              <span className="text-xs font-bold block mb-0.5">
                {isRecordingAudio
                  ? 'جاري تسجيل صوتك الآن:'
                  : audioBlobUrl
                  ? 'تم تسجيل تلاوتك بنجاح!'
                  : 'تعليمات التسميع:'}
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                {isRecordingAudio
                  ? 'اقرأ الآية بصوت واضح ورتّل ترتيلاً حسناً...'
                  : audioBlobUrl
                  ? 'يمكنك الاستماع إلى تلاوتك المسجلة أو إعادة التسجيل، أو مقارنتها مع صوت الشيخ.'
                  : 'اضغط على زر "بدء تسجيل التلاوة" واقرأ الآية الكريمة، ثم استمع إلى صوتك.'}
              </p>
            </div>
          </div>
        </div>

        {/* Classical Ayah Display Frame */}
        <div className="relative bg-[#FFFDF9] border-4 border-double border-[#D4AF37]/50 rounded-3xl p-6 sm:p-10 shadow-inner">
          {selectedAyahIndex === 0 && surah.number !== 9 && surah.number !== 1 && (
            <div className="text-center pb-4 mb-5 border-b border-[#D4AF37]/30">
              <span className="font-quran text-2xl sm:text-3xl text-[#2D5A27] tracking-wider select-none block">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
              <p className="text-[11px] text-[#8A5800] font-serif-art mt-1">
                الاستفتاح بالبسملة سنة مباركة عند ابتداء السورة، وتبدأ الآية الأولى بعدها مباشرة
              </p>
            </div>
          )}

          <div className="font-quran text-center text-3xl sm:text-4xl lg:text-5xl leading-[2.6] tracking-wide select-none">
            {ayahWords.map((w) => {
              return (
                <span
                  key={w.id}
                  onClick={() => {
                    soundManager.playTapSound();
                    onWordClick(w.text, currentAyah.text);
                  }}
                  className="inline-block mx-1.5 px-2.5 py-1 rounded-2xl cursor-pointer transition-all duration-200 text-[#2C2A29] hover:text-[#2D5A27] hover:bg-[#F0F7EE]"
                  title="انقر لمعرفة تفسير ومفردة الكلمة"
                >
                  {w.text}
                </span>
              );
            })}

            {/* Ayah End Marker */}
            <span className="inline-block mr-2 text-[#D4AF37] font-quran text-3xl align-middle">
              ۝{toArabicNumerals(currentAyah?.numberInSurah || 1)}
            </span>
          </div>
        </div>

        {/* Recitation Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {!isRecordingAudio ? (
            <button
              onClick={startRecording}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#2D5A27] via-[#244b1f] to-[#173313] hover:from-[#386d31] hover:to-[#22471c] text-[#FAF7EE] font-bold text-lg flex items-center gap-3 shadow-xl shadow-[#2D5A27]/25 border border-[#D4AF37]/40 active:scale-95 transition-all cursor-pointer"
            >
              <Mic className="w-6 h-6 text-[#F3E5AB]" />
              <span>بدء تسجيل التلاوة</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#DC2626] to-[#991B1B] hover:from-[#EF4444] hover:to-[#B91C1C] text-white font-bold text-lg flex items-center gap-3 shadow-xl shadow-red-950/20 animate-pulse active:scale-95 transition-all cursor-pointer"
            >
              <MicOff className="w-6 h-6" />
              <span>إيقاف وحفظ التسجيل</span>
            </button>
          )}

          {/* Reset button */}
          <button
            onClick={handleFullReset}
            className="p-4 rounded-2xl bg-[#FAF7F0] hover:bg-[#F2ECE0] text-[#4A453E] border border-[#E5DEC9] transition-colors shadow-xs cursor-pointer"
            title="إعادة التسميع ومسح التسجيل الصوتي"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Recorded Audio Player Card */}
        {audioBlobUrl && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 sm:p-6 bg-[#FAF7F0] border border-[#D4AF37]/60 rounded-3xl space-y-4 shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5DEC9]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#2D5A27] text-[#F3E5AB] flex items-center justify-center font-bold">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#2D5A27]">
                    تسجيل تلاوتك بصوتك
                  </h4>
                  <p className="text-xs text-[#6B6358]">
                    استمع إلى نطقك ومخارج حروفك في هذه الآية الكريمة
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlayReference}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F0F7EE] text-[#2D5A27] border border-[#A3CF9E] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Volume1 className="w-4 h-4" />
                  <span>المقارنة مع الشيخ</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center p-2">
              <audio
                ref={userAudioPlayerRef}
                src={audioBlobUrl}
                controls
                className="w-full max-w-lg h-11 rounded-xl shadow-xs"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

