'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetWalletBalanceQuery, useGetPaymentSettingsQuery } from '@/lib/api/vendorApi';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function WithdrawPage() {
  const router = useRouter();
  const { data: walletData, isLoading: isLoadingWallet, error: walletError } = useGetWalletBalanceQuery();
  const { data: paymentSettingsData, isLoading: isLoadingPayment, error: paymentError } = useGetPaymentSettingsQuery();

  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [localError, setLocalError] = useState<string>('');

  useEffect(() => {
    if (walletData?.data?.withdrawable_balance !== undefined) {
      setWithdrawAmount(walletData.data.withdrawable_balance.toFixed(2));
    }
    if (paymentSettingsData?.data) {
      setBankName(paymentSettingsData.data.bank_name || '');
      setAccountNumber(paymentSettingsData.data.account_number || '');
      setAccountName(paymentSettingsData.data.account_name || '');
    }
  }, [walletData, paymentSettingsData]);

  const handleProceed = () => {
    setLocalError('');
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setLocalError('Please enter a valid amount.');
      return;
    }
    if (!bankName || !accountNumber || !accountName) {
      setLocalError('Please ensure bank details are complete in Payment Settings.');
      return;
    }
    if (amount > (walletData?.data?.withdrawable_balance || 0)) {
        setLocalError('Amount exceeds withdrawable balance.');
        return;
    }

    const queryParams = new URLSearchParams({
      amount: withdrawAmount,
      bankName,
      accountNumber,
      accountName,
    }).toString();
    router.push(`/vendor/wallet/withdraw/confirm-pin?${queryParams}`);
  };

  const isLoading = isLoadingWallet || isLoadingPayment;
  const error = walletError || paymentError;

  if (isLoading) {
    return (
      <AppLayout showBottomNav={false} userRole="vendor">
        <LoadingSpinner fullScreen />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout showBottomNav={false} userRole="vendor">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">Failed to load withdrawal data.</p>
        </div>
      </AppLayout>
    );
  }

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
            {localError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{localError}</p>
                </div>
            )}
          <div>
            <label className="text-sm font-medium text-gray-900 mb-2 block">Withdrawable Amount</label>
            <input
              type="text"
              value={`₦ ${withdrawAmount}`}
              onChange={(e) => setWithdrawAmount(e.target.value.replace('₦ ', ''))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              disabled={isLoading}
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
                    value={accountNumber}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                    disabled
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 mb-2 block">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                    disabled
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 mb-2 block">Account Name</label>
                  <input
                    type="text"
                    value={accountName}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                    disabled
                  />
                </div>
                <Link href="/vendor/account/payment-settings/store-payment" className="text-system-blue-light text-sm font-medium">Edit Bank Details</Link>
              </div>
            </div>
          </div>

          <button
            onClick={handleProceed}
            disabled={isLoading || parseFloat(withdrawAmount) <= 0 || !paymentSettingsData?.data?.has_pin}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
          >
            Proceed
          </button>
          {!paymentSettingsData?.data?.has_pin && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex flex-col items-center">
                  <p className="text-sm text-blue-600 mb-3 text-center font-medium">Please set a payment PIN to proceed with withdrawal.</p>
                  <Link 
                    href="/vendor/account/payment-settings/change-pin" 
                    className="px-6 py-2 bg-system-blue-light text-white rounded-lg text-sm font-semibold shadow-sm"
                  >
                    Set Payment PIN
                  </Link>
              </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

