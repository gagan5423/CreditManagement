import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequired } from '../utils/validation.js';

const router = express.Router();

router.use(authenticateToken);

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const [transactions] = await pool.execute(`
      SELECT t.*, c.name as customer_name, p.name as product_name 
      FROM transactions t
      LEFT JOIN customers c ON t.customer_id = c.id
      LEFT JOIN products p ON t.product_id = p.id
      WHERE t.shop_owner_id = ?
      ORDER BY t.created_at DESC
    `, [req.user.id]);
    console.log('transactions', transactions);
    const transactionsWithFloatValues = transactions.map(transaction => ({
      ...transaction,
      total_product_price: parseFloat(transaction.total_product_price),
    }));

    res.json(transactionsWithFloatValues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new transaction
router.post('/', async (req, res) => {
  try {
    console.log('req', req.body);
    const { customerId, products, totalAmount, paidAmount, dueDate, shop_owner_id } = req.body;
    const remainingBalance = totalAmount - paidAmount;

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Products must be an array' });
    }

    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Record the payment
      console.log('payment', [customerId, shop_owner_id, totalAmount, paidAmount, remainingBalance, new Date()]);
      const [paymentResult] = await connection.execute(
        'INSERT INTO payments (customer_id, shop_owner_id, total_amount, paid_amount, payment_date) VALUES (?, ?, ?, ?, ?)',
        [customerId, shop_owner_id, totalAmount, paidAmount, new Date()]
      );
      console.log('added');
      const paymentId = paymentResult.insertId;

      // Create the main transaction record for each product
      for (const product of products) {
        console.log('product', [customerId, product.productId, product.quantity, product.quantity * product.price, dueDate, shop_owner_id, paymentId]);
        await connection.execute(
          'INSERT INTO transactions (customer_id, payment_id, product_id, quantity, total_product_price, due_date, shop_owner_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [customerId, paymentId, product.productId, product.quantity, product.quantity * product.price, dueDate, shop_owner_id]
        );
      }

      // Update the outstanding credit for the customer
      await connection.execute(
        'UPDATE customers SET outstanding_credit = outstanding_credit + ? WHERE id = ?',
        [remainingBalance, customerId]
      );

      await connection.commit();
      res.status(201).json({ message: 'Transaction added successfully' });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ error: error.message });
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record payment
router.post('/payments', async (req, res) => {
  try {
    console.log('req/payments', req.body);
    const { customer_id, amount, payment_date, shop_owner_id } = req.body;
    validateRequired({ customer_id, amount, payment_date });

    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Record the payment
      const [result] = await connection.execute(
        'INSERT INTO payments (customer_id, shop_owner_id, paid_amount, payment_date) VALUES (?, ?, ?, ?)',
        [customer_id, shop_owner_id, amount, payment_date]
      );

      // Update the outstanding credit for the customer
      await connection.execute(
        'UPDATE customers SET outstanding_credit = outstanding_credit - ? WHERE id = ?',
        [amount, customer_id]
      );

      await connection.commit();
      res.status(201).json({ id: result.insertId, message: 'Payment recorded successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;