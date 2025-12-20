'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const mockDisputes = [
  {
    id: '1',
    orderId: 'Order ID',
    customer: 'Customer Name',
    vendor: 'Vendor Name',
    date: 'Order Date',
    amount: '₦0.00',
    comment: 'Comment on the product.....',
  },
];

export default function DisputesRefundsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending');

  const handleDisputeClick = (disputeId: string) => {
    router.push(`/admin/account/settlements/disputes/${disputeId}`);
  };

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-[#030482]">Disputes & Refunds</h1>
        </div>

        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'bg-blue-100 text-[#030482]'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'approved'
                  ? 'bg-blue-100 text-[#030482]'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'rejected'
                  ? 'bg-blue-100 text-[#030482]'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Rejected
            </button>
          </div>

          <div className="space-y-3">
            {mockDisputes.map((dispute) => (
              <button
                key={dispute.id}
                onClick={() => handleDisputeClick(dispute.id)}
                className="w-full bg-gray-50 rounded-lg p-4 text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{dispute.orderId}</p>
                    <p className="text-xs text-gray-600">{dispute.customer}</p>
                    <p className="text-xs text-gray-600">{dispute.vendor}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                      Pending
                    </span>
                    <p className="text-base font-bold text-gray-900 mt-1">{dispute.amount}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">{dispute.date}</p>
                <p className="text-xs text-gray-600 italic">{dispute.comment}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}