'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { 
  useGetCustomerWalletQuery, 
  useGetCustomerWalletTransactionsQuery 
} from '@/lib/api/customerApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { format } from 'date-fns';

export default function CustomerWalletPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
  
  const { data: walletData, isLoading: walletLoading } = useGetCustomerWalletQuery();
  const { data: txData, isLoading: txLoading } = useGetCustomerWalletTransactionsQuery(
    filter !== 'all' ? { type: filter } : {}
  );

  const stats = walletData?.data;
  const transactions = txData?.results || [];

  const spendable = Number(stats?.spendable_balance ?? 0);
  const withdrawable = Number(stats?.withdrawable_balance ?? 0);

  return (
    <AppLayout showBottomNav={true} userRole="customer">
      <div className="min-h-screen bg-white">
        <div className="p-4 max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900 mb-2">My Wallet</h1>
          <p className="text-sm text-gray-600 mb-6">Manage your refunds and balances</p>

          {/* Balance Card */}
          <div className="bg-system-blue-light rounded-xl p-6 mb-4 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-white/80 text-sm mb-2 font-medium">Total Balance</p>
              {walletLoading ? (
                <div className="h-10 w-48 bg-white/20 animate-pulse rounded-md mb-4"></div>
              ) : (
                <p className="text-white text-4xl font-bold mb-4">
                  ₦{(stats?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}

              {/* The two buckets behave differently, so never show only the total: deposits
                  are spendable but locked in, refunds and earnings can leave the platform. */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs text-white/70 mb-1">Spendable (deposits)</p>
                  {walletLoading ? (
                    <div className="h-6 w-20 bg-white/20 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-white text-lg font-bold">
                      ₦{spendable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  )}
                  <p className="text-[11px] text-white/70 mt-1 leading-snug">
                    Use at checkout &middot; cannot be withdrawn
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs text-white/70 mb-1">Withdrawable</p>
                  {walletLoading ? (
                    <div className="h-6 w-20 bg-white/20 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-white text-lg font-bold">
                      ₦{withdrawable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  )}
                  <p className="text-[11px] text-white/70 mt-1 leading-snug">
                    Refunds &amp; earnings &middot; can be cashed out
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => router.push('/account/wallet/deposit')}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-system-blue-light rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Fund Wallet
                </button>

                <button
                  onClick={() => router.push('/account/wallet/withdraw')}
                  // Gated on the withdrawable bucket, not the total: a wallet holding only
                  // deposits has money in it but nothing that can legally leave.
                  disabled={walletLoading || withdrawable <= 0}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-white/10 text-white border border-white/40 rounded-xl font-bold hover:bg-white/20 transition-colors disabled:opacity-50 disabled:hover:bg-white/10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Withdraw
                </button>
              </div>
            </div>
          </div>

          {/* Explain why the Withdraw CTA is dead while the wallet visibly has money in it. */}
          {!walletLoading && spendable > 0 && withdrawable <= 0 ? (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6 flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-800">
                Your balance is money you added yourself, so it can be spent at checkout but
                not withdrawn. Refunds and earnings are withdrawable.
              </p>
            </div>
          ) : !walletLoading && withdrawable > 0 ? (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6 flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-800">
                You have ₦{withdrawable.toLocaleString(undefined, { minimumFractionDigits: 2 })} from
                refunds or earnings. You can withdraw this to your bank account anytime.
              </p>
            </div>
          ) : null}

          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-green-50/50 border border-green-100 rounded-lg p-3">
              {/* total_credits now includes top-ups as well as refunds, so this can no
                  longer be labelled "Refunds". */}
              <p className="text-xs text-gray-500 mb-1">Total In (Refunds &amp; Top-ups)</p>
              <p className="text-lg font-bold text-gray-900">
                ₦{(stats?.total_credits || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-red-50/50 border border-red-100 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Total Out (Withdrawals)</p>
              <p className="text-lg font-bold text-gray-900">
                ₦{(stats?.total_debits || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Transactions Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-lg mb-4">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('credit')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'credit' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Credits
              </button>
              <button
                onClick={() => setFilter('debit')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'debit' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Debits
              </button>
            </div>

            {/* Transaction List */}
            {txLoading ? (
              <div className="py-8 flex justify-center"><LoadingSpinner /></div>
            ) : transactions.length === 0 ? (
              <div className="py-12 text-center bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-sm">No transactions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {tx.type === 'CREDIT' ? (
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16s-1 0-1-1V5.5C2 4.12 3.12 3 4.5 3h15C20.88 3 22 4.12 22 5.5v9c0 1.1-.9 2-2 2h-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16s-1 0-1-1V5.5C2 4.12 3.12 3 4.5 3h15C20.88 3 22 4.12 22 5.5v9c0 1.1-.9 2-2 2h-1m-4-8l4 4m0 0l-4 4m4-4H8" /></svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{tx.description || (tx.type === 'CREDIT' ? 'Refund Credit' : 'Withdrawal')}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {format(new Date(tx.created_at), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-gray-900'}`}>
                        {tx.type === 'CREDIT' ? '+' : '-'}₦{Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
