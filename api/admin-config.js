// GET /api/admin-config — the public Supabase URL and publishable key the /admin/ page needs to sign in.
// Both values are safe in the browser: every read or change is still checked by row level security in the database.
module.exports = function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const url = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || "";
  if (!url || !publishableKey) return res.status(503).json({ error: "Admin sign-in is not configured yet." });
  return res.status(200).json({ url, publishableKey });
};
