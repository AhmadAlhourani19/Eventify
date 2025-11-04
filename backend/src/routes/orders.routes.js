import { Router } from 'express';
import { pool } from '../db/db.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { customer_id } = req.body;
    if (!customer_id) return res.status(400).json({ error: 'customer_id required' });

    const [c] = await pool.query('SELECT customer_id FROM customers WHERE customer_id=?', [customer_id]);
    if (!c.length) return res.status(404).json({ error: 'Customer not found' });

    const [result] = await pool.query(
      `INSERT INTO orders (customer_id, status, subtotal, discount_total, tax_total, grand_total)
       VALUES (?, 'pending', 0, 0, 0, 0)`,
      [customer_id]
    );
    res.status(201).json({ order_id: result.insertId, status: 'pending' });
  } catch (e) { next(e); }
});

export default router;