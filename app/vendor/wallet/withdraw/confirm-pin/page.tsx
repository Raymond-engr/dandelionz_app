'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVendorRequestWithdrawalMutation } from '@/lib/api/vendorApi';
import toast from 'react-hot-toast';

export default function ConfirmWithdrawalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [requestWithdrawal, { isLoading, error }] = useVendorRequestWithdrawalMutation();

  const [pin, setPin] = useState('');
  const [localError, setLocalError] = useState('');

  const amount = searchParams.get('amount') || '0.00';
  const bankName = searchParams.get('bankName') || '';
  const accountNumber = searchParams.get('accountNumber') || '';
  const accountName = searchParams.get('accountName') || '';

  const handleConfirm = async () => {
    setLocalError('');
    if (pin.length !== 4) {
      setLocalError('Please enter your 4-digit PIN.');
      return;
    }

    try {
      const result = await requestWithdrawal({ amount, pin }).unwrap();
      toast.success('Withdrawal request submitted successfully!');
      
      const successQuery = new URLSearchParams({
        amount,
        reference: result.reference || '',
      }).toString();
      
      router.push(`/vendor/wallet/success?${successQuery}`);
    } catch (err: any) {
      console.error('Withdrawal failed:', err);
      setLocalError(err?.data?.message || 'Failed to process withdrawal.');
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
          <h1 className="text-lg font-semibold text-system-blue-light">Confirm Withdrawal</h1>
        </div>

        <div className="p-6 space-y-6">
          {currentError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{currentError}</p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount</span>
              <span className="text-sm font-semibold text-gray-900">₦{parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Bank</span>
              <span className="text-sm font-medium text-gray-900">{bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Account Number</span>
              <span className="text-sm font-medium text-gray-900">{accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Account Name</span>
              <span className="text-sm font-medium text-gray-900">{accountName}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Enter Payment PIN</label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light text-center tracking-widest text-lg"
                placeholder="••••"
              />
            </div>
            
            <div className="text-right">
              <button 
                type="button"
                onClick={() => router.push('/vendor/account/payment-settings/forgot-pin')}
                className="text-xs text-system-blue-light hover:underline font-medium"
              >
                Forgot PIN?
              </button>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isLoading || pin.length !== 4}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Confirm Withdrawal'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
