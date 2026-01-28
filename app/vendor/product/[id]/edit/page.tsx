'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  useGetStoreProductDetailsQuery,
  useGetDraftDetailsQuery,
  useUpdateDraftMutation,
  usePartialUpdateStoreProductMutation,
  useSubmitDraftMutation,
} from '@/lib/api/vendorApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

function getIdFromPath(pathname: string | null) {
  if (!pathname) return '';
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length >= 3 && segments[segments.length - 1] === 'edit') {
    return segments[segments.length - 2];
  }
  return segments[segments.length - 1] ?? '';
}

function EditProductComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = getIdFromPath(pathname);
  const productType = searchParams.get('type') === 'draft' ? 'draft' : 'store';

  const { data: draftData, isLoading: isLoadingDraft, error: draftError } = useGetDraftDetailsQuery(id, { skip: productType !== 'draft' });
  const { data: storeProductData, isLoading: isLoadingStore, error: storeError } = useGetStoreProductDetailsQuery(id, { skip: productType !== 'store' });
  
  const [updateDraft, { isLoading: isUpdatingDraft }] = useUpdateDraftMutation();
  const [updateStoreProduct, { isLoading: isUpdatingStore }] = usePartialUpdateStoreProductMutation();
  const [submitDraft, { isLoading: isSubmitting }] = useSubmitDraftMutation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    tags: '',
    stock: 0,
    price: 0,
  });

  const isLoading = isLoadingDraft || isLoadingStore;
  const isUpdating = isUpdatingDraft || isUpdatingStore || isSubmitting;
  const error = draftError || storeError;
  const productData = productType === 'draft' ? draftData?.data : storeProductData?.data;

  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name || '',
        description: productData.description || '',
        category: productData.category || '',
        brand: productData.brand || '',
        tags: Array.isArray(productData.tags) ? productData.tags.join(', ') : '',
        stock: productData.stock || 0,
        price: parseFloat(productData.price) || 0,
      });
    }
  }, [productData]);

  const handleSave = async () => {
    const changes = new FormData();
    // Simplified: in a real app, you'd check for changed fields
    changes.append('name', formData.name);
    changes.append('description', formData.description);
    changes.append('price', formData.price.toString());
    changes.append('stock', formData.stock.toString());
    
    try {
      if (productType === 'draft') {
        await updateDraft({ slug: id, data: changes }).unwrap();
        toast.success('Draft updated successfully!');
      } else {
        // Note: partialUpdateStoreProduct expects a JSON object, not FormData in this implementation.
        // This is another discrepancy to resolve with the backend if file uploads are needed here.
        // For now, sending as JSON object.
        await updateStoreProduct({ slug: id, data: {
            name: formData.name,
            description: formData.description,
            price: formData.price.toString(),
            stock: formData.stock
        } }).unwrap();
        toast.success('Product updated successfully!');
      }
      router.push('/vendor/product');
    } catch (err) {
      console.error('Failed to save:', err);
      toast.error('Failed to save changes.');
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      await submitDraft(id).unwrap();
      toast.success('Draft submitted for approval!');
      router.push('/vendor/product');
    } catch (err) {
      console.error('Failed to submit:', err);
      toast.error('Failed to submit draft.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-red-500">Failed to load product details.</p>
        </div>
    );
  }

  return (
    <div className="p-6 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
            Editing {productType === 'draft' ? 'Draft' : 'Product'}: {productData?.name}
        </h2>
        {productData && <span className="capitalize text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800">{productData.approval_status}</span>}
      </div>

      <div>
        <label className="text-xs text-gray-600 mb-2 block">Product Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-gray-600 mb-2 block">Product Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-600 mb-2 block">Stock</label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value || '0')})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-2 block">Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value || '0')})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>
      
      <div className="space-y-3 pt-4">
        <button onClick={handleSave} disabled={isUpdating} className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50">
            {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>

        {productType === 'draft' && (
            <button onClick={handleSubmitForApproval} disabled={isUpdating} className="w-full py-3.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
                {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
            </button>
        )}

        <button onClick={() => router.push('/vendor/product')} disabled={isUpdating} className="w-full py-3.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Cancel
        </button>
      </div>
    </div>
  );
}

export default function EditProductPage() {
    return (
        <AppLayout showBottomNav={false} userRole="vendor">
            <div className="min-h-screen bg-white">
                <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
                    <button onClick={() => window.history.back()} className="absolute left-4 p-2 -ml-2">
                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-system-blue-light">Edit Product</h1>
                </div>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                    <EditProductComponent />
                </Suspense>
            </div>
        </AppLayout>
    );
}
