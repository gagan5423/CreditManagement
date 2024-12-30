import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { transactionService, Transaction } from '../../services/transactions';
import { customerService, Customer } from '../../services/customers';
import { productService, Product } from '../../services/products';

interface TransactionWithDetails extends Transaction {
  customer: Customer;
  product: Product;
}

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const allTransactions = await transactionService.getAll();
        const customers = await customerService.getAll();
        const products = await productService.getAll();

        console.log('All Transactions:', allTransactions);
        console.log('Customers:', customers);
        console.log('Products:', products);

        const recentTransactions = allTransactions
          .map(t => {
            const customer = customers.find(c => c.id === t.customer_id);
            const product = products.find(p => p.id === t.product_id);
            if (!customer || !product) {
              return null; // Skip transactions with missing customer or product
            }
            return {
              ...t,
              customer,
              product
            };
          })
          .filter(t => t !== null) // Filter out null values
          .sort((a, b) => new Date(b!.created_at).getTime() - new Date(a!.created_at).getTime());
        console.log('Recent Transactions:', recentTransactions);
        setTransactions(recentTransactions as TransactionWithDetails[]);
      } catch (error) {
        console.error('Failed to fetch recent transactions', error);
      }
    };

    fetchRecentTransactions();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        <div className="mt-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="border-b border-gray-200 py-4 last:border-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.customer.name}
                  </p>
                  <p className="text-sm text-gray-600">{transaction.product.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ₹{transaction.total_product_price.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {format(new Date(transaction.created_at), 'MMM d, yyyy')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}