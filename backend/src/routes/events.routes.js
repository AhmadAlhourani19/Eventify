import { Router } from 'express';
import { pool } from '../db/db.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT e.event_id, e.name, e.start_at, e.end_at, e.is_published,
              v.venue_id, v.name AS venue
       FROM events e
       LEFT JOIN venues v ON v.venue_id = e.venue_id
       ORDER BY e.start_at DESC`
    );
    res.json({ data: rows });
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description, start_at, end_at, is_published = 0, venue_id } = req.body;
    if (!name || !start_at || !end_at || !venue_id) {
      return res.status(400).json({ error: 'name, start_at, end_at, venue_id are required' });
    }
    const [result] = await pool.query(
      `INSERT INTO events (name, description, start_at, end_at, is_published, venue_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description ?? null, start_at, end_at, is_published ? 1 : 0, venue_id]
    );
    res.status(201).json({ event_id: result.insertId });
  } catch (e) { next(e); }
});

router.get('/:eventid', async(req, res, next)=>{
    const {eventid} = req.params;
    const id = Number(eventid);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'eventid must be a positive integer' });
    }
    try{
        const [rows] = await pool.query(
            `select e.event_id, e.name, e.start_at, e.end_at, e.is_published,
                v.venue_id, v.name AS venue
            From events e
            Left join venues v on v.venue_id = e.venue_id
            where e.event_id = (?)
            LIMIT 1`, [id]
        );
        if (rows.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
        }

        res.json({data: rows})
    } catch (e) {next(e);}
})

export default router;
