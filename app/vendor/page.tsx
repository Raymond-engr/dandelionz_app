'use client';

import AppLayout from '@/components/AppLayout';
import { 
  useGetVendorAnalyticsQuery, 
  useGetVendorProfileQuery,
  useGetVendorOrdersListQuery,
} from '@/lib/api/vendorApi';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function VendorHomePage() {
  const { data: analytics, isLoading: analyticsLoading } = useGetVendorAnalyticsQuery();
  const { data: profile, isLoading: profileLoading } = useGetVendorProfileQuery();
  const { data: ordersData, isLoading: ordersLoading } = useGetVendorOrdersListQuery({ limit: 5 });

  const isLoading = analyticsLoading || profileLoading || ordersLoading;
  const vendorName = profile?.data?.user?.full_name || profile?.data?.store_name || 'Vendor';
  const { total_revenue: totalRevenue, total_orders: totalOrders } = analytics?.data || {};
  const recentOrders = ordersData?.data || [];

  return (
    <AppLayout showBottomNav={true} userRole="vendor">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 mb-1">
                Welcome back,
              </h1>
              {profileLoading ? (
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{vendorName}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="w-10 h-10 bg-system-blue-light rounded-full flex items-center justify-center text-white font-semibold">
                {vendorName.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Total Balance</p>
              {analyticsLoading ? <div className="h-7 w-20 bg-gray-200 animate-pulse rounded mb-1"></div> : <p className="text-xl font-bold text-gray-900 mb-1">₦{parseFloat(String(totalRevenue || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
              <div className="flex items-center text-xs text-green-600"><span>+0.00%</span></div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Total Orders</p>
              {analyticsLoading ? <div className="h-7 w-12 bg-gray-200 animate-pulse rounded mb-1"></div> : <p className="text-xl font-bold text-gray-900 mb-1">{totalOrders || 0}</p>}
              <div className="flex items-center text-xs text-green-600"><span>+0.00%</span></div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Product Sold</p>
              {analyticsLoading ? <div className="h-7 w-12 bg-gray-200 animate-pulse rounded mb-1"></div> : <p className="text-xl font-bold text-gray-900 mb-1">0</p>}
              <div className="flex items-center text-xs text-yellow-600"><span>+0.00%</span></div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">New Customer</p>
              {analyticsLoading ? <div className="h-7 w-12 bg-gray-200 animate-pulse rounded mb-1"></div> : <p className="text-xl font-bold text-gray-900 mb-1">0</p>}
              <div className="flex items-center text-xs text-red-600"><span>+0.00%</span></div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Orders</h2>
            {ordersLoading ? <LoadingSpinner /> : recentOrders.length === 0 ? (
                <div className="bg-system-blue-light rounded-lg p-6 flex items-center justify-between">
                    <p className="text-white font-semibold text-lg">No Recent Orders</p>
                    <Link href="/vendor/product/new" className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-system-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {recentOrders.map((order: any) => (
                        <Link href={`/vendor/orders/${order.uuid}`} key={order.uuid} className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-system-blue-light rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold">
                                    {order.customer.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className="text-sm font-semibold text-gray-900 truncate">{order.customer.full_name}</h3>
                                        <span className={`capitalize px-3 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0`}>{order.status}</span>
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
                        </Link>
                    ))}
                </div>
            )}
        </div>
      </div>
    </AppLayout>
  );
}