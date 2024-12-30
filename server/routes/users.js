import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from '../utils/db.js';
import { validateEmail, validatePassword, validateRequired } from '../utils/validation.js';

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  try {
    const { shopName, location, email, contact, password } = req.body;

    validateRequired({ shopName, location, email, contact, password });
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await executeQuery(
      'INSERT INTO shop_owners (shop_name, location, email, contact, password) VALUES (?, ?, ?, ?, ?)',
      [shopName, location, email, contact, hashedPassword]
    );

    res.status(201).json({ id: result.insertId, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    validateRequired({ email, password });

    const users = await executeQuery('SELECT * FROM shop_owners WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        shopName: user.shop_name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch current logged-in user
router.get('/users/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const users = await executeQuery('SELECT id, shop_name AS shopName, location, email, contact FROM shop_owners WHERE id = ?', [decodedToken.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
