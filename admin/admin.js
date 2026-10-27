// Inquiries admin: Supabase Auth sign-in, then reads and updates inquiries through Supabase's REST API.
// Every request carries the signed-in user's token; row level security in the database decides what it may do.
// Inquiry text comes from the public, so it is only ever written into the page with textContent.
(() => {
  const SESSION_KEY = "gs-admin-session";
  const PAGE_SIZE = 10;
  const COLUMNS = "id,full_name,email,business_name,service_needed,industry,message,status,created_at,updated_at";
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
      const reply = el("a", { class: "adm-icon-btn", href: replyLink(row), "aria-label": `Reply to ${row.full_name} by email` }, icon("a-mail"));
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

  const replyLink = (row) => `mailto:${encodeURIComponent(row.email).replace(/%40/g, "@")}?subject=${encodeURIComponent(`Re: Your inquiry about ${row.service_needed}`)}&body=${encodeURIComponent(`Hi ${row.full_name},\n\nThank you for reaching out.\n\n`)}`;

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
    $("[data-reply]").href = replyLink(row);
    $("[data-copy-email] span").textContent = "Copy";
    showError($("[data-detail-error]"), "");
    $("[data-detail-saved]").textContent = "";
    detail.hidden = false;
    $("[data-detail-backdrop]").hidden = false;
    document.body.classList.add("adm-detail-open");
    renderRows();
    detail.focus();
  }
  function closeDetail() {
    current = null;
    $("[data-detail]").hidden = true;
    $("[data-detail-backdrop]").hidden = true;
    document.body.classList.remove("adm-detail-open");
    renderRows();
    if (detailOpener?.isConnected) detailOpener.focus();
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
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && current) closeDetail(); });

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
