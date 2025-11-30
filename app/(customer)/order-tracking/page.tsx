'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function OrderTrackingPage() {
  const router = useRouter();

  const trackingSteps = [
    { label: 'Order Placed', date: 'Associated Date', completed: true },
    { label: 'Product Shipped', date: 'Associated Date', completed: true },
    { label: 'Ready for pickup', date: 'Associated Date', completed: false },
    { label: 'Collected', date: 'Associated Date', completed: false },
  ];

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Order Tracking</h1>
        </div>

        {/* Tracking Timeline */}
        <div className="flex-1 p-6">
          <div className="relative max-w-md">
            {trackingSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 mb-8 last:mb-0">
                {/* Timeline Circle */}
                <div className="relative">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    step.completed 
                      ? 'bg-system-blue-light border-system-blue-light' 
                      : 'bg-white border-gray-300'
                  }`}>
                    {step.completed && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                  </div>
                  {/* Connecting Line */}
                  {index < trackingSteps.length - 1 && (
                    <div className={`absolute left-1/2 top-6 w-0.5 h-12 -translate-x-1/2 ${
                      step.completed ? 'bg-system-blue-light' : 'bg-gray-300'
                    }`} />
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1 pt-0.5">
                  <p className={`text-sm font-medium ${
                    step.completed ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Shopping Button */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={() => router.push('/')}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </AppLayout>
  );
}