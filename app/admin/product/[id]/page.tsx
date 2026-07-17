'use client';

import React, { useState, use, useEffect } from 'react';
import { ChevronLeft, Send, Loader2, CheckCircle, XCircle, Trash2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout'; // Assuming AppLayout is the main layout component
import Image from 'next/image';
import {
  useGetAdminProductDetailsQuery,
  useApproveProductAdminMutation,
  useRejectProductAdminMutation,
  useDeleteProductMutation
} from '@/lib/api/adminApi';
import toast from 'react-hot-toast';
import { apiError } from '@/lib/utils';

interface ProductDetailsProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetails({ params: paramsPromise }: ProductDetailsProps) {
  const params = use(paramsPromise);
  const router = useRouter();
  const productId = params.id; // This is the slug for the product

  const [action, setAction] = useState<'Approve Product' | 'Reject Product'>('Approve Product');
  const [reason, setReason] = useState('');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch product details
  const { data: productData, isLoading: isLoadingProduct, error: productError, refetch: refetchProduct } =
    useGetAdminProductDetailsQuery(productId);
  const product = productData?.data;

  // Approve product mutation
  const [approveProductAdmin, { isLoading: isApprovingProduct }] = useApproveProductAdminMutation();
  // Reject product mutation
  const [rejectProductAdmin, { isLoading: isRejectingProduct }] = useRejectProductAdminMutation();
  // Delete product mutation
  const [deleteProduct, { isLoading: isDeletingProduct }] = useDeleteProductMutation();

  const handleDeleteProduct = async () => {
    try {
      const result = await deleteProduct(productId).unwrap();
      toast.success(`Product "${result.data?.name || 'Unknown'}" deleted successfully`);
      router.push('/admin/product');
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      toast.error(apiError(err, 'Failed to delete product'));
    }
  };

  const handleConfirmAction = async () => {
    setSubmissionError(null);
    setSubmissionSuccess(null);

    if (action === 'Approve Product') {
      try {
        await approveProductAdmin(productId).unwrap();
        setSubmissionSuccess('Product approved successfully!');
        refetchProduct(); // Refresh product data
      } catch (err: any) {
        console.error('Failed to approve product:', err);
        setSubmissionError(apiError(err, 'Failed to approve product.'));
      }
    } else if (action === 'Reject Product') {
      try {
        await rejectProductAdmin({ slug: productId, reason: reason || undefined }).unwrap();
        setSubmissionSuccess('Product rejected successfully!');
        refetchProduct(); // Refresh product data
      } catch (err: any) {
        console.error('Failed to reject product:', err);
        setSubmissionError(apiError(err, 'Failed to reject product.'));
      }
    }
  };

  const isSubmitting = isApprovingProduct || isRejectingProduct;
  const showLoading = isLoadingProduct || isSubmitting;

  if (isLoadingProduct) {
    return (
      <AppLayout showBottomNav={false}>
        <div className="min-h-screen bg-white p-4 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-system-blue-light" />
          <p className="ml-3 text-gray-500">Loading product details...</p>
        </div>
      </AppLayout>
    );
  }

  if (productError) {
    return (
      <AppLayout showBottomNav={false}>
        <div className="min-h-screen bg-white p-4 flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-500" />
          <p className="ml-3 text-red-500">Error loading product details. Please try again.</p>
        </div>
      </AppLayout>
    );
  }

  if (!product) {
    return (
      <AppLayout showBottomNav={false}>
        <div className="min-h-screen bg-white p-4 flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-500" />
          <p className="ml-3 text-red-500">Product not found.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-[600px] bg-white relative">
          <div className="min-h-screen bg-white pb-6">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between relative">
              <button onClick={() => router.back()} className="p-2">
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
              <h1 className="text-lg font-semibold text-system-blue-light">Product Details</h1>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => router.push(`/admin/product/${productId}/edit`)}
                  className="p-2 text-system-blue-light hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={isDeletingProduct}
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {submissionSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  <span className="block sm:inline">{submissionSuccess}</span>
                </div>
              )}
              {submissionError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <XCircle className="w-5 h-5 inline mr-2" />
                  <span className="block sm:inline">{submissionError}</span>
                </div>
              )}

              <h2 className="text-sm font-semibold text-gray-900 mb-3">Product Information</h2>

              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-4 overflow-hidden relative">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                    <p className="text-xs text-gray-500">No image available</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-xl font-bold text-gray-900">{product.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">{product.description}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xl font-bold text-gray-900">
                    {(product.discount ?? 0) > 0 ? (
                        <>
                        ₦{(parseFloat(product.price) * (1 - (product.discount ?? 0) / 100)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </>
                    ) : (
                        `₦${parseFloat(product.price || '0').toLocaleString()}`
                    )}
                  </p>
                  {(product.discount ?? 0) > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 line-through">
                            ₦{parseFloat(product.price).toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                            -{product.discount}% OFF
                        </span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-900 block mb-1">Category:</label>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{product.category_name || product.category}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-900 block mb-1">Stock:</label>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{product.stock} Units</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-900 block mb-1">Uploaded Date:</label>
                </div>
                <div>
                  <p className="text-sm text-gray-900">{new Date(product.uploadDate).toLocaleDateString()}</p>
                </div>
                </div>
              </div>

              <h2 className="text-sm font-semibold text-gray-900 mb-3">Vendor Information</h2>

              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Store Name</label>
                  <p className="text-sm font-medium text-gray-900">{product.vendor.store_name}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Email Address</label>
                  <p className="text-sm font-medium text-gray-900">{product.vendor.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Status</label>
                  <p className={`text-sm font-semibold ${product.status === 'APPROVED' ? 'text-green-600' : product.status === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {product.status}
                  </p>
                </div>
              </div>

              {product.status === 'PENDING' && (
                <div className="space-y-3">
                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value as 'Approve Product' | 'Reject Product')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light appearance-none bg-white pr-10"
                    disabled={isSubmitting}
                  >
                    <option value="Approve Product">Approve Product</option>
                    <option value="Reject Product">Reject Product</option>
                  </select>

                  <textarea
                    placeholder="Reason for action (optional)..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light min-h-[80px] resize-none"
                    disabled={isSubmitting}
                  />

                  {/* Send button from Figma design (currently not directly tied to action logic) */}
                  <button
                    type="button" // Change to type="button" to prevent form submission
                    className="w-full py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>

                  <button
                    onClick={handleConfirmAction}
                    className="w-full py-3 bg-system-blue-light text-white rounded-lg text-sm font-medium hover:bg-[#020360] transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm Action'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Product?</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                disabled={isDeletingProduct}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                disabled={isDeletingProduct}
              >
                {isDeletingProduct ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
