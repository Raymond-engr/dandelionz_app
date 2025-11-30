'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function VendorNotificationsPage() {
  const router = useRouter();

  const notifications = [
    {
      id: '1',
      title: 'Welcome message!',
      message: 'Welcome Username, enjoy seamless sales, product listings amd smooth withdrawals with the Dandelionz platform',
      date: 'Nov 8th, 2025'
    }
  ];

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
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-semibold text-gray-900">{notification.title}</h3>
                <span className="text-xs text-gray-600 flex-shrink-0 ml-2">{notification.date}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{notification.message}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}