'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  useGetAllNotificationsQuery, 
  useMarkNotificationAsReadMutation, 
  useMarkAllNotificationsAsReadMutation 
} from '@/lib/api/adminApi';
import { useAppSelector } from '@/lib/hooks';
import { format } from 'date-fns';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function NotificationManagement() {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.accessToken);
  const [activeTab, setActiveTab] = useState('general');

  // We fetch all for general tab, filter locally or via API if needed.
  // For now, General = Inbox.
  const { data, isLoading, isError, refetch } = useGetAllNotificationsQuery(
    activeTab === 'general' ? undefined : undefined, 
    { skip: activeTab === 'created' } // Skip inbox fetch if viewing 'created' (system) notifications
  );

  const notifications = data?.data || [];

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  // WebSocket Connection (Same logic as Vendor)
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL 
        ? `${process.env.NEXT_PUBLIC_WS_URL}/ws/notifications/?token=${token}`
        : `${protocol}//api.dandelionz.com.ng/ws/notifications/?token=${token}`;

    ws.current = new WebSocket(wsUrl);
    ws.current.onopen = () => console.log('Admin Connected to notification service');
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notification') refetch();
    };
    return () => ws.current?.close();
  }, [token, refetch]);

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
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
      toast.success('Marked all as read');
    } catch (err) {
      toast.error('Failed to mark all');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[600px] bg-white relative">
        <div className="min-h-screen bg-white pb-20">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between relative">
            <div className="flex items-center">
                <button onClick={() => router.back()} className="mr-4">
                <ChevronLeft className="w-6 h-6 text-gray-900" />
                </button>
                <h1 className="text-lg font-semibold text-system-blue-light">Notifications</h1>
            </div>
            {activeTab === 'general' && notifications.length > 0 && (
                <button 
                    onClick={handleMarkAllAsRead}
                    className="text-xs font-medium text-system-blue-light"
                >
                    Mark all read
                </button>
            )}
          </div>

          <div className="p-4">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('general')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'general'
                    ? 'bg-blue-100 text-system-blue-light'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Inbox
              </button>
              <button
                onClick={() => setActiveTab('created')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'created'
                    ? 'bg-blue-100 text-system-blue-light'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Sent (System)
              </button>
            </div>

            {/* Created / System Notifications Tab */}
            {activeTab === 'created' && (
              <div className="space-y-3 mb-6">
                  {/* Placeholder for system notifications list - assume separate API or mock for now */}
                  <div className="text-center text-gray-500 py-10">
                      System notifications management would go here.
                  </div>
              </div>
            )}

            {/* General / Inbox Tab */}
            {activeTab === 'general' && (
              <div className="space-y-3 mb-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <LoadingSpinner />
                  </div>
                ) : isError ? (
                  <div className="text-center text-red-500">Failed to load notifications.</div>
                ) : notifications.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">No notifications.</div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                        key={notif.id} 
                        onClick={() => handleMarkAsRead(notif.id, notif.is_read)}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            notif.is_read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-100'
                        }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-base flex-1 ${notif.is_read ? 'font-semibold text-gray-900' : 'font-bold text-black'}`}>
                          {notif.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 whitespace-nowrap">
                            {format(new Date(notif.created_at), 'MMM do, yyyy')}
                          </span>
                          {!notif.is_read && <span className="w-2 h-2 rounded-full bg-system-blue-light"></span>}
                        </div>
                      </div>
                      <p className={`text-sm text-gray-700 leading-relaxed ${!notif.is_read ? 'font-medium' : ''}`}>
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            <button
              onClick={() => router.push('/admin/account/notifications/create')}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-system-blue-light font-semibold hover:border-system-blue-light hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
