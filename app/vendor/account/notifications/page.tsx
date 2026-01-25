'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useGetVendorNotificationsQuery } from '@/lib/api/vendorApi';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function VendorNotificationsPage() {
  const router = useRouter();
  const { data: notificationsData, isLoading, error } = useGetVendorNotificationsQuery();

  const notifications = notificationsData?.data || [];

  if (isLoading) {
    return (
      <AppLayout showBottomNav={false} userRole="vendor">
        <LoadingSpinner fullScreen />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout showBottomNav={false} userRole="vendor">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">Failed to load notifications.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={false} userRole="vendor">
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Notifications</h1>
        </div>

        <div className="p-4">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">No notifications yet.</div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-semibold text-gray-900">{notification.title}</h3>
                  <span className="text-xs text-gray-600 flex-shrink-0 ml-2">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{notification.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}