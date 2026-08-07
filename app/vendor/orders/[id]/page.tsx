'use client';

import React, { use } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useGetVendorOrderDetailsQuery } from '@/lib/api/vendorApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ChevronLeft, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface VendorOrderDetailsProps {
  params: Promise<{ id: string }>;
}

export default function VendorOrderDetailsPage({ params: paramsPromise }: VendorOrderDetailsProps) {
  const params = use(paramsPromise);
  const router = useRouter();
  const orderId = params.id;

  const { data: response, isLoading, error } = useGetVendorOrderDetailsQuery(orderId);
  const order = response?.data;

  // Use API timeline if available, otherwise fallback to basic status display or empty
  const trackingSteps = order?.timeline?.map((step: any) => ({
    label: step.label,
    date: step.timestamp ? new Date(step.timestamp).toLocaleDateString() : '',
    completed: step.completed
  })) || [];

  if (isLoading) {
    return (
      <AppLayout showBottomNav={true} userRole="vendor">
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  if (error || !order) {
    return (
      <AppLayout showBottomNav={true} userRole="vendor">
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
          <p className="text-red-500 mb-4">Failed to load order details.</p>
          <button onClick={() => router.back()} className="text-system-blue-light underline">
            Go Back
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={true} userRole="vendor">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Order Details</h1>
        </div>

        <div className="p-6 pb-24">
          {/* Order Info */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-gray-600 truncate">Order ID: <span className="font-medium text-gray-900">{order.order_id}</span></p>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(order.order_id);
                          toast.success('Order ID copied to clipboard');
                        }}
                        className="text-gray-500 hover:text-system-blue-light transition-colors"
                        title="Copy Order ID"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">Date: <span className="font-medium text-gray-900">{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</span></p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                    order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                }`}>
                    {order.status}
                </span>
            </div>

            {/* Customer Info */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Customer</h3>
                <p className="text-sm font-medium text-gray-900">{order.customer?.full_name || 'N/A'}</p>
                <p className="text-xs text-gray-600">{order.customer?.email || 'N/A'}</p>
                {order.customer?.phone_number && <p className="text-xs text-gray-600">{order.customer.phone_number}</p>}
            </div>

            {/* Order Items */}
            <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Items</h3>
                <div className="border rounded-lg overflow-hidden">
                    {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="p-3 border-b last:border-0 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                {item.selected_variants && Object.keys(item.selected_variants).length > 0 && (
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {Object.entries(item.selected_variants).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                                  </p>
                                )}
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                                ₦{parseFloat(item.price || item.item_subtotal || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    )) || (order.order_items?.map((item: any, idx: number) => (
                        <div key={idx} className="p-3 border-b last:border-0 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                {item.selected_variants && Object.keys(item.selected_variants).length > 0 && (
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {Object.entries(item.selected_variants).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                                  </p>
                                )}
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                                ₦{parseFloat(item.item_subtotal || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    )))}
                </div>
                
                {/* Totals */}
                <div className="mt-4 flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <span className="text-lg font-bold text-system-blue-light">
                        ₦{parseFloat(order.total_amount || order.total_price || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
          </div>

          {/* Installment plan — read-only. Vendors can't act on it; this just explains why an
              order may already be PAID/SHIPPED while collection is still running, and that
              payout for it lands once the plan hits 100%, not before. */}
          {order.installment_plan && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Installment Plan</h3>
              <div className="border rounded-lg p-4">
                {order.installment_plan.status === 'COMPLETED' ? (
                  <p className="text-sm font-semibold text-green-700">Fully paid — payout released</p>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">
                        {Math.round((order.installment_plan.paid_fraction ?? 0) * 100)}% paid
                      </span>
                      <span className="text-xs text-gray-400">
                        ₦{order.installment_plan.amount_paid.toLocaleString()} of ₦{order.installment_plan.total_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full mb-2 overflow-hidden">
                      <div
                        className="h-full bg-system-blue-light rounded-full"
                        style={{ width: `${Math.min(Math.max((order.installment_plan.paid_fraction ?? 0) * 100, 0), 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-amber-700">
                      Customer is still paying this off. Your payout is released once it&apos;s fully paid.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Tracking Timeline */}
          {trackingSteps.length > 0 && (
            <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Timeline</h3>
                <div className="relative pl-2">
                    {trackingSteps.map((step: any, index: number) => (
                    <div key={index} className="flex items-start gap-4 mb-6 last:mb-0">
                        {/* Timeline Circle */}
                        <div className="relative z-10">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            step.completed 
                            ? 'bg-system-blue-light border-system-blue-light' 
                            : 'bg-white border-gray-300'
                        }`}>
                            {step.completed && (
                            <div className="w-3 h-3 rounded-full bg-white"></div>
                            )}
                        </div>
                        {/* Connecting Line */}
                        {index < trackingSteps.length - 1 && (
                            <div className={`absolute left-1/2 top-6 w-0.5 h-10 -translate-x-1/2 ${
                            step.completed ? 'bg-system-blue-light' : 'bg-gray-300'
                            }`} />
                        )}
                        </div>

                        {/* Step Info */}
                        <div className="flex-1 pt-0.5">
                        <p className={`text-sm font-medium ${
                            step.completed ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                            {step.label}
                        </p>
                        {step.date && <p className="text-xs text-gray-500">{step.date}</p>}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
