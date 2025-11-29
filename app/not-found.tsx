'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

export default function NotFound() {
  const router = useRouter();

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        {/* 404 Icon */}
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* 404 Text */}
        <h1 className="text-6xl font-bold text-system-blue-light mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
          Page Not Found
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-md">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Go Back
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3.5 bg-white text-system-blue-light border border-system-blue-light rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </AppLayout>
  );
}