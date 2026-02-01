'use client';

import React, { useState } from 'react';
import { Package, Filter, Edit2, Trash2, Plus } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import {
  useGetAllCategoriesQuery,
  useGetAllProductsQuery,
  useDeleteCategoryMutation
} from '@/lib/api/adminApi';
import AdminCategoryListItem from '@/components/AdminCategoryListItem';
import Link from 'next/link';
import { Category, Product } from '@/lib/api/adminApi';
export default function ProductManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('categories');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories, error: categoriesError, refetch: refetchCategories } = useGetAllCategoriesQuery();
  const categories = categoriesData?.data || [];

  // Fetch products
  const { data: productsData, isLoading: isLoadingProducts, error: productsError, refetch: refetchProducts } = useGetAllProductsQuery({});
  const products = productsData?.data || [];

  // Delete category mutation
  const [deleteCategory, { isLoading: isDeletingCategory }] = useDeleteCategoryMutation();

  const handleDeleteCategory = async (categorySlug: string) => {
    try {
      await deleteCategory(categorySlug).unwrap();
      refetchCategories(); // Refresh categories after deletion
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete category:', err);
      // Handle error, maybe show a toast notification
    }
  };

  const handleEditCategory = (categorySlug: string) => {
    router.push(`/admin/product/category/${categorySlug}/edit`);
  };

  return (
    <AppLayout showBottomNav={true} userRole="admin">
      <div className="min-h-screen bg-white pb-20">
        <div className="p-4 border-b border-gray-200 text-center">
          <h1 className="text-xl font-semibold text-gray-900">Products</h1>
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
              {isLoadingCategories ? (
                <div className="text-center text-gray-500">Loading categories...</div>
              ) : categoriesError ? (
                <div className="text-center text-red-500">Failed to load categories.</div>
              ) : (
                <div className="space-y-3">
                  {categories.map((category: Category) => (
                    <AdminCategoryListItem
                      key={category.slug}
                      id={category.id}
                      name={category.name}
                      productCount={category.product_count || 0}
                      totalSales={parseFloat(category.total_sales || '0')}
                      onEdit={() => handleEditCategory(category.slug)}
                      onDelete={() => setShowDeleteConfirm(category.slug)}
                    />
                  ))}
                </div>
              )}

                        <Link
                          href="/admin/product/category/new/edit"
                          className="bg-[#f5f7fa] flex items-center justify-center gap-4 p-5 rounded-lg cursor-pointer w-full max-w-[370px] h-[101px] mx-auto shadow-sm hover:shadow-md transition-shadow text-system-blue-light font-semibold text-2xl"
                        >                <Plus className="w-8 h-8" />
                Add New Category
              </Link>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="bg-system-blue-light text-white rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Total Products</p>
                    <p className="text-3xl font-bold">{products.length}</p>
                  </div>
                  <Package className="w-12 h-12 opacity-80" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[rgba(77,255,151,0.25)] rounded-lg p-3">
                    <p className="text-xs text-gray-700 mb-1">Approved Products</p>
                    <p className="text-xl font-bold text-gray-900">{products.filter((p: Product) => p.status === 'Approved').length}</p>
                  </div>
                  <div className="bg-[rgba(255,77,77,0.25)] rounded-lg p-3">
                    <p className="text-xs text-gray-700 mb-1">Rejected Products</p>
                    <p className="text-xl font-bold text-gray-900">{products.filter((p: Product) => p.status === 'Rejected').length}</p>
                  </div>
                </div>

                <div className="bg-[rgba(255,212,59,0.5)] rounded-lg p-3">
                  <p className="text-xs text-gray-700 mb-1">Pending Products</p>
                  <p className="text-xl font-bold text-gray-900">{products.filter((p: Product) => p.status === 'Pending').length}</p>
                  </div>
                </div>

              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Products</h2>
                <button><Filter className="w-5 h-5 text-gray-600" /></button>
              </div>

              {isLoadingProducts ? (
                <div className="text-center text-gray-500">Loading products...</div>
              ) : productsError ? (
                <div className="text-center text-red-500">Failed to load products.</div>
              ) : (
                <div className="space-y-3">
                  {products.map((product: Product) => (
                    <button
                      key={product.slug}
                      onClick={() => router.push(`/admin/product/${product.slug}`)}
                      className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-600">{product.vendor?.store_name || 'N/A'}</p>
                          <p className="text-xs text-gray-600">{product.category}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          {product.status}
                        </span>
                      </div>
                      <p className="text-base font-bold text-gray-900 text-left">₦{product.price}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Product?</h2>
              <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                  disabled={isDeletingCategory}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCategory(showDeleteConfirm)}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  disabled={isDeletingCategory}
                >
                  {isDeletingCategory ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
