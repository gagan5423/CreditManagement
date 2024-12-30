import React, { useEffect, useState } from 'react';
import { customerService, Customer } from '../../services/customers';
import { productService, Product } from '../../services/products';
import { transactionService } from '../../services/transactions';
import { useAuth } from '../../contexts/AuthContext';

interface ProductItem {
  productId: number;
  quantity: number;
  price: number;
}

interface TransactionFormData {
  customerId: number;
  products: ProductItem[];
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
}

export default function TransactionForm() {
  const { shopOwnerId } = useAuth();
  const [formData, setFormData] = useState<TransactionFormData>({
    customerId: 0,
    products: [{ productId: 0, quantity: 1, price: 0 }],
    totalAmount: 0,
    paidAmount: 0,
    dueDate: '',
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await customerService.getAll();
        setCustomers(data);
      } catch (error) {
        console.error('Failed to fetch customers', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchCustomers();
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { productId: 0, quantity: 1, price: 0 }],
    });
  };

  const handleRemoveProduct = (index: number) => {
    setFormData({
      ...formData,
      products: formData.products.filter((_, i) => i !== index),
    });
  };

  const handleProductChange = (index: number, field: keyof ProductItem, value: string | number) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: typeof value === 'string' ? parseInt(value, 10) : value,
    };

    if (field === 'productId') {
      const product = products.find(p => p.id === updatedProducts[index].productId);
      if (product) {
        updatedProducts[index].price = product.price;
      }
    }

    const totalAmount = updatedProducts.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    setFormData({
      ...formData,
      products: updatedProducts,
      totalAmount,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await transactionService.create({
        customerId: formData.customerId,
        products: formData.products,
        totalAmount: formData.totalAmount,
        paidAmount: formData.paidAmount,
        dueDate: formData.dueDate,
        shop_owner_id: Number(shopOwnerId),
      });

      setFormData({
        customerId: 0,
        products: [{ productId: 0, quantity: 1, price: 0 }],
        totalAmount: 0,
        paidAmount: 0,
        dueDate: '',
      });
    } catch (error) {
      console.error('Failed to create transaction', error);
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

      <div className="space-y-4">
        {formData.products.map((item, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Product {index + 1}
              </label>
              <select
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={item.productId}
                onChange={(e) =>
                  handleProductChange(index, 'productId', parseInt(e.target.value, 10))
                }
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ₹{product.price}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700">Qty</label>
              <input
                type="number"
                min="1"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={item.quantity}
                onChange={(e) =>
                  handleProductChange(index, 'quantity', parseInt(e.target.value, 10))
                }
              />
            </div>
            {formData.products.length > 1 && (
              <button
                type="button"
                className="mt-6 text-red-600 hover:text-red-800"
                onClick={() => handleRemoveProduct(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="text-indigo-600 hover:text-indigo-800"
        onClick={handleAddProduct}
      >
        + Add Another Product
      </button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Amount
          </label>
          <input
            type="number"
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
            value={formData.totalAmount.toFixed(2)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Paid Amount
          </label>
          <input
            type="number"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.paidAmount}
            onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          type="date"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Transaction
      </button>
    </form>
  );
}