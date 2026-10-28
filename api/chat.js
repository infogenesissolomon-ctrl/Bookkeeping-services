// POST /api/chat — answers website chat questions through the Gemini API (models.generateContent).
// The key is read from GEMINI_API_KEY on the server only and is never returned, logged or sent to the browser.
// Visitor messages are scrubbed of emails, phone numbers and account-style numbers before they leave this server,
// because Gemini's unpaid tier must not receive personal information.
const crypto = require("node:crypto");
const { clientIp } = require("./_supabase");
const { SYSTEM_INSTRUCTION } = require("./_chat-knowledge");

const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 800;
const MAX_TOTAL_CHARS = 6000;
const TIMEOUT_MS = 20_000;
// Best-effort limits per visitor, kept in this function instance's memory (they reset when Vercel starts a new instance).
const RATE_LIMITS = [{ count: 10, ms: 60_000 }, { count: 60, ms: 24 * 60 * 60_000 }];
const hits = new Map();
const salt = crypto.randomBytes(16);

function rateLimited(ip) {
  const key = crypto.createHmac("sha256", salt).update(String(ip || "unknown")).digest("hex");
  const now = Date.now();
  const longest = Math.max(...RATE_LIMITS.map((limit) => limit.ms));
  const recent = (hits.get(key) || []).filter((time) => now - time < longest);
  if (RATE_LIMITS.some((limit) => recent.filter((time) => now - time < limit.ms).length >= limit.count)) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.delete(hits.keys().next().value);
  return false;
}

// Replace anything that looks like contact details or account numbers before the text reaches Gemini.
function scrub(text) {
  return text
    .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, "[email removed]")
    .replace(/\b\d(?:[\s-]?\d){8,}\b/g, "[number removed]")
    .replace(/\+?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g, "[phone removed]");
}

function readMessages(body) {
  const list = Array.isArray(body?.messages) ? body.messages.slice(-MAX_MESSAGES) : null;
  if (!list || !list.length) return { error: "Please type a question." };
  const messages = [];
  let total = 0;
  for (const item of list) {
    const role = item?.role === "assistant" ? "model" : item?.role === "user" ? "user" : null;
    const text = typeof item?.text === "string" ? item.text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim() : "";
    if (!role || !text) return { error: "Please type a question." };
    if (text.length > MAX_MESSAGE_CHARS) return { error: `Please keep each message under ${MAX_MESSAGE_CHARS} characters.` };
    total += text.length;
    messages.push({ role, parts: [{ text: role === "user" ? scrub(text) : text }] });
  }
  if (total > MAX_TOTAL_CHARS) return { error: "This conversation is getting long. Please refresh the chat to start a new one." };
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return { error: "Please type a question." };
  return { messages };
}

// Only accept requests sent from pages on this site.
function sameSite(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}

module.exports = async function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  if (!sameSite(req)) return res.status(403).json({ error: "This chat only works on the Genesis Solomon website." });
  if (!String(req.headers["content-type"] || "").includes("application/json") || !req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Please type a question." });
  }

  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    console.error("chat: GEMINI_API_KEY is not set");
    return res.status(503).json({ error: "The chat assistant isn't available right now. Please use the Contact page or book a call." });
  }
  if (rateLimited(clientIp(req))) {
    return res.status(429).json({ error: "You've sent a lot of messages in a short time. Please wait a minute and try again." });
  }

  const { messages, error } = readMessages(req.body);
  if (error) return res.status(400).json({ error });

  const model = (process.env.GEMINI_MODEL || DEFAULT_MODEL).replace(/[^a-z0-9.-]/gi, "");
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: messages,
        generationConfig: { maxOutputTokens: 600 },
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      // Log only the status and Google's error code, never the request, the key or the visitor's text.
      const detail = await response.json().catch(() => ({}));
      console.error("chat: Gemini error", response.status, detail?.error?.status || "", model);
      if (response.status === 429) return res.status(503).json({ error: "The assistant is busy right now. Please try again in a minute." });
      return res.status(502).json({ error: "The assistant couldn't answer just now. Please try again, or use the Contact page." });
    }
    const data = await response.json();
    const candidate = data?.candidates?.[0];
    const reply = (candidate?.content?.parts || []).map((part) => part.text || "").join("").trim();
    if (!reply) {
      console.error("chat: empty reply", data?.promptFeedback?.blockReason || candidate?.finishReason || "unknown");
      return res.status(200).json({ reply: "I can't help with that one. For anything about bookkeeping or administrative support, ask away, or book a consultation call." });
    }
    return res.status(200).json({ reply: reply.slice(0, 4000) });
  } catch (err) {
    console.error("chat: request failed", err.name === "TimeoutError" ? "timeout" : String(err.message).slice(0, 200));
    return res.status(504).json({ error: "The assistant took too long to answer. Please try again." });
  }
};
