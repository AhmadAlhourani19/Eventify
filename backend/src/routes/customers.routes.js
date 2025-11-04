import {Router} from 'express';
import {pool} from '../db/db.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'name is required (use /customers?name=...)' });
    }

    const term = String(name).trim().replace(/([_%\\])/g, '\\$1');
    const [rows] = await pool.query(
      `SELECT customer_id, name, email, created_at
       FROM customers
       WHERE name LIKE CONCAT('%', ?, '%') ESCAPE '\\\\'
       ORDER BY created_at DESC`,
      [term]
    );

    res.json({ data: rows });
  } catch (e) { next(e); }
});

router.post('/', async(req,res,next) =>{
    try{
        const {name, email, phone} = req.body;
        if(!name || !email || !phone){
            return res.status(400).json({error:'Name, Email and Phone are essential'})
        }
        const [result] = await pool.query(
            `INSERT INTO customers (name, email, phone, created_at, updated_at)
            values (?,?,?,NOW(),NOW())`, [name.trim(), email.trim(), String(phone).trim()]
        )
        return res.status(201).json({ data: { customer_id: result.insertId } });
    }
    catch(e) {next(e);}
})

export default router;