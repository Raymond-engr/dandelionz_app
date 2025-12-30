'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useResendVerificationEmailMutation } from '@/lib/api/authApi';

export default function ResendVerificationPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [resendVerification, { isLoading, isSuccess, isError, error }] = useResendVerificationEmailMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resendVerification({ email });
  };

  if (isSuccess) {
    return (
      <AppLayout showBottomNav={false}>
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Email Sent!</h1>
          <p className="text-sm text-gray-600 text-center mb-6 max-w-md">
            We've sent a verification link to <span className="font-semibold">{email}</span>. Please check your inbox and click the link to verify your account.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
          >
            Back to Login
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen flex flex-col p-6">
        <button onClick={() => router.back()} className="self-start mb-8">
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Resend Verification Email</h1>
        <p className="text-sm text-gray-600 mb-8">
          Enter your email address and we'll send you a new verification link.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-gray-600">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-300 focus:border-system-blue-light focus:outline-none transition-colors"
              required
            />
          </div>

          {isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {(error as any)?.data?.message || 'Failed to send verification email. Please try again.'}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? 'Sending...' : 'Send Verification Email'}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-system-blue-light font-medium"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </AppLayout>
  );
}