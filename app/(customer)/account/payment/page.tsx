'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

type PaymentMethod = 'card' | 'payoneer';

export default function PaymentOptionsPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [cardDetails, setCardDetails] = useState({
    holderName: 'ADAM SMITH',
    cardNumber: '0123 4567 8901 2345',
    expiryDate: '01/27',
    cvv: '000',
  });

  const [payoneerDetails, setPayoneerDetails] = useState({
    cardNumber: '1230 5647 9018 3452',
    expiryDate: '01/27',
    cvv: '000',
    holderName: 'ADAM SMITH',
  });

  const handleSave = () => {
    console.log('Saving payment options');
  };

  return (
    <AppLayout showBottomNav={false} userRole="customer">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Payment Option</h1>
        </div>

        <div className="p-6">
          {/* Payment Methods */}
          <div className="space-y-6 mb-8">
            {/* Credit/Debit Card */}
            <div>
              <label className="flex items-center gap-3 mb-4 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedMethod === 'card'}
                    onChange={() => setSelectedMethod('card')}
                    className="sr-only peer"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === 'card' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                  }`}>
                    {selectedMethod === 'card' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">Credit/Debit Card</span>
              </label>

              {selectedMethod === 'card' && (
                <div className="space-y-4 pl-8">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Card Holder Name</label>
                    <input
                      type="text"
                      value={cardDetails.holderName}
                      onChange={(e) => setCardDetails({...cardDetails, holderName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Expiry Date</label>
                      <input
                        type="text"
                        value={cardDetails.expiryDate}
                        onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">CVV</label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payoneer */}
            <div>
              <label className="flex items-center gap-3 mb-4 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedMethod === 'payoneer'}
                    onChange={() => setSelectedMethod('payoneer')}
                    className="sr-only peer"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === 'payoneer' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                  }`}>
                    {selectedMethod === 'payoneer' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">Payoneer</span>
              </label>

              {selectedMethod === 'payoneer' && (
                <div className="space-y-4 pl-8">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Card Number</label>
                    <input
                      type="text"
                      value={payoneerDetails.cardNumber}
                      onChange={(e) => setPayoneerDetails({...payoneerDetails, cardNumber: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Expiry Date</label>
                      <input
                        type="text"
                        value={payoneerDetails.expiryDate}
                        onChange={(e) => setPayoneerDetails({...payoneerDetails, expiryDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">CVV</label>
                      <input
                        type="text"
                        value={payoneerDetails.cvv}
                        onChange={(e) => setPayoneerDetails({...payoneerDetails, cvv: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Card Holder Name</label>
                    <input
                      type="text"
                      value={payoneerDetails.holderName}
                      onChange={(e) => setPayoneerDetails({...payoneerDetails, holderName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSave}
              className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => router.back()}
              className="w-full py-3.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}