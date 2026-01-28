'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useRequestWithdrawalMutation } from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function WithdrawPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [requestWithdrawal, { isLoading }] = useRequestWithdrawalMutation();

  const handleWithdraw = async () => {
    if (!amount || !pin) {
      toast.error("Please enter amount and PIN");
      return;
    }
    
    try {
      await requestWithdrawal({ amount, pin }).unwrap();
      toast.success("Withdrawal initiated successfully!");
      router.push('/admin/account/withdrawal');
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to request withdrawal");
    }
  };

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white">
         <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Withdraw Funds</h1>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 block mb-2">Amount to Withdraw (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              placeholder="0.00"
            />
          </div>

          <div className="mb-8">
            <label className="text-sm font-medium text-gray-700 block mb-2">Payment PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              placeholder="Enter 4-digit PIN"
            />
          </div>

          <button
            onClick={handleWithdraw}
            disabled={isLoading}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Confirm Withdrawal'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}