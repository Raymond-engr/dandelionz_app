'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetAdminRefundsQuery } from '@/lib/api/adminApi';

export default function SettlementsPage() {
  const router = useRouter();
  const { data: refundsData } = useGetAdminRefundsQuery({ status: 'PENDING' });
  const pendingCount = refundsData?.pending_count || 0;

  const menuItems = [
    { label: 'Summary', href: '/admin/account/settlements/summary' },
    { label: 'Transaction History', href: '/admin/account/settlements/history' },
  ];

  const paymentItems = [
    { label: 'Vendor Settlements', href: '/admin/account/settlements/vendor' },
    { label: 'Payout', href: '/admin/account/settlements/payout' },
    { label: 'Disputes & Refunds', href: '/admin/account/settlements/disputes' },
    { label: 'Customer Refunds', href: '/admin/refunds' },
  ];

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-[#030482]">Payments & Settlements</h1>
        </div>

        <div className="p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Overview</h2>
          <div className="space-y-2 mb-6">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center justify-between px-4 py-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>

          <h2 className="text-base font-semibold text-gray-900 mb-3">Settlements & Payouts</h2>
          <div className="space-y-2">
            {paymentItems.map((item) => (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center justify-between px-4 py-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  {item.href === '/admin/refunds' && pendingCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                      {pendingCount}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}