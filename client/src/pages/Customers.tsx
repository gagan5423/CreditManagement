import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import CustomerForm from '../components/forms/CustomerForm';
import { customerService, Customer } from '../services/customers';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Customer</h2>
            <CustomerForm />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer List</h2>
            <div className="space-y-4">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="border-b border-gray-200 pb-4 last:border-0"
                >
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  {customer.phone && (
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                  )}
                  {customer.email && (
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}