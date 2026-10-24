# Genesis Solomon — bookkeeping & business support

This is a lightweight, framework-free portfolio site. Open `index.html` directly for a local preview or deploy the folder as a static site. Dashboard navigation opens independent pages under `pages/`; it does not scroll between homepage sections.

## Service detail pages

The service cards link to standalone pages under `services/`. Each route has its own `index.html` and uses the shared service content in `service-detail.js`. The main page, dashboard pages, and service routes render the same responsive sidebar from `shared-navigation.js`; keep the routes in sync with that component. On desktop, each page's main content scrolls independently from the fixed sidebar. For a local preview, open the requested route's `index.html` directly, or serve the site folder with a static web server.

## Contact form

The form validates its required fields in the browser and opens a draft email addressed to the verified contact email. The visitor must review and send the draft in their own email app; the website does not submit form data to a server or claim that an email was sent. For server-side submissions, connect the form to a secure form provider or backend before changing this behavior.

## Sidebar social links

The shared sidebar reads the four social profile URLs from the `socialLinks` object near the top of `shared-navigation.js`. Update those values to change the links across all pages. The current links are the WhatsApp chat, LinkedIn profile, Facebook profile for Messenger, and TikTok profile supplied by Genesis Solomon. Each opens in a new tab.

## Editing the tools list

Edit the tool chips in `pages/tools/index.html` to add, remove, or regroup software. The current names are drawn from Genesis Solomon’s supplied résumé and do not imply certifications or proficiency ratings.

## Supplied assets

- `Heading Section.PNG` is used as the profile portrait.
- `Genesis Solomon Professional Bookkeeper Expert.pdf` is the source résumé; it is not published or linked from the website.
