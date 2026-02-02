'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useSendVerificationEmailMutation } from '@/lib/api/authApi';
import { useRouter } from 'next/navigation';

export default function VerifyNoticePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sendVerification, { isLoading, isSuccess, isError, error }] = useSendVerificationEmailMutation();

  const handleSendVerification = () => {
    if (!email) return;
    sendVerification({ email });
  };

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        {!isSuccess ? (
          <>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Email Verification Required</h1>
            <p className="text-sm text-gray-600 mb-6 max-w-sm">
              Enter your email address to receive a new verification link.
            </p>
            
            <div className="w-full max-w-sm mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-system-blue-light text-sm"
              />
            </div>

            {isError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg w-full max-w-sm">
                <p className="text-sm text-red-600">
                  {(error as any)?.data?.message || 'An error occurred while sending the email. Please try again.'}
                </p>
              </div>
            )}

            <button
              onClick={handleSendVerification}
              disabled={isLoading || !email}
              className="px-8 py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Verification Email'}
            </button>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Email Sent!</h1>
            <p className="text-sm text-gray-600 mb-8 max-w-sm">
              A new verification link has been sent to your email address. Please check your inbox.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </AppLayout>
  );
}
