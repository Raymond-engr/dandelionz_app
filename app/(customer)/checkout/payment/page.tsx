'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import CheckoutProgress from '@/components/CheckoutProgress';

type PaymentMethod = 'delivery' | 'card' | 'payoneer';

export default function PaymentPage() {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>('delivery');
  const [cardDetails, setCardDetails] = useState({
    holderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });

  const handleMakePayment = () => {
    if (method === 'card' && (!cardDetails.holderName || !cardDetails.cardNumber)) {
      alert('Please fill in all card details');
      return;
    }
    router.push('/checkout/success');
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

          {/* Payment Options */}
          <div className="space-y-4 mb-6">
            {/* On Delivery */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="radio"
                  name="payment"
                  checked={method === 'delivery'}
                  onChange={() => setMethod('delivery')}
                  className="sr-only peer"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  method === 'delivery' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                }`}>
                  {method === 'delivery' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">On Delivery</span>
            </label>

            {/* Credit/Debit Card */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="payment"
                    checked={method === 'card'}
                    onChange={() => setMethod('card')}
                    className="sr-only peer"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    method === 'card' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                  }`}>
                    {method === 'card' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">Credit/Debit Card</span>
              </label>

              {method === 'card' && (
                <div className="ml-8 mt-4 space-y-4">
                  {/* Card Holder Name */}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      value={cardDetails.holderName}
                      onChange={(e) => setCardDetails({...cardDetails, holderName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  {/* Expiry Date and CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expiryDate}
                        onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
                        placeholder="01/27"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
                        placeholder="000"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  {/* Save Card Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cardDetails.saveCard}
                      onChange={(e) => setCardDetails({...cardDetails, saveCard: e.target.checked})}
                      className="w-4 h-4 text-system-blue-light border-gray-300 rounded focus:ring-system-blue-light"
                    />
                    <span className="text-sm text-gray-700">Save Card</span>
                  </label>
                </div>
              )}
            </div>

            {/* Payoneer */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="payment"
                    checked={method === 'payoneer'}
                    onChange={() => setMethod('payoneer')}
                    className="sr-only peer"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    method === 'payoneer' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                  }`}>
                    {method === 'payoneer' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">Payoneer</span>
              </label>

              {method === 'payoneer' && (
                <div className="ml-8 mt-4 space-y-4">
                  {/* Card Number */}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">
                      Card Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  {/* Expiry Date and CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
                        placeholder="01/27"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        CVV
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
                        placeholder="000"
                      />
                    </div>
                  </div>

                  {/* Card Holder Name */}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Save Card Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-system-blue-light border-gray-300 rounded focus:ring-system-blue-light"
                    />
                    <span className="text-sm text-gray-700">Save Card</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Make Payment Button */}
          <button
            onClick={handleMakePayment}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
          >
            Make Payment
          </button>
        </div>
      </div>
    </AppLayout>
  );
}