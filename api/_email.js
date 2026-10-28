// Server-only email sending through Gmail (SMTP with an app password). Never import this from browser code.
const nodemailer = require("nodemailer");

let transport = null;
const PLAIN_ADDRESS = /^[^\s@"(),:;<>[\]\\]+@[^\s@"(),:;<>[\]\\]+\.[^\s@"(),:;<>[\]\\]+$/;

function emailConfig() {
  const user = (process.env.GMAIL_USER || "").trim();
  const password = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
  if (!user || !password) return null;
  return {
    user,
    password,
    fromName: (process.env.EMAIL_FROM_NAME || "Genesis Solomon").replace(/["\r\n]/g, "").trim(),
    adminEmail: (process.env.ADMIN_NOTIFICATION_EMAIL || user).trim(),
  };
}

// The production address for links in emails. Vercel sets VERCEL_PROJECT_PRODUCTION_URL automatically.
function siteUrl() {
  const configured = (process.env.SITE_URL || "").trim().replace(/\/+$/, "");
  if (configured) return configured;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return vercel ? `https://${vercel}` : "";
}

// Resolves with Gmail's message id once Gmail has accepted the message. Acceptance is not proof of final delivery.
async function sendEmail(config, { to, subject, text, html, replyTo }) {
  transport ||= nodemailer.createTransport({
    service: "gmail",
    auth: { user: config.user, pass: config.password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  // Addresses are checked here and passed as objects, so nothing in them is parsed as extra recipients.
  if (!PLAIN_ADDRESS.test(to)) throw Object.assign(new Error("invalid recipient"), { code: "EENVELOPE" });
  const info = await transport.sendMail({
    from: { name: config.fromName, address: config.user },
    to: { name: "", address: to },
    ...(replyTo && PLAIN_ADDRESS.test(replyTo) ? { replyTo: { name: "", address: replyTo } } : {}),
    subject,
    text,
    html,
  });
  return info.messageId || null;
}

// A short reason that is safe to store and show in the dashboard; never includes credentials.
function describeEmailError(error) {
  if (error?.code === "EAUTH" || error?.responseCode === 535) return "Gmail rejected the sign-in. Check GMAIL_USER and GMAIL_APP_PASSWORD.";
  if (["ETIMEDOUT", "ECONNECTION", "ESOCKET", "EDNS"].includes(error?.code)) return "Couldn't connect to Gmail. Please try again.";
  if (error?.code === "EENVELOPE") return "Gmail refused the recipient address.";
  if (error?.responseCode >= 400) return `Gmail refused the message (code ${error.responseCode}).`;
  return "The email couldn't be sent. Please try again.";
}

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Notification sent to the site owner after an inquiry is saved. Includes only what's needed to triage it.
function inquiryNotification(inquiry) {
  const received = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(inquiry.created_at));
  const preview = inquiry.message.length > 300 ? `${inquiry.message.slice(0, 300).trimEnd()}…` : inquiry.message;
  const dashboard = siteUrl() ? `${siteUrl()}/admin/` : "";
  const fields = [
    ["Name", inquiry.full_name],
    ["Email", inquiry.email],
    ["Business name", inquiry.business_name || "Not provided"],
    ["Service needed", inquiry.service_needed],
    ["Industry", inquiry.industry],
    ["Date received", `${received} (Philippine time)`],
  ];
  const text = [
    "You have received a new inquiry from your website.",
    "",
    ...fields.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message preview:",
    preview,
    "",
    dashboard ? `View it in the Admin Dashboard: ${dashboard}` : "",
    "",
    "This is an automated notification from your website.",
  ].join("\n");
  const rows = fields.map(([label, value]) => `<tr><td style="padding:6px 16px 6px 0;color:#536782;font-weight:600;white-space:nowrap;vertical-align:top">${escapeHtml(label)}:</td><td style="padding:6px 0;color:#0b1f3a">${escapeHtml(value)}</td></tr>`).join("");
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f6f8fb;font-family:Inter,Segoe UI,Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e2ebf5;border-radius:14px;overflow:hidden">
<div style="padding:22px 26px;background:#0b1f3a;color:#fff"><div style="font-size:20px;font-weight:700">New Website Inquiry</div><div style="margin-top:4px;color:#c8daf2;font-size:14px">You have received a new inquiry from your website.</div></div>
<div style="padding:22px 26px"><table style="border-collapse:collapse;font-size:14px">${rows}</table>
<div style="margin-top:16px;padding:14px 16px;border-radius:10px;background:#eaf4ff;color:#0b1f3a;font-size:14px;line-height:1.55"><strong>Message preview:</strong><br>${escapeHtml(preview).replace(/\n/g, "<br>")}</div>
${dashboard ? `<p style="margin:22px 0 4px;text-align:center"><a href="${escapeHtml(dashboard)}" style="display:inline-block;padding:12px 22px;border-radius:10px;background:#1769e0;color:#fff;font-weight:700;font-size:14px;text-decoration:none">View in Admin Dashboard</a></p>` : ""}
<p style="margin:18px 0 0;color:#708096;font-size:12px;text-align:center">This is an automated notification from your website.</p></div></div></body></html>`;
  return { subject: `New Website Inquiry — ${inquiry.service_needed}`, text, html };
}

module.exports = { emailConfig, sendEmail, describeEmailError, inquiryNotification, escapeHtml };
