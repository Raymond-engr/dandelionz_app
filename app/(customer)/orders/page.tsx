'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { useGetCustomerOrdersQuery } from '@/lib/api/publicApi';
import LoadingSpinner from '@/components/LoadingSpinner';

type TabStatus = 'completed' | 'ongoing' | 'returned';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabStatus>('completed');
  const { data: response, isLoading, error } = useGetCustomerOrdersQuery({});
  
  const allOrders = response?.data || [];

  // Filter orders based on active tab
  const currentOrders = allOrders.filter(order => {
    const status = order.status;
    if (activeTab === 'ongoing') {
      return ['PENDING', 'PAID', 'SHIPPED'].includes(status);
    } else if (activeTab === 'completed') {
      return ['DELIVERED', 'CANCELED'].includes(status);
    } else if (activeTab === 'returned') {
      return status === 'RETURNED';
    }
    return false;
  });

  if (isLoading) {
    return (
        <AppLayout showBottomNav={true} userRole="customer">
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        </AppLayout>
    );
  }

  if (error) {
    return (
        <AppLayout showBottomNav={true} userRole="customer">
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">Failed to load orders. Please try again later.</p>
            </div>
        </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={true} userRole="customer">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900 text-center mb-4">Order</h1>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === 'completed'
                  ? 'bg-system-blue-light text-white'
                  : 'bg-white text-system-blue-light border border-system-blue-light'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === 'ongoing'
                  ? 'bg-system-blue-light text-white'
                  : 'bg-white text-system-blue-light border border-system-blue-light'
              }`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setActiveTab('returned')}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === 'returned'
                  ? 'bg-system-blue-light text-white'
                  : 'bg-white text-system-blue-light border border-system-blue-light'
              }`}
            >
              Returned
            </button>
          </div>
        </div>

        {/* Orders List */}
        {currentOrders.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 px-6">
            <p className="text-lg text-gray-900 mb-6">Nothing to see here</p>
            <Link
              href="/"
              className="px-8 py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {currentOrders.map((order) => (
              <Link
                key={order.id}
                // Use the string order_id (ORD-...) for the URL or the numeric id? 
                // Using numeric ID is safer for API calls on the next page.
                href={`/orders/${order.order_id}`} 
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {order.order_items && order.order_items.length > 0 
                        ? `${order.order_items[0].product_name} ${order.order_items.length > 1 ? `+${order.order_items.length - 1} others` : ''}`
                        : 'Order Items'}
                    </h3>
                    <p className="text-xs text-gray-600">{order.order_id}</p>
                  </div>
                  {activeTab === 'ongoing' && (
                    <span className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-md text-xs font-medium">
                      {order.status}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}