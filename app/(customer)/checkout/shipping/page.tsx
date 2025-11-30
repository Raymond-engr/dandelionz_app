'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import CheckoutProgress from '@/components/CheckoutProgress';

type ShippingMethod = 'home' | 'pickup';

export default function ShippingPage() {
  const router = useRouter();
  const [method, setMethod] = useState<ShippingMethod>('home');
  const [pickupLocation, setPickupLocation] = useState('');

  const handlePayNow = () => {
    router.push('/checkout/payment');
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
        <CheckoutProgress currentStep={2} />

        <div className="p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6">
            Shipping Details
          </h2>

          {/* Shipping Options */}
          <div className="space-y-4 mb-6">
            {/* Home Delivery */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="shipping"
                    checked={method === 'home'}
                    onChange={() => setMethod('home')}
                    className="sr-only peer"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    method === 'home' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                  }`}>
                    {method === 'home' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">Home</span>
              </label>

              {method === 'home' && (
                <div className="ml-8 mt-3">
                  <p className="text-xs text-gray-500 mb-1">Address</p>
                  <p className="text-sm text-gray-700">
                    No. 13 JB Street, Ekosiodin, Edo State
                  </p>
                </div>
              )}
            </div>

            {/* Pickup */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="shipping"
                    checked={method === 'pickup'}
                    onChange={() => setMethod('pickup')}
                    className="sr-only peer"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    method === 'pickup' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                  }`}>
                    {method === 'pickup' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">Pickup</span>
              </label>

              {method === 'pickup' && (
                <div className="ml-8 mt-3 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium mb-1">
                        Edo State, Ovia North, Ugbowo Uselu Market Road
                      </p>
                      <p className="text-sm text-gray-600">
                        08012345678
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pay Now Button */}
          <button
            onClick={handlePayNow}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
          >
            Pay Now
          </button>
        </div>
      </div>
    </AppLayout>
  );
}