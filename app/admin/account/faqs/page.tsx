'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Are you partnering with a Third Party Vendor for the installment payment processing?',
    answer: 'The answer to the question will be written here',
  },
  {
    question: 'If you are handling the installment payment, is it going to be subscription based?',
    answer: 'The answer to the question will be written here',
  },
  {
    question: 'What are the parameters to consider before delivering the product to the buyer? (On installment payments)',
    answer: 'The answer to the question will be written here',
  },
  {
    question: 'How do we ensure follow up after product delivery?',
    answer: 'The answer to the question will be written here',
  },
  {
    question: 'How is Dandelionz different from other e-commerce platforms? Do they offer services that other platforms don\'t offer?',
    answer: 'The answer to the question will be written here',
  },
  {
    question: 'Can I track my products in real-time?',
    answer: 'The answer to the question will be written here',
  },
  {
    question: 'How quick is your customer service response?',
    answer: 'The answer to the question will be written here',
  },
];

export default function FAQPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900 ml-4">FAQ</h1>
        </div>

        {/* FAQ List */}
        <div className="p-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-start justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900 pr-4 flex-1">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Answer */}
              {openIndex === index && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}