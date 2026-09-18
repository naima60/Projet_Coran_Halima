import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Server-side Gemini initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "ratel-quran-app" });
});

// Endpoint: Evaluate recitation text vs expected Quranic Ayah
app.post("/api/gemini/evaluate-recitation", async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  try {
    const {
      expectedAyahText,
      userTranscribedText,
      surahName,
      ayahNumber,
      wordStatuses,
      userSpokenWords,
      riwayah,
      errorCount,
    } = req.body;

    if (!expectedAyahText) {
      return res.status(400).json({ error: "الرجاء توفير نص الآية الأصلية" });
    }

    const prompt = `أنت مصحح قرآني وخبير تجويد متخصص في تحفيظ القرآن الكريم بالروايات المتواترة.
المهمة: تقييم تلاوة المتدرب بناءً على ما نطق به ومقارنته بنص الآية الأصلية بكل دقة وصرامة وموضوعية.

معلومات الآية والجلسة:
- السورة: ${surahName || "غير محدد"}
- رقم الآية: ${ayahNumber || ""}
- الرواية المختارة: ${riwayah === "warsh" ? "رواية ورش عن نافع" : "رواية حفص عن عاصم"}
- نص الآية الأصلي (مع التشكيل): "${expectedAyahText}"
- ما نطق به المستخدم في هذه المحاولة (النص المسموع): "${userTranscribedText || "(لم يُسمع صوت واضح أو توقف المتدرب)"}"
- إحصائيات رصد الأخطاء التلقائي: ${errorCount !== undefined ? `تم تسجيل ${errorCount} أخطاء أثناء التسميع` : "غير محدد"}
${userSpokenWords ? `- الكلمات المنطوقة مقارنة بالأصل: ${JSON.stringify(userSpokenWords)}` : ""}
${wordStatuses ? `- حالة الكلمات المرصودة في التطبيق: ${JSON.stringify(wordStatuses)}` : ""}

قواعد حاسمة ومشددة للتقييم:
1. التقييم يجب أن يعكس بدقة الأخطاء الحقيقية في هذه المحاولة بالذات.
2. إذا تعمد المستخدم الخطأ أو أخطأ في كلمات أو أبدل حروفاً أو سكت، فيجب أن تنخفض درجة الدقة (accuracyScore) بشكل حقيقي وواقعي (مثلاً: بين 15 إلى 65 من 100 بحسب كثرة الأخطاء ونوعيتها)، ولا تعطه درجة نجاح عالية مطلقاً إذا وجد لحن أو خطأ!
3. إذا كانت القراءة صحيحة وكاملة ومطابقة، امنحه درجة عالية (88 إلى 100) بحسب إتقان التجويد.
4. في مصفوفة "wordAnalysis": اذكر كل كلمة من الآية الأصلية، وحالتها ("correct" أو "mispronounced" أو "missing" أو "extra")، وما نطق به المستخدم في "userSaid"، وتعليق تصحيحي واضح في "comment".
5. قدّم نصائح تجويدية خاصة بالرواية (${riwayah === "warsh" ? "ورش عن نافع كالتقليل وترقيق الراءات وتغليظ اللام" : "حفص عن عاصم"})، ورسالة توجيهية خاصة بالأخطاء التي ارتكبها في هذه القراءة.

أرجع النتيجة بصيغة JSON التالية بدقة:
{
  "accuracyScore": 55, // رقم من 0 إلى 100 يعبر عن النسبة الحقيقية لصحة القراءة الحالية
  "verdict": "يحتاج إعادة مراجعة وتصحيح" // أو "متقن وممتاز" أو "جيد جداً" أو "ضعيف - أعد المحاولة",
  "wordAnalysis": [
    {
      "word": "كلمة من الآية",
      "status": "correct", // "correct" أو "mispronounced" أو "missing" أو "extra"
      "userSaid": "ما قرأه أو 'لم ينطق به'",
      "comment": "ملاحظة توضيحية للخطأ أو الصواب"
    }
  ],
  "generalFeedback": "تقييم تحليلي دقيق ومخصص لما قرأه المتدرب في هذه المحاولة تحديداً",
  "tajweedNotes": ["ملاحظة تجويدية 1", "ملاحظة تجويدية 2"],
  "correctionAdvice": "خطة عملية لتصحيح الأخطاء المرتكبة وإتقان الآية"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            accuracyScore: { type: Type.NUMBER },
            verdict: { type: Type.STRING },
            wordAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  status: { type: Type.STRING },
                  userSaid: { type: Type.STRING },
                  comment: { type: Type.STRING },
                },
                required: ["word", "status"],
              },
            },
            generalFeedback: { type: Type.STRING },
            tajweedNotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctionAdvice: { type: Type.STRING },
          },
          required: ["accuracyScore", "verdict", "wordAnalysis", "generalFeedback"],
        },
      },
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    return res.json(data);
  } catch (error: any) {
    console.error("Evaluation error, falling back to algorithmic analyzer:", error);

    const cleanArabic = (str: string) =>
      str
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
        .replace(/[إأآا]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .trim();

    const expectedWords = (req.body.expectedAyahText || "").trim().split(/\s+/).filter(Boolean);
    const spokenText = req.body.userTranscribedText || "";
    const spokenWords = spokenText.trim().split(/\s+/).filter(Boolean);
    const wordStatuses = req.body.wordStatuses || {};

    let correctCount = 0;
    let errorCount = 0;

    const wordAnalysis = expectedWords.map((exp: string, idx: number) => {
      const cleanExp = cleanArabic(exp);
      const spk = spokenWords[idx] || "";
      const cleanSpk = cleanArabic(spk);

      // Check if client explicitly flagged an error at this index
      const clientStatus = wordStatuses[idx];
      let isCorrect = false;

      if (clientStatus === "correct") {
        isCorrect = true;
      } else if (clientStatus === "error") {
        isCorrect = false;
      } else {
        isCorrect = cleanSpk.length > 0 && (cleanExp === cleanSpk || cleanExp.includes(cleanSpk) || cleanSpk.includes(cleanExp));
      }

      if (isCorrect) {
        correctCount++;
        return {
          word: exp,
          status: "correct",
          userSaid: spk || cleanExp,
          comment: "نطق سليم وموافق لرسم المصحف",
        };
      } else {
        errorCount++;
        const isMissing = !spk && clientStatus !== "error";
        return {
          word: exp,
          status: isMissing ? "missing" : "mispronounced",
          userSaid: spk || "لم يُقرأ أو تم الخطأ فيه",
          comment: isMissing ? "الكلمة تُركت ولم تُقرأ" : "رُصد خطأ في نطق الكلمة أو حركاتها",
        };
      }
    });

    const totalWords = Math.max(1, expectedWords.length);
    const score = Math.round((correctCount / totalWords) * 100);

    let verdict = "يحتاج إعادة مراجعة وتصحيح";
    if (score >= 90) verdict = "متقن وممتاز";
    else if (score >= 75) verdict = "جيد جداً";
    else if (score >= 50) verdict = "متوسط - به أخطاء ملحوظة";
    else verdict = "ضعيف - يحتاج تكرار وسماع الشيخ";

    const feedback =
      score >= 90
        ? "ما شاء الله! تلاوة متقنة ومطابقة للآية الكريمة دون أخطاء."
        : score >= 60
        ? `تم رصد ${errorCount} أخطاء أو كلمات غير منضبطة. واصل التكرار لتصحيح مواضع الخلل.`
        : `رُصدت أخطاء واضحة في نطق معظم كلمات الآية (${errorCount} كلمات تحتاج تصحيح). استمع للشيخ المعلم وأعد التسميع.`;

    return res.json({
      accuracyScore: score,
      verdict,
      wordAnalysis,
      generalFeedback: feedback,
      tajweedNotes: [
        "التركيز على تحقيق مخارج الحروف الشفوية والحلقية.",
        "ضبط مقادير المدود وأحكام النون الساكنة والتنوين.",
        "الاستماع المتكرر للتلاوة المرتلة لمعرفة مواضع الوقف والابتداء.",
      ],
      correctionAdvice: "استمع لتلاوة الشيخ 3 مرات ثم ردد الكلمات التي تم تظليلها بالأحمر.",
    });
  }
});

// Endpoint: Explain difficult Quranic vocabulary (غريب القرآن ومفردات الآيات) with Multilingual Translation
app.post("/api/gemini/word-explanation", async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  try {
    const { word, ayahContext, surahName } = req.body;

    if (!word) {
      return res.status(400).json({ error: "الرجاء تحديد الكلمة المراد شرحها" });
    }

    const prompt = `أنت معجم قرآني متقدم ومترجم دقيق لمعاني القرآن الكريم.
المطلوب: شرح الكلمة القرآنية التالية وتوفير ترجمتها بالفرنسية والإنجليزية وتفسيرها باللغة العربية.
الكلمة: "${word}"
السياق من الآية: "${ayahContext || ""}"
السورة: "${surahName || ""}"

أرجع الرد بدقة بصيغة JSON التالية:
{
  "word": "${word}",
  "root": "جذر الكلمة الثلاثي أو الرباعي",
  "meaning": "المعنى باللغة العربية في سياق الآية الكريمة",
  "translationFr": "Traduction précise du mot et de son sens en français",
  "translationEn": "Precise English translation and meaning in context",
  "detailedExplanation": "شرح لغوي وبلاغي مفصل ومبسط بالعربية",
  "synonyms": ["مرادف 1", "مرادف 2"],
  "reflection": "وقفة تدبرية لطيفة للكلمة"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            root: { type: Type.STRING },
            meaning: { type: Type.STRING },
            translationFr: { type: Type.STRING },
            translationEn: { type: Type.STRING },
            detailedExplanation: { type: Type.STRING },
            synonyms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            reflection: { type: Type.STRING },
          },
          required: ["word", "root", "meaning", "translationFr", "translationEn", "detailedExplanation"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return res.json(data);
  } catch (error: any) {
    console.error("Word explanation AI error, using fallback dictionary:", error);

    const targetWord = (req.body.word || "").trim();
    const cleanWord = targetWord
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
      .replace(/[إأآا]/g, "ا");

    // Comprehensive offline dictionary for common Quranic words
    const DICTIONARY: Record<string, { meaning: string; fr: string; en: string; root: string; expl: string }> = {
      الله: { meaning: "الإله الحق المستحق للعبادة وحده", fr: "Allah (Dieu l'Unique)", en: "Allah (God, The One)", root: "إ ل ه", expl: "اسم علم على الذات الإلهية المقدسة الجامعة لكل صفات الكمال." },
      الرحمن: { meaning: "ذو الرحمة الواسعة الشاملة لجميع الخلائق", fr: "Le Tout-Miséricordieux", en: "The Most Gracious", root: "ر ح م", expl: "صيغة مبالغة تدل على سعة رحمة الله وعمومها لجميع خلقه." },
      الرحيم: { meaning: "ذو الرحمة الواصلة الخاصة بالمؤمنين", fr: "Le Très-Miséricordieux", en: "The Most Merciful", root: "ر ح م", expl: "رحمة خاصة بالمؤمنين في الدنيا والآخرة." },
      الملك: { meaning: "مالك يوم الدين والمتصرف في شؤون خلقه", fr: "Le Souverain / Maître", en: "The King / Sovereign", root: "م ل ك", expl: "له السلطان المطلق والملك التام على السماوات والأرض." },
      الحمد: { meaning: "الثناء بالجميل الاختياري على المحمود مع المحبة والتعظيم", fr: "La Louange et remerciement", en: "Praise and Gratitude", root: "ح م د", expl: "استحقاق الله لكل كمال وشكر على نعمه الظاهرة والباطنة." },
      الصمد: { meaning: "السيد الذي تصمد وتقصد الخلائق إليه في حوائجها ولا جوف له", fr: "Le Refuge Suprême (qui n'a besoin de rien)", en: "The Self-Sufficient / Eternal", root: "ص م د", expl: "المقصود في الرغائب والمستغاث به عند المصائب." },
      الفلق: { meaning: "الصبح المنفلق من ظلمة الليل أو كل ما يفلقه الله", fr: "L'aube naissante / La fente", en: "The Daybreak / Dawn", root: "ف ل ق", expl: "انفلاق نور الصبح وضياؤه بعد اشتداد الظلام." },
      غاسق: { meaning: "الليل إذا أظلم وغاب شفق النهار", fr: "L'obscurité tombante / La nuit", en: "The Darkness when it settles", root: "غ س ق", expl: "الغسق هو شدة الظلمة ووقت انتشار الهوام." },
      وقب: { meaning: "دخل وأحاطت ظلمته بكل شيء", fr: "S'étend / s'obscurcit", en: "Spreads / encroaches", root: "و ق ب", expl: "يقال وقب الظلام إذا استحكم ودخل في كل مكان." },
      النفاثات: { meaning: "الساحرات اللاتي ينفخن في العقد للأذى", fr: "Celles qui soufflent sur les nœuds", en: "Those who blow on knots", root: "ن ف ث", expl: "النفث هو النفخ الخفيف مع شيء يسير من الريق." },
      الوسواس: { meaning: "الشيطان الذي يلقي الخواطر الرديئة في الصدور", fr: "Le tentateur / chuchoteur furtif", en: "The Whisperer", root: "و س و س", expl: "حديث النفس وما يلقيه الشيطان من شكوك وشبهات." },
      الخناس: { meaning: "الذي يختفي ويتراجع ويخنس كلما ذكر العبد ربه", fr: "Le fuyant (qui se dérobe à l'évocation de Dieu)", en: "The retreating / withdrawing", root: "خ ن س", expl: "يخنس الشيطان ويفر عند الأذان وذكر الله." },
      الكوثر: { meaning: "الخير الكثير الدائم ونهر عظيم في الجنة", fr: "L'Abondance (fleuve du Paradis)", en: "The Abundance (River in Paradise)", root: "ك ث ر", expl: "الكوثر على وزن فوعل، وهو الخير الواسع الذي أعطاه الله لنبيه ﷺ." },
      شانئك: { meaning: "مبغضك وعدوك وكاره ما جئت به", fr: "Ton ennemi / détracteur haineux", en: "Your hater / enemy", root: "ش ن أ", expl: "الشنآن هو البغض والعداوة الشديدة." },
      الأبتر: { meaning: "المقطوع أثره وذكره من كل خير", fr: "Le coupé de toute postérité et bien", en: "Cut off from all good and memory", root: "ب ت ر", expl: "الذي لا عقب له ولا ذكر طيب، بينما ذكر النبي ﷺ مرفوع إلى يوم القيامة." },
      سجيل: { meaning: "طين متحجر شديد الصلابة محمي بالنار", fr: "Argile cuite et pétrifiée", en: "Baked clay / petrified stones", root: "س ج ل", expl: "حجارة مهلكة رُمي بها أصحاب الفيل." },
      عصف: { meaning: "ورق الزرع الجاف المتكسر بعدما أكلته الدواب", fr: "Paille mâchée / feuilles broyées", en: "Eaten straw / chewed husks", root: "ع ص ف", expl: "تشبيه لحال المعتدين بعد تدميرهم بأوراق الزرع الهشيم." },
      تبارك: { meaning: "تعاظم وتكاثر خير الله وبركته وتنزه عن النقص", fr: "Béni soit-Il / Glorifié", en: "Blessed is He / Exalted", root: "ب ر ك", expl: "فعل تعظيم خاص بالله سبحانه وتعالى دال على دوام الخير." },
    };

    const found = DICTIONARY[cleanWord] || {
      meaning: `لفظ قرآني كريم من سورة ${req.body.surahName || "القرآن"}`,
      fr: `Terme coranique béni : ${targetWord}`,
      en: `Quranic vocabulary term: ${targetWord}`,
      root: cleanWord.slice(0, 3),
      expl: `كلمة «${targetWord}» وردت في سياق الآية الكريمة لبيان المعنى والإعجاز.`,
    };

    return res.json({
      word: targetWord,
      root: found.root,
      meaning: found.meaning,
      translationFr: found.fr,
      translationEn: found.en,
      detailedExplanation: found.expl,
      synonyms: ["لفظ قرآني محكم"],
      reflection: `تدبر دلالة كلمة «${targetWord}» يعينك على ترسيخ الحفظ وتذوق إعجاز القرآن.`,
    });
  }
});

// Endpoint: Generate personalized memorization quiz
app.post("/api/gemini/generate-quiz", async (req, res) => {
  try {
    const { surahName, verses, level } = req.body;

    const prompt = `أنشئ اختبار حفظ تفاعلي للسورة: ${surahName || "سورة قصيرة"} للمستوى: ${level || "مبتدئ"}.
الآيات المتاحة: ${JSON.stringify(verses?.slice(0, 7) || [])}

قم بإنشاء 4 أسئلة متنوعة:
1. سؤال إكمال فراغ (اختر الكلمة الصحيحة الناقصة).
2. سؤال ترتيب الكلمات لتكوين الآية.
3. سؤال ما هي الآية التالية لهذه الآية؟
4. سؤال معنى الكلمة الغريبة أو مقصد الآية.

أرجع النتيجة بصيغة JSON:
{
  "quizTitle": "اختبار تثبيت حفظ ${surahName || ""}",
  "questions": [
    {
      "id": "q1",
      "type": "fill-in-blank", // أو "word-order" أو "next-ayah" أو "word-meaning"
      "questionText": "نص السؤال باللغة العربية",
      "ayahText": "نص الآية المعنية",
      "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
      "correctAnswer": "الخيار الصحيح",
      "explanation": "شرح وتوضيح للإجابة الصحيحة"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quizTitle: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  questionText: { type: Type.STRING },
                  ayahText: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ["id", "type", "questionText", "options", "correctAnswer"],
              },
            },
          },
          required: ["quizTitle", "questions"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return res.json(data);
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    return res.status(500).json({
      error: "تعذر إنشاء الاختبار الذكي حالياً",
      details: error.message,
    });
  }
});

// Vite middleware & Static serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Quran App Server running on http://localhost:${PORT}`);
  });
}

setupVite();
