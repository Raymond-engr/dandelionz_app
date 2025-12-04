'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function SummaryPage() {
  const router = useRouter();

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.push('/admin/account/withdrawal/pin')} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Summary</h1>
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
            </div>
          </div>

          <button
            onClick={() => router.push('/admin/account/withdrawal/success')}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
