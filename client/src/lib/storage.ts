// Type definitions
export interface User {
  id: string;
  email: string;
  password: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  paidAmount: number;
  remainingBalance: number;
  dueDate: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  paymentDate: string;
  createdAt: string;
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'shop_users',
  PRODUCTS: 'shop_products',
  CUSTOMERS: 'shop_customers',
  TRANSACTIONS: 'shop_transactions',
  PAYMENTS: 'shop_payments',
  CURRENT_USER: 'shop_current_user'
} as const;

// Generic storage operations
const getStorageItem = <T>(key: string): T[] => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : [];
};

const setStorageItem = <T>(key: string, value: T[]): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Storage operations for each entity
export const storage = {
  users: {
    getAll: () => getStorageItem<User>(STORAGE_KEYS.USERS),
    create: (user: Omit<User, 'id'>) => {
      const users = getStorageItem<User>(STORAGE_KEYS.USERS);
      const newUser = { ...user, id: crypto.randomUUID() };
      setStorageItem(STORAGE_KEYS.USERS, [...users, newUser]);
      return newUser;
    },
    findByEmail: (email: string) => {
      const users = getStorageItem<User>(STORAGE_KEYS.USERS);
      return users.find(user => user.email === email);
    }
  },
  currentUser: {
    get: () => {
      const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return user ? JSON.parse(user) : null;
    },
    set: (user: Omit<User, 'password'>) => {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    },
    clear: () => {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },
  products: {
    getAll: () => getStorageItem<Product>(STORAGE_KEYS.PRODUCTS),
    create: (product: Omit<Product, 'id' | 'createdAt'>) => {
      const products = getStorageItem<Product>(STORAGE_KEYS.PRODUCTS);
      const newProduct = {
        ...product,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      setStorageItem(STORAGE_KEYS.PRODUCTS, [...products, newProduct]);
      return newProduct;
    }
  },
  customers: {
    getAll: () => getStorageItem<Customer>(STORAGE_KEYS.CUSTOMERS),
    create: (customer: Omit<Customer, 'id' | 'createdAt'>) => {
      const customers = getStorageItem<Customer>(STORAGE_KEYS.CUSTOMERS);
      const newCustomer = {
        ...customer,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      setStorageItem(STORAGE_KEYS.CUSTOMERS, [...customers, newCustomer]);
      return newCustomer;
    }
  },
  transactions: {
    getAll: () => getStorageItem<Transaction>(STORAGE_KEYS.TRANSACTIONS),
    create: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
      const transactions = getStorageItem<Transaction>(STORAGE_KEYS.TRANSACTIONS);
      const newTransaction = {
        ...transaction,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      setStorageItem(STORAGE_KEYS.TRANSACTIONS, [...transactions, newTransaction]);
      return newTransaction;
    }
  },
  payments: {
    getAll: () => getStorageItem<Payment>(STORAGE_KEYS.PAYMENTS),
    create: (payment: Omit<Payment, 'id' | 'createdAt'>) => {
      const payments = getStorageItem<Payment>(STORAGE_KEYS.PAYMENTS);
      const newPayment = {
        ...payment,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      setStorageItem(STORAGE_KEYS.PAYMENTS, [...payments, newPayment]);
      return newPayment;
    }
  }
};