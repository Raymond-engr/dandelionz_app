'use client';

import React, { useState, Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetOrderDetailsQuery } from '@/lib/api/publicApi';
import LoadingSpinner from '@/components/LoadingSpinner';

function TrackingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('id');
  const [inputId, setInputId] = useState('');

  const { data: response, isLoading, error } = useGetOrderDetailsQuery(orderIdParam || '', {
    skip: !orderIdParam
  });
  const order = response;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputId.trim()) {
      router.push(`/order-tracking?id=${inputId.trim()}`);
    }
  };

  if (!orderIdParam) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Track Your Order</h2>
        <p className="text-gray-600 mb-6 text-center">Enter your Order ID to see the current status.</p>
        <form onSubmit={handleSearch} className="w-full max-w-sm flex gap-2">
          <input
            type="text"
            placeholder="Order ID (e.g., ORD-123)"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-system-blue-light"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
          >
            Track
          </button>
        </form>
      </div>
    );
  }

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
        </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-500 mb-4">Order not found.</p>
        <button 
            onClick={() => router.push('/order-tracking')} 
            className="text-system-blue-light underline"
        >
            Try Another ID
        </button>
      </div>
    );
  }

  const trackingSteps = order.timeline?.map(step => ({
    label: step.label,
    date: step.timestamp ? new Date(step.timestamp).toLocaleDateString() : '',
    completed: step.completed
  })) || [];

  return (
    <>
        {/* Tracking Timeline */}
        <div className="flex-1 p-6">
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-600">Tracking Order:</p>
            <p className="text-lg font-bold text-gray-900">{order.order_id}</p>
          </div>

          <div className="relative max-w-md mx-auto">
            {trackingSteps.length > 0 ? (
                trackingSteps.map((step, index) => (
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
                    {step.date && <p className="text-xs text-gray-500">{step.date}</p>}
                    </div>
                </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No tracking history available yet.</p>
            )}
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
    </>
  );
}

export default function OrderTrackingPage() {
  const router = useRouter();

  return (
    <AppLayout showBottomNav={false} userRole="customer">
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

        <Suspense fallback={<div className="flex-1 flex items-center justify-center"><LoadingSpinner /></div>}>
            <TrackingContent />
        </Suspense>
      </div>
    </AppLayout>
  );
}