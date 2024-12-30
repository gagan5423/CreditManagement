import React, { useEffect, useState } from 'react';
import { customerService, Customer } from '../../services/customers';

export default function OverduePayments() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const allCustomers = await customerService.getAll();
        console.log('Customers:', allCustomers);
        setCustomers(allCustomers);
      } catch (error) {
        console.error('Failed to fetch customers', error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const highCreditCustomers = customers.filter(
      (customer) => customer.outstanding_credit > 15000
    );

    if (highCreditCustomers.length > 0) {
      alert(
        `Warning: ${highCreditCustomers.length} customer(s) have outstanding credit greater than ₹15000!`
      );
    }
  }, [customers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Overdue Payments</h2>
        <input
          type="text"
          placeholder="Search by customer name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="mt-2 mb-4 p-2 border border-gray-300 rounded-md w-full"
        />
        <div className="mt-4">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="border-b border-gray-200 py-4 last:border-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  <p className="text-sm text-gray-600">Phone: {customer.phone}</p>
                  <p className="text-sm text-gray-600">Email: {customer.email}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${
                      customer.outstanding_credit > 0 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    ₹{customer.outstanding_credit.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
