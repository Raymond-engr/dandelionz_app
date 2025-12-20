'use client';

import React, { useState, use } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface RefundDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function RefundDetailsPage({ params: paramsPromise }: RefundDetailsPageProps) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [action, setAction] = useState('Reject Refund');
  const [reason, setReason] = useState('');

  const disputeId = params.id;

  // Mock dispute data
  const dispute = {
    orderId: 'Order ID',
    customer: 'Customer Name',
    vendor: 'Vendor Name',
    amount: '₦0.00',
    date: 'Order Date',
    comment: 'Full complaint on the product goes here...',
    product: {
      name: 'Product Name',
      description: 'Product description goes here...',
      price: '₦0.00',
      category: 'Category Name',
      stock: '0 Units',
      uploadDate: '11th Nov 2025',
    },
  };

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white pb-6">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-[#030482]">Refund Details</h1>
        </div>

        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Product Information</h2>

          <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2"></div>
              <p className="text-xs text-gray-500">Product image will<br />appear here</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div>
              <p className="text-xl font-bold text-gray-900">{dispute.product.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">{dispute.product.description}</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{dispute.product.price}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-900 block mb-1">Category:</label>
                <p className="text-sm text-gray-900">{dispute.product.category}</p>
              </div>
              <div>
                <label className="text-sm text-gray-900 block mb-1">Stock:</label>
                <p className="text-sm text-gray-900">{dispute.product.stock}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-900 block mb-1">Order Date:</label>
                <p className="text-sm text-gray-900">{dispute.product.uploadDate}</p>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-900 block mb-1">Amount Eligible for Refund</label>
              <p className="text-lg font-bold text-gray-900">{dispute.amount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">{dispute.comment}</p>
            </div>
          </div>

          <div className="space-y-3">
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030482]"
            >
              <option>Reject Refund</option>
              <option>Approve Refund</option>
            </select>

            <textarea
              placeholder="Reason for action..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030482] min-h-[80px] resize-none"
            />

            <button className="w-full py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send
            </button>

            <button className="w-full py-3 bg-[#030482] text-white rounded-lg text-sm font-medium hover:bg-[#020360] transition-colors">
              Confirm Action
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}