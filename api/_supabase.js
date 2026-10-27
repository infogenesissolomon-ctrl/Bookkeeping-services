// Server-only helpers for talking to Supabase's REST API with the secret key. Never import this from browser code.
const crypto = require("node:crypto");

function serverConfig() {
  const url = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const secretKey = process.env.SUPABASE_SECRET_KEY || "";
  if (!url || !secretKey) return null;
  return { url, secretKey };
}

// New-style secret keys go in the apikey header only; legacy service_role JWTs are also sent as a bearer token.
function secretHeaders(secretKey, extra = {}) {
  const headers = { apikey: secretKey, "content-type": "application/json", ...extra };
  if (secretKey.startsWith("eyJ")) headers.authorization = `Bearer ${secretKey}`;
  return headers;
}

function hashSubmitter(ip, secretKey) {
  return crypto.createHmac("sha256", secretKey).update(String(ip || "unknown")).digest("hex").slice(0, 32);
}

function clientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.headers["x-real-ip"] || req.socket?.remoteAddress || "";
}

module.exports = { serverConfig, secretHeaders, hashSubmitter, clientIp };
