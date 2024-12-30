import express from 'express';
import { executeQuery } from '../utils/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const customers = await executeQuery(
      'SELECT * FROM customers WHERE shop_owner_id = ?',
      [req.user.id]
    );

    const customersWithFloatValues = customers.map(customer => ({
      ...customer,
      outstanding_credit: parseFloat(customer.outstanding_credit)
    }));

    res.json(customersWithFloatValues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, shop_owner_id } = req.body;

    if (!name || !phone || !email || !shop_owner_id) {
      return res.status(400).json({ error: 'Name, phone, email, and shop_owner_id are required' });
    }

    const result = await executeQuery(
      'INSERT INTO customers (name, phone, email, shop_owner_id) VALUES (?, ?, ?, ?)',
      [name, phone, email, shop_owner_id]
    );

    res.status(201).json({ id: result.insertId, message: 'Customer added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;