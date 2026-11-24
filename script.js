const searchInput = document.querySelector("#resourceSearch");
const filterButtons = [...document.querySelectorAll(".filter-chip")];
const resourceCards = [...document.querySelectorAll(".resource-card")];
const emptyState = document.querySelector("#emptyState");
const resultsCount = document.querySelector("#resultsCount");
const featureSearchInput = document.querySelector("#featureSearch");
const webFeatureCards = [...document.querySelectorAll(".web-feature-card")];
const featureEmptyState = document.querySelector("#featureEmptyState");
const featureResultsCount = document.querySelector("#featureResultsCount");
const year = document.querySelector("#year");
const menuButton = document.querySelector(".mobile-menu-btn");
const headerLinks = document.querySelector(".header-links");

let activeFilter = "all";

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

function updateResources() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  for (const card of resourceCards) {
    const matchesFilter = activeFilter === "all" || card.dataset.category === activeFilter;
    const searchableText = `${card.dataset.search} ${card.textContent}`.toLowerCase();
    const matchesQuery = searchableText.includes(query);
    const isVisible = matchesFilter && matchesQuery;

    card.hidden = !isVisible;
    visibleCount += Number(isVisible);
  }

  emptyState.hidden = visibleCount > 0;
  resultsCount.textContent = query || activeFilter !== "all"
    ? `${visibleCount} ${visibleCount === 1 ? "app" : "apps"}`
    : "";
}

searchInput.addEventListener("input", updateResources);

function updateWebFeatures() {
  const query = featureSearchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  for (const card of webFeatureCards) {
    const isVisible = card.textContent.toLowerCase().includes(query);
    card.hidden = !isVisible;
    visibleCount += Number(isVisible);
  }

  featureEmptyState.hidden = visibleCount > 0;
  featureResultsCount.textContent = query
    ? `${visibleCount} ${visibleCount === 1 ? "web feature" : "web features"}`
    : "";
}

featureSearchInput.addEventListener("input", updateWebFeatures);

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    for (const filterButton of filterButtons) {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    }

    updateResources();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
});

year.textContent = String(new Date().getFullYear());
