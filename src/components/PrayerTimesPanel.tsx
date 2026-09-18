import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Compass, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  Sparkles, 
  Navigation, 
  Check, 
  Settings2,
  Volume2,
  VolumeX,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  POPULAR_CITIES, 
  CALCULATION_METHODS, 
  CityLocation, 
  CalculationMethod, 
  calculateLocalPrayerTimes, 
  PrayerTimesResult 
} from '../utils/prayerTimesCalculator';
import { soundManager } from '../utils/soundEffects';

export const PrayerTimesPanel: React.FC = () => {
  // Stored city or default to Rabat / Casablanca
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    try {
      return localStorage.getItem('prayer_city_id') || 'casablanca';
    } catch {
      return 'casablanca';
    }
  });

  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    try {
      return localStorage.getItem('prayer_country') || 'المغرب';
    } catch {
      return 'المغرب';
    }
  });

  const [selectedMethod, setSelectedMethod] = useState<CalculationMethod>(() => {
    try {
      return (localStorage.getItem('prayer_method') as CalculationMethod) || 'MWL';
    } catch {
      return 'MWL';
    }
  });

  // Custom GPS coordinates if user used geolocation
  const [customCoords, setCustomCoords] = useState<{ lat: number; lng: number; name: string } | null>(() => {
    try {
      const saved = localStorage.getItem('prayer_custom_coords');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isAdhanSoundEnabled, setIsAdhanSoundEnabled] = useState(true);

  // Live timer tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Unique countries list
  const countries = Array.from(new Set(POPULAR_CITIES.map((c) => c.countryAr)));

  // Filter cities by selected country
  const citiesInCountry = POPULAR_CITIES.filter((c) => c.countryAr === selectedCountry);

  // Find active city object
  const activeCity: CityLocation = 
    POPULAR_CITIES.find((c) => c.id === selectedCityId) || POPULAR_CITIES[0];

  const activeLat = customCoords ? customCoords.lat : activeCity.latitude;
  const activeLng = customCoords ? customCoords.lng : activeCity.longitude;
  const locationLabel = customCoords ? customCoords.name : `${activeCity.nameAr} (${activeCity.countryAr})`;

  // Calculate current prayer times
  const prayerResult: PrayerTimesResult = calculateLocalPrayerTimes(
    currentTime,
    activeLat,
    activeLng,
    selectedMethod
  );

  // Handle browser Geolocation
  const handleDetectLocation = () => {
    soundManager.playTapSound();
    if (!navigator.geolocation) {
      setLocationError('المتصفح لا يدعم تحديد الموقع الجغرافي.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          name: 'موقعي الحالي (GPS)',
        };
        setCustomCoords(coords);
        try {
          localStorage.setItem('prayer_custom_coords', JSON.stringify(coords));
        } catch {}
      },
      (err) => {
        setIsLocating(false);
        setLocationError('تعذر تحديد الموقع تلقائياً. يرجى اختيار المدينة يدوياً من القائمة أدناه.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectCity = (cityId: string) => {
    soundManager.playTapSound();
    setSelectedCityId(cityId);
    setCustomCoords(null);
    try {
      localStorage.removeItem('prayer_custom_coords');
      localStorage.setItem('prayer_city_id', cityId);
    } catch {}
  };

  const handleCountryChange = (country: string) => {
    soundManager.playTapSound();
    setSelectedCountry(country);
    setCustomCoords(null);
    const firstCity = POPULAR_CITIES.find((c) => c.countryAr === country);
    if (firstCity) {
      setSelectedCityId(firstCity.id);
      setSelectedMethod(firstCity.defaultMethod);
      try {
        localStorage.removeItem('prayer_custom_coords');
        localStorage.setItem('prayer_country', country);
        localStorage.setItem('prayer_city_id', firstCity.id);
        localStorage.setItem('prayer_method', firstCity.defaultMethod);
      } catch {}
    }
  };

  const prayerItems = [
    { name: 'الفجر', en: 'Fajr', time: prayerResult.fajr, icon: Sunrise, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'الشروق', en: 'Sunrise', time: prayerResult.sunrise, icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50' },
    { name: 'الظهر', en: 'Dhuhr', time: prayerResult.dhuhr, icon: Sun, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'العصر', en: 'Asr', time: prayerResult.asr, icon: Sunset, color: 'text-orange-600', bg: 'bg-orange-50' },
    { name: 'المغرب', en: 'Maghrib', time: prayerResult.maghrib, icon: Sunset, color: 'text-rose-600', bg: 'bg-rose-50' },
    { name: 'العشاء', en: 'Isha', time: prayerResult.isha, icon: Moon, color: 'text-blue-900', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans" dir="rtl">
      
      {/* 1. Main Next Prayer & Time Banner */}
      <div className="bg-gradient-to-l from-[#173215] via-[#23471f] to-[#2D5A27] text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-[#D4AF37]/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Location and Live Date */}
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{locationLabel}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-quran text-white tracking-wide">
              مواقيت الصلاة اليومية
            </h2>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs sm:text-sm text-[#E2E8F0]/90">
              <span className="font-semibold">{prayerResult.dateStr}</span>
              <span className="text-[#D4AF37]">•</span>
              <span className="font-serif-art text-[#F1C40F] font-bold">{prayerResult.hijriDate}</span>
            </div>
          </div>

          {/* Next Prayer Countdown Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 text-center min-w-[240px] shadow-inner space-y-1">
            <span className="text-xs text-[#E2E8F0] font-medium">الصلاة القادمة بإذن الله</span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-quran text-[#D4AF37]">
                صلاة {prayerResult.nextPrayer.nameAr}
              </span>
              <span className="text-lg font-bold font-sans text-white/90">
                ({prayerResult.nextPrayer.time})
              </span>
            </div>

            <div className="pt-2 text-sm text-white font-bold font-sans">
              متبقي: <span className="text-[#F1C40F]">{prayerResult.nextPrayer.remainingFormatted}</span>
            </div>

            {/* Live digital clock */}
            <div className="text-[11px] text-white/70 font-mono pt-1">
              الوقت الحالي: {currentTime.toLocaleTimeString('fr-FR')}
            </div>
          </div>

        </div>
      </div>

      {/* 2. Country & City Controls */}
      <div className="bg-[#FAF7F0] border-2 border-[#D4AF37]/40 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#EADBCE] pb-3">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-[#2D5A27]" />
            <h3 className="font-bold text-[#2D5A27] text-base">
              تحديد البلد والمدينة
            </h3>
          </div>

          {/* Auto GPS Detect Button */}
          <button
            onClick={handleDetectLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2D5A27] hover:bg-[#23471f] text-white text-xs font-bold rounded-xl transition-all shadow-xs disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'جاري تحديد موقعك...' : 'تحديد موقعي التلقائي (GPS)'}</span>
          </button>
        </div>

        {locationError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Country selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#6B6358]">الدولة:</label>
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-[#2D2A26] focus:outline-hidden focus:border-[#2D5A27]"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* City selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#6B6358]">المدينة:</label>
            <select
              value={selectedCityId}
              onChange={(e) => handleSelectCity(e.target.value)}
              className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-[#2D2A26] focus:outline-hidden focus:border-[#2D5A27]"
            >
              {citiesInCountry.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameAr} ({c.nameEn})
                </option>
              ))}
            </select>
          </div>

          {/* Method selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#6B6358]">طريقة الحساب الفقهية:</label>
            <select
              value={selectedMethod}
              onChange={(e) => {
                soundManager.playTapSound();
                const m = e.target.value as CalculationMethod;
                setSelectedMethod(m);
                try {
                  localStorage.setItem('prayer_method', m);
                } catch {}
              }}
              className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-[#2D2A26] focus:outline-hidden focus:border-[#2D5A27]"
            >
              {CALCULATION_METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nameAr}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* 3. Daily Prayer Times Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {prayerItems.map((item) => {
          const isNext = prayerResult.nextPrayer.nameAr === item.name;
          const IconComp = item.icon;

          return (
            <div
              key={item.name}
              className={`rounded-2xl p-4 text-center transition-all relative overflow-hidden border-2 ${
                isNext
                  ? 'bg-[#F4F9F2] border-[#2D5A27] shadow-md ring-2 ring-[#2D5A27]/20 scale-102'
                  : 'bg-white border-[#EADBCE] hover:border-[#D4AF37] shadow-xs'
              }`}
            >
              {isNext && (
                <div className="absolute top-0 right-0 left-0 bg-[#2D5A27] text-white text-[10px] font-bold py-0.5">
                  القادمة
                </div>
              )}

              <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-2 mt-1 ${item.bg}`}>
                <IconComp className={`w-5 h-5 ${item.color}`} />
              </div>

              <h4 className="font-quran text-lg font-bold text-[#2D2A26]">
                {item.name}
              </h4>

              <div className="text-xl sm:text-2xl font-extrabold font-sans text-[#2D5A27] my-1">
                {item.time}
              </div>

              <span className="text-[11px] text-[#8C8275] block">
                {item.en}
              </span>
            </div>
          );
        })}
      </div>

      {/* 4. Secondary Times & Qibla Compass */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Qibla Direction Compass Card */}
        <div className="bg-[#FFFDF9] border-2 border-[#D4AF37]/40 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
          <div className="flex items-center gap-2 text-[#2D5A27] font-bold text-base">
            <Compass className="w-5 h-5 text-[#D4AF37]" />
            <span>اتجاه القبلة الشريفة</span>
          </div>

          <p className="text-xs text-[#6B6358] max-w-sm">
            الاتجاه الدقيق نحو الكعبة المشرفة بمكة المكرمة من {locationLabel}
          </p>

          {/* Compass Graphic */}
          <div className="relative w-36 h-36 rounded-full border-4 border-[#2D5A27]/30 bg-[#FAF7F0] flex items-center justify-center shadow-inner my-2">
            <div className="absolute top-1 text-[10px] font-bold text-[#DC2626]">N (الشمال)</div>
            <div className="absolute bottom-1 text-[10px] font-bold text-[#6B6358]">S</div>
            <div className="absolute right-2 text-[10px] font-bold text-[#6B6358]">E (الشرق)</div>
            <div className="absolute left-2 text-[10px] font-bold text-[#6B6358]">W</div>

            {/* Rotating Qibla needle */}
            <div
              className="absolute w-1 h-28 flex flex-col items-center justify-between transition-transform duration-700"
              style={{ transform: `rotate(${prayerResult.qiblaAngle}deg)` }}
            >
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[18px] border-b-[#2D5A27] filter drop-shadow-xs" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] border-2 border-white shadow-xs" />
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[12px] border-t-[#6B6358]" />
            </div>

            <div className="w-3 h-3 rounded-full bg-[#2D5A27] z-10" />
          </div>

          <div className="bg-[#FAF7F0] border border-[#D4AF37]/50 px-4 py-1.5 rounded-xl text-xs text-[#2D5A27] font-bold font-sans">
            زاوية القبلة: {prayerResult.qiblaAngle}° من الشمال
          </div>
        </div>

        {/* Virtues and Night Prayers Info */}
        <div className="bg-[#FFFDF9] border-2 border-[#D4AF37]/40 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#2D5A27] font-bold text-base">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <span>أوقات الليل وقيام الليل</span>
            </div>
            <p className="text-xs text-[#6B6358]">
              أوقات التنزل الإلهي واستجابة الدعاء في جوف الليل الآخر
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#EADBCE] text-center">
              <span className="text-xs text-[#6B6358] block">منتصف الليل الشرعي</span>
              <span className="text-lg font-bold font-sans text-[#2D5A27]">
                {prayerResult.midnight}
              </span>
            </div>

            <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#EADBCE] text-center">
              <span className="text-xs text-[#6B6358] block">الثلث الأخير (قيام الليل)</span>
              <span className="text-lg font-bold font-sans text-[#8A5800]">
                {prayerResult.lastThird}
              </span>
            </div>
          </div>

          <div className="bg-[#F4F9F2] border-r-4 border-[#2D5A27] p-3 rounded-xl text-xs text-[#2D5A27] space-y-1">
            <div className="font-bold">قال رسول الله ﷺ:</div>
            <p className="font-serif-art leading-relaxed text-[#1B4314]">
              «يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ فَيَقُولُ: مَنْ يَدْعُونِي فَأَسْتَجِيبَ لَهُ، مَنْ يَسْأَلُنِي فَأُعْطِيَهُ، مَنْ يَسْتَغْفِرُنِي فَأَغْفِرَ لَهُ»
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
