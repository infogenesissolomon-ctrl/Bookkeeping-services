const menuToggle = document.querySelector(".menu-toggle");
const navLinks = [...document.querySelectorAll(".site-navigation a")];
document.body.classList.add("menu-ready");

function closeMenu() {
  document.body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open navigation");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

if ("IntersectionObserver" in window) {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealTargets = document.querySelectorAll(
      ".about-section, .services-section, .admin-section, .industries-section, .tools-section, .process-section, .values-section, .expectations-section, .contact-section, .work-samples-section",
    );
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

    revealTargets.forEach((target) => {
      target.classList.add("reveal-on-scroll");
      revealObserver.observe(target);
    });
    document.body.classList.add("motion-ready");
  }
}

const workSample = document.querySelector("[data-work-sample]");
if (workSample) {
  const playButton = workSample.querySelector("[data-sample-play]");
  const pauseButton = workSample.querySelector("[data-sample-pause]");
  const replayButton = workSample.querySelector("[data-sample-replay]");
  const status = workSample.querySelector("[data-sample-status]");
  const transactionRows = [...workSample.querySelectorAll("[data-transaction-row]")];
  const categoryRows = [...workSample.querySelectorAll("[data-category-row]")];
  const reconciliationRows = [...workSample.querySelectorAll("[data-reconcile-row]")];
  const ledgerRows = [...workSample.querySelectorAll("[data-ledger-row]")];
  const apRows = [...workSample.querySelectorAll("[data-ap-row]")];
  const arRows = [...workSample.querySelectorAll("[data-ar-row]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const stageOrder = ["transactions", "categorization", "reconciliation", "payables", "reports"];
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  const demoBatches = [
    {
      date: "May",
      openingCash: 4004.15,
      receivables: 1200,
      liabilities: 765,
      discrepancy: 42,
      transactions: [
        { date: "02", description: "Sample sales", category: "Sales income", income: 4850, expense: 0 },
        { date: "05", description: "Office supplies", category: "Office expense", income: 0, expense: 126.4 },
        { date: "08", description: "Electric utility", category: "Utilities", income: 0, expense: 218.75 },
        { date: "12", description: "Cloud software", category: "Software", income: 0, expense: 89 },
      ],
      bills: [["Office supply vendor", "20", 126.4, "Paid"], ["Utility provider", "24", 218.75, "Awaiting payment"], ["Software supplier", "28", 89, "Due soon"]],
      invoices: [["Sample customer A", "18", 2850, "Paid"], ["Sample customer B", "26", 1200, "Outstanding"], ["Sample customer C", "30", 800, "Sent"]],
      bars: [78, 34, 57, 46, 88],
      cashBars: [45, 64, 54, 82, 72],
    },
    {
      date: "June",
      openingCash: 3250,
      receivables: 1540,
      liabilities: 1120,
      discrepancy: 35.5,
      transactions: [
        { date: "03", description: "Service invoice", category: "Service income", income: 6225, expense: 0 },
        { date: "06", description: "Fuel and materials", category: "Vehicle expense", income: 0, expense: 340.5 },
        { date: "10", description: "Mobile service", category: "Utilities", income: 0, expense: 286.75 },
        { date: "14", description: "Accounting software", category: "Software", income: 0, expense: 161 },
      ],
      bills: [["Fuel supplier", "21", 340.5, "Paid"], ["Mobile provider", "25", 286.75, "Awaiting payment"], ["Software supplier", "29", 161, "Due soon"]],
      invoices: [["Sample customer D", "17", 3100, "Paid"], ["Sample customer E", "26", 1540, "Outstanding"], ["Sample customer F", "30", 900, "Sent"]],
      bars: [83, 41, 63, 52, 91],
      cashBars: [50, 69, 58, 86, 76],
    },
    {
      date: "July",
      openingCash: 5080,
      receivables: 875,
      liabilities: 2100,
      discrepancy: 68,
      transactions: [
        { date: "01", description: "Project deposit", category: "Project income", income: 7320, expense: 0 },
        { date: "04", description: "Printer paper", category: "Office expense", income: 0, expense: 94.6 },
        { date: "09", description: "Internet service", category: "Utilities", income: 0, expense: 119.99 },
        { date: "16", description: "Cloud storage", category: "Software", income: 0, expense: 34 },
      ],
      bills: [["Print supplier", "19", 94.6, "Paid"], ["Internet provider", "24", 119.99, "Awaiting payment"], ["Cloud storage", "28", 34, "Due soon"]],
      invoices: [["Sample customer G", "16", 2400, "Paid"], ["Sample customer H", "25", 875, "Outstanding"], ["Sample customer I", "30", 650, "Sent"]],
      bars: [90, 38, 69, 48, 95],
      cashBars: [61, 75, 64, 90, 80],
    },
    {
      date: "August",
      openingCash: 2400,
      receivables: 600,
      liabilities: 920,
      discrepancy: 27.25,
      transactions: [
        { date: "02", description: "Client invoice", category: "Service income", income: 3950, expense: 0 },
        { date: "07", description: "Printer supplies", category: "Office expense", income: 0, expense: 195.3 },
        { date: "11", description: "Power bill", category: "Utilities", income: 0, expense: 247.8 },
        { date: "19", description: "File backup plan", category: "Software", income: 0, expense: 69 },
      ],
      bills: [["Print supplier", "22", 195.3, "Paid"], ["Power provider", "25", 247.8, "Awaiting payment"], ["Backup provider", "29", 69, "Due soon"]],
      invoices: [["Sample customer J", "18", 1875, "Paid"], ["Sample customer K", "26", 600, "Outstanding"], ["Sample customer L", "30", 540, "Sent"]],
      bars: [70, 35, 58, 43, 84],
      cashBars: [40, 58, 49, 73, 68],
    },
  ];
  let running = false;
  let manuallyPaused = false;
  let runId = 0;
  let batchIndex = 0;
  let activeDelay = null;
  let currentStatus = "Recording and categorizing the example transactions.";

  const isPaused = () => manuallyPaused || document.hidden;

  const setProgress = (percent) => {
    workSample.style.setProperty("--workflow-progress", `${percent}%`);
  };

  const setValue = (selector, value) => {
    const element = workSample.querySelector(selector);
    if (element) element.textContent = value;
  };

  const setLeadingValue = (selector, value) => {
    const element = workSample.querySelector(selector);
    if (element?.firstChild) element.firstChild.nodeValue = `${value} `;
  };

  const getTotals = (batch) => {
    const income = batch.transactions.reduce((sum, transaction) => sum + transaction.income, 0);
    const expenses = batch.transactions.reduce((sum, transaction) => sum + transaction.expense, 0);
    const net = income - expenses;
    const cash = batch.openingCash + net;
    const assets = cash + batch.receivables;
    return { income, expenses, net, cash, assets, equity: assets - batch.liabilities };
  };

  const updateDemoData = (batch) => {
    const totals = getTotals(batch);
    transactionRows.forEach((row, index) => {
      const transaction = batch.transactions[index];
      const cells = row.cells;
      cells[0].textContent = `${batch.date} ${transaction.date}`;
      cells[1].textContent = transaction.description;
      cells[2].textContent = transaction.income ? money.format(transaction.income) : "—";
      cells[2].classList.toggle("amount-positive", Boolean(transaction.income));
      cells[3].textContent = transaction.expense ? money.format(transaction.expense) : "—";
      row.querySelector("[data-record-status]").textContent = "Waiting";
    });

    categoryRows.forEach((row, index) => {
      const transaction = batch.transactions[index];
      row.querySelector("[data-category-description]").textContent = transaction.description;
      row.querySelector("[data-category-name]").textContent = transaction.category;
      row.querySelector("[data-category-amount]").textContent = money.format(transaction.income || transaction.expense);
      row.classList.remove("is-categorized");
    });

    const reconciledTransactions = batch.transactions.slice(0, ledgerRows.length);
    const reconciliationNames = ["Sample deposit", "Sample expense", "Sample utility"];
    reconciliationRows.forEach((row, index) => {
      const isUnmatched = index === reconciliationRows.length - 1;
      const transaction = isUnmatched ? null : reconciledTransactions[index];
      const amount = isUnmatched ? batch.discrepancy : transaction.income || transaction.expense;
      const description = isUnmatched ? "Unidentified bank charge" : `${reconciliationNames[index]} · ${transaction.description}`;
      row.querySelector("[data-reconcile-description]").textContent = description;
      row.querySelector("[data-reconcile-detail]").textContent = isUnmatched
        ? `${batch.date} 15 · ${money.format(amount)}`
        : `${batch.date} ${transaction.date} · ${money.format(amount)}`;
      row.classList.toggle("is-review", isUnmatched);
      row.classList.remove("is-matched", "is-processing");
      row.querySelector(".reconciliation-status").textContent = isUnmatched ? "Needs Review" : "Pending";
    });
    ledgerRows.forEach((row, index) => {
      const transaction = reconciledTransactions[index];
      row.querySelector("[data-ledger-description]").textContent = `${reconciliationNames[index]} · ${transaction.description}`;
      row.querySelector("[data-ledger-detail]").textContent = `${batch.date} ${transaction.date} · ${money.format(transaction.income || transaction.expense)}`;
      row.classList.remove("is-matched", "is-processing");
      row.querySelector(".ledger-status").textContent = "Awaiting match";
    });
    const matchedTotal = reconciledTransactions.reduce(
      (sum, transaction) => sum + transaction.income + transaction.expense,
      0,
    );
    setValue("[data-reconcile-count]", `${ledgerRows.length} of ${ledgerRows.length}`);
    setValue("[data-reconcile-total]", money.format(matchedTotal));
    setValue("[data-reconcile-review]", money.format(batch.discrepancy));
    apRows.forEach((row, index) => {
      const [name, dueDate, amount, paymentStatus] = batch.bills[index];
      row.querySelector("[data-ap-name]").textContent = name;
      row.querySelector("[data-ap-detail]").textContent = `Bill due ${batch.date} ${dueDate} · Total ${money.format(amount)}`;
      const label = row.querySelector("[data-ap-status]");
      label.textContent = paymentStatus;
      label.classList.toggle("ap-ar-status--paid", paymentStatus === "Paid");
      row.classList.remove("is-processed");
    });
    arRows.forEach((row, index) => {
      const [name, dueDate, amount, paymentStatus] = batch.invoices[index];
      row.querySelector("[data-ar-name]").textContent = name;
      row.querySelector("[data-ar-detail]").textContent = `Invoice due ${batch.date} ${dueDate} · ${paymentStatus === "Outstanding" ? "Outstanding" : "Total"} ${money.format(amount)}`;
      const label = row.querySelector("[data-ar-status]");
      label.textContent = paymentStatus;
      label.classList.toggle("ap-ar-status--paid", paymentStatus === "Paid");
      row.classList.remove("is-processed");
    });

    setValue("[data-demo-income]", money.format(totals.income));
    setValue("[data-demo-expenses]", money.format(totals.expenses));
    setValue("[data-demo-net]", money.format(totals.net));
    setLeadingValue("[data-demo-report-net]", money.format(totals.net));
    setLeadingValue("[data-demo-assets]", money.format(totals.assets));
    setLeadingValue("[data-demo-ending-cash]", money.format(totals.cash));
    setValue("[data-demo-report-income]", money.format(totals.income));
    setValue("[data-demo-report-expenses]", money.format(totals.expenses));
    setValue("[data-demo-cash]", money.format(totals.cash));
    setValue("[data-demo-receivables]", money.format(batch.receivables));
    setValue("[data-demo-liabilities]", money.format(batch.liabilities));
    setValue("[data-demo-equity]", money.format(totals.equity));
    setValue("[data-demo-opening-cash]", money.format(batch.openingCash));
    setValue("[data-demo-net-flow]", `+${money.format(totals.net)}`);
    workSample.querySelectorAll(".sample-chart:not(.sample-chart--cash) span").forEach((bar, index) => {
      bar.style.setProperty("--bar-height", `${batch.bars[index]}%`);
    });
    workSample.querySelectorAll(".sample-chart--cash span").forEach((bar, index) => {
      bar.style.setProperty("--bar-height", `${batch.cashBars[index]}%`);
    });
  };

  const setStage = (stage) => {
    const activeIndex = stageOrder.indexOf(stage);
    workSample.querySelectorAll("[data-work-stage]").forEach((panel) => {
      const isCurrent = panel.dataset.workStage === stage;
      panel.classList.toggle("is-current", isCurrent);
      panel.hidden = !isCurrent && !reducedMotion.matches;
    });
    workSample.querySelectorAll("[data-stage-indicator]").forEach((indicator) => {
      const index = stageOrder.indexOf(indicator.dataset.stageIndicator);
      indicator.classList.toggle("is-current", index === activeIndex);
      indicator.classList.toggle("is-complete", index < activeIndex);
      if (index === activeIndex) indicator.setAttribute("aria-current", "step");
      else indicator.removeAttribute("aria-current");
    });
  };

  const wait = (duration, expectedRun) => new Promise((resolve) => {
    const delay = { remaining: duration, startedAt: 0, timer: null, resolve };
    const finish = () => {
      if (activeDelay !== delay) return;
      delay.timer = null;
      activeDelay = null;
      resolve(expectedRun === runId);
    };
    delay.schedule = () => {
      if (delay.timer) window.clearTimeout(delay.timer);
      delay.startedAt = Date.now();
      delay.timer = window.setTimeout(finish, delay.remaining);
    };
    activeDelay = delay;
    if (!isPaused()) delay.schedule();
  });

  const updateControls = () => {
    playButton.disabled = reducedMotion.matches || (running && !manuallyPaused);
    pauseButton.disabled = !running || reducedMotion.matches;
    replayButton.disabled = reducedMotion.matches;
    playButton.textContent = running && !manuallyPaused ? "Demo Running" : "Play Sample";
    pauseButton.textContent = manuallyPaused ? "Resume" : "Pause";
    pauseButton.setAttribute("aria-label", manuallyPaused ? "Resume sample" : "Pause sample");
  };

  const clearActiveDelay = () => {
    if (activeDelay) {
      const delay = activeDelay;
      if (delay.timer) window.clearTimeout(delay.timer);
      activeDelay = null;
      delay.resolve(false);
    }
  };

  const resetCycle = (batch) => {
    workSample.classList.remove("is-complete");
    workSample.classList.add("is-running");
    transactionRows.forEach((row) => row.classList.remove("is-revealed", "is-processing"));
    reconciliationRows.forEach((row, index) => {
      row.classList.remove("is-matched", "is-processing");
      row.querySelector(".reconciliation-status").textContent = index === reconciliationRows.length - 1 ? "Needs Review" : "Pending";
    });
    ledgerRows.forEach((row) => row.classList.remove("is-matched", "is-processing"));
    categoryRows.forEach((row) => row.classList.remove("is-categorized", "is-processing"));
    [...apRows, ...arRows].forEach((row) => row.classList.remove("is-processed", "is-processing"));
    updateDemoData(batch);
    setStage("transactions");
    setProgress(0);
  };

  const finishImmediately = () => {
    transactionRows.forEach((row) => row.classList.add("is-revealed"));
    transactionRows.forEach((row) => {
      row.querySelector("[data-record-status]").textContent = "Recorded";
    });
    categoryRows.forEach((row) => row.classList.add("is-categorized"));
    reconciliationRows.forEach((row, index) => {
      if (index === reconciliationRows.length - 1) return;
      row.classList.add("is-matched");
      row.querySelector(".reconciliation-status").textContent = index === 0 ? "Matched" : "Reconciled";
    });
    ledgerRows.forEach((row) => row.classList.add("is-matched"));
    [...apRows, ...arRows].forEach((row) => row.classList.add("is-processed"));
    setStage("reports");
    setProgress(100);
    workSample.classList.remove("is-running", "is-paused", "is-complete");
    workSample.classList.add("is-complete");
    status.textContent = "Reduced-motion mode: static illustrative workflow shown. The unmatched charge remains flagged for review.";
    updateControls();
  };

  const runCycle = async (expectedRun) => {
    while (running && expectedRun === runId && !reducedMotion.matches) {
      const batch = demoBatches[batchIndex];
      batchIndex = (batchIndex + 1) % demoBatches.length;
      resetCycle(batch);
      currentStatus = `Recording and categorizing the ${batch.date} example transactions.`;
      status.textContent = currentStatus;
      updateControls();

      for (let index = 0; index < transactionRows.length; index += 1) {
        const row = transactionRows[index];
        row.classList.add("is-revealed", "is-processing");
        row.querySelector("[data-record-status]").textContent = "Recording";
        setProgress(4 + Math.round(((index + 1) / transactionRows.length) * 14));
        const completed = await wait(350, expectedRun);
        row.classList.remove("is-processing");
        row.querySelector("[data-record-status]").textContent = "Recorded";
        if (!completed) return;
      }

      setStage("categorization");
      setProgress(20);
      currentStatus = "Assigning the recorded entries to illustrative chart-of-accounts categories.";
      status.textContent = currentStatus;
      for (let index = 0; index < categoryRows.length; index += 1) {
        const row = categoryRows[index];
        row.classList.add("is-processing");
        const completed = await wait(350, expectedRun);
        row.classList.remove("is-processing");
        row.classList.add("is-categorized");
        setProgress(20 + Math.round(((index + 1) / categoryRows.length) * 18));
        if (!completed) return;
      }

      setStage("reconciliation");
      setProgress(40);
      currentStatus = "Comparing bank statement lines with the bookkeeping ledger.";
      status.textContent = currentStatus;
      for (let index = 0; index < reconciliationRows.length - 1; index += 1) {
        const row = reconciliationRows[index];
        const ledgerRow = ledgerRows[index];
        row.classList.add("is-processing");
        ledgerRow.classList.add("is-processing");
        const comparisonFinished = await wait(160, expectedRun);
        if (!comparisonFinished) return;
        row.classList.remove("is-processing");
        ledgerRow.classList.remove("is-processing");
        row.classList.add("is-matched");
        ledgerRow.classList.add("is-matched");
        row.querySelector(".reconciliation-status").textContent = index === 0 ? "Matched" : "Reconciled";
        ledgerRow.querySelector(".ledger-status").textContent = index === 0 ? "Matched" : "Reconciled";
        setProgress(40 + Math.round(((index + 1) / (reconciliationRows.length - 1)) * 23));
        const completed = await wait(310, expectedRun);
        if (!completed) return;
      }
      reconciliationRows[reconciliationRows.length - 1].classList.add("is-processing");
      setProgress(65);
      currentStatus = "An unmatched charge is flagged for client review.";
      status.textContent = currentStatus;
      const reviewFinished = await wait(340, expectedRun);
      if (!reviewFinished) return;

      setStage("payables");
      setProgress(68);
      currentStatus = "Reviewing sample supplier bills, due dates, customer invoices, and outstanding balances.";
      status.textContent = currentStatus;
      for (let index = 0; index < Math.max(apRows.length, arRows.length); index += 1) {
        const rows = [apRows[index], arRows[index]].filter(Boolean);
        rows.forEach((row) => row.classList.add("is-processing"));
        const completed = await wait(300, expectedRun);
        rows.forEach((row) => {
          row.classList.remove("is-processing");
          row.classList.add("is-processed");
        });
        setProgress(68 + Math.round(((index + 1) / Math.max(apRows.length, arRows.length)) * 13));
        if (!completed) return;
      }

      setStage("reports");
      setProgress(84);
      currentStatus = "Preparing illustrative Profit & Loss, Balance Sheet, and Cash Flow summaries.";
      status.textContent = currentStatus;
      const reportsFinished = await wait(1050, expectedRun);
      if (!reportsFinished) return;

      setProgress(100);
      workSample.classList.add("is-complete");
      status.textContent = "Sample cycle complete. The unmatched charge remains flagged for review.";
      const cycleFinished = await wait(520, expectedRun);
      if (!cycleFinished) return;
    }
  };

  const startLoop = () => {
    if (running || reducedMotion.matches || document.hidden) return;
    running = true;
    manuallyPaused = false;
    workSample.classList.remove("is-paused");
    const currentRun = ++runId;
    updateControls();
    runCycle(currentRun);
  };

  const pauseTimer = () => {
    if (!activeDelay?.timer) return;
    window.clearTimeout(activeDelay.timer);
    activeDelay.timer = null;
    activeDelay.remaining = Math.max(0, activeDelay.remaining - (Date.now() - activeDelay.startedAt));
  };

  const syncPauseState = () => {
    if (!running) {
      if (!manuallyPaused && !document.hidden && !reducedMotion.matches) startLoop();
      return;
    }
    const shouldPause = isPaused();
    workSample.classList.toggle("is-paused", shouldPause);
    if (shouldPause) {
      pauseTimer();
      status.textContent = document.hidden ? "Paused while this browser tab is hidden." : "Workflow paused.";
    } else {
      if (activeDelay) activeDelay.schedule();
      status.textContent = currentStatus;
    }
    updateControls();
  };

  const replay = () => {
    if (reducedMotion.matches) return;
    if (!running) {
      startLoop();
      return;
    }
    runId += 1;
    clearActiveDelay();
    running = false;
    startLoop();
  };

  const onMotionPreferenceChange = () => {
    if (reducedMotion.matches) {
      runId += 1;
      clearActiveDelay();
      running = false;
      manuallyPaused = false;
      workSample.classList.remove("is-running", "is-paused");
      updateDemoData(demoBatches[batchIndex === 0 ? demoBatches.length - 1 : batchIndex - 1]);
      finishImmediately();
      return;
    }
    if (!running) startLoop();
    updateControls();
  };

  const onVisibilityChange = () => syncPauseState();
  const onPageHide = () => {
    running = false;
    runId += 1;
    clearActiveDelay();
    workSample.classList.remove("is-running", "is-paused");
    removeDemoListeners();
    updateControls();
  };
  const onPageShow = (event) => {
    if (event.persisted) bindDemoListeners();
    if (!document.hidden && !reducedMotion.matches) startLoop();
  };

  let removeDemoListeners = () => {};
  const bindDemoListeners = () => {
    removeDemoListeners();
    const controller = new AbortController();
    const options = { signal: controller.signal };
    removeDemoListeners = () => controller.abort();
    playButton.addEventListener("click", () => {
      if (running && manuallyPaused) {
        manuallyPaused = false;
        syncPauseState();
      } else {
        replay();
      }
    }, options);
    replayButton.addEventListener("click", replay, options);
    pauseButton.addEventListener("click", () => {
      if (!running) return;
      manuallyPaused = !manuallyPaused;
      syncPauseState();
    }, options);
    workSample.querySelectorAll("[data-stage-indicator]").forEach((button) => {
      button.addEventListener("click", () => {
        if (reducedMotion.matches) {
          setStage(button.dataset.stageIndicator);
          status.textContent = `Inspecting ${button.querySelector("strong").textContent.toLowerCase()}.`;
          return;
        }
        if (!running) startLoop();
        setStage(button.dataset.stageIndicator);
        const stageLabel = button.querySelector("strong").textContent;
        status.textContent = `Inspecting ${stageLabel.toLowerCase()}. Automatic playback continues.`;
        updateControls();
      }, options);
    });
    document.addEventListener("visibilitychange", onVisibilityChange, options);
    reducedMotion.addEventListener("change", onMotionPreferenceChange, options);
  };
  bindDemoListeners();
  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("pageshow", onPageShow);
  updateDemoData(demoBatches[0]);
  if (reducedMotion.matches) finishImmediately();
  else startLoop();
}

const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");

// Pricing page buttons link here with ?service=… so the matching service is preselected.
const requestedService = { bookkeeping: "Bookkeeping Services", administrative: "Administrative Support", combined: "Both Bookkeeping and Administrative Support" }[new URLSearchParams(window.location.search).get("service")];
const serviceSelect = contactForm?.querySelector("#service");
if (requestedService && serviceSelect) {
  const option = [...serviceSelect.options].find((item) => item.textContent === requestedService);
  if (option) serviceSelect.value = option.value;
}
// Inquiries are saved through /api/inquiries; the thank-you panel appears only after the server confirms the record was stored.
const contactThanks = document.querySelector("#contact-thanks");
if (contactForm && contactThanks) {
  const submitButton = contactForm.querySelector(".form-submit");
  const submitLabel = contactForm.querySelector("[data-submit-label]");
  const messageField = contactForm.querySelector("#message");
  const messageCount = contactForm.querySelector("#message-count");
  const fieldIds = { full_name: "full-name", email: "email", business_name: "business", service_needed: "service", industry: "industry", message: "message" };
  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const startedAt = Date.now();
  const newSubmissionId = () => (window.crypto?.randomUUID ? window.crypto.randomUUID() : null);
  // One id per inquiry: a retry after a dropped connection reuses it, so the server never stores the same inquiry twice.
  let submissionId = newSubmissionId();
  let sending = false;

  const setFieldError = (name, text) => {
    const input = contactForm.querySelector(`#${fieldIds[name]}`);
    const error = contactForm.querySelector(`#${fieldIds[name]}-error`);
    if (text) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
    error.textContent = text || "";
    error.hidden = !text;
  };
  const showFeedback = (text, isError) => {
    formFeedback.textContent = text;
    formFeedback.classList.toggle("is-error", isError);
  };
  const checkFields = (data) => {
    const errors = {};
    if (!data.full_name.trim()) errors.full_name = "Please enter your full name.";
    if (!data.email.trim()) errors.email = "Please enter your email address.";
    else if (!emailPattern.test(data.email.trim())) errors.email = "Please enter a valid email address, like name@business.com.";
    if (!data.service_needed) errors.service_needed = "Please choose the service you need.";
    if (!data.industry) errors.industry = "Please choose your industry.";
    if (!data.message.trim()) errors.message = "Please enter a message.";
    return errors;
  };

  messageField.addEventListener("input", () => { messageCount.textContent = `${messageField.value.length}/3000`; });
  ["input", "change"].forEach((type) => contactForm.addEventListener(type, (event) => {
    if (fieldIds[event.target.name] && event.target.hasAttribute("aria-invalid")) setFieldError(event.target.name, "");
  }));

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;
    const data = { full_name: "", email: "", business_name: "", service_needed: "", industry: "", message: "", ...Object.fromEntries(new FormData(contactForm)) };
    const errors = checkFields(data);
    Object.keys(fieldIds).forEach((name) => setFieldError(name, errors[name]));
    const firstInvalid = Object.keys(fieldIds).find((name) => errors[name]);
    if (firstInvalid) {
      showFeedback("Please check the highlighted fields.", true);
      contactForm.querySelector(`#${fieldIds[firstInvalid]}`).focus();
      return;
    }

    sending = true;
    submitButton.disabled = true;
    contactForm.setAttribute("aria-busy", "true");
    submitLabel.textContent = "Sending…";
    showFeedback("Sending your inquiry…", false);
    try {
      const response = await fetch(contactForm.dataset.endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, client_ref: submissionId, started_at: startedAt }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) {
        Object.entries(result.fields || {}).forEach(([name, text]) => { if (fieldIds[name]) setFieldError(name, text); });
        throw new Error(result.error || "Your inquiry couldn’t be sent just now. Please try again in a moment.");
      }
      contactForm.reset();
      messageCount.textContent = "0/3000";
      showFeedback("", false);
      submissionId = newSubmissionId();
      contactForm.hidden = true;
      contactThanks.hidden = false;
      contactThanks.focus();
    } catch (error) {
      // The entered details stay in the form so the visitor can try again.
      showFeedback(error instanceof TypeError ? "Your inquiry couldn’t be sent. Please check your connection and try again." : error.message, true);
    } finally {
      sending = false;
      submitButton.disabled = false;
      contactForm.removeAttribute("aria-busy");
      submitLabel.textContent = "Send Message";
    }
  });
}

const copyrightYear = document.querySelector("#copyright-year");
if (copyrightYear) copyrightYear.textContent = String(new Date().getFullYear());

const experienceCarousel = document.querySelector("[data-xp-carousel]");
if (experienceCarousel) {
  const viewport = experienceCarousel.querySelector(".ov-xp-viewport");
  const track = experienceCarousel.querySelector(".ov-xp-track");
  const firstSet = track.querySelector(".ov-xp-set");
  const cards = [...firstSet.children];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const speed = 26;
  let offset = 0;
  let target = null;
  let step = 0;
  let setWidth = 0;
  let hovering = false;
  let focused = false;
  let onScreen = true;
  let lastTime = 0;

  experienceCarousel.classList.add("is-enhanced");

  const wrap = (value) => ((value % setWidth) + setWidth) % setWidth;

  function render() {
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
  }

  function layout() {
    const viewportStyle = getComputedStyle(viewport);
    const width = viewport.clientWidth - parseFloat(viewportStyle.paddingLeft) - parseFloat(viewportStyle.paddingRight);
    const perView = width >= 820 ? 3 : width >= 540 ? 2 : 1;
    const gap = parseFloat(getComputedStyle(firstSet).columnGap) || 0;
    const progress = setWidth ? offset / setWidth : 0;
    experienceCarousel.style.setProperty("--ov-xp-card", `${(width - gap * (perView - 1)) / perView}px`);
    step = cards[0].getBoundingClientRect().width + gap;
    setWidth = step * cards.length;
    offset = wrap(progress * setWidth);
    target = null;
    render();
  }

  function moveTo(destination) {
    if (destination < 0) {
      offset += setWidth;
      destination += setWidth;
    }
    if (reduceMotion.matches) {
      offset = wrap(destination);
      target = null;
      render();
    } else {
      target = destination;
    }
  }

  function tick(now) {
    const seconds = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    if (target !== null) {
      const remaining = target - offset;
      offset += remaining * Math.min(1, seconds * 8);
      if (Math.abs(remaining) < 0.5) {
        offset = target;
        target = null;
      }
    } else if (!hovering && !focused && onScreen && !reduceMotion.matches) {
      offset += speed * seconds;
    }
    if (offset >= setWidth) {
      offset -= setWidth;
      if (target !== null) target -= setWidth;
    }
    render();
    requestAnimationFrame(tick);
  }

  experienceCarousel.querySelector("[data-xp-prev]").addEventListener("click", () => moveTo((Math.round(offset / step) - 1) * step));
  experienceCarousel.querySelector("[data-xp-next]").addEventListener("click", () => moveTo((Math.round(offset / step) + 1) * step));
  experienceCarousel.addEventListener("mouseenter", () => { hovering = true; });
  experienceCarousel.addEventListener("mouseleave", () => { hovering = false; });
  experienceCarousel.addEventListener("focusin", () => { focused = true; });
  experienceCarousel.addEventListener("focusout", (event) => {
    if (!experienceCarousel.contains(event.relatedTarget)) focused = false;
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; }).observe(experienceCarousel);
  }
  if ("ResizeObserver" in window) new ResizeObserver(layout).observe(viewport);
  else window.addEventListener("resize", layout);

  layout();
  requestAnimationFrame((now) => {
    lastTime = now;
    requestAnimationFrame(tick);
  });
}

// Homepage "All Records" dialog. Every entry below is fictional demo data for the portfolio, not client records.
const recordsDialog = document.querySelector("[data-records-dialog]");
const recordsOpener = document.querySelector("[data-records-open]");
if (recordsDialog && recordsOpener && typeof recordsDialog.showModal === "function") {
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
  const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  const sampleTransactions = [
    ["2026-10-26", "Payment from Sample Client A", 2500, "Posted"],
    ["2026-10-25", "Office supplies", -150, "Posted"],
    ["2026-10-24", "Payment from Sample Client B", 1200, "Posted"],
    ["2026-10-23", "Software subscription", -99, "Posted"],
    ["2026-10-22", "Utility bill", -120, "Posted"],
    ["2026-10-20", "Internet service", -75, "Pending review"],
    ["2026-10-15", "Payment from Sample Client C", 1850, "Posted"],
    ["2026-10-10", "Business insurance", -210, "Posted"],
    ["2026-10-05", "Office rent", -1400, "Posted"],
    ["2026-09-28", "Payment from Sample Client A", 2300, "Posted"],
    ["2026-09-22", "Bank service fee", -15, "Posted"],
    ["2026-09-18", "Software subscription", -99, "Posted"],
    ["2026-09-12", "Utility bill", -118, "Posted"],
    ["2026-09-05", "Office rent", -1400, "Posted"],
    ["2026-09-03", "Payment from Sample Client D", 1600, "Posted"],
  ].map(([date, description, amount, status]) => ({ date, month: date.slice(0, 7), description, amount, status, type: amount > 0 ? "Income" : "Expense" }));
  const sampleReconciliations = [
    ["Sample Operating Checking", "Sep 1 – Sep 30, 2026", "Reconciled", "Oct 6, 2026"],
    ["Sample Business Savings", "Sep 1 – Sep 30, 2026", "Reconciled", "Oct 6, 2026"],
    ["Sample Business Credit Card", "Sep 1 – Sep 30, 2026", "In review", "Oct 20, 2026"],
    ["Sample Operating Checking", "Oct 1 – Oct 31, 2026", "Period open", "Oct 26, 2026"],
  ];
  const totals = (month) => {
    const rows = sampleTransactions.filter((row) => row.month === month);
    const inflow = rows.filter((row) => row.amount > 0).reduce((sum, row) => sum + row.amount, 0);
    const outflow = rows.filter((row) => row.amount < 0).reduce((sum, row) => sum - row.amount, 0);
    return { inflow, outflow };
  };
  // Report previews are calculated from the sample transactions so the figures agree with each other.
  const october = totals("2026-10");
  const september = totals("2026-09");
  const openingCash = 8000;
  const closingCash = openingCash + september.inflow - september.outflow;
  const assets = [["Cash (sample)", closingCash], ["Accounts receivable (sample)", 1200], ["Equipment (sample)", 3500]];
  const liabilities = [["Accounts payable (sample)", 640], ["Credit card balance (sample)", 412]];
  const totalAssets = assets.reduce((sum, [, value]) => sum + value, 0);
  const totalLiabilities = liabilities.reduce((sum, [, value]) => sum + value, 0);
  const sampleReports = [
    { name: "Profit and Loss", period: "Oct 1 – Oct 26, 2026", lines: [["Income", october.inflow], ["Expenses", -october.outflow], ["Net income", october.inflow - october.outflow, true]] },
    { name: "Balance Sheet", period: "As of Sep 30, 2026", lines: [...assets, ["Total assets", totalAssets, true], ...liabilities, ["Total liabilities", totalLiabilities, true], ["Owner’s equity", totalAssets - totalLiabilities, true]] },
    { name: "Cash Flow Summary", period: "Sep 1 – Sep 30, 2026", lines: [["Opening cash", openingCash], ["Cash received", september.inflow], ["Cash paid", -september.outflow], ["Closing cash", closingCash, true]] },
  ];

  const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="#${id}"/></svg>`;
  const escapeHtml = (text) => String(text).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
  const statusPill = (status) => {
    const tone = { Posted: "done", Reconciled: "done", "Pending review": "pending", "In review": "pending" }[status] || "open";
    return `<span class="rd-pill rd-pill--${tone}">${tone === "done" ? icon("i-check") : ""}${escapeHtml(status)}</span>`;
  };
  const formatDate = (iso) => shortDate.format(new Date(`${iso}T00:00:00Z`));

  const tabs = [...recordsDialog.querySelectorAll("[data-records-tab]")];
  const search = recordsDialog.querySelector("[data-records-search]");
  const period = recordsDialog.querySelector("[data-records-period]");
  const rowsBody = recordsDialog.querySelector("[data-records-rows]");
  const emptyMessage = recordsDialog.querySelector("[data-records-empty]");
  const summary = recordsDialog.querySelector("[data-records-summary]");
  const preview = recordsDialog.querySelector("[data-records-preview]");
  const reportList = recordsDialog.querySelector("[data-records-reports]");
  const counts = { transactions: sampleTransactions.length, reconciliation: sampleReconciliations.length, reports: sampleReports.length };
  Object.entries(counts).forEach(([key, count]) => { recordsDialog.querySelector(`[data-records-count="${key}"]`).textContent = `(${count})`; });

  [...new Set(sampleTransactions.map((row) => row.month))].forEach((month) => {
    period.append(new Option(`${monthName.format(new Date(`${month}-01T00:00:00Z`))} (sample)`, month));
  });

  function renderTransactions() {
    const query = search.value.trim().toLowerCase();
    const matches = sampleTransactions.filter((row) => {
      if (period.value !== "all" && row.month !== period.value) return false;
      if (!query) return true;
      return [row.description, row.type, row.status, formatDate(row.date), money.format(Math.abs(row.amount))].join(" ").toLowerCase().includes(query);
    });
    rowsBody.innerHTML = matches.map((row) => `<tr><td data-label="Date">${formatDate(row.date)}</td><td class="rd-desc" data-label="Description">${escapeHtml(row.description)}</td><td data-label="Type"><span class="rd-pill rd-pill--${row.type.toLowerCase()}">${row.type}</span></td><td data-label="Amount" class="rd-num ${row.amount > 0 ? "rd-in" : "rd-out"}">${row.amount > 0 ? "" : "−"}${money.format(Math.abs(row.amount))}</td><td data-label="Status">${statusPill(row.status)}</td></tr>`).join("");
    emptyMessage.hidden = matches.length > 0;
    summary.textContent = `Showing ${matches.length} of ${sampleTransactions.length} sample transactions.`;
  }

  recordsDialog.querySelector("[data-records-reconciliation]").innerHTML = sampleReconciliations
    .map(([account, statementPeriod, status, updated]) => `<tr><td class="rd-desc" data-label="Account">${escapeHtml(account)}</td><td data-label="Statement period">${statementPeriod}</td><td data-label="Status">${statusPill(status)}</td><td data-label="Last updated">${updated}</td></tr>`).join("");

  reportList.innerHTML = sampleReports.map((report, index) => `<li><div><strong>${report.name}</strong><small>${report.period} · sample report</small></div><button class="rd-preview-btn" type="button" aria-expanded="false" aria-controls="rd-report-preview" data-report-index="${index}">Preview</button></li>`).join("");
  preview.id = "rd-report-preview";
  reportList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-report-index]");
    if (!button) return;
    const wasOpen = button.getAttribute("aria-expanded") === "true";
    reportList.querySelectorAll("[data-report-index]").forEach((item) => item.setAttribute("aria-expanded", "false"));
    if (wasOpen) { preview.hidden = true; return; }
    const report = sampleReports[Number(button.dataset.reportIndex)];
    button.setAttribute("aria-expanded", "true");
    preview.innerHTML = `<h3>${report.name} — sample preview</h3><p>${report.period}. Illustrative figures calculated from the sample entries above.</p><dl>${report.lines.map(([label, value, total]) => `<dt${total ? ' class="is-total"' : ""}>${escapeHtml(label)}</dt><dd${total ? ' class="is-total"' : ""}>${value < 0 ? "−" : ""}${money.format(Math.abs(value))}</dd>`).join("")}</dl>`;
    preview.hidden = false;
  });

  function selectTab(tab, moveFocus) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      recordsDialog.querySelector(`#${item.getAttribute("aria-controls")}`).hidden = !selected;
    });
    if (moveFocus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab, false));
    tab.addEventListener("keydown", (event) => {
      const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      selectTab(tabs[(next + tabs.length) % tabs.length], true);
    });
  });

  search.addEventListener("input", renderTransactions);
  period.addEventListener("change", renderTransactions);
  renderTransactions();

  recordsOpener.addEventListener("click", () => {
    document.documentElement.classList.add("records-open");
    recordsDialog.showModal();
    tabs.find((tab) => tab.getAttribute("aria-selected") === "true").focus();
  });
  recordsDialog.querySelector("[data-records-close]").addEventListener("click", () => recordsDialog.close());
  // A click that lands on the dialog element itself is on the dimmed backdrop, outside the panel.
  recordsDialog.addEventListener("click", (event) => {
    if (event.target === recordsDialog) recordsDialog.close();
  });
  recordsDialog.addEventListener("close", () => {
    document.documentElement.classList.remove("records-open");
    recordsOpener.focus();
  });
}
