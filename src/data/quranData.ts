import { Surah, Reciter, Riwayah } from '../types';
import { splitAyahIntoWords, removeTashkeel, toArabicNumerals, stripBasmalahFromAyah } from '../utils/arabicUtils';

export { toArabicNumerals };

export const RECITERS: Reciter[] = [
  // Hafs Reciters (رواية حفص عن عاصم)
  {
    id: 'hussary_teacher',
    name: 'محمود خليل الحصري (المعلم)',
    subname: 'نطق بطيء دقيق لتعليم أحكام التجويد ومخارج الحروف',
    identifier: 'Husary_Muallim_128kbps',
    serverUrl: 'https://everyayah.com/data/Husary_Muallim_128kbps',
    riwayah: 'hafs',
  },
  {
    id: 'hussary_murattal',
    name: 'محمود خليل الحصري (مرتل)',
    subname: 'المصحف المرتل برواية حفص عن عاصم',
    identifier: 'Husary_128kbps',
    serverUrl: 'https://everyayah.com/data/Husary_128kbps',
    riwayah: 'hafs',
  },
  {
    id: 'hussary_mujawwad',
    name: 'محمود خليل الحصري (مجود)',
    subname: 'المصحف المجود بخشوع ونبرات تجويدية فريدة',
    identifier: 'Husary_Mujawwad_128kbps',
    serverUrl: 'https://everyayah.com/data/Husary_Mujawwad_128kbps',
    riwayah: 'hafs',
  },
  {
    id: 'mishary',
    name: 'مشاري بن راشد العفاسي',
    subname: 'تلاوة عذبة واضحة ومتقنة',
    identifier: 'Alafasy_128kbps',
    serverUrl: 'https://everyayah.com/data/Alafasy_128kbps',
    riwayah: 'hafs',
  },
  {
    id: 'minshawi_teacher',
    name: 'محمد صديق المنشاوي (المعلم)',
    subname: 'تلاوة تعليمية مع الترديد لأحكام التجويد',
    identifier: 'Minshawy_Teacher_128kbps',
    serverUrl: 'https://everyayah.com/data/Minshawy_Teacher_128kbps',
    riwayah: 'hafs',
  },
  {
    id: 'minshawi_murattal',
    name: 'محمد صديق المنشاوي (مرتل)',
    subname: 'خشوع تام وتطبيق دقيق لأحكام التجويد',
    identifier: 'Minshawy_Murattal_128kbps',
    serverUrl: 'https://everyayah.com/data/Minshawy_Murattal_128kbps',
    riwayah: 'hafs',
  },
  {
    id: 'abdulbasit_hafs',
    name: 'عبد الباسط عبد الصمد (مرتل)',
    subname: 'صوت متميز ومخارج حروف متقنة',
    identifier: 'Abdul_Basit_Murattal_192kbps',
    serverUrl: 'https://everyayah.com/data/Abdul_Basit_Murattal_192kbps',
    riwayah: 'hafs',
  },
  {
    id: 'muaiqly',
    name: 'ماهر المعيقلي',
    subname: 'إمام المسجد الحرام وتلاوة خاشعة',
    identifier: 'MaherAlMuaiqly128kbps',
    serverUrl: 'https://everyayah.com/data/MaherAlMuaiqly128kbps',
    riwayah: 'hafs',
  },
  {
    id: 'ghamadi',
    name: 'سعد الغامدي',
    subname: 'تلاوة سريعة معتدلة للحفظ والمراجعة',
    identifier: 'Ghamadi_40kbps',
    serverUrl: 'https://everyayah.com/data/Ghamadi_40kbps',
    riwayah: 'hafs',
  },
  {
    id: 'shatri',
    name: 'أبو بكر الشاطري',
    subname: 'تلاوة هادئة ومؤثرة',
    identifier: 'Abu_Bakr_Ash-Shaatree_128kbps',
    serverUrl: 'https://everyayah.com/data/Abu_Bakr_Ash-Shaatree_128kbps',
    riwayah: 'hafs',
  },
  {
    id: 'hudhaify',
    name: 'علي بن عبد الرحمن الحذيفي',
    subname: 'إمام المسجد النبوي الشريف وضبط تجويدي فائق',
    identifier: 'Hudhaify_128kbps',
    serverUrl: 'https://everyayah.com/data/Hudhaify_128kbps',
    riwayah: 'hafs',
  },

  // Warsh Reciters (رواية ورش عن نافع)
  {
    id: 'yassin_warsh',
    name: 'ياسين الجزائري (ورش عن نافع)',
    subname: 'تلاوة مغاربية أصيلة بالتقليل وترقيق الراء',
    identifier: 'warsh_yassin_al_jazaery_64kbps',
    serverUrl: 'https://everyayah.com/data/warsh/warsh_yassin_al_jazaery_64kbps',
    riwayah: 'warsh',
  },
  {
    id: 'ibrahim_dosary_warsh',
    name: 'إبراهيم الدوسري (ورش عن نافع)',
    subname: 'قراءة متقنة ومضبوطة بأحكام رواية ورش من طريق الأزرق',
    identifier: 'warsh_ibrahim_aldosary_128kbps',
    serverUrl: 'https://everyayah.com/data/warsh/warsh_ibrahim_aldosary_128kbps',
    riwayah: 'warsh',
  },
  {
    id: 'abdulbasit_warsh',
    name: 'عبد الباسط عبد الصمد (ورش عن نافع)',
    subname: 'تلاوة شجية خاشعة بأحكام ورش عن نافع',
    identifier: 'warsh_Abdul_Basit_128kbps',
    serverUrl: 'https://everyayah.com/data/warsh/warsh_Abdul_Basit_128kbps',
    riwayah: 'warsh',
  },
];

export function getRecitersByRiwayah(riwayah: Riwayah): Reciter[] {
  return RECITERS.filter((r) => r.riwayah === riwayah);
}

// Complete 114 Surahs Metadata
export const SURAHS_LIST: Omit<Surah, 'ayahs'>[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', englishNameTranslation: 'The Opening', revelationType: 'Meccan', numberOfAyahs: 7 },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', englishNameTranslation: 'The Cow', revelationType: 'Medinan', numberOfAyahs: 286 },
  { number: 3, name: 'آل عمران', englishName: 'Aal-Imran', englishNameTranslation: 'The Family of Imran', revelationType: 'Medinan', numberOfAyahs: 200 },
  { number: 4, name: 'النساء', englishName: 'An-Nisa', englishNameTranslation: 'The Women', revelationType: 'Medinan', numberOfAyahs: 176 },
  { number: 5, name: 'المائدة', englishName: 'Al-Maidah', englishNameTranslation: 'The Table Spread', revelationType: 'Medinan', numberOfAyahs: 120 },
  { number: 6, name: 'الأنعام', englishName: 'Al-Anam', englishNameTranslation: 'The Cattle', revelationType: 'Meccan', numberOfAyahs: 165 },
  { number: 7, name: 'الأعراف', englishName: 'Al-Araf', englishNameTranslation: 'The Heights', revelationType: 'Meccan', numberOfAyahs: 206 },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', englishNameTranslation: 'The Spoils of War', revelationType: 'Medinan', numberOfAyahs: 75 },
  { number: 9, name: 'التوبة', englishName: 'At-Tawbah', englishNameTranslation: 'The Repentance', revelationType: 'Medinan', numberOfAyahs: 129 },
  { number: 10, name: 'يونس', englishName: 'Yunus', englishNameTranslation: 'Jonah', revelationType: 'Meccan', numberOfAyahs: 109 },
  { number: 11, name: 'هود', englishName: 'Hud', englishNameTranslation: 'Hud', revelationType: 'Meccan', numberOfAyahs: 123 },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', englishNameTranslation: 'Joseph', revelationType: 'Meccan', numberOfAyahs: 111 },
  { number: 13, name: 'الرعد', englishName: 'Ar-Rad', englishNameTranslation: 'The Thunder', revelationType: 'Medinan', numberOfAyahs: 43 },
  { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', englishNameTranslation: 'Abraham', revelationType: 'Meccan', numberOfAyahs: 52 },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', englishNameTranslation: 'The Rocky Tract', revelationType: 'Meccan', numberOfAyahs: 99 },
  { number: 16, name: 'النحل', englishName: 'An-Nahl', englishNameTranslation: 'The Bee', revelationType: 'Meccan', numberOfAyahs: 128 },
  { number: 17, name: 'الإسراء', englishName: 'Al-Isra', englishNameTranslation: 'The Night Journey', revelationType: 'Meccan', numberOfAyahs: 111 },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', englishNameTranslation: 'The Cave', revelationType: 'Meccan', numberOfAyahs: 110 },
  { number: 19, name: 'مريم', englishName: 'Maryam', englishNameTranslation: 'Mary', revelationType: 'Meccan', numberOfAyahs: 98 },
  { number: 20, name: 'طه', englishName: 'Taha', englishNameTranslation: 'Ta-Ha', revelationType: 'Meccan', numberOfAyahs: 135 },
  { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', englishNameTranslation: 'The Prophets', revelationType: 'Meccan', numberOfAyahs: 112 },
  { number: 22, name: 'الحج', englishName: 'Al-Hajj', englishNameTranslation: 'The Pilgrimage', revelationType: 'Medinan', numberOfAyahs: 78 },
  { number: 23, name: 'المؤمنون', englishName: 'Al-Muminun', englishNameTranslation: 'The Believers', revelationType: 'Meccan', numberOfAyahs: 118 },
  { number: 24, name: 'النور', englishName: 'An-Nur', englishNameTranslation: 'The Light', revelationType: 'Medinan', numberOfAyahs: 64 },
  { number: 25, name: 'الفرقان', englishName: 'Al-Furqan', englishNameTranslation: 'The Criterion', revelationType: 'Meccan', numberOfAyahs: 77 },
  { number: 26, name: 'الشعراء', englishName: 'Ash-Shuara', englishNameTranslation: 'The Poets', revelationType: 'Meccan', numberOfAyahs: 227 },
  { number: 27, name: 'النمل', englishName: 'An-Naml', englishNameTranslation: 'The Ant', revelationType: 'Meccan', numberOfAyahs: 93 },
  { number: 28, name: 'القصص', englishName: 'Al-Qasas', englishNameTranslation: 'The Stories', revelationType: 'Meccan', numberOfAyahs: 88 },
  { number: 29, name: 'العنكبوت', englishName: 'Al-Ankabut', englishNameTranslation: 'The Spider', revelationType: 'Meccan', numberOfAyahs: 69 },
  { number: 30, name: 'الروم', englishName: 'Ar-Rum', englishNameTranslation: 'The Romans', revelationType: 'Meccan', numberOfAyahs: 60 },
  { number: 31, name: 'لقمان', englishName: 'Luqman', englishNameTranslation: 'Luqman', revelationType: 'Meccan', numberOfAyahs: 34 },
  { number: 32, name: 'السجدة', englishName: 'As-Sajdah', englishNameTranslation: 'The Prostration', revelationType: 'Meccan', numberOfAyahs: 30 },
  { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', englishNameTranslation: 'The Combined Forces', revelationType: 'Medinan', numberOfAyahs: 73 },
  { number: 34, name: 'سبأ', englishName: 'Saba', englishNameTranslation: 'Sheba', revelationType: 'Meccan', numberOfAyahs: 54 },
  { number: 35, name: 'فاطر', englishName: 'Fatir', englishNameTranslation: 'Originator', revelationType: 'Meccan', numberOfAyahs: 45 },
  { number: 36, name: 'يس', englishName: 'Yaseen', englishNameTranslation: 'Ya-Sin', revelationType: 'Meccan', numberOfAyahs: 83 },
  { number: 37, name: 'الصافات', englishName: 'As-Saffat', englishNameTranslation: 'Those who set the Ranks', revelationType: 'Meccan', numberOfAyahs: 182 },
  { number: 38, name: 'ص', englishName: 'Saad', englishNameTranslation: 'The Letter Saad', revelationType: 'Meccan', numberOfAyahs: 88 },
  { number: 39, name: 'الزمر', englishName: 'Az-Zumar', englishNameTranslation: 'The Troops', revelationType: 'Meccan', numberOfAyahs: 75 },
  { number: 40, name: 'غافر', englishName: 'Ghafir', englishNameTranslation: 'The Forgiver', revelationType: 'Meccan', numberOfAyahs: 85 },
  { number: 41, name: 'فصلت', englishName: 'Fussilat', englishNameTranslation: 'Explained in Detail', revelationType: 'Meccan', numberOfAyahs: 54 },
  { number: 42, name: 'الشورى', englishName: 'Ash-Shura', englishNameTranslation: 'The Consultation', revelationType: 'Meccan', numberOfAyahs: 53 },
  { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', englishNameTranslation: 'The Ornaments of Gold', revelationType: 'Meccan', numberOfAyahs: 89 },
  { number: 44, name: 'الدخان', englishName: 'Ad-Dukhan', englishNameTranslation: 'The Smoke', revelationType: 'Meccan', numberOfAyahs: 59 },
  { number: 45, name: 'الجاثية', englishName: 'Al-Jathiyah', englishNameTranslation: 'The Crouching', revelationType: 'Meccan', numberOfAyahs: 37 },
  { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', englishNameTranslation: 'The Wind-Curved Sandhills', revelationType: 'Meccan', numberOfAyahs: 35 },
  { number: 47, name: 'محمد', englishName: 'Muhammad', englishNameTranslation: 'Muhammad', revelationType: 'Medinan', numberOfAyahs: 38 },
  { number: 48, name: 'الفتح', englishName: 'Al-Fath', englishNameTranslation: 'The Victory', revelationType: 'Medinan', numberOfAyahs: 29 },
  { number: 49, name: 'الحجرات', englishName: 'Al-Hujurat', englishNameTranslation: 'The Rooms', revelationType: 'Medinan', numberOfAyahs: 18 },
  { number: 50, name: 'ق', englishName: 'Qaf', englishNameTranslation: 'The Letter Qaf', revelationType: 'Meccan', numberOfAyahs: 45 },
  { number: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat', englishNameTranslation: 'The Winnowing Winds', revelationType: 'Meccan', numberOfAyahs: 60 },
  { number: 52, name: 'الطور', englishName: 'At-Tur', englishNameTranslation: 'The Mount', revelationType: 'Meccan', numberOfAyahs: 49 },
  { number: 53, name: 'النجم', englishName: 'An-Najm', englishNameTranslation: 'The Star', revelationType: 'Meccan', numberOfAyahs: 62 },
  { number: 54, name: 'القمر', englishName: 'Al-Qamar', englishNameTranslation: 'The Moon', revelationType: 'Meccan', numberOfAyahs: 55 },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', englishNameTranslation: 'The Beneficent', revelationType: 'Medinan', numberOfAyahs: 78 },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waqiah', englishNameTranslation: 'The Inevitable', revelationType: 'Meccan', numberOfAyahs: 96 },
  { number: 57, name: 'الحديد', englishName: 'Al-Hadid', englishNameTranslation: 'The Iron', revelationType: 'Medinan', numberOfAyahs: 29 },
  { number: 58, name: 'المجادلة', englishName: 'Al-Mujadila', englishNameTranslation: 'The Pleading Woman', revelationType: 'Medinan', numberOfAyahs: 22 },
  { number: 59, name: 'الحشر', englishName: 'Al-Hashr', englishNameTranslation: 'The Exile', revelationType: 'Medinan', numberOfAyahs: 24 },
  { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah', englishNameTranslation: 'She that is to be examined', revelationType: 'Medinan', numberOfAyahs: 13 },
  { number: 61, name: 'الصف', englishName: 'As-Saff', englishNameTranslation: 'The Ranks', revelationType: 'Medinan', numberOfAyahs: 14 },
  { number: 62, name: 'الجمعة', englishName: 'Al-Jumuah', englishNameTranslation: 'The Congregation, Friday', revelationType: 'Medinan', numberOfAyahs: 11 },
  { number: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', englishNameTranslation: 'The Hypocrites', revelationType: 'Medinan', numberOfAyahs: 11 },
  { number: 64, name: 'التغابن', englishName: 'At-Taghabun', englishNameTranslation: 'The Mutual Disillusion', revelationType: 'Medinan', numberOfAyahs: 18 },
  { number: 65, name: 'الطلاق', englishName: 'At-Talaq', englishNameTranslation: 'The Divorce', revelationType: 'Medinan', numberOfAyahs: 12 },
  { number: 66, name: 'التحريم', englishName: 'At-Tahrim', englishNameTranslation: 'The Prohibition', revelationType: 'Medinan', numberOfAyahs: 12 },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', englishNameTranslation: 'The Sovereignty', revelationType: 'Meccan', numberOfAyahs: 30 },
  { number: 68, name: 'القلم', englishName: 'Al-Qalam', englishNameTranslation: 'The Pen', revelationType: 'Meccan', numberOfAyahs: 52 },
  { number: 69, name: 'الحاقة', englishName: 'Al-Haqqah', englishNameTranslation: 'The Reality', revelationType: 'Meccan', numberOfAyahs: 52 },
  { number: 70, name: 'المعارج', englishName: 'Al-Maarij', englishNameTranslation: 'The Ascending Stairways', revelationType: 'Meccan', numberOfAyahs: 44 },
  { number: 71, name: 'نوح', englishName: 'Nuh', englishNameTranslation: 'Noah', revelationType: 'Meccan', numberOfAyahs: 28 },
  { number: 72, name: 'الجن', englishName: 'Al-Jinn', englishNameTranslation: 'The Jinn', revelationType: 'Meccan', numberOfAyahs: 28 },
  { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', englishNameTranslation: 'The Enshrouded One', revelationType: 'Meccan', numberOfAyahs: 20 },
  { number: 74, name: 'المدثر', englishName: 'Al-Muddathir', englishNameTranslation: 'The Cloaked One', revelationType: 'Meccan', numberOfAyahs: 56 },
  { number: 75, name: 'القيامة', englishName: 'Al-Qiyamah', englishNameTranslation: 'The Resurrection', revelationType: 'Meccan', numberOfAyahs: 40 },
  { number: 76, name: 'الإنسان', englishName: 'Al-Insan', englishNameTranslation: 'Man', revelationType: 'Medinan', numberOfAyahs: 31 },
  { number: 77, name: 'المرسلات', englishName: 'Al-Mursalat', englishNameTranslation: 'The Emissaries', revelationType: 'Meccan', numberOfAyahs: 50 },
  { number: 78, name: 'النبأ', englishName: 'An-Naba', englishNameTranslation: 'The Tidings', revelationType: 'Meccan', numberOfAyahs: 40 },
  { number: 79, name: 'النازعات', englishName: 'An-Naziat', englishNameTranslation: 'Those who drag forth', revelationType: 'Meccan', numberOfAyahs: 46 },
  { number: 80, name: 'عبس', englishName: 'Abasa', englishNameTranslation: 'He Frowned', revelationType: 'Meccan', numberOfAyahs: 42 },
  { number: 81, name: 'التكوير', englishName: 'At-Takwir', englishNameTranslation: 'The Overthrowing', revelationType: 'Meccan', numberOfAyahs: 29 },
  { number: 82, name: 'الانفطار', englishName: 'Al-Infitar', englishNameTranslation: 'The Cleaving', revelationType: 'Meccan', numberOfAyahs: 19 },
  { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', englishNameTranslation: 'The Defrauding', revelationType: 'Meccan', numberOfAyahs: 36 },
  { number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaq', englishNameTranslation: 'The Splitting Open', revelationType: 'Meccan', numberOfAyahs: 25 },
  { number: 85, name: 'البروج', englishName: 'Al-Buruj', englishNameTranslation: 'The Mansions of the Stars', revelationType: 'Meccan', numberOfAyahs: 22 },
  { number: 86, name: 'الطارق', englishName: 'At-Tariq', englishNameTranslation: 'The Morning Star', revelationType: 'Meccan', numberOfAyahs: 17 },
  { number: 87, name: 'الأعلى', englishName: 'Al-Ala', englishNameTranslation: 'The Most High', revelationType: 'Meccan', numberOfAyahs: 19 },
  { number: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah', englishNameTranslation: 'The Overwhelming', revelationType: 'Meccan', numberOfAyahs: 26 },
  { number: 89, name: 'الفجر', englishName: 'Al-Fajr', englishNameTranslation: 'The Dawn', revelationType: 'Meccan', numberOfAyahs: 30 },
  { number: 90, name: 'البلد', englishName: 'Al-Balad', englishNameTranslation: 'The City', revelationType: 'Meccan', numberOfAyahs: 20 },
  { number: 91, name: 'الشمس', englishName: 'Ash-Shams', englishNameTranslation: 'The Sun', revelationType: 'Meccan', numberOfAyahs: 15 },
  { number: 92, name: 'الليل', englishName: 'Al-Layl', englishNameTranslation: 'The Night', revelationType: 'Meccan', numberOfAyahs: 21 },
  { number: 93, name: 'الضحى', englishName: 'Ad-Duhaa', englishNameTranslation: 'The Morning Hours', revelationType: 'Meccan', numberOfAyahs: 11 },
  { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', englishNameTranslation: 'The Relief', revelationType: 'Meccan', numberOfAyahs: 8 },
  { number: 95, name: 'التين', englishName: 'At-Tin', englishNameTranslation: 'The Fig', revelationType: 'Meccan', numberOfAyahs: 8 },
  { number: 96, name: 'العلق', englishName: 'Al-Alaq', englishNameTranslation: 'The Clot', revelationType: 'Meccan', numberOfAyahs: 19 },
  { number: 97, name: 'القدر', englishName: 'Al-Qadr', englishNameTranslation: 'The Power', revelationType: 'Meccan', numberOfAyahs: 5 },
  { number: 98, name: 'البينة', englishName: 'Al-Bayyinah', englishNameTranslation: 'The Clear Proof', revelationType: 'Medinan', numberOfAyahs: 8 },
  { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', englishNameTranslation: 'The Earthquake', revelationType: 'Medinan', numberOfAyahs: 8 },
  { number: 100, name: 'العاديات', englishName: 'Al-Adiyat', englishNameTranslation: 'The Courser', revelationType: 'Meccan', numberOfAyahs: 11 },
  { number: 101, name: 'القارعة', englishName: 'Al-Qariah', englishNameTranslation: 'The Calamity', revelationType: 'Meccan', numberOfAyahs: 11 },
  { number: 102, name: 'التكاثر', englishName: 'At-Takathur', englishNameTranslation: 'The Rivalry in world increase', revelationType: 'Meccan', numberOfAyahs: 8 },
  { number: 103, name: 'العصر', englishName: 'Al-Asr', englishNameTranslation: 'The Declining Day', revelationType: 'Meccan', numberOfAyahs: 3 },
  { number: 104, name: 'الهمزة', englishName: 'Al-Humazah', englishNameTranslation: 'The Traducer', revelationType: 'Meccan', numberOfAyahs: 9 },
  { number: 105, name: 'الفيل', englishName: 'Al-Fil', englishNameTranslation: 'The Elephant', revelationType: 'Meccan', numberOfAyahs: 5 },
  { number: 106, name: 'قريش', englishName: 'Quraysh', englishNameTranslation: 'Quraysh', revelationType: 'Meccan', numberOfAyahs: 4 },
  { number: 107, name: 'الماعون', englishName: 'Al-Maun', englishNameTranslation: 'The Small Kindness', revelationType: 'Meccan', numberOfAyahs: 7 },
  { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', englishNameTranslation: 'The Abundance', revelationType: 'Meccan', numberOfAyahs: 3 },
  { number: 109, name: 'الكافرون', englishName: 'Al-Kafirun', englishNameTranslation: 'The Disbelievers', revelationType: 'Meccan', numberOfAyahs: 6 },
  { number: 110, name: 'النصر', englishName: 'An-Nasr', englishNameTranslation: 'The Divine Support', revelationType: 'Medinan', numberOfAyahs: 3 },
  { number: 111, name: 'المسد', englishName: 'Al-Masad', englishNameTranslation: 'The Palm Fiber', revelationType: 'Meccan', numberOfAyahs: 5 },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', englishNameTranslation: 'The Sincerity', revelationType: 'Meccan', numberOfAyahs: 4 },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', englishNameTranslation: 'The Daybreak', revelationType: 'Meccan', numberOfAyahs: 5 },
  { number: 114, name: 'الناس', englishName: 'An-Nas', englishNameTranslation: 'Mankind', revelationType: 'Meccan', numberOfAyahs: 6 },
];

// Rich curated Surahs with full Tashkeel, word objects, Tafseer, and difficult words glossary
export const CURATED_SURAHS: Record<number, { text: string; tafseer?: string; difficultWords?: { word: string; meaning: string; root?: string; explanation?: string }[] }[]> = {
  // 1. Al-Fatiha
  1: [
    {
      text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      tafseer: 'أبدأ قراءتي مستعيناً باسم الله الأعظم، الرحمن الذي وسعت رحمته كل شيء، الرحيم بعباده المؤمنين.',
      difficultWords: [
        { word: 'الرَّحْمَٰنِ', meaning: 'ذو الرحمة الشاملة لجميع الخلائق في الدنيا', root: 'ر ح م', explanation: 'صيغة مبالغة تدل على سعة الرحمة وعظمتها.' },
        { word: 'الرَّحِيمِ', meaning: 'المفيض رحمته على عباده المؤمنين خصوصاً في الآخرة', root: 'ر ح م', explanation: 'اسم يدل على إيصال الرحمة للمرحومين.' }
      ]
    },
    {
      text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      tafseer: 'الثناء الكامل المطلق لله وحده على نعمه وأسمائه وصفاته، وهو مالك ومربي جميع المخلوقات.',
      difficultWords: [
        { word: 'الْحَمْدُ', meaning: 'الثناء باللسان على الجميل الاختياري مع المحبة والتعظيم', root: 'ح م د', explanation: 'أعم من الشكر، فهو لله على ذاته وصفاته ونعمه.' },
        { word: 'الْعَالَمِينَ', meaning: 'كل ما سوى الله تعالى من إنس وجن وملائكة ومخلوقات', root: 'ع ل م', explanation: 'جمع عالم، وسُمي عالماً لأنه علم ودليل على وجود خالقه.' }
      ]
    },
    {
      text: 'الرَّحْمَٰنِ الرَّحِيمِ',
      tafseer: 'تأكيد على صفة الرحمة الواسعة لله سبحانه وتعالى.',
    },
    {
      text: 'مَالِكِ يَوْمِ الدِّينِ',
      tafseer: 'المتصرف الأوحد يوم القيامة والجزاء والحساب، حيث لا ملك لأحد غيره.',
      difficultWords: [
        { word: 'الدِّينِ', meaning: 'يوم الجزاء والحساب', root: 'د ي ن', explanation: 'الدين هنا بمعنى الجزاء، كما تدين تدان.' }
      ]
    },
    {
      text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      tafseer: 'نخصك وحدك بالعبادة والطاعة، ونطلب منك وحدك العون والتوفيق في كل أمورنا.',
      difficultWords: [
        { word: 'إِيَّاكَ', meaning: 'تخصيص وحصر العبادة والاستعانة بالله وحده دون سواه', root: 'إ ي ي', explanation: 'تقديم المفعول يفيد القصر والحصر، أي لا نعبد إلا أنت.' }
      ]
    },
    {
      text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      tafseer: 'وفقنا وأرشدنا وثبتنا على الطريق الواضح الموصل إلى رضاك وجنتك، وهو دين الإسلام.',
      difficultWords: [
        { word: 'اهْدِنَا', meaning: 'أرشدنا ووفقنا وثبتنا على الحق', root: 'ه د ي', explanation: 'الهداية هنا تشمل هداية الدلالة والإرشاد وهداية التوفيق والتثبيت.' },
        { word: 'الصِّرَاطَ', meaning: 'الطريق الواسع الواضح الذي لا اعوجاج فيه', root: 'ص ر ط', explanation: 'هو دين الإسلام وكتاب الله وسنة رسوله.' }
      ]
    },
    {
      text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      tafseer: 'طريق الأنبياء والصديقين والشهداء والصالحين، لا طريق من عرف الحق فتركه (المغضوب عليهم)، ولا من عبد الله بجهل وضلال (الضالين).',
      difficultWords: [
        { word: 'الْمَغْضُوبِ', meaning: 'الذين علموا الحق ولم يعملوا به كاليهود ومن سار على دربهم', root: 'غ ض ب', explanation: 'استحقوا غضب الله لمخالفتهم الحق بعد معرفته.' },
        { word: 'الضَّالِّينَ', meaning: 'الذين تركوا الحق جهلاً وضلالاً كالنصارى ومن شابههم', root: 'ض ل ل', explanation: 'الضلال هو العدول عن الطريق المستقيم عن غير علم.' }
      ]
    }
  ],

  // 112. Al-Ikhlas
  112: [
    {
      text: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      tafseer: 'قل أيها الرسول للناس: الله هو الإله المنفرد بالوحدانية والألوهية، لا شريك له.',
      difficultWords: [
        { word: 'أَحَدٌ', meaning: 'الواحد الذي لا نظير له ولا مثيل ولا شريك', root: 'أ ح د', explanation: 'أبلغ من (واحد) في نفي الشريك والشبيه.' }
      ]
    },
    {
      text: 'اللَّهُ الصَّمَدُ',
      tafseer: 'السيد المقصود في قضاء الحوائج والرغائب، الذي يفتقر إليه جميع خلقه وهو غني عنهم.',
      difficultWords: [
        { word: 'الصَّمَدُ', meaning: 'السيد الكامل في سؤدده، الذي تقصده الخلائق في كل حوائجها', root: 'ص م د', explanation: 'الذي تصمد إليه الخلائق (أي تقصده وتلتجئ إليه).' }
      ]
    },
    {
      text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      tafseer: 'ليس له ولد ولا والد، منزه عن صفات المخلوقين.',
      difficultWords: [
        { word: 'لَمْ يَلِدْ', meaning: 'نفي الولد والصاحبة عن الله تعالى', root: 'و ل د', explanation: 'رد على المشركين وأهل الضلال الذين نسبوا لله ولداً.' }
      ]
    },
    {
      text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
      tafseer: 'ولم يكن له مكافئ ولا مماثل ولا شبيه في أسمائه وصفاته وأفعاله.',
      difficultWords: [
        { word: 'كُفُوًا', meaning: 'مكافئاً ومماثلاً وشبيهاً ونظيراً', root: 'ك ف أ', explanation: 'الكفء هو المساوي والنظير، والله لا يماثله شيء.' }
      ]
    }
  ],

  // 113. Al-Falaq
  113: [
    {
      text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
      tafseer: 'قل: ألتجئ وأعتصم برب الصبح وفالقه، وهو الله القادر على إزالة الظلمات.',
      difficultWords: [
        { word: 'أَعُوذُ', meaning: 'ألتجئ وأتحصن وأستجير', root: 'ع و ذ', explanation: 'العياذ هو الالتجاء إلى من يدفع عنك الشر والمكروه.' },
        { word: 'الْفَلَقِ', meaning: 'الصبح، وقيل: كل ما يفلقه الله من الحَب والنوى والنبات', root: 'ف ل ق', explanation: 'فلق الصبح هو شقه لظلمة الليل بالنور.' }
      ]
    },
    {
      text: 'مِن شَرِّ مَا خَلَقَ',
      tafseer: 'من شر جميع المخلوقات المؤذية من إنس وجن وهوام وسباع.',
    },
    {
      text: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
      tafseer: 'ومن شر الليل إذا أقبل بظلامه الشديد وغطى كل شيء، وما ينتشر فيه من الشرور.',
      difficultWords: [
        { word: 'غَاسِقٍ', meaning: 'الليل شديد الظلمة', root: 'غ س ق', explanation: 'الغسق هو أول ظلمة الليل واشتدادها.' },
        { word: 'وَقَبَ', meaning: 'دخل وأقبل وأحاط بظلامه', root: 'و ق ب', explanation: 'وقب الظلام إذا ملأ المكان واستحكم.' }
      ]
    },
    {
      text: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
      tafseer: 'ومن شر السواحر والنفوس الشريرة التي تنفث بريقها في العقد بقصد الإيذاء والسحر.',
      difficultWords: [
        { word: 'النَّفَّاثَاتِ', meaning: 'الساحرات اللاتي ينفخن مع ريق خفيف في العقد للسحر', root: 'ن ف ث', explanation: 'النفث هو النفخ اللطيف مع يسير من الريق.' },
        { word: 'الْعُقَدِ', meaning: 'عقد الخيوط والحبال التي يعقدها الساحر لعمله الخبيث', root: 'ع ق د', explanation: 'جمع عقدة، وهي ما يُربط ويُحكم.' }
      ]
    },
    {
      text: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
      tafseer: 'ومن شر من يتمنى زوال النعمة عن غيره ويسعى في إيذائه بعينه أو فعله.',
      difficultWords: [
        { word: 'حَاسِدٍ', meaning: 'من يكره نعمة الله على عباده ويتمنى زوالها', root: 'ح س د', explanation: 'الحسد داء قلبي خبيث، والتعوذ منه عند إظهاره وتنفيذه.' }
      ]
    }
  ],

  // 114. An-Nas
  114: [
    {
      text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
      tafseer: 'قل أعتصم وأحتمي برب البشر وخالقهم ومدبر أمورهم.',
    },
    {
      text: 'مَلِكِ النَّاسِ',
      tafseer: 'الملك المتصرف فيهم بعدله وحكمته، الذي له السلطان المطلق.',
    },
    {
      text: 'إِلَٰهِ النَّاسِ',
      tafseer: 'معبودهم الحق الذي لا إله غيره ولا يستحق العبادة سواه.',
    },
    {
      text: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
      tafseer: 'من شر الشيطان الذي يوسوس في القلوب عند الغفلة، ويختفي ويتراجع عند ذكر الله.',
      difficultWords: [
        { word: 'الْوَسْوَاسِ', meaning: 'الشيطان الذي يلقي الخواطر الشريرة في النفس', root: 'و س و س', explanation: 'الوسوسة هي الكلام الخفي والإلقاء المتكرر في الصدر.' },
        { word: 'الْخَنَّاسِ', meaning: 'الذي ينقبض ويتأخر ويختفي إذا ذُكر الله تعالى', root: 'خ ن س', explanation: 'خنَس إذا توارى واستتر خيفة وذلاً.' }
      ]
    },
    {
      text: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
      tafseer: 'الذي يلقي الشبهات والشهوات والأفكار السيئة في قلوب البشر.',
    },
    {
      text: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
      tafseer: 'وهؤلاء الشياطين الموسوسون يكونون من شياطين الجن ومن شياطين الإنس.',
      difficultWords: [
        { word: 'الْجِنَّةِ', meaning: 'عالم الجن والشياطين الخفية', root: 'ج ن ن', explanation: 'الجِن سموا بذلك لاستتارهم وخفائهم عن أعين البشر.' }
      ]
    }
  ],

  // 108. Al-Kawthar
  108: [
    {
      text: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
      tafseer: 'إنا وهبناك يا محمد الخير العظيم الدائم، ومنه نهر الكوثر في الجنة.',
      difficultWords: [
        { word: 'الْكَوْثَرَ', meaning: 'الخير الكثير الواسع، وهو نهر عظيم في الجنة لأمة محمد ﷺ', root: 'ك ث ر', explanation: 'صيغة (فَوْعَل) للدلالة على الكثرة الفائقة والمطلقة في الخير.' }
      ]
    },
    {
      text: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
      tafseer: 'فأخلص لربك صلاتك كلها، واذبح أضحيتك لوجهه الكريم شكراً على نعمه.',
      difficultWords: [
        { word: 'وَانْحَرْ', meaning: 'اذبح الهدي والأضاحي خالصاً لوجه الله', root: 'ن ح ر', explanation: 'النحر في الإبل، والذبح في البقر والغنم، وجاء بالجمع بين الصلاة والنسك.' }
      ]
    },
    {
      text: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
      tafseer: 'إن مبغضك وعدوك يا محمد هو المنقطع من كل خير وذكر حسن ونسل مبارك.',
      difficultWords: [
        { word: 'شَانِئَكَ', meaning: 'مبغضك وعدوك وكاره ما جئت به', root: 'ش ن أ', explanation: 'الشنآن هو شدة البغض والكره.' },
        { word: 'الْأَبْتَرُ', meaning: 'المقطوع من كل خير وبركة، والمقطوع ذكره وأثره الطيب', root: 'ب ت ر', explanation: 'البتر هو القطع، وكان المشركون يزعمون أن النبي أبتر لا ولد له يحمل ذكره.' }
      ]
    }
  ],

  // 97. Al-Qadr
  97: [
    {
      text: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
      tafseer: 'إنا بدأنا إنزال القرآن الكريم جملة واحدة إلى بيت العزة في ليلة القدر المباركة من شهر رمضان.',
      difficultWords: [
        { word: 'الْقَدْرِ', meaning: 'الشرف والعظمة، أو ليلة تقدير المقادير والأرزاق والآجال', root: 'ق د ر', explanation: 'تجمع بين عِظم الشأن وتقدير أرزاق العباد وأحداث العام.' }
      ]
    },
    {
      text: 'وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ',
      tafseer: 'وما أعلمك يا محمد ما عِظَم وفضل ومكانة هذه الليلة الجليلة؟',
    },
    {
      text: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ',
      tafseer: 'العمل الصالح والعبادة في هذه الليلة الواحدة أفضل وأكثر ثواباً من عبادة ألف شهر ليس فيها ليلة قدر.',
    },
    {
      text: 'تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ',
      tafseer: 'تهبط الملائكة وجبريل عليه السلام إلى الأرض بالبركة والرحمة بأمر ربهم لكل أمر قضاه.',
      difficultWords: [
        { word: 'وَالرُّوحُ', meaning: 'جبريل عليه السلام أمين الوحي، وخُص بالذكر لعلو قدره', root: 'ر و ح', explanation: 'عطف الخاص على العام لبيان شرفه وفضله العظيم.' }
      ]
    },
    {
      text: 'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ',
      tafseer: 'ليلة أمان وسلام وخير وبركة من بدايتها عند غروب الشمس حتى طلوع الفجر.',
      difficultWords: [
        { word: 'مَطْلَعِ', meaning: 'وقت طلوع وضياء الفجر الصادق', root: 'ط ل ع', explanation: 'مطلع بفتح اللام أو كسرها، اسم زمان لطلوع الصبح.' }
      ]
    }
  ],

  // 67. Al-Mulk (First 5 verses)
  67: [
    {
      text: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
      tafseer: 'تعاظم وتكاثر خير الله وبركته، الذي بيده مقاليد السماوات والأرض وله القدرة المطلقة.',
      difficultWords: [
        { word: 'تَبَارَكَ', meaning: 'تعاظم وكثرت بركاته وخيراته وتنزه عن النقائص', root: 'ب ر ك', explanation: 'فعل خاص بالله تعالى لا يقال لغيره.' },
        { word: 'الْمُلْكُ', meaning: 'التصرف المطلق والسلطان التام على سائر المخلوقات', root: 'م ل ك', explanation: 'هو مالك الملكوت وخالقه ومدبره.' }
      ]
    },
    {
      text: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا وَهُوَ الْعَزِيزُ الْغَفُورُ',
      tafseer: 'خلق الحياة والموت ليختبركم: أيكم أخلص وأصوب عملاً لله، وهو القوي الغالب الغفور لذنوب التائبين.',
      difficultWords: [
        { word: 'لِيَبْلُوَكُمْ', meaning: 'ليختبركم ويمتحنكم في هذه الدنيا', root: 'ب ل و', explanation: 'الابتلاء هو الاختبار لإظهار المحسن من المسيء.' },
        { word: 'أَحْسَنُ عَمَلًا', meaning: 'أخلصه لوجه الله وأصوبه على هدي رسوله ﷺ', root: 'ح س ن', explanation: 'لا يُقبل العمل إلا بالشرطين: الإخلاص والمتابعة.' }
      ]
    },
    {
      text: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ',
      tafseer: 'خلق سبع سماوات بعضها فوق بعض بإتقان تام، لا ترى فيها أي نقص أو خلل أو شقوق.',
      difficultWords: [
        { word: 'طِبَاقًا', meaning: 'طبقة فوق أخرى متناسقة متطابقة', root: 'ط ب ق', explanation: 'سماء فوق سماء دون مساس أو سقوط.' },
        { word: 'تَفَاوُتٍ', meaning: 'خلل أو عدم تناسب أو اضطراب', root: 'ف و ت', explanation: 'التفاوت هو التنافر والاختلاف الدال على النقص.' },
        { word: 'فُطُورٍ', meaning: 'شقوق أو تصدعات أو فجوات', root: 'ف ط ر', explanation: 'الفطور جمع فطر، وهو الشق والانصداع.' }
      ]
    },
    {
      text: 'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ',
      tafseer: 'أعد النظر مراراً وتكراراً، سيرجع إليك بصرك ذليلاً عاجزاً عن رؤية أي عيب وهو مجهد كليل.',
      difficultWords: [
        { word: 'كَرَّتَيْنِ', meaning: 'مرة بعد أخرى، وكرات متكررة', root: 'ك ر ر', explanation: 'المراد التكرار والتدقيق الكثير وليس مجرد المرتين.' },
        { word: 'خَاسِئًا', meaning: 'صاغراً ذليلاً مبعداً لعجزه عن إيجاد عيب', root: 'خ س أ', explanation: 'الخاسئ هو المطرود الخائب.' },
        { word: 'حَسِيرٌ', meaning: 'كليل ومنقطع من شدة التعب والإعياء', root: 'ح س ر', explanation: 'الحسير هو المعيي الذي انقطعت قواه.' }
      ]
    },
    {
      text: 'وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ',
      tafseer: 'زينا السماء القريبة بالنجوم المضيئة كالسرج، وجعلنا شهبها ترجم مسترقي السمع من الشياطين، وهيأنا لهم ناراً تلظى.',
      difficultWords: [
        { word: 'بِمَصَابِيحَ', meaning: 'النجوم المضيئة المنيرة في كبد السماء', root: 'ص ب ح', explanation: 'المصباح هو السراج المضيء، وجُعلت زينة وهداية ورجوماً.' },
        { word: 'رُجُومًا', meaning: 'شهباً تُرجم وتُرمى بها الشياطين إذا حاولت استراق السمع', root: 'ر ج م', explanation: 'الرجم هو الرمي بالحجارة أو الشهب المهلكة.' },
        { word: 'السَّعِيرِ', meaning: 'النار الموقدة المتأججة شديدة الحرارة', root: 'س ع ر', explanation: 'سعرت النار إذا أوقدتها وأشعلتها بقوة.' }
      ]
    }
  ]
};

/**
 * Helper to construct audio URL for an Ayah with a specific reciter
 */
export function getAyahAudioUrl(surahNumber: number, ayahNumberInSurah: number, reciter: Reciter): string {
  const sNum = surahNumber.toString().padStart(3, '0');
  const aNum = ayahNumberInSurah.toString().padStart(3, '0');
  return `${reciter.serverUrl}/${sNum}${aNum}.mp3`;
}

/**
 * Fetch or get full Ayahs for a Surah with instant curated cache and dynamic fallback
 */
export async function getSurahWithAyahs(
  surahNumber: number,
  reciter: Reciter,
  riwayah: Riwayah = 'hafs'
): Promise<Surah> {
  const meta = SURAHS_LIST.find((s) => s.number === surahNumber) || SURAHS_LIST[0];

  // If curated data exists
  if (CURATED_SURAHS[surahNumber]) {
    const curated = CURATED_SURAHS[surahNumber];
    const ayahs = curated.map((item, idx) => {
      const ayahNum = idx + 1;
      const cleanText = stripBasmalahFromAyah(item.text, surahNumber, ayahNum);
      return {
        number: ayahNum,
        numberInSurah: ayahNum,
        text: cleanText,
        textWithoutTashkeel: removeTashkeel(cleanText),
        words: splitAyahIntoWords(cleanText, ayahNum),
        audioUrl: getAyahAudioUrl(surahNumber, ayahNum, reciter),
        juz: surahNumber >= 78 ? 30 : surahNumber >= 67 ? 29 : 1,
        page: 1,
        tafseer: item.tafseer,
        difficultWords: item.difficultWords || [],
      };
    });

    return {
      ...meta,
      ayahs,
    };
  }

  // Otherwise fetch from open Quran API
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.ayahs) {
        const ayahs = data.data.ayahs.map((a: any) => {
          const cleanText = stripBasmalahFromAyah(a.text, surahNumber, a.numberInSurah);
          return {
            number: a.number,
            numberInSurah: a.numberInSurah,
            text: cleanText,
            textWithoutTashkeel: removeTashkeel(cleanText),
            words: splitAyahIntoWords(cleanText, a.numberInSurah),
            audioUrl: getAyahAudioUrl(surahNumber, a.numberInSurah, reciter),
            juz: a.juz,
            page: a.page,
            tafseer: `الآية رقم ${a.numberInSurah} من سورة ${meta.name}`,
            difficultWords: [],
          };
        });

        return {
          ...meta,
          ayahs,
        };
      }
    }
  } catch (err) {
    console.warn(`Could not fetch dynamic surah ${surahNumber}, falling back to defaults`, err);
  }

  // Fallback generation for non-curated surahs if offline
  const fallbackAyahs = Array.from({ length: Math.min(meta.numberOfAyahs, 7) }, (_, idx) => {
    const aNum = idx + 1;
    // Only Surah 1 has Basmalah as Ayah 1
    const sampleText =
      surahNumber === 1 && aNum === 1
        ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
        : `آية كريمة رقم ${aNum} من سورة ${meta.name}`;
    return {
      number: aNum,
      numberInSurah: aNum,
      text: sampleText,
      textWithoutTashkeel: removeTashkeel(sampleText),
      words: splitAyahIntoWords(sampleText, aNum),
      audioUrl: getAyahAudioUrl(surahNumber, aNum, reciter),
      juz: 30,
      page: 604,
      tafseer: `تفسير الآية ${aNum} من سورة ${meta.name}`,
      difficultWords: [],
    };
  });

  return {
    ...meta,
    ayahs: fallbackAyahs,
  };
}
