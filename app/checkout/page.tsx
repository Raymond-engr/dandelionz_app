'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import CheckoutProgress from '@/components/CheckoutProgress';

type PaymentFrequency = 'buy-now' | 'weekly' | 'monthly';

export default function CheckoutPage() {
  const router = useRouter();
  const [frequency, setFrequency] = useState<PaymentFrequency>('buy-now');

  const handleProceed = () => {
    if (frequency === 'buy-now') {
      router.push('/checkout/shipping');
    } else {
      router.push(`/checkout/installments?frequency=${frequency}`);
    }
  };

  return (
    <AppLayout showBottomNav={false}>
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
          <h1 className="text-lg font-semibold text-system-blue-light">Checkout</h1>
        </div>

        {/* Progress Indicator */}
        <CheckoutProgress currentStep={1} />

        <div className="p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6">
            Select Payment Frequency
          </h2>

          {/* Payment Options */}
          <div className="space-y-4 mb-8">
            {/* Buy Now */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="radio"
                  name="frequency"
                  checked={frequency === 'buy-now'}
                  onChange={() => setFrequency('buy-now')}
                  className="sr-only peer"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  frequency === 'buy-now' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                }`}>
                  {frequency === 'buy-now' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">Buy Now</span>
            </label>

            {/* Weekly */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="radio"
                  name="frequency"
                  checked={frequency === 'weekly'}
                  onChange={() => setFrequency('weekly')}
                  className="sr-only peer"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  frequency === 'weekly' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                }`}>
                  {frequency === 'weekly' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">Weekly</span>
            </label>

            {/* Monthly */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="radio"
                  name="frequency"
                  checked={frequency === 'monthly'}
                  onChange={() => setFrequency('monthly')}
                  className="sr-only peer"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  frequency === 'monthly' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                }`}>
                  {frequency === 'monthly' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">Monthly</span>
            </label>
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
          >
            Proceed
          </button>
        </div>
      </div>
    </AppLayout>
  );
}