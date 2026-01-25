'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useRequestPINResetMutation } from '@/lib/api/vendorApi';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ForgotPinPage() {
  const router = useRouter();
  const [requestPINReset, { isLoading, isSuccess, error }] = useRequestPINResetMutation();
  const [localError, setLocalError] = useState('');

  const handleRequestReset = async () => {
    setLocalError('');
    try {
      await requestPINReset().unwrap();
    } catch (err: any) {
      console.error('Failed to request PIN reset:', err);
      setLocalError(err?.data?.message || 'Failed to request PIN reset.');
    }
  };

  const currentError = localError || (error as any)?.data?.message;

  return (
    <AppLayout showBottomNav={false} userRole="vendor">
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Forgot Payment PIN</h1>
        </div>

        <div className="p-6 space-y-6 text-center">
          {currentError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{currentError}</p>
            </div>
          )}
          {isSuccess ? (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">A PIN reset link has been sent to your email.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-6">
                Click the button below to receive a link to reset your payment PIN via email.
              </p>
              <button
                onClick={handleRequestReset}
                disabled={isLoading}
                className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Request PIN Reset'}
              </button>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
