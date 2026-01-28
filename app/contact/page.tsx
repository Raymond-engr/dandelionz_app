'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function ContactUsPage() {
  const router = useRouter();

  const handleCall = () => {
    window.location.href = 'tel:08083817902';
  };

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light ml-4">Contact Us</h1>
        </div>

        <div className="p-6">
          {/* Phone Numbers */}
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-2">
              <svg className="w-5 h-5 text-gray-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="text-sm text-gray-900 font-medium">08083817902</p>
                <p className="text-sm text-gray-900 font-medium">08141680059</p>
              </div>
            </div>

            <button
              onClick={handleCall}
              className="mt-3 px-8 py-2.5 bg-system-blue-light text-white rounded-full text-sm font-medium hover:bg-[#020360] transition-colors"
            >
              Call Us
            </button>
          </div>

          {/* Address */}
          <div className="mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm text-gray-700 leading-relaxed">
                No 1 Agbani Crescent Akwuke Road<br />
                Opposite Everistus Catholic Church Gariki<br />
                Enugu state.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}