// POST /api/retry-notification — admin only. Sends the "new inquiry" email again for an inquiry whose notification
// failed, was never configured, or stalled. The status update below claims the retry, so two clicks can't send twice.
const { serverConfig, secretHeaders, requireAdmin, patchRows } = require("./_supabase");
const { emailConfig } = require("./_email");
const { notifyNewInquiry } = require("./_notify");

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STALLED_AFTER_MS = 2 * 60_000;
const COLUMNS = "id,full_name,email,business_name,service_needed,industry,message,created_at,notification_attempts";

module.exports = async function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const config = serverConfig();
  if (!config) return res.status(503).json({ error: "The database isn't configured." });
  try {
    if (!(await requireAdmin(req, config))) return res.status(401).json({ error: "Your session has ended. Please sign in again." });
  } catch (error) {
    console.error("retry-notification: admin check failed", error.message.slice(0, 200));
    return res.status(502).json({ error: "Couldn't verify your sign-in. Please try again." });
  }
  const id = String(req.body?.inquiry_id || "");
  if (!UUID_PATTERN.test(id)) return res.status(400).json({ error: "Choose an inquiry first." });
  if (!emailConfig()) return res.status(503).json({ error: "Email sending isn't set up yet. Add GMAIL_USER and GMAIL_APP_PASSWORD in Vercel (see docs/INQUIRY-SYSTEM-SETUP.md)." });

  try {
    const stalled = new Date(Date.now() - STALLED_AFTER_MS).toISOString();
    const claimable = `or=(notification_status.in.(failed,not_configured),and(notification_status.eq.sending,notification_attempted_at.lt.${encodeURIComponent(stalled)}))`;
    const current = await fetch(`${config.url}/rest/v1/inquiries?select=notification_attempts&id=eq.${id}`, { headers: secretHeaders(config.secretKey) });
    const [row] = current.ok ? await current.json() : [];
    if (!row) return res.status(404).json({ error: "This inquiry no longer exists." });
    const [claimed] = await patchRows(config, "inquiries", `id=eq.${id}&${claimable}`, {
      notification_status: "sending",
      notification_attempts: row.notification_attempts + 1,
      notification_attempted_at: new Date().toISOString(),
      notification_error: null,
    }, COLUMNS);
    if (!claimed) return res.status(409).json({ error: "This notification was already sent or is being sent right now." });
    const status = await notifyNewInquiry(config, claimed);
    if (status !== "sent") return res.status(502).json({ error: "The notification still couldn't be sent. Check the email settings and try again.", status });
    return res.status(200).json({ ok: true, status });
  } catch (error) {
    console.error("retry-notification: failed", error.message.slice(0, 200));
    return res.status(502).json({ error: "The notification couldn't be retried. Please try again." });
  }
};
