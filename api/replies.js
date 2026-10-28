// POST /api/replies — admin only. Emails a reply to the person who sent an inquiry, records it in inquiry_replies,
// and marks the inquiry Replied only after Gmail has accepted the message.
// The recipient is always the inquiry's own email address, so this can't be used to email anyone else.
const { serverConfig, secretHeaders, requireAdmin, patchRows } = require("./_supabase");
const { emailConfig, sendEmail, describeEmailError, escapeHtml } = require("./_email");

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const REPLY_COLUMNS = "id,inquiry_id,recipient_email,subject,reply_body,send_status,provider_message_id,error,created_at,sent_at";

const cleanLine = (value) => (typeof value === "string" ? value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim() : "");
const cleanBody = (value) => (typeof value === "string" ? value.replace(/[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\r\n?/g, "\n").trim() : "");

module.exports = async function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const config = serverConfig();
  if (!config) return res.status(503).json({ error: "The database isn't configured." });

  let adminId;
  try {
    adminId = await requireAdmin(req, config);
  } catch (error) {
    console.error("replies: admin check failed", error.message.slice(0, 200));
    return res.status(502).json({ error: "Couldn't verify your sign-in. Please try again." });
  }
  if (!adminId) return res.status(401).json({ error: "Your session has ended. Please sign in again." });

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const subject = cleanLine(body.subject);
  const message = cleanBody(body.message);
  const errors = {};
  if (!UUID_PATTERN.test(String(body.inquiry_id || ""))) errors.inquiry_id = "Choose an inquiry to reply to.";
  if (!UUID_PATTERN.test(String(body.client_ref || ""))) errors.client_ref = "Please reload the dashboard and try again.";
  if (!subject) errors.subject = "Please enter a subject.";
  else if (subject.length > 200) errors.subject = "Please keep the subject under 200 characters.";
  if (!message) errors.message = "Please write a message.";
  else if (message.length > 10000) errors.message = "Please keep the message under 10,000 characters.";
  if (Object.keys(errors).length) return res.status(400).json({ error: Object.values(errors)[0], fields: errors });

  const email = emailConfig();
  if (!email) return res.status(503).json({ error: "Email sending isn't set up yet. Add GMAIL_USER and GMAIL_APP_PASSWORD in Vercel (see docs/INQUIRY-SYSTEM-SETUP.md)." });

  let reply;
  try {
    const found = await fetch(`${config.url}/rest/v1/inquiries?select=id,email&id=eq.${body.inquiry_id}`, { headers: secretHeaders(config.secretKey) });
    if (!found.ok) throw new Error(`inquiry lookup ${found.status}`);
    const [inquiry] = await found.json();
    if (!inquiry) return res.status(404).json({ error: "This inquiry no longer exists." });

    // Claim this send. A repeated request with the same client_ref (a double click or a network retry) gets the
    // existing record instead of sending a second email.
    const insert = await fetch(`${config.url}/rest/v1/inquiry_replies?on_conflict=client_ref&select=${REPLY_COLUMNS}`, {
      method: "POST",
      headers: secretHeaders(config.secretKey, { prefer: "return=representation,resolution=ignore-duplicates" }),
      body: JSON.stringify({ inquiry_id: inquiry.id, client_ref: body.client_ref, recipient_email: inquiry.email, subject, reply_body: message, sent_by: adminId }),
    });
    if (!insert.ok) throw new Error(`reply insert ${insert.status} ${(await insert.text()).slice(0, 200)}`);
    [reply] = await insert.json();
    if (!reply) {
      const existing = await fetch(`${config.url}/rest/v1/inquiry_replies?select=${REPLY_COLUMNS}&client_ref=eq.${body.client_ref}`, { headers: secretHeaders(config.secretKey) });
      const [previous] = existing.ok ? await existing.json() : [];
      if (previous?.send_status === "sent") return res.status(200).json({ ok: true, duplicate: true, reply: previous });
      if (previous?.send_status === "sending") return res.status(409).json({ error: "This reply is already being sent." });
      return res.status(409).json({ error: previous?.error || "This reply wasn't sent. Please try again.", reply: previous });
    }
  } catch (error) {
    console.error("replies: couldn't prepare reply", error.message.slice(0, 300));
    return res.status(502).json({ error: "The reply couldn't be prepared. Nothing was sent. Please try again." });
  }

  let messageId;
  try {
    const html = `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#0b1f3a">${escapeHtml(message).replace(/\n/g, "<br>")}</div>`;
    messageId = await sendEmail(email, { to: reply.recipient_email, subject, text: message, html });
  } catch (error) {
    const reason = describeEmailError(error);
    console.error("replies: send failed", error.code || "", String(error.message).slice(0, 200));
    const [failed] = await patchRows(config, "inquiry_replies", `id=eq.${reply.id}`, { send_status: "failed", error: reason }, REPLY_COLUMNS).catch(() => []);
    return res.status(502).json({ error: reason, reply: failed || { ...reply, send_status: "failed", error: reason } });
  }

  // Gmail has accepted the email. Record that; if recording fails, still report the send as done so it isn't repeated.
  const sentAt = new Date().toISOString();
  let saved = { ...reply, send_status: "sent", provider_message_id: messageId, sent_at: sentAt };
  let warning = "";
  try {
    [saved] = await patchRows(config, "inquiry_replies", `id=eq.${reply.id}`, { send_status: "sent", provider_message_id: messageId ? String(messageId).slice(0, 300) : null, sent_at: sentAt }, REPLY_COLUMNS);
    await patchRows(config, "inquiries", `id=eq.${reply.inquiry_id}`, { status: "replied" });
  } catch (error) {
    console.error("replies: sent but couldn't record", error.message.slice(0, 200));
    warning = "The email was sent, but the dashboard couldn't record it. Refresh to check the status.";
  }
  return res.status(200).json({ ok: true, reply: saved, warning });
};
