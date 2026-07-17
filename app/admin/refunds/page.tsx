'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useGetAdminRefundsQuery, useProcessAdminRefundMutation } from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { apiError } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function AdminRefundsPage() {
  const [filter, setFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | ''>('PENDING');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [approveModal, setApproveModal] = useState<{ id: number, customerName: string, amount: string } | null>(null);

  const { data, isLoading, refetch } = useGetAdminRefundsQuery(
    filter ? { status: filter } : undefined
  );
  const [processRefund, { isLoading: isProcessing }] = useProcessAdminRefundMutation();
  const refunds = data?.data || [];

  const confirmApprove = async () => {
    if (!approveModal) return;
    try {
      await processRefund({ refund_id: approveModal.id, action: 'APPROVE' }).unwrap();
      toast.success('Refund approved — customer wallet credited.');
      setApproveModal(null);
      refetch();
    } catch (err: any) {
      toast.error(apiError(err, 'Failed to approve refund.'));
    }
  };

  const handleReject = async (id: number) => {
    if (!rejectionReason.trim()) { toast.error('Please enter a rejection reason.'); return; }
    try {
      await processRefund({ refund_id: id, action: 'REJECT', rejection_reason: rejectionReason }).unwrap();
      toast.success('Refund rejected. Customer has been notified.');
      setRejectingId(null);
      setRejectionReason('');
      refetch();
    } catch (err: any) {
      toast.error(apiError(err, 'Failed to reject refund.'));
    }
  };

  return (
    <AppLayout showBottomNav={true} userRole="admin">
      <div className="min-h-screen bg-white pb-24">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Refund Requests</h1>
          {data?.pending_count ? (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {data.pending_count} pending
            </span>
          ) : null}
        </div>

        <div className="flex px-4 py-3 gap-2 overflow-x-auto no-scrollbar border-b border-gray-100">
          {(['PENDING', 'APPROVED', 'REJECTED', ''] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                filter === f ? 'bg-system-blue-light text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {f || 'ALL'}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="mt-20"><LoadingSpinner /></div>
        ) : (
          <div className="p-4 space-y-4">
            {refunds.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No refunds found.</div>
            ) : (
              refunds.map((item: any) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-900">#{item.order_id.slice(0, 8)}</p>
                      <p className="text-xs text-gray-500">{item.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_STYLES[item.status]}`}>
                        {item.status}
                      </span>
                      <p className="font-bold text-gray-900 mt-1">₦{parseFloat(item.amount).toLocaleString()}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mb-3 border-b border-gray-100 pb-2">
                    Requested: {new Date(item.created_at).toLocaleDateString()}
                  </p>

                  {item.status === 'PENDING' && (
                    rejectingId === item.id ? (
                      <div className="space-y-2 mt-2">
                        <textarea
                          placeholder="Reason for rejection..."
                          className="w-full text-sm border rounded p-2 outline-none"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button onClick={() => { setRejectingId(null); setRejectionReason(''); }} className="flex-1 py-2 text-sm text-gray-600 border rounded">Cancel</button>
                          <button onClick={() => handleReject(item.id)} disabled={isProcessing} className="flex-1 py-2 text-sm text-white bg-red-600 rounded font-medium">Confirm Reject</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setApproveModal({ id: item.id, customerName: item.customer_name, amount: item.amount })}
                          disabled={isProcessing}
                          className="flex-1 py-2 bg-green-50 text-green-600 rounded text-sm font-medium hover:bg-green-100 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button onClick={() => setRejectingId(item.id)} className="flex-1 py-2 text-sm text-red-600 border border-red-200 bg-red-50 rounded font-medium">Reject</button>
                      </div>
                    )
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Approve Confirmation Modal */}
      {approveModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 w-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Approve Refund?</h2>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Are you sure you want to approve the refund of <span className="font-semibold">₦{parseFloat(approveModal.amount).toLocaleString()}</span> for {approveModal.customerName}? This will credit their in-app wallet immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setApproveModal(null)}
                className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Yes, Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
