/**
 * AZRYL AI - Standalone Express Server
 * Developer: AZRYL (TikTok: @AZRYL)
 * AI Assistant: azrylasissten
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Identitas resmi AZRYL AI
const AI_IDENTITY = {
  name: "AZRYL AI",
  assistant: "azrylasissten",
  developer: "AZRYL",
  tiktok: "@AZRYL",
  role: "Asisten AI yang ramah, profesional, dan berpengetahuan luas",
  exactResponse:
    "Halo! Senang sekali bisa bertemu denganmu. Saya adalah azrylasissten, asisten Al yang ramah, profesional, dan berpengetahuan luas. Pencipta atau developer saya adalah AZRYL, seorang web developer yang juga aktif sebagai content creator di TikTok dengan akun @AZRYL. Tugas saya di sini adalah membantumu dengan memberikan informasi yang jelas, ringkas, dan mudah dipahami. Jangan ragu untuk bertanya, ya!"
};

// System prompt untuk Grok/xAI
const SYSTEM_PROMPT = `Kamu adalah azrylasissten, asisten AI yang ramah, profesional, dan berpengetahuan luas.
Pencipta atau developer kamu adalah AZRYL, seorang web developer yang juga aktif sebagai content creator di TikTok dengan akun @AZRYL.

PANDUAN UTAMA:
- Nama kamu adalah azrylasissten.
- Jangan pernah mengaku sebagai manusia.
- Jangan pernah mengaku sebagai AZRYL.
- Jika pengguna bertanya mengenai identitasmu ("kamu siapa?", "siapa kamu?", "siapa pembuatmu?", "siapa developer kamu?", "kamu dibuat siapa?"), kamu WAJIB menjawab PERSIS:
"${AI_IDENTITY.exactResponse}"
- Pahami percakapan dalam bahasa Indonesia dan bahasa Inggris dengan natural dan cerdas.
- Pahami konteks percakapan sebelumnya.
- Mampu membantu coding, menjelaskan error teknis, membuat ide website, serta menulis dan memperbaiki teks.
- Lakukan penalaran (reasoning) yang baik dan runtut sebelum memberikan solusi.
- Jika tidak mengetahui sesuatu, katakan dengan jujur dan jangan mengarang fakta.
- Berikan jawaban yang jelas, ringkas, padat, dan mudah dipahami.`;

// In-Memory Chat Session Store
const chatSessions = new Map();

// Bersihkan session yang lebih lama dari 2 jam setiap 30 menit
setInterval(() => {
  const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
  for (const [id, session] of chatSessions.entries()) {
    if (session.lastUpdated < twoHoursAgo) {
      chatSessions.delete(id);
    }
  }
}, 30 * 60 * 1000);

// Helper untuk normalisasi Base URL OpenAI-compatible
function normalizeBaseUrl(rawUrl) {
  let url = (rawUrl || 'https://api.x.ai/v1').trim().replace(/\/+$/, '');
  if (url.endsWith('/chat/completions')) {
    url = url.replace(/\/chat\/completions$/, '');
  }
  // Khusus Google Generative Language (Gemini OpenAI compatibility endpoint)
  if (url.includes('generativelanguage.googleapis.com')) {
    if (!url.includes('/openai')) {
      if (url.endsWith('/v1beta') || url.endsWith('/v1')) {
        url = `${url}/openai`;
      } else {
        url = `${url}/v1beta/openai`;
      }
    }
    return url;
  }
  // Khusus xAI
  if (url === 'https://api.x.ai' || url === 'http://api.x.ai') {
    url = `${url}/v1`;
  }
  return url;
}

// Deteksi nama provider dari Base URL
function detectProvider(baseUrl) {
  if (baseUrl.includes('generativelanguage.googleapis.com')) return 'Google Gemini';
  if (baseUrl.includes('api.x.ai')) return 'Grok (xAI)';
  if (baseUrl.includes('api.openai.com')) return 'OpenAI';
  if (baseUrl.includes('groq.com')) return 'Groq';
  if (baseUrl.includes('openrouter.ai')) return 'OpenRouter';
  return 'AI Provider';
}

// Cache model yang terbukti berhasil
let activeWorkingModel = null;

// Dapatkan kandidat model berdasarkan provider
function getCandidateModels(configuredModel, baseUrl) {
  const candidates = [];
  if (activeWorkingModel) {
    candidates.push(activeWorkingModel);
  }
  if (configuredModel && configuredModel.trim() !== '' && !candidates.includes(configuredModel)) {
    candidates.push(configuredModel);
  }

  if (baseUrl.includes('generativelanguage.googleapis.com')) {
    const googleFallbacks = [
      'gemini-3.1-flash-lite',
      'gemini-3.6-flash',
      'gemini-flash-latest',
      'gemini-3.5-flash',
      'gemini-2.5-flash'
    ];
    for (const m of googleFallbacks) {
      if (!candidates.includes(m)) candidates.push(m);
    }
  } else if (baseUrl.includes('api.x.ai')) {
    const xaiFallbacks = ['grok-2', 'grok-2-1212', 'grok-beta'];
    for (const m of xaiFallbacks) {
      if (!candidates.includes(m)) candidates.push(m);
    }
  } else {
    const generalFallbacks = ['gemini-3.1-flash-lite', 'grok-2', 'gpt-4o-mini'];
    for (const m of generalFallbacks) {
      if (!candidates.includes(m)) candidates.push(m);
    }
  }
  return candidates;
}

// Deteksi pertanyaan identitas
function isIdentityQuestion(rawMessage) {
  if (!rawMessage || typeof rawMessage !== 'string') return false;
  const normalized = rawMessage
    .toLowerCase()
    .replace(/[?!.,;:_~`'"()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const exactTriggers = [
    'kamu siapa',
    'siapa kamu',
    'siapa pembuatmu',
    'siapa pembuat kamu',
    'siapa developer kamu',
    'siapa developermu',
    'kamu dibuat siapa',
    'kamu dibuat oleh siapa',
    'siapa yang buat kamu',
    'siapa yang membuat kamu',
    'siapa yang bikin kamu',
    'siapa penciptamu',
    'siapa pencipta kamu',
    'kamu diciptakan siapa',
    'kamu diciptakan oleh siapa',
    'siapa yang menciptakan kamu',
    'developer kamu siapa',
    'pembuat kamu siapa',
    'pencipta kamu siapa',
    'kamu ini siapa',
    'siapa dirimu',
    'siapakah kamu',
    'siapakah pembuatmu',
    'siapakah developermu',
    'siapakah penciptamu',
    'siapa azryl',
    'azryl siapa',
    'tentang kamu',
    'ceritakan tentang dirimu',
    'identitas kamu',
    'profil kamu',
    'kamu asisten apa',
    'siapa namamu',
    'nama kamu siapa',
    'what is your name',
    'who are you',
    'who made you',
    'who created you',
    'who is your creator',
    'who is your developer',
    'who is azryl',
    'tell me about yourself'
  ];

  if (exactTriggers.some((t) => normalized === t || normalized.startsWith(t + ' ') || normalized.endsWith(' ' + t))) {
    return true;
  }

  const patterns = [
    /\b(siapa|siapakah|who)\s+(kamu|anda|azrylasissten|dirimu)\b/i,
    /\b(kamu|anda|azrylasissten)\s+(siapa|siapakah|who)\b/i,
    /\b(siapa|siapakah|who)\s+(yang\s+)?(buat|membuat|bikin|menciptakan|diciptakan|develop|created)\s+(kamu|anda|mu)\b/i,
    /\b(siapa|siapakah|who)\s+(pembuat|pencipta|developer|creator|maker)\s*(kamu|anda|mu)?\b/i,
    /\b(pembuat|pencipta|developer|creator)\s*(kamu|anda|mu)?\s+(siapa|siapakah|who)\b/i,
    /\b(kamu|anda)\s+(dibuat|diciptakan|didevelop)\s+(oleh|sama)?\s*(siapa|who)\b/i,
    /\b(siapa|apa)\s+nama\s*(kamu|mu|anda)\b/i
  ];

  return patterns.some((p) => p.test(normalized));
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// GET / - Status API
app.get('/', (req, res, next) => {
  const isJsonClient =
    req.xhr ||
    req.headers.accept?.includes('application/json') ||
    req.query.format === 'json' ||
    req.headers['user-agent']?.toLowerCase().includes('curl');

  if (isJsonClient) {
    return res.json({
      success: true,
      name: AI_IDENTITY.name,
      assistant: AI_IDENTITY.assistant,
      developer: AI_IDENTITY.developer,
      status: "online"
    });
  }
  next();
});

// GET /api & GET /api/status - Status endpoint eksplisit
app.get(['/api', '/api/status'], (req, res) => {
  res.json({
    success: true,
    name: AI_IDENTITY.name,
    assistant: AI_IDENTITY.assistant,
    developer: AI_IDENTITY.developer,
    status: "online"
  });
});

// GET /api/identity - Informasi identitas AI dalam JSON
app.get('/api/identity', (req, res) => {
  res.json({
    success: true,
    name: AI_IDENTITY.assistant,
    developer: AI_IDENTITY.developer,
    tiktok: AI_IDENTITY.tiktok,
    role: AI_IDENTITY.role,
    exact_response: AI_IDENTITY.exactResponse,
    description: `Asisten AI resmi yang dikembangkan oleh ${AI_IDENTITY.developer} (${AI_IDENTITY.tiktok}).`
  });
});

// GET /api/config-status
app.get('/api/config-status', (req, res) => {
  const apiKey = process.env.AI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'ISI_API_KEY_SENDIRI');
  const rawBaseUrl = process.env.AI_BASE_URL || 'https://api.x.ai/v1';
  const normalizedUrl = normalizeBaseUrl(rawBaseUrl);
  const provider = detectProvider(normalizedUrl);
  const currentModel = activeWorkingModel || process.env.AI_MODEL || (provider === 'Google Gemini' ? 'gemini-3.1-flash-lite' : 'grok-2');

  res.json({
    success: true,
    provider,
    model: currentModel,
    baseUrl: rawBaseUrl,
    isKeyConfigured: isConfigured,
    assistant: AI_IDENTITY.assistant,
    developer: AI_IDENTITY.developer
  });
});

// POST /api/chat - Endpoint Chat Utama
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId: incomingSessionId } = req.body;

    // 1. Validasi request body
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: "Pesan tidak boleh kosong."
      });
    }

    const trimmedMessage = message.trim();
    const sessionId = incomingSessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Ambil atau buat chat session
    let session = chatSessions.get(sessionId);
    if (!session) {
      session = {
        messages: [],
        lastUpdated: Date.now()
      };
      chatSessions.set(sessionId, session);
    }
    session.lastUpdated = Date.now();

    // 2. Prioritas Identitas Khusus
    if (isIdentityQuestion(trimmedMessage)) {
      session.messages.push({ role: 'user', content: trimmedMessage });
      session.messages.push({ role: 'assistant', content: AI_IDENTITY.exactResponse });

      return res.json({
        success: true,
        message: AI_IDENTITY.exactResponse,
        sessionId
      });
    }

    // 3. Provider AI (OpenAI-compatible: xAI Grok, Google Gemini, OpenAI, dll.)
    const apiKey = process.env.AI_API_KEY;
    const baseUrl = normalizeBaseUrl(process.env.AI_BASE_URL);
    const providerName = detectProvider(baseUrl);
    const configuredModel = process.env.AI_MODEL;

    if (!apiKey || apiKey.trim() === '' || apiKey === 'ISI_API_KEY_SENDIRI') {
      return res.status(400).json({
        success: false,
        error: `AI_API_KEY belum dikonfigurasi di file .env. Silakan masukkan API key Anda di .env untuk mulai mengobrol dengan ${AI_IDENTITY.assistant}.`,
        sessionId
      });
    }

    const historyWindow = session.messages.slice(-12);
    const messagesPayload = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...historyWindow,
      { role: 'user', content: trimmedMessage }
    ];

    const candidateModels = getCandidateModels(configuredModel, baseUrl);

    let successfulResponseData = null;
    let usedModel = candidateModels[0];
    let lastError = '';

    for (const modelToTry of candidateModels) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 35000);

        const apiResponse = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: modelToTry,
            messages: messagesPayload,
            temperature: 0.7
          }),
          signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));

        if (apiResponse.ok) {
          successfulResponseData = await apiResponse.json();
          usedModel = modelToTry;
          activeWorkingModel = modelToTry;
          break;
        }

        const errBody = await apiResponse.text().catch(() => '');
        let sanitizedError = `HTTP ${apiResponse.status} ${apiResponse.statusText}`;
        try {
          const parsed = JSON.parse(errBody);
          if (parsed.error) {
            sanitizedError = typeof parsed.error === 'string' ? parsed.error : (parsed.error.message || sanitizedError);
          } else if (Array.isArray(parsed) && parsed[0]?.error?.message) {
            sanitizedError = parsed[0].error.message;
          }
        } catch {
          if (errBody) sanitizedError += `: ${errBody.slice(0, 150)}`;
        }

        lastError = sanitizedError;

        const isNotFound = apiResponse.status === 404 || sanitizedError.toLowerCase().includes('not found') || sanitizedError.toLowerCase().includes('no longer available');
        const isUnavailable = apiResponse.status === 503;

        if (isNotFound || isUnavailable) {
          console.warn(`[${providerName} Notice] Model "${modelToTry}" tidak dapat digunakan (${sanitizedError}). Mencoba kandidat berikutnya...`);
          continue;
        } else {
          console.error(`[${providerName} API Error] Status: ${apiResponse.status}`, sanitizedError);
          break;
        }
      } catch (fetchErr) {
        lastError = fetchErr?.message || String(fetchErr);
        if (fetchErr?.name === 'AbortError') {
          console.warn(`[${providerName} Timeout] Model "${modelToTry}" timeout. Mencoba berikutnya...`);
          continue;
        }
      }
    }

    if (!successfulResponseData) {
      console.error(`[${providerName} Final Error]`, lastError);
      return res.status(502).json({
        success: false,
        error: `Gagal berkomunikasi dengan provider AI (${providerName}): ${lastError}`,
        sessionId
      });
    }

    const assistantMessage =
      successfulResponseData.choices?.[0]?.message?.content ||
      "Maaf, tidak ada respons yang diterima dari model AI.";

    session.messages.push({ role: 'user', content: trimmedMessage });
    session.messages.push({ role: 'assistant', content: assistantMessage });

    return res.json({
      success: true,
      message: assistantMessage,
      sessionId,
      model: usedModel
    });
  } catch (error) {
    console.error("[Chat Endpoint Error]", error?.message || error);
    const isAbort = error?.name === 'AbortError';
    return res.status(500).json({
      success: false,
      error: isAbort
        ? "Waktu tunggu permintaan ke server AI habis (timeout). Silakan coba lagi."
        : "Terjadi kesalahan internal pada server saat memproses chat."
    });
  }
});

// POST /api/chat/clear
app.post('/api/chat/clear', (req, res) => {
  const { sessionId } = req.body;
  if (sessionId && chatSessions.has(sessionId)) {
    chatSessions.delete(sessionId);
  }
  res.json({
    success: true,
    message: "Riwayat percakapan session berhasil dibersihkan."
  });
});

// Serve static assets from public/ folder if available
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AZRYL AI Standalone Server running on port ${PORT}`);
  console.log(`🤖 AI Assistant: ${AI_IDENTITY.assistant}`);
  console.log(`👨‍💻 Developer: ${AI_IDENTITY.developer} (${AI_IDENTITY.tiktok})`);
});
