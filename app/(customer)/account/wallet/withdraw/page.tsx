'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useGetCustomerWalletQuery,
  useRequestCustomerWithdrawalMutation,
  useGetCustomerPaymentSettingsQuery,
  hasCompletePayoutDetails,
} from '@/lib/api/customerApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { apiError } from '@/lib/utils';
import { MIN_WITHDRAWAL } from '@/lib/wallet';

export default function CustomerWithdrawalPage() {
  const router = useRouter();

  const { data: walletData, isLoading: walletLoading } = useGetCustomerWalletQuery();
  const { data: settingsData, isLoading: settingsLoading } = useGetCustomerPaymentSettingsQuery();
  const [requestWithdrawal, { isLoading: withdrawing }] = useRequestCustomerWithdrawalMutation();

  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const stats = walletData?.data;
  const settings = settingsData?.data;
  const payoutReady = hasCompletePayoutDetails(settings);
  // The server enforces the real minimum and reports it here; MIN_WITHDRAWAL is only the
  // value shown before the wallet response lands.
  const minWithdrawal = stats?.min_withdrawal ?? MIN_WITHDRAWAL;
  // Only the withdrawable bucket can leave the platform. `balance` also contains
  // deposits, which are spendable at checkout but never cashable out, so validating
  // against it would let the form accept an amount the server is bound to reject.
  const withdrawable = Number(stats?.withdrawable_balance ?? 0);

  // Effect 1: countdown only
  useEffect(() => {
    if (!success) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [success]);

  // Navigation fires when countdown reaches 0
  useEffect(() => {
    if (success && countdown === 0) {
      router.push('/account/wallet');
    }
  }, [countdown, success, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      return setError('Please enter a valid amount.');
    }
    if (parseFloat(amount) < minWithdrawal) {
      return setError(`The minimum withdrawal amount is ₦${minWithdrawal.toLocaleString()}.`);
    }
    if (parseFloat(amount) > withdrawable) {
      return setError('Insufficient withdrawable balance.');
    }
    if (!pin || pin.length !== 4) {
      return setError('Please enter your 4-digit PIN.');
    }

    try {
      const res = await requestWithdrawal({
        amount: parseFloat(amount),
        pin,
      }).unwrap();

      if (res.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(apiError(err, 'Failed to process withdrawal.'));
    }
  };

  if (success) {
    return (
      <AppLayout showBottomNav={false} userRole="customer">
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Withdrawal Initiated!</h2>
            <p className="text-gray-600 mb-6">Your funds are on the way to your bank account.</p>
            <p className="text-sm text-gray-400">Redirecting you back to wallet in {countdown}s...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={false} userRole="customer">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-xl mx-auto px-4">
          <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-system-blue-light p-6 text-white">
              <h1 className="text-xl font-bold mb-1">Withdraw to Bank</h1>
              <p className="text-white/80 text-sm">Transfer your refunded funds directly to your bank</p>

              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm text-white/80 mb-1">Withdrawable Balance</p>
                {walletLoading ? (
                  <div className="h-8 w-32 bg-white/20 animate-pulse rounded"></div>
                ) : (
                  <p className="text-2xl font-bold">₦{withdrawable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                )}
                <p className="text-xs text-white/70 mt-1">
                  Refunds &amp; earnings only. Wallet top-ups can be spent at checkout but
                  not withdrawn.
                </p>
              </div>
            </div>

            {settingsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : !payoutReady ? (
              <div className="p-6">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                  <div>
                    <p className="text-sm font-semibold text-amber-900 mb-1">Add your bank account first</p>
                    <p className="text-sm text-amber-800">
                      Add and verify your bank account in Payment Settings before withdrawing.
                    </p>
                  </div>
                </div>

                <Link
                  href="/account/payment-settings/store-payment"
                  className="mt-6 w-full py-4 bg-system-blue-light text-white font-bold rounded-xl hover:bg-[#020360] transition-colors flex justify-center items-center"
                >
                  Add Payout Details
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Saved destination account */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Withdrawing to</p>
                      <p className="text-sm font-bold text-gray-900">{settings?.account_name}</p>
                      <p className="text-sm text-gray-600">
                        {settings?.bank_name} &middot; {settings?.account_number}
                      </p>
                    </div>
                    <Link
                      href="/account/payment-settings/store-payment"
                      className="text-sm text-system-blue-light hover:underline shrink-0"
                    >
                      Change
                    </Link>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Withdraw (₦)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-3 text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-system-blue focus:border-system-blue"
                    required
                    min={minWithdrawal}
                    max={withdrawable}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">Payment PIN</label>
                  </div>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    className="w-full p-3 tracking-widest text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-system-blue focus:border-system-blue text-center"
                    required
                  />
                  <div className="mt-2 text-right">
                    <Link href="/account/wallet/set-pin" className="text-sm text-system-blue-light hover:underline">
                      Don&apos;t have a PIN? Set one here &rarr;
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={withdrawing}
                  className="w-full py-4 bg-system-blue-light text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 mt-4 flex justify-center items-center"
                >
                  {withdrawing ? <LoadingSpinner /> : 'Withdraw Funds'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
