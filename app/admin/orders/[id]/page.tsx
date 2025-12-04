'use client';

import React, { useState, use } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderDetails({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [action, setAction] = useState('Cancel Order');
  const [reason, setReason] = useState('');

  const orderId = params.id;
  // Mock order data - replace with API call
  const order = {
    id: orderId,
    customerName: 'Adam Smith',
    customerEmail: 'adamsmith@gmail.com',
    customerPhone: '08132467598',
    vendorName: 'Store Name Goes Here',
    vendorEmail: 'adamsmith@gmail.com',
    productName: 'Product Name',
    quantity: '0 Units',
    amount: '₦0.00',
    deliveryFee: '₦0.00',
    totalAmount: '₦0.00',
  };

  const trackingSteps = [
    { label: 'Order Placed', date: 'Associated Date', active: true },
    { label: 'Product Shipped', date: 'Associated Date', active: true },
    { label: 'Ready for pickup', date: 'Associated Date', active: false },
    { label: 'Collected', date: 'Associated Date', active: false },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[600px] bg-white relative">
        <div className="min-h-screen bg-white pb-6">
          <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
            <button onClick={() => router.back()} className="absolute left-4">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-lg font-semibold text-system-blue-light">Order Details</h1>
          </div>

          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h2>
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Full Name</label>
                <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Email Address</label>
                <p className="text-sm font-medium text-gray-900">{order.customerEmail}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Phone Number</label>
                <p className="text-sm font-medium text-gray-900">{order.customerPhone}</p>
              </div>
            </div>

            <h2 className="text-sm font-semibold text-gray-900 mb-3">Vendor Information</h2>
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Store Name</label>
                <p className="text-sm font-medium text-gray-900">{order.vendorName}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Email Address</label>
                <p className="text-sm font-medium text-gray-900">{order.vendorEmail}</p>
              </div>
            </div>

            <h2 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Product Name</label>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-900">Quantity/Stock:</span>
                    <span className="text-sm font-medium text-gray-900">{order.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-900">Amount:</span>
                    <span className="text-sm font-medium text-gray-900">{order.amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-900">Delivery Fee:</span>
                    <span className="text-sm font-medium text-gray-900">{order.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm font-semibold text-gray-900">Total Amount:</span>
                    <span className="text-sm font-bold text-gray-900">{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-sm font-semibold text-gray-900 mb-3">Order Tracking Status</h2>
            <div className="mb-6">
              <div className="space-y-4">
                {trackingSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          step.active
                            ? 'bg-system-blue-light'
                            : 'border-2 border-gray-300 bg-white'
                        }`}
                      >
                        {step.active && (
                          <div className="w-3 h-3 rounded-full bg-white"></div>
                        )}
                      </div>
                      {idx < 3 && (
                        <div
                          className={`w-0.5 h-8 ${
                            idx < 1 ? 'bg-system-blue-light' : 'bg-gray-300'
                          }`}
                        ></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{step.label}</p>
                      <p className="text-xs text-gray-600">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-4 py-3 border border-red-300 text-red-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option>Cancel Order</option>
                <option>Process Order</option>
                <option>Complete Order</option>
              </select>

              <textarea
                placeholder="Reason for action..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light min-h-[80px] resize-none"
              />

              <button className="w-full py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send
              </button>

              <button className="w-full py-3 bg-system-blue-light text-white rounded-lg text-sm font-medium hover:bg-[#020360] transition-colors">
                Confirm Action
              </button>

              <button
                onClick={() => router.back()}
                className="w-full py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
