'use client';

import React, { useState, Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetOrderReceiptQuery } from '@/lib/api/publicApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

function ReceiptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  const { data: response, isLoading, error } = useGetOrderReceiptQuery(orderId as string, {
    skip: !orderId
  });
  
  const receipt = response; // The API returns the object directly or nested? Docs say it returns object directly. Assuming 'data' wrapper based on others.
  // Actually, look at publicApi: builder.query<{ success: boolean; data: any }, ...
  // So response is the wrapper.
  const receiptData = response?.data;

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'image'>('pdf');

  const handleExport = () => {
    console.log('Exporting as:', exportFormat);
    setShowExportModal(false);
    toast.success(`Export feature for ${exportFormat.toUpperCase()} is coming soon!`);
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
        </div>
    );
  }

  if (error || !receiptData) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <p className="text-red-500 mb-4">Failed to load receipt.</p>
            <button onClick={() => router.back()} className="text-system-blue-light underline">
                Go Back
            </button>
        </div>
    );
  }

  return (
    <>
        <div className="p-6">
          {/* Logo Placeholder */}
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center text-xs text-gray-500">Logo</div>

          <p className="text-right text-sm text-gray-600 mb-6">
            {receiptData.payment?.paid_at ? new Date(receiptData.payment.paid_at).toLocaleDateString() : 'Date N/A'}
          </p>

          {/* Receipt Details */}
          <div className="space-y-4 mb-8">
            <div className="border-b border-gray-100 pb-2 mb-2">
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <p className="text-xs text-gray-600 font-semibold">DESCRIPTION</p>
                    <p className="text-xs text-gray-600 font-semibold text-right">SUBTOTAL</p>
                </div>
                {receiptData.items?.map((item: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-2 gap-4 mb-1">
                        <p className="text-sm font-medium text-gray-900">{item.product_name} (x{item.quantity})</p>
                        <p className="text-sm font-medium text-gray-900 text-right">{item.price_at_purchase}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">{receiptData.customer_email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Transaction Ref</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">{receiptData.payment?.reference}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Order ID</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">{receiptData.order_id}</p>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 mb-8">
            <p className="text-base font-semibold text-gray-900">Total</p>
            <p className="text-base font-semibold text-gray-900 text-right">{receiptData.total_price}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Export Receipt
            </button>
            <button
              onClick={() => router.push(`/orders/${receiptData.order_id}`)}
              className="w-full py-3.5 bg-white text-system-blue-light border border-system-blue-light rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Track Order / View Details
            </button>
          </div>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-6">SAVE AS</h2>

              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      name="format"
                      checked={exportFormat === 'pdf'}
                      onChange={() => setExportFormat('pdf')}
                      className="sr-only peer"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      exportFormat === 'pdf' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                    }`}>
                      {exportFormat === 'pdf' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">PDF</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      name="format"
                      checked={exportFormat === 'image'}
                      onChange={() => setExportFormat('image')}
                      className="sr-only peer"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      exportFormat === 'image' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                    }`}>
                      {exportFormat === 'image' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Image</span>
                </label>
              </div>

              <button
                onClick={handleExport}
                className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
              >
                Export
              </button>
            </div>
          </div>
        )}
    </>
  );
}

export default function ReceiptPage() {
  const router = useRouter();

  return (
    <AppLayout showBottomNav={false} userRole="customer">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Receipt</h1>
        </div>

        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
            <ReceiptContent />
        </Suspense>
      </div>
    </AppLayout>
  );
}