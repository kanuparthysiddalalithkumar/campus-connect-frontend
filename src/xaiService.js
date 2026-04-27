// ── Google Gemini API (FREE tier) ────────────────────────────────────────────
// Get your free key → https://aistudio.google.com/apikey
// Free limits: 15 RPM · 1,000,000 TPM · 1,500 requests/day
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL   = 'gemini-2.0-flash';   // confirmed available from ListModels
const GEMINI_URL     = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are an intelligent assistant for a Student Events Platform called CampusConnect.

Your job is NOT to chat freely.
Your job is to understand the user's request and convert it into structured JSON.

Always follow these rules:
1. Identify the user's intent from the message.
2. Extract key details like:
   - date (today, tomorrow, specific date)
   - category (tech, cultural, sports, workshop, seminar, club, event)
   - event_name (if mentioned)
3. Respond ONLY in valid JSON — no markdown fences, no extra text whatsoever.
4. If information is missing, set fields to null.
5. Keep responses short and structured.

Supported intents:
- get_events
- get_event_details
- register_event
- cancel_registration
- greeting
- unknown

JSON format:
{
  "intent": "",
  "date": null,
  "category": null,
  "event_name": null,
  "user_message": "",
  "reply": ""
}

The "reply" field is a short, friendly human-readable response to show the user (1-2 sentences max).

Examples:
User: "Show me tech events today"
{"intent":"get_events","date":"today","category":"tech","event_name":null,"user_message":"Show me tech events today","reply":"Here are the tech events happening today on CampusConnect!"}

User: "Register me for AI Workshop"
{"intent":"register_event","date":null,"category":"workshop","event_name":"AI Workshop","user_message":"Register me for AI Workshop","reply":"Sure! I'll register you for the AI Workshop right away."}

User: "Hi"
{"intent":"greeting","date":null,"category":null,"event_name":null,"user_message":"Hi","reply":"Hey there! 👋 Welcome to CampusConnect! Ask me about events, registrations, or anything campus-related."}

User: "Cancel my registration for Hackathon"
{"intent":"cancel_registration","date":null,"category":null,"event_name":"Hackathon","user_message":"Cancel my registration for Hackathon","reply":"Got it! I'll cancel your registration for the Hackathon."}`;

/**
 * Send a message to Google Gemini and get a structured JSON response.
 * @param {string} userMessage
 * @param {Array}  conversationHistory  - array of { role: 'user'|'assistant', content: string }
 * @returns {Promise<{ parsed: Object, raw: string }>}
 */
export async function sendToGrok(userMessage, conversationHistory = []) {
  if (!GEMINI_API_KEY) {
    throw new Error(
      'VITE_GEMINI_API_KEY is not set. Add it to your .env file.\n' +
      'Get a free key at: https://aistudio.google.com/apikey'
    );
  }

  // Build Gemini "contents" from history (Gemini uses user/model roles)
  const contents = conversationHistory.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  // Add current user message
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const body = {
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents,
    generationConfig: {
      temperature: 0.15,      // low for consistent JSON
      maxOutputTokens: 400,
      // responseMimeType: 'application/json', // omit — not supported on all keys
    },
  };

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.error?.message || `Gemini API error: ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();

  // Extract text from Gemini response
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

  // Strip any accidental markdown code fences
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  let parsed = null;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    parsed = {
      intent: 'unknown',
      date: null,
      category: null,
      event_name: null,
      user_message: userMessage,
      reply: cleaned || "Sorry, I couldn't understand that. Try asking about events or registrations!",
    };
  }

  return { parsed, raw: cleaned };
}
