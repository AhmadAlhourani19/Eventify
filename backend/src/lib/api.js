// src/lib/api.js

// Prefer CRA env; fallback to Vite if you ever switch; else empty (only if proxying)
const BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE) ||
  '';

console.log('[API BASE]', BASE);

async function http(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const text = await res.text();
    throw new Error(
      `Expected JSON but got ${ct}. Path: ${path}. First 120 chars: ${text.slice(0, 120)}`
    );
  }

  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error || data?.message || res.statusText;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  listEvents: async () => {
    const r = await http(`/events`);
    const out = r.data ?? r;
    return Array.isArray(out) ? out : [];
  },
  getEvent: async (id) => {
    const r = await http(`/events/${id}`);
    const out = Array.isArray(r.data) ? r.data[0] : r.data ?? r;
    return out || null;
  },
  listTicketTypes: async (eventId) => {
    const r = await http(`/events/${eventId}/ticket-types`);
    const out = r.data ?? r;
    return Array.isArray(out) ? out : [];
  },
  createTicketType: (eventId, payload) =>
    http(`/events/${eventId}/ticket-types`, { method: 'POST', body: payload }),

  searchCustomers: async (name) => {
    const r = await http(`/customers?name=${encodeURIComponent(name)}`);
    const out = r.data ?? r;
    return Array.isArray(out) ? out : [];
  },
  createCustomer: (payload) =>
    http(`/customers`, { method: 'POST', body: payload }).then((r) => r.data),

  createOrder: (customer_id) =>
    http(`/orders`, { method: 'POST', body: { customer_id } }),

  payOrder: (orderId, payload) =>
    http(`/orders/${orderId}/payments`, { method: 'POST', body: payload }).then((r) => r.data),

  scanTicket: (payload) =>
    http(`/checkins/scan`, { method: 'POST', body: payload }).then((r) => r.data),
};
