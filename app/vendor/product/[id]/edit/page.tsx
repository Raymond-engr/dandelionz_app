'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, usePathname } from 'next/navigation';

function getIdFromPath(pathname: string | null) {
  if (!pathname) return 'unknown';
  const segments = pathname.split('/').filter(Boolean);
  // expected: ['vendor','product','<id>','edit']
  if (segments.length >= 3 && segments[segments.length - 1] === 'edit') {
    return segments[segments.length - 2];
  }
  return segments[segments.length - 1] ?? 'unknown';
}

export default function EditProductPage() {
  const router = useRouter();
  const pathname = usePathname();
  const id = getIdFromPath(pathname);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    tags: '',
    stock: 0,
    price: 0,
    discountedPrice: 0,
    variants: {
      colors: [] as string[],
      sizes: [] as string[]
    }
  });

  useEffect(() => {
    // Mock fetch product by id — prefill form with example data
    const mock = {
      name: `Product ${id}`,
      description: 'This is a sample product description',
      category: 'Electronics',
      brand: 'Brand Name',
      tags: 'sample,edit',
      stock: 10,
      price: 1200,
      discountedPrice: 1000,
      variants: { colors: ['White', 'Black'], sizes: ['36', '37'] }
    };
    setFormData(mock);
  }, [id]);

  const handleSave = () => {
    console.log('Saving product', id, formData);
    // mocked save — navigate back to product list
    router.push('/vendor/product');
  };

  const toggleColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      variants: {
        ...prev.variants,
        colors: prev.variants.colors.includes(color)
          ? prev.variants.colors.filter(c => c !== color)
          : [...prev.variants.colors, color]
      }
    }));
  };

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      variants: {
        ...prev.variants,
        sizes: prev.variants.sizes.includes(size)
          ? prev.variants.sizes.filter(s => s !== size)
          : [...prev.variants.sizes, size]
      }
    }));
  };

  return (
    <AppLayout showBottomNav={false} userRole="vendor">
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.push('/vendor/product')} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Edit Product</h1>
        </div>

        <div className="p-6 pb-24 space-y-6">
          <div>
            <label className="text-xs text-gray-600 mb-2 block">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-2 block">Product Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-2 block">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value || '0')})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value || '0')})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-2 block">Discounted Price</label>
            <input
              type="number"
              value={formData.discountedPrice}
              onChange={(e) => setFormData({...formData, discountedPrice: parseFloat(e.target.value || '0')})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Variants</h3>
            <div className="mb-4">
              <label className="text-xs text-gray-600 mb-2 block">Color</label>
              <div className="grid grid-cols-3 gap-2">
                {['White', 'Black', 'Green', 'Blue', 'Red', 'Yellow'].map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                      formData.variants.colors.includes(color) ? 'bg-system-blue-light text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-2 block">Size</label>
              <div className="grid grid-cols-6 gap-2">
                {['24','25','26','27','28','29','30','36','37','38','39','40','41','42','43'].map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                      formData.variants.sizes.includes(size) ? 'bg-system-blue-light text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => router.push('/vendor/product')} className="flex-1 py-3.5 bg-white text-system-blue-light border border-system-blue-light rounded-lg font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors">Save Changes</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
