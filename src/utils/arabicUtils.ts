// Arabic text normalization, diacritics removal, and speech matching algorithms

export const TASHKEEL_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g;

/**
 * Strips Basmalah from the beginning of Ayah text if present.
 * In the Holy Quran, ONLY Surah 1 (Al-Fatiha) has the Basmalah as its first verse (Ayah 1).
 * In all other Surahs (2 through 114), the Basmalah is an introductory opening header,
 * NOT part of Ayah 1. External Quran APIs often prepend the Basmalah to Ayah 1 of all Surahs.
 */
export function stripBasmalahFromAyah(text: string, surahNumber: number, ayahNumberInSurah: number): string {
  if (!text) return '';
  // Surah 1 (Al-Fatiha) verse 1 IS the Basmalah, do not strip
  if (surahNumber === 1 || ayahNumberInSurah !== 1) {
    return text.trim();
  }

  // Regex matching all forms of Basmalah (Uthmani, Simple, Imla'i, with/without vowels and diacritics)
  const basmalahPrefixRegex = /^[\s\uFEFF]*(?:بِ?سْ?مِ?|بِسۡمِ|بِسْمِ|باسم)\s*(?:ٱللَّ?هِ|اللَّ?هِ|اللهِ|اللّٰهِ|ٱللَّٰهِ|اللَّهِ|الله)\s*(?:ٱلرَّ?حۡ?مَ?ـٰ?نِ?|الرَّ?حْمَٰ?نِ?|الرَّحْمٰنِ|الرحمن|الرَّحْمَنِ)\s*(?:ٱلرَّ?حِ?ی?مِ?|الرَّ?حِ?ي?مِ?|الرحيم|الرَّحِيمِ)[\s\n]*/u;

  const trimmed = text.trim();
  if (basmalahPrefixRegex.test(trimmed)) {
    const stripped = trimmed.replace(basmalahPrefixRegex, '').trim();
    if (stripped.length > 0) {
      return stripped;
    }
  }

  return trimmed;
}

/**
 * Remove all diacritical marks (Tashkeel) from Arabic text
 */
export function removeTashkeel(text: string): string {
  if (!text) return '';
  return text.replace(TASHKEEL_REGEX, '').trim();
}

/**
 * Normalize Arabic letters to a uniform format for speech recognition comparison
 */
export function normalizeArabic(text: string): string {
  if (!text) return '';
  let cleaned = removeTashkeel(text);
  
  // Normalize Alefs
  cleaned = cleaned.replace(/[أإآٱ]/g, 'ا');
  // Normalize Taa Marbuta
  cleaned = cleaned.replace(/ة/g, 'ه');
  // Normalize Yaa / Alef Maksura
  cleaned = cleaned.replace(/ى/g, 'ي');
  // Normalize Hamzas
  cleaned = cleaned.replace(/ؤ/g, 'و');
  cleaned = cleaned.replace(/ئ/g, 'ي');
  cleaned = cleaned.replace(/ء/g, '');
  
  // Remove punctuation and Quranic symbols (ayah marks, sajda, etc)
  cleaned = cleaned.replace(/[.,/#!$%^&*;:{}=\-_`~()؟،؛«»"۝۞۩]/g, '');
  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

/**
 * Split Ayah text into words while keeping tashkeel and creating word objects
 */
export function splitAyahIntoWords(ayahText: string, ayahNumber: number) {
  // Split on whitespace
  const rawWords = ayahText.trim().split(/\s+/);
  return rawWords.map((wordWithTashkeel, index) => {
    const cleanWord = removeTashkeel(wordWithTashkeel);
    return {
      id: `${ayahNumber}-${index}`,
      text: wordWithTashkeel,
      textWithoutTashkeel: cleanWord,
      normalized: normalizeArabic(cleanWord),
    };
  });
}

/**
 * Levenshtein distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  
  const matrix: number[][] = [];
  for (let i = 0; i <= bn; ++i) matrix[i] = [i];
  for (let i = 0; i <= an; ++i) matrix[0][i] = i;

  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1) // insertion, deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

/**
 * Similarity ratio between two Arabic words (0.0 to 1.0)
 */
export function calculateWordSimilarity(word1: string, word2: string): number {
  const norm1 = normalizeArabic(word1);
  const norm2 = normalizeArabic(word2);
  if (norm1 === norm2) return 1.0;
  if (!norm1 || !norm2) return 0.0;

  const maxLen = Math.max(norm1.length, norm2.length);
  const dist = levenshteinDistance(norm1, norm2);
  return Math.max(0, (maxLen - dist) / maxLen);
}

/**
 * Format Arabic Numbers (١، ٢، ٣...)
 */
export function toArabicNumerals(num: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (d) => arabicDigits[parseInt(d, 10)]).replace(/\./g, '٫');
}
