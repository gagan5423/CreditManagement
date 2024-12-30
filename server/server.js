import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRoutes from './routes/users.js';
import customersRoutes from './routes/customers.js';
import productsRoutes from './routes/products.js';
import transactionsRoutes from './routes/transactions.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/transactions', transactionsRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});