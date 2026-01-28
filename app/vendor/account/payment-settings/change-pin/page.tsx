'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useSetPaymentPINMutation } from '@/lib/api/vendorApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ChangePinPage() {
  const router = useRouter();
  const [setPaymentPIN, { isLoading, error: apiError }] = useSetPaymentPINMutation();

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async () => {
    setLocalError('');
    if (pin.length !== 4 || confirmPin.length !== 4) {
      setLocalError('PIN must be 4 digits.');
      return;
    }
    if (pin !== confirmPin) {
      setLocalError('PINs do not match.');
      return;
    }

    try {
      await setPaymentPIN({ pin, confirm_pin: confirmPin }).unwrap();
      toast.success('Payment PIN updated successfully!');
      router.back();
    } catch (err: any) {
      console.error('Failed to set PIN:', err);
      setLocalError(err?.data?.message || 'Failed to update PIN.');
    }
  };

  const currentError = localError || (apiError as any)?.data?.message;

  return (
    <AppLayout showBottomNav={false} userRole="vendor">
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Change Payment PIN</h1>
        </div>

        <div className="p-6 space-y-6">
          {currentError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{currentError}</p>
            </div>
          )}

          <div>
            <label className="text-xs text-gray-600 mb-2 block">New PIN (4 digits)</label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-2 block">Confirm New PIN</label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={isLoading || pin.length !== 4 || confirmPin.length !== 4}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
