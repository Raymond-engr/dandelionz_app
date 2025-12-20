'use client';

import React, { use } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface PayoutDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function PayoutDetailsPage({ params: paramsPromise }: PayoutDetailsPageProps) {
  const params = use(paramsPromise);
  const router = useRouter();
  const payoutId = params.id;

  // Mock payout data
  const payout = {
    vendorName: 'Vendor Name',
    status: 'Paid', // or 'Pending'
    totalEarnings: '₦0.00',
    commissionDeducted: '₦0.00',
    netPayment: '₦0.00',
    orders: [
      { id: 'Order ID', amount: 'Amount', rate: '0%', commission: '-₦0.00' },
      { id: 'Order ID', amount: 'Amount', rate: '0%', commission: '-₦0.00' },
      { id: 'Order ID', amount: 'Amount', rate: '0%', commission: '-₦0.00' },
    ],
    platformFee: '-₦0.00',
    products: [
      { name: 'Product Name', orderId: 'Order ID', quantity: 'Quantity', date: 'Payment Date', amount: '+₦0.00' },
      { name: 'Product Name', orderId: 'Order ID', quantity: 'Quantity', date: 'Payment Date', amount: '+₦0.00' },
      { name: 'Product Name', orderId: 'Order ID', quantity: 'Quantity', date: 'Payment Date', amount: '+₦0.00' },
    ],
  };

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white pb-6">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-[#030482]">Payout Details</h1>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                VN
              </div>
              <p className="text-base font-semibold text-gray-900">{payout.vendorName}</p>
            </div>
            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
              payout.status === 'Paid'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {payout.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-xs text-gray-700 mb-1">Total Earnings</p>
              <p className="text-lg font-bold text-gray-900">{payout.totalEarnings}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-xs text-gray-700 mb-1">Commission Deducted</p>
              <p className="text-lg font-bold text-gray-900">{payout.commissionDeducted}</p>
            </div>
          </div>

          <div className="bg-[#030482] text-white rounded-lg p-4 mb-6">
            <p className="text-sm mb-1">Net Payment</p>
            <p className="text-3xl font-bold">{payout.netPayment}</p>
          </div>

          <h2 className="text-base font-semibold text-gray-900 mb-3">Commission & Fees Breakdown</h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-700 mb-3">
              <span>Order ID</span>
              <span>Amount</span>
              <span>Rate</span>
              <span>Commission</span>
            </div>
            {payout.orders.map((order, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2 text-xs text-gray-900 py-2 border-t border-gray-200">
                <span>{order.id}</span>
                <span>{order.amount}</span>
                <span>{order.rate}</span>
                <span className="text-red-600">{order.commission}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3 mt-3 border-t-2 border-gray-300">
              <span className="text-sm font-semibold text-gray-900">Platform Fee</span>
              <span className="text-sm font-bold text-red-600">{payout.platformFee}</span>
            </div>
          </div>

          <h2 className="text-base font-semibold text-gray-900 mb-3">Vendor Earnings Per Product</h2>
          <div className="space-y-3">
            {payout.products.map((product, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.orderId}</p>
                    <p className="text-xs text-gray-600">{product.quantity}</p>
                  </div>
                  <p className="text-base font-bold text-gray-900">{product.amount}</p>
                </div>
                <p className="text-xs text-green-600">{product.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}