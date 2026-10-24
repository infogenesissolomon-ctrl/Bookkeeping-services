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
    groups: [
      {
        title: "Recording and categorization",
        tasks: [
          ["Categorize bank transactions", "Assign transactions to the appropriate accounts using your chart of accounts and available details."],
          ["Categorize credit card transactions", "Classify card activity consistently and flag entries that need more information."],
          ["Record income and expenses", "Enter business activity based on supplied statements, records, and supporting documents."],
          ["Maintain accurate bookkeeping records", "Keep transaction information organized and current within the agreed bookkeeping system."],
          ["Maintain the chart of accounts", "Keep account categories organized and note proposed changes for discussion when needed."],
        ],
      },
      {
        title: "Review and supporting records",
        tasks: [
          ["Review missing or unclear information", "Identify transactions that lack enough detail and prepare them for client clarification."],
          ["Identify duplicate transactions for review", "Spot possible duplicate entries and flag them before any correction is made."],
          ["Organize receipts and supporting documents", "Match and file available receipts or records with the related business activity."],
          ["Track business expenses", "Maintain categorized expense records to support ongoing bookkeeping and review."],
          ["Maintain digital financial records", "Keep transaction records and related files organized in the agreed digital workflow."],
        ],
      },
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
        title: "Account and statement review",
        tasks: [
          ["Reconcile bank accounts", "Compare recorded bank activity with statements for the agreed period."],
          ["Reconcile credit card accounts", "Review card transactions and balances against the statements provided."],
          ["Compare records with bank statements", "Match recorded entries to statement activity and identify items that do not correspond."],
          ["Review opening and closing balances", "Check that period balances align with available prior-period and statement information."],
        ],
      },
      {
        title: "Differences and documentation",
        tasks: [
          ["Investigate discrepancies and unmatched transactions", "Trace differences through the available records and document questions for clarification."],
          ["Identify missing or duplicate entries", "Flag possible omissions or duplicate postings for review before making changes."],
          ["Prepare reconciliation reports", "Organize reconciliation results and outstanding items for your review."],
          ["Flag unresolved discrepancies", "Provide a clear list of remaining differences that require client input or follow-up."],
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
        tasks: [
          ["Record vendor bills", "Enter supplier bill details from the invoices and information you provide."],
          ["Organize supplier invoices", "File invoices so they can be located alongside the related vendor records."],
          ["Maintain vendor records", "Keep vendor names and supporting details organized and consistent."],
          ["Track vendor credits", "Record available credit information and keep related documentation together."],
        ],
      },
      {
        title: "Due dates, payments, and balances",
        tasks: [
          ["Track outstanding bills", "Maintain a record of bills that remain unpaid based on the information provided."],
          ["Monitor bill due dates", "Organize due-date details to support your review and payment planning."],
          ["Record bill payments", "Record payments from supplied documentation and associate them with the appropriate bills."],
          ["Review accounts payable balances", "Compare available records and flag balances that need further review."],
          ["Prepare bills for approval and payment", "Organize bill details for your approval and existing payment workflow; payment authorization remains with you."],
          ["Flag discrepancies for review", "Bring unclear invoices, vendor credits, or balance differences to your attention."],
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
        tasks: [
          ["Create and record customer invoices", "Prepare or enter invoice details using the information and approval process you provide."],
          ["Maintain customer records", "Keep customer information organized and consistent within the agreed system."],
          ["Track outstanding customer invoices", "Maintain a view of invoices that have not yet been marked as paid in the records."],
          ["Monitor receivable balances", "Review recorded customer balances and flag items that do not appear consistent."],
        ],
      },
      {
        title: "Payments and follow-up",
        tasks: [
          ["Record customer payments", "Enter received payments from the supplied remittance or account information."],
          ["Apply payments to the correct invoices", "Match payment details to the corresponding customer invoices and flag uncertain matches."],
          ["Track overdue invoices", "Identify invoices shown as past due in the available records for your review."],
          ["Assist with approved payment follow-ups", "Support follow-up communications using only the procedures and wording you approve."],
          ["Review accounts receivable aging reports", "Organize aging information and note balances that may need your attention."],
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
        tasks: [
          ["Prepare profit and loss reports", "Generate a report of recorded income and expenses for the period selected."],
          ["Prepare balance sheet reports", "Organize recorded asset, liability, and equity balances for review."],
          ["Prepare cash flow reports", "Prepare cash flow reporting when supported by the available records and system."],
          ["Prepare monthly financial summaries", "Bring together key bookkeeping information in a clear period summary."],
        ],
      },
      {
        title: "Supporting reports and review",
        tasks: [
          ["Generate accounts payable reports", "Summarize recorded bills, vendor balances, and payment information."],
          ["Generate accounts receivable reports", "Summarize customer invoice, payment, and outstanding balance information."],
          ["Prepare expense summaries", "Organize recorded expenses by the categories available in the bookkeeping records."],
          ["Review general ledger reports", "Check report entries for items that appear incomplete or require clarification."],
          ["Organize information for management review", "Prepare financial information in an accessible format for your internal review."],
          ["Flag unusual balances and discrepancies", "Note unexpected balances or inconsistencies for further investigation by the appropriate person."],
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
        tasks: [
          ["Maintain monthly transaction records", "Record the month’s supplied business activity in the agreed bookkeeping system."],
          ["Update bookkeeping files", "Keep the relevant records and working files current for the period."],
          ["Categorize and review transactions", "Classify monthly activity and flag entries that need more information."],
          ["Reconcile bank and credit card accounts", "Compare monthly account activity with the corresponding statements."],
          ["Update accounts payable and receivable", "Keep bill, invoice, payment, and balance records current from supplied details."],
        ],
      },
      {
        title: "Month-end organization",
        tasks: [
          ["Maintain supporting documents", "File statements, invoices, receipts, and other supplied records with the month’s activity."],
          ["Prepare monthly bookkeeping summaries", "Organize a concise summary of bookkeeping work and open items for review."],
          ["Organize records for month-end review", "Arrange updated records and supporting information for your review."],
          ["Assist with month-end bookkeeping procedures", "Complete agreed close-related bookkeeping steps and flag matters requiring client input."],
        ],
      },
    ],
  },
  "bookkeeping-cleanup": {
    title: "Bookkeeping Cleanup and Catch-Up",
    description:
      "Review existing bookkeeping records, organize historical activity, and document unresolved issues for your review.",
    icon: "i-search",
    introduction:
      "Cleanup and catch-up support starts with the records that are available. I can review historical bookkeeping, organize uncategorized items, investigate differences in the supporting information, and prepare a list of questions or unresolved issues for you.",
    helps:
      "A structured review can make gaps and open questions easier to see, helping you decide what information is needed before records are updated or relied upon.",
    groups: [
      {
        title: "Historical records and transactions",
        tasks: [
          ["Review existing bookkeeping records", "Assess the supplied records and identify areas that need organizing or follow-up."],
          ["Organize uncategorized transactions", "Sort uncategorized activity using available details and flag items that remain unclear."],
          ["Identify duplicate entries", "Spot entries that may have been recorded more than once and list them for review."],
          ["Identify missing transactions", "Compare available information and flag possible omissions for your confirmation."],
          ["Organize historical financial records", "Arrange older bookkeeping files and supporting documents by period or category."],
        ],
      },
      {
        title: "Reconciliation and follow-up",
        tasks: [
          ["Investigate reconciliation discrepancies", "Trace differences through the supplied records and document unresolved questions."],
          ["Review inconsistent transaction categorization", "Identify categories that appear inconsistent and prepare them for your review."],
          ["Assist with overdue bookkeeping updates", "Work through agreed outstanding periods using the records and access provided."],
          ["Prepare a list of unresolved issues", "Summarize missing information, open discrepancies, and questions requiring client review."],
        ],
      },
    ],
  },
  "financial-document-management": {
    title: "Financial Document Management",
    description:
      "Organize statements, invoices, receipts, and monthly bookkeeping files so supporting records are easier to locate.",
    icon: "i-folder",
    introduction:
      "Financial document management creates a clear, consistent place for the records that support bookkeeping activity. I can organize the digital files you provide, maintain agreed naming conventions, and prepare documents for review or handoff to your accountant or tax professional.",
    helps:
      "Well-organized supporting documents can make it easier to trace transactions, retrieve records when requested, and prepare information for professional review.",
    groups: [
      {
        title: "Statements and transaction support",
        tasks: [
          ["Organize bank statements", "File bank statements by account and period using the agreed folder structure."],
          ["Organize credit card statements", "Keep card statements together with the corresponding bookkeeping period."],
          ["Organize vendor invoices and receipts", "Sort supplier invoices and receipts so they can be found alongside related records."],
          ["Maintain supporting documents for transactions", "Keep available transaction documentation linked or filed with the relevant records."],
        ],
      },
      {
        title: "Digital files and professional handoff",
        tasks: [
          ["Maintain digital bookkeeping folders", "Keep bookkeeping folders organized using the agreed access and storage workflow."],
          ["Organize monthly financial files", "Arrange monthly records so statements and supporting documents remain grouped by period."],
          ["Maintain consistent file naming", "Apply consistent names and organization to make documents easier to identify."],
          ["Prepare documents for accountants and tax professionals", "Collect and organize requested records for handoff; professional tax work remains with the qualified provider."],
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
        title: "Data entry",
        tasks: [
          ["Enter data into spreadsheets and business systems", "Add supplied information to the spreadsheet or business system you designate."],
          ["Update customer, vendor, and company records", "Maintain records using the details and change requests you provide."],
          ["Maintain accurate digital records", "Keep entries organized and consistent within the agreed workflow."],
          ["Review entries for completeness and consistency", "Check submitted information for missing fields or inconsistencies and flag questions."],
        ],
      },
      {
        title: "Document organization",
        tasks: [
          ["Organize digital files and folders", "Arrange digital documents in the folder structure you approve."],
          ["Maintain document naming conventions", "Use consistent names to help identify files and their contents."],
          ["Organize business documents", "Sort invoices, receipts, reports, and other business documents into agreed locations."],
          ["Retrieve and prepare documents", "Locate and prepare requested files for your review or use."],
        ],
      },
      {
        title: "Recordkeeping",
        tasks: [
          ["Maintain organized business records", "Keep operational records in an orderly, agreed format."],
          ["Update trackers and logs", "Record status changes and supplied information in the relevant tracker or log."],
          ["Maintain spreadsheets and operational records", "Keep recurring operational information up to date and consistently arranged."],
          ["Track pending tasks and document status", "Record open tasks and document progress for follow-up."],
        ],
      },
      {
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

document.title = `${page.title} | Genesis Solomon`;
document.querySelector('meta[name="description"]').content = page.description;
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
document.querySelector("[data-service-icon]").append(icon);

const groupsContainer = document.querySelector("[data-service-groups]");
const createHeading = (tag, text, className) => {
  const heading = document.createElement(tag);
  heading.className = className;
  heading.textContent = text;
  return heading;
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
} else {
  page.groups.forEach((group) => {
    const section = document.createElement("section");
    section.className = "service-detail-group";
    section.append(createHeading("h3", group.title, "service-detail-group-title"));
    const list = document.createElement("div");
    list.className = "service-task-grid";
    group.tasks.forEach(([title, description]) => {
      const task = document.createElement("article");
      task.className = "service-task-card gradient-card";
      const mark = document.createElement("span");
      mark.className = "service-task-mark";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = "✓";
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
