'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();

  const terms = [
    "Users are mandated to register with what includes their names, address and other confidential information during on the dandelion app",
    "Your purchased items are to be delivered within the space of five working days.",
    "Users are mandated to return factory faulty items within the space of two weeks after delivery.",
    "Items are to be delivered once the payment is completed.",
    "Items can be purchased by tier installment payments hence the payment",
    "Purchase made from dandelion app can only be delivered by dandelion delivery agents with the company seal and signature.",
    "All goods sold in good condition are not subject to return.",
  ];

  const note = "Even as dandelion thrives to satisfy the demand of any customers should there be a situation whereby a particular commodity goes out of stock from the warehouse, dandelion shall take it upon themselves but not be held responsible rather dandelion will relate to the customer of the present situation.";

  const additionalTerms = [
    "Users are mandate to keep their account details private, cause dandelion will not be held responsible should it fall into wrong hands.",
    "A user is entitled to one account and should not be used or operated by more than a person.",
    "Prices of items in dandelion app can inflate or deflect depending on the current state of commerce surrounding the items.",
    "Only items will factory fault are subject to return",
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

          {/* Note Section */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Note</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{note}</p>
          </div>

          {/* Additional Terms */}
          <ol className="space-y-4" start={8}>
            {additionalTerms.map((term, index) => (
              <li key={index} className="text-sm text-gray-700 leading-relaxed">
                <span className="font-medium">{index + 8}.</span> {term}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </AppLayout>
  );
}