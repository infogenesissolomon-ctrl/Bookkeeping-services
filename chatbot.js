// Website chat assistant: a floating button that opens a chat panel. Common questions are answered here in the
// browser (FAQ mode); other questions go to /api/chat, which calls Gemini on the server. Callback requests go to
// /api/inquiries and never pass through the AI. Loaded on public pages by shared-navigation.js.
(() => {
  if (document.querySelector("[data-chatbot]")) return;
  const base = document.body.dataset.navigationBase || "";
  const BOOKING_URL = "https://calendar.app.google/zAW1LH43CHeXtq1j8";
  const STORE_KEY = "gs-chat";
  const MAX_CHARS = 800;

  const FAQ = [
    { q: "What services do you offer?", match: /\b(services?|offer|what do you do|help with)\b/i,
      a: "I offer bookkeeping and administrative support for small businesses:\n- Transaction management, bank & credit card reconciliation, accounts payable and receivable\n- Financial reporting support, monthly bookkeeping and month-end closing support\n- Catch-up & cleanup, job costing, and financial document management\n- Administrative support: data entry, document organization, recordkeeping and calendar management\nEach service has its own page under Bookkeeping Services." },
    { q: "How much does it cost?", match: /\b(price|pricing|cost|rate|rates|how much|fee|fees|charge)\b/i,
      a: "From the Pricing page:\n- Full-cycle bookkeeping support: starting at $10/hour\n- Administrative support: starting at $8/hour\n- Combined bookkeeping and admin support: custom quote\nThe monthly total depends on your hours and scope. A free consultation call is the best way to get a clear estimate." },
    { q: "Which industries do you work with?", match: /\b(industr(y|ies)|construction|real estate|landscap|roof|plumb|uber|realtor|lawyer|hvac|airbnb)\b/i,
      a: "I support Construction, Real Estate, Small Business, Landscaping & Lawn Care, Roofers, Plumbers, Uber Drivers, Real Estate Agents / Realtors, Lawyers, HVAC Technicians and Airbnb Hosts." },
    { q: "How does it work?", match: /\b(how does (it|this) work|process|get started|steps|onboard)\b/i,
      a: "1. We discuss your needs, current processes and records.\n2. I set up and organize files, folders and systems.\n3. I carry out the agreed services.\n4. I flag missing details or questions for you.\n5. You get regular updates and organized records to review." },
    { q: "Do you prepare taxes?", match: /\b(tax|taxes|irs|cpa|audit|legal)\b/i,
      a: "No. Tax preparation, tax filing, tax advice, legal advice, auditing and CPA services aren't offered. I can organize your records and prepare documents to hand off to your accountant or tax professional." },
    { q: "Book a consultation", match: /\b(book|schedule|appointment|consult|call|meeting)\b/i,
      a: `You can book a free consultation call here: ${BOOKING_URL}\nOr use "Request a callback" below and I'll get back to you.` },
  ];

  const icon = (path) => `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="${path}"/></svg>`;
  const root = document.createElement("div");
  root.className = "gc";
  root.dataset.chatbot = "";
  root.innerHTML = `
    <button class="gc-launch" type="button" aria-expanded="false" aria-controls="gc-panel">
      ${icon("M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12ZM8.5 12h.01M12 12h.01M15.5 12h.01")}<span class="gc-launch-label">Questions? Chat with me</span>
    </button>
    <section class="gc-panel" id="gc-panel" role="dialog" aria-modal="false" aria-labelledby="gc-title" hidden>
      <header class="gc-head">
        <img src="${base}assets/images/genesis-solomon-bookkeeper.jpg" alt="" width="40" height="40">
        <div><h2 id="gc-title">Genesis Solomon</h2><p>AI assistant · Bookkeeping &amp; admin support</p></div>
        <button class="gc-close" type="button" aria-label="Close chat">${icon("m18 6-12 12M6 6l12 12")}</button>
      </header>
      <div class="gc-log" role="log" aria-live="polite" aria-relevant="additions"></div>
      <div class="gc-chips" aria-label="Common questions"></div>
      <form class="gc-form" novalidate>
        <label class="gc-sr" for="gc-input">Your question</label>
        <textarea id="gc-input" rows="1" maxlength="${MAX_CHARS}" placeholder="Ask about services, pricing…" autocomplete="off"></textarea>
        <button class="gc-send" type="submit" aria-label="Send">${icon("M5 12h14m-7-7 7 7-7 7")}</button>
      </form>
      <div class="gc-foot">
        <button class="gc-link" type="button" data-gc-lead>Request a callback</button>
        <a class="gc-link" href="${BOOKING_URL}" target="_blank" rel="noopener">Book a consultation</a>
      </div>
      <p class="gc-note">AI answers can be wrong; please confirm details on a call. Don't share passwords, account numbers or financial documents here.</p>
    </section>`;
  document.body.append(root);

  const launch = root.querySelector(".gc-launch");
  const panel = root.querySelector(".gc-panel");
  const log = root.querySelector(".gc-log");
  const chips = root.querySelector(".gc-chips");
  const form = root.querySelector(".gc-form");
  const input = root.querySelector("#gc-input");
  const send = root.querySelector(".gc-send");
  let history = [];
  let busy = false;

  try { history = JSON.parse(sessionStorage.getItem(STORE_KEY) || "[]").filter((m) => m && typeof m.text === "string").slice(-20); } catch { history = []; }
  const save = () => { try { sessionStorage.setItem(STORE_KEY, JSON.stringify(history.slice(-20))); } catch { /* storage unavailable */ } };

  // Render text safely: plain text only, "- " lines become a list, and only booking or same-site links are clickable.
  const allowedLink = (url) => {
    try { const u = new URL(url, location.href); return u.href.startsWith(BOOKING_URL) || u.host === location.host; } catch { return false; }
  };
  function appendText(parent, text) {
    text.split(/(https?:\/\/[^\s)]+)/g).forEach((part, i) => {
      if (i % 2 && allowedLink(part)) {
        const a = document.createElement("a");
        a.href = part; a.textContent = part.startsWith(BOOKING_URL) ? "Book a consultation" : part;
        if (!part.includes(location.host)) { a.target = "_blank"; a.rel = "noopener"; }
        parent.append(a);
      } else {
        part.split(/\*\*(.+?)\*\*/g).forEach((chunk, j) => {
          if (j % 2) { const b = document.createElement("strong"); b.textContent = chunk; parent.append(b); } else parent.append(chunk);
        });
      }
    });
  }
  function bubble(role, text, extra = "") {
    const div = document.createElement("div");
    div.className = `gc-msg gc-msg--${role} ${extra}`.trim();
    let list = null;
    text.split("\n").forEach((line) => {
      const item = line.match(/^\s*(?:[-*•]|\d+\.)\s+(.*)/);
      if (item) {
        if (!list) { list = document.createElement(/^\s*\d/.test(line) ? "ol" : "ul"); div.append(list); }
        const li = document.createElement("li"); appendText(li, item[1]); list.append(li);
      } else if (line.trim()) {
        list = null;
        const p = document.createElement("p"); appendText(p, line); div.append(p);
      }
    });
    log.append(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function showChips() {
    chips.replaceChildren(...FAQ.map((item) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "gc-chip"; b.textContent = item.q;
      b.addEventListener("click", () => ask(item.q, item));
      return b;
    }));
  }

  function setBusy(state) {
    busy = state;
    send.disabled = state;
    input.setAttribute("aria-busy", String(state));
  }

  async function ask(text, faqItem) {
    const question = text.trim();
    if (!question || busy) return;
    if (question.length > MAX_CHARS) { bubble("bot", `Please keep your message under ${MAX_CHARS} characters.`, "gc-msg--error"); return; }
    bubble("user", question);
    history.push({ role: "user", text: question });
    input.value = ""; resize();
    // FAQ mode: answer common questions here, without calling the AI.
    const faq = faqItem || (question.length < 120 && FAQ.find((item) => item.match.test(question)));
    if (faq) {
      bubble("bot", faq.a);
      history.push({ role: "assistant", text: faq.a });
      save();
      return;
    }
    setBusy(true);
    const typing = bubble("bot", "Typing…", "gc-msg--typing");
    try {
      const response = await fetch(`${base}api/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-12) }),
      });
      const data = await response.json().catch(() => ({}));
      typing.remove();
      if (!response.ok || !data.reply) {
        bubble("bot", data.error || "Sorry, I couldn't answer just now. Please try again, or book a consultation call.", "gc-msg--error");
        history.pop();
      } else {
        bubble("bot", data.reply);
        history.push({ role: "assistant", text: data.reply });
      }
    } catch {
      typing.remove();
      bubble("bot", "I couldn't connect. Please check your internet connection and try again.", "gc-msg--error");
      history.pop();
    }
    save();
    setBusy(false);
  }

  // Callback request: collected with consent and sent to the existing inquiry endpoint (never to the AI).
  function leadForm() {
    if (log.querySelector(".gc-lead")) { log.querySelector(".gc-lead input").focus(); return; }
    const wrap = document.createElement("form");
    wrap.className = "gc-msg gc-msg--bot gc-lead";
    wrap.noValidate = true;
    const startedAt = Date.now();
    const id = (n) => `gc-lead-${n}`;
    wrap.innerHTML = `
      <p><strong>Request a callback</strong><br>Leave your details and I'll get back to you by email.</p>
      <label for="${id("name")}">Full name</label><input id="${id("name")}" name="full_name" autocomplete="name" maxlength="100" required>
      <label for="${id("email")}">Email</label><input id="${id("email")}" name="email" type="email" autocomplete="email" maxlength="254" required>
      <label for="${id("industry")}">Business type</label>
      <select id="${id("industry")}" name="industry" required><option value="" selected disabled>Choose one</option><option>Construction</option><option>Real Estate</option><option>Small Business</option><option>Landscaping &amp; Lawn Care</option><option>Other</option></select>
      <label for="${id("detail")}">Your business (optional)</label><input id="${id("detail")}" name="detail" maxlength="80" placeholder="e.g. plumbing, Airbnb hosting">
      <label for="${id("service")}">Service needed</label>
      <select id="${id("service")}" name="service_needed" required><option value="" selected disabled>Choose one</option><option>Bookkeeping Services</option><option>Administrative Support</option><option>Both Bookkeeping and Administrative Support</option><option>Other</option></select>
      <label for="${id("notes")}">Anything else? (optional)</label><textarea id="${id("notes")}" name="notes" rows="2" maxlength="600"></textarea>
      <div class="gc-hp" aria-hidden="true"><label for="${id("hp")}">Leave empty</label><input id="${id("hp")}" name="hp_field" tabindex="-1" autocomplete="off"></div>
      <label class="gc-consent"><input type="checkbox" name="consent" required> I agree that Genesis Solomon may contact me by email about this request.</label>
      <p class="gc-lead-error" role="alert"></p>
      <button class="gc-submit" type="submit">Send request</button>`;
    log.append(wrap);
    log.scrollTop = log.scrollHeight;
    wrap.querySelector("input").focus();
    const clientRef = window.crypto?.randomUUID ? window.crypto.randomUUID() : null;
    wrap.addEventListener("submit", async (event) => {
      event.preventDefault();
      const f = new FormData(wrap);
      const error = wrap.querySelector(".gc-lead-error");
      const value = (n) => String(f.get(n) || "").trim();
      const problem = !value("full_name") ? "Please enter your name."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email")) ? "Please enter a valid email address."
        : !value("industry") ? "Please choose your business type."
        : !value("service_needed") ? "Please choose the service you need."
        : !f.get("consent") ? "Please tick the box so I can contact you." : "";
      if (problem) { error.textContent = problem; return; }
      error.textContent = "";
      const button = wrap.querySelector(".gc-submit");
      button.disabled = true; button.textContent = "Sending…";
      const message = ["Callback request from the website chat assistant.", value("detail") && `Business: ${value("detail")}`, value("notes") && `Notes: ${value("notes")}`, "The visitor agreed to be contacted by email about this request."].filter(Boolean).join("\n");
      try {
        const response = await fetch(`${base}api/inquiries`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ full_name: value("full_name"), email: value("email"), industry: value("industry"), service_needed: value("service_needed"), message, hp_field: value("hp_field"), client_ref: clientRef, started_at: startedAt }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Your request couldn't be sent. Please try again or use the Contact page.");
        wrap.replaceWith(bubble("bot", "Thanks! Your request was received, and I'll reply by email. You can also book a consultation call anytime."));
      } catch (err) {
        error.textContent = err.message || "Your request couldn't be sent. Please try again or use the Contact page.";
        button.disabled = false; button.textContent = "Send request";
      }
    });
  }

  function resize() { input.style.height = "auto"; input.style.height = `${Math.min(input.scrollHeight, 120)}px`; }
  function open() {
    panel.hidden = false;
    root.classList.add("is-open");
    launch.setAttribute("aria-expanded", "true");
    if (!log.children.length) {
      if (history.length) history.forEach((m) => bubble(m.role === "user" ? "user" : "bot", m.text));
      else bubble("bot", "Hi! I'm Genesis's assistant. Ask me about bookkeeping or administrative support, pricing, or how to get started.");
      showChips();
    }
    input.focus();
  }
  function close() {
    panel.hidden = true;
    root.classList.remove("is-open");
    launch.setAttribute("aria-expanded", "false");
    launch.focus();
  }

  launch.addEventListener("click", () => (panel.hidden ? open() : close()));
  root.querySelector(".gc-close").addEventListener("click", close);
  root.querySelector("[data-gc-lead]").addEventListener("click", leadForm);
  panel.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
  input.addEventListener("input", resize);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); }
  });
  form.addEventListener("submit", (event) => { event.preventDefault(); ask(input.value); });
})();
