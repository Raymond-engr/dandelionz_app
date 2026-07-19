'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useInitializeWalletDepositMutation } from '@/lib/api/customerApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { apiError } from '@/lib/utils';
import { MIN_DEPOSIT, MAX_DEPOSIT, isDepositAmountValid } from '@/lib/wallet';

const QUICK_PICKS = [1000, 2000, 5000, 10000];

export default function WalletDepositPage() {
  const router = useRouter();
  const [initializeDeposit, { isLoading }] = useInitializeWalletDepositMutation();

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const parsed = amount.trim() === '' ? NaN : Number(amount);
  const isValid = isDepositAmountValid(parsed);

  // Only nag once the user has actually typed something, so the field does not open in
  // an error state.
  const inlineError =
    amount.trim() === '' || isValid
      ? ''
      : !Number.isFinite(parsed)
        ? 'Enter a valid amount.'
        : parsed < MIN_DEPOSIT
          ? `The minimum top-up is ₦${MIN_DEPOSIT.toLocaleString()}.`
          : `The maximum top-up is ₦${MAX_DEPOSIT.toLocaleString()}.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValid) return;

    try {
      const res = await initializeDeposit({ amount: parsed }).unwrap();

      if (res.data?.authorization_url) {
        // Same handoff the checkout flow uses: leave the SPA entirely and let Paystack
        // own the page until it redirects back.
        window.location.href = res.data.authorization_url;
      } else {
        setError('Could not start the payment. Please try again.');
      }
    } catch (err: unknown) {
      setError(apiError(err, 'Could not start the payment. Please try again.'));
    }
  };

  return (
    <AppLayout showBottomNav={false} userRole="customer">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-system-blue-light p-6 text-white">
              <h1 className="text-xl font-bold mb-1">Fund Wallet</h1>
              <p className="text-white/80 text-sm">
                Top up with your card and pay faster at checkout
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="deposit-amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to Add (₦)
                </label>
                <input
                  id="deposit-amount"
                  type="number"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min={MIN_DEPOSIT}
                  max={MAX_DEPOSIT}
                  aria-invalid={Boolean(inlineError)}
                  aria-describedby={inlineError ? 'deposit-amount-error' : undefined}
                  className="w-full p-3 text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-system-blue focus:border-system-blue"
                />
                {inlineError ? (
                  <p id="deposit-amount-error" className="mt-2 text-sm text-red-600">
                    {inlineError}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    Min ₦{MIN_DEPOSIT.toLocaleString()} &middot; Max ₦{MAX_DEPOSIT.toLocaleString()}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Quick add</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {QUICK_PICKS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setAmount(String(value));
                        setError('');
                      }}
                      className={`py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                        parsed === value
                          ? 'border-system-blue-light bg-system-blue-light text-white'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      ₦{value.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* The one thing customers must not misunderstand about topping up. */}
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-amber-800">
                  Money you add here is <span className="font-semibold">spendable at checkout only</span>.
                  It cannot be withdrawn to a bank account. Only refunds and earnings can be
                  withdrawn.
                </p>
              </div>

              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full py-4 bg-system-blue-light text-white font-bold rounded-xl hover:bg-[#020360] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex justify-center items-center"
              >
                {isLoading ? <LoadingSpinner /> : 'Continue to Payment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
