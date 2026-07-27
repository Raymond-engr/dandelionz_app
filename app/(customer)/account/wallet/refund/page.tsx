'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import {
  useGetRefundableBalanceQuery,
  useRequestDepositRefundMutation,
} from '@/lib/api/customerApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { apiError } from '@/lib/utils';
import { isRefundAmountValid } from '@/lib/wallet';

/**
 * Returning deposited funds to the card that paid.
 *
 * This is the only way deposited money leaves the wallet without being spent — top-ups are
 * never withdrawable to a bank, which is what stops the wallet turning a stolen card into a
 * bank transfer. It is also the route out of a closure blocked by a deposited balance.
 */
export default function WalletRefundPage() {
  const router = useRouter();
  const { data, isLoading: isLoadingBalance } = useGetRefundableBalanceQuery();
  const [requestRefund, { isLoading: isSubmitting }] = useRequestDepositRefundMutation();

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const refundable = Number(data?.data?.refundable_amount ?? 0) || 0;
  const spendable = Number(data?.data?.spendable_balance ?? 0) || 0;
  const deposits = data?.data?.deposits ?? [];

  // The two can differ: a top-up with no recorded Paystack transaction id cannot go back
  // to source, so it counts towards the spendable balance but not towards this.
  const hasUnrefundable = spendable > refundable;

  const parsed = amount.trim() === '' ? NaN : Number(amount);
  const check = isRefundAmountValid(parsed, { refundable });
  const inlineError = amount.trim() === '' ? '' : check.reason ?? '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!check.valid) return;

    try {
      const res = await requestRefund({ amount: parsed }).unwrap();
      setSuccess(
        res.message ??
          'Refund requested. It will appear on your card in a few working days.'
      );
      setAmount('');
    } catch (err: unknown) {
      setError(apiError(err, 'Could not start the refund. Please try again.'));
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
              <h1 className="text-xl font-bold mb-1">Refund to Card</h1>
              <p className="text-white/80 text-sm">
                Send deposited funds back to the card you paid with
              </p>
            </div>

            {isLoadingBalance ? (
              <div className="p-10 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100">
                    {success}
                  </div>
                )}

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Available to refund</span>
                    <span className="text-lg font-bold text-system-blue-dark">
                      ₦{refundable.toLocaleString()}
                    </span>
                  </div>
                  {hasUnrefundable && (
                    <p className="mt-2 text-xs text-gray-500">
                      Your deposited balance is ₦{spendable.toLocaleString()}. The difference
                      is from older top-ups that can no longer be sent back to a card —
                      please contact support about those.
                    </p>
                  )}
                </div>

                {refundable <= 0 ? (
                  <div className="p-6 text-center">
                    <p className="font-semibold text-gray-700">Nothing to refund</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Only money you added yourself can go back to a card. Earnings and
                      refunds are withdrawn to your bank instead.
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label
                        htmlFor="refund-amount"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Amount to Refund (₦)
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="refund-amount"
                          type="number"
                          inputMode="numeric"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          max={refundable}
                          aria-invalid={Boolean(inlineError)}
                          aria-describedby={inlineError ? 'refund-amount-error' : undefined}
                          className="flex-1 p-3 text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-system-blue focus:border-system-blue"
                        />
                        <button
                          type="button"
                          onClick={() => setAmount(String(refundable))}
                          className="px-4 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          All
                        </button>
                      </div>
                      {inlineError ? (
                        <p id="refund-amount-error" className="mt-2 text-sm text-red-600">
                          {inlineError}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500">
                          Up to ₦{refundable.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {deposits.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Refunded from
                        </p>
                        <ul className="border border-gray-100 rounded-xl divide-y divide-gray-100">
                          {deposits.map((d) => (
                            <li
                              key={d.reference}
                              className="flex justify-between items-center px-4 py-2.5 text-sm"
                            >
                              <span className="text-gray-500">
                                {d.paid_at
                                  ? new Date(d.paid_at).toLocaleDateString()
                                  : d.reference}
                              </span>
                              <span className="font-semibold text-system-blue-dark">
                                ₦{Number(d.refundable_amount).toLocaleString()}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-2 text-xs text-gray-500">
                          Your most recent top-ups are used first.
                        </p>
                      </div>
                    )}

                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-blue-800">
                        The money goes back to the card you paid with — it cannot be sent to
                        a bank account. Your balance drops straight away, but your bank
                        usually takes a few working days to show it.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={!check.valid || isSubmitting}
                      className="w-full py-4 bg-system-blue-light text-white font-bold rounded-xl hover:bg-[#020360] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex justify-center items-center"
                    >
                      {isSubmitting ? <LoadingSpinner /> : 'Refund to Card'}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
