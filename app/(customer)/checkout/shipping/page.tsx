'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import CheckoutProgress from '@/components/CheckoutProgress';

import { useGetCustomerProfileQuery } from '@/lib/api/customerApi';
import Link from 'next/link';

type ShippingMethod = 'home' | 'pickup';

export default function ShippingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const frequency = searchParams.get('frequency') || 'buy-now';
  
  const [method, setMethod] = useState<ShippingMethod>('home');
  const [pickupLocation, setPickupLocation] = useState('');
  
  const { data: profile } = useGetCustomerProfileQuery();

  const handleProceed = () => {
    if (method === 'home' && !profile?.shipping_address) {
      alert('Please add a shipping address to proceed.');
      return;
    }
    
    if (frequency === 'installment') {
      router.push('/checkout/installments');
    } else {
      router.push('/checkout/payment');
    }
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
                  {profile?.shipping_address ? (
                    <div className="flex justify-between items-start">
                        <p className="text-sm text-gray-700">
                        {profile.shipping_address}, {profile.city}, {profile.postal_code}
                        </p>
                        <Link href="/account/address" className="text-xs text-system-blue-light font-medium whitespace-nowrap ml-2">
                        Change
                        </Link>
                    </div>
                  ) : (
                    <Link href="/account/address" className="text-sm text-system-blue-light font-medium">
                        + Add Shipping Address
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Pickup (Disabled/Placeholder for now) */}
            {/* 
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
                <span className="text-sm font-medium text-gray-900">Pickup (Coming Soon)</span>
              </label>
            </div> 
            */}
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
          >
            {frequency === 'installment' ? 'Proceed' : 'Pay Now'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}