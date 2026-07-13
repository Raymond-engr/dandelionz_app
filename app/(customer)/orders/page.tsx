'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { useGetCustomerOrdersQuery, useGetInstallmentPlansQuery } from '@/lib/api/publicApi';
import OrderCardSkeleton from '@/components/OrderCardSkeleton';

type TabStatus = 'completed' | 'ongoing' | 'returned';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabStatus>('ongoing');
  const { data: response, isLoading, error } = useGetCustomerOrdersQuery({});
  const { data: plansResponse, isLoading: isLoadingPlans } = useGetInstallmentPlansQuery();

  const allOrders = response || [];
  const installmentPlans = plansResponse?.data || [];

  // Helper to check if an order is an installment order
  const getInstallmentPlan = (orderId: string) => {
    return installmentPlans.find((plan: any) => plan.order_id === orderId);
  };

  // Filter orders based on active tab
  const currentOrders = allOrders.filter(order => {
    const status = order.status;
    if (activeTab === 'ongoing') {
      return ['PENDING', 'PAID', 'SHIPPED'].includes(status);
    } else if (activeTab === 'completed') {
      return ['DELIVERED', 'CANCELED', 'CANCELLED'].includes(status);
    } else if (activeTab === 'returned') {
      return status === 'RETURNED';
    }
    return false;
  });

  if (error) {
    return (
        <AppLayout showBottomNav={true} userRole="customer">
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500 text-center">Failed to load orders.<br /> Please try again later.</p>
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
        {isLoading || isLoadingPlans ? (
          <div className="p-4 space-y-3">
             <OrderCardSkeleton />
             <OrderCardSkeleton />
             <OrderCardSkeleton />
             <OrderCardSkeleton />
          </div>
        ) : currentOrders.length === 0 ? (
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
            {currentOrders.map((order) => {
              const plan = getInstallmentPlan(order.order_id);
              return (
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
                        ? `${order.order_items[0].product.name} ${order.order_items.length > 1 ? `+${order.order_items.length - 1} others` : ''}`
                        : 'Order Items'}
                    </h3>
                    <p className="text-xs text-gray-600">{order.order_id}</p>
                    {plan && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded-full">
                        Installment Plan
                      </span>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'PAID' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-700' :
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    (order.status === 'CANCELED' || order.status === 'CANCELLED') ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status === 'CANCELED' ? 'CANCELLED' : order.status}
                  </span>
                </div>
              </Link>
            )})}
          </div>
        )}
      </div>
    </AppLayout>
  );
}