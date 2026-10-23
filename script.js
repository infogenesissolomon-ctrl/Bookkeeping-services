const menuToggle = document.querySelector(".menu-toggle");
const navLinks = [...document.querySelectorAll(".nav-link")];
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
  const sections = [...document.querySelectorAll("main section[id]")];
  const navObserver = new IntersectionObserver((entries) => {
    const visibleSections = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleSections.length) {
      const activeId = visibleSections[0].target.id;
      navLinks.forEach((link) => {
        const isActive = link.hash === `#${activeId}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
  }, { rootMargin: "-15% 0px -65% 0px", threshold: [0, 0.2, 0.5, 0.8] });

  sections.forEach((section) => navObserver.observe(section));

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealTargets = document.querySelectorAll(
      ".about-section, .services-section, .admin-section, .industries-section, .tools-section, .process-section, .values-section, .expectations-section, .contact-section",
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

const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const emailAddress = contactForm.dataset.contactEmail;
  if (!emailAddress) {
    formFeedback.textContent = "Email contact is not configured. Please use the contact details shown on this page.";
    formFeedback.classList.add("is-error");
    return;
  }

  const data = new FormData(contactForm);
  const body = [
    `Name: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    `Business: ${data.get("business") || "Not provided"}`,
    `Service needed: ${data.get("service")}`,
    `Industry: ${data.get("industry")}`,
    "",
    "Message:",
    data.get("message"),
  ].join("\n");
  const subject = `Bookkeeping and business support inquiry from ${data.get("name")}`;
  const draftUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  formFeedback.classList.remove("is-error");
  formFeedback.textContent = "Your email app should open with the draft. It has not been sent until you review and send it there.";
  window.location.href = draftUrl;
});

const copyrightYear = document.querySelector("#copyright-year");
if (copyrightYear) copyrightYear.textContent = String(new Date().getFullYear());
