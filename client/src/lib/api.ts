const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const ADMIN_KEY_STORAGE = "brotabox_admin_key";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  plan: {
    plantIds: string[];
    frequencyId: string;
    addOnIds: string[];
    priceEstimate: number;
  };
  message: string;
  status: "novo" | "contatado" | "convertido" | "perdido";
  createdAt: string;
};

export type Client = {
  id: string;
  leadId?: string;
  name: string;
  phone: string;
  email: string;
  plan: Lead["plan"];
  address: string;
  status: "ativo" | "pausado" | "cancelado";
  createdAt: string;
};

export type Delivery = {
  id: string;
  clientId: string;
  date: string;
  status: "agendada" | "enviada" | "entregue" | "atrasada";
  items: string;
  notes: string;
  createdAt: string;
};

export type Reminder = {
  id: string;
  clientId: string;
  type: "rega" | "adubo" | "cobranca" | "renovacao";
  dueDate: string;
  done: boolean;
  notes: string;
  createdAt: string;
};

function getAdminKey() {
  return localStorage.getItem(ADMIN_KEY_STORAGE) || "";
}

export function setAdminKey(key: string) {
  localStorage.setItem(ADMIN_KEY_STORAGE, key);
}

export function clearAdminKey() {
  localStorage.removeItem(ADMIN_KEY_STORAGE);
}

export function hasAdminKey() {
  return Boolean(getAdminKey());
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  admin = false
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  if (admin) headers.set("xadminkey", getAdminKey());

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erro ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function verifyAdminKey(key: string) {
  const res = await fetch(`${API_URL}/api/admin/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });
  const data = await res.json();
  return Boolean(data.ok);
}

export const api = {
  createLead: (payload: Omit<Lead, "id" | "status" | "createdAt">) =>
    request<Lead>("/api/leads", { method: "POST", body: JSON.stringify(payload) }),

  listLeads: () => request<Lead[]>("/api/leads", {}, true),
  updateLead: (id: string, payload: Partial<Lead>) =>
    request<Lead>(`/api/leads/${id}`, { method: "PATCH", body: JSON.stringify(payload) }, true),
  deleteLead: (id: string) => request<void>(`/api/leads/${id}`, { method: "DELETE" }, true),
  convertLead: (id: string, address: string) =>
    request<Client>(`/api/leads/${id}/convert`, { method: "POST", body: JSON.stringify({ address }) }, true),

  listClients: () => request<Client[]>("/api/clients", {}, true),
  createClient: (payload: Partial<Client>) =>
    request<Client>("/api/clients", { method: "POST", body: JSON.stringify(payload) }, true),
  updateClient: (id: string, payload: Partial<Client>) =>
    request<Client>(`/api/clients/${id}`, { method: "PATCH", body: JSON.stringify(payload) }, true),
  deleteClient: (id: string) => request<void>(`/api/clients/${id}`, { method: "DELETE" }, true),

  listDeliveries: () => request<Delivery[]>("/api/deliveries", {}, true),
  createDelivery: (payload: Partial<Delivery>) =>
    request<Delivery>("/api/deliveries", { method: "POST", body: JSON.stringify(payload) }, true),
  updateDelivery: (id: string, payload: Partial<Delivery>) =>
    request<Delivery>(`/api/deliveries/${id}`, { method: "PATCH", body: JSON.stringify(payload) }, true),
  deleteDelivery: (id: string) => request<void>(`/api/deliveries/${id}`, { method: "DELETE" }, true),

  listReminders: () => request<Reminder[]>("/api/reminders", {}, true),
  createReminder: (payload: Partial<Reminder>) =>
    request<Reminder>("/api/reminders", { method: "POST", body: JSON.stringify(payload) }, true),
  updateReminder: (id: string, payload: Partial<Reminder>) =>
    request<Reminder>(`/api/reminders/${id}`, { method: "PATCH", body: JSON.stringify(payload) }, true),
  deleteReminder: (id: string) => request<void>(`/api/reminders/${id}`, { method: "DELETE" }, true),
};
