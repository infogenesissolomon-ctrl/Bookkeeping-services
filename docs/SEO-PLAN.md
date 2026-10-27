# SEO plan — Genesis Solomon, Bookkeeping & Administrative Support

Prepared before launch (October 2026). Nothing here has been submitted to Google; the site is not yet on its final domain.
Search volume, competition and difficulty are **unverified**: no keyword research tool was available. Check the shortlisted
phrases in Google Keyword Planner or Search Console data before committing to them.

## 1. Keyword map (one primary target per page)

| Page | Primary target | Supporting phrases | Intent |
| --- | --- | --- | --- |
| Home `/` | bookkeeping services for small businesses | small business bookkeeper, remote bookkeeper, outsourced bookkeeping | Commercial |
| Bookkeeping services `/pages/bookkeeping/` | bookkeeping services (catalog) | bookkeeping and reconciliation services, AP/AR bookkeeping | Commercial |
| Transaction management | transaction categorization services | bookkeeping data entry, categorize bank transactions | Commercial |
| Reconciliation | bank reconciliation services | credit card reconciliation services, reconcile bank accounts | Commercial |
| Accounts payable | accounts payable bookkeeping | vendor bill management, AP support | Commercial |
| Accounts receivable | accounts receivable bookkeeping | invoice and payment tracking, AR aging review | Commercial |
| Financial reporting | financial reporting support for small business | profit and loss report preparation, monthly financial summary | Commercial |
| Monthly bookkeeping | monthly bookkeeping services | month-end bookkeeping, recurring bookkeeping | Commercial |
| Bookkeeping cleanup | bookkeeping cleanup services | catch-up bookkeeping | Commercial |
| Financial document management | financial document organization | receipt and invoice organization | Commercial |
| Industry experience | construction / real estate / landscaping bookkeeping | job cost tracking, rental property bookkeeping, lawn care bookkeeping | Commercial (split into pages later — see §3) |
| Administrative support `/pages/administrative/` | administrative support services for small businesses | virtual administrative assistant, data entry support | Commercial (secondary niche) |
| Administrative support tasks `/services/administrative-support/` | administrative support tasks | calendar management support, document organization | Informational/commercial |
| Pricing | bookkeeping pricing per hour | bookkeeper hourly rate, administrative support rates | Commercial/transactional |
| About | Genesis Solomon bookkeeper | (brand) | Navigational |
| Contact | (brand) contact | — | Transactional |
| Tools, Process, Values | supporting trust pages | QuickBooks bookkeeper, Xero bookkeeper | Trust |

`/services/bookkeeping/` duplicates the intent of `/pages/bookkeeping/`, so it is set to `noindex, follow` and left out of the sitemap.

## 2. Content plan (proposals — not approved for publication)

Write only from your own experience; each article should answer one real client question and link to the matching service page.

1. What small businesses should prepare for monthly bookkeeping → Monthly bookkeeping
2. How bank reconciliation helps identify unmatched transactions → Reconciliation
3. Accounts payable vs. accounts receivable: what each involves → AP and AR pages
4. What to include in a monthly bookkeeping review → Monthly bookkeeping, Financial reporting
5. Bookkeeping records real estate businesses should organize → Industry page
6. Construction bookkeeping: organizing job costs and expenses → Industry page
7. Landscaping and lawn care bookkeeping: tracking fuel, equipment, and materials → Industry page

Publishing needs a small blog/articles section (one template page per article, linked from the footer or Industry page). Two
genuinely useful articles a month beats many thin ones.

## 3. Recommended page additions (later)

- Separate industry pages (Construction, Real Estate, Landscaping & Lawn Care bookkeeping) once each has enough original content
  — today they share one page, so each industry phrase competes with the others.
- A short FAQ on the Pricing and Monthly bookkeeping pages (what you need from the client, which software, how hours are agreed).

## 4. Authority and trust (legitimate only)

- Complete your LinkedIn profile and link it to the site; keep name, title and services consistent everywhere.
- Professional profiles: QuickBooks ProAdvisor directory and Xero advisor directory **only if you hold those certifications**;
  freelance profiles you actually use (e.g. Upwork) linking back to the site.
- A Google Business Profile only if you meet Google's eligibility rules (it requires in-person contact with customers);
  a remote-only service usually does not qualify.
- Ask real clients for reviews/testimonials **with written permission**; never invent or buy reviews or links.
- Partnerships: accountants/CPAs and tax preparers who refer bookkeeping work; guest articles on genuinely relevant sites.

## 5. Pre-launch checklist

- [ ] Confirm the final custom domain and connect it in Vercel (choose www or non-www and redirect the other).
- [ ] Run `node scripts/finalize-seo.mjs https://your-domain` — adds canonical URLs, og:url/og:image, JSON-LD url, sitemap.xml and the robots.txt Sitemap line. Commit and push.
- [ ] Open `https://your-domain/robots.txt` and `/sitemap.xml` on the live site; confirm no page has an unintended `noindex`.
- [ ] Check every page and link on the live domain, on desktop and phone.
- [ ] Test with Google's Rich Results Test and PageSpeed Insights.
- [ ] Get approval from each company before keeping the "My Experience Across Businesses" statements on the homepage (see §7).
- [ ] After the site is public: add it to Google Search Console (Domain property, DNS verification), submit `sitemap.xml`, request indexing of the homepage.
- [ ] Add Bing Webmaster Tools (can import from Search Console).
- [ ] Analytics only with a real measurement ID and a privacy notice/consent approach.

## 6. 90-day plan

| When | Actions |
| --- | --- |
| Weeks 1–2 | Launch on the domain; run the finalize script; Search Console + Bing; submit sitemap; fix any coverage errors. Remove unused large files from the repository (§7). |
| Weeks 3–6 | Publish articles 1–2; update LinkedIn and freelance profiles with the site link; ask two real clients for permission-based testimonials. |
| Weeks 7–10 | Publish articles 3–4; split the Industry page into dedicated industry pages if the content is ready; add FAQ sections. |
| Weeks 11–13 | Review Search Console queries and impressions; rewrite titles/descriptions of pages with impressions but low clicks; plan the next quarter from real data. |

## 7. Open issues found in the audit

- **Unapproved testimonials:** the homepage carousel shows recommendation-style statements attributed to five named companies
  without the earlier "draft" note. Publishing them before each company approves is a trust and legal risk; do not add Review/Rating structured data for them.
- **Large unused files are published:** the repository root contains design sources and photos not used by any page
  (`Bookkeeping services Background.svg` 11.8 MB, `Overview Image 1.svg`, `Overview Image 2.svg`, `Heading Section.PNG`,
  `Heading-Section-Transparent.png`, `Transparent background.png`, `Genesis Solomon Profile.png`, `Profile Picture`, `ICON`).
  Vercel serves them publicly. Move them out of the project (or list them in `.vercelignore`) when you no longer need them there.
- **JavaScript-rendered content:** the sidebar menu and the service pages' task lists, process steps and closing sections are built by JavaScript.
  Google renders JavaScript, and the sitemap plus the in-page links cover discovery, but the most important text is now also in the HTML.
- **Homepage H1** is "Hello, I'm Genesis Solomon" (brand). The title tag, description and first content carry the main keyword; changing the visible heading is a design decision.
- **Performance:** the homepage hero photo is a 934 KB PNG (needed for its transparent background); a WebP version would cut that substantially.
  `styles.css` (≈230 KB) contains rules for older page designs that are no longer used.
