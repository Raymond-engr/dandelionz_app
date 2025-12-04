'use client';

import React from 'react';
import { ShoppingCart, Filter } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

const mockOrders = [
  { id: 'Order ID', customer: 'Customer Name', date: 'Order Date', amount: '₦0.00', status: 'Status' },
  { id: 'Order ID', customer: 'Customer Name', date: 'Order Date', amount: '₦0.00', status: 'Status' },
];

export default function OrderManagement() {
  const router = useRouter();

  const handleOrderClick = (orderId) => {
    router.push(`/admin/orders/${orderId}`);
  };

  return (
    <AppLayout showBottomNav={true} userRole="admin">
      <div className="min-h-screen bg-white pb-20">
        <div className="p-4 border-b border-gray-200 text-center">
          <h1 className="text-lg font-semibold text-gray-900">Order</h1>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">Manage, track and control all orders</p>

          <div className="bg-system-blue-light text-white rounded-lg p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Orders</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <ShoppingCart className="w-12 h-12 opacity-80" />
          </div>

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">All Orders</h2>
            <button><Filter className="w-5 h-5 text-gray-600" /></button>
          </div>

          <div className="space-y-3">
            {mockOrders.map((order, idx) => (
              <button
                key={idx}
                onClick={() => handleOrderClick(order.id)}
                className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                    <p className="text-xs text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-600">{order.date}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    {order.status}
                  </span>
                </div>
                <p className="text-base font-bold text-gray-900 text-left">{order.amount}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
