'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { 
  useGetCustomerNotificationsQuery, 
  useMarkNotificationAsReadMutation, 
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation
} from '@/lib/api/customerApi';
import { useAppSelector } from '@/lib/hooks';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Trash2, ChevronLeft } from 'lucide-react';

export default function CustomerNotificationsPage() {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.accessToken);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  // Pass filter param if 'unread', else void/undefined for all
  const queryParams = filter === 'unread' ? { is_read: false } : undefined;
  const { data: notificationsResponse, isLoading, error, refetch } = useGetCustomerNotificationsQuery(queryParams);
  
  // Handle pagination structure (results array) or flat array
  const notifications = (notificationsResponse as any)?.results || (notificationsResponse?.data as any)?.results || notificationsResponse?.data || [];

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

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
    e.stopPropagation();
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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this notification?')) return;
    try {
        await deleteNotification(id).unwrap();
        toast.success('Notification deleted');
        refetch();
    } catch (err) {
        toast.error('Failed to delete notification');
    }
  };

  if (isLoading) {
    return (
      <AppLayout showBottomNav={true} userRole="customer">
        <LoadingSpinner fullScreen />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout showBottomNav={true} userRole="customer">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">Failed to load notifications.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={true} userRole="customer">
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Notifications</h1>
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
            notifications.map((notification: any) => (
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
                    
                    {notification.action_url && (
                        <a 
                            href={notification.action_url}
                            onClick={(e) => e.stopPropagation()} 
                            className="text-xs text-system-blue-light font-medium mt-2 inline-block hover:underline"
                        >
                            {notification.action_text || 'View Details'} &rarr;
                        </a>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                <button 
                    onClick={(e) => handleDelete(e, notification.id)}
                    className="absolute bottom-2 right-2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Notification"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
