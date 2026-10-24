const navigationBase = document.body.dataset.navigationBase || "";
const socialLinks = {
  whatsapp: "https://wa.me/639518094340",
  linkedin: "https://www.linkedin.com/in/genesis-solomon-747722337/",
  messenger: "https://www.facebook.com/genesiswsolomon/",
  tiktok: "https://www.tiktok.com/@genesiswsolomon",
};
const navigationItems = [
  ["overview", "Overview", "index.html", "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"],
  ["about", "About me", "pages/about/index.html", "M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  ["bookkeeping", "Bookkeeping services", "pages/bookkeeping/index.html", "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"],
  ["administrative", "Administrative support", "pages/administrative/index.html", "M3 7h18v14H3zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"],
  ["industries", "Industry experience", "pages/industries/index.html", "M3 21h18M5 21V5l7-3 7 3v16M9 9h.01M15 9h.01M9 13h.01M15 13h.01"],
  ["tools", "Software & tools", "pages/tools/index.html", "M4 4h16v12H4zM2 20h20l-2-4H4z"],
  ["process", "My work process", "pages/process/index.html", "M6 19a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm13-16a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM9 16h8a4 4 0 0 0 0-8h-2a4 4 0 0 1 0-8h3"],
  ["values", "Professional values", "pages/values/index.html", "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"],
  ["contact", "Contact", "pages/contact/index.html", "M3 5h18v14H3zM3 7l9 6 9-6"],
];

const makeIcon = (path) =>
  `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="${path}"/></svg>`;
const socialItems = [
  {
    label: "WhatsApp",
    url: socialLinks.whatsapp,
    icon: '<svg class="social-icon social-icon--whatsapp" aria-hidden="true" viewBox="0 0 24 24"><path d="M12.04 2a9.8 9.8 0 0 0-8.39 14.86L2.4 22l5.27-1.38A9.8 9.8 0 1 0 12.04 2Zm0 17.8a8 8 0 0 1-4.08-1.12l-.29-.17-3.13.82.84-3.05-.19-.31a8 8 0 1 1 6.85 3.83Zm4.4-5.99c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.09 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/></svg>',
  },
  {
    label: "LinkedIn",
    url: socialLinks.linkedin,
    icon: '<svg class="social-icon social-icon--linkedin" aria-hidden="true" viewBox="0 0 24 24"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM8.03 18.34H5.06V9.01h2.97v9.33ZM6.54 7.74a1.72 1.72 0 1 1 .02-3.44 1.72 1.72 0 0 1-.02 3.44Zm11.8 10.6h-2.97v-4.54c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.62H9.17V9.01h2.85v1.27h.04c.4-.73 1.37-1.5 2.82-1.5 3.02 0 3.58 1.98 3.58 4.55v5.01Z"/></svg>',
  },
  {
    label: "Messenger",
    url: socialLinks.messenger,
    icon: '<svg class="social-icon social-icon--messenger" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2C6.2 2 1.5 6.25 1.5 11.5c0 2.99 1.48 5.66 3.8 7.4V22l3.47-1.9c1.02.28 2.1.43 3.23.43 5.8 0 10.5-4.25 10.5-9.5S17.8 2 12 2Zm1.04 12.8-2.67-2.85-5.2 2.85 5.72-6.07 2.74 2.85 5.14-2.85-5.73 6.07Z"/></svg>',
  },
  {
    label: "TikTok",
    url: socialLinks.tiktok,
    icon: '<svg class="social-icon social-icon--tiktok" aria-hidden="true" viewBox="0 0 24 24"><path class="social-icon-shadow" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.33V2h-3.42v13.67a2.89 2.89 0 0 1-2.89 2.89 2.89 2.89 0 0 1 0-5.78c.3 0 .59.05.86.13v-3.5a6.4 6.4 0 0 0-.86-.06 6.31 6.31 0 1 0 6.31 6.31V8.68a8.2 8.2 0 0 0 4.79 1.54V6.8a4.85 4.85 0 0 1-1.02-.11Z"/></svg>',
  },
];
const navigation = document.querySelector("[data-shared-navigation]");

if (!navigation) {
  throw new Error("The shared navigation mount point is missing.");
}

navigation.innerHTML = `
  <header class="mobile-header">
    <a class="brand brand--compact" href="${navigationBase}index.html" aria-label="Genesis Solomon, overview">
      <span class="brand-mark brand-mark--gs" aria-hidden="true">GS</span>
      <span class="brand-copy"><strong>Genesis Solomon</strong><small>Bookkeeping &amp; support</small></span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation" aria-label="Open navigation">
      ${makeIcon("M4 6h16M4 12h16M4 18h16").replace('class="icon"', 'class="icon menu-icon"')}
      ${makeIcon("m18 6-12 12M6 6l12 12").replace('class="icon"', 'class="icon close-icon"')}
    </button>
  </header>
  <aside class="sidebar" aria-label="Portfolio sidebar">
    <a class="brand" href="${navigationBase}index.html" aria-label="Genesis Solomon, overview">
      <span class="brand-mark brand-mark--gs" aria-hidden="true">GS</span>
      <span class="brand-copy"><strong>Genesis Solomon</strong><small>BOOKKEEPING SPECIALIST</small></span>
    </a>
    <nav class="site-navigation" id="site-navigation" aria-label="Main navigation">
      ${navigationItems.map(([id, label, route, path]) => `
        <a class="nav-link${document.body.dataset.activeSection === id ? " is-active" : ""}" href="${navigationBase}${route}"${document.body.dataset.activeSection === id ? ' aria-current="page"' : ""}>
          ${makeIcon(path)}<span>${label}</span>
        </a>`).join("")}
    </nav>
    <section class="sidebar-social" aria-labelledby="sidebar-social-title">
      <h2 class="sidebar-label" id="sidebar-social-title">CONNECT WITH ME</h2>
      <div class="social-links">
        ${socialItems.map(({ label, url, icon }) => `
          <a class="social-link" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${label} (opens in a new tab)">
            ${icon}<span class="social-label">${label}</span>
          </a>`).join("")}
      </div>
    </section>
  </aside>`;
