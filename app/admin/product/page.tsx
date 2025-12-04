'use client';

import React, { useState } from 'react';
import { Package, Filter, Edit2, Trash2, Plus } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

const mockCategories = [
  { id: '1', name: 'Category Name', products: 0, sales: 0 },
];

const mockProducts = [
  { id: '1', name: 'Product Name', vendor: 'Vendor Name', category: 'Category Name', price: '₦0.00', status: 'Status' },
];

export default function ProductManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('categories');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleDeleteCategory = (categoryId) => {
    // Handle delete - replace with API call
    console.log('Deleting category:', categoryId);
    setShowDeleteConfirm(null);
  };

  return (
    <AppLayout showBottomNav={true} userRole="admin">
      <div className="min-h-screen bg-white pb-20">
        <div className="p-4 border-b border-gray-200 text-center">
          <h1 className="text-lg font-semibold text-gray-900">Products</h1>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">Manage your categories and products</p>

          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('categories')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'categories'
                  ? 'border-system-blue-light text-system-blue-light'
                  : 'border-transparent text-gray-600'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-system-blue-light text-system-blue-light'
                  : 'border-transparent text-gray-600'
              }`}
            >
              Products
            </button>
          </div>

          {activeTab === 'categories' ? (
            <div>
              {mockCategories.map((category) => (
                <div key={category.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-600">No of Products: {category.products}</p>
                      <p className="text-xs text-gray-600">No. of Sales: {category.sales}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => router.push(`/admin/product/category/${category.id}/edit`)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit2 className="w-5 h-5 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(category.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => router.push('/admin/product/category/new')}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-system-blue-light font-semibold hover:border-system-blue-light hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Category
              </button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="bg-system-blue-light text-white rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Total Products</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <Package className="w-12 h-12 opacity-80" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-700 mb-1">Approved Products</p>
                    <p className="text-xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-gray-700 mb-1">Rejected Products</p>
                    <p className="text-xl font-bold text-gray-900">0</p>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-3">
                  <p className="text-xs text-gray-700 mb-1">Pending Products</p>
                  <p className="text-xl font-bold text-gray-900">0</p>
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Products</h2>
                <button><Filter className="w-5 h-5 text-gray-600" /></button>
              </div>

              <div className="space-y-3">
                {mockProducts.map((product, idx) => (
                  <button
                    key={idx}
                    onClick={() => router.push(`/admin/product/${product.id}`)}
                    className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-left flex-1">
                        <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-600">{product.vendor}</p>
                        <p className="text-xs text-gray-600">{product.category}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        {product.status}
                      </span>
                    </div>
                    <p className="text-base font-bold text-gray-900 text-left">{product.price}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Category?</h2>
              <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDeleteCategory(showDeleteConfirm);
                  }}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
