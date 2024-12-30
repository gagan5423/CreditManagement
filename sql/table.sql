-- Create database
CREATE DATABASE IF NOT EXISTS shop_credit_system;
USE shop_credit_system;

-- Shop Owners table
CREATE TABLE IF NOT EXISTS shop_owners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  shop_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  contact VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  shop_owner_id INT NOT NULL,
  outstanding_credit DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shop_owner_id) REFERENCES shop_owners(id)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  shop_owner_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shop_owner_id) REFERENCES shop_owners(id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  shop_owner_id INT NOT NULL,
  total_amount DECIMAL(10, 2),
  paid_amount DECIMAL(10, 2) NOT NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (shop_owner_id) REFERENCES shop_owners(id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  payment_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  total_product_price DECIMAL(10, 2) NOT NULL,
  due_date DATE,
  shop_owner_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (shop_owner_id) REFERENCES shop_owners(id),
  FOREIGN KEY (payment_id) REFERENCES payments(id)
);