'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  stock: number;
  category: string;
  price: number;
  status: 'draft' | 'published';
  outOfStock?: boolean;
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Product Name',
      stock: 0,
      category: 'Category Name',
      price: 0.00,
      status: 'published',
      outOfStock: true
    },
    {
      id: '2',
      name: 'Product Name',
      stock: 0,
      category: 'Category Name',
      price: 0.00,
      status: 'draft'
    }
  ]);

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <AppLayout showBottomNav={true} userRole="vendor">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-sm text-gray-600 mb-4">
            Manage your product inventory and listings
          </p>

          {/* Add New Product Button */}
          <Link
            href="/vendor/product/new"
            className="flex items-center justify-center gap-2 w-full py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
          >
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-system-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Product Lists */}
        <div className="p-4 space-y-4">
          {/* Published Products */}
          {products.filter(p => p.status === 'published').length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-3">Product</h2>
              <div className="space-y-3">
                {products.filter(p => p.status === 'published').map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {product.name}
                          </h3>
                          {product.outOfStock && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          No of Stocks: {product.stock}
                        </p>
                        <p className="text-xs text-gray-600 mb-2">
                          {product.category}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ₦{product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/vendor/product/${product.id}/edit`}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5 text-system-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Draft Products */}
          {products.filter(p => p.status === 'draft').length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-3">Draft</h2>
              <div className="space-y-3">
                {products.filter(p => p.status === 'draft').map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {product.name}
                          </h3>
                          {product.outOfStock && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          No of Stocks: {product.stock}
                        </p>
                        <p className="text-xs text-gray-600 mb-2">
                          {product.category}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ₦{product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/vendor/product/${product.id}/edit`}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5 text-system-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}