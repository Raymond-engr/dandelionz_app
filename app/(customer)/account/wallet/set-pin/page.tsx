'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useSetCustomerPaymentPinMutation } from '@/lib/api/customerApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { apiError } from '@/lib/utils';

export default function SetPinPage() {
  const router = useRouter();
  const [setPaymentPin, { isLoading }] = useSetCustomerPaymentPinMutation();

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
      await setPaymentPin({ pin, confirm_pin: confirmPin }).unwrap();
      toast.success('Payment PIN set successfully.');
      router.push('/account/wallet/withdraw');
    } catch (err: any) {
      toast.error(apiError(err, 'Failed to set PIN. Please try again.'));
    }
  };

  return (
    <AppLayout showBottomNav={true} userRole="customer">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Set Payment PIN</h1>
        <p className="text-sm text-gray-500 mb-8">
          Set a secure 4-digit PIN to authorize withdrawals from your wallet.
        </p>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="space-y-6">
            {localError && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                {localError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                className="w-full p-4 text-center tracking-[1em] text-xl border border-gray-300 rounded-xl focus:ring-2 focus:ring-system-blue focus:border-system-blue transition-all"
                maxLength={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm PIN
              </label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                className="w-full p-4 text-center tracking-[1em] text-xl border border-gray-300 rounded-xl focus:ring-2 focus:ring-system-blue focus:border-system-blue transition-all"
                maxLength={4}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || pin.length !== 4 || confirmPin.length !== 4}
              className="w-full py-4 bg-system-blue-light text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 mt-4 flex justify-center items-center"
            >
              {isLoading ? <LoadingSpinner /> : 'Save PIN'}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
