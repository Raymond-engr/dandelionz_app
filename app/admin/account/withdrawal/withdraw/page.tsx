'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useAdminRequestWithdrawalMutation, useGetWalletStatsQuery } from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { formatCurrency, apiError } from '@/lib/utils';

export default function WithdrawPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const { data: statsResponse } = useGetWalletStatsQuery();
  const [requestWithdrawal, { isLoading }] = useAdminRequestWithdrawalMutation();

  const walletStats = statsResponse?.data;

  const handlePinInput = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      if (value && index < 3) {
        document.getElementById(`pin-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`)?.focus();
    }
  };

  const MIN_WITHDRAWAL = 1000;

  const handleWithdraw = async () => {
    const pinStr = pin.join('');
    const withdrawAmount = parseFloat(amount);
    const availableBalance = parseFloat(walletStats?.withdrawable_balance?.toString() || "0");

    if (!amount || isNaN(withdrawAmount)) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (withdrawAmount < MIN_WITHDRAWAL) {
      toast.error(`Minimum withdrawal amount is ₦${formatCurrency(MIN_WITHDRAWAL)}`);
      return;
    }

    if (withdrawAmount > availableBalance) {
      toast.error("Insufficient withdrawable balance.");
      return;
    }

    if (pinStr.length < 4) {
      toast.error("Please enter your 4-digit PIN");
      return;
    }
    
    try {
      await requestWithdrawal({ amount, pin: pinStr }).unwrap();
      toast.success("Withdrawal initiated successfully!");
      router.push('/admin/account/withdrawal/success');
    } catch (err: any) {
      toast.error(apiError(err, "Failed to request withdrawal"));
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
          <div className="bg-system-blue-light text-white rounded-xl p-6 mb-8 shadow-lg shadow-blue-900/20">
            <p className="text-xs font-medium uppercase tracking-wider opacity-80 mb-1">Available Balance</p>
            <p className="text-3xl font-bold">₦{formatCurrency(walletStats?.withdrawable_balance)}</p>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 block mb-2">Amount to Withdraw (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-400 mt-2">Minimum withdrawal: ₦{formatCurrency(MIN_WITHDRAWAL)}</p>
          </div>

          <div className="mb-10">
            <label className="text-sm font-medium text-gray-700 block mb-4 text-center">Enter Payment PIN</label>
            <div className="flex gap-4 justify-center">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinInput(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-system-blue-light"
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={isLoading}
            className="w-full py-4 bg-system-blue-light text-white rounded-lg font-semibold hover:bg-[#020360] transition-colors disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Confirm Withdrawal'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}