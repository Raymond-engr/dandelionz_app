'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import CheckoutProgress from '@/components/CheckoutProgress';
import { useInitializeCheckoutMutation } from '@/lib/api/publicApi';
import toast from 'react-hot-toast';
import { apiError } from '@/lib/utils';

type PaymentMethod = 'delivery' | 'card';

export default function PaymentPage() {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [initializeCheckout, { isLoading, error }] = useInitializeCheckoutMutation();

  const handleMakePayment = async () => {
    if (method === 'delivery') {
      return; // Disabled
    } else if (method === 'card') {
      // For card payments, we initialize Paystack checkout
      try {
        const payload = await initializeCheckout().unwrap();
        // Redirect the user to the Paystack authorization URL
        // Access payload.data.authorization_url as per the API response structure
        if (payload.data?.authorization_url) {
          window.location.href = payload.data.authorization_url;
        } else {
          // Handle case where URL is not returned
          toast.error('Could not initiate payment. Please try again.');
        }
      } catch (err: any) {
        console.error('Failed to initialize checkout:', err);
        if (err?.data?.error === "Cart has no items") {
             toast.error("Your cart is empty. Redirecting to home...");
             setTimeout(() => router.push('/'), 2000);
        } else {
             // Error is handled by the 'error' object from the hook for other cases
             // toast.error('Payment initiation failed.');
        }
      }
    }
  };

  return (
    <AppLayout showBottomNav={false} userRole="customer">
      <div className="min-h-screen bg-white pb-24">
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
        <CheckoutProgress currentStep={3} />

        <div className="p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6">
            Select Payment Mode
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {apiError(error, 'An error occurred while trying to initiate payment.')}
              </p>
            </div>
          )}

          {/* Payment Options */}
          <div className="space-y-4 mb-6">
            {/* On Delivery (Disabled) */}
            <label className="flex items-center gap-3 p-4 border rounded-lg opacity-60 cursor-not-allowed bg-gray-50">
              <div className="relative">
                <input
                  type="radio"
                  name="payment"
                  disabled
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                </div>
              </div>
              <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Pay on Delivery</span>
                  <span className="text-xs text-system-blue-light">Coming Soon</span>
              </div>
            </label>

            {/* Credit/Debit Card */}
            <label className="flex items-center gap-3 cursor-pointer p-4 border rounded-lg">
                <div className="relative">
                  <input
                    type="radio"
                    name="payment"
                    checked={method === 'card'}
                    onChange={() => setMethod('card')}
                    className="sr-only peer"
                    disabled={isLoading}
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    method === 'card' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                  }`}>
                    {method === 'card' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">Pay with Card (via Paystack)</span>
            </label>
          </div>

          {/* Make Payment Button */}
          <button
            onClick={handleMakePayment}
            disabled={isLoading}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Initializing...' : (method === 'card' ? 'Continue to Paystack' : 'Place Order')}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}