'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

type WalletStep = 'main' | 'withdraw' | 'pin' | 'summary' | 'success' | 'receipt' | 'export';

export default function VendorWalletPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WalletStep>('main');
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'image'>('pdf');
  const [withdrawData, setWithdrawData] = useState({
    amount: '0.00',
    accountNumber: '',
    bankName: '',
    accountName: ''
  });

  const walletStats = {
    withdrawable: 0.00,
    available: 0.00,
    totalEarnings: 0.00,
    totalWithdrawals: 0,
    thisMonth: 0.00
  };

  const handlePinInput = (index: number, value: string, isConfirm: boolean = false) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      if (isConfirm) {
        const newPin = [...confirmPin];
        newPin[index] = value;
        setConfirmPin(newPin);
        if (value && index < 3) {
          document.getElementById(`confirm-pin-${index + 1}`)?.focus();
        }
      } else {
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);
        if (value && index < 3) {
          document.getElementById(`pin-${index + 1}`)?.focus();
        }
      }
    }
  };

  const handleWithdraw = () => {
    setCurrentStep('summary');
  };

  const handleConfirm = () => {
    setCurrentStep('success');
  };

  const handleViewReceipt = () => {
    setCurrentStep('receipt');
  };

  const handleExport = () => {
    console.log('Exporting as:', exportFormat);
    setCurrentStep('receipt');
  };

  if (currentStep === 'main') {
    return (
      <AppLayout showBottomNav={true} userRole="vendor">
        <div className="min-h-screen bg-white">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Wallet</h1>
            <p className="text-sm text-gray-600 mb-6">
              Manage your earnings and withdrawals
            </p>

            {/* Withdrawable Amount Card */}
            <div className="bg-system-blue-light rounded-lg p-6 mb-6">
              <p className="text-white text-sm mb-2">Withdrawable Amount</p>
              <p className="text-white text-4xl font-bold mb-4">
                ₦{walletStats.withdrawable.toFixed(2)}
              </p>
              <button
                onClick={() => setCurrentStep('withdraw')}
                className="flex items-center justify-center gap-2 w-full py-3 bg-white text-system-blue-light rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Withdraw Earnings
              </button>
            </div>

            {/* Overview Stats */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Overview</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Available Balance</p>
                  <p className="text-xl font-bold text-gray-900">
                    ₦{walletStats.available.toFixed(2)}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-xl font-bold text-gray-900">
                    ₦{walletStats.totalEarnings.toFixed(2)}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Total Withdrawals</p>
                  <p className="text-xl font-bold text-gray-900">
                    {walletStats.totalWithdrawals}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">This Month</p>
                  <p className="text-xl font-bold text-gray-900">
                    ₦{walletStats.thisMonth.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (currentStep === 'withdraw') {
    return (
      <AppLayout showBottomNav={false} userRole="vendor">
        <div className="min-h-screen bg-white">
          <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
            <button onClick={() => setCurrentStep('main')} className="absolute left-4 p-2 -ml-2">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-system-blue-light">Withdraw Earnings</h1>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">
                Withdrawable Amount
              </label>
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
              onClick={() => setCurrentStep('pin')}
              className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Proceed
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (currentStep === 'pin') {
    return (
      <AppLayout showBottomNav={false} userRole="vendor">
        <div className="min-h-screen bg-white">
          <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
            <button onClick={() => setCurrentStep('withdraw')} className="absolute left-4 p-2 -ml-2">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-system-blue-light">Create Payment PIN</h1>
          </div>

          <div className="p-6 space-y-8">
            <div>
              <label className="text-sm font-medium text-gray-900 mb-4 block">Enter PIN</label>
              <div className="flex gap-3 justify-center">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinInput(index, e.target.value)}
                    className="w-16 h-16 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-system-blue-light"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 mb-4 block">Confirm PIN</label>
              <div className="flex gap-3 justify-center">
                {confirmPin.map((digit, index) => (
                  <input
                    key={index}
                    id={`confirm-pin-${index}`}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinInput(index, e.target.value, true)}
                    className="w-16 h-16 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-system-blue-light"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleWithdraw}
              className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Withdraw
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (currentStep === 'summary') {
    return (
      <AppLayout showBottomNav={false} userRole="vendor">
        <div className="min-h-screen bg-white">
          <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
            <button onClick={() => setCurrentStep('pin')} className="absolute left-4 p-2 -ml-2">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-system-blue-light">Summary</h1>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4 border-b border-gray-200 pb-6">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-sm font-semibold text-gray-900">₦ 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fee</span>
                <span className="text-sm font-semibold text-gray-900">₦ 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount Paid</span>
                <span className="text-sm font-semibold text-gray-900">₦ 0.00</span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Withdrawal Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Receiver Name</span>
                  <span className="text-sm font-medium text-gray-900 text-right">
                    BANK ACCOUNT NAME GOES HERE
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Receiver Details</span>
                  <span className="text-sm font-medium text-gray-900">ACCOUNT NUMBER</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transaction Date</span>
                  <span className="text-sm font-medium text-gray-900">Nov 11th, 2025 18:03:50</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (currentStep === 'success') {
    return (
      <AppLayout showBottomNav={false} userRole="vendor">
        <div className="min-h-screen bg-white flex flex-col">
          <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
            <button onClick={() => setCurrentStep('main')} className="absolute left-4 p-2 -ml-2">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-system-blue-light">Payment</h1>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-32 h-32 bg-system-blue-light rounded-full flex items-center justify-center mb-8">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-system-blue-light mb-12">
              Withdrawal Successful
            </h2>

            <div className="w-full max-w-sm space-y-4">
              <button
                onClick={() => setCurrentStep('main')}
                className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
              >
                Go Home
              </button>
              <button
                onClick={handleViewReceipt}
                className="w-full py-3.5 bg-white text-gray-900 border-b border-gray-300 font-medium hover:bg-gray-50 transition-colors"
              >
                View E-Receipt
              </button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (currentStep === 'receipt') {
    return (
      <AppLayout showBottomNav={false} userRole="vendor">
        <div className="min-h-screen bg-white">
          <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
            <button onClick={() => setCurrentStep('success')} className="absolute left-4 p-2 -ml-2">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-system-blue-light">Receipt</h1>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4 border-b border-gray-200 pb-6">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-sm font-semibold text-gray-900">₦ 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fee</span>
                <span className="text-sm font-semibold text-gray-900">₦ 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount Paid</span>
                <span className="text-sm font-semibold text-gray-900">₦ 0.00</span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Withdrawal Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Receiver Name</span>
                  <span className="text-sm font-medium text-gray-900 text-right">
                    BANK ACCOUNT NAME GOES HERE
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Receiver Details</span>
                  <span className="text-sm font-medium text-gray-900">ACCOUNT NUMBER</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transaction Date</span>
                  <span className="text-sm font-medium text-gray-900">Nov 11th, 2025 18:03:50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sender Details</span>
                  <span className="text-sm font-medium text-gray-900">DANDELIONZ</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep('export')}
              className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Export Receipt
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (currentStep === 'export') {
    return (
      <AppLayout showBottomNav={false} userRole="vendor">
        <div className="min-h-screen bg-white">
          <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
            <button onClick={() => setCurrentStep('receipt')} className="absolute left-4 p-2 -ml-2">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-system-blue-light">Export Receipt</h1>
          </div>

          <div className="p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-6">SAVE AS</h2>

            <div className="space-y-3 mb-8">
              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50">
                <div className="relative">
                  <input
                    type="radio"
                    name="format"
                    checked={exportFormat === 'pdf'}
                    onChange={() => setExportFormat('pdf')}
                    className="sr-only peer"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    exportFormat === 'pdf' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                  }`}>
                    {exportFormat === 'pdf' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">PDF</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50">
                <div className="relative">
                  <input
                    type="radio"
                    name="format"
                    checked={exportFormat === 'image'}
                    onChange={() => setExportFormat('image')}
                    className="sr-only peer"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    exportFormat === 'image' ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                  }`}>
                    {exportFormat === 'image' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">Image</span>
              </label>
            </div>

            <button
              onClick={handleExport}
              className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Export
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return null;
}