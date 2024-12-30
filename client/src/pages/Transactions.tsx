import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import TransactionForm from '../components/forms/TransactionForm';
import PaymentForm from '../components/forms/PaymentForm';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { transactionService, Transaction } from '../services/transactions';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionService.getAll();
        console.log('Transactions.tsx', data);
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions', error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">New Transaction</h2>
            <TransactionForm />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Record Payment</h2>
              <PaymentForm />
            </div>

            <RecentTransactions />
          </div>
        </div>
      </div>
    </Layout>
  );
}