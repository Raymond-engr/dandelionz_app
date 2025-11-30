'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function WithdrawPage() {
  const router = useRouter();
  const [withdrawData, setWithdrawData] = useState({
    amount: '0.00',
    accountNumber: '',
    bankName: '',
    accountName: ''
  });

  return (
    <AppLayout showBottomNav={false} userRole="vendor">
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.push('/vendor/wallet')} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Withdraw Earnings</h1>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-900 mb-2 block">Withdrawable Amount</label>
            <input
              type="text"
              value={`₦ ${withdrawData.amount}`}
              onChange={(e) => setWithdrawData({...withdrawData, amount: e.target.value.replace('₦ ', '')})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
            />
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Payment Option</h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 mb-4">Bank Transfer</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-600 mb-2 block">Account Number</label>
                  <input
                    type="text"
                    value={withdrawData.accountNumber}
                    onChange={(e) => setWithdrawData({...withdrawData, accountNumber: e.target.value})}
                    placeholder="0011223344"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 mb-2 block">Bank Name</label>
                  <select
                    value={withdrawData.bankName}
                    onChange={(e) => setWithdrawData({...withdrawData, bankName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                  >
                    <option value="">United Bank for Africa PLC</option>
                    <option>Access Bank</option>
                    <option>GTBank</option>
                    <option>First Bank</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-600 mb-2 block">Account Name</label>
                  <input
                    type="text"
                    value={withdrawData.accountName}
                    onChange={(e) => setWithdrawData({...withdrawData, accountName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/vendor/wallet/pin')}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
          >
            Proceed
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
