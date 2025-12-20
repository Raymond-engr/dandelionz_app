'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const mockPayouts = [
  { id: '1', name: 'Vendor Name', amount: '₦0.00' },
];

export default function PayoutPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('paid');

  const handlePayoutClick = (payoutId: string) => {
    router.push(`/admin/account/settlements/payout/${payoutId}`);
  };

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-[#030482]">Payout</h1>
        </div>

        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('paid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'paid'
                  ? 'bg-blue-100 text-[#030482]'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Paid
            </button>
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
          </div>

          <div className="space-y-3">
            {activeTab === 'paid' && mockPayouts.map((payout) => (
              <button
                key={payout.id}
                onClick={() => handlePayoutClick(payout.id)}
                className="w-full bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      VN
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{payout.name}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    Paid
                  </span>
                </div>
              </button>
            ))}

            {activeTab === 'pending' && mockPayouts.map((payout) => (
              <button
                key={payout.id}
                onClick={() => handlePayoutClick(payout.id)}
                className="w-full bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      VN
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{payout.name}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                    Pending
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}