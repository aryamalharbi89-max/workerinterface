// ===== UniBox Global Navigation =====

window.UniBoxNav = {
  pages: {
    home: "home2.html",
    alerts: "alerts2.html",
    profile: "profile2.html",
    settings: "settings2.html",
    map: "map2.html",
    lockerSelection: "locker-selection2.html",
    orderDetails: "order-details2.html",
    scan: "scan2.html",
    success: "success2.html",
    editProfile: "edit-profile2.html",
    lockerOpened: "Locker Opened Successfully2.html"
  },

  go(pageKey, params = {}) {
    const base = this.pages[pageKey];
    if (!base) {
      console.warn("Unknown page key:", pageKey);
      return;
    }

    const url = new URL(base, window.location.href);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });

    window.location.href = url.toString();
  },

  back(fallback = "home") {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.go(fallback);
    }
  },

  getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  },

  currentOrderId() {
    return this.getParam("order") || localStorage.getItem("selectedOrderId") || "";
  },

  currentLockerId() {
    return this.getParam("locker") || localStorage.getItem("selectedLockerId") || "";
  },

  saveContext({ orderId, lockerId } = {}) {
    if (orderId) localStorage.setItem("selectedOrderId", String(orderId));
    if (lockerId) localStorage.setItem("selectedLockerId", String(lockerId));
  },

  openOrderDetails(orderId) {
    this.saveContext({ orderId });
    this.go("orderDetails", { order: orderId });
  },

  openMap(orderId) {
    this.saveContext({ orderId });
    this.go("map", { order: orderId });
  },

  openLockerSelection(orderId) {
    this.saveContext({ orderId });
    this.go("lockerSelection", { order: orderId });
  },

  openScan(orderId, lockerId) {
    this.saveContext({ orderId, lockerId });
    this.go("scan", { order: orderId, locker: lockerId });
  },

  openSuccess(orderId, lockerId) {
    this.saveContext({ orderId, lockerId });
    this.go("success", { order: orderId, locker: lockerId });
  },

  openSettings() {
    this.go("settings");
  },

  openProfile() {
    this.go("profile");
  },

  openAlerts(tab = "") {
    if (tab) this.go("alerts", { tab });
    else this.go("alerts");
  },

  openHelp() {
    window.location.href = "support2.html";
  }
};


// ===== Legacy simple back function =====
window.UniBoxBack = function(fallback = "home2.html") {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = fallback;
  }
};


// ===== Unified Header =====
window.mountUniBoxHeader = function({
  title = "UniBox",
  fallback = "home2.html",
  showSettings = true,
  settingsHref = "settings2.html"
} = {}) {
  const header = document.querySelector("[data-unibox-header]");
  if (!header) return;

  header.innerHTML = `
    <div class="page-header">
      <i class="fa-solid fa-arrow-left back-arrow" onclick="UniBoxBack('${fallback}')"></i>
      <div class="page-title">${title}</div>
      ${
        showSettings
          ? `<a class="header-icon-btn" href="${settingsHref}" aria-label="Settings">
               <i class="fa-solid fa-gear"></i>
             </a>`
          : `<div class="header-spacer"></div>`
      }
    </div>
  `;
};


// ===== Unified Bottom Nav =====
window.mountBottomNav = function(activePage = "") {
  const nav = document.querySelector("[data-bottom-nav]");
  if (!nav) return;

  nav.innerHTML = `
    <a href="${UniBoxNav.pages.home}" class="${activePage === 'home' ? 'active' : ''}">
      <i class="fa-solid fa-house"></i>
      <span>Home</span>
    </a>
    <a href="${UniBoxNav.pages.lockerSelection}" class="${activePage === 'lockers' ? 'active' : ''}">
      <i class="fa-solid fa-lock"></i>
      <span>Lockers</span>
    </a>
    <a href="${UniBoxNav.pages.alerts}" class="${activePage === 'alerts' ? 'active' : ''}">
      <i class="fa-solid fa-bell"></i>
      <span>Alerts</span>
    </a>
    <a href="${UniBoxNav.pages.profile}" class="${activePage === 'profile' ? 'active' : ''}">
      <i class="fa-solid fa-user"></i>
      <span>Profile</span>
    </a>
  `;
};


// ===== Unified Top Tabs =====
window.mountTopTabs = function(activeTab = "home") {
  const tabs = document.querySelector("[data-top-tabs]");
  if (!tabs) return;

  tabs.innerHTML = `
    <button class="tab-btn ${activeTab === 'home' ? 'active' : ''}" onclick="UniBoxNav.go('home')">Home</button>
    <button class="tab-btn ${activeTab === 'delivery' ? 'active' : ''}" onclick="UniBoxNav.openAlerts('delivery')">Delivery</button>
    <button class="tab-btn ${activeTab === 'system' ? 'active' : ''}" onclick="UniBoxNav.openAlerts('system')">System</button>
    <button class="tab-btn ${activeTab === 'alerts' ? 'active' : ''}" onclick="UniBoxNav.openAlerts('alerts')">Alerts</button>
  `;
};