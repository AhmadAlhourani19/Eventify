import { Router } from 'express';
import { pool } from '../db/db.js';

const router = Router();

router.post('/:eventId/ticket-types', async (req, res, next) => {
  try {
    const eventId = Number(req.params.eventId);
    const { name, price, allocation, is_active = true } = req.body;

    if (!eventId || !name || price == null || allocation == null) {
      return res.status(400).json({ error: 'eventId, name, price, allocation are required' });
    }

    const [dup] = await pool.query(
      'SELECT 1 FROM event_ticket_types WHERE event_id=? AND name=? LIMIT 1',
      [eventId, name]
    );
    if (dup.length) return res.status(409).json({ error: 'Type name already exists for this event' });

    const [result] = await pool.query(
      `INSERT INTO event_ticket_types (event_id, name, price, allocation, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [eventId, name, price, allocation, is_active ? 1 : 0]
    );

    res.status(201).json({ event_ticket_type_id: result.insertId });
  } catch (e) { next(e); }
});

router.get('/:eventId/ticket-types', async (req, res, next) => {
  try {
    const eventId = Number(req.params.eventId);
    const [rows] = await pool.query(
      `SELECT ett.*, 
              (SELECT COUNT(*) FROM tickets t 
                 WHERE t.event_ticket_type_id = ett.event_ticket_type_id 
                   AND t.status IN ('issued','checked_in')) AS sold
       FROM event_ticket_types ett
       WHERE ett.event_id=?`,
      [eventId]
    );
    const data = rows.map(r => ({ ...r, remaining: Math.max(0, r.allocation - (r.sold || 0)) }));
    res.json({ data });
  } catch (e) { next(e); }
});

export default router;