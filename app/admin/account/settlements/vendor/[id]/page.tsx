'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Banknote, User, Hash, Calendar, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { 
  useGetWithdrawalDetailQuery, 
  useApproveWithdrawalMutation, 
  useRejectWithdrawalMutation 
} from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function WithdrawalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useGetWithdrawalDetailQuery(id);
  const [approveWithdrawal, { isLoading: isApproving }] = useApproveWithdrawalMutation();
  const [rejectWithdrawal, { isLoading: isRejecting }] = useRejectWithdrawalMutation();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const withdrawal = data?.data;

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this withdrawal?')) return;

    try {
      const res = await approveWithdrawal({ withdrawal_id: id }).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.back();
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to approve withdrawal');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      const res = await rejectWithdrawal({ 
        withdrawal_id: id, 
        reason: rejectReason 
      }).unwrap();
      if (res.success) {
        toast.success(res.message);
        setShowRejectModal(false);
        router.back();
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to reject withdrawal');
    }
  };

  if (isLoading) {
    return (
      <AppLayout showBottomNav={false} userRole="admin">
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  if (error || !withdrawal) {
    return (
      <AppLayout showBottomNav={false} userRole="admin">
        <div className="min-h-screen p-4 flex flex-col items-center justify-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
          <p className="text-gray-900 font-medium">Withdrawal not found</p>
          <button onClick={() => router.back()} className="mt-4 text-system-blue-light font-medium">
            Go Back
          </button>
        </div>
      </AppLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-[#030482]">Withdrawal Detail</h1>
        </div>

        <div className="p-4 space-y-4">
          {/* Status Banner */}
          <div className={`p-4 rounded-xl flex items-center justify-between ${getStatusColor(withdrawal.status)}`}>
            <div className="flex items-center gap-3">
              {withdrawal.status === 'successful' ? <CheckCircle className="w-5 h-5" /> : 
               withdrawal.status === 'failed' ? <XCircle className="w-5 h-5" /> : 
               <AlertCircle className="w-5 h-5" />}
              <span className="font-semibold capitalize">{withdrawal.status}</span>
            </div>
            <span className="text-xs font-mono">{withdrawal.reference}</span>
          </div>

          {/* Amount Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-1">Requested Amount</p>
            <h2 className="text-3xl font-bold text-gray-900">₦{parseFloat(withdrawal.amount).toLocaleString()}</h2>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              {format(new Date(withdrawal.created_at), 'MMMM do, yyyy • HH:mm')}
            </div>
          </div>

          {/* Recipient Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Recipient Information
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Name</span>
                <span className="text-sm font-medium text-gray-900">{withdrawal.requestor_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-medium text-gray-900">{withdrawal.requestor_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Type</span>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] uppercase">
                  {withdrawal.requestor_type}
                </span>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Banknote className="w-4 h-4 text-green-600" />
                Bank Account
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Bank Name</span>
                <span className="text-sm font-medium text-gray-900">{withdrawal.bank_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Account Number</span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-gray-400" />
                  {withdrawal.account_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Account Name</span>
                <span className="text-sm font-medium text-gray-900">{withdrawal.account_name}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {withdrawal.status === 'pending' && (
            <div className="pt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={isApproving || isRejecting}
                className="py-3 px-4 bg-white border border-red-200 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
                className="py-3 px-4 bg-system-blue-light text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isApproving ? 'Approving...' : 'Approve'}
              </button>
            </div>
          )}

          {withdrawal.failure_reason && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-xs text-red-500 mb-1 font-semibold uppercase">Rejection Reason</p>
              <p className="text-sm text-red-700">{withdrawal.failure_reason}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 animate-in slide-in-from-bottom duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Withdrawal</h3>
            <p className="text-sm text-gray-500 mb-4">Please provide a reason why this withdrawal is being rejected. This will be visible to the user.</p>
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Incorrect bank details provided."
              className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none mb-6"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-red-100"
              >
                {isRejecting ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}