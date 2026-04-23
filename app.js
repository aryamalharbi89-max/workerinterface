// app.js — UniBox shared state (localStorage)
const STORAGE_KEY = "unibox_state_v3";

/* =========================
   Default Seed Data
========================= */
const defaultState = {
  user: {
    name: "Khalid Mansour",
    role: "Senior Delivery Agent",
    phone: "+966 5X XXX XXXX",
    email: "khalid@email.com"
  },

  orders: [
    { id: 10293, customer: "Ahmed Ali", phone: "+966 501 111 222", location: "Zone A, Locker Wall A", time: "09:00 AM - 11:00 AM", status: "In Progress", size: "Medium", lockerZone: "A", assignedLocker: null, lat: 21.4858, lng: 39.1925, deliveredAt: null, lastAction: null },
    { id: 10294, customer: "Sarah Smith", phone: "+966 502 333 444", location: "Zone B, Locker Wall B", time: "11:30 AM - 01:30 PM", status: "Assigned", size: "Small", lockerZone: "B", assignedLocker: null, lat: 21.5433, lng: 39.1728, deliveredAt: null, lastAction: null },
    { id: 10295, customer: "Fahad Alqahtani", phone: "+966 503 555 666", location: "Zone A, Locker Wall A", time: "01:00 PM - 02:00 PM", status: "Assigned", size: "Large", lockerZone: "A", assignedLocker: null, lat: 21.4872, lng: 39.1952, deliveredAt: null, lastAction: null },
    { id: 10296, customer: "Noura Alharbi", phone: "+966 504 777 888", location: "Zone B, Locker Wall B", time: "02:00 PM - 03:00 PM", status: "In Progress", size: "Small", lockerZone: "B", assignedLocker: "B-04", lat: 21.5419, lng: 39.1709, deliveredAt: null, lastAction: null },
    { id: 10297, customer: "Mohammed Saleh", phone: "+966 505 999 000", location: "Zone A, Locker Wall A", time: "03:00 PM - 04:30 PM", status: "Failed", size: "Medium", lockerZone: "A", assignedLocker: null, lat: 21.4839, lng: 39.1898, deliveredAt: null, lastAction: null },
    { id: 10298, customer: "Reem Alotaibi", phone: "+966 506 121 212", location: "Zone B, Locker Wall B", time: "04:00 PM - 05:00 PM", status: "Cancelled", size: "Small", lockerZone: "B", assignedLocker: null, lat: 21.5444, lng: 39.1761, deliveredAt: null, lastAction: null },
    { id: 10299, customer: "Hussain Almutairi", phone: "+966 507 343 434", location: "Zone A, Locker Wall A", time: "05:00 PM - 06:00 PM", status: "Assigned", size: "Medium", lockerZone: "A", assignedLocker: null, lat: 21.4884, lng: 39.1931, deliveredAt: null, lastAction: null },
    { id: 10300, customer: "Lama Alzahrani", phone: "+966 508 565 656", location: "Zone B, Locker Wall B", time: "06:00 PM - 07:00 PM", status: "In Progress", size: "Large", lockerZone: "B", assignedLocker: null, lat: 21.5426, lng: 39.1740, deliveredAt: null, lastAction: null },
    { id: 10280, customer: "Omar Nasser", phone: "+966 509 787 878", location: "Zone A, Locker Wall A", time: "Oct 23, 11:30 AM", status: "Delivered", size: "Medium", lockerZone: "A", assignedLocker: "A-03", lat: 21.4858, lng: 39.1925, deliveredAt: "2025-10-23T08:30:00.000Z", lastAction: { type: "DEPOSIT_CONFIRMED", at: "2025-10-23T08:30:00.000Z" } },
    { id: 10275, customer: "Hanan Abdulrahman", phone: "+966 510 909 090", location: "Zone B, Locker Wall B", time: "Oct 22, 02:15 PM", status: "Delivered", size: "Small", lockerZone: "B", assignedLocker: "B-11", lat: 21.5433, lng: 39.1728, deliveredAt: "2025-10-22T11:15:00.000Z", lastAction: { type: "DEPOSIT_CONFIRMED", at: "2025-10-22T11:15:00.000Z" } }
  ],

  lockers: {
    A: [
      { id: "A-01", size: "Small", status: "Occupied" },
      { id: "A-02", size: "Small", status: "Available" },
      { id: "A-03", size: "Medium", status: "Available" },
      { id: "A-04", size: "Large", status: "Occupied" },
      { id: "A-05", size: "Medium", status: "Available" },
      { id: "A-06", size: "Large", status: "Available" },
      { id: "A-07", size: "Small", status: "Available" },
      { id: "A-08", size: "Medium", status: "Occupied" }
    ],
    B: [
      { id: "B-01", size: "Small", status: "Available" },
      { id: "B-02", size: "Medium", status: "Occupied" },
      { id: "B-03", size: "Large", status: "Available" },
      { id: "B-04", size: "Small", status: "Available" },
      { id: "B-05", size: "Medium", status: "Available" },
      { id: "B-06", size: "Large", status: "Occupied" },
      { id: "B-07", size: "Small", status: "Available" },
      { id: "B-08", size: "Medium", status: "Available" }
    ]
  },

  tickets: [],

  deposits: [
    { id: 1, orderId: 10280, lockerId: "A-03", zone: "A", at: "2025-10-23T08:30:00.000Z" },
    { id: 2, orderId: 10275, lockerId: "B-11", zone: "B", at: "2025-10-22T11:15:00.000Z" }
  ]
};

/* =========================
   Helpers
========================= */
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function safeNumber(x) {
  const n = Number(x);
  return isFinite(n) ? n : null;
}

function migrateState(state) {
  const base = clone(defaultState);
  const s = state && typeof state === "object" ? state : {};
  const merged = { ...base, ...s };
  merged.user = { ...base.user, ...(s.user || {}) };
  merged.orders = Array.isArray(s.orders) ? s.orders : base.orders;
  merged.tickets = Array.isArray(s.tickets) ? s.tickets : [];
  merged.deposits = Array.isArray(s.deposits) ? s.deposits : base.deposits;
  merged.lockers = s.lockers && typeof s.lockers === "object" ? s.lockers : base.lockers;
  
  const DESIRED_LOCKERS = 30;
  
  function sizeByIndex(i) {
    if (i % 3 === 1) return "Small";
    if (i % 3 === 2) return "Medium";
    return "Large";
  }

  ["A", "B"].forEach(zone => {
    const existing = Array.isArray(merged.lockers?.[zone]) ? merged.lockers[zone] : [];
    const byId = Object.fromEntries(existing.map(l => [l.id, l]));
    const next = [];
    
    for (let i = 1; i <= DESIRED_LOCKERS; i++) {
      const id = `${zone}-${String(i).padStart(2, "0")}`;
      const old = byId[id];
      next.push(old ? old : {
        id,
        size: sizeByIndex(i),
        status: Math.random() < 0.25 ? "Occupied" : "Available"
      });
    }
    merged.lockers[zone] = next;
  });

  merged.orders = merged.orders.map(o => {
    const def = base.orders.find(x => String(x.id) === String(o?.id));
    const mo = { ...(def || {}), ...(o || {}) };
    mo.lat = safeNumber(mo.lat);
    mo.lng = safeNumber(mo.lng);
    mo.assignedLocker = mo.assignedLocker ?? null;
    mo.status = mo.status || "Assigned";
    mo.size = mo.size || "Small";
    mo.lockerZone = mo.lockerZone || "A";
    mo.deliveredAt = mo.deliveredAt || null;
    mo.lastAction = mo.lastAction || null;
    return mo;
  });

  return merged;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const migrated = migrateState(parsed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    const fresh = clone(defaultState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getState() {
  return loadState();
}

function setState(updater) {
  const state = loadState();
  const next = typeof updater === "function" ? updater(state) : updater;
  const migratedNext = migrateState(next);
  saveState(migratedNext);
  return migratedNext;
}

/* =========================
   Core APIs
========================= */
function getOrderById(id) {
  const state = loadState();
  return state.orders.find(o => String(o.id) === String(id));
}

function updateOrderStatus(id, status) {
  return setState(state => {
    const order = state.orders.find(o => String(o.id) === String(id));
    if (order) {
      order.status = status;
      order.lastAction = { type: "STATUS_UPDATED", at: new Date().toISOString() };
    }
    return state;
  });
}

function updateUser(patch) {
  return setState(state => {
    state.user = { ...state.user, ...patch };
    return state;
  });
}

function listLockers(zone) {
  const state = loadState();
  return state.lockers?.[zone] || [];
}

function canFit(parcelSize, lockerSize) {
  const rank = { Small: 1, Medium: 2, Large: 3, "—": 0 };
  const p = rank[parcelSize] ?? 1;
  const l = rank[lockerSize] ?? 1;
  return l >= p;
}

// reserve a locker for an order (changes locker status + assigns locker to order)
function reserveLockerForOrder(orderId, lockerId) {
  return setState(state => {
    const order = state.orders.find(o => String(o.id) === String(orderId));
    if (!order) return state;

    const zone = order.lockerZone;
    const lockers = state.lockers?.[zone] || [];
    const locker = lockers.find(l => l.id === lockerId);

    if (!locker) return state;
    if (locker.status !== "Available") return state;

    // enforce size fit
    if (!canFit(order.size, locker.size)) return state;

    // release previous locker if any (same zone)
    if (order.assignedLocker && order.assignedLocker !== lockerId) {
      const prev = lockers.find(l => l.id === order.assignedLocker);
      if (prev) prev.status = "Available";
    }

    locker.status = "Occupied";
    order.assignedLocker = lockerId;

    if (!String(order.status).toLowerCase().includes("delivered")) {
      order.status = "In Progress";
    }

    order.lastAction = { type: "LOCKER_RESERVED", at: new Date().toISOString() };
    return state;
  });
}

// simulate sending open command (hardware)
function openLocker(orderId, lockerId) {
  return setState(state => {
    const order = state.orders.find(o => String(o.id) === String(orderId));
    if (!order) return state;

    order.assignedLocker = lockerId || order.assignedLocker;
    order.lastAction = { type: "UNLOCK_COMMAND_SENT", at: new Date().toISOString() };
    return state;
  });
}

// confirm parcel deposit (updates status + logs timeline)
function confirmDeposit(orderId) {
  return setState(state => {
    const order = state.orders.find(o => String(o.id) === String(orderId));
    if (!order) return state;

    const now = new Date().toISOString();

    state.deposits = state.deposits || [];
    state.deposits.push({
      id: Date.now(),
      orderId: order.id,
      lockerId: order.assignedLocker || null,
      zone: order.lockerZone || null,
      at: now
    });

    order.status = "Delivered";
    order.deliveredAt = now;
    order.lastAction = { type: "DEPOSIT_CONFIRMED", at: now };

    return state;
  });
}

// admin support tickets
function createTicket({ orderId, type, message }) {
  return setState(state => {
    state.tickets = state.tickets || [];
    state.tickets.push({
      id: Date.now(),
      orderId: orderId || null,
      type: type || "General",
      message: message || "",
      status: "Open",
      createdAt: new Date().toISOString()
    });
    return state;
  });
}

/* =========================
   Helpers for pages
========================= */
function getActiveOrders() {
  const state = loadState();
  return state.orders.filter(o => !String(o.status).toLowerCase().includes("delivered"));
}

function getDeliveredOrders() {
  const state = loadState();
  return state.orders.filter(o => String(o.status).toLowerCase().includes("delivered"));
}

function getOrdersByStatus(status) {
  const state = loadState();
  return state.orders.filter(
    o => String(o.status).toLowerCase() === String(status).toLowerCase()
  );
}

// wipe storage
function resetApp() {
  localStorage.removeItem(STORAGE_KEY);
}

/* =========================
   Export to window
========================= */
window.UniBox = {
  getState,
  setState,
  getOrderById,
  updateOrderStatus,
  updateUser,
  listLockers,
  reserveLockerForOrder,
  createTicket,
  resetApp,
  canFit,
  openLocker,
  confirmDeposit,

  // helpers
  getActiveOrders,
  getDeliveredOrders,
  getOrdersByStatus
};