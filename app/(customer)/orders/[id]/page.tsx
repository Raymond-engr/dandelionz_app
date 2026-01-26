'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useParams } from 'next/navigation';
import { useGetOrderDetailsQuery } from '@/lib/api/publicApi';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const { data: response, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const order = response?.data;

  // Use API timeline if available, otherwise fallback to empty
  const trackingSteps = order?.timeline?.map(step => ({
    label: step.label,
    date: step.timestamp ? new Date(step.timestamp).toLocaleDateString() : '',
    completed: step.completed
  })) || [];

  if (isLoading) {
    return (
      <AppLayout showBottomNav={false} userRole="customer">
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  if (error || !order) {
    return (
      <AppLayout showBottomNav={false} userRole="customer">
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
          <p className="text-red-500 mb-4">Failed to load order details.</p>
          <button onClick={() => router.back()} className="text-system-blue-light underline">
            Go Back
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={false} userRole="customer">
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
            <p className="text-sm text-gray-600 mb-1">Order ID: <span className="font-medium text-gray-900">{order.order_id}</span></p>
            <p className="text-sm text-gray-600 mb-3">Order Date: <span className="font-medium text-gray-900">{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</span></p>

            <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
              {order.order_items?.map((item) => (
                <div key={item.id} className="border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{item.product_name}</h3>
                    <div className="flex justify-between">
                        <p className="text-sm text-system-blue-light font-semibold">{item.item_subtotal}</p>
                        <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Address</p>
                <p className="text-gray-900">{order.shipping_address?.address}, {order.shipping_address?.city}</p>
              </div>

              <div>
                <p className="text-gray-600 mb-1">Phone Number</p>
                <p className="text-gray-900">{order.shipping_address?.phone_number || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="relative">
            {trackingSteps.length > 0 ? (
                trackingSteps.map((step, index) => (
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
                    {step.date && <p className="text-xs text-gray-500">{step.date}</p>}
                    </div>
                </div>
                ))
            ) : (
                <p className="text-sm text-gray-500 text-center">No tracking information available.</p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}