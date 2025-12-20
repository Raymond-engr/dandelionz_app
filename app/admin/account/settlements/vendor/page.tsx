'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const mockVendors = [
  { id: '1', name: 'Vendor Name', date: 'Next Payout Date', amount: '₦0.00' },
];

export default function VendorSettlementsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('processed');

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-[#030482]">Vendor Settlements</h1>
        </div>

        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('processed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'processed'
                  ? 'bg-blue-100 text-[#030482]'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Processed
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
            <button
              onClick={() => setActiveTab('failed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'failed'
                  ? 'bg-blue-100 text-[#030482]'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Failed
            </button>
          </div>

          <div className="space-y-3">
            {activeTab === 'processed' && mockVendors.map((vendor) => (
              <div key={vendor.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      VN
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{vendor.name}</p>
                      <p className="text-xs text-gray-600">{vendor.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900">{vendor.amount}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                      Processed
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'pending' && mockVendors.map((vendor) => (
              <div key={vendor.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      VN
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{vendor.name}</p>
                      <p className="text-xs text-gray-600">{vendor.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900">{vendor.amount}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'failed' && mockVendors.map((vendor) => (
              <div key={vendor.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      VN
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{vendor.name}</p>
                      <p className="text-xs text-gray-600">{vendor.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900">{vendor.amount}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                      Failed
                    </span>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-purple-100 text-[#030482] rounded-lg text-sm font-semibold">
                  Initiate Payment
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}