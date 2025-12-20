'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function SummaryPage() {
  const router = useRouter();

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-[#030482]">Summary</h1>
        </div>

        <div className="p-4 space-y-3">
          <div className="bg-[#030482] text-white rounded-lg p-6">
            <p className="text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold">₦0.00</p>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <p className="text-sm text-gray-700 mb-2">Total Payouts</p>
            <p className="text-3xl font-bold text-gray-900">₦0.00</p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6">
            <p className="text-sm text-gray-700 mb-2">Pending Settlements</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <p className="text-sm text-gray-700 mb-2">Upcoming Payouts</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}