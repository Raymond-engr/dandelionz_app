'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useParams } from 'next/navigation';
import { useGetCustomerOrderDetailsQuery, useGetInstallmentPlansQuery, useInitializeNextInstallmentMutation, useCancelOrderMutation } from '@/lib/api/publicApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const { data: response, isLoading: isLoadingOrder, error } = useGetCustomerOrderDetailsQuery(orderId);
  // Fetch plans to check if this order is an installment order
  const { data: plansResponse, isLoading: isLoadingPlans } = useGetInstallmentPlansQuery();
  
  const [initNextInstallment, { isLoading: isPaying }] = useInitializeNextInstallmentMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [cancelModal, setCancelModal] = React.useState(false);

  const order = response;
  const canCancel = order && ['PENDING', 'PAID'].includes(order.status) && order.status !== 'CANCELLED';

  const confirmCancelOrder = async () => {
    try {
      const res = await cancelOrder(order!.order_id).unwrap();
      toast.success(res.message || 'Order cancelled successfully.');
      setCancelModal(false);
      router.back();
    } catch (err: any) {
      toast.error(err?.data?.error || 'Could not cancel order.');
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

  const handlePayNextInstallment = async (planId: number, nextPaymentNumber: number) => {
    try {
      const payload = await initNextInstallment({ 
        plan_id: planId, 
        payment_number: nextPaymentNumber 
      }).unwrap();

      if (payload.data?.authorization_url) {
        window.location.href = payload.data.authorization_url;
      } else {
        toast.error("Failed to get payment link.");
      }
    } catch (err: any) {
        console.error("Installment payment failed", err);
        toast.error(err?.data?.message || "Could not initiate payment.");
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
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Order ID: <span className="font-medium text-gray-900">{order.order_id}</span></p>
            <p className="text-sm text-gray-600 mb-3">Order Date: <span className="font-medium text-gray-900">{order.ordered_at ? new Date(order.ordered_at).toLocaleDateString() : 'N/A'}</span></p>

            {/* Installment Plan Section */}
            {plan && (
              <div className="mb-6 border border-blue-100 bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-bold text-blue-800 mb-2 flex justify-between">
                  Payment Plan ({plan.duration})
                  <span className="text-xs font-normal bg-white px-2 py-0.5 rounded border border-blue-200">
                    {plan.paid_installments_count} / {plan.number_of_installments} Paid
                  </span>
                </h3>
                
                {/* Per-installment breakdown with due date + overdue state */}
                {!plan.is_fully_paid && (
                  <div className="mt-3 space-y-2">
                    {plan.installments?.map((inst: any) => {
                      const isPaid = inst.status === 'PAID';
                      const isOverdue = !isPaid && (inst.is_overdue ?? new Date(inst.due_date) < new Date());
                      const isNext = !isPaid && plan.installments!.filter((i: any) => i.status !== 'PAID').indexOf(inst) === 0;

                      return (
                        <div
                          key={inst.payment_number}
                          className={`flex items-center justify-between p-3 rounded-md border ${
                            isPaid ? 'border-green-100 bg-green-50'
                            : isOverdue ? 'border-red-100 bg-red-50'
                            : isNext ? 'border-blue-200 bg-white'
                            : 'border-gray-100 bg-gray-50'
                          }`}
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              Installment #{inst.payment_number} — ₦{parseFloat(inst.amount).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Due {new Date(inst.due_date).toLocaleDateString('en-NG', {
                                day: 'numeric', month: 'short', year: 'numeric',
                              })}
                            </p>
                          </div>

                          {isPaid ? (
                            <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Paid</span>
                          ) : isNext ? (
                            <button
                              onClick={() => handlePayNextInstallment(plan.id, inst.payment_number)}
                              disabled={isPaying}
                              className="py-1.5 px-3 bg-system-blue-light text-white text-xs rounded-md font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
                            >
                              {isPaying ? 'Processing...' : 'Pay Now'}
                            </button>
                          ) : (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              isOverdue ? 'text-red-600 bg-red-100' : 'text-gray-500 bg-gray-100'
                            }`}>
                              {isOverdue ? 'Overdue' : 'Upcoming'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {plan.is_fully_paid && (
                   <p className="text-sm text-green-700 font-medium mt-2">✓ Plan Fully Paid</p>
                )}
              </div>
            )}

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