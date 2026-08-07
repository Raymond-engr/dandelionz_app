'use client';

import React from 'react';
import { ShoppingCart, Filter } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useGetAllOrdersQuery, useGetDeliveryAttentionQuery } from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { format } from 'date-fns';
import { Order } from '@/lib/api/adminApi';

export default function OrderManagement() {
  const router = useRouter();
  const { data: orders = [], isLoading, error } = useGetAllOrdersQuery({});
  const { data: attention } = useGetDeliveryAttentionQuery();

  const totalOrders = orders.length;
  const counts = attention?.data?.counts;
  const needsAttention = counts ? counts.unscheduled + counts.awaiting_fee + counts.ready_to_ship > 0 : false;

  const handleOrderClick = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'paid':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-purple-100 text-purple-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
              {isLoading ? <div className="h-9 w-16 bg-white/20 animate-pulse rounded"></div> : <p className="text-3xl font-bold">{totalOrders}</p>}
            </div>
            <ShoppingCart className="w-12 h-12 opacity-80" />
          </div>

          {/* Delivery attention summary */}
          {needsAttention && counts && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-amber-800 mb-1">Delivery needs attention</p>
              <p className="text-xs text-amber-700">
                {counts.unscheduled} order{counts.unscheduled === 1 ? '' : 's'} need scheduling
                {' · '}{counts.awaiting_fee} awaiting fee
                {' · '}{counts.ready_to_ship} ready to ship
              </p>
            </div>
          )}

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">All Orders</h2>
            <button><Filter className="w-5 h-5 text-gray-600" /></button>
          </div>

          {isLoading ? (
            <div className="flex justify-center mt-8">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 mt-8">
              Failed to load orders. Please try again.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order: Order) => (
                <button
                  key={order.order_id}
                  onClick={() => handleOrderClick(order.order_id)}
                  className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-left flex-1">
                      <p className="text-sm font-semibold text-gray-900">{order.order_id}</p>
                      <p className="text-xs text-gray-600">
                        {order.customer?.full_name || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-600">{order.ordered_at ? format(new Date(order.ordered_at), 'PPP') : 'N/A'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(order.status || order.current_status)}`}>
                        {order.status || order.current_status}
                      </span>
                      {order.installment_plan && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full font-medium bg-system-blue-light/10 text-system-blue-light uppercase">
                          Installment
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-base font-bold text-gray-900 text-left">₦{parseFloat(order.total_price || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
