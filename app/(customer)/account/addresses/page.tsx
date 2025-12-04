'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function DeliveryAddressPage() {
  const router = useRouter();
  const [homeExpanded, setHomeExpanded] = useState(true);
  const [pickupExpanded, setPickupExpanded] = useState(false);

  const handleSave = () => {
    console.log('Saving addresses');
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
          <h1 className="text-lg font-semibold text-system-blue-light">Delivery Address</h1>
        </div>

        <div className="p-6">
          {/* Home Section */}
          <div className="mb-6">
            <button
              onClick={() => setHomeExpanded(!homeExpanded)}
              className="w-full flex items-center justify-between mb-3"
            >
              <span className="text-sm font-semibold text-gray-900">Home</span>
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform ${homeExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {homeExpanded && (
              <div className="pl-1">
                <p className="text-xs text-gray-600 mb-2">Address</p>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900">No. 13 JB Street, Ekosiodin, Edo State</p>
                </div>
              </div>
            )}
          </div>

          {/* Pickup Section */}
          <div className="mb-8">
            <button
              onClick={() => setPickupExpanded(!pickupExpanded)}
              className="w-full flex items-center justify-between mb-3"
            >
              <span className="text-sm font-semibold text-gray-900">Pickup</span>
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform ${pickupExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {pickupExpanded && (
              <div className="pl-1">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
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
              </div>
            )}
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