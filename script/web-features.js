/**
 * web-features.js
 * Renders and filters the Web Features catalog on resources.mokio.online
 */

const FEATURES = [
  {
    id: "image-converter",
    title: "Image Converter",
    description: "Convert images between PNG, JPG, WebP, SVG, and more—all in your browser.",
    type: "image",
    status: "AVAILABLE",
    href: "./features/image-converter.html",
    icon: `
      <svg viewBox="0 0 48 48" fill="none">
        <rect x="7" y="10" width="31" height="27" rx="5"></rect>
        <circle cx="17" cy="19" r="3"></circle>
        <path d="m10 33 9-8 6 5 5-5 6 7"></path>
        <path d="m38 7 1.4 3.6L43 12l-3.6 1.4L38 17l-1.4-3.6L33 12l3.6-1.4L38 7Z"></path>
      </svg>
    `,
  },
  {
    id: "document-converter",
    title: "Document Converter",
    description: "Convert documents between formats with a straightforward tool that runs on the web.",
    type: "file",
    status: "AVAILABLE",
    href: "./features/document-converter.html",
    icon: `
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M13 7h14l9 9v22a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3Z"></path>
        <path d="M27 8v9h9M16 25h14M16 31h9"></path>
        <path d="m28 25 3 3-3 3"></path>
      </svg>
    `,
  },
  {
    id: "background-remover",
    title: "Background Remover",
    description: "Remove backgrounds from images with AI or manually.",
    type: "image",
    status: "AVAILABLE",
    href: "./features/background-remover.html",
    icon: `
      <svg viewBox="0 0 48 48" fill="none">
        <rect x="7" y="10" width="31" height="27" rx="5"></rect>
        <circle cx="17" cy="19" r="3"></circle>
        <path d="m10 33 9-8 6 5 5-5 6 7"></path>
        <path d="m38 7 1.4 3.6L43 12l-3.6 1.4L38 17l-1.4-3.6L33 12l3.6-1.4L38 7Z"></path>
      </svg>
    `,
  },
];

// Shared chrome
const menuButton = document.querySelector(".mobile-menu-btn");
const headerLinks = document.querySelector(".header-links");

menuButton?.addEventListener("click", () => {
  const isOpen = headerLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

headerLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    headerLinks.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

// Catalog elements
const searchInput = document.querySelector("#featureSearch");
const filterButtons = [...document.querySelectorAll(".filter-chip")];
const featureGrid = document.querySelector("#featureGrid");
const emptyState = document.querySelector("#featureEmptyState");
const resultsCount = document.querySelector("#featureResultsCount");
const featureCountEl = document.querySelector("#featureCount");

let activeFilter = "all";

function createFeatureCard(feature) {
  const a = document.createElement("a");
  a.className = "web-feature-card";
  a.href = feature.href;
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", `Open ${feature.title}`);
  a.dataset.type = feature.type;
  a.dataset.search = `${feature.title} ${feature.description} ${feature.type}`.toLowerCase();

  const typeLabel = feature.type === "image" ? "IMAGE TOOL" : "FILE TOOL";

  a.innerHTML = `
    <div class="feature-card-topline">
      <span class="feature-type">${typeLabel}</span>
      <span class="feature-status">${feature.status}</span>
    </div>
    <div class="feature-icon feature-icon-file" aria-hidden="true">
      ${feature.icon}
    </div>
    <h3>${feature.title}</h3>
    <p>${feature.description}</p>
    <span class="feature-card-action">Open ${feature.title} <span aria-hidden="true">↗</span></span>
  `;

  return a;
}

function renderFeatures() {
  featureGrid.innerHTML = "";
  for (const feature of FEATURES) {
    featureGrid.appendChild(createFeatureCard(feature));
  }
}

function updateCatalog() {
  const query = (searchInput?.value || "").trim().toLowerCase();
  const cards = [...featureGrid.querySelectorAll(".web-feature-card")];
  let visibleCount = 0;

  for (const card of cards) {
    const matchesFilter = activeFilter === "all" || card.dataset.type === activeFilter;
    const searchableText = `${card.dataset.search} ${card.textContent}`.toLowerCase();
    const matchesQuery = !query || searchableText.includes(query);
    const isVisible = matchesFilter && matchesQuery;

    card.hidden = !isVisible;
    visibleCount += Number(isVisible);
  }

  if (emptyState) {
    emptyState.hidden = visibleCount > 0;
  }

  if (resultsCount) {
    resultsCount.textContent =
      query || activeFilter !== "all"
        ? `${visibleCount} ${visibleCount === 1 ? "tool" : "tools"}`
        : "";
  }

  if (featureCountEl) {
    featureCountEl.textContent = `${FEATURES.length} available`;
  }
}

// Filter chips
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-pressed", "true");
    activeFilter = btn.dataset.filter || "all";
    updateCatalog();
  });
});

// Search
searchInput?.addEventListener("input", updateCatalog);

// Keyboard shortcut: "/" focuses search
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput?.focus();
  }
});

// Boot
renderFeatures();
updateCatalog();
