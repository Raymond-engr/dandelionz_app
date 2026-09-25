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

  const ugcTerms = [
    "Vendors are solely responsible for the accuracy, legality, and appropriateness of every product listing, photo, video, and description they upload to the platform.",
    "Dandelionz has zero tolerance for objectionable content of any kind, including but not limited to fraudulent, counterfeit, abusive, harassing, hateful, sexually explicit, or otherwise inappropriate listings, images, videos, or messages.",
    "Any customer may report a listing or a vendor directly from the app. Dandelionz reviews every report and reserves the right, at its sole discretion, to remove any listing or other content that violates these terms, without prior notice.",
    "Dandelionz reserves the right to suspend or permanently ban any account, vendor or customer, found to have posted objectionable content, engaged in fraudulent activity, or abused another user, at any time and without prior notice.",
    "A customer may block a vendor at any time from that vendor's product listings; blocking hides that vendor's listings from the blocking customer and is reversible from the same screen.",
    "Concerns about content, conduct, or account actions can be sent directly to our support team; see the Contact Us page for our current email and phone number.",
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

          {/* User-Generated Content & Conduct */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">User-Generated Content &amp; Conduct</h2>
            <ol className="space-y-4" start={8 + additionalTerms.length}>
              {ugcTerms.map((term, index) => (
                <li key={index} className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-medium">{index + 8 + additionalTerms.length}.</span> {term}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}