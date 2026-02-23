'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '0.00';
  const reference = searchParams.get('reference') || '';

  return (
    <AppLayout showBottomNav={false} userRole="vendor">
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.push('/vendor/wallet')} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Payment</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Withdrawal Requested</h2>
          <p className="text-sm text-gray-500 mb-8 text-center max-w-[280px]">
            Your withdrawal request is being processed and will be completed shortly.
          </p>

          <div className="w-full max-w-sm bg-gray-50 rounded-2xl p-6 mb-12 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <span className="text-sm text-gray-500">Amount</span>
              <span className="text-lg font-bold text-gray-900">₦{parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Reference</span>
              <span className="text-xs font-mono text-gray-900 bg-white px-2 py-1 rounded border border-gray-100">{reference}</span>
            </div>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={() => router.push('/vendor/wallet')}
              className="w-full py-4 bg-system-blue-light text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-[#020360] transition-all active:scale-[0.98]"
            >
              Back to Wallet
            </button>
            <button
              onClick={() => router.push('/vendor/wallet/receipt')}
              className="w-full py-4 bg-white text-system-blue-light border border-blue-100 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all"
            >
              View E-Receipt
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
