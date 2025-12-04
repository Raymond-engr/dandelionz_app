'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function AdminReceiptPage() {
  const router = useRouter();
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'image'>('pdf');

  const handleExport = () => {
    console.log('Exporting as:', exportFormat);
    setShowExportModal(false);
  };

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Receipt</h1>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4 border-b border-gray-200 pb-6">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount</span>
              <span className="text-sm font-semibold text-gray-900">₦ 0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Fee</span>
              <span className="text-sm font-semibold text-gray-900">₦ 0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount Paid</span>
              <span className="text-sm font-semibold text-gray-900">₦ 0.00</span>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Withdrawal Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Receiver Name</span>
                <span className="text-sm font-medium text-gray-900 text-right">BANK ACCOUNT NAME GOES HERE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Receiver Details</span>
                <span className="text-sm font-medium text-gray-900">ACCOUNT NUMBER</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Transaction Date</span>
                <span className="text-sm font-medium text-gray-900">Nov 11th, 2025 18:03:50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sender Details</span>
                <span className="text-sm font-medium text-gray-900">DANDELIONZ</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
          >
            Export Receipt
          </button>
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
