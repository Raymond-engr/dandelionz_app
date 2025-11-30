'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSettingsPage() {
  const router = useRouter();

  return (
    <AppLayout showBottomNav={false} userRole="vendor">
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Payment Settings</h1>
        </div>

        <div className="p-6">
          {/* Payment PIN Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment PIN</h2>
            <div className="space-y-1">
              <Link
                href="/vendor/account/payment-settings/change-pin"
                className="flex items-center justify-between px-0 py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">Change Payment PIN</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/vendor/account/payment-settings/forgot-pin"
                className="flex items-center justify-between px-0 py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">Forgot Payment PIN</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Withdrawal Details Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Withdrawal Details</h2>
            <Link
              href="/vendor/account/payment-settings/store-payment"
              className="flex items-center justify-between px-0 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">Store Payment Option</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}