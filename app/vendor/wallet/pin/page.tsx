'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function PinPage() {
  const router = useRouter();
  const [pin, setPin] = useState(['', '', '', '']);

  const handlePinInput = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      if (value && index < 3) {
        document.getElementById(`pin-${index + 1}`)?.focus();
      }
    }
  };

  return (
    <AppLayout showBottomNav={false} userRole="vendor">
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.push('/vendor/wallet/withdraw')} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Create Payment PIN</h1>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <label className="text-sm font-medium text-gray-900 mb-4 block">Enter PIN</label>
            <div className="flex gap-3 justify-center">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinInput(index, e.target.value)}
                  className="w-16 h-16 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-system-blue-light"
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900 mb-4 block">Confirm PIN</label>
            <div className="flex gap-3 justify-center">
              {pin.map((digit, index) => (
                <input
                  key={`confirm-${index}`}
                  id={`confirm-pin-${index}`}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinInput(index, e.target.value)}
                  className="w-16 h-16 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-system-blue-light"
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => router.push('/vendor/wallet/summary')}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
          >
            Withdraw
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
