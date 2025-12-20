'use client';

import React from 'react';
import { Bell, Users, Store, ShoppingCart, Package } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  bgColor?: string;
}

const StatCard = ({ title, value, change, icon, bgColor = "bg-white" }: StatCardProps) => (
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

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <AppLayout showBottomNav={true} userRole="admin">
        <div className="min-h-screen bg-white pb-20">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-base text-gray-600 mb-1">Welcome back,</h1>
                <p className="text-xl font-bold text-gray-900">Username</p>
              </div>
              <button onClick={() => router.push('/admin/notifications')}>
                <Bell className="w-6 h-6 text-system-blue-dark" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard 
                title="Total Users" 
                value="₦0.00" 
                change="+0.00%" 
                icon={<Users className="w-5 h-5 text-green-600" />}
              />
              <StatCard 
                title="Total Vendors" 
                value="0" 
                change="+0.00%" 
                icon={<Store className="w-5 h-5 text-blue-600" />}
              />
              <StatCard 
                title="Total Orders" 
                value="0" 
                change="+0.00%" 
                icon={<ShoppingCart className="w-5 h-5 text-yellow-600" />}
              />
              <StatCard 
                title="Total Products" 
                value="0" 
                change="+0.00%" 
                icon={<Package className="w-5 h-5 text-purple-600" />}
              />
            </div>
          </div>
        </div>
    </AppLayout>
  );
}