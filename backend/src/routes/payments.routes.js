import { Router } from 'express';
import { tx, pool } from '../db/db.js';
import { generateTicketCode } from '../utils/ticketCode.js';

const router = Router();

router.post('/orders/:orderId/payments', async (req, res, next) => {
  const orderId = Number(req.params.orderId);
  const { method, status, items, reference } = req.body;

  if (!orderId || !method || !status || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'orderId, method, status, and items[] are required' });
  }

  try {
    const out = await tx(async (conn) => {
      const [o] = await conn.query('SELECT * FROM orders WHERE order_id=? FOR UPDATE', [orderId]);
      if (!o.length) throw Object.assign(new Error('Order not found'), { status: 404 });
      const order = o[0];
      if (order.status !== 'pending' && order.status !== 'paid') {
        throw Object.assign(new Error('Order not payable in current status'), { status: 409 });
      }

      const ids = items.map(i => i.event_ticket_type_id);
      const [types] = await conn.query(
        `SELECT ett.*, 
                (SELECT COUNT(*) FROM tickets t 
                   WHERE t.event_ticket_type_id = ett.event_ticket_type_id 
                     AND t.status IN ('issued','checked_in')) AS sold
         FROM event_ticket_types ett
         WHERE ett.event_ticket_type_id IN (${ids.map(() => '?').join(',')})
         FOR UPDATE`,
        ids
      );

      if (types.length !== ids.length) {
        throw Object.assign(new Error('One or more ticket types not found'), { status: 404 });
      }

      const byId = new Map(types.map(t => [t.event_ticket_type_id, t]));

      let subtotal = 0;
      for (const { event_ticket_type_id, quantity } of items) {
        if (!Number.isInteger(quantity) || quantity <= 0) {
          throw Object.assign(new Error('Quantity must be positive integer'), { status: 400 });
        }
        const tt = byId.get(event_ticket_type_id);
        const sold = Number(tt.sold || 0);
        const remaining = Math.max(0, tt.allocation - sold);
        if (quantity > remaining) {
          throw Object.assign(new Error(`Insufficient capacity for type ${tt.name}: remaining ${remaining}`), { status: 409 });
        }
        subtotal += Number(tt.price) * quantity;
      }
      const discount_total = 0;
      const tax_total = 0;
      const grand_total = subtotal - discount_total + tax_total;

      const [pay] = await conn.query(
        `INSERT INTO payments (order_id, method, status, amount, reference)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, method, status, grand_total, reference || null]
      );

      if (status === 'succeeded') {
        for (const { event_ticket_type_id, quantity } of items) {
          const tt = byId.get(event_ticket_type_id);
          for (let i = 0; i < quantity; i++) {
            const code = generateTicketCode();
            await conn.query(
              `INSERT INTO tickets (order_id, event_ticket_type_id, ticket_code, attendee_name, attendee_email, status)
               VALUES (?, ?, ?, NULL, NULL, 'issued')`,
              [orderId, tt.event_ticket_type_id, code]
            );
          }
        }
        await conn.query(
          `UPDATE orders SET status='paid', subtotal=?, discount_total=?, tax_total=?, grand_total=? WHERE order_id=?`,
          [subtotal, discount_total, tax_total, grand_total, orderId]
        );
      }

      return { payment_id: pay.insertId, subtotal, discount_total, tax_total, grand_total, order_status: status === 'succeeded' ? 'paid' : order.status };
    });

    res.status(201).json({ data: out });
  } catch (e) { next(e); }
});

export default router;