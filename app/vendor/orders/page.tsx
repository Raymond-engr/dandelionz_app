'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useGetVendorOrdersSummaryQuery, useGetVendorOrdersListQuery, Order } from '@/lib/api/vendorApi';
import { useInfiniteList, useInfiniteScrollTrigger, selectStandardEnvelope } from '@/lib/hooks/use-infinite-list';
import OrderListItemSkeleton from '@/components/OrderListItemSkeleton';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function VendorOrdersPage() {
  const { data: orderSummaryData, isLoading: isLoadingSummary, error: summaryError } = useGetVendorOrdersSummaryQuery();
  const {
    items: orders,
    isInitialLoading: isLoadingList,
    isFetchingMore,
    hasMore,
    loadMore,
    error: listError,
  } = useInfiniteList(useGetVendorOrdersListQuery, {}, selectStandardEnvelope<Order>);
  const sentinelRef = useInfiniteScrollTrigger(loadMore, hasMore && !isFetchingMore);

  const stats = orderSummaryData?.data;

  const isLoading = isLoadingSummary || isLoadingList;
  const error = summaryError || listError;

  if (error) {
    return (
      <AppLayout showBottomNav={true} userRole="vendor">
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load orders</p>
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

  return (
    <AppLayout showBottomNav={true} userRole="vendor">
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Order</h1>
          <p className="text-sm text-gray-600 mb-6">
            Manage and track your customers order
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Total Orders</p>
              {isLoadingSummary ? <div className="h-7 w-12 bg-purple-200 animate-pulse rounded"></div> : <p className="text-2xl font-bold text-gray-900">{(stats?.pending || 0) + (stats?.paid || 0) + (stats?.shipped || 0) + (stats?.delivered || 0) + (stats?.canceled || 0)}</p>}
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Pending</p>
              {isLoadingSummary ? <div className="h-7 w-12 bg-yellow-200 animate-pulse rounded"></div> : <p className="text-2xl font-bold text-gray-900">{stats?.pending || 0}</p>}
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Delivered</p>
              {isLoadingSummary ? <div className="h-7 w-12 bg-green-200 animate-pulse rounded"></div> : <p className="text-2xl font-bold text-gray-900">{stats?.delivered || 0}</p>}
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Paid</p>
              {isLoadingSummary ? <div className="h-7 w-12 bg-blue-200 animate-pulse rounded"></div> : <p className="text-2xl font-bold text-gray-900">{stats?.paid || 0}</p>}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-4">All Orders</h2>
          
          {isLoadingList ? (
            <div className="space-y-3">
              <OrderListItemSkeleton />
              <OrderListItemSkeleton />
              <OrderListItemSkeleton />
              <OrderListItemSkeleton />
              <OrderListItemSkeleton />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
                <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order: any) => (
                <div key={order.uuid} className="block bg-gray-50 rounded-lg p-4 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-system-blue-light rounded-full shrink-0 flex items-center justify-center text-white font-semibold">
                      {order.customer.full_name.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {order.customer.full_name}
                          </h3>
                          <p className="text-xs text-gray-600 truncate">
                            {order.customer.email}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ml-2 shrink-0`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <p className="text-xs text-gray-600">Order ID</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{order.order_id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">₦{parseFloat(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          <p className="text-xs text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={sentinelRef} className="h-1" />
              {isFetchingMore && (
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 border-2 border-system-blue-light border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}