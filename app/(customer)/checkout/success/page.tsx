'use client';

import React, { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVerifyPaymentQuery } from '@/lib/api/publicApi';
import LoadingSpinner from '@/components/LoadingSpinner';

function CheckoutStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  
  // The 'skip' option prevents the query from running if the reference is not present
  const { data, error, isLoading } = useVerifyPaymentQuery(
    { reference: reference as string },
    { skip: !reference }
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <LoadingSpinner />
        <h2 className="text-xl font-semibold text-gray-800 mt-4">Verifying Payment...</h2>
        <p className="text-gray-600">Please wait while we confirm your transaction.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mb-8">
          <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Payment Failed
        </h2>
        <p className="text-gray-600 mb-8">
          {(error as any)?.data?.message || 'We were unable to verify your payment. Please contact support if the issue persists.'}
        </p>
        <button
          onClick={() => router.push('/')}
          className="w-full max-w-sm py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  // This handles both success and direct navigation to this page without a reference
  // (e.g., for Cash on Delivery)
  const isCod = searchParams.get('status') === 'cod';
  const successMessage = isCod ? 'Your order has been placed successfully!' : 'Checkout Successful';

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="w-32 h-32 bg-system-blue-light rounded-full flex items-center justify-center mb-8">
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-system-blue-light mb-12">
        {successMessage}
      </h2>
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
  );
}


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

        {/* Use Suspense to handle client-side data fetching */}
        <Suspense fallback={
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <LoadingSpinner />
          </div>
        }>
          <CheckoutStatus />
        </Suspense>
      </div>
    </AppLayout>
  );
}