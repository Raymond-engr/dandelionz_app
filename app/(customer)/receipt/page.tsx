'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function ReceiptPage() {
  const router = useRouter();
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'image'>('pdf');

  const handleExport = () => {
    console.log('Exporting as:', exportFormat);
    setShowExportModal(false);
  };

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

        <div className="p-6">
          {/* Logo Placeholder */}
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6"></div>

          <p className="text-right text-sm text-gray-600 mb-6">Order Date</p>

          {/* Receipt Details */}
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">DESCRIPTION</p>
                <p className="text-sm font-medium text-gray-900">Product Name</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 mb-1">SUBTOTAL</p>
                <p className="text-sm font-medium text-gray-900">Amount</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Address</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">No. 123 address goes here</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Phone Number</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">08123456789</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Order ID</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">12345</p>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 mb-8">
            <p className="text-base font-semibold text-gray-900">Total</p>
            <p className="text-base font-semibold text-gray-900 text-right">Amount</p>
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
              onClick={() => router.push('/order-tracking')}
              className="w-full py-3.5 bg-white text-system-blue-light border border-system-blue-light rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Track Order
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
      </div>
    </AppLayout>
  );
}