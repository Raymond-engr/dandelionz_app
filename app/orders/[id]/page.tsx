'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function OrderDetailsPage() {
  const router = useRouter();

  const trackingSteps = [
    { label: 'Order Placed', date: 'Associated Date', completed: true },
    { label: 'Product Shipped', date: 'Associated Date', completed: true },
    { label: 'Ready for pickup', date: 'Associated Date', completed: false },
    { label: 'Collected', date: 'Associated Date', completed: false },
  ];

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light ml-4">Order Details</h1>
        </div>

        <div className="p-6">
          {/* Order Info */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="text-sm text-gray-900 mb-3">Order Date</p>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Product Name</h3>
              <p className="text-sm text-system-blue-light font-semibold mb-1">Amount</p>
              <p className="text-xs text-gray-600">Quantity: 1</p>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Address</p>
                <p className="text-gray-900">No. 123 address goes here</p>
              </div>

              <div>
                <p className="text-gray-600 mb-1">Phone Number</p>
                <p className="text-gray-900">08123456789</p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="relative">
            {trackingSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 mb-6 last:mb-0">
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
                    <div className={`absolute left-1/2 top-6 w-0.5 h-10 -translate-x-1/2 ${
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
      </div>
    </AppLayout>
  );
}