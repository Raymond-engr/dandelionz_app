'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useParams } from 'next/navigation';
import { useGetCustomerOrderDetailsQuery, useGetInstallmentPlansQuery, usePayInstallmentMutation, useCancelOrderMutation, useInitializeDeliveryPaymentMutation } from '@/lib/api/publicApi';
import { useGetCustomerWalletQuery } from '@/lib/api/customerApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { apiError } from '@/lib/utils';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const { data: response, isLoading: isLoadingOrder, error, refetch } = useGetCustomerOrderDetailsQuery(orderId);
  // Fetch plans to check if this order is an installment order
  const { data: plansResponse, isLoading: isLoadingPlans } = useGetInstallmentPlansQuery();
  const { data: walletData } = useGetCustomerWalletQuery();

  const [payInstallment, { isLoading: isPaying }] = usePayInstallmentMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [initDeliveryPayment, { isLoading: isPayingDelivery }] = useInitializeDeliveryPaymentMutation();
  const [cancelModal, setCancelModal] = React.useState(false);
  const [useDeliveryWallet, setUseDeliveryWallet] = React.useState(false);
  const [useInstallmentWallet, setUseInstallmentWallet] = React.useState(false);
  const [installmentAmount, setInstallmentAmount] = React.useState('');

  const order = response;
  const walletBalance = Number(walletData?.data?.balance ?? 0) || 0;
  const deliveryFee = order ? parseFloat(order.delivery_fee || '0') : 0;
  const goodsPaid = order ? (['PAID', 'SHIPPED', 'DELIVERED'].includes(order.status) || order.payment_status === 'PAID') : false;

  const handlePayDeliveryFee = async () => {
    if (!order) return;
    try {
      const payload = await initDeliveryPayment({
        order_id: order.order_id,
        use_wallet: useDeliveryWallet,
      }).unwrap();

      // The wallet covered the whole fee: it is already paid, so skip the Paystack redirect.
      if (payload.data?.requires_payment === false) {
        toast.success('Your wallet balance covered the delivery fee.');
        refetch();
        return;
      }

      if (payload.data?.authorization_url) {
        window.location.href = payload.data.authorization_url;
      } else {
        toast.error('Could not initiate delivery payment. Please try again.');
      }
    } catch (err: any) {
      toast.error(apiError(err, 'Could not initiate delivery payment.'));
    }
  };

  const formatDeliveryDate = (iso?: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
      : '';
  const canCancel = order && ['PENDING', 'PAID'].includes(order.status) && order.status !== 'CANCELLED';

  const confirmCancelOrder = async () => {
    try {
      const res = await cancelOrder(order!.order_id).unwrap();
      toast.success(res.message || 'Order cancelled successfully.');
      setCancelModal(false);
      router.back();
    } catch (err: any) {
      toast.error(apiError(err, 'Could not cancel order.'));
    }
  };

  const installmentPlans = plansResponse?.data || [];
  
  // Find the plan linked to this order
  const plan = order ? installmentPlans.find((p: any) => p.order_id === order.order_id) : null;

  // Use API timeline if available, otherwise fallback to empty
  const trackingSteps = order?.timeline?.map(step => ({
    label: step.label,
    date: step.timestamp ? new Date(step.timestamp).toLocaleDateString() : '',
    completed: step.completed
  })) || [];

  // Seed the amount input once the plan loads: default to the minimum due now when there is
  // one, otherwise to the advisory installment amount.
  React.useEffect(() => {
    if (!plan) return;
    const seed = plan.minimum_due_now > 0 ? plan.minimum_due_now : Number(plan.installment_amount || 0);
    setInstallmentAmount(seed > 0 ? String(seed) : '');
  }, [plan?.id, plan?.minimum_due_now, plan?.installment_amount]);

  // Pay down the running balance. `clear` pays off the whole balance (amount omitted);
  // otherwise the typed amount is sent, validated against the minimum due and the balance.
  const handlePayInstallment = async (clear: boolean) => {
    if (!plan) return;

    const body: { plan_id: number; amount?: number; clear_balance?: boolean; use_wallet?: boolean } = {
      plan_id: plan.id,
      use_wallet: useInstallmentWallet,
    };

    if (clear) {
      body.clear_balance = true;
    } else {
      const amt = parseFloat(installmentAmount);
      if (isNaN(amt) || amt <= 0) {
        toast.error('Enter a valid amount to pay.');
        return;
      }
      if (plan.minimum_due_now > 0 && amt < plan.minimum_due_now) {
        toast.error(`You must pay at least ₦${plan.minimum_due_now.toLocaleString()} now.`);
        return;
      }
      if (amt > plan.balance_remaining) {
        toast.error(`Amount can't exceed your balance of ₦${plan.balance_remaining.toLocaleString()}.`);
        return;
      }
      body.amount = amt;
    }

    try {
      const payload = await payInstallment(body).unwrap();

      // The wallet covered the whole payment: it is already settled, so skip the redirect.
      if (payload.data?.requires_payment === false) {
        toast.success('Your wallet balance covered the payment.');
        refetch();
        return;
      }

      if (payload.data?.authorization_url) {
        window.location.href = payload.data.authorization_url;
      } else {
        toast.error('Could not initiate the payment. Please try again.');
      }
    } catch (err: any) {
      toast.error(apiError(err, 'Could not initiate the payment.'));
    }
  };

  if (isLoadingOrder || isLoadingPlans) {
    return (
      <AppLayout showBottomNav={false} userRole="customer">
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  if (error || !order) {
    return (
      <AppLayout showBottomNav={false} userRole="customer">
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
    <AppLayout showBottomNav={false} userRole="customer">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light ml-4">Order Details</h1>
        </div>

        <div className="p-6">
          {/* Order Info */}
          <div className="mb-6 border border-gray-100 p-4 rounded-lg bg-gray-50 flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order ID: <span className="font-medium text-gray-900">{order.order_id}</span></p>
              <p className="text-sm text-gray-600">Order Date: <span className="font-medium text-gray-900">{order.ordered_at ? new Date(order.ordered_at).toLocaleDateString() : 'N/A'}</span></p>
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

          {/* Delivery window */}
          {order.expected_delivery_latest && (
            <div className="mb-6 border border-gray-100 p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">
                Arriving between{' '}
                <span className="font-medium text-gray-900">{formatDeliveryDate(order.expected_delivery_earliest)}</span>
                {' '}and{' '}
                <span className="font-medium text-gray-900">{formatDeliveryDate(order.expected_delivery_latest)}</span>
              </p>
              {deliveryFee > 0 && order.delivery_fee_paid && (
                <p className="text-xs text-green-700 font-medium mt-1">✓ Delivery fee paid</p>
              )}
            </div>
          )}

          {/* Delivery fee due */}
          {deliveryFee > 0 && !order.delivery_fee_paid && (
            <div className="mb-6 border border-amber-100 bg-amber-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-amber-800">Delivery fee</h3>
                <span className="text-sm font-bold text-gray-900">₦{deliveryFee.toLocaleString()}</span>
              </div>
              <p className="text-xs text-amber-700 mb-3">
                Pay your delivery fee to have your order shipped.
              </p>

              {walletBalance > 0 && (
                <label className="flex items-center gap-3 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={useDeliveryWallet}
                    onChange={(e) => setUseDeliveryWallet(e.target.checked)}
                    disabled={isPayingDelivery}
                    className="w-5 h-5 rounded border-gray-300 text-system-blue-light focus:ring-system-blue-light"
                  />
                  <span className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">Use wallet balance</span>
                    <span className="text-xs text-gray-500">
                      ₦{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                      available{useDeliveryWallet ? ' — anything left over goes on your card' : ''}
                    </span>
                  </span>
                </label>
              )}

              <button
                onClick={handlePayDeliveryFee}
                disabled={isPayingDelivery}
                className="w-full py-3 bg-system-blue-light text-white rounded-lg text-sm font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
              >
                {isPayingDelivery ? 'Processing...' : 'Pay delivery fee'}
              </button>
            </div>
          )}

          {/* Paid goods, not yet scheduled */}
          {goodsPaid && !order.expected_delivery_latest && (
            <div className="mb-6 border border-blue-100 bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                A delivery fee will be billed shortly. Shipping begins once it&apos;s paid.
              </p>
            </div>
          )}

          <div className="mb-6">

            {/* Installment Plan Section — running balance ("CDcare") */}
            {plan && (() => {
              const total = Number(plan.total_amount) || 0;
              const paidPct = Math.min(100, Math.max(0, plan.paid_fraction * 100));
              const isCompleted = plan.status === 'COMPLETED' || plan.is_fully_paid;

              return (
                <div className="mb-6 border border-blue-100 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-blue-800">Payment Plan ({plan.duration})</h3>
                    <span className="text-xs font-normal bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-700">
                      {isCompleted ? 'Completed' : plan.status === 'CANCELLED' ? 'Cancelled' : 'Active'}
                    </span>
                  </div>

                  {/* Totals */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-500">Total</p>
                      <p className="text-sm font-bold text-gray-900">₦{total.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-500">Paid</p>
                      <p className="text-sm font-bold text-green-700">₦{plan.amount_paid.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-500">Balance</p>
                      <p className="text-sm font-bold text-gray-900">₦{plan.balance_remaining.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Progress bar with a 50% "ships" marker */}
                  <div className="mb-1">
                    <div className="relative h-3 w-full rounded-full bg-blue-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-system-blue-light transition-all"
                        style={{ width: `${paidPct}%` }}
                      />
                      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-amber-500 -translate-x-1/2" />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-gray-500">{Math.round(paidPct)}% paid</span>
                      <span className="text-[10px] font-medium text-amber-600">ships at 50%</span>
                    </div>
                  </div>

                  {plan.paid_fraction >= 0.5 && !isCompleted && (
                    <p className="text-xs text-green-700 font-medium mt-2">✓ Half paid — your order can ship.</p>
                  )}

                  {isCompleted ? (
                    <div className="mt-3 p-3 rounded-md border border-green-100 bg-green-50">
                      <p className="text-sm text-green-700 font-medium">✓ Fully paid</p>
                    </div>
                  ) : (
                    <div className="mt-4 pt-3 border-t border-blue-100 space-y-3">
                      {/* Next due / minimum due */}
                      {(plan.next_due_date || plan.minimum_due_now > 0) && (
                        <div className="flex items-center justify-between text-xs">
                          {plan.next_due_date ? (
                            <span className="text-gray-600">
                              Next due{' '}
                              <span className="font-medium text-gray-900">
                                {new Date(plan.next_due_date).toLocaleDateString('en-NG', {
                                  day: 'numeric', month: 'short', year: 'numeric',
                                })}
                              </span>
                            </span>
                          ) : <span />}
                          {plan.minimum_due_now > 0 && (
                            <span className="font-bold text-amber-700">
                              ₦{plan.minimum_due_now.toLocaleString()} due now
                            </span>
                          )}
                        </div>
                      )}

                      {/* Amount input */}
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Amount to pay (₦)</label>
                        <input
                          type="number"
                          min={0}
                          step={100}
                          value={installmentAmount}
                          onChange={(e) => setInstallmentAmount(e.target.value)}
                          disabled={isPaying}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">
                          {plan.minimum_due_now > 0 ? `Minimum ₦${plan.minimum_due_now.toLocaleString()} · ` : ''}
                          Balance ₦{plan.balance_remaining.toLocaleString()}
                        </p>
                      </div>

                      {/* Wallet toggle (mirrors the delivery-fee panel) */}
                      {walletBalance > 0 && (
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={useInstallmentWallet}
                            onChange={(e) => setUseInstallmentWallet(e.target.checked)}
                            disabled={isPaying}
                            className="w-5 h-5 rounded border-gray-300 text-system-blue-light focus:ring-system-blue-light"
                          />
                          <span className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">Use wallet balance</span>
                            <span className="text-xs text-gray-500">
                              ₦{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                              available{useInstallmentWallet ? ' — anything left over goes on your card' : ''}
                            </span>
                          </span>
                        </label>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => handlePayInstallment(false)}
                          disabled={isPaying}
                          className="flex-1 py-3 bg-system-blue-light text-white rounded-lg text-sm font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
                        >
                          {isPaying ? 'Processing...' : 'Pay'}
                        </button>
                        <button
                          onClick={() => handlePayInstallment(true)}
                          disabled={isPaying}
                          className="flex-1 py-3 bg-white text-system-blue-light border border-system-blue-light rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          Clear balance
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Advisory schedule — reference only, no longer the pay unit */}
                  {plan.installments && plan.installments.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-blue-100">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Suggested schedule</p>
                      <div className="space-y-1.5">
                        {plan.installments.map((inst: any) => {
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
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
              {order.order_items?.map((item) => (
                <div key={item.id} className="border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{item.product.name}</h3>
                    <div className="flex justify-between">
                        <p className="text-sm text-system-blue-light font-semibold">
                          {typeof item.item_subtotal === 'number' 
                            ? item.item_subtotal.toLocaleString() 
                            : item.item_subtotal}
                        </p>
                        <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="relative">
            {trackingSteps.length > 0 ? (
                trackingSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 mb-6 last:mb-0">
                    {/* Timeline Circle */}
                    <div className="relative">
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
                ))
            ) : (
                <p className="text-sm text-gray-500 text-center">No tracking information available.</p>
            )}
          </div>

          {/* Cancel Order Section */}
          {canCancel && (
            <div className="mt-8">
              <button
                onClick={() => setCancelModal(true)}
                disabled={isCancelling}
                className="w-full py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
              {order?.status === 'PAID' && (
                <p className="text-xs text-red-500 text-center mt-2">
                  Refund will be processed in 1–3 business days
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 w-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Cancel Order?</h2>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {order?.status === 'PAID'
                ? 'This order has been paid. Cancelling will initiate a refund to your wallet. Are you sure you want to cancel?'
                : 'Are you sure you want to cancel this order? This action cannot be undone.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelModal(false)}
                className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                disabled={isCancelling}
              >
                No, Keep It
              </button>
              <button
                onClick={confirmCancelOrder}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}