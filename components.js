// components.js — UniBox navigation helpers (final)

/* =========================
   1) Back helper
========================= */
window.UniBoxBack = function (fallback = "home2.html") {
  try {
    // لو فيه تاريخ سابق داخل نفس التبويب
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
  } catch (e) {}

  // fallback
  window.location.href = fallback;
};

/* =========================
   2) Active nav highlight
========================= */
function currentFile() {
  const p = (location.pathname || "").split("/").pop();
  return (p || "home2.html").toLowerCase();
}

// خريطة: أي صفحة تعتبر تابعة لأي تبويب
const PAGE_TO_TAB = {
  "home2.html": "home2",
  "map2.html": "map2",
  "orders2.html": "orders2",
  "settings2.html": "settings2",
  "profile2.html": "profile2",

  // pages تعتبر ضمن Parcels
  "order-details2.html": "orders2",
  "locker-selection2.html": "orders2",
  "open-locker2.html": "orders2",
  "deposit-success2.html": "orders2",
  "delivery-success2.html": "orders2",

  // pages تعتبر ضمن Profile
  "edit-profile2.html": "profile2",
  "login2.html": "profile2",
  "register2.html": "profile2"
};

function setActiveNav() {
  const file = currentFile();
  const tab = PAGE_TO_TAB[file] || "home2";

  // يدور عناصر الـ nav اللي فيها data-page
  const items = document.querySelectorAll(".bottom-nav .nav-item[data-page]");
  items.forEach(a => a.classList.remove("active"));

  const active = document.querySelector(`.bottom-nav .nav-item[data-page="${tab}"]`);
  if (active) active.classList.add("active");
}

/* =========================
   3) Make nav clickable (prevent overlays)
========================= */
function injectNavFixStyles() {
  const css = `
    .bottom-nav{ z-index: 9999 !important; position:absolute; }
    .footer-action{ z-index: 9000 !important; }
    header{ z-index: 9001 !important; position:relative; }
  `;
  const style = document.createElement("style");
  style.setAttribute("data-unibox", "nav-fix");
  style.textContent = css;
  document.head.appendChild(style);
}

/* =========================
   4) Safe click for # links
========================= */
function patchHashLinks() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    // لو الرابط href="#" فقط، لا يخرب الصفحة (ينط فوق)
    if (a.getAttribute("href") === "#") {
      e.preventDefault();
    }
  }, { passive: false });
}

/* =========================
   Init
========================= */
function initComponents() {
  injectNavFixStyles();
  patchHashLinks();
  setActiveNav();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initComponents);
} else {
  initComponents();
}