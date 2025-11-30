'use client';

import AppLayout from '@/components/AppLayout';

export default function VendorHomePage() {
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
              <p className="text-2xl font-bold text-gray-900">Username</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="w-10 h-10 bg-system-blue-light rounded-full"></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Total Balance */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Total Balance</p>
              <p className="text-xl font-bold text-gray-900 mb-1">₦0.00</p>
              <div className="flex items-center text-xs text-green-600">
                <span>+0.00%</span>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Total Orders</p>
              <p className="text-xl font-bold text-gray-900 mb-1">0</p>
              <div className="flex items-center text-xs text-green-600">
                <span>+0.00%</span>
              </div>
            </div>

            {/* Product Sold */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Product Sold</p>
              <p className="text-xl font-bold text-gray-900 mb-1">0</p>
              <div className="flex items-center text-xs text-yellow-600">
                <span>+0.00%</span>
              </div>
            </div>

            {/* New Customer */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">New Customer</p>
              <p className="text-xl font-bold text-gray-900 mb-1">0</p>
              <div className="flex items-center text-xs text-red-600">
                <span>+0.00%</span>
              </div>
            </div>
          </div>

          {/* No Recent Order Section */}
          <div className="bg-system-blue-light rounded-lg p-6 flex items-center justify-between">
            <p className="text-white font-semibold text-lg">No Recent Order</p>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-system-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}