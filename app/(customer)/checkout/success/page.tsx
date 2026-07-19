'use client';

import React, { Suspense, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVerifyPaymentQuery, useVerifyInstallmentPaymentQuery } from '@/lib/api/publicApi';
import LoadingSpinner from '@/components/LoadingSpinner';

function CheckoutStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const planId = searchParams.get('plan_id');

  // Paystack sends every payment back to this one URL (the backend has a single
  // PAYSTACK_CALLBACK_URL for orders, installments and wallet top-ups alike), so a
  // wallet deposit lands here too. Deposit references are prefixed DEP-; without this
  // branch the order verify would run against a deposit reference and the customer
  // would be shown order messaging and a broken "View Order" link.
  const isDeposit = Boolean(reference?.startsWith('DEP-'));

  useEffect(() => {
    if (isDeposit && reference) {
      router.replace(
        `/account/wallet/deposit/callback?reference=${encodeURIComponent(reference)}`
      );
    }
  }, [isDeposit, reference, router]);

  // Standard verification for normal orders
  const {
    data: standardData,
    error: standardError,
    isLoading: isStandardLoading
  } = useVerifyPaymentQuery(
    { reference: reference as string },
    { skip: !reference || !!planId || isDeposit }
  );

  // Installment verification for plans
  const {
    data: installmentData,
    error: installmentError,
    isLoading: isInstallmentLoading
  } = useVerifyInstallmentPaymentQuery(
    { reference: reference as string },
    { skip: !reference || !planId || isDeposit }
  );

  const isLoading = isStandardLoading || isInstallmentLoading;
  const error = standardError || installmentError;
  const verifyData = planId ? installmentData : (standardData as any);

  // Hold the spinner while the effect above navigates away, so a top-up never flashes
  // "Checkout Successful" on its way to the wallet confirmation.
  if (isDeposit) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <LoadingSpinner />
        <h2 className="text-xl font-semibold text-gray-800 mt-4">Confirming your top-up...</h2>
      </div>
    );
  }

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
          {(() => {
            try {
              const errAny = error as any;
              const errData = errAny?.data;
              
              if (typeof errData === 'string') return errData;
              if (typeof errData?.message === 'string') return errData.message;
              if (typeof errData?.error === 'string') return errData.error;
              
              const errorObj = errData?.error || errData;
              if (errorObj && typeof errorObj === 'object') {
                return Object.entries(errorObj)
                  .map(([key, val]) => {
                    const message = Array.isArray(val) ? val.join(', ') : JSON.stringify(val);
                    return `${key}: ${message}`;
                  })
                  .join(' | ');
              }
              
              return 'We were unable to verify your payment. Please contact support if the issue persists.';
            } catch (e) {
              return 'An error occurred during verification.';
            }
          })()}
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
  const successMessage = isCod 
    ? 'Your order has been placed successfully!' 
    : (planId ? `Installment ${verifyData?.data?.payment_number || ''} Successful!` : 'Checkout Successful');

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="w-32 h-32 bg-system-blue-light rounded-full flex items-center justify-center mb-8">
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-system-blue-light mb-12 text-center">
        {successMessage}
      </h2>
      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={() => router.push('/orders')}
          className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
        >
          {planId ? 'View My Plans' : 'View Order'}
        </button>
        {!planId && (
            <button
                onClick={() => router.push(`/receipt?id=${verifyData?.data?.order_id}`)}
                className="w-full py-3.5 bg-white text-system-blue-light border border-system-blue-light rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
                View E-Reciept
            </button>
        )}
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