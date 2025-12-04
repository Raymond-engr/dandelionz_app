'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function CheckoutSuccessPage() {
  const router = useRouter();

  return (
    <AppLayout showBottomNav={false} userRole="customer">
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button 
            onClick={() => router.push('/')} 
            className="absolute left-4 p-2 -ml-2"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Payment</h1>
        </div>

        {/* Success Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Success Icon */}
          <div className="w-32 h-32 bg-system-blue-light rounded-full flex items-center justify-center mb-8">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-bold text-system-blue-light mb-12">
            Checkout Successful
          </h2>

          {/* Action Buttons */}
          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={() => router.push('/orders')}
              className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              View Order
            </button>
            <button
              onClick={() => router.push('/receipt')}
              className="w-full py-3.5 bg-white text-system-blue-light border border-system-blue-light rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View E-Reciept
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}