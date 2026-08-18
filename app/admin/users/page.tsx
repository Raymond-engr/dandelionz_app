'use client';

import React from 'react';
import { Users, Filter } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useGetAllUsersQuery, useGetRefundFlagsQuery } from '@/lib/api/adminApi';
import { useInfiniteList, useInfiniteScrollTrigger, selectBareEnvelope } from '@/lib/hooks/use-infinite-list';
import UserListItemSkeleton from '@/components/UserListItemSkeleton';
import Skeleton from '@/components/ui/Skeleton';
import { User } from '@/lib/api/adminApi';

export default function UserManagement() {
  const router = useRouter();

  const {
    items: users,
    isInitialLoading: isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    error,
  } = useInfiniteList(useGetAllUsersQuery, {}, selectBareEnvelope<User>);
  const sentinelRef = useInfiniteScrollTrigger(loadMore, hasMore && !isFetchingMore);

  // Total/active/suspended used to be counted client-side over the fetched
  // array, which only worked because the whole (unpaginated) user list was
  // always in memory. Now that only one page is loaded at a time, those
  // counts need to come from the backend's `count` field instead - each a
  // cheap page_size=1 request, since DRF still returns the true total count
  // for the filter regardless of page size.
  const { data: totalResponse } = useGetAllUsersQuery({ page_size: 1 });
  const { data: activeResponse } = useGetAllUsersQuery({ status: 'ACTIVE', page_size: 1 });
  const totalUsers = totalResponse?.count ?? 0;
  const activeUsers = activeResponse?.count ?? 0;
  const suspendedUsers = Math.max(totalUsers - activeUsers, 0);

  const { data: refundFlagsData } = useGetRefundFlagsQuery();
  const flaggedCount = refundFlagsData?.data?.count ?? 0;

  const handleUserClick = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  return (
    <AppLayout showBottomNav={true} userRole="admin">
      <div className="min-h-screen bg-white pb-20">
        <div className="p-4 border-b border-gray-200 text-center">
          <h1 className="text-lg font-semibold text-gray-900">Users</h1>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Oversee users information, orders, and deactivate users account
          </p>

          <div className="bg-system-blue-light text-white rounded-lg p-4 mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Users</p>
              {isLoading ? <Skeleton className="h-9 w-16 bg-white/20" /> : <p className="text-3xl font-bold">{totalUsers}</p>}
            </div>
            <Users className="w-12 h-12 opacity-80" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-1">Active Users</p>
              {isLoading ? <Skeleton className="h-8 w-12 bg-green-200" /> : <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>}
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-1">Suspended Users</p>
              {isLoading ? <Skeleton className="h-8 w-12 bg-red-200" /> : <p className="text-2xl font-bold text-gray-900">{suspendedUsers}</p>}
            </div>
          </div>

          {/* Refund-abuse review queue summary (review-only, never a block) */}
          {flaggedCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-amber-800 mb-1">Refund flags need review</p>
              <p className="text-xs text-amber-700">
                {flaggedCount} customer{flaggedCount === 1 ? '' : 's'} refund an unusually high share of their orders.
                Open a customer to review their refund history. This is a review signal only — no customer is blocked.
              </p>
            </div>
          )}

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">All Users</h2>
            <button><Filter className="w-5 h-5 text-gray-600" /></button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <UserListItemSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 mt-8">
              Failed to load users. Please try again.
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user: User) => (
                <button
                  key={user.uuid}
                  onClick={() => handleUserClick(user.uuid)}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {user.full_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.full_name}</p>
                    <p className="text-xs text-gray-600 truncate">{user.email}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.status === 'ACTIVE' ? 'Active' : 'Suspended'}
                  </span>
                </button>
              ))}
              <div ref={sentinelRef} className="h-1" />
              {isFetchingMore && (
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 border-2 border-system-blue-light border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}