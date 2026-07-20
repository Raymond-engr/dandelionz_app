'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { useGetFailedPaymentsQuery } from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { format as formatDate } from 'date-fns';

const STATUS_TABS = [
  { value: '', label: 'Needs attention' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'IGNORED', label: 'Unmatched' },
  { value: 'PROCESSED', label: 'Applied' },
];

const STATUS_STYLES: Record<string, string> = {
  FAILED: 'bg-red-100 text-red-700',
  IGNORED: 'bg-amber-100 text-amber-700',
  PROCESSED: 'bg-green-100 text-green-700',
  DUPLICATE: 'bg-gray-100 text-gray-600',
  RECEIVED: 'bg-blue-100 text-blue-700',
};

/**
 * Paystack deliveries that produced no ledger entry.
 *
 * Deliberately its own screen rather than rows in the ledger: the ledger records what
 * actually happened to balances, so folding failures into it would make every finance
 * total wrong. This is the working list for payments that need chasing.
 */
export default function AdminFailedPaymentsPage() {
  const router = useRouter();
  const [status, setStatus] = useState('');

  const { data, isLoading } = useGetFailedPaymentsQuery(
    status ? { status } : undefined
  );
  const events = data?.results ?? [];

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-[#030482]">Failed Payments</h1>
        </div>

        <div className="p-4 max-w-5xl mx-auto space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              These are Paystack notifications that never became a ledger entry — either the
              handler failed, or there was no matching order, deposit or payout to apply
              them to. They moved no money, which is why they are kept out of the finance
              ledger and its totals.
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatus(tab.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border ${
                  status === tab.value
                    ? 'bg-[#030482] text-white border-[#030482]'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 text-center text-gray-500 py-12">
              Nothing here. Every Paystack notification has been applied.
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl p-4 border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{event.event_type}</p>
                      <p className="text-xs text-gray-500 font-mono truncate">
                        {event.reference || 'no reference'}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded shrink-0 ${
                        STATUS_STYLES[event.status] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>

                  {event.error_message && (
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-2 mb-2 break-words">
                      {event.error_message}
                    </p>
                  )}

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>
                      {formatDate(new Date(event.received_at), 'dd MMM yyyy HH:mm')}
                    </span>
                    {!event.signature_valid && (
                      <span className="text-red-600 font-semibold">
                        Signature not verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
