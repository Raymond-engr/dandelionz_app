'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';

type OrderStatus = 'completed' | 'ongoing' | 'returned';

interface Order {
  id: string;
  productName: string;
  orderId: string;
  status: OrderStatus;
}

const orders: Record<OrderStatus, Order[]> = {
  completed: [],
  ongoing: [
    { id: '1', productName: 'Product Name', orderId: 'Order ID', status: 'ongoing' },
  ],
  returned: [],
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('completed');

  const currentOrders = orders[activeTab];

  return (
    <AppLayout showBottomNav={true}>
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
                href={`/orders/${order.id}`}
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {order.productName}
                    </h3>
                    <p className="text-xs text-gray-600">{order.orderId}</p>
                  </div>
                  {activeTab === 'ongoing' && (
                    <span className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-md text-xs font-medium">
                      Ongoing
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