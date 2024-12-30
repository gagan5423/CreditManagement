import React, { useState } from 'react';
import { productService } from '../../services/products';
import { useAuth } from '../../contexts/AuthContext';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  shop_owner_id: number;
}

export default function ProductForm() {
  const { shopOwnerId } = useAuth();
  const [formData, setFormData] = useState<Omit<ProductFormData, 'shop_owner_id'>>({
    name: '',
    description: '',
    price: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!shopOwnerId) {
        throw new Error('Shop owner ID is missing');
      }
      await productService.create({ ...formData, shop_owner_id: Number(shopOwnerId) });
      setFormData({ name: '', description: '', price: 0 });
    } catch (error) {
      console.error('Failed to add product', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          id="price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value, 10) })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Add Product
      </button>
    </form>
  );
}