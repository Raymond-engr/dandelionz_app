'use client';

import React, { useState, use, useEffect } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetUserDetailsQuery, useUpdateUserStatusMutation } from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { apiError } from '@/lib/utils';

interface UserDetailsProps {
  params: Promise<{ id: string }>;
}

export default function UserDetails({ params }: UserDetailsProps) {
  const { id } = use(params);
  const router = useRouter();
  const [action, setAction] = useState<'suspend' | 'activate'>('suspend');
  const [reason, setReason] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const userId = id;

  const { data: userData, isLoading, error, refetch } = useGetUserDetailsQuery(userId);
  const [updateUserStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();

  const user = userData?.data;

  // Set default action based on user status
  useEffect(() => {
    if (user) {
      setAction(user.status === 'ACTIVE' ? 'suspend' : 'activate');
    }
  }, [user]);

  const handleAction = async () => {
    if (!user) return;

    try {
      const response = await updateUserStatus({ uuid: user.uuid, action, reason }).unwrap();
      setSuccessMessage(response.message || `User successfully ${action === 'suspend' ? 'suspended' : 'activated'}`);
      setShowSuccess(true);
      setReason('');
      
      setTimeout(() => {
        setShowSuccess(false);
        refetch();
      }, 2000);
    } catch (err: any) {
      toast.error(apiError(err, 'Failed to update user status'));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner fullScreen />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Failed to load user details.</p>
        <button onClick={() => router.back()} className="px-4 py-2 bg-system-blue-light text-white rounded-lg">
          Go Back
        </button>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900">{successMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[600px] bg-white relative">
        <div className="min-h-screen bg-white pb-6">
          <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
            <button onClick={() => router.back()} className="absolute left-4">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-lg font-semibold text-system-blue-light">User Details</h1>
          </div>

          <div className="p-4">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                {user.full_name ? user.full_name.split(' ').map((n: string) => n[0]).join('') : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900">{user.full_name || 'Unnamed User'}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.status === 'ACTIVE' ? 'Active' : 'Suspended'}
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-700">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-700 mb-1">Total Spend</p>
                <p className="text-xl font-bold text-gray-900">₦{parseFloat(user.total_spend || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-gray-700 mb-1">Total Order</p>
                <p className="text-xl font-bold text-gray-900">{user.total_orders || '0'}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">Personal Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block">Full Name</label>
                  <p className="text-sm font-medium text-gray-900">{user.full_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block">Email Address</label>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block">Phone Number</label>
                  <p className="text-sm font-medium text-gray-900">{user.phone_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block">Registration Date</label>
                  <p className="text-sm font-medium text-gray-900">{user.created_at ? format(new Date(user.created_at), 'PPP') : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* User Account Actions */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Account Management</h3>
              
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-3 font-medium">
                  {user.status === 'ACTIVE' 
                    ? "Suspending this user will prevent them from logging in and performing any activities." 
                    : "Activating this user will restore their access to the platform."}
                </p>
                
                <textarea
                  placeholder="Provide a reason for this action..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light min-h-[80px] resize-none mb-3 bg-white"
                />

                <button 
                  onClick={handleAction}
                  className={`w-full py-3 text-white rounded-lg text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 ${
                    user.status === 'ACTIVE' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                  disabled={isUpdating || !reason.trim()}
                >
                  {isUpdating ? 'Processing...' : (user.status === 'ACTIVE' ? 'Suspend User' : 'Activate User')}
                </button>
                {!reason.trim() && (
                  <p className="text-[10px] text-red-500 mt-1">* Please provide a reason to enable action</p>
                )}
              </div>
            </div>

            {/* Suspension History */}
            {Array.isArray(user.suspension_history) && user.suspension_history.length > 0 && (
              <div className="mt-8 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Activity History</h3>
                <div className="space-y-4">
                  {user.suspension_history.map((history: any) => (
                    <div key={history.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          history.action === 'SUSPEND' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {history.action}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {history.created_at ? format(new Date(history.created_at), 'MMM d, yyyy HH:mm') : 'N/A'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 mb-2 font-medium">"{history.reason}"</p>
                      <p className="text-[10px] text-gray-500">
                        Admin: <span className="text-gray-700 font-medium">{history.admin_email}</span>
                      </p>
                    </div>
                  )).reverse()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
