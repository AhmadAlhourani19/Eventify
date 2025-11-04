import { Router } from 'express';
import { tx, pool } from '../db/db.js';

const router = Router();

router.post('/scan', async (req, res, next) => {
  const { ticket_code, staff_id } = req.body;
  if (!ticket_code) return res.status(400).json({ error: 'ticket_code required' });

  try {
    const out = await tx(async (conn) => {
      const [tks] = await conn.query(
        `SELECT * FROM tickets WHERE ticket_code=? FOR UPDATE`,
        [ticket_code]
      );
      if (!tks.length) throw Object.assign(new Error('Ticket not found'), { status: 404 });

      const t = tks[0];
      if (t.status === 'refunded' || t.status === 'void') {
        throw Object.assign(new Error(`Ticket is ${t.status}`), { status: 409 });
      }
      if (t.status === 'checked_in') {
        throw Object.assign(new Error('Ticket already checked in'), { status: 409 });
      }

      const [existing] = await conn.query(`SELECT 1 FROM check_ins WHERE ticket_id=? LIMIT 1`, [t.ticket_id]);
      if (existing.length) {
        throw Object.assign(new Error('Ticket already checked in'), { status: 409 });
      }

      await conn.query(
        `INSERT INTO check_ins (ticket_id, scanned_at, staff_id, device_id) VALUES (?, NOW(), ?, NULL)`,
        [t.ticket_id, staff_id || null]
      );

      await conn.query(`UPDATE tickets SET status='checked_in' WHERE ticket_id=?`, [t.ticket_id]);

      return { ticket_id: t.ticket_id, status: 'checked_in' };
    });

    res.status(201).json({ data: out });
  } catch (e) { next(e); }
});

export default router;
