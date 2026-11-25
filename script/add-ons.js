/**
 * add-ons.js
 * Renders and filters the Add-ons catalog on resources.mokio.online
 */

const ADDONS = [
  // Placeholder / future add-ons can be added here.
  // Example shape:
  // {
  //   id: "example",
  //   title: "Example Add-on",
  //   description: "Short description of what it does.",
  //   category: "games",          // platform | games | tools
  //   search: "example keywords",
  //   href: "https://app.mokio.online/",
  //   badge: "COMING SOON",
  //   action: "Learn more"
  // }
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
const searchInput = document.querySelector("#resourceSearch");
const filterButtons = [...document.querySelectorAll(".filter-chip")];
const resourceGrid = document.querySelector("#resourceGrid");
const emptyState = document.querySelector("#emptyState");
const emptyTitle = document.querySelector("#emptyTitle");
const emptyMessage = document.querySelector("#emptyMessage");
const resultsCount = document.querySelector("#resultsCount");
const addonCountEl = document.querySelector("#addonCount");

let activeFilter = "all";

function createCard(addon) {
  const a = document.createElement("a");
  a.className = "resource-card";
  a.href = addon.href || "#";
  a.dataset.category = addon.category || "tools";
  a.dataset.search = `${addon.search || ""} ${addon.title} ${addon.description}`.toLowerCase();

  a.innerHTML = `
    <div class="card-topline">
      <span class="card-category">${addon.badge || addon.category?.toUpperCase() || "ADD-ON"}</span>
      <span class="card-arrow" aria-hidden="true">↗</span>
    </div>
    <div class="resource-info">
      <h3>${addon.title}</h3>
      <p>${addon.description}</p>
    </div>
    <span class="card-action">${addon.action || "Open"} <span aria-hidden="true">→</span></span>
  `;

  return a;
}

function renderCards() {
  resourceGrid.innerHTML = "";

  if (ADDONS.length === 0) {
    // Nothing to render yet — empty state will handle the UI
    return;
  }

  for (const addon of ADDONS) {
    resourceGrid.appendChild(createCard(addon));
  }
}

function updateCatalog() {
  const query = (searchInput?.value || "").trim().toLowerCase();
  const cards = [...resourceGrid.querySelectorAll(".resource-card")];
  let visibleCount = 0;

  for (const card of cards) {
    const matchesFilter = activeFilter === "all" || card.dataset.category === activeFilter;
    const searchableText = `${card.dataset.search} ${card.textContent}`.toLowerCase();
    const matchesQuery = !query || searchableText.includes(query);
    const isVisible = matchesFilter && matchesQuery;

    card.hidden = !isVisible;
    visibleCount += Number(isVisible);
  }

  const hasAnyAddons = ADDONS.length > 0;
  const showEmpty = !hasAnyAddons || visibleCount === 0;

  if (emptyState) {
    emptyState.hidden = !showEmpty;

    if (!hasAnyAddons) {
      emptyTitle.textContent = "No add-ons yet";
      emptyMessage.textContent =
        "We're still building the first wave of Mokio add-ons. Check back soon, or explore the full app panel in the meantime.";
    } else {
      emptyTitle.textContent = "No add-ons match";
      emptyMessage.textContent = "Try another name or category. Clear filters to see everything.";
    }
  }

  if (resultsCount) {
    resultsCount.textContent =
      hasAnyAddons && (query || activeFilter !== "all")
        ? `${visibleCount} ${visibleCount === 1 ? "add-on" : "add-ons"}`
        : "";
  }

  if (addonCountEl) {
    const total = ADDONS.length;
    addonCountEl.textContent = total === 0 ? "Coming soon" : `${total} add-on${total === 1 ? "" : "s"}`;
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
renderCards();
updateCatalog();
