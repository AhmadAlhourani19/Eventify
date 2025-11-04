const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

async function get(path) {
    const res = await fetch(`${BASE}${path}`);
    return res.json();
}

async function post(path, body) {
    const res = await fetch(`${BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return res.json();
}

async function put(path, body) {
    const res = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
    });
    return res.json();
}

async function del(path) {
    const res = await fetch(`${BASE}${path}`, { method: 'DELETE' });
    return res.json();
}

export const api = {
  listEvents: async () => {
    const res = await get('/events');
    return Array.isArray(res?.data) ? res.data : [];
  },

  getEvent: async (eventId) => {
    const res = await get(`/events/${eventId}`);
    return Array.isArray(res?.data) ? res.data[0] : res?.data ?? null;
  },

  createEvent: async ({ name, description, start_at, end_at, is_published = 0, venue_id }) => {
    return post('/events', { name, description, start_at, end_at, is_published, venue_id });
  },

  listTicketTypes: async (eventId) => {
    const res = await get(`/ticketTypes/${eventId}/ticket-types`);
    return Array.isArray(res?.data) ? res.data : [];
  },

  createTicketType: async (eventId, { name, price, allocation, is_active = true }) => {
    return post(`/ticketTypes/${eventId}/ticket-types`, { name, price, allocation, is_active });
  },

  searchCustomers: async (name) => {
    const res = await get(`/customers?name=${encodeURIComponent(name)}`);
    return Array.isArray(res?.data) ? res.data : [];
  },

  createCustomer: async ({ name, email, phone }) => {
    const res = await post('/customers', { name, email, phone });
    return res?.data;
  },

  createOrder: async (customer_id) => {
    return post('/orders', { customer_id });
  },

  payOrder: async (orderId, { method, status, items, reference }) => {
    const res = await post(`/payments/${orderId}/payments`, { method, status, items, reference });
    return res?.data;
  },

  checkIn: async (ticket_code, staff_id) => {
    const res = await post('/checkins/scan', { ticket_code, staff_id });
    return res?.data;
  },
};
