'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import {
  useGetStoreProductsQuery,
  useGetDraftsQuery,
  useDeleteStoreProductMutation,
  useDeleteDraftMutation,
} from '@/lib/api/vendorApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

type ProductType = 'store' | 'draft';

interface DeleteConfirmState {
  slug: string;
  type: ProductType;
}

export default function VendorProductsPage() {
  const { data: storeProductsData, isLoading: isLoadingStore, error: storeError } = useGetStoreProductsQuery({});
  const { data: draftProductsData, isLoading: isLoadingDrafts, error: draftError } = useGetDraftsQuery();
  
  const [deleteStoreProduct, { isLoading: isDeletingStore }] = useDeleteStoreProductMutation();
  const [deleteDraft, { isLoading: isDeletingDraft }] = useDeleteDraftMutation();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<DeleteConfirmState | null>(null);

  const publishedProducts = storeProductsData?.data || [];
  const draftProducts = draftProductsData?.data || [];
  
  const isLoading = isLoadingStore || isLoadingDrafts;
  const isDeleting = isDeletingStore || isDeletingDraft;
  const error = storeError || draftError;

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;

    const { slug, type } = showDeleteConfirm;

    try {
      if (type === 'store') {
        await deleteStoreProduct(slug).unwrap();
      } else {
        await deleteDraft(slug).unwrap();
      }
      setShowDeleteConfirm(null);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete product');
    }
  };

  if (error) {
    return (
      <AppLayout showBottomNav={true} userRole="vendor">
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load products</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-system-blue-light text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

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

        {/* Loading State */}
        {isLoading && (
          <div className="p-4">
            <LoadingSpinner />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && publishedProducts.length === 0 && draftProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No Products Yet</h2>
            <p className="text-sm text-gray-600 mb-6 text-center max-w-xs">
              Start building your store by adding your first product
            </p>
          </div>
        )}

        {/* Product Lists */}
        {!isLoading && (
          <div className="p-4 space-y-4">
            {/* Published Products */}
            {publishedProducts.length > 0 && (
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-3">Store Products</h2>
                <div className="space-y-3">
                  {publishedProducts.map((product: any) => (
                    <div key={product.slug} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {product.name}
                            </h3>
                            <span className="capitalize px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              {product.approval_status}
                            </span>
                            {product.stock === 0 && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                                Out of Stock
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-1">
                            Stock: {product.stock} units
                          </p>
                          <p className="text-xs text-gray-600 mb-2">
                            {product.category}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            ₦{parseFloat(product.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/vendor/product/${product.slug}/edit`}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 text-system-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => setShowDeleteConfirm({ slug: product.slug, type: 'store' })}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            disabled={isDeleting}
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
            {draftProducts.length > 0 && (
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-3">Draft Products</h2>
                <div className="space-y-3">
                  {draftProducts.map((product: any) => (
                    <div key={product.slug} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-600 mb-1">
                            Stock: {product.stock} units
                          </p>
                          <p className="text-xs text-gray-600 mb-2">
                            {product.category}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            ₦{parseFloat(product.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/vendor/product/${product.slug}/edit?type=draft`}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5 text-system-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => setShowDeleteConfirm({ slug: product.slug, type: 'draft' })}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            disabled={isDeleting}
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
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Product?</h2>
              <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this {showDeleteConfirm.type} product? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}