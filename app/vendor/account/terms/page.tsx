'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();

  const terms = [
    "Any product placed on our app by any vendors must be in stock for delivery at any given time.",
    "Should there arise a situation where a customer return any factory faulty items dandelion will send the product back to the vendor for exchange.",
    "Dandelion handle delivery directly so all vendors must send their items to dandelion after a customer complete their payments.",
    "Before becoming a vendor in our app your business must have a registered business name.",
    "Dandelion will be handling the payment of customer so therefore no payment by any customers will be received by any accounts other than the account approved by dandelion.",
    "Dandelion will take their percentage of each sale a vendor makes in their app as agreed by dandelion and the vendor.",
    "After payment by the customer dandelion will pay to the vendor through their registered business account that bears the business name.",
    "Vendors are mandated to report to dandelion immediately any goods goes out of stock.",
    "Vendors should note that dandelion does not sell any second handed products or pirated products in dandelion app.",
    "Vendors should bear in mind that is subject to return if it has any issues within the warranty period."
  ];

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Terms & Conditions</h1>
        </div>

        <div className="p-6">
          {/* Main Terms */}
          <ol className="space-y-4 mb-6">
            {terms.map((term, index) => (
              <li key={index} className="text-sm text-gray-700 leading-relaxed">
                <span className="font-medium">{index + 1}.</span> {term}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </AppLayout>
  );
}