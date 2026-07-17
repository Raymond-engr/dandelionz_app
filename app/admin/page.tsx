'use client';

import React from 'react';
import { Bell, Users, Store, ShoppingCart, Package } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useGetAnalyticsQuery } from '@/lib/api/adminApi';
import { useAppSelector } from '@/lib/hooks';
import StatCardSkeleton from '@/components/StatCardSkeleton';
import { apiError } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  bgColor?: string;
  isLoading?: boolean;
}

const StatCard = ({ title, value, change, icon, bgColor = "bg-white", isLoading }: StatCardProps) => {
  if (isLoading) return <StatCardSkeleton />;
  
  return (
    <div className={`${bgColor} border border-gray-200 rounded-lg p-4`}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs text-gray-600">{title}</p>
        <div className={`w-8 h-8 ${bgColor === "bg-white" ? "bg-gray-100" : "bg-white/20"} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-xl font-bold text-gray-900 mb-1">{value}</p>
      <div className="flex items-center text-xs text-green-600">
        <span>{change}</span>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const [period, setPeriod] = React.useState<"weekly" | "monthly" | "annual" | "custom">("weekly");
  const { data: analytics, isLoading, error } = useGetAnalyticsQuery({ period });
  const { unreadCount } = useAppSelector((state) => state.notification);

  if (error) {
    return (
      <AppLayout showBottomNav={true} userRole="admin">
        <div className="min-h-screen bg-white pb-20 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-red-600 mb-4 font-medium">Failed to load analytics</p>
            <p className="text-sm text-gray-500 mb-6">{apiError(error, 'Please try again later')}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-system-blue-light text-white rounded-lg font-medium shadow-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={true} userRole="admin">
      <div className="min-h-screen bg-white pb-20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-base text-gray-600 mb-1">Welcome back,</h1>
              <p className="text-xl font-bold text-gray-900">Admin</p>
            </div>
            <button onClick={() => router.push('/admin/account/notifications')} className="relative">
              <Bell className="w-6 h-6 text-system-blue-dark" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white box-content"></span>
              )}
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
            {(["weekly", "monthly", "annual"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors border ${
                  period === p
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard 
              title="Total Revenue" 
              value={isLoading ? "..." : `₦${parseFloat(analytics?.data?.total_revenue || "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              change="+0.00%" 
              icon={<Users className="w-5 h-5 text-green-600" />}
              isLoading={isLoading}
            />
            <StatCard 
              title="Total Vendors" 
              value={isLoading ? "..." : String(analytics?.data?.total_vendors || 0)}
              change="+0.00%" 
              icon={<Store className="w-5 h-5 text-blue-600" />}
              isLoading={isLoading}
            />
            <StatCard 
              title="Total Orders" 
              value={isLoading ? "..." : String(analytics?.data?.total_orders || 0)}
              change="+0.00%" 
              icon={<ShoppingCart className="w-5 h-5 text-yellow-600" />}
              isLoading={isLoading}
            />
            <StatCard 
              title="Pending Orders" 
              value={isLoading ? "..." : String(analytics?.data?.pending_orders || 0)}
              change="+0.00%" 
              icon={<Package className="w-5 h-5 text-purple-600" />}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}