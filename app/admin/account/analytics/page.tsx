'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { ChevronLeft, TrendingUp, Users, Store, ShoppingCart } from 'lucide-react';
import { useGetDetailedAnalyticsQuery } from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { data: analytics, isLoading, error } = useGetDetailedAnalyticsQuery();

  if (isLoading) {
    return (
      <AppLayout showBottomNav={false} userRole="admin">
        <div className="min-h-screen bg-white pb-6 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout showBottomNav={false} userRole="admin">
        <div className="min-h-screen bg-white pb-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load analytics</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-system-blue-light text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const salesData = analytics?.data?.sales_chart_data || [];
  const maxValue = salesData.length > 0 ? Math.max(...salesData.map(d => d.sales)) : 0;

  const orderStats = analytics?.data?.order_stats ? [
    { label: 'Completed', value: analytics.data.order_stats.completed, color: 'bg-[#030482]' },
    { label: 'Pending', value: analytics.data.order_stats.pending, color: 'bg-purple-500' },
    { label: 'Cancelled', value: analytics.data.order_stats.cancelled, color: 'bg-purple-400' },
    { label: 'Returned', value: analytics.data.order_stats.returned, color: 'bg-gray-300' },
  ] : [];

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white pb-6">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Analytics</h1>
        </div>

        <div className="p-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-gray-600">Total Sales</p>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-1">₦{analytics?.data?.total_sales || '0.00'}</p>
              <div className="flex items-center text-xs text-green-600">
                <span>+0.00%</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-gray-600">Total Vendors</p>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-1">{analytics?.data?.total_vendors || 0}</p>
              <div className="flex items-center text-xs text-green-600">
                <span>+0.00%</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-gray-600">Total Orders</p>
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-1">{analytics?.data?.total_orders || 0}</p>
              <div className="flex items-center text-xs text-green-600">
                <span>+0.00%</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-gray-600">Total Users</p>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-1">{analytics?.data?.total_users || 0}</p>
              <div className="flex items-center text-xs text-green-600">
                <span>+0.00%</span>
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-gray-600 mb-1">Sales 2025</p>
                <p className="text-2xl font-bold text-gray-900">₦{parseFloat(analytics?.data?.total_sales || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-xs text-green-600">+0.5% vs LAST YEAR</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs border border-gray-300 rounded-full">Daily</button>
                <button className="px-3 py-1 text-xs border border-gray-300 rounded-full">Weekly</button>
                <button className="px-3 py-1 text-xs bg-gray-900 text-white rounded-full">Annually</button>
              </div>
            </div>

            {/* Chart */}
            <div className="relative h-48">
              <svg className="w-full h-full" viewBox="0 0 350 180" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="0" x2="350" y2="0" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="45" x2="350" y2="45" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="90" x2="350" y2="90" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="135" x2="350" y2="135" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="180" x2="350" y2="180" stroke="#e5e7eb" strokeWidth="1" />

                {/* Line chart */}
                <polyline
                  points={salesData.map((d, i) => 
                    `${(i * 350) / (salesData.length > 1 ? salesData.length - 1 : 1)},${180 - (d.sales / maxValue) * 160}`
                  ).join(' ')}
                  fill="none"
                  stroke="#030482"
                  strokeWidth="2"
                />

                {/* Data points */}
                {salesData.map((d, i) => (
                  <circle
                    key={i}
                    cx={(i * 350) / (salesData.length > 1 ? salesData.length - 1 : 1)}
                    cy={180 - (d.sales / maxValue) * 160}
                    r="4"
                    fill="#030482"
                  />
                ))}
              </svg>

              {/* Year labels */}
              <div className="flex justify-between mt-2 px-1">
                {salesData.map((d, i) => (
                  <span key={i} className="text-xs text-gray-600">{d.period}</span>
                ))}
              </div>

            </div>
          </div>

          {/* Order Statistics */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Statistics</h3>
            <p className="text-base font-semibold text-gray-900 mb-4">Order</p>

            {/* Donut Chart */}
            <div className="flex items-center justify-center mb-6 relative">
              <svg width="200" height="200" viewBox="0 0 200 200">
                {/* Background circles */}
                <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="30" />
                
                {/* Segments */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#030482"
                  strokeWidth="30"
                  strokeDasharray="226 503"
                  strokeDashoffset="0"
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="30"
                  strokeDasharray="55 503"
                  strokeDashoffset="-226"
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="30"
                  strokeDasharray="121 503"
                  strokeDashoffset="-281"
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="30"
                  strokeDasharray="141 503"
                  strokeDashoffset="-402"
                  transform="rotate(-90 100 100)"
                />
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-gray-900">1.05</p>
                <p className="text-xs text-gray-600">Average range</p>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {orderStats.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                    <span className="text-sm text-gray-700">{stat.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
