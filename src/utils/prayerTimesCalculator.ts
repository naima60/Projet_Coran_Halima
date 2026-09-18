export interface CityLocation {
  id: string;
  nameAr: string;
  nameEn: string;
  countryAr: string;
  countryEn: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  defaultMethod: CalculationMethod;
}

export type CalculationMethod = 'MWL' | 'ISNA' | 'EGYPT' | 'MAKKAH' | 'KARACHI' | 'TEHRAN' | 'UOIF';

export interface PrayerTimesResult {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  midnight: string;
  lastThird: string;
  dateStr: string;
  hijriDate: string;
  nextPrayer: {
    nameAr: string;
    nameEn: string;
    time: string;
    remainingMinutes: number;
    remainingFormatted: string;
    percentage: number;
  };
  qiblaAngle: number;
}

export const POPULAR_CITIES: CityLocation[] = [
  // المغرب
  { id: 'rabat', nameAr: 'الرباط', nameEn: 'Rabat', countryAr: 'المغرب', countryEn: 'Morocco', countryCode: 'MA', latitude: 34.0209, longitude: -6.8416, timeZone: 'Africa/Casablanca', defaultMethod: 'MWL' },
  { id: 'casablanca', nameAr: 'الدار البيضاء', nameEn: 'Casablanca', countryAr: 'المغرب', countryEn: 'Morocco', countryCode: 'MA', latitude: 33.5731, longitude: -7.5898, timeZone: 'Africa/Casablanca', defaultMethod: 'MWL' },
  { id: 'marrakech', nameAr: 'مراكش', nameEn: 'Marrakech', countryAr: 'المغرب', countryEn: 'Morocco', countryCode: 'MA', latitude: 31.6295, longitude: -7.9811, timeZone: 'Africa/Casablanca', defaultMethod: 'MWL' },
  { id: 'fes', nameAr: 'فاس', nameEn: 'Fez', countryAr: 'المغرب', countryEn: 'Morocco', countryCode: 'MA', latitude: 34.0331, longitude: -5.0003, timeZone: 'Africa/Casablanca', defaultMethod: 'MWL' },
  { id: 'tangier', nameAr: 'طنجة', nameEn: 'Tangier', countryAr: 'المغرب', countryEn: 'Morocco', countryCode: 'MA', latitude: 35.7595, longitude: -5.8340, timeZone: 'Africa/Casablanca', defaultMethod: 'MWL' },
  { id: 'agadir', nameAr: 'أكادير', nameEn: 'Agadir', countryAr: 'المغرب', countryEn: 'Morocco', countryCode: 'MA', latitude: 30.4278, longitude: -9.5981, timeZone: 'Africa/Casablanca', defaultMethod: 'MWL' },
  { id: 'oujda', nameAr: 'وجدة', nameEn: 'Oujda', countryAr: 'المغرب', countryEn: 'Morocco', countryCode: 'MA', latitude: 34.6814, longitude: -1.9086, timeZone: 'Africa/Casablanca', defaultMethod: 'MWL' },

  // السعودية
  { id: 'makkah', nameAr: 'مكة المكرمة', nameEn: 'Makkah', countryAr: 'المملكة العربية السعودية', countryEn: 'Saudi Arabia', countryCode: 'SA', latitude: 21.4225, longitude: 39.8262, timeZone: 'Asia/Riyadh', defaultMethod: 'MAKKAH' },
  { id: 'madinah', nameAr: 'المدينة المنورة', nameEn: 'Madinah', countryAr: 'المملكة العربية السعودية', countryEn: 'Saudi Arabia', countryCode: 'SA', latitude: 24.5247, longitude: 39.5692, timeZone: 'Asia/Riyadh', defaultMethod: 'MAKKAH' },
  { id: 'riyadh', nameAr: 'الرياض', nameEn: 'Riyadh', countryAr: 'المملكة العربية السعودية', countryEn: 'Saudi Arabia', countryCode: 'SA', latitude: 24.7136, longitude: 46.6753, timeZone: 'Asia/Riyadh', defaultMethod: 'MAKKAH' },
  { id: 'jeddah', nameAr: 'جدة', nameEn: 'Jeddah', countryAr: 'المملكة العربية السعودية', countryEn: 'Saudi Arabia', countryCode: 'SA', latitude: 21.5433, longitude: 39.1728, timeZone: 'Asia/Riyadh', defaultMethod: 'MAKKAH' },

  // الجزائر
  { id: 'algiers', nameAr: 'الجزائر العاصمة', nameEn: 'Algiers', countryAr: 'الجزائر', countryEn: 'Algeria', countryCode: 'DZ', latitude: 36.7538, longitude: 3.0588, timeZone: 'Africa/Algiers', defaultMethod: 'MWL' },
  { id: 'oran', nameAr: 'وهران', nameEn: 'Oran', countryAr: 'الجزائر', countryEn: 'Algeria', countryCode: 'DZ', latitude: 35.6987, longitude: -0.6349, timeZone: 'Africa/Algiers', defaultMethod: 'MWL' },
  { id: 'constantine', nameAr: 'قسنطينة', nameEn: 'Constantine', countryAr: 'الجزائر', countryEn: 'Algeria', countryCode: 'DZ', latitude: 36.3650, longitude: 6.6147, timeZone: 'Africa/Algiers', defaultMethod: 'MWL' },

  // تونس
  { id: 'tunis', nameAr: 'تونس العاصمة', nameEn: 'Tunis', countryAr: 'تونس', countryEn: 'Tunisia', countryCode: 'TN', latitude: 36.8065, longitude: 10.1815, timeZone: 'Africa/Tunis', defaultMethod: 'MWL' },
  { id: 'sfax', nameAr: 'صفاقس', nameEn: 'Sfax', countryAr: 'تونس', countryEn: 'Tunisia', countryCode: 'TN', latitude: 34.7406, longitude: 10.7603, timeZone: 'Africa/Tunis', defaultMethod: 'MWL' },

  // مصر
  { id: 'cairo', nameAr: 'القاهرة', nameEn: 'Cairo', countryAr: 'مصر', countryEn: 'Egypt', countryCode: 'EG', latitude: 30.0444, longitude: 31.2357, timeZone: 'Africa/Cairo', defaultMethod: 'EGYPT' },
  { id: 'alexandria', nameAr: 'الإسكندرية', nameEn: 'Alexandria', countryAr: 'مصر', countryEn: 'Egypt', countryCode: 'EG', latitude: 31.2001, longitude: 29.9187, timeZone: 'Africa/Cairo', defaultMethod: 'EGYPT' },

  // فرنسا وأوروبا
  { id: 'paris', nameAr: 'باريس', nameEn: 'Paris', countryAr: 'فرنسا', countryEn: 'France', countryCode: 'FR', latitude: 48.8566, longitude: 2.3522, timeZone: 'Europe/Paris', defaultMethod: 'UOIF' },
  { id: 'lyon', nameAr: 'ليون', nameEn: 'Lyon', countryAr: 'فرنسا', countryEn: 'France', countryCode: 'FR', latitude: 45.7640, longitude: 4.8357, timeZone: 'Europe/Paris', defaultMethod: 'UOIF' },
  { id: 'marseille', nameAr: 'مارسيليا', nameEn: 'Marseille', countryAr: 'فرنسا', countryEn: 'France', countryCode: 'FR', latitude: 43.2965, longitude: 5.3698, timeZone: 'Europe/Paris', defaultMethod: 'UOIF' },
  { id: 'brussels', nameAr: 'بروكسل', nameEn: 'Brussels', countryAr: 'بلجيكا', countryEn: 'Belgium', countryCode: 'BE', latitude: 50.8503, longitude: 4.3517, timeZone: 'Europe/Brussels', defaultMethod: 'MWL' },
  { id: 'london', nameAr: 'لندن', nameEn: 'London', countryAr: 'المملكة المتحدة', countryEn: 'United Kingdom', countryCode: 'GB', latitude: 51.5074, longitude: -0.1278, timeZone: 'Europe/London', defaultMethod: 'MWL' },
  { id: 'madrid', nameAr: 'مدريد', nameEn: 'Madrid', countryAr: 'إسبانيا', countryEn: 'Spain', countryCode: 'ES', latitude: 40.4168, longitude: -3.7038, timeZone: 'Europe/Madrid', defaultMethod: 'MWL' },

  // الإمارات وقطر والكويت وتركيا
  { id: 'dubai', nameAr: 'دبي', nameEn: 'Dubai', countryAr: 'الإمارات العربية المتحدة', countryEn: 'United Arab Emirates', countryCode: 'AE', latitude: 25.2048, longitude: 55.2708, timeZone: 'Asia/Dubai', defaultMethod: 'MAKKAH' },
  { id: 'abudhabi', nameAr: 'أبوظبي', nameEn: 'Abu Dhabi', countryAr: 'الإمارات العربية المتحدة', countryEn: 'United Arab Emirates', countryCode: 'AE', latitude: 24.4539, longitude: 54.3773, timeZone: 'Asia/Dubai', defaultMethod: 'MAKKAH' },
  { id: 'doha', nameAr: 'الدوحة', nameEn: 'Doha', countryAr: 'قطر', countryEn: 'Qatar', countryCode: 'QA', latitude: 25.2854, longitude: 51.5310, timeZone: 'Asia/Qatar', defaultMethod: 'MAKKAH' },
  { id: 'kuwait', nameAr: 'مدينة الكويت', nameEn: 'Kuwait City', countryAr: 'الكويت', countryEn: 'Kuwait', countryCode: 'KW', latitude: 29.3759, longitude: 47.9774, timeZone: 'Asia/Kuwait', defaultMethod: 'MAKKAH' },
  { id: 'istanbul', nameAr: 'إسطنبول', nameEn: 'Istanbul', countryAr: 'تركيا', countryEn: 'Turkey', countryCode: 'TR', latitude: 41.0082, longitude: 28.9784, timeZone: 'Europe/Istanbul', defaultMethod: 'MWL' },
  { id: 'amman', nameAr: 'عمّان', nameEn: 'Amman', countryAr: 'الأردن', countryEn: 'Jordan', countryCode: 'JO', latitude: 31.9454, longitude: 35.9284, timeZone: 'Asia/Amman', defaultMethod: 'MWL' },
  { id: 'dakar', nameAr: 'داكار', nameEn: 'Dakar', countryAr: 'السنغال', countryEn: 'Senegal', countryCode: 'SN', latitude: 14.7167, longitude: -17.4677, timeZone: 'Africa/Dakar', defaultMethod: 'MWL' },

  // أمريكا وكندا
  { id: 'montreal', nameAr: 'مونتريال', nameEn: 'Montreal', countryAr: 'كندا', countryEn: 'Canada', countryCode: 'CA', latitude: 45.5017, longitude: -73.5673, timeZone: 'America/Toronto', defaultMethod: 'ISNA' },
  { id: 'newyork', nameAr: 'نيويورك', nameEn: 'New York', countryAr: 'الولايات المتحدة الأمريكية', countryEn: 'USA', countryCode: 'US', latitude: 40.7128, longitude: -74.0060, timeZone: 'America/New_York', defaultMethod: 'ISNA' },
];

export const CALCULATION_METHODS: { id: CalculationMethod; nameAr: string; fajrAngle: number; ishaAngle: number }[] = [
  { id: 'MWL', nameAr: 'رابطة العالم الإسلامي (فجر: 18° / عشاء: 17°)', fajrAngle: 18, ishaAngle: 17 },
  { id: 'EGYPT', nameAr: 'الهيئة المصرية العامة للمساحة (فجر: 19.5° / عشاء: 17.5°)', fajrAngle: 19.5, ishaAngle: 17.5 },
  { id: 'MAKKAH', nameAr: 'أم القرى - مكة المكرمة (فجر: 18.5° / عشاء: 90 دقيقة)', fajrAngle: 18.5, ishaAngle: 19 },
  { id: 'ISNA', nameAr: 'الجمعية الإسلامية لأمريكا الشمالية ISNA (فجر: 15° / عشاء: 15°)', fajrAngle: 15, ishaAngle: 15 },
  { id: 'UOIF', nameAr: 'اتحاد المنظمات الإسلامية بفرنسا (فجر: 12° / عشاء: 12°)', fajrAngle: 12, ishaAngle: 12 },
  { id: 'KARACHI', nameAr: 'جامعة العلوم الإسلامية بكراتشي (فجر: 18° / عشاء: 18°)', fajrAngle: 18, ishaAngle: 18 },
];

// Qibla calculation relative to Kaaba (Makkah: 21.4225, 39.8262)
export function calculateQibla(latitude: number, longitude: number): number {
  const makkahLat = (21.4225 * Math.PI) / 180;
  const makkahLon = (39.8262 * Math.PI) / 180;
  const userLat = (latitude * Math.PI) / 180;
  const userLon = (longitude * Math.PI) / 180;

  const y = Math.sin(makkahLon - userLon);
  const x = Math.cos(userLat) * Math.tan(makkahLat) - Math.sin(userLat) * Math.cos(makkahLon - userLon);
  let qibla = (Math.atan2(y, x) * 180) / Math.PI;
  if (qibla < 0) qibla += 360;
  return Math.round(qibla);
}

// Astronomical math helper for offline prayer calculations
function dtr(d: number): number {
  return (d * Math.PI) / 180.0;
}
function rtd(r: number): number {
  return (r * 180.0) / Math.PI;
}
function fixHour(h: number): number {
  let a = h - 24.0 * Math.floor(h / 24.0);
  return a < 0 ? a + 24 : a;
}

export function calculateLocalPrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  method: CalculationMethod = 'MWL'
): PrayerTimesResult {
  const methodConfig = CALCULATION_METHODS.find((m) => m.id === method) || CALCULATION_METHODS[0];
  const fajrAngle = methodConfig.fajrAngle;
  const ishaAngle = methodConfig.ishaAngle;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian date computation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  const d = jd - 2451545.0; // days since J2000.0

  // Mean anomaly of the Sun
  const g = 357.529 + 0.98560028 * d;
  // Mean longitude of the Sun
  const q = 280.459 + 0.98564736 * d;
  // Geocentric apparent ecliptic longitude of the Sun
  const l = q + 1.915 * Math.sin(dtr(g)) + 0.02 * Math.sin(dtr(2 * g));

  // Mean obliquity of the ecliptic
  const e = 23.439 - 0.00000036 * d;
  // Sun's declination
  const decl = rtd(Math.asin(Math.sin(dtr(e)) * Math.sin(dtr(l))));

  // Equation of Time (in minutes)
  const ra = rtd(Math.atan2(Math.cos(dtr(e)) * Math.sin(dtr(l)), Math.cos(dtr(l)))) / 15.0;
  const eqt = (q / 15.0 - fixHour(ra)) * 60.0;

  // Timezone offset in hours
  const timezoneOffset = -date.getTimezoneOffset() / 60.0;

  // Solar noon
  const noon = fixHour(12 + timezoneOffset - lng / 15.0 - eqt / 60.0);

  // Sun hour angle helper
  const hourAngle = (angle: number): number => {
    const val =
      (Math.sin(dtr(-angle)) - Math.sin(dtr(lat)) * Math.sin(dtr(decl))) /
      (Math.cos(dtr(lat)) * Math.cos(dtr(decl)));
    if (val > 1) return 0;
    if (val < -1) return 180;
    return rtd(Math.acos(val)) / 15.0;
  };

  // Asr shadow angle (Shafii: shadow length = object length + noon shadow)
  const asrAngleHelper = (): number => {
    const val = Math.atan(1 + Math.tan(dtr(Math.abs(lat - decl))));
    return hourAngle(90 - rtd(val));
  };

  // Prayer time values in fractional hours
  const fajrTime = fixHour(noon - hourAngle(fajrAngle));
  const sunriseTime = fixHour(noon - hourAngle(0.833));
  const dhuhrTime = fixHour(noon + 4 / 60.0); // 4 minutes after true solar noon
  const asrTime = fixHour(noon + asrAngleHelper());
  const maghribTime = fixHour(noon + hourAngle(0.833) + 2 / 60.0); // sunset
  const ishaTime =
    method === 'MAKKAH'
      ? fixHour(maghribTime + 1.5) // Makkah adds 90 mins after Maghrib
      : fixHour(noon + hourAngle(ishaAngle));

  // Helper to format fractional hour to HH:MM
  const formatTime = (hourFraction: number): string => {
    const totalMinutes = Math.round(fixHour(hourFraction) * 60);
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const fajrStr = formatTime(fajrTime);
  const sunriseStr = formatTime(sunriseTime);
  const dhuhrStr = formatTime(dhuhrTime);
  const asrStr = formatTime(asrTime);
  const maghribStr = formatTime(maghribTime);
  const ishaStr = formatTime(ishaTime);

  // Midnight & Last third of the night
  const nightDuration = fixHour(24 + fajrTime - maghribTime);
  const midnightStr = formatTime(maghribTime + nightDuration / 2);
  const lastThirdStr = formatTime(maghribTime + (nightDuration * 2) / 3);

  // Determine next prayer and countdown
  const now = date;
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  const prayers = [
    { nameAr: 'الفجر', nameEn: 'Fajr', time: fajrStr, minutes: Math.round(fajrTime * 60) },
    { nameAr: 'الشروق', nameEn: 'Sunrise', time: sunriseStr, minutes: Math.round(sunriseTime * 60) },
    { nameAr: 'الظهر', nameEn: 'Dhuhr', time: dhuhrStr, minutes: Math.round(dhuhrTime * 60) },
    { nameAr: 'العصر', nameEn: 'Asr', time: asrStr, minutes: Math.round(asrTime * 60) },
    { nameAr: 'المغرب', nameEn: 'Maghrib', time: maghribStr, minutes: Math.round(maghribTime * 60) },
    { nameAr: 'العشاء', nameEn: 'Isha', time: ishaStr, minutes: Math.round(ishaTime * 60) },
  ];

  let nextP = prayers.find((p) => p.minutes > currentMinutes);
  let remainingM = 0;

  if (!nextP) {
    // After Isha, next is tomorrow's Fajr
    nextP = prayers[0];
    remainingM = 1440 - currentMinutes + nextP.minutes;
  } else {
    remainingM = nextP.minutes - currentMinutes;
  }

  const remHours = Math.floor(remainingM / 60);
  const remMins = Math.floor(remainingM % 60);
  const remainingFormatted = `${remHours > 0 ? `${remHours} ساعة و ` : ''}${remMins} دقيقة`;

  // Estimate Hijri Date
  const hijriMonths = [
    'المحرّم',
    'صفر',
    'ربيع الأول',
    'ربيع الثاني',
    'جمادى الأولى',
    'جمادى الآخرة',
    'رجب',
    'شعبان',
    'رمضان',
    'شوّال',
    'ذو القعدة',
    'ذو الحجة',
  ];

  // Hijri approximation from Gregorian
  const hijriYear = Math.round((year - 622) * (33 / 32));
  const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  const estimatedHijriDay = ((dayOfYear + 15) % 29) + 1;
  const estimatedHijriMonth = Math.floor((dayOfYear / 29.5) % 12);
  const hijriDateStr = `${estimatedHijriDay} ${hijriMonths[estimatedHijriMonth]} ${hijriYear} هـ`;

  return {
    fajr: fajrStr,
    sunrise: sunriseStr,
    dhuhr: dhuhrStr,
    asr: asrStr,
    maghrib: maghribStr,
    isha: ishaStr,
    midnight: midnightStr,
    lastThird: lastThirdStr,
    dateStr: date.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    hijriDate: hijriDateStr,
    nextPrayer: {
      nameAr: nextP.nameAr,
      nameEn: nextP.nameEn,
      time: nextP.time,
      remainingMinutes: Math.round(remainingM),
      remainingFormatted,
      percentage: Math.min(100, Math.max(5, Math.round((1 - remainingM / 300) * 100))),
    },
    qiblaAngle: calculateQibla(lat, lng),
  };
}
