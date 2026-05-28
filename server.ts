import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
} catch (error) {
  console.error("Failed to initialize Gemini Client:", error);
}

// Caching and Rate-Limiting Helpers to respect the 5 RPM Gemini API Quota
let lastNewsTime = 0;
let cachedNews: any = null;

let lastAuditParams = "";
let lastAuditTime = 0;
let cachedAudit: any = null;

// Ensure lazy client retrieval in route handlers to avoid crashes
function getAiClient(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in the environment secrets.");
    }
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

// 1. API: Simulating Price Action news from Gemini
app.post("/api/gemini/market-news", async (req, res) => {
  try {
    const { coinName, coinSymbol, consensus, price, marketCap, trend } = req.body;

    // Strict validation
    if (!coinName || !coinSymbol) {
      return res.status(400).json({ error: "Missing coin configurations." });
    }

    // Rate-Limiting / Cooldown Cache: If mined within last 12 seconds, serve cached articles instantly
    const now = Date.now();
    if (cachedNews && (now - lastNewsTime < 12000)) {
      // Add a property to mark it was served from cache
      return res.json(cachedNews.map((news: any) => ({ ...news, isCached: true, isFallback: cachedNews[0]?.isFallback || false })));
    }

    try {
      const client = getAiClient();
      const prompt = `أنت خبير اقتصادي ومحلل أسواق عملات رقمية (Cryptocurrency Market Expert). 
قم بإنشاء 3 عواوين أخبار عاجلة ومحاكاة مضحكة أو مثيرة للاهتمام وتأثيرها على العملة الرقمية الجديدة المسماة "${coinName}" ورمزها "${coinSymbol}" والتي تعمل بآلية "${consensus}".
السعر الحالي للعملة هو $${price} والقيمة السوقية هي $${marketCap}. الاتجاه العام للعملة حالياً هو "${trend}".
يجب أن ترتكز الأخبار على هذه التفاصيل وتكون مكتوبة باللغة العربية بأسلوب احترافي ومشابه لمواقع مثل CoinDesk أو Cointelegraph.

قم بإرجاع النتيجة كـ JSON دقيق جداً بالشكل التالي:
[
  {
    "title": "عنوان الخبر هنا",
    "content": "تفاصيل الخبر كاملة وتحليله هنا بأسلوب شيق وجذاب.",
    "impact": "إيجابي جداً" أو "إيجابي" أو "حيادي" أو "سلبي" أو "سلبي جداً",
    "priceChangeForecast": "تغيير مئوي متوقع مثل +12%" أو "-5%"
  }
]
`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                impact: { type: Type.STRING },
                priceChangeForecast: { type: Type.STRING }
              },
              required: ["title", "content", "impact", "priceChangeForecast"]
            }
          }
        }
      });

      const responseText = response.text || "[]";
      const parsedNews = JSON.parse(responseText.trim());
      const newsWithMeta = parsedNews.map((news: any) => ({ ...news, isFallback: false }));
      
      // Update news cache
      cachedNews = newsWithMeta;
      lastNewsTime = Date.now();

      return res.json(newsWithMeta);
    } catch (apiError: any) {
      // Log as a warning since this is a fully-expected free-tier rate-limit/overload state handled elegantly
      console.warn("Informative: Gemini API is throttling or unavailable, served gorgeous local simulation news:", apiError.message || apiError);
      
      // Fallback response with beautiful mock content in Arabic
      const mockNews = [
        {
          title: `انفجار شعبية عملة ${coinName} (${coinSymbol}) مع تزايد عمليات التعدين`,
          content: `شهدت عملة ${coinName} إقبالاً كبيراً من المعدنين والمستثمرين بعد إطلاق آلية التشغيل ${consensus}. يرى المحللون أن هذا الإنجاز التقني قد يدفع بالعملة لمستويات قياسية جديدة مع اتجاه السوق الـ ${trend}.`,
          impact: trend === "صاعد" ? "إيجابي جداً" : "حيادي",
          priceChangeForecast: trend === "صاعد" ? "+18.4%" : "+2.1%"
        },
        {
          title: `الحيتان الرقميون يبدأون في تجميع ${coinSymbol} بكميات ضخمة`,
          content: `كشفت بيانات البلوكشين المرصودة عن قيام محافظ ضخمة بشراء كميات وفيرة من عملة ${coinName} في محاولة للاستحواذ على المعروض قبل حدوث طفرة سعرية جديدة مدفوعة بالطلب المتزايد.`,
          impact: "إيجابي",
          priceChangeForecast: "+8.9%"
        },
        {
          title: `تحديات تنظيمية ومخاوف ترتبط بآلية ${consensus}`,
          content: `نشر خبراء أمنيون دراسة تفيد بوجود حاجة لتحسين كفاءة الطاقة والأمان الخاص بآلية ${consensus} لعملة ${coinSymbol}. ورغم ذلك، يبدو مجتمع العملة متفائلاً بتطوير ترقيات قريبة لمعالجة هذه النقاط.`,
          impact: "سلبي",
          priceChangeForecast: "-4.2%"
        }
      ];

      const fallbackNewsWithMeta = mockNews.map((news) => ({ ...news, isFallback: true }));
      // Save to cache as well so we don't spam failed connections
      cachedNews = fallbackNewsWithMeta;
      lastNewsTime = Date.now();

      return res.json(fallbackNewsWithMeta);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. API: Structural Audit and improve advisories
app.post("/api/gemini/coin-audit", async (req, res) => {
  try {
    const { coinName, coinSymbol, consensus, supply, blockReward, difficulty, description } = req.body;

    const paramKey = `${coinName}-${coinSymbol}-${consensus}-${supply}-${blockReward}-${difficulty}`;
    const now = Date.now();
    if (cachedAudit && paramKey === lastAuditParams && (now - lastAuditTime < 60000)) {
      // Serve cached audit report instantly to prevent 429 rate limit triggers
      return res.json({ ...cachedAudit, isCached: true });
    }

    try {
      const client = getAiClient();
      const prompt = `بصفتك مدقق ومستشار اقتصاد رموز (Tokenomics & Smart Contract Auditor).
قم بإجراء تحليل وتقييم لعملة رقمية جديدة بالمواصفات التالية:
الاسم: ${coinName} (${coinSymbol})
آلية الإجماع: ${consensus}
إجمالي المعروض: ${supply}
مكافأة الكتلة: ${blockReward}
الصعوبة البدئية: ${difficulty}
الوصف والأهداف: ${description || "عملة عامة للتداول والخدمات العامة"}

اكتب التقييم بلغة عربية سلسلة وحكيمة وجذابة.
يرجى توفير:
1. تقييم للاقتصاد الرمزي واستقرار العملة (Inflation rate vs Deflation).
2. نصائح لتحسين مكافآت التعدين وتصميم المعروض لتفادي التضخم.
3. تقييم مخاطر الأمان المرتبطة بآلية ${consensus}.
4. نسبة تقييم نهائية مئوية لنجاح المشروع في المستقبل (Score).

قم بالرد بصيغة JSON كالتالي:
{
  "tokenomicsRating": "جيد جداً" أو "ممتاز" أو "متوسط" أو "يحتاج لتعديل",
  "inflationReview": "تحليل موجز وصريح للتضخم هنا",
  "securityAudit": "تحليل أمني وصريح لآلية التعدين/الإجماع وبدائل مقترحة لأمن الشبكة",
  "advisoryTips": ["نصيحة 1 مجدية وذكية للغاية", "نصيحة 2", "نصيحة 3"],
  "score": 85
}
`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tokenomicsRating: { type: Type.STRING },
              inflationReview: { type: Type.STRING },
              securityAudit: { type: Type.STRING },
              advisoryTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              score: { type: Type.INTEGER }
            },
            required: ["tokenomicsRating", "inflationReview", "securityAudit", "advisoryTips", "score"]
          }
        }
      });

      const parsedAudit = JSON.parse((response.text || "{}").trim());
      const auditWithMeta = { ...parsedAudit, isFallback: false };

      cachedAudit = auditWithMeta;
      lastAuditParams = paramKey;
      lastAuditTime = Date.now();

      return res.json(auditWithMeta);
    } catch (apiError: any) {
      // Log as a warning since this is a fully-expected free-tier rate-limit/overload state handled elegantly
      console.warn("Informative: Gemini API inside coin-audit is throttling or unavailable, served gorgeous local simulation report:", apiError.message || apiError);
      
      const score = Math.floor(Math.random() * 20) + 75; // 75 to 95
      const mockAudit = {
        tokenomicsRating: "ممتاز تلقائي التفصيل",
        inflationReview: `نظراً لأن إجمالي المعروض هو ${supply} ومكافأة الكتلة هي ${blockReward}، فإن العملة تمتلك توازناً ذاتياً جيداً. المعروض كافٍ لمنع التضخم الحاد ويشجع على التداول النشط على الشبكة.`,
        securityAudit: `آلية الإجماع ${consensus} توفر درجة حماية لائقة ومثبتة. ومع ذلك، هناك حاجة إلى الحفاظ على تشتت المعدنين/المدققين لمنع هجمات 51% (Sybil attack) لاحقاً عند زيادة القيمة السوقية.`,
        advisoryTips: [
          `يُفضل وضع خطة للنصف (Halving mechanism) كل عدد معين من الكتل لمنع المعروض من تجاوز الحدود الكلية فجأة.`,
          `إنشاء صندوق حوكمة (Governance pool) لتمويل الترقيات التقنية بدلاً من الاعتماد الكلي على رسوم المعاملات فقط.`,
          `ربط العملة بخدمات ملموسة مثل العقود الذكية لرفع المنفعة الحقيقية مما يحمي سعرها من المضاربات البحتة.`
        ],
        score: score,
        isFallback: true
      };

      cachedAudit = mockAudit;
      lastAuditParams = paramKey;
      lastAuditTime = Date.now();

      return res.json(mockAudit);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Setup Vite Dev Server / Public static path resolution
async function startApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on port ${PORT}`);
  });
}

startApp().catch((err) => {
  console.error("Express startup failed:", err);
});
