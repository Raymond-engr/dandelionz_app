'use client';

import React, { useState, use, useEffect } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetUserDetailsQuery, useUpdateUserStatusMutation } from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { format } from 'date-fns';

interface UserDetailsProps {
  params: { id: string };
}

export default function UserDetails({ params }: UserDetailsProps) {
  const router = useRouter();
  const [action, setAction] = useState<'suspend' | 'activate' | 'delete'>('suspend');
  const [reason, setReason] = useState('');

  const userId = params.id;

  const { data: userData, isLoading, error, refetch } = useGetUserDetailsQuery(userId);
  const [updateUserStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();

  const user = userData?.data;

  const handleAction = async () => {
    if (!user) return;

    if (action === 'delete') {
      // Implement delete logic, maybe with useDeleteUserMutation
      console.log('Delete action not implemented');
      return;
    }

    try {
      await updateUserStatus({ uuid: user.uuid, action, reason }).unwrap();
      setReason('');
      refetch(); // Refetch user data to show updated status
    } catch (err) {
      console.error('Failed to update user status:', err);
      // You can add a toast notification here to show the error
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
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
                {user.full_name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900">{user.full_name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className={`inline-block mt-1 px-3 py-1 text-xs rounded-full font-medium ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {user.is_active ? 'Active' : 'Suspended'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-700 mb-1">Total Spend</p>
                <p className="text-xl font-bold text-gray-900">₦{parseFloat(user.total_spend || '0').toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-gray-700 mb-1">Total Order</p>
                <p className="text-xl font-bold text-gray-900">{user.total_orders || '0'}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Full Name</label>
                <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Email Address</label>
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Phone Number</label>
                <p className="text-sm font-medium text-gray-900">{user.phone_number}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">State/Region</label>
                <p className="text-sm font-medium text-gray-900">{user.address || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Registration Date</label>
                <p className="text-sm font-medium text-gray-900">{format(new Date(user.created_at), 'PPP')}</p>
              </div>
            </div>

            <div className="space-y-3">
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as 'suspend' | 'activate' | 'delete')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              >
                <option value="suspend">Suspend User</option>
                <option value="activate">Activate User</option>
              </select>

              <textarea
                placeholder="Reason for action..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light min-h-[80px] resize-none"
                disabled={action === 'delete'}
              />

              <button 
                onClick={handleAction}
                className="w-full py-3 bg-system-blue-light text-white rounded-lg text-sm font-medium hover:bg-[#020360] transition-colors disabled:bg-gray-400"
                disabled={isUpdating || (action !== 'delete' && !reason)}
              >
                {isUpdating ? <LoadingSpinner /> : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
