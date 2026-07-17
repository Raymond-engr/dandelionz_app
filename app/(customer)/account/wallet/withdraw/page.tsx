'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  useGetCustomerWalletQuery, 
  useRequestCustomerWithdrawalMutation 
} from '@/lib/api/customerApi';
import { useGetBanksQuery, useVerifyBankAccountMutation } from '@/lib/api/vendorApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { apiError } from '@/lib/utils';

export default function CustomerWithdrawalPage() {
  const router = useRouter();
  
  const { data: walletData, isLoading: walletLoading } = useGetCustomerWalletQuery();
  const { data: banksData, isLoading: banksLoading } = useGetBanksQuery();
  const [verifyAccount, { isLoading: verifyingAccount }] = useVerifyBankAccountMutation();
  const [requestWithdrawal, { isLoading: withdrawing }] = useRequestCustomerWithdrawalMutation();

  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const stats = walletData?.data;
  const banks = banksData?.data || [];
  
  const selectedBank = banks.find(b => b.code === bankCode);

  // Auto-verify account number when 10 digits are entered
  useEffect(() => {
    if (accountNumber.length === 10 && bankCode) {
      handleVerifyAccount();
    } else {
      setAccountName('');
    }
  }, [accountNumber, bankCode]);

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

  const handleVerifyAccount = async () => {
    try {
      const res = await verifyAccount({ account_number: accountNumber, bank_code: bankCode }).unwrap();
      if (res.success && res.data.account_name) {
        setAccountName(res.data.account_name);
        setError('');
      }
    } catch (err: any) {
      setAccountName('');
      setError('Could not verify account details. Please check the number and bank.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!accountName) {
      return setError('Please wait for account verification.');
    }
    if (!amount || parseFloat(amount) <= 0) {
      return setError('Please enter a valid amount.');
    }
    if (stats?.balance && parseFloat(amount) > stats.balance) {
      return setError('Insufficient balance.');
    }
    if (!pin || pin.length !== 4) {
      return setError('Please enter your 4-digit PIN.');
    }

    try {
      const res = await requestWithdrawal({
        amount: parseFloat(amount),
        pin,
        bank_name: selectedBank?.name || '',
        bank_code: bankCode,
        account_number: accountNumber,
        account_name: accountName
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
                <p className="text-sm text-white/80 mb-1">Available Balance</p>
                {walletLoading ? (
                  <div className="h-8 w-32 bg-white/20 animate-pulse rounded"></div>
                ) : (
                  <p className="text-2xl font-bold">₦{(stats?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Bank</label>
                  <select
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-system-blue focus:border-system-blue"
                    required
                  >
                    <option value="">Select a bank</option>
                    {banks.map(b => (
                      <option key={b.code} value={b.code}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit account number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-system-blue focus:border-system-blue"
                    required
                  />
                </div>

                {verifyingAccount && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <LoadingSpinner /> Verifying account...
                  </div>
                )}
                
                {accountName && !verifyingAccount && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-xs text-green-600 mb-1">Verified Account Name</p>
                    <p className="text-sm font-bold text-green-900">{accountName}</p>
                  </div>
                )}
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
                  min="100"
                  max={stats?.balance || 0}
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
                disabled={withdrawing || !accountName}
                className="w-full py-4 bg-system-blue-light text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 mt-4 flex justify-center items-center"
              >
                {withdrawing ? <LoadingSpinner /> : 'Withdraw Funds'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
