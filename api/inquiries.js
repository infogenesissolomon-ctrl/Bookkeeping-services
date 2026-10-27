// POST /api/inquiries — saves a Contact page inquiry to Supabase and answers 201 only after the row is stored.
const { serverConfig, secretHeaders, hashSubmitter, clientIp } = require("./_supabase");

const SERVICES = ["Bookkeeping Services", "Administrative Support", "Both Bookkeeping and Administrative Support", "Other"];
const INDUSTRIES = ["Construction", "Real Estate", "Small Business", "Landscaping & Lawn Care", "Other"];
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const RATE_LIMIT = { count: 3, minutes: 10 };
const MIN_FILL_MS = 3000;

// Trim, drop control characters (keeping line breaks in the message), and collapse runs of spaces in single-line fields.
function clean(value, { multiline = false } = {}) {
  if (typeof value !== "string") return "";
  const text = value.replace(multiline ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, "");
  return (multiline ? text.replace(/\r\n?/g, "\n") : text.replace(/\s+/g, " ")).trim();
}

function validate(body) {
  const data = {
    full_name: clean(body.full_name),
    email: clean(body.email).toLowerCase(),
    business_name: clean(body.business_name) || null,
    service_needed: clean(body.service_needed),
    industry: clean(body.industry),
    message: clean(body.message, { multiline: true }),
  };
  const errors = {};
  if (!data.full_name) errors.full_name = "Please enter your full name.";
  else if (data.full_name.length > 100) errors.full_name = "Please keep your name under 100 characters.";
  if (!data.email) errors.email = "Please enter your email address.";
  else if (data.email.length > 254 || !EMAIL_PATTERN.test(data.email)) errors.email = "Please enter a valid email address.";
  if (data.business_name && data.business_name.length > 120) errors.business_name = "Please keep the business name under 120 characters.";
  if (!SERVICES.includes(data.service_needed)) errors.service_needed = "Please choose the service you need.";
  if (!INDUSTRIES.includes(data.industry)) errors.industry = "Please choose your industry.";
  if (!data.message) errors.message = "Please enter a message.";
  else if (data.message.length > 3000) errors.message = "Please keep your message under 3,000 characters.";
  return { data, errors };
}

module.exports = async function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  if (!String(req.headers["content-type"] || "").includes("application/json") || !req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Please submit the form from the Contact page." });
  }

  const body = req.body;
  // Spam checks: a hidden field people never fill in, and a form completed implausibly fast.
  // Both answer with an error rather than a fake success, so a real visitor is never told an unsaved inquiry was received.
  const startedAt = Number(body.started_at);
  if (clean(body.hp_field)) {
    return res.status(400).json({ error: "Your inquiry couldn't be sent. Please email me directly instead." });
  }
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return res.status(400).json({ error: "Please take a moment to review your inquiry, then send it again." });
  }

  const { data, errors } = validate(body);
  if (Object.keys(errors).length) return res.status(400).json({ error: "Please check the highlighted fields.", fields: errors });

  const config = serverConfig();
  if (!config) {
    console.error("inquiries: SUPABASE_URL or SUPABASE_SECRET_KEY is not set");
    return res.status(503).json({ error: "The inquiry form is temporarily unavailable. Please email me directly instead." });
  }

  const submitterHash = hashSubmitter(clientIp(req), config.secretKey);
  try {
    const since = new Date(Date.now() - RATE_LIMIT.minutes * 60_000).toISOString();
    const recent = await fetch(`${config.url}/rest/v1/inquiries?select=id&submitter_hash=eq.${submitterHash}&created_at=gte.${encodeURIComponent(since)}`, {
      method: "HEAD",
      headers: secretHeaders(config.secretKey, { prefer: "count=exact" }),
    });
    if (!recent.ok) throw new Error(`rate check ${recent.status}`);
    const count = Number((recent.headers.get("content-range") || "*/0").split("/")[1]) || 0;
    if (count >= RATE_LIMIT.count) {
      return res.status(429).json({ error: "You've sent several inquiries in the last few minutes. Please wait a little before sending another." });
    }

    const clientRef = UUID_PATTERN.test(String(body.client_ref || "")) ? body.client_ref : null;
    const insert = await fetch(`${config.url}/rest/v1/inquiries${clientRef ? "?on_conflict=client_ref" : ""}`, {
      method: "POST",
      headers: secretHeaders(config.secretKey, { prefer: `return=representation${clientRef ? ",resolution=ignore-duplicates" : ""}` }),
      body: JSON.stringify({ ...data, client_ref: clientRef, submitter_hash: submitterHash }),
    });
    if (!insert.ok) throw new Error(`insert ${insert.status} ${await insert.text()}`);
    const rows = await insert.json();
    // An empty result means this client_ref was already saved by an earlier attempt of the same submission.
    if (!Array.isArray(rows)) throw new Error("insert returned no rows array");
    return res.status(201).json({ ok: true, duplicate: rows.length === 0 });
  } catch (error) {
    // Log the failure without the visitor's details.
    console.error("inquiries: save failed", error.message.slice(0, 300));
    return res.status(502).json({ error: "Your inquiry couldn't be saved just now. Please try again in a moment." });
  }
};
