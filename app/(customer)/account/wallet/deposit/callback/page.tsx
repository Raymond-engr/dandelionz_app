'use client';

import React, { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVerifyWalletDepositQuery } from '@/lib/api/customerApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { apiError } from '@/lib/utils';

function DepositStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  const { data, error, isLoading } = useVerifyWalletDepositQuery(
    { reference: reference as string },
    { skip: !reference }
  );

  if (!reference) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">No payment reference</h2>
        <p className="text-gray-600 mb-8">
          We could not tell which top-up this was. If you were charged, your wallet will
          still be credited.
        </p>
        <button
          onClick={() => router.push('/account/wallet')}
          className="w-full max-w-sm py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
        >
          Back to Wallet
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <LoadingSpinner />
        <h2 className="text-xl font-semibold text-gray-800 mt-4">Confirming your top-up...</h2>
        <p className="text-gray-600">Please wait while we credit your wallet.</p>
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
        <h2 className="text-2xl font-bold text-red-600 mb-4">Top-up Not Completed</h2>
        <p className="text-gray-600 mb-8">
          {apiError(
            error,
            'We could not confirm this top-up. If you were charged, contact support with your reference.'
          )}
        </p>
        <p className="text-sm text-gray-400 mb-8">Reference: {reference}</p>
        <button
          onClick={() => router.push('/account/wallet')}
          className="w-full max-w-sm py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
        >
          Back to Wallet
        </button>
      </div>
    );
  }

  const deposit = data?.data;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="w-32 h-32 bg-system-blue-light rounded-full flex items-center justify-center mb-8">
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-system-blue-light mb-2 text-center">
        Wallet Funded
      </h2>
      {deposit?.amount != null && (
        <p className="text-lg font-semibold text-gray-900 mb-2">
          ₦{Number(deposit.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} added
        </p>
      )}
      <p className="text-sm text-gray-600 mb-10 text-center max-w-sm">
        This is now in your spendable balance and can be used at checkout. It cannot be
        withdrawn to a bank.
      </p>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={() => router.push('/account/wallet')}
          className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
        >
          View Wallet
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full py-3.5 bg-white text-system-blue-light border border-system-blue-light rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default function WalletDepositCallbackPage() {
  const router = useRouter();

  return (
    <AppLayout showBottomNav={false} userRole="customer">
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button
            onClick={() => router.push('/account/wallet')}
            className="absolute left-4 p-2 -ml-2"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Wallet Top-up</h1>
        </div>

        <Suspense
          fallback={
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <LoadingSpinner />
            </div>
          }
        >
          <DepositStatus />
        </Suspense>
      </div>
    </AppLayout>
  );
}
