import React, { useEffect, useState } from 'react';
import { CreditCard, Users, ShoppingBag, AlertCircle } from 'lucide-react';
import { customerService } from '../../services/customers';
import { productService } from '../../services/products';

interface Stats {
  totalCustomers: number;
  totalProducts: number;
  totalCredit: number;
  overdueAmount: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    totalProducts: 0,
    totalCredit: 0,
    overdueAmount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const customers = await customerService.getAll();
        const products = await productService.getAll();

        console.log('Customers:', customers);
        console.log('Products:', products);

        const totalCredit = customers
          .filter(c => c.outstanding_credit > 0)
          .reduce((sum, c) => sum + c.outstanding_credit, 0);

        const overdueAmount = customers.filter(c => c.outstanding_credit > 0).length;

        console.log('Total Credit:', totalCredit);
        console.log('Overdue Amount:', overdueAmount);

        setStats({
          totalCustomers: customers.length,
          totalProducts: products.length,
          totalCredit,
          overdueAmount,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      name: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Total Products',
      value: stats.totalProducts,
      icon: ShoppingBag,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Total Outstanding Credit',
      value: `₹${stats.totalCredit.toFixed(2)}`,
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'People with Overdue Amount',
      value: stats.overdueAmount,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div key={item.name} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`${item.bgColor} rounded-lg p-3`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{item.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}