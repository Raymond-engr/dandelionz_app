'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.push('/admin/account/withdrawal')} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Payment</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-32 h-32 bg-system-blue-light rounded-full flex items-center justify-center mb-8">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-system-blue-light mb-12">Withdrawal Successful</h2>

          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={() => router.push('/admin/account/withdrawal')}
              className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Go Home
            </button>
            <button
              onClick={() => router.push('/admin/account/withdrawal/receipt')}
              className="w-full py-3.5 bg-white text-gray-900 border-b border-gray-300 font-medium hover:bg-gray-50 transition-colors"
            >
              View E-Receipt
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
