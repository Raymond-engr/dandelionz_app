'use client';

import React, { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const mockNotifications = [
  { 
    id: '1', 
    title: 'Welcome message!', 
    message: 'Welcome Admin, enjoy seamless sales management, product and users overseeing amd smooth withdrawals with the Dandelionz platform',
    date: 'Nov 8th, 2025',
    status: null
  },
  { 
    id: '2', 
    title: 'Welcome message!', 
    message: 'Welcome Admin, enjoy seamless sales management, product and users overseeing amd smooth withdrawals with the Dandelionz platform',
    date: 'Nov 8th, 2025',
    status: 'Sent'
  },
  { 
    id: '3', 
    title: 'Welcome message!', 
    message: 'Welcome Admin, enjoy seamless sales management, product and users overseeing amd smooth withdrawals with the Dandelionz platform',
    date: 'Nov 8th, 2025',
    status: 'Draft'
  },
  { 
    id: '4', 
    title: 'Welcome message!', 
    message: 'Welcome Admin, enjoy seamless sales management, product and users overseeing amd smooth withdrawals with the Dandelionz platform',
    date: 'Nov 8th, 2025',
    status: 'Scheduled'
  },
];

export default function NotificationManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[600px] bg-white relative">
        <div className="min-h-screen bg-white pb-20">
          <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
            <button onClick={() => router.back()} className="absolute left-4">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-lg font-semibold text-system-blue-light">Notifications</h1>
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
                General
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'transactions'
                    ? 'bg-blue-100 text-system-blue-light'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('created')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'created'
                    ? 'bg-blue-100 text-system-blue-light'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Created
              </button>
            </div>

            {activeTab === 'created' && (
              <div className="space-y-3 mb-6">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-base font-semibold text-gray-900 flex-1">
                        {notif.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {notif.status && (
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${
                              notif.status === 'Sent'
                                ? 'bg-gray-200 text-gray-700'
                                : notif.status === 'Draft'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {notif.status}
                          </span>
                        )}
                        {notif.status === 'Sent' ? (
                          <button className="px-4 py-1.5 bg-system-blue-light text-white text-xs rounded-lg font-medium">
                            Resend
                          </button>
                        ) : notif.status === 'Draft' ? (
                          <button className="px-4 py-1.5 bg-system-blue-light text-white text-xs rounded-lg font-medium">
                            Send
                          </button>
                        ) : null}
                        <span className="text-xs text-gray-600 whitespace-nowrap">{notif.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab !== 'created' && (
              <div className="mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold text-gray-900">Welcome message!</h3>
                    <span className="text-xs text-gray-600">Nov 8th, 2025</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Welcome Admin, enjoy seamless sales management, product and users overseeing amd smooth withdrawals with the Dandelionz platform
                  </p>
                </div>
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
