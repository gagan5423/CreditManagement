import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/customers';
import { transactionService } from '../../services/transactions';
import { useAuth } from '../../contexts/AuthContext';

interface PaymentFormData {
  customerId: number;
  amount: number;
  paymentDate: string;
}

export default function PaymentForm() {
  const { shopOwnerId } = useAuth();
  const [formData, setFormData] = useState<PaymentFormData>({
    customerId: 0,
    amount: 0,
    paymentDate: '',
  });
  const [customers, setCustomers] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await customerService.getAll();
        setCustomers(data);
      } catch (error) {
        console.error('Failed to fetch customers', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!shopOwnerId) {
        throw new Error('Shop owner ID is missing');
      }
      await transactionService.recordPayment({
        customer_id: formData.customerId,
        shop_owner_id: shopOwnerId, // Ensure shopOwnerId is a number
        amount: formData.amount,
        payment_date: formData.paymentDate,
      });
      setFormData({ customerId: 0, amount: 0, paymentDate: '' });
    } catch (error) {
      console.error('Failed to record payment', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
          Customer
        </label>
        <select
          id="customer"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.customerId}
          onChange={(e) => setFormData({ ...formData, customerId: parseInt(e.target.value, 10) })}
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
        />
      </div>
      <div>
        <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
          Payment Date
        </label>
        <input
          type="date"
          id="paymentDate"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.paymentDate}
          onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Record Payment
      </button>
    </form>
  );
}