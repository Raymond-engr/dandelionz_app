'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function AdminWithdrawalPage() {
  const router = useRouter();

  const walletStats = {
    withdrawable: 0.0,
    available: 0.0,
    totalEarnings: 0.0,
    totalWithdrawals: 0,
    thisMonth: 0.0
  };

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
                    <button onClick={() => router.back()} className="absolute left-4">
                      <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>
                    <h1 className="text-lg font-semibold text-system-blue-light">Withdraw Earnings</h1>
                  </div>
        <div className="p-4">

          {/* Withdrawable Amount Card */}
          <div className="bg-system-blue-light rounded-lg p-6 mb-6">
            <p className="text-white text-sm mb-2">Amount</p>
            <p className="text-white text-4xl font-bold mb-4">₦{walletStats.withdrawable.toFixed(2)}</p>
          </div>
            <button
              onClick={() => router.push('/admin/account/withdrawal/withdraw')}
              className="flex items-center justify-center gap-2 w-full py-3 bg-blue-50 text-system-blue-light rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Withdraw Earnings
            </button>
        </div>
      </div>
    </AppLayout>
  );
}