'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useDeleteAccountMutation } from '@/lib/api/vendorApi';

export default function DeleteAccountPage() {
  const router = useRouter();
  const [deleteAccount, { isLoading, error: apiError }] = useDeleteAccountMutation();
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleDelete = async () => {
    setLocalError('');
    if (!password) {
        setLocalError('Please enter your password to confirm.');
        return;
    }

    try {
      await deleteAccount({ password }).unwrap();
      alert('Account closed successfully.');
      router.push('/login');
    } catch (err: any) {
      console.error('Failed to delete account:', err);
      setLocalError(err?.data?.message || 'Failed to delete account. Please check your password.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const currentError = localError || (apiError as any)?.data?.message;

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
            {/* X Icon */}
            <div className="w-16 h-16 bg-system-red rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            {/* Message */}
            <h2 className="text-center text-lg font-semibold text-gray-900 mb-4">
              Do you wish to<br />permanently close<br />to account?
            </h2>

            {currentError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{currentError}</p>
                </div>
            )}

            <div className="mb-6">
                <label className="text-xs text-gray-600 mb-2 block">Enter Password to Confirm</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-red"
                    placeholder="Password"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isLoading || !password}
                className="flex-1 py-3.5 bg-white text-gray-900 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Yes Please'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 py-3.5 bg-system-red text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
      </div>
    </AppLayout>
  );
}