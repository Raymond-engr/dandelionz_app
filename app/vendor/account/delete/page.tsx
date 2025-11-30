'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function DeleteAccountPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);

  const handleDelete = () => {
    console.log('Account deleted');
    router.push('/vendor');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        {showModal && (
          <div className="w-full max-w-sm">
            {/* X Icon */}
            <div className="w-16 h-16 bg-system-red rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            {/* Message */}
            <h2 className="text-center text-lg font-semibold text-gray-900 mb-8">
              Do you wish to<br />permanently close<br />to account?
            </h2>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 py-3.5 bg-white text-gray-900 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Yes Please
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-3.5 bg-system-red text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}