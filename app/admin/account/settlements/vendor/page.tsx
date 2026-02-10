'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useGetAllWithdrawalsQuery } from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { format } from 'date-fns';

export default function VendorSettlementsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'successful' | 'pending' | 'failed'>('successful');
  const { data, isLoading } = useGetAllWithdrawalsQuery({ 
    status: activeTab,
    type: 'vendor'
  });

  const withdrawals = data?.data || [];

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-[#030482]">Vendor Settlements</h1>
        </div>

        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('successful')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'successful'
                  ? 'bg-blue-100 text-[#030482]'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Successful
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'bg-blue-100 text-[#030482]'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('failed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'failed'
                  ? 'bg-blue-100 text-[#030482]'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Failed
            </button>
          </div>

          <div className="space-y-3">
            {isLoading ? (
               <div className="flex justify-center py-10">
                 <LoadingSpinner />
               </div>
            ) : withdrawals.length === 0 ? (
               <div className="text-center text-gray-500 py-10">No {activeTab} withdrawals found.</div>
            ) : (
               withdrawals.map((withdrawal) => (
                  <div 
                    key={withdrawal.id} 
                    className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => router.push(`/admin/account/settlements/vendor/${withdrawal.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {withdrawal.requestor_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{withdrawal.requestor_name}</p>
                          <p className="text-xs text-gray-600">{format(new Date(withdrawal.created_at), 'MMM do, yyyy')}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-1">{withdrawal.reference}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-gray-900">₦{parseFloat(withdrawal.amount).toLocaleString()}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded capitalize ${
                            activeTab === 'successful' ? 'bg-green-100 text-green-700' : 
                            activeTab === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                          {withdrawal.status}
                        </span>
                      </div>
                    </div>
                    {activeTab === 'failed' && (
                        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                          Reason: {withdrawal.failure_reason || 'Unknown error'}
                        </div>
                    )}
                  </div>
               ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}