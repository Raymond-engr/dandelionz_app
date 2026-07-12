'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Plus, Trash2, Send, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  useAdminGetAllNotificationsQuery, 
  useGetAdminSystemNotificationsQuery,
  useAdminMarkNotificationAsReadMutation, 
  useAdminMarkAllNotificationsAsReadMutation,
  useDeleteInboxNotificationMutation,
  usePublishNotificationMutation,
  useDeleteSystemNotificationMutation
} from '@/lib/api/adminApi';
import { useAppSelector } from '@/lib/hooks';
import { format } from 'date-fns';
import { isSystemNotification } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function NotificationManagement() {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.accessToken);
  const [activeTab, setActiveTab] = useState('general');
  const [systemFilter, setSystemFilter] = useState<'all' | 'sent' | 'draft'>('all');
  const [deleteModal, setDeleteModal] = useState<{ id: string, type: 'inbox' | 'system' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Inbox Query
  const { 
    data: inboxResponse, 
    isLoading: isInboxLoading, 
    isError: isInboxError, 
    refetch: refetchInbox 
  } = useAdminGetAllNotificationsQuery(
    undefined, 
    { skip: activeTab === 'created' }
  );

  // System (Sent) Notifications Query
  const systemQueryParams = systemFilter === 'all' 
    ? undefined 
    : { is_draft: systemFilter === 'draft' };

  const {
    data: systemResponse,
    isLoading: isSystemLoading,
    isError: isSystemError,
    refetch: refetchSystem
  } = useGetAdminSystemNotificationsQuery(
    systemQueryParams,
    { skip: activeTab === 'general' }
  );

  // Debugging logs
  console.log('Inbox Response:', inboxResponse);
  console.log('System Response:', systemResponse);

  // Handle various response shapes (direct array, paginated object, or wrapped in data)
  // The API response shows: { count: 6, results: [...] }
  const notifications = (inboxResponse as any)?.results || (inboxResponse?.data as any)?.results || inboxResponse?.data || [];
  const systemNotifications = (systemResponse as any)?.results || (systemResponse?.data as any)?.results || systemResponse?.data || [];

  const [markAsRead] = useAdminMarkNotificationAsReadMutation();
  const [markAllAsRead] = useAdminMarkAllNotificationsAsReadMutation();
  const [deleteInboxNotification] = useDeleteInboxNotificationMutation();
  const [deleteSystemNotification] = useDeleteSystemNotificationMutation();
  const [publishNotification] = usePublishNotificationMutation();

  // WebSocket Connection
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
      if (data.type === 'notification' || data.type === 'unread_count') {
        refetchInbox();
        // Ideally refetchSystem too if another admin created one, but less critical
      }
    };
    return () => ws.current?.close();
  }, [token, refetchInbox]);

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
      toast.success('Marked all as read');
    } catch (err) {
      toast.error('Failed to mark all');
    }
  };

  const handleDeleteInbox = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteModal({ id, type: 'inbox' });
  };

  const handleDeleteSystem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteModal({ id, type: 'system' });
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    setIsDeleting(true);
    try {
      if (deleteModal.type === 'inbox') {
        await deleteInboxNotification(deleteModal.id).unwrap();
        toast.success('Deleted');
        refetchInbox();
      } else {
        await deleteSystemNotification(deleteModal.id).unwrap();
        toast.success('System notification deleted');
        refetchSystem();
      }
      setDeleteModal(null);
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePublish = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Publish this draft notification? It will be sent immediately.')) return;
    try {
        await publishNotification(id).unwrap();
        toast.success('Notification published');
        refetchSystem();
    } catch (err) {
        toast.error('Failed to publish');
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
                {/* Sub-tabs for System Notifications */}
                <div className="flex gap-2 mb-4 border-b border-gray-100 pb-2">
                  <button
                    onClick={() => setSystemFilter('all')}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                      systemFilter === 'all' 
                        ? 'bg-gray-200 text-gray-800' 
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSystemFilter('sent')}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                      systemFilter === 'sent' 
                        ? 'bg-green-100 text-green-800' 
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    Sent
                  </button>
                  <button
                    onClick={() => setSystemFilter('draft')}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                      systemFilter === 'draft' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    Drafts
                  </button>
                </div>

                {isSystemLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <LoadingSpinner />
                  </div>
                ) : isSystemError ? (
                  <div className="text-center text-red-500">Failed to load system notifications.</div>
                ) : systemNotifications.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                      {systemFilter === 'draft' ? 'No draft notifications found.' : 'No sent notifications found.'}
                    </div>
                ) : (
                  systemNotifications.map((notif: any) => (
                    <div 
                        key={notif.id} 
                        className="border rounded-lg p-4 bg-white relative group"
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 bg-gray-100 text-gray-600"
                        >
                          {notif.is_draft ? '📝' : '🚀'}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                                <h3 className="text-sm font-semibold text-gray-900 flex-1 pr-2">
                                  {notif.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                    {notif.is_draft && (
                                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium">Draft</span>
                                    )}
                                    {notif.scheduled_for && (
                                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">Scheduled</span>
                                    )}
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                        {format(new Date(notif.created_at), 'MMM do, yyyy')}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{notif.message}</p>
                            <p className="text-xs text-gray-400">
                              Recipient: <span className="font-medium text-gray-600">{notif.recipient_group || notif.recipient_type || 'Unknown'}</span>
                            </p>
                            
                            <div className="flex items-center gap-3 mt-3">
                              {notif.is_draft && (
                                <button 
                                  onClick={(e) => handlePublish(e, notif.id)}
                                  className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-md font-medium hover:bg-green-100 flex items-center gap-1"
                                >
                                  <Send className="w-3 h-3" /> Publish
                                </button>
                              )}
                            </div>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button 
                        onClick={(e) => handleDeleteSystem(e, notif.id)}
                        className="absolute bottom-2 right-2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete System Notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* General / Inbox Tab */}
            {activeTab === 'general' && (
              <div className="space-y-3 mb-6">
                {isInboxLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <LoadingSpinner />
                  </div>
                ) : isInboxError ? (
                  <div className="text-center text-red-500">Failed to load notifications.</div>
                ) : notifications.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">No notifications.</div>
                ) : (
                  notifications.map((notif: any) => (
                    <div 
                        key={notif.id} 
                        onClick={(e) => handleMarkAsRead(e, notif.id, notif.is_read)}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors relative group ${
                            notif.is_read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-100'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                          style={{ 
                            backgroundColor: notif.notification_type_color ? `${notif.notification_type_color}20` : '#F3F4F6',
                            color: notif.notification_type_color || '#374151'
                          }}
                        >
                          {notif.notification_type_icon || '📢'}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                                <h3 className={`text-sm flex-1 pr-2 ${notif.is_read ? 'font-semibold text-gray-900' : 'font-bold text-black'}`}>
                                {notif.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600 whitespace-nowrap">
                                        {format(new Date(notif.created_at), 'MMM do, yyyy')}
                                    </span>
                                </div>
                            </div>
                            <p className={`text-sm text-gray-700 leading-relaxed ${!notif.is_read ? 'font-medium' : ''}`}>
                                {notif.message}
                            </p>
                            {notif.action_url && (
                                <a 
                                    href={notif.action_url}
                                    onClick={(e) => e.stopPropagation()} 
                                    className="text-xs text-system-blue-light font-medium mt-2 inline-block hover:underline"
                                >
                                    {notif.action_text || 'View Details'} &rarr;
                                </a>
                            )}
                        </div>
                      </div>

                      {/* Delete Button */}
                      {!isSystemNotification(notif) && (
                        <button 
                          onClick={(e) => handleDeleteInbox(e, notif.id)}
                          className="absolute bottom-2 right-2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Notification?</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this notification? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
