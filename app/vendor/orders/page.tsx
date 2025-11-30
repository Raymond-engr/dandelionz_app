'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  orderId: string;
  date: string;
  status: 'shipped' | 'new';
  amount: number;
}

export default function VendorOrdersPage() {
  const orders: Order[] = [
    {
      id: '1',
      customerName: 'Customer name',
      customerEmail: 'Customeremail@gmail.com',
      orderId: 'Order ID',
      date: '11/11/25',
      status: 'shipped',
      amount: 0.00
    },
    {
      id: '2',
      customerName: 'Customer name',
      customerEmail: 'Customeremail@gmail.com',
      orderId: 'Order ID',
      date: '5/12/25',
      status: 'new',
      amount: 0.00
    }
  ];

  const stats = {
    total: 1,
    pending: 0,
    completed: 0,
    revenue: 0.00
  };

  return (
    <AppLayout showBottomNav={true} userRole="vendor">
      <div className="min-h-screen bg-white">
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
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</p>
              <div className="flex items-center text-xs text-green-600">
                <span>+0.00%</span>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.pending}</p>
              <div className="flex items-center text-xs text-yellow-600">
                <span>+0.00%</span>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.completed}</p>
              <div className="flex items-center text-xs text-green-600">
                <span>+0.00%</span>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">₦{stats.revenue.toFixed(2)}</p>
              <div className="flex items-center text-xs text-green-600">
                <span>+0.00%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-4">All Orders</h2>
          
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {/* Customer Avatar */}
                  <div className="w-10 h-10 bg-system-blue-light rounded-full flex-shrink-0"></div>
                  
                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {order.customerName}
                        </h3>
                        <p className="text-xs text-gray-600 truncate">
                          {order.customerEmail}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
                        order.status === 'shipped' 
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status === 'shipped' ? 'Shipped' : 'New'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <p className="text-xs text-gray-600">Order ID</p>
                        <p className="text-sm font-medium text-gray-900">{order.orderId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">₦{order.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-600">{order.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}