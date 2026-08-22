'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  useGetVendorNotificationsQuery, 
  useVendorMarkNotificationAsReadMutation, 
  useVendorMarkAllNotificationsAsReadMutation,
  useVendorDeleteNotificationMutation,
  Notification,
} from '@/lib/api/vendorApi';
import { useAppSelector } from '@/lib/hooks';
import { useInfiniteList, useInfiniteScrollTrigger, selectBareEnvelope } from '@/lib/hooks/use-infinite-list';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { resolveNotificationUrl, isSystemNotification } from '@/lib/utils';
import Modal from '@/components/Modal';

export default function VendorNotificationsPage() {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.accessToken);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Was a single unpaginated fetch with no page ever requested beyond the
  // first (the response shape was also declared wrong in the API type,
  // which is why this page used to fall back through three different
  // possible shapes defensively). Backend already filters by is_read
  // server-side, so the "unread" tab needs no client-side re-filter.
  const {
    items: filteredNotifications,
    isInitialLoading: isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    error,
    refresh,
  } = useInfiniteList(
    useGetVendorNotificationsQuery,
    filter === 'unread' ? { is_read: false } : {},
    selectBareEnvelope<Notification>,
  );
  const sentinelRef = useInfiniteScrollTrigger(loadMore, hasMore && !isFetchingMore);
  const refetch = refresh;

  const [markAsRead] = useVendorMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useVendorMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useVendorDeleteNotificationMutation();

  // WebSocket Connection
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL 
        ? `${process.env.NEXT_PUBLIC_WS_URL}/ws/notifications/?token=${token}`
        : `${protocol}//api.dandelionz.com.ng/ws/notifications/?token=${token}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('Connected to notification service');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notification' || data.type === 'unread_count' || data.type === 'unread_notifications') {
        refetch(); // Refresh list on new notification
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [token, refetch]);

  const handleMarkAsRead = async (e: React.MouseEvent, id: string, isRead: boolean) => {
    e.stopPropagation(); // Prevent triggering parent clicks if any
    if (isRead) return;
    try {
      await markAsRead(id).unwrap();
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

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
        await deleteNotification(deleteId).unwrap();
        toast.success('Notification deleted');
        refetch();
    } catch (err) {
        toast.error('Failed to delete notification');
    } finally {
        setDeleteId(null);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteId(id);
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
          {filteredNotifications.length > 0 && (
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
          {filteredNotifications.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
                {filter === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}
            </div>
          ) : (
            filteredNotifications.map((notification: any) => (
              <div 
                key={notification.id} 
                onClick={(e) => handleMarkAsRead(e, notification.id, notification.is_read)}
                className={`rounded-lg p-4 border mb-3 cursor-pointer transition-colors relative group ${
                    notification.is_read 
                        ? 'bg-white border-gray-200' 
                        : 'bg-blue-50 border-blue-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                    style={{ 
                        backgroundColor: notification.notification_type_color ? `${notification.notification_type_color}20` : '#F3F4F6',
                        color: notification.notification_type_color || '#374151'
                    }}
                  >
                    {notification.notification_type_icon || '📢'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`text-sm truncate pr-2 ${notification.is_read ? 'font-semibold text-gray-900' : 'font-bold text-black'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm text-gray-600 line-clamp-2 ${!notification.is_read ? 'font-medium' : ''}`}>
                        {notification.message}
                    </p>
                    
                    {notification.action_url && notification.category !== 'product_rejection' && (
                        <Link 
                            href={resolveNotificationUrl(notification.action_url, 'vendor')}
                            onClick={(e) => e.stopPropagation()} 
                            className="text-xs text-system-blue-light font-medium mt-2 inline-block hover:underline"
                        >
                            {notification.action_text || 'View Details'} &rarr;
                        </Link>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                {!isSystemNotification(notification) && (
                  <button 
                      onClick={(e) => handleDeleteClick(e, notification.id)}
                      className="absolute bottom-2 right-2 p-1.5 text-gray-400 hover:text-red-500 transition-opacity md:opacity-0 md:group-hover:opacity-100"
                      title="Delete Notification"
                  >
                      <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
          <div ref={sentinelRef} className="h-1" />
          {isFetchingMore && (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-system-blue-light border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <Modal 
            isOpen={!!deleteId}
            onClose={() => setDeleteId(null)}
            title="Delete Notification"
            description="Are you sure you want to delete this notification? This action cannot be undone."
            confirmText="Delete"
            isDestructive={true}
            onConfirm={confirmDelete}
        />
      </div>
    </AppLayout>
  );
}