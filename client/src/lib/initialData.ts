import { storage } from './storage';

export function initializeData() {
  // Initialize default user if none exists
  const users = storage.users.getAll();
  if (users.length === 0) {
    storage.users.create({
      email: 'admin@example.com',
      password: 'password123'
    });
  }

  // Initialize sample data if needed
  const products = storage.products.getAll();
  if (products.length === 0) {
    storage.products.create({
      name: 'Sample Product',
      description: 'This is a sample product',
      price: 99.99
    });
  }
}