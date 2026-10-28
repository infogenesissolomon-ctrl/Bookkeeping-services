// Sends the "new inquiry" email to the site owner and records the outcome on the inquiry row.
// Never throws: a notification problem must not affect a saved inquiry.
const { patchRows } = require("./_supabase");
const { emailConfig, sendEmail, describeEmailError, inquiryNotification } = require("./_email");

async function notifyNewInquiry(config, inquiry) {
  const email = emailConfig();
  const record = (values) => patchRows(config, "inquiries", `id=eq.${inquiry.id}`, values).catch((error) => {
    console.error("notify: couldn't record notification status", error.message.slice(0, 200));
  });
  if (!email) {
    await record({ notification_status: "not_configured", notification_error: null });
    return "not_configured";
  }
  try {
    await sendEmail(email, { to: email.adminEmail, replyTo: inquiry.email, ...inquiryNotification(inquiry) });
  } catch (error) {
    console.error("notify: new inquiry notification failed", error.code || "", String(error.message).slice(0, 200));
    await record({ notification_status: "failed", notification_error: describeEmailError(error) });
    return "failed";
  }
  await record({ notification_status: "sent", notification_sent_at: new Date().toISOString(), notification_error: null });
  return "sent";
}

module.exports = { notifyNewInquiry };
