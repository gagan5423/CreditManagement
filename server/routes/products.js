import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const [products] = await pool.execute('SELECT * FROM products');
    const productsWithIntPrice = products.map(product => ({
      ...product,
      price: parseInt(product.price, 10) // Convert price to integer
    }));
    res.json(productsWithIntPrice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, shop_owner_id } = req.body; // Add shop_owner_id here
    if (!shop_owner_id) {
      return res.status(400).json({ error: 'shop_owner_id is required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO products (name, description, price, shop_owner_id) VALUES (?, ?, ?, ?)',
      [name, description, price, shop_owner_id]
    );

    res.status(201).json({ id: result.insertId, message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;