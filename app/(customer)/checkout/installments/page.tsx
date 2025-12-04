'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import CheckoutProgress from '@/components/CheckoutProgress';

export default function InstallmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const frequency = searchParams.get('frequency') || 'weekly';
  
  const [selectedInstallments, setSelectedInstallments] = useState(6);

  // Different installment options based on frequency
  const weeklyOptions = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48];
  const monthlyOptions = [2, 4, 6, 8, 10, 12, 14, 16, 18];
  
  const installmentOptions = frequency === 'weekly' ? weeklyOptions : monthlyOptions;

  const handleProceed = () => {
    router.push('/checkout/shipping');
  };

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
          <h1 className="text-lg font-semibold text-system-blue-light">Checkout</h1>
        </div>

        {/* Progress Indicator */}
        <CheckoutProgress currentStep={1} />

        <div className="p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Select Payment Frequency
          </h2>

          {/* Frequency Radio */}
          <div className="space-y-3 mb-6">
            <label className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-700">Buy Now</span>
            </label>

            <label className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                frequency === 'weekly' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
              }`}>
                {frequency === 'weekly' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                )}
              </div>
              <span className={`text-sm ${frequency === 'weekly' ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                Weekly
              </span>
            </label>

            {frequency === 'weekly' && (
              <div className="ml-8 mt-3">
                <p className="text-xs text-gray-600 mb-3">Select number of installments</p>
                <div className="grid grid-cols-6 gap-2">
                  {weeklyOptions.map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedInstallments(num)}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                        selectedInstallments === num
                          ? 'bg-system-blue-light text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <label className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                frequency === 'monthly' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
              }`}>
                {frequency === 'monthly' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                )}
              </div>
              <span className={`text-sm ${frequency === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                Monthly
              </span>
            </label>

            {frequency === 'monthly' && (
              <div className="ml-8 mt-3">
                <p className="text-xs text-gray-600 mb-3">Select number of installments</p>
                <div className="grid grid-cols-6 gap-2">
                  {monthlyOptions.map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedInstallments(num)}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                        selectedInstallments === num
                          ? 'bg-system-blue-light text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
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