/**
 * Reusable API client for Bold Logistics.
 *
 * Runs in configurable demo mode. By default, VITE_USE_MOCKS=true keeps the UI fully functional with in-memory data. Set VITE_USE_MOCKS=false and VITE_API_BASE_URL=http://localhost:8080 to call the Spring Boot backend.
 */
import {
  mockCustomers,
  mockDispatches,
  mockDocs,
  mockDrivers,
  mockNotifications,
  mockOrders,
  mockSummary,
  mockVehicles,
} from "./mockData";
import type {
  Customer,
  DashboardSummary,
  Dispatch,
  DispatchStatus,
  Doc,
  Driver,
  Notification,
  Order,
  OrderStatus,
  Vehicle,
} from "./types";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const TOKEN_KEY = "bold.jwt";
const USER_KEY = "bold.user";

// ---------- token + user helpers ----------
export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser: (): { email: string; name: string } | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (u: { email: string; name: string }) =>
    localStorage.setItem(USER_KEY, JSON.stringify(u)),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
};

// ---------- low-level request ----------
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const token = auth.getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ---------- mock helpers ----------
const delay = <T>(value: T, ms = 350): Promise<T> =>
  new Promise((r) => setTimeout(() => r(value), ms));

// In-memory mutable copies for create/update during the session
const store = {
  customers: [...mockCustomers],
  orders: [...mockOrders],
  dispatches: [...mockDispatches],
  drivers: [...mockDrivers],
  vehicles: [...mockVehicles],
  docs: [...mockDocs],
  notifications: [...mockNotifications],
};

const newId = (prefix: string) =>
  `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

// ---------- API ----------
export const api = {
  // Auth
  async login(email: string, password: string) {
    if (USE_MOCKS) {
      if (!email || !password) throw new Error("Email and password are required.");
      const user = { email, name: email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase()) };
      auth.setToken("mock.jwt." + btoa(email));
      auth.setUser(user);
      return delay({ token: auth.getToken()!, user });
    }
    const data = await request<{ token: string; user: { email: string; name: string } }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    );
    auth.setToken(data.token);
    auth.setUser(data.user);
    return data;
  },

  logout() {
    auth.clearToken();
  },

  // Dashboard
  getDashboardSummary: (): Promise<DashboardSummary> =>
    USE_MOCKS ? delay(mockSummary) : request("/api/dashboard/summary"),

  // Customers
  getCustomers: (): Promise<Customer[]> =>
    USE_MOCKS ? delay(store.customers) : request("/api/customers"),
  createCustomer: (c: Omit<Customer, "id" | "createdAt">): Promise<Customer> => {
    if (USE_MOCKS) {
      const item: Customer = { ...c, id: newId("C"), createdAt: new Date().toISOString().slice(0, 10) };
      store.customers = [item, ...store.customers];
      return delay(item);
    }
    return request("/api/customers", { method: "POST", body: JSON.stringify(c) });
  },

  // Orders
  getOrders: (): Promise<Order[]> =>
    USE_MOCKS ? delay(store.orders) : request("/api/orders"),
  createOrder: (o: Omit<Order, "id" | "createdAt" | "status">): Promise<Order> => {
    if (USE_MOCKS) {
      const item: Order = { ...o, id: newId("ORD"), status: "PENDING", createdAt: new Date().toISOString().slice(0, 10) };
      store.orders = [item, ...store.orders];
      return delay(item);
    }
    return request("/api/orders", { method: "POST", body: JSON.stringify(o) });
  },
  updateOrderStatus: (id: string, status: OrderStatus): Promise<Order> => {
    if (USE_MOCKS) {
      store.orders = store.orders.map((o) => (o.id === id ? { ...o, status } : o));
      return delay(store.orders.find((o) => o.id === id)!);
    }
    return request(`/api/orders/${id}/status?status=${status}`, { method: "PATCH" });
  },

  // Dispatches
  getDispatches: (): Promise<Dispatch[]> =>
    USE_MOCKS ? delay(store.dispatches) : request("/api/dispatches"),
  createDispatch: (d: Omit<Dispatch, "id" | "status">): Promise<Dispatch> => {
    if (USE_MOCKS) {
      const item: Dispatch = { ...d, id: newId("DSP"), status: "SCHEDULED" };
      store.dispatches = [item, ...store.dispatches];
      return delay(item);
    }
    return request("/api/dispatches", { method: "POST", body: JSON.stringify(d) });
  },
  updateDispatchStatus: (id: string, status: DispatchStatus): Promise<Dispatch> => {
    if (USE_MOCKS) {
      store.dispatches = store.dispatches.map((d) => (d.id === id ? { ...d, status } : d));
      return delay(store.dispatches.find((d) => d.id === id)!);
    }
    return request(`/api/dispatches/${id}/status?status=${status}`, { method: "PATCH" });
  },

  // Drivers
  getDrivers: (): Promise<Driver[]> =>
    USE_MOCKS ? delay(store.drivers) : request("/api/drivers"),
  createDriver: (d: Omit<Driver, "id">): Promise<Driver> => {
    if (USE_MOCKS) {
      const item: Driver = { ...d, id: newId("D") };
      store.drivers = [item, ...store.drivers];
      return delay(item);
    }
    return request("/api/drivers", { method: "POST", body: JSON.stringify(d) });
  },

  // Vehicles
  getVehicles: (): Promise<Vehicle[]> =>
    USE_MOCKS ? delay(store.vehicles) : request("/api/vehicles"),
  createVehicle: (v: Omit<Vehicle, "id">): Promise<Vehicle> => {
    if (USE_MOCKS) {
      const item: Vehicle = { ...v, id: newId("V") };
      store.vehicles = [item, ...store.vehicles];
      return delay(item);
    }
    return request("/api/vehicles", { method: "POST", body: JSON.stringify(v) });
  },

  // Documents
  getDocuments: (): Promise<Doc[]> =>
    USE_MOCKS ? delay(store.docs) : request("/api/documents"),
  createDocument: (d: Omit<Doc, "id" | "uploadedAt">): Promise<Doc> => {
    if (USE_MOCKS) {
      const item: Doc = { ...d, id: newId("DOC"), uploadedAt: new Date().toISOString().slice(0, 10) };
      store.docs = [item, ...store.docs];
      return delay(item);
    }
    return request("/api/documents", { method: "POST", body: JSON.stringify(d) });
  },

  // Notifications
  getNotifications: (): Promise<Notification[]> =>
    USE_MOCKS ? delay(store.notifications) : request("/api/notifications"),
};
