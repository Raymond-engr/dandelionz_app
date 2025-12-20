'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const mockTransactions = [
  { id: 'Order ID', customer: 'Customer Name', method: 'Payment Method', date: 'Payment Date', amount: '₦0.00' },
  { id: 'Order ID', customer: 'Customer Name', method: 'Payment Method', date: 'Payment Date', amount: '₦0.00' },
  { id: 'Order ID', customer: 'Customer Name', method: 'Payment Method', date: 'Payment Date', amount: '₦0.00' },
  { id: 'Order ID', customer: 'Customer Name', method: 'Payment Method', date: 'Payment Date', amount: '₦0.00' },
];

export default function TransactionHistoryPage() {
  const router = useRouter();

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-[#030482]">Transaction History</h1>
        </div>

        <div className="p-4 space-y-3">
          {mockTransactions.map((transaction, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    CN
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{transaction.id}</p>
                    <p className="text-xs text-gray-600">{transaction.customer}</p>
                    <p className="text-xs text-gray-600">{transaction.method}</p>
                  </div>
                </div>
                <p className="text-base font-bold text-gray-900">{transaction.amount}</p>
              </div>
              <p className="text-xs text-gray-500 text-right">{transaction.date}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
