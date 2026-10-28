const servicePages = {
  bookkeeping: {
    title: "Bookkeeping Services",
    description:
      "Organized bookkeeping support for day-to-day transactions, account reconciliations, business records, and reporting preparation.",
    icon: "i-book",
    overview: true,
    introduction:
      "Bookkeeping brings a business’s financial activity into organized records that are easier to review and maintain. I can support the recurring tasks behind that process, work from the information and access you provide, and flag items that need your clarification.",
    helps:
      "Consistent bookkeeping can make it easier to locate supporting records, review account activity, and prepare information for business decisions or a discussion with your accountant.",
    categories: [
      {
        title: "Transaction management",
        description: "Categorize activity, organize receipts, and maintain accurate digital records.",
        href: "../transaction-management/index.html",
      },
      {
        title: "Bank and credit card reconciliation",
        description: "Compare account records with statements and flag unresolved differences.",
        href: "../reconciliation/index.html",
      },
      {
        title: "Accounts payable",
        description: "Organize bills, vendor records, due dates, payments, and balances.",
        href: "../accounts-payable/index.html",
      },
      {
        title: "Accounts receivable",
        description: "Maintain customer invoices, payment records, and receivable information.",
        href: "../accounts-receivable/index.html",
      },
      {
        title: "Financial reporting support",
        description: "Prepare bookkeeping reports and organize financial information for review.",
        href: "../financial-reporting/index.html",
      },
      {
        title: "Monthly bookkeeping",
        description: "Support recurring transaction, reconciliation, and month-end routines.",
        href: "../monthly-bookkeeping/index.html",
      },
      {
        title: "Bookkeeping cleanup and catch-up",
        description: "Review existing records, organize open items, and document unresolved issues.",
        href: "../bookkeeping-cleanup/index.html",
      },
      {
        title: "Payroll bookkeeping support",
        description: "Record and reconcile payroll information from approved reports.",
        href: "../payroll-bookkeeping-support/index.html",
      },
      {
        title: "Financial document management",
        description: "Keep statements, invoices, receipts, and supporting records organized.",
        href: "../financial-document-management/index.html",
      },
    ],
  },
  "transaction-management": {
    title: "Transaction Management",
    description:
      "Organized transaction records, consistent categorization, and supporting documents kept together for review.",
    icon: "i-wallet",
    introduction:
      "Transaction management involves recording and categorizing the financial activity supplied by a business, then keeping the related information organized. I can review entries for completeness and flag unclear or duplicate items for your review rather than making unsupported assumptions.",
    helps:
      "Well-organized transaction records make it easier to trace activity, find supporting documents, and prepare accounts for reconciliation and reporting.",
    cards: [
      ["i-file", "Recording and categorization", "Record transactions and categorize them consistently based on your chart of accounts."],
      ["i-folder", "Receipt and invoice organization", "Keep receipts, invoices, and supporting documents organized and easy to retrieve."],
      ["i-search", "Transaction review", "Review entries for completeness and flag unclear, duplicate, or unusual items for your review."],
      ["i-calculator", "Reconciliation support", "Support bank and credit card reconciliations by matching records against statements."],
    ],
  },
  reconciliation: {
    title: "Bank and Credit Card Reconciliation",
    description:
      "Compare bookkeeping records with bank and card statements, investigate differences, and document items that need review.",
    icon: "i-refresh",
    introduction:
      "Reconciliation compares the activity and balances in bookkeeping records with the corresponding bank or credit card statements. I can work through the records provided, identify entries that do not line up, and bring unresolved questions to you rather than guessing at a correction.",
    helps:
      "A documented reconciliation helps surface missing, duplicated, or unmatched entries and gives you a clearer view of which account items still need attention.",
    groups: [
      {
        title: "Match and reconcile",
        icon: "i-check",
        tone: "green",
        layout: "checklist",
        tasks: [
          ["Reconcile bank accounts", "Compare recorded bank activity with statements for the agreed period.", "i-bank"],
          ["Reconcile credit card accounts", "Review card transactions and balances against the statements provided.", "i-card"],
          ["Compare records with bank statements", "Match recorded entries to statement activity and identify items that do not correspond.", "i-search"],
        ],
      },
      {
        title: "Investigate differences",
        icon: "i-search",
        tone: "orange",
        layout: "checklist",
        tasks: [
          ["Review opening and closing balances", "Check that period balances align with available prior-period and statement information.", "i-list"],
          ["Investigate discrepancies and unmatched transactions", "Trace differences through the available records and document questions for clarification.", "i-search"],
          ["Identify missing or duplicate entries", "Flag possible omissions or duplicate postings for review before making changes.", "i-copy"],
        ],
      },
      {
        title: "Document and report",
        icon: "i-file",
        tone: "blue",
        layout: "checklist",
        tasks: [
          ["Prepare reconciliation reports", "Organize reconciliation results and outstanding items for your review.", "i-file"],
          ["Flag unresolved discrepancies", "Provide a clear list of remaining differences that require client input or follow-up.", "i-flag"],
        ],
      },
    ],
  },
  "accounts-payable": {
    title: "Accounts Payable",
    description:
      "Organize supplier bills, due dates, vendor records, payment entries, and outstanding balances for review.",
    icon: "i-file",
    introduction:
      "Accounts payable support focuses on keeping supplier bills and related vendor information organized. I can record the bills and payments you provide, maintain due-date information, and prepare items for your approval and payment process.",
    helps:
      "Clear bill and vendor records can help you review upcoming obligations, locate invoice support, and understand which balances still need attention.",
    groups: [
      {
        title: "Bills and vendor records",
        icon: "i-file",
        summary: "Supplier bills, vendor details, and related documentation kept organized.",
        tasks: [
          ["Record vendor bills", "Enter supplier bill details from the invoices and information you provide.", "i-file"],
          ["Organize supplier invoices", "File invoices so they can be located alongside the related vendor records.", "i-folder"],
          ["Maintain vendor records", "Keep vendor names and supporting details organized and consistent.", "i-users"],
          ["Track vendor credits", "Record available credit information and keep related documentation together.", "i-wallet"],
        ],
      },
      {
        title: "Due dates, payments, and balances",
        icon: "i-calendar",
        summary: "Unpaid bills, due dates, payments, and items prepared for your approval.",
        tasks: [
          ["Track outstanding bills", "Maintain a record of bills that remain unpaid based on the information provided.", "i-list"],
          ["Monitor bill due dates", "Organize due-date details to support your review and payment planning.", "i-calendar"],
          ["Record bill payments", "Record payments from supplied documentation and associate them with the appropriate bills.", "i-card"],
          ["Prepare bills for approval and payment", "Organize bill details for your approval and existing payment workflow; payment authorization remains with you.", "i-clipboard"],
        ],
      },
      {
        title: "Reviewing and resolving differences",
        icon: "i-shield",
        summary: "Balances and differences brought to your attention for review.",
        tasks: [
          ["Review accounts payable balances", "Compare available records and flag balances that need further review.", "i-search"],
          ["Flag discrepancies for review", "Bring unclear invoices, vendor credits, or balance differences to your attention.", "i-alert"],
        ],
      },
    ],
  },
  "accounts-receivable": {
    title: "Accounts Receivable",
    description:
      "Maintain customer invoice and payment records, track outstanding balances, and support client-approved follow-up workflows.",
    icon: "i-trending",
    introduction:
      "Accounts receivable support keeps customer invoices, payments, and open balances organized. I can record information you provide, apply payments to the appropriate invoices, and assist with follow-ups only through procedures you approve.",
    helps:
      "Organized receivable records help you review open invoices, see how payments were applied, and identify items that may need a client decision or follow-up.",
    groups: [
      {
        title: "Customer invoices and records",
        icon: "i-file",
        layout: "checklist",
        tasks: [
          ["Create and record customer invoices", "Prepare or enter invoice details using the information and approval process you provide.", "i-file"],
          ["Maintain customer records", "Keep customer information organized and consistent within the agreed system.", "i-users"],
          ["Track outstanding customer invoices", "Maintain a view of invoices that have not yet been marked as paid in the records.", "i-clock"],
          ["Monitor receivable balances", "Review recorded customer balances and flag items that do not appear consistent.", "i-trending"],
        ],
      },
      {
        title: "Payments and follow-up",
        icon: "i-wallet",
        layout: "checklist",
        tasks: [
          ["Record customer payments", "Enter received payments from the supplied remittance or account information.", "i-wallet"],
          ["Apply payments to the correct invoices", "Match payment details to the corresponding customer invoices and flag uncertain matches.", "i-clipboard"],
          ["Track overdue invoices", "Identify invoices shown as past due in the available records for your review.", "i-alert"],
          ["Assist with approved payment follow-ups", "Support follow-up communications using only the procedures and wording you approve.", "i-mail"],
          ["Review accounts receivable aging reports", "Organize aging information and note balances that may need your attention.", "i-list"],
        ],
      },
    ],
  },
  "financial-reporting": {
    title: "Financial Reporting Support",
    description:
      "Prepare bookkeeping reports from available records and organize financial information for management review.",
    icon: "i-chart",
    introduction:
      "Financial reporting support means preparing and organizing bookkeeping reports from the records available in the agreed system. Reports depend on the completeness of supplied information; unusual balances or gaps are flagged for review, not treated as assurance or audit conclusions.",
    helps:
      "Consistent reports can help you review recorded activity, share organized information with management, and prepare records for discussion with an accountant or tax professional.",
    groups: [
      {
        title: "Core financial reports",
        icon: "i-chart",
        tasks: [
          ["Prepare profit and loss reports", "Generate a report of recorded income and expenses for the period selected.", "i-trending"],
          ["Prepare balance sheet reports", "Organize recorded asset, liability, and equity balances for review.", "i-book"],
          ["Prepare cash flow reports", "Prepare cash flow reporting when supported by the available records and system.", "i-refresh"],
          ["Prepare monthly financial summaries", "Bring together key bookkeeping information in a clear period summary.", "i-calendar"],
        ],
      },
      {
        title: "Supporting reports and review",
        icon: "i-search",
        tasks: [
          ["Generate accounts payable reports", "Summarize recorded bills, vendor balances, and payment information.", "i-file"],
          ["Generate accounts receivable reports", "Summarize customer invoice, payment, and outstanding balance information.", "i-wallet"],
          ["Prepare expense summaries", "Organize recorded expenses by the categories available in the bookkeeping records.", "i-list"],
          ["Review general ledger reports", "Check report entries for items that appear incomplete or require clarification.", "i-search"],
          ["Organize information for management review", "Prepare financial information in an accessible format for your internal review.", "i-folder"],
          ["Flag unusual balances and discrepancies", "Note unexpected balances or inconsistencies for further investigation by the appropriate person.", "i-alert"],
        ],
      },
    ],
  },
  "monthly-bookkeeping": {
    title: "Monthly Bookkeeping",
    description:
      "Maintain a dependable monthly routine for transaction records, reconciliations, supporting documents, and month-end review.",
    icon: "i-calendar",
    introduction:
      "Monthly bookkeeping brings recurring financial recordkeeping tasks together for each agreed period. I can update the books from the information supplied, complete account reconciliations, maintain supporting documents, and prepare a summary for month-end review.",
    helps:
      "A consistent routine can make it easier to keep records current, revisit outstanding items, and prepare organized information for the next reporting period.",
    groups: [
      {
        title: "Recurring records and accounts",
        icon: "i-refresh",
        tasks: [
          ["Maintain monthly transaction records", "Record the month’s supplied business activity in the agreed bookkeeping system.", "i-list"],
          ["Update bookkeeping files", "Keep the relevant records and working files current for the period.", "i-folder"],
          ["Categorize and review transactions", "Classify monthly activity and flag entries that need more information.", "i-search"],
          ["Reconcile bank and credit card accounts", "Compare monthly account activity with the corresponding statements.", "i-refresh"],
          ["Update accounts payable and receivable", "Keep bill, invoice, payment, and balance records current from supplied details.", "i-wallet"],
        ],
      },
      {
        title: "Month-end organization",
        icon: "i-calendar",
        tasks: [
          ["Maintain supporting documents", "File statements, invoices, receipts, and other supplied records with the month’s activity.", "i-file"],
          ["Prepare monthly bookkeeping summaries", "Organize a concise summary of bookkeeping work and open items for review.", "i-clipboard"],
          ["Organize records for month-end review", "Arrange updated records and supporting information for your review.", "i-briefcase"],
          ["Assist with month-end bookkeeping procedures", "Complete agreed close-related bookkeeping steps and flag matters requiring client input.", "i-check"],
        ],
      },
    ],
  },
  "payroll-bookkeeping-support": {
    title: "Payroll Bookkeeping Support",
    description:
      "Record and organize payroll bookkeeping entries from approved payroll reports and coordinate questions with you or your provider.",
    icon: "i-clipboard",
    introduction:
      "Payroll bookkeeping support is limited to recording and organizing financial information from reports prepared or approved through your payroll process. I can reconcile related bookkeeping accounts and flag questions for you or your payroll provider. This is not independent payroll processing, payroll tax preparation, or tax advice.",
    helps:
      "Organized payroll entries and supporting reports can make it easier to review payroll-related expenses and liabilities alongside the rest of the bookkeeping records.",
    groups: [
      {
        title: "Recording approved payroll information",
        tasks: [
          ["Record payroll journal entries", "Enter journal information based on payroll reports approved by you or your provider."],
          ["Record payroll expenses", "Post payroll expense amounts from the supplied reports to the agreed bookkeeping records."],
          ["Record employer payroll tax liabilities", "Record liabilities shown in supplied payroll reports without calculating or preparing payroll taxes."],
          ["Organize payroll records", "Keep payroll reports and related supporting documents filed in the agreed location."],
        ],
      },
      {
        title: "Reconciliation and coordination",
        tasks: [
          ["Reconcile payroll-related accounts", "Compare recorded payroll amounts with available reports and account activity."],
          ["Track payroll liabilities for review", "Maintain liability records shown in supplied reports and flag open balances."],
          ["Coordinate discrepancies", "Share questions or differences with you or your payroll provider for appropriate review."],
        ],
      },
    ],
  },
  "administrative-support": {
    title: "Administrative Support",
    description:
      "Dependable help with data entry, document organization, recordkeeping, calendar management, and everyday administrative tasks.",
    icon: "i-briefcase",
    introduction:
      "Administrative support helps keep everyday business information and routines organized. I can work with your existing tools and procedures to update records, maintain documents and trackers, manage scheduling details, and assist with other agreed operational tasks.",
    helps:
      "Organized administrative records and consistent scheduling support can make routine information easier to find and recurring tasks easier to track.",
    groups: [
      {
        id: "data-entry",
        title: "Data entry",
        tasks: [
          ["Enter data into spreadsheets and business systems", "Add supplied information to the spreadsheet or business system you designate."],
          ["Update customer, vendor, and company records", "Maintain records using the details and change requests you provide."],
          ["Maintain accurate digital records", "Keep entries organized and consistent within the agreed workflow."],
          ["Review entries for completeness and consistency", "Check submitted information for missing fields or inconsistencies and flag questions."],
        ],
      },
      {
        id: "document-organization",
        title: "Document organization",
        tasks: [
          ["Organize digital files and folders", "Arrange digital documents in the folder structure you approve."],
          ["Maintain document naming conventions", "Use consistent names to help identify files and their contents."],
          ["Organize business documents", "Sort invoices, receipts, reports, and other business documents into agreed locations."],
          ["Retrieve and prepare documents", "Locate and prepare requested files for your review or use."],
        ],
      },
      {
        id: "recordkeeping",
        title: "Recordkeeping",
        tasks: [
          ["Maintain organized business records", "Keep operational records in an orderly, agreed format."],
          ["Update trackers and logs", "Record status changes and supplied information in the relevant tracker or log."],
          ["Maintain spreadsheets and operational records", "Keep recurring operational information up to date and consistently arranged."],
          ["Track pending tasks and document status", "Record open tasks and document progress for follow-up."],
        ],
      },
      {
        id: "calendar-management",
        title: "Calendar and scheduling support",
        tasks: [
          ["Manage calendars and appointments", "Maintain calendar entries based on your scheduling instructions and access permissions."],
          ["Schedule meetings", "Arrange meetings according to the availability and preferences you provide."],
          ["Send reminders", "Prepare or send agreed reminders using your preferred process."],
          ["Update meeting details and availability", "Keep meeting information current when you share changes."],
          ["Maintain organized scheduling records", "Keep relevant scheduling details organized for reference."],
        ],
      },
      {
        id: "general-administrative-tasks",
        title: "General administrative tasks",
        tasks: [
          ["Email and inbox organization", "Sort and organize messages using your categories and instructions."],
          ["Spreadsheet maintenance", "Update existing spreadsheets and keep their information consistently arranged."],
          ["Document preparation", "Format and organize business documents based on your supplied content and requirements."],
          ["Data collection and organization", "Gather supplied information and arrange it in an accessible format."],
          ["Task tracking", "Maintain task lists and update progress based on information you provide."],
          ["Basic reporting and status updates", "Prepare straightforward summaries of recorded activity and task status."],
          ["General operational assistance", "Support other agreed administrative tasks that fit the established scope."],
        ],
      },
    ],
  },
};

const slug = document.body.dataset.serviceSlug;
const page = servicePages[slug];

if (!page) {
  throw new Error(`No service page content is configured for "${slug || "unknown"}".`);
}

// Each page's <title> and meta description are written in its HTML for search engines; they are not overwritten here.
document.querySelector("[data-service-title]").textContent = page.title;
document.querySelector("[data-service-description]").textContent = page.description;
document.querySelector("[data-service-introduction]").textContent = page.introduction;
document.querySelector("[data-service-helps]").textContent = page.helps;
document.querySelector("[data-service-current]").textContent = page.title;

const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
icon.setAttribute("class", "icon service-detail-icon");
icon.setAttribute("aria-hidden", "true");
const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
use.setAttribute("href", `#${page.icon}`);
icon.append(use);
document.querySelector("[data-service-icon]")?.append(icon);

const groupsContainer = document.querySelector("[data-service-groups]");
const createHeading = (tag, text, className) => {
  const heading = document.createElement(tag);
  heading.className = className;
  heading.textContent = text;
  return heading;
};
const createIcon = (iconId) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "icon");
  svg.setAttribute("aria-hidden", "true");
  const iconUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
  iconUse.setAttribute("href", `#${iconId}`);
  svg.append(iconUse);
  return svg;
};

if (page.overview) {
  document.querySelector("[data-service-tasks-heading]").textContent = "Explore bookkeeping services";
  const categories = document.createElement("div");
  categories.className = "service-category-grid";
  page.categories.forEach((category) => {
    const card = document.createElement("article");
    card.className = "service-category-card gradient-card";
    card.append(createHeading("h3", category.title, ""));
    const description = document.createElement("p");
    description.textContent = category.description;
    card.append(description);
    const link = document.createElement("a");
    link.className = "text-link";
    link.href = category.href;
    link.textContent = "Learn More";
    card.append(link);
    categories.append(card);
  });
  groupsContainer.append(categories);
} else if (page.cards) {
  const grid = document.createElement("div");
  grid.className = "service-summary-grid";
  page.cards.forEach(([iconId, title, description]) => {
    const card = document.createElement("article");
    card.className = "service-summary-card gradient-card";
    const markWrap = document.createElement("span");
    markWrap.className = "service-summary-icon";
    markWrap.append(createIcon(iconId));
    card.append(markWrap, createHeading("h3", title, ""));
    const detail = document.createElement("p");
    detail.textContent = description;
    card.append(detail);
    grid.append(card);
  });
  groupsContainer.append(grid);
} else {
  page.groups.forEach((group) => {
    const section = document.createElement("section");
    section.className = "service-detail-group";
    if (group.id) section.id = group.id;
    if (group.tone) section.classList.add(`service-detail-group--${group.tone}`);
    if (group.layout) section.classList.add(`service-detail-group--${group.layout}`);
    if (group.icon) {
      section.classList.add("service-detail-group--panel");
      const header = document.createElement("div");
      header.className = "service-group-header";
      const groupIcon = document.createElement("span");
      groupIcon.className = "service-group-icon";
      groupIcon.append(createIcon(group.icon));
      const headerText = document.createElement("div");
      headerText.append(createHeading("h3", group.title, "service-detail-group-title"));
      if (group.summary) {
        const summary = document.createElement("p");
        summary.textContent = group.summary;
        headerText.append(summary);
      }
      header.append(groupIcon, headerText);
      section.append(header);
    } else {
      section.append(createHeading("h3", group.title, "service-detail-group-title"));
    }
    if (group.layout === "checklist") {
      const checklist = document.createElement("ul");
      checklist.className = "service-checklist";
      group.tasks.forEach(([title, description]) => {
        const item = document.createElement("li");
        item.append(createIcon("i-check"));
        const text = document.createElement("div");
        const name = document.createElement("strong");
        name.textContent = title;
        const detail = document.createElement("span");
        detail.textContent = description;
        text.append(name, detail);
        item.append(text);
        checklist.append(item);
      });
      section.append(checklist);
      groupsContainer.append(section);
      return;
    }
    const list = document.createElement("div");
    list.className = "service-task-grid";
    group.tasks.forEach(([title, description, iconId]) => {
      const task = document.createElement("article");
      task.className = "service-task-card gradient-card";
      const mark = document.createElement("span");
      mark.className = "service-task-mark";
      mark.setAttribute("aria-hidden", "true");
      if (iconId) mark.append(createIcon(iconId));
      else mark.textContent = "✓";
      task.append(mark, createHeading("h4", title, ""));
      const detail = document.createElement("p");
      detail.textContent = description;
      task.append(detail);
      list.append(task);
    });
    section.append(list);
    groupsContainer.append(section);
  });
}

// Sections render after the browser has tried to jump to the URL fragment, so jump again once they exist.
if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView();

const processSteps = [
  ["Gather records and access", "Confirm the documents, system access, period, and instructions needed for the agreed work."],
  ["Review and organize", "Review the information provided and organize it for the requested service."],
  ["Complete agreed tasks", "Carry out the defined bookkeeping or administrative tasks using the agreed workflow."],
  ["Flag questions and discrepancies", "Bring missing details, unusual items, and unresolved differences to your attention."],
  ["Share updates and records", "Provide an update and leave completed work and supporting records organized for review."],
];
const processList = document.querySelector("[data-service-process]");
processSteps.forEach(([title, description]) => {
  const item = document.createElement("article");
  item.className = "service-process-item gradient-card";
  item.append(createHeading("h3", title, ""));
  const text = document.createElement("p");
  text.textContent = description;
  item.append(text);
  processList.append(item);
});

// Closing CTA for the bookkeeping service pages (pages opt in with a data-bookkeeping-cta mount).
// Each service has its own composition; the copy, button destination and secondary link stay the same.
const bookkeepingCta = document.querySelector("[data-bookkeeping-cta]");
if (bookkeepingCta) {
  const base = document.body.dataset.navigationBase || "";
  const ctaIcon = (path) => `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="${path}"/></svg>`;
  const arrow = ctaIcon("M5 12h14m-7-7 7 7-7 7");
  const check = ctaIcon("m5 12 4.5 4.5L19 7");
  const ctaVariants = {
    "transaction-management": { variant: "summary", heading: "Keep Your Transaction Records <span>Organized</span>" },
    reconciliation: { variant: "compact", heading: "Reconciled Records, <span>Clearly Documented</span>" },
    "accounts-payable": { variant: "photo-left", heading: "Stay on Top of Your <span>Supplier Bills</span>" },
    "accounts-receivable": { variant: "photo-right", heading: "Clearer Visibility Into <span>Customer Balances</span>" },
    "financial-reporting": { variant: "editorial", heading: "Turn Your Records Into <span>Clear Reports</span>" },
    "monthly-bookkeeping": { variant: "calendar", heading: "A Consistent Routine <span>for Your Books</span>" },
  };
  const { variant, heading } = ctaVariants[document.body.dataset.serviceSlug] || ctaVariants["accounts-receivable"];
  const benefits = [
    ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8ZM14 2v6h6M8 13h8M8 17h8", "Organize Your Records"],
    ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 7v5l3 2", "Save Time on Bookkeeping"],
    ["M3 3v18h18M7 15l4-4 3 3 6-7", "Make Clearer Business Decisions"],
  ];
  const calendarDays = [...Array(3)].map(() => "<span></span>").join("") +
    [...Array(30)].map((_, i) => `<span${i + 1 === 30 ? ' class="is-close"' : i < 26 && (i + 3) % 7 !== 0 && (i + 3) % 7 !== 6 ? ' class="is-done"' : ""}>${i + 1}</span>`).join("");
  const visuals = {
    "photo-right": `<div class="bk-cta-visual" aria-hidden="true"><span class="bk-cta-photo"></span><span class="bk-cta-badge">${check}</span></div>`,
    "photo-left": `<div class="bk-cta-visual" aria-hidden="true"><span class="bk-cta-photo"></span></div>`,
    summary: `<div class="bk-cta-card" aria-hidden="true"><p>Monthly summary <small>Illustrative</small></p><dl><div><dt>Income</dt><dd>$12,450</dd></div><div><dt>Expenses</dt><dd>$4,320</dd></div><div><dt>Net</dt><dd>$8,130</dd></div></dl><ul><li>${check}Transactions categorized</li><li>${check}Receipts attached</li><li class="is-open"><i></i>2 items flagged for review</li></ul></div>`,
    compact: `<span class="bk-cta-shield" aria-hidden="true">${ctaIcon("M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6Z")}</span>`,
    calendar: `<div class="bk-cta-calendar" aria-hidden="true"><p>Monthly checklist <small>Illustrative</small></p><div class="bk-cta-days">${["S", "M", "T", "W", "T", "F", "S"].map((d) => `<b>${d}</b>`).join("")}${calendarDays}</div></div>`,
  };
  const actions = `<div class="bk-cta-actions"><a class="button button--primary" href="${base}pages/contact/index.html">Discuss Your Needs ${arrow}</a><a class="service-back-link" href="${base}pages/bookkeeping/index.html">Back to Services ${arrow}</a></div>`;
  const copy = `<p class="eyebrow">LET’S TALK</p><h2 id="service-cta-heading">${heading}</h2><p class="bk-cta-text">Share what you need help organizing, and we can discuss a suitable scope of support.</p>`;
  bookkeepingCta.classList.add(`bk-cta--${variant}`);
  if (variant === "editorial") {
    const steps = [
      ["M4 20h16M7 20v-6M12 20V8M17 20v-9", "Discuss Your Reporting Needs", "Tell me what reports you need and what you want to track."],
      ["M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12ZM8.5 12h.01M12 12h.01M15.5 12h.01", "Get a Customized Plan", "We’ll discuss the best scope of support for your business."],
      ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8ZM14 2v6h6M8 13h8M8 17h5", "Move Forward with Clarity", "Turn your bookkeeping records into meaningful financial insights."],
    ];
    bookkeepingCta.innerHTML = `<span class="bk-cta-photo" aria-hidden="true"></span>
      <div class="bk-cta-copy">${copy}</div>
      <ul class="bk-cta-steps">${steps.map(([path, title, text]) => `<li><span>${ctaIcon(path)}</span><div><strong>${title}</strong>${text}</div></li>`).join("")}</ul>
      <div class="bk-cta-consult">
        <p class="bk-cta-card-title"><span>${ctaIcon("M3 5h18v16H3zM16 3v4M8 3v4M3 10h18M8 15l2.5 2.5L16 13")}</span>Ready to discuss your financial reporting needs?</p>
        ${actions}
      </div>`;
  } else if (variant === "compact") {
    bookkeepingCta.innerHTML = `${visuals.compact}<div class="bk-cta-copy">${copy}</div>${actions}`;
  } else {
    const list = variant === "photo-right" ? `<ul class="bk-cta-benefits">${benefits.map(([path, label]) => `<li><span>${ctaIcon(path)}</span>${label}</li>`).join("")}</ul>` : "";
    bookkeepingCta.innerHTML = `<div class="bk-cta-copy">${copy}${actions}${list}</div>${visuals[variant]}`;
  }
}
