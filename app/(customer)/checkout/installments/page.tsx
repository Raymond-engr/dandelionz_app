'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import CheckoutProgress from '@/components/CheckoutProgress';
import { useGetCartQuery, useInitializeInstallmentCheckoutMutation } from '@/lib/api/publicApi';
import toast from 'react-hot-toast';

type InstallmentDuration = '1_month' | '3_months' | '6_months' | '8_months';

// Advisory checkpoint count per duration, mirroring InstallmentPlan.DURATION_INSTALLMENTS on
// the backend - used only to prefill a sensible default amount. The 1-month plan uses 4
// weekly checkpoints, not 1 monthly lump sum.
const DURATION_CHECKPOINTS: Record<InstallmentDuration, number> = {
  '1_month': 4,
  '3_months': 3,
  '6_months': 6,
  '8_months': 8,
};

export default function InstallmentsPage() {
  const router = useRouter();

  const [duration, setDuration] = useState<InstallmentDuration>('3_months');
  const [amount, setAmount] = useState('');
  const hasEditedAmount = useRef(false);
  const { data: cartResponse } = useGetCartQuery();
  const cartTotal = parseFloat(cartResponse?.data?.total || '0');
  const [initializeInstallment, { isLoading, error }] = useInitializeInstallmentCheckoutMutation();

  // Prefill with the advisory per-month amount for the selected duration; the customer is
  // free to change it before proceeding. Stops touching the field once they've typed into
  // it themselves, so switching duration to compare plans doesn't wipe out their input.
  useEffect(() => {
    if (cartTotal <= 0 || hasEditedAmount.current) return;
    setAmount((cartTotal / DURATION_CHECKPOINTS[duration]).toFixed(2));
  }, [cartTotal, duration]);

  const handleProceed = async () => {
    const parsedAmount = parseFloat(amount);
    if (amount && (isNaN(parsedAmount) || parsedAmount <= 0)) {
      toast.error('Enter a valid amount');
      return;
    }
    if (cartTotal > 0 && parsedAmount > cartTotal) {
      toast.error(`Amount exceeds your order total of ₦${cartTotal.toLocaleString()}.`);
      return;
    }

    try {
        const payload = await initializeInstallment({
          duration,
          ...(amount ? { amount: parsedAmount } : {}),
        }).unwrap();

        if (payload.data?.authorization_url) {
            // Redirect to Paystack for the first installment
            window.location.href = payload.data.authorization_url;
        } else {
            toast.error('Could not initiate installment plan. Please try again.');
        }

    } catch (err: any) {
        console.error('Failed to init installment:', err);
        // Error handled by hook
    }
  };

  const durationOptions: { value: InstallmentDuration; label: string; description: string }[] = [
      { value: '1_month', label: '1 Month Plan', description: 'Split payment over 1 month' },
      { value: '3_months', label: '3 Months Plan', description: 'Split payment over 3 months' },
      { value: '6_months', label: '6 Months Plan', description: 'Split payment over 6 months' },
      { value: '8_months', label: '8 Months Plan', description: 'Split payment over 8 months' },
  ];

  return (
    <AppLayout showBottomNav={false} userRole="customer">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button 
            onClick={() => router.back()} 
            className="absolute left-4 p-2 -ml-2"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Installment Plan</h1>
        </div>

        {/* Progress Indicator */}
        <CheckoutProgress currentStep={3} />

        <div className="p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Select Plan Duration
          </h2>
          
           {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
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
                    
                    return 'An error occurred during installment initialization.';
                  } catch (e) {
                    return 'An error occurred.';
                  }
                })()}
              </p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            {durationOptions.map((option) => (
                <label key={option.value} className="flex items-start gap-3 cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="relative mt-1">
                        <input
                        type="radio"
                        name="duration"
                        checked={duration === option.value}
                        onChange={() => setDuration(option.value)}
                        className="sr-only peer"
                        disabled={isLoading}
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        duration === option.value ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                        }`}>
                        {duration === option.value && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        )}
                        </div>
                    </div>
                    <div>
                        <span className={`text-sm font-medium ${duration === option.value ? 'text-gray-900' : 'text-gray-700'}`}>
                            {option.label}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                    </div>
                </label>
            ))}
          </div>

          <h2 className="text-base font-semibold text-gray-900 mb-2">First Payment Amount</h2>
          <p className="text-xs text-gray-500 mb-3">
            Pay as much as you like now. The rest becomes your running balance
            {cartTotal > 0 ? ` — order total is ₦${cartTotal.toLocaleString()}.` : '.'}
          </p>
          <div className="mb-8">
            <label className="block text-xs text-gray-500 mb-1">Amount to pay (₦)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => {
                hasEditedAmount.current = true;
                setAmount(e.target.value);
              }}
              disabled={isLoading}
              placeholder="0.00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-system-blue-light"
            />
            <p className="text-[11px] text-gray-500 mt-2">
              This first payment is by card via Paystack. Once your plan starts, you can pay the
              rest from your wallet or by card, whichever you prefer.
            </p>
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={isLoading}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}