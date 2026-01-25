'use client';

import React, { useState, use } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetOrderDetailsQuery, useCancelOrderWithReasonMutation, useUpdateOrderStatusMutation } from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { OrderItem } from '@/lib/api/adminApi';

interface OrderDetailsProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetails({ params: paramsPromise }: OrderDetailsProps) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [action, setAction] = useState<'cancel' | 'process' | 'complete'>('cancel');
  const [reason, setReason] = useState('');

  const orderId = params.id;
  
  const { data: orderData, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderWithReasonMutation();
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const order = orderData?.data;

  const handleAction = async () => {
    if (!order) return;

    try {
      if (action === 'cancel') {
        if (!reason) {
          alert('Please provide a reason for cancellation.');
          return;
        }
        await cancelOrder({ order_id: order.order_id, reason }).unwrap();
      } else if (action === 'process') {
        await updateOrderStatus({ order_id: order.order_id, status: 'PROCESSING' }).unwrap();
      } else if (action === 'complete') {
        await updateOrderStatus({ order_id: order.order_id, status: 'DELIVERED' }).unwrap();
      }
      refetch();
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };
  
  const trackingSteps = [
    { label: 'Order Placed', active: order?.status === 'PENDING' || order?.status === 'PROCESSING' || order?.status === 'SHIPPED' || order?.status === 'DELIVERED' },
    { label: 'Product Shipped', active: order?.status === 'SHIPPED' || order?.status === 'DELIVERED' },
    { label: 'Ready for pickup', active: order?.status === 'DELIVERED' },
    { label: 'Collected', active: false },
  ];
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Failed to load order details.</p>
        <button onClick={() => router.back()} className="px-4 py-2 bg-system-blue-light text-white rounded-lg">
          Go Back
        </button>
      </div>
    );
  }

  const deliveryFee = 0;
  const totalAmount = parseFloat(order.total_amount) + deliveryFee;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[600px] bg-white relative">
        <div className="min-h-screen bg-white pb-6">
          <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
            <button onClick={() => router.back()} className="absolute left-4">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-lg font-semibold text-system-blue-light">Order Details</h1>
          </div>

          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h2>
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Full Name</label>
                <p className="text-sm font-medium text-gray-900">{order.customer.full_name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Email Address</label>
                <p className="text-sm font-medium text-gray-900">{order.customer.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Phone Number</label>
                <p className="text-sm font-medium text-gray-900">{order.customer.phone_number || 'N/A'}</p>
              </div>
            </div>

            <h2 className="text-sm font-semibold text-gray-900 mb-3">Vendor Information</h2>
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Store Name</label>
                <p className="text-sm font-medium text-gray-900">{order.vendor.store_name}</p>
              </div>
            </div>

            <h2 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h2>
            <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
              {order.order_items?.map((item: OrderItem, index: number) => (
                <div key={index} className="pb-2 border-b border-gray-200 last:border-b-0">
                  <p className="text-sm font-semibold text-gray-900 mb-2">{item.product_name}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium text-gray-900">{item.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">₦{parseFloat(item.item_subtotal).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-medium text-gray-900">₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-1 pt-2 border-t border-gray-300">
                  <span className="text-base font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-base font-bold text-gray-900">₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <h2 className="text-sm font-semibold text-gray-900 mb-3">Order Tracking Status</h2>
            <div className="mb-6">
              <div className="space-y-4">
                {trackingSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${ step.active ? 'bg-system-blue-light' : 'border-2 border-gray-300 bg-white' }`}>
                        {step.active && (<div className="w-3 h-3 rounded-full bg-white"></div>)}
                      </div>
                      {idx < trackingSteps.length - 1 && (<div className={`w-0.5 h-8 ${ idx < trackingSteps.findIndex(s => s.active === false) -1 ? 'bg-system-blue-light' : 'bg-gray-300' }`}></div>)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{step.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as 'cancel' | 'process' | 'complete')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              >
                <option value="cancel">Cancel Order</option>
                <option value="process">Process Order</option>
                <option value="complete">Complete Order</option>
              </select>

              {action === 'cancel' && (
                <textarea
                  placeholder="Reason for action..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light min-h-[80px] resize-none"
                />
              )}

              <button 
                onClick={handleAction}
                className="w-full py-3 bg-system-blue-light text-white rounded-lg text-sm font-medium hover:bg-[#020360] transition-colors disabled:bg-gray-400"
                disabled={isCancelling || isUpdating || (action === 'cancel' && !reason)}
              >
                {isCancelling || isUpdating ? <LoadingSpinner /> : 'Confirm Action'}
              </button>

              <button
                onClick={() => router.back()}
                className="w-full py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}