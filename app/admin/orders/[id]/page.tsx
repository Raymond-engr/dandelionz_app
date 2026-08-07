'use client';

import React, { useState, use } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetAdminOrderDetailsQuery, useCancelOrderWithReasonMutation, useUpdateOrderStatusMutation, useGetAdminRefundsQuery, useSetOrderDeliveryMutation } from '@/lib/api/adminApi';
// Admins can read all installment plans via this same endpoint (customer: own; admin: all).
import { useGetInstallmentPlansQuery } from '@/lib/api/publicApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { OrderItem } from '@/lib/api/adminApi';
import toast from 'react-hot-toast';
import { apiError } from '@/lib/utils';

interface OrderDetailsProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetails({ params: paramsPromise }: OrderDetailsProps) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [action, setAction] = useState<'cancel' | 'process' | 'complete'>('cancel');
  const [reason, setReason] = useState('');

  const orderId = params.id;
  
  const { data: orderResponse, isLoading, error, refetch } = useGetAdminOrderDetailsQuery(orderId);
  let order = orderResponse;
  
  const { data: refundsData } = useGetAdminRefundsQuery(undefined, {
    skip: !order || !['CANCELED', 'CANCELLED'].includes(order.current_status || order.status || ''),
  });
  
  if (order && refundsData?.data) {
    const orderRefund = refundsData.data.find((r: any) => r.order_id === order?.order_id);
    if (orderRefund) {
      order = { ...order, refund_request: orderRefund };
    }
  }

  // Read-only installment plan for this order, if it has one.
  const { data: plansResponse } = useGetInstallmentPlansQuery(undefined, { skip: !order });
  const installmentPlan = order
    ? (plansResponse?.data || []).find((p) => p.order_id === order?.order_id)
    : undefined;

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderWithReasonMutation();
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [setOrderDelivery, { isLoading: isSavingDelivery }] = useSetOrderDeliveryMutation();

  // Delivery scheduling form. datetime-local wants "YYYY-MM-DDTHH:mm"; the API wants ISO.
  const [useDefaultWindow, setUseDefaultWindow] = useState(false);
  const [deliveryEarliest, setDeliveryEarliest] = useState('');
  const [deliveryLatest, setDeliveryLatest] = useState('');
  const [deliveryFeeInput, setDeliveryFeeInput] = useState('');

  const toLocalInput = (iso?: string | null) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    // Offset to local time so the value round-trips through the datetime-local control.
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  // Seed the form once the order loads.
  React.useEffect(() => {
    if (!order) return;
    setDeliveryFeeInput(order.delivery_fee != null ? String(parseFloat(order.delivery_fee)) : '');
    setDeliveryEarliest(toLocalInput(order.expected_delivery_earliest));
    setDeliveryLatest(toLocalInput(order.expected_delivery_latest));
  }, [order?.order_id, order?.delivery_fee, order?.expected_delivery_earliest, order?.expected_delivery_latest]);

  const handleSaveDelivery = async () => {
    if (!order) return;
    const fee = parseFloat(deliveryFeeInput);
    if (isNaN(fee) || fee < 0) {
      toast.error('Enter a valid delivery fee.');
      return;
    }

    const body: {
      order_id: string;
      delivery_fee: number;
      use_default?: boolean;
      expected_delivery_earliest?: string;
      expected_delivery_latest?: string;
    } = { order_id: order.order_id, delivery_fee: fee };

    if (useDefaultWindow) {
      body.use_default = true;
    } else {
      if (!deliveryEarliest || !deliveryLatest) {
        toast.error('Set both delivery dates or use the default window.');
        return;
      }
      if (new Date(deliveryEarliest) > new Date(deliveryLatest)) {
        toast.error('The earliest date must be on or before the latest date.');
        return;
      }
      body.expected_delivery_earliest = new Date(deliveryEarliest).toISOString();
      body.expected_delivery_latest = new Date(deliveryLatest).toISOString();
    }

    try {
      await setOrderDelivery(body).unwrap();
      toast.success('Delivery details updated.');
      refetch();
    } catch (err) {
      toast.error(apiError(err, 'Could not update delivery details.'));
    }
  };

  const formatDeliveryDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  const handleAction = async () => {
    if (!order) return;

    try {
      if (action === 'cancel') {
        if (!reason) {
          toast.error('Please provide a reason for cancellation.');
          return;
        }
        await cancelOrder({ order_id: order.order_id, reason }).unwrap();
      } else if (action === 'process') {
        await updateOrderStatus({ order_id: order.order_id, status: 'SHIPPED' }).unwrap();
      } else if (action === 'complete') {
        await updateOrderStatus({ order_id: order.order_id, status: 'DELIVERED' }).unwrap();
      }
      refetch();
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };
  
  // Use API timeline if available, otherwise fallback to improved local logic
  const trackingSteps = order?.timeline?.map(step => ({
    label: step.label,
    active: step.completed
  })) || [
    { label: 'Order Placed', active: !!order?.ordered_at },
    { label: 'Payment Confirmed', active: order?.payment_status === 'PAID' || order?.current_status === 'PAID' || order?.current_status === 'SHIPPED' || order?.current_status === 'DELIVERED' },
    { label: 'Product Shipped', active: order?.current_status === 'SHIPPED' || order?.current_status === 'DELIVERED' },
    { label: 'Delivered', active: order?.current_status === 'DELIVERED' },
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
                <p className="text-sm font-medium text-gray-900">
                  {order.customer?.full_name || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Email Address</label>
                <p className="text-sm font-medium text-gray-900">
                  {order.customer?.email || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Phone Number</label>
                <p className="text-sm font-medium text-gray-900">
                  {order.customer?.phone_number || 'N/A'}
                </p>
              </div>
              {order.shipping_address && (
                <div>
                   <label className="text-xs text-gray-600 block mb-1">Shipping Address</label>
                   <p className="text-sm font-medium text-gray-900">
                     {order.shipping_address.address}, {order.shipping_address.city}, {order.shipping_address.state}
                     {order.shipping_address.country ? `, ${order.shipping_address.country}` : ''}
                     {order.shipping_address.postal_code ? ` ${order.shipping_address.postal_code}` : ''}
                   </p>
                   {!!order.customer_lat && !!order.customer_lng && (
                     <a
                       href={`https://www.google.com/maps?q=${order.customer_lat},${order.customer_lng}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-sm font-medium text-system-blue-light hover:underline"
                     >
                       View on map ›
                     </a>
                   )}
                </div>
              )}
            </div>

            <h2 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h2>
            <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
              {order.order_items?.map((item: OrderItem, index: number) => (
                <div key={index} className="pb-2 border-b border-gray-200 last:border-b-0">
                  <p className="text-sm font-semibold text-gray-900 mb-2">{item.product_name}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Vendor:</span>
                    <span className="font-medium text-gray-900">{item.vendor_name || 'Unnamed Store'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium text-gray-900">{item.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">₦{item.item_subtotal.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-medium text-gray-900">₦{parseFloat(order.delivery_fee || '0').toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-1 pt-2 border-t border-gray-300">
                  <span className="text-base font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-base font-bold text-gray-900">₦{parseFloat(order.total_price || '0').toLocaleString()}</span>
                </div>
              </div>
            </div>

            <h2 className="text-sm font-semibold text-gray-900 mb-3">Delivery</h2>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
              {/* Current state */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Scheduled Window</label>
                  <p className="text-sm font-medium text-gray-900">
                    {order.expected_delivery_latest
                      ? `${formatDeliveryDate(order.expected_delivery_earliest)} — ${formatDeliveryDate(order.expected_delivery_latest)}`
                      : 'Not scheduled'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Delivery Fee</label>
                  <p className="text-sm font-medium text-gray-900">
                    ₦{parseFloat(order.delivery_fee || '0').toLocaleString()}{' '}
                    <span className={`text-xs font-semibold ${order.delivery_fee_paid ? 'text-green-600' : 'text-amber-600'}`}>
                      {order.delivery_fee_paid ? '(Paid)' : '(Unpaid)'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Scheduling form */}
              <div className="pt-3 border-t border-gray-200 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useDefaultWindow}
                    onChange={(e) => setUseDefaultWindow(e.target.checked)}
                    disabled={isSavingDelivery}
                    className="w-4 h-4 rounded border-gray-300 text-system-blue-light focus:ring-system-blue-light"
                  />
                  <span className="text-sm text-gray-900">Use default window (7–14 days)</span>
                </label>

                {!useDefaultWindow && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Earliest</label>
                      <input
                        type="datetime-local"
                        value={deliveryEarliest}
                        onChange={(e) => setDeliveryEarliest(e.target.value)}
                        disabled={isSavingDelivery}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Latest</label>
                      <input
                        type="datetime-local"
                        value={deliveryLatest}
                        onChange={(e) => setDeliveryLatest(e.target.value)}
                        disabled={isSavingDelivery}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-600 block mb-1">Delivery Fee (₦)</label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={deliveryFeeInput}
                    onChange={(e) => setDeliveryFeeInput(e.target.value)}
                    placeholder="0.00"
                    disabled={isSavingDelivery}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                  />
                </div>

                <button
                  onClick={handleSaveDelivery}
                  disabled={isSavingDelivery}
                  className="w-full py-3 bg-system-blue-light text-white rounded-lg text-sm font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
                >
                  {isSavingDelivery ? 'Saving...' : 'Save Delivery Details'}
                </button>
              </div>
            </div>

            {installmentPlan && (() => {
              const p = installmentPlan;
              const total = Number(p.total_amount) || 0;
              const paidPct = Math.min(100, Math.max(0, p.paid_fraction * 100));
              return (
                <>
                  <h2 className="text-sm font-semibold text-gray-900 mb-3">Installment Plan</h2>
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status ({p.duration})</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        p.status === 'COMPLETED' ? 'text-green-700 bg-green-100'
                        : p.status === 'CANCELLED' ? 'text-red-600 bg-red-100'
                        : 'text-blue-700 bg-blue-100'
                      }`}>{p.status}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-500">Total</p>
                        <p className="text-sm font-bold text-gray-900">₦{total.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-500">Paid</p>
                        <p className="text-sm font-bold text-green-700">₦{p.amount_paid.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-500">Balance</p>
                        <p className="text-sm font-bold text-gray-900">₦{p.balance_remaining.toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <div className="relative h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full rounded-full bg-system-blue-light" style={{ width: `${paidPct}%` }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-gray-500">{Math.round(paidPct)}% paid</span>
                        <span className="text-[10px] font-medium text-amber-600">ships once fully paid</span>
                      </div>
                    </div>

                    {p.next_due_date && (
                      <p className="text-xs text-gray-600">
                        Next due{' '}
                        <span className="font-medium text-gray-900">
                          {new Date(p.next_due_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </p>
                    )}

                    {p.installments && p.installments.length > 0 && (
                      <div className="pt-2 border-t border-gray-200 space-y-1.5">
                        <p className="text-xs font-semibold text-gray-600">Schedule</p>
                        {p.installments.map((inst: any) => {
                          const isPaid = inst.status === 'PAID';
                          const isOverdue = !isPaid && (inst.is_overdue ?? new Date(inst.due_date) < new Date());
                          return (
                            <div key={inst.payment_number} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">
                                #{inst.payment_number} · ₦{parseFloat(inst.amount).toLocaleString()} ·{' '}
                                {new Date(inst.due_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                              </span>
                              <span className={`font-bold px-2 py-0.5 rounded-full ${
                                isPaid ? 'text-green-700 bg-green-100'
                                : isOverdue ? 'text-red-600 bg-red-100'
                                : 'text-gray-500 bg-gray-100'
                              }`}>
                                {isPaid ? 'PAID' : isOverdue ? 'OVERDUE' : 'PENDING'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}

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

            {order.refund_request && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Refund Status</h2>
                <div className={`p-4 rounded-xl border ${
                  order.refund_request.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-200' :
                  order.refund_request.status === 'REJECTED' ? 'bg-red-50 border-red-200' :
                  'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900">
                      ₦{Number(order.refund_request.refunded_amount || order.refund_request.amount).toLocaleString()}
                    </span>
                    <span className={`font-bold text-xs ${
                      order.refund_request.status === 'APPROVED' ? 'text-emerald-600' :
                      order.refund_request.status === 'REJECTED' ? 'text-red-600' :
                      'text-amber-600'
                    }`}>
                      {order.refund_request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.refund_request.status === 'PENDING'
                      ? 'Refund requested. Go to Refund Requests to process.'
                      : order.refund_request.status === 'APPROVED'
                      ? 'Refund approved — customer wallet credited.'
                      : `Rejected: ${order.refund_request.rejection_reason || order.refund_request.reason || 'No reason provided'}`}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {(() => {
                const status = (order.status || order.current_status || '').toUpperCase();
                const isTerminal = status === 'DELIVERED' || status === 'CANCELED' || status === 'CANCELLED';
                const isPaid = order.payment_status?.toUpperCase() === 'PAID';
                
                if (isTerminal) return null;

                return (
                  <>
                    <select
                      value={action}
                      onChange={(e) => setAction(e.target.value as 'cancel' | 'process' | 'complete')}
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                        action === 'cancel'
                          ? 'border-system-red focus:ring-system-red text-system-red'
                          : 'border-gray-300 focus:ring-system-blue-light'
                      }`}
                    >
                      <option value="cancel">Cancel Order</option>
                      {isPaid && status !== 'SHIPPED' && (
                        <option value="process">Process Order</option>
                      )}
                      {isPaid && (
                        <option value="complete">Complete Order</option>
                      )}
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
                  </>
                );
              })()}

              {order.status === 'CANCELED' && (order.payment_status === 'PAID' || order.current_status === 'PAID') && (
                <button
                  onClick={() => router.push('/admin/refunds')}
                  className="w-full py-3 mt-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-bold transition-colors"
                >
                  Manage Refund Request
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}