'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useGetAllPaymentsQuery } from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { format } from 'date-fns';

export default function TransactionHistoryPage() {
  const router = useRouter();
  const { data, isLoading } = useGetAllPaymentsQuery();
  const transactions = data?.data || [];

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
          {isLoading ? (
             <div className="flex justify-center py-10">
               <LoadingSpinner />
             </div>
          ) : transactions.length === 0 ? (
             <div className="text-center text-gray-500 py-10">No transactions found.</div>
          ) : (
             transactions.map((transaction) => (
                <div key={transaction.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        CN
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{transaction.order_uuid}</p>
                        <p className="text-xs text-gray-600">{transaction.payment_method}</p>
                      </div>
                    </div>
                    <p className="text-base font-bold text-gray-900">₦{parseFloat(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className={`text-xs px-2 py-1 rounded ${transaction.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {transaction.status}
                     </span>
                     <p className="text-xs text-gray-500 text-right">{format(new Date(transaction.created_at), 'MMM do, yyyy')}</p>
                  </div>
                </div>
             ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
