'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useGetWalletBalanceQuery } from '@/lib/api/vendorApi';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function VendorWalletPage() {
  const router = useRouter();
  const { data: walletData, isLoading, error } = useGetWalletBalanceQuery();

  const stats = walletData?.data;

  if (error) {
    return (
      <AppLayout showBottomNav={true} userRole="vendor">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">Failed to load wallet data.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={true} userRole="vendor">
      <div className="min-h-screen bg-white">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Wallet</h1>
          <p className="text-sm text-gray-600 mb-6">Manage your earnings and withdrawals</p>

          {/* Withdrawable Amount Card */}
          <div className="bg-system-blue-light rounded-lg p-6 mb-6">
            <p className="text-white text-sm mb-2">Withdrawable Amount</p>
            {isLoading ? <div className="h-10 w-48 bg-blue-400 animate-pulse rounded-md mb-4"></div> : <p className="text-white text-4xl font-bold mb-4">₦{parseFloat(stats?.withdrawable_balance || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
            <button
              onClick={() => router.push('/vendor/wallet/withdraw')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full py-3 bg-white text-system-blue-light rounded-full font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Withdraw Earnings
            </button>
          </div>

          {/* Overview Stats */}
          {isLoading ? <LoadingSpinner /> : (
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Overview</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Available Balance</p>
                  <p className="text-xl font-bold text-gray-900">₦{parseFloat(stats?.available_balance || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-xl font-bold text-gray-900">₦{parseFloat(stats?.total_earnings || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Total Withdrawals</p>
                  <p className="text-xl font-bold text-gray-900">{stats?.total_withdrawals || 0}</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">This Month</p>
                  <p className="text-xl font-bold text-gray-900">₦{parseFloat(stats?.this_month_earnings || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}