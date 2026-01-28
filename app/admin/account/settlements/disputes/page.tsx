'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useGetAllDisputesQuery, useResolveDisputeMutation } from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function DisputesRefundsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const { data, isLoading } = useGetAllDisputesQuery({ status: activeTab.toUpperCase() });
  const [resolveDispute] = useResolveDisputeMutation();

  const disputes = data?.data || [];

  const handleResolve = async (id: string, action: 'APPROVE' | 'REJECT') => {
    if (confirm(`Are you sure you want to ${action.toLowerCase()} this dispute?`)) {
       try {
         await resolveDispute({ id, action, admin_note: `Admin ${action.toLowerCase()}d this dispute.` }).unwrap();
       } catch (error) {
         toast.error('Failed to update dispute status.');
       }
    }
  };

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-[#030482]">Disputes & Refunds</h1>
        </div>

        <div className="p-4">
          <div className="flex gap-2 mb-4">
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
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'approved'
                  ? 'bg-blue-100 text-[#030482]'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'rejected'
                  ? 'bg-blue-100 text-[#030482]'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Rejected
            </button>
          </div>

          <div className="space-y-3">
            {isLoading ? (
               <div className="flex justify-center py-10">
                 <LoadingSpinner />
               </div>
            ) : disputes.length === 0 ? (
               <div className="text-center text-gray-500 py-10">No {activeTab} disputes found.</div>
            ) : (
               disputes.map((dispute) => (
                  <div key={dispute.id} className="w-full bg-gray-50 rounded-lg p-4 text-left">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">Ord: {dispute.order_id}</p>
                        <p className="text-xs text-gray-600">Cust: {dispute.customer_name}</p>
                        <p className="text-xs text-gray-600">Vend: {dispute.vendor_name}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                            dispute.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                            dispute.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                          {dispute.status}
                        </span>
                        <p className="text-base font-bold text-gray-900 mt-1">₦{dispute.amount}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{format(new Date(dispute.created_at), 'MMM do, yyyy')}</p>
                    <p className="text-xs text-gray-600 italic mb-3">"{dispute.reason}"</p>
                    
                    {activeTab === 'pending' && (
                        <div className="flex gap-2 mt-2">
                           <button onClick={() => handleResolve(dispute.id, 'APPROVE')} className="flex-1 py-2 bg-green-600 text-white text-xs rounded-lg font-medium">Approve</button>
                           <button onClick={() => handleResolve(dispute.id, 'REJECT')} className="flex-1 py-2 bg-red-600 text-white text-xs rounded-lg font-medium">Reject</button>
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