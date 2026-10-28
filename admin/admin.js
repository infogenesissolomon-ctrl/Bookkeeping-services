// Inquiries admin: Supabase Auth sign-in, then reads and updates inquiries through Supabase's REST API.
// Every request carries the signed-in user's token; row level security in the database decides what it may do.
// Sending email (replies, notification retries) goes through the admin-only /api functions, which check the same token.
// Inquiry text comes from the public, so it is only ever written into the page with textContent.
(() => {
  const SESSION_KEY = "gs-admin-session";
  const PAGE_SIZE = 10;
  const COLUMNS = "id,full_name,email,business_name,service_needed,industry,message,status,created_at,updated_at,notification_status,notification_sent_at,notification_attempted_at,notification_error";
  const REPLY_COLUMNS = "id,recipient_email,subject,reply_body,send_status,error,created_at,sent_at";
  const REPLY_LABELS = { sent: "Sent", failed: "Failed", sending: "Sending" };
  const NOTIFICATION_STALLED_MS = 2 * 60_000;
  const STATUS_LABELS = { new: "New", in_progress: "In Progress", replied: "Replied", closed: "Closed" };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const dateTime = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

  let config = null;
  let session = null;
  const filters = { q: "", service: "", industry: "", status: "", from: "", to: "" };
  let page = 0;
  let total = 0;
  let rows = [];
  let current = null;
  let searchTimer = 0;
  // Unsent reply drafts by inquiry id. clientRef identifies one send, so a retried request can't email twice.
  const drafts = new Map();
  let sendingReply = false;

  const show = (view) => {
    document.body.dataset.view = view;
    $("[data-loading]").hidden = view !== "loading";
    $("[data-login]").hidden = view !== "login";
    $("[data-dashboard]").hidden = view !== "dashboard";
    $("[data-config-error]").hidden = view !== "config-error";
  };
  const showError = (node, text) => { node.textContent = text || ""; node.hidden = !text; };
  const el = (tag, props = {}, ...children) => {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, value);
    });
    children.forEach((child) => node.append(child));
    return node;
  };
  const icon = (id) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#${id}`);
    svg.append(use);
    return svg;
  };
  const statusBadge = (status) => el("span", { class: `adm-badge adm-badge--${status}`, text: STATUS_LABELS[status] || status });

  // ---- Auth (Supabase GoTrue REST) ----
  const saveSession = (data) => {
    session = { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: data.expires_at || Math.floor(Date.now() / 1000) + (data.expires_in || 3600), email: data.user?.email || session?.email || "" };
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch {}
  };
  const clearSession = () => {
    session = null;
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  };
  const authRequest = async (path, body) => {
    const response = await fetch(`${config.url}/auth/v1/${path}`, { method: "POST", headers: { apikey: config.publishableKey, "content-type": "application/json" }, body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok, status: response.status, data };
  };
  const refreshSession = async () => {
    if (!session?.refresh_token) return false;
    const { ok, data } = await authRequest("token?grant_type=refresh_token", { refresh_token: session.refresh_token });
    if (!ok) return false;
    saveSession(data);
    return true;
  };

  class SignedOut extends Error {}

  // ---- Data (Supabase PostgREST) ----
  async function api(path, { method = "GET", headers = {}, body, retried = false } = {}) {
    if (!session) throw new SignedOut();
    if (session.expires_at - 60 < Date.now() / 1000 && !(await refreshSession())) throw new SignedOut();
    const response = await fetch(`${config.url}/rest/v1/${path}`, {
      method,
      headers: { apikey: config.publishableKey, authorization: `Bearer ${session.access_token}`, ...(body ? { "content-type": "application/json" } : {}), ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (response.status === 401 && !retried) {
      if (await refreshSession()) return api(path, { method, headers, body, retried: true });
      throw new SignedOut();
    }
    if (response.status === 401) throw new SignedOut();
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    return response;
  }
  // Calls an admin-only Vercel function with the session token. Resolves with { ok, status, data }.
  async function serverPost(path, body, retried = false) {
    if (!session) throw new SignedOut();
    if (session.expires_at - 60 < Date.now() / 1000 && !(await refreshSession())) throw new SignedOut();
    const response = await fetch(`/api/${path}`, { method: "POST", headers: { authorization: `Bearer ${session.access_token}`, "content-type": "application/json" }, body: JSON.stringify(body) });
    if (response.status === 401) {
      if (!retried && (await refreshSession())) return serverPost(path, body, true);
      throw new SignedOut();
    }
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok, status: response.status, data };
  }
  const countFrom = (response) => Number((response.headers.get("content-range") || "*/0").split("/")[1]) || 0;

  async function isAdmin() {
    const response = await api("rpc/is_admin", { method: "POST", body: {} });
    return (await response.json()) === true;
  }

  function listQuery() {
    const params = new URLSearchParams({ select: COLUMNS, order: "created_at.desc" });
    if (filters.status) params.append("status", `eq.${filters.status}`);
    if (filters.service) params.append("service_needed", `eq.${filters.service}`);
    if (filters.industry) params.append("industry", `eq.${filters.industry}`);
    if (filters.from) params.append("created_at", `gte.${new Date(`${filters.from}T00:00:00`).toISOString()}`);
    if (filters.to) {
      const end = new Date(`${filters.to}T00:00:00`);
      end.setDate(end.getDate() + 1);
      params.append("created_at", `lt.${end.toISOString()}`);
    }
    // Characters with meaning in PostgREST filter syntax are dropped from the search text.
    const q = filters.q.replace(/[,()*:"\\%]/g, " ").trim();
    if (q) params.append("or", `(full_name.ilike.*${q}*,email.ilike.*${q}*,business_name.ilike.*${q}*)`);
    return params.toString();
  }

  // ---- Rendering ----
  async function loadCounts() {
    const views = { all: "", new: "&status=eq.new", in_progress: "&status=eq.in_progress", replied: "&status=eq.replied", closed: "&status=eq.closed" };
    const results = await Promise.all(Object.entries(views).map(async ([key, filter]) => {
      const response = await api(`inquiries?select=id${filter}`, { method: "HEAD", headers: { prefer: "count=exact" } });
      return [key, countFrom(response)];
    }));
    results.forEach(([key, count]) => $$(`[data-count="${key}"]`).forEach((node) => { node.textContent = String(count); }));
  }

  // Typing in search can start several requests; only the latest one may update the table.
  let listRequest = 0;
  async function loadList() {
    const request = ++listRequest;
    const listError = $("[data-list-error]");
    showError(listError, "");
    const from = page * PAGE_SIZE;
    const response = await api(`inquiries?${listQuery()}`, { headers: { prefer: "count=exact", "range-unit": "items", range: `${from}-${from + PAGE_SIZE - 1}` } });
    const data = await response.json();
    if (request !== listRequest) return;
    rows = data;
    total = countFrom(response);
    if (!rows.length && total > 0 && page > 0) {
      page = Math.max(0, Math.ceil(total / PAGE_SIZE) - 1);
      return loadList();
    }
    renderRows();
  }

  function renderRows() {
    const body = $("[data-rows]");
    body.replaceChildren(...rows.map((row) => {
      const tr = el("tr", { class: current?.id === row.id ? "is-selected" : "" });
      tr.append(
        el("td", { "data-label": "Name", class: "adm-strong", text: row.full_name }),
        el("td", { "data-label": "Email", text: row.email }),
        el("td", { "data-label": "Business", text: row.business_name || "—" }),
        el("td", { "data-label": "Service", text: row.service_needed }),
        el("td", { "data-label": "Industry", text: row.industry }),
        el("td", { "data-label": "Received", text: dateTime.format(new Date(row.created_at)) }),
        el("td", { "data-label": "Status" }, statusBadge(row.status)),
      );
      const view = el("button", { type: "button", class: "adm-icon-btn", "aria-label": `View inquiry from ${row.full_name}` }, icon("a-eye"));
      view.addEventListener("click", () => openDetail(row, view));
      const reply = el("button", { type: "button", class: "adm-icon-btn", "aria-label": `Reply to ${row.full_name}` }, icon("a-mail"));
      reply.addEventListener("click", () => { openDetail(row, reply); openReply(); });
      tr.append(el("td", { class: "adm-actions", "data-label": "Actions" }, view, reply));
      return tr;
    }));
    const filtered = Object.values(filters).some(Boolean);
    $("[data-empty]").hidden = rows.length > 0;
    $(".adm-table").hidden = rows.length === 0;
    $("[data-empty-title]").textContent = filtered ? "No inquiries match these filters" : "No inquiries yet";
    $("[data-empty-text]").textContent = filtered ? "Try a different search or clear the filters." : "Inquiries sent through the Contact page will appear here.";
    const first = total ? page * PAGE_SIZE + 1 : 0;
    $("[data-range]").textContent = total ? `Showing ${first}–${first + rows.length - 1} of ${total}` : "";
    $('[data-page="prev"]').disabled = page === 0;
    $('[data-page="next"]').disabled = (page + 1) * PAGE_SIZE >= total;
    $$("[data-view-status]").forEach((button) => button.setAttribute("aria-current", String(button.dataset.viewStatus === filters.status)));
  }

  let detailOpener = null;
  function openDetail(row, opener) {
    current = row;
    detailOpener = opener || null;
    const detail = $("[data-detail]");
    $$("[data-field]", detail).forEach((node) => {
      const key = node.dataset.field;
      node.textContent = key === "created_at" ? dateTime.format(new Date(row.created_at)) : (row[key] || "—");
    });
    $("[data-detail-status]").value = row.status;
    renderNotification(row);
    $("[data-copy-email] span").textContent = "Copy";
    showError($("[data-detail-error]"), "");
    $("[data-detail-saved]").textContent = "";
    showReplyForm(false);
    detail.hidden = false;
    $("[data-detail-backdrop]").hidden = false;
    document.body.classList.add("adm-detail-open");
    renderRows();
    detail.focus();
    loadReplies(row.id);
  }
  function closeDetail() {
    if (sendingReply) return;
    current = null;
    showReplyForm(false);
    $("[data-detail]").hidden = true;
    $("[data-detail-backdrop]").hidden = true;
    document.body.classList.remove("adm-detail-open");
    renderRows();
    if (detailOpener?.isConnected) detailOpener.focus();
  }

  function renderNotification(row) {
    const text = $("[data-notification-text]");
    const retry = $("[data-notification-retry]");
    const stalled = row.notification_status === "sending" && Date.now() - new Date(row.notification_attempted_at || 0) > NOTIFICATION_STALLED_MS;
    const messages = {
      sent: `Sent ${row.notification_sent_at ? dateTime.format(new Date(row.notification_sent_at)) : ""}`.trim(),
      sending: stalled ? "Didn’t finish sending." : "Sending…",
      failed: `Failed: ${row.notification_error || "the email couldn’t be sent."}`,
      not_configured: "Not sent: email wasn’t set up when this arrived.",
    };
    text.textContent = messages[row.notification_status] || "—";
    retry.hidden = !(row.notification_status === "failed" || row.notification_status === "not_configured" || stalled);
    $("span", retry).textContent = row.notification_status === "not_configured" ? "Send now" : "Retry";
  }

  async function reloadCurrent() {
    if (!current) return;
    const id = current.id;
    const [row] = await (await api(`inquiries?id=eq.${id}&select=${COLUMNS}`)).json();
    if (!row || current?.id !== id) return;
    current = row;
    $("[data-detail-status]").value = row.status;
    renderNotification(row);
  }

  let repliesRequest = 0;
  async function loadReplies(inquiryId) {
    const request = ++repliesRequest;
    const list = $("[data-replies]");
    const empty = $("[data-replies-empty]");
    list.replaceChildren();
    $("[data-reply-count]").textContent = "";
    empty.textContent = "Loading replies…";
    empty.hidden = false;
    try {
      const replies = await (await api(`inquiry_replies?inquiry_id=eq.${inquiryId}&select=${REPLY_COLUMNS}&order=created_at.desc`)).json();
      if (request !== repliesRequest) return;
      $("[data-reply-count]").textContent = replies.length ? `(${replies.length})` : "";
      empty.textContent = "No replies sent yet.";
      empty.hidden = replies.length > 0;
      list.replaceChildren(...replies.map((reply) => {
        const status = el("span", { class: `adm-badge adm-badge--reply-${reply.send_status}`, text: REPLY_LABELS[reply.send_status] || reply.send_status });
        const when = el("time", { datetime: reply.sent_at || reply.created_at, text: dateTime.format(new Date(reply.sent_at || reply.created_at)) });
        const body = el("details", {}, el("summary", { text: reply.subject }), el("p", { text: reply.reply_body }));
        const item = el("li", { class: "adm-reply-item" }, el("div", { class: "adm-reply-meta" }, status, when), body);
        if (reply.send_status === "failed" && reply.error) item.append(el("p", { class: "adm-reply-error", text: reply.error }));
        return item;
      }));
    } catch (error) {
      if (request !== repliesRequest) return;
      empty.textContent = "Replies couldn’t be loaded.";
      if (error instanceof SignedOut) handleError(error);
    }
  }

  function showReplyForm(open) {
    $("[data-detail-view]").hidden = open;
    $("[data-reply-form]").hidden = !open;
    $("[data-detail-title]").textContent = open && current ? `Reply to ${current.full_name}` : "Inquiry Details";
  }

  function openReply() {
    if (!current) return;
    const firstName = current.full_name.split(" ")[0];
    const draft = drafts.get(current.id) || {
      subject: "Re: Your Bookkeeping Inquiry",
      message: `Hi ${firstName},\n\nThank you for reaching out. \n\nBest regards,\nGenesis Solomon`,
      clientRef: null,
    };
    drafts.set(current.id, draft);
    const form = $("[data-reply-form]");
    $("[data-reply-to]").value = current.email;
    form.subject.value = draft.subject;
    form.message.value = draft.message;
    showError($("[data-reply-error]"), "");
    showReplyForm(true);
    form.message.focus();
    const caret = draft.message.indexOf("\n\nBest regards");
    if (caret > 0) form.message.setSelectionRange(caret, caret);
  }

  async function sendReply(event) {
    event.preventDefault();
    if (!current || sendingReply) return;
    const form = event.currentTarget;
    const inquiry = current;
    const draft = drafts.get(inquiry.id);
    const errorNode = $("[data-reply-error]");
    draft.subject = form.subject.value;
    draft.message = form.message.value;
    if (!draft.subject.trim()) { showError(errorNode, "Please enter a subject."); return form.subject.focus(); }
    if (!draft.message.trim()) { showError(errorNode, "Please write a message."); return form.message.focus(); }
    draft.clientRef ||= crypto.randomUUID();
    sendingReply = true;
    const button = $("[data-reply-send]");
    button.disabled = true;
    $("[data-reply-cancel]").disabled = true;
    $("span", button).textContent = "Sending…";
    showError(errorNode, "");
    try {
      const { ok, status, data } = await serverPost("replies", { inquiry_id: inquiry.id, subject: draft.subject, message: draft.message, client_ref: draft.clientRef });
      if (ok) {
        drafts.delete(inquiry.id);
        if (current?.id === inquiry.id) {
          showReplyForm(false);
          $("[data-detail-saved]").textContent = data.warning || `Reply sent to ${inquiry.email}. Gmail accepted it for delivery; that doesn’t guarantee it reached their inbox.`;
          await reloadCurrent().catch(() => {});
          loadReplies(inquiry.id);
        }
        await refreshAll();
        return;
      }
      // A recorded failure, or a request rejected before anything was saved, means the next click is a new attempt.
      // "Already being sent" keeps the same id so it can't go out twice.
      if (data.reply?.send_status === "failed" || (status === 400 && !data.reply)) draft.clientRef = null;
      showError(errorNode, `${data.error || "The reply couldn’t be sent."} Your draft is kept, so you can try again.`);
      if (current?.id === inquiry.id) loadReplies(inquiry.id);
    } catch (error) {
      // The request may or may not have reached the server, so the same id is reused: a retry can't send twice.
      if (error instanceof SignedOut) return handleError(error);
      showError(errorNode, "Couldn’t reach the server. Your draft is kept; click Send Reply again and it won’t be sent twice.");
    } finally {
      sendingReply = false;
      button.disabled = false;
      $("[data-reply-cancel]").disabled = false;
      $("span", button).textContent = "Send Reply";
    }
  }

  async function refreshAll() {
    try {
      await Promise.all([loadCounts(), loadList()]);
    } catch (error) {
      handleError(error, $("[data-list-error]"), "Inquiries couldn’t be loaded. Check your connection and try Refresh.");
    }
  }

  function handleError(error, node, text) {
    if (error instanceof SignedOut) return signOut("Your session has ended. Please sign in again.");
    showError(node, text);
  }

  // ---- Session flow ----
  async function enterDashboard() {
    $("[data-account-email]").textContent = session.email;
    show("dashboard");
    await refreshAll();
  }

  async function signOut(message) {
    const token = session?.access_token;
    clearSession();
    closeDetail();
    if (token) fetch(`${config.url}/auth/v1/logout`, { method: "POST", headers: { apikey: config.publishableKey, authorization: `Bearer ${token}` } }).catch(() => {});
    $("[data-login-form]").reset();
    showError($("[data-login-error]"), message || "");
    show("login");
    $("#login-email").focus();
  }

  async function start() {
    try {
      const response = await fetch("/api/admin-config", { cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url || !data.publishableKey) throw new Error(data.error || "Admin sign-in is not configured yet.");
      config = data;
    } catch (error) {
      $("[data-config-error-text]").textContent = `${error.message} See docs/INQUIRY-SYSTEM-SETUP.md for the setup steps.`;
      return show("config-error");
    }
    try { session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { session = null; }
    if (session) {
      try {
        if (await isAdmin()) return enterDashboard();
      } catch {}
      clearSession();
    }
    show("login");
  }

  // ---- Events ----
  $("[data-login-form]").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const errorNode = $("[data-login-error]");
    const button = $("[data-login-submit]");
    const email = form.email.value.trim();
    const password = form.password.value;
    if (!email || !password) return showError(errorNode, "Enter your email address and password.");
    button.disabled = true;
    button.textContent = "Signing in…";
    showError(errorNode, "");
    try {
      const { ok, status, data } = await authRequest("token?grant_type=password", { email, password });
      if (!ok) throw new Error(status === 400 || status === 401 ? "Email or password is incorrect." : status === 429 ? "Too many sign-in attempts. Please wait a few minutes." : "Sign-in failed. Please try again.");
      saveSession(data);
      if (!(await isAdmin())) {
        await signOut("This account isn’t authorized to view inquiries.");
        return;
      }
      form.password.value = "";
      await enterDashboard();
    } catch (error) {
      clearSession();
      showError(errorNode, error instanceof TypeError ? "Couldn’t reach the sign-in service. Check your connection." : error.message);
    } finally {
      button.disabled = false;
      button.textContent = "Sign in";
    }
  });

  $("[data-logout]").addEventListener("click", () => signOut());
  $("[data-refresh]").addEventListener("click", refreshAll);

  $$("[data-filter]").forEach((input) => {
    const apply = () => {
      filters[input.dataset.filter] = input.value;
      page = 0;
      loadList().catch((error) => handleError(error, $("[data-list-error]"), "Inquiries couldn’t be loaded. Try again."));
    };
    if (input.dataset.filter === "q") input.addEventListener("input", () => { clearTimeout(searchTimer); searchTimer = setTimeout(apply, 300); });
    else input.addEventListener("change", apply);
  });
  $("[data-clear-filters]").addEventListener("click", () => {
    Object.keys(filters).forEach((key) => { filters[key] = ""; });
    $$("[data-filter]").forEach((input) => { input.value = ""; });
    page = 0;
    loadList().catch((error) => handleError(error, $("[data-list-error]"), "Inquiries couldn’t be loaded. Try again."));
  });
  $$("[data-view-status]").forEach((button) => button.addEventListener("click", () => {
    filters.status = button.dataset.viewStatus;
    $('[data-filter="status"]').value = filters.status;
    page = 0;
    loadList().catch((error) => handleError(error, $("[data-list-error]"), "Inquiries couldn’t be loaded. Try again."));
  }));
  $$("[data-page]").forEach((button) => button.addEventListener("click", () => {
    page += button.dataset.page === "next" ? 1 : -1;
    loadList().catch((error) => handleError(error, $("[data-list-error]"), "Inquiries couldn’t be loaded. Try again."));
  }));

  $("[data-detail-close]").addEventListener("click", closeDetail);
  $("[data-detail-backdrop]").addEventListener("click", closeDetail);
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !current || sendingReply) return;
    if (!$("[data-reply-form]").hidden) showReplyForm(false);
    else closeDetail();
  });

  $("[data-copy-email]").addEventListener("click", async () => {
    const label = $("[data-copy-email] span");
    try {
      await navigator.clipboard.writeText(current.email);
      label.textContent = "Copied";
    } catch {
      label.textContent = "Copy failed";
    }
  });

  $("[data-detail-status]").addEventListener("change", async (event) => {
    const select = event.currentTarget;
    if (!current) return;
    const status = select.value;
    const previous = current.status;
    select.disabled = true;
    showError($("[data-detail-error]"), "");
    $("[data-detail-saved]").textContent = "";
    try {
      const response = await api(`inquiries?id=eq.${current.id}&select=${COLUMNS}`, { method: "PATCH", headers: { prefer: "return=representation" }, body: { status } });
      const [updated] = await response.json();
      if (!updated) throw new Error("not updated");
      current = updated;
      $("[data-detail-saved]").textContent = `Status saved as ${STATUS_LABELS[status]}.`;
      await refreshAll();
    } catch (error) {
      select.value = previous;
      handleError(error, $("[data-detail-error]"), "The status couldn’t be saved. Please try again.");
    } finally {
      select.disabled = false;
    }
  });

  $("[data-reply-open]").addEventListener("click", openReply);
  $("[data-reply-form]").addEventListener("submit", sendReply);
  $("[data-reply-form]").addEventListener("input", (event) => {
    const draft = current && drafts.get(current.id);
    if (draft && (event.target.name === "subject" || event.target.name === "message")) draft[event.target.name] = event.target.value;
  });
  $("[data-reply-cancel]").addEventListener("click", () => {
    showReplyForm(false);
    $("[data-reply-open]").focus();
  });

  $("[data-notification-retry]").addEventListener("click", async (event) => {
    if (!current) return;
    const button = event.currentTarget;
    button.disabled = true;
    showError($("[data-detail-error]"), "");
    $("[data-detail-saved]").textContent = "";
    try {
      const { ok, data } = await serverPost("retry-notification", { inquiry_id: current.id });
      if (ok) $("[data-detail-saved]").textContent = "Notification email sent to you.";
      else showError($("[data-detail-error]"), data.error || "The notification couldn’t be sent.");
      await reloadCurrent();
    } catch (error) {
      handleError(error, $("[data-detail-error]"), "Couldn’t reach the server. Please try again.");
    } finally {
      button.disabled = false;
    }
  });

  $("[data-delete]").addEventListener("click", async () => {
    if (!current) return;
    if (!window.confirm(`Delete the inquiry from ${current.full_name}? This can’t be undone.`)) return;
    const button = $("[data-delete]");
    button.disabled = true;
    try {
      const response = await api(`inquiries?id=eq.${current.id}&select=id`, { method: "DELETE", headers: { prefer: "return=representation" } });
      const deleted = await response.json();
      if (!deleted.length) throw new Error("not deleted");
      closeDetail();
      await refreshAll();
    } catch (error) {
      handleError(error, $("[data-detail-error]"), "The inquiry couldn’t be deleted. Please try again.");
    } finally {
      button.disabled = false;
    }
  });

  start();
})();
