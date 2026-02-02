'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { 
  useGetVendorNotificationsQuery, 
  useMarkNotificationAsReadMutation, 
  useMarkAllNotificationsAsReadMutation 
} from '@/lib/api/vendorApi';
import { useAppSelector } from '@/lib/hooks';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function VendorNotificationsPage() {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.accessToken);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  // Pass filter param if 'unread', else void/undefined for all
  const queryParams = filter === 'unread' ? { is_read: false } : undefined;
  const { data: notificationsData, isLoading, error, refetch } = useGetVendorNotificationsQuery(queryParams);
  const notifications = notificationsData?.data || [];

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();

  // WebSocket Connection
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Use env var or fallback to current host if proxying, or fixed API host
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL 
        ? `${process.env.NEXT_PUBLIC_WS_URL}/ws/notifications/?token=${token}`
        : `${protocol}//api.dandelionz.com.ng/ws/notifications/?token=${token}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('Connected to notification service');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notification' || data.type === 'unread_count') {
        refetch(); // Refresh list on new notification
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [token, refetch]);

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await markAsRead(id).unwrap();
      // Optimistic update or auto-refetch happens via tags
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

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
          {notifications.length > 0 && (
             <button 
                onClick={handleMarkAllAsRead} 
                disabled={isMarkingAll}
                className="absolute right-4 text-xs font-medium text-system-blue-light disabled:opacity-50"
             >
                Mark all read
             </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="px-4 pt-4 pb-2 flex gap-4 border-b border-gray-100">
            <button 
                onClick={() => setFilter('all')}
                className={`pb-2 text-sm font-medium transition-colors ${filter === 'all' ? 'text-system-blue-light border-b-2 border-system-blue-light' : 'text-gray-500'}`}
            >
                All
            </button>
            <button 
                onClick={() => setFilter('unread')}
                className={`pb-2 text-sm font-medium transition-colors ${filter === 'unread' ? 'text-system-blue-light border-b-2 border-system-blue-light' : 'text-gray-500'}`}
            >
                Unread
            </button>
        </div>

        <div className="p-4">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
                {filter === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                onClick={() => handleMarkAsRead(notification.id, notification.is_read)}
                className={`rounded-lg p-4 border mb-3 cursor-pointer transition-colors ${
                    notification.is_read 
                        ? 'bg-white border-gray-200' 
                        : 'bg-blue-50 border-blue-100'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`text-base text-gray-900 ${notification.is_read ? 'font-semibold' : 'font-bold'}`}>
                    {notification.title}
                  </h3>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-600 flex-shrink-0 ml-2">
                        {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                    {!notification.is_read && (
                        <span className="mt-1 w-2 h-2 rounded-full bg-system-blue-light"></span>
                    )}
                  </div>
                </div>
                <p className={`text-sm text-gray-700 leading-relaxed ${!notification.is_read ? 'font-medium' : ''}`}>
                    {notification.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}