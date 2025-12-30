'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useVerifyEmailMutation } from '@/lib/api/authApi';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [verifyEmail, { isLoading, isSuccess, isError, error }] = useVerifyEmailMutation();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (token) {
      verifyEmail({ token });
    }
  }, [token, verifyEmail]);

  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (isSuccess && countdown === 0) {
      router.push('/login');
    }
  }, [isSuccess, countdown, router]);

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        {isLoading && (
          <>
            <div className="w-16 h-16 border-4 border-system-blue-light border-t-transparent rounded-full animate-spin mb-6"></div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Verifying your email...</h1>
            <p className="text-sm text-gray-600 text-center">Please wait while we verify your email address</p>
          </>
        )}

        {isSuccess && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Email Verified!</h1>
            <p className="text-sm text-gray-600 text-center mb-4">
              Your email has been successfully verified. You can now login to your account.
            </p>
            <p className="text-sm text-gray-500">Redirecting to login in {countdown} seconds...</p>
            <button
              onClick={() => router.push('/login')}
              className="mt-6 px-6 py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Go to Login
            </button>
          </>
        )}

        {isError && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-sm text-gray-600 text-center mb-6">
              {(error as any)?.data?.message || 'The verification link is invalid or has expired.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/verify-email/resend')}
                className="px-6 py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
              >
                Resend Verification
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </>
        )}

        {!token && (
          <>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">No Verification Token</h1>
            <p className="text-sm text-gray-600 text-center mb-6">
              Please check your email for the verification link or request a new one.
            </p>
            <button
              onClick={() => router.push('/verify-email/resend')}
              className="px-6 py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Resend Verification Email
            </button>
          </>
        )}
      </div>
    </AppLayout>
  );
}