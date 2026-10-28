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

// Resolves to the signed-in user's id when the request carries a valid Supabase session for an account in admin_users,
// otherwise null. Used by the admin-only functions; the dashboard sends its session token as a bearer token.
async function requireAdmin(req, config) {
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token || token === req.headers.authorization) return null;
  const user = await fetch(`${config.url}/auth/v1/user`, { headers: { apikey: config.secretKey, authorization: `Bearer ${token}` } });
  if (!user.ok) return null;
  const { id } = await user.json();
  if (!id) return null;
  const admin = await fetch(`${config.url}/rest/v1/admin_users?select=user_id&user_id=eq.${encodeURIComponent(id)}`, { headers: secretHeaders(config.secretKey) });
  if (!admin.ok) throw new Error(`admin check ${admin.status}`);
  return (await admin.json()).length ? id : null;
}

// PATCH rows matching a PostgREST filter and return the updated rows.
async function patchRows(config, table, filter, values, select = "id") {
  const response = await fetch(`${config.url}/rest/v1/${table}?${filter}&select=${select}`, {
    method: "PATCH",
    headers: secretHeaders(config.secretKey, { prefer: "return=representation" }),
    body: JSON.stringify(values),
  });
  if (!response.ok) throw new Error(`update ${table} ${response.status} ${(await response.text()).slice(0, 200)}`);
  return response.json();
}

module.exports = { serverConfig, secretHeaders, hashSubmitter, clientIp, requireAdmin, patchRows };
