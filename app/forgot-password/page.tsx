'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useRequestPasswordResetMutation } from '@/lib/api/authApi';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [requestReset, { isLoading, isSuccess, error }] = useRequestPasswordResetMutation();
  
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!email) {
      setValidationError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    try {
      await requestReset({ email }).unwrap();
    } catch (err: any) {
      console.error('Password reset request failed:', err);
      // Don't show error to prevent email enumeration
      // The API returns success even if email doesn't exist
    }
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
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h1>
          <p className="text-sm text-gray-600 text-center mb-6 max-w-md">
            If an account exists with <span className="font-semibold">{email}</span>, we've sent a password reset link to your email.
          </p>
          <p className="text-xs text-gray-500 text-center mb-6 max-w-md">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEmail('');
                window.location.reload();
              }}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen flex flex-col p-6">
        {/* Back Button */}
        <button onClick={() => router.back()} className="self-start mb-8">
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Forgot Password?
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {/* Error Message */}
        {(validationError || error) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              {validationError || 'An error occurred. Please try again.'}
            </p>
          </div>
        )}

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-gray-600">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-300 focus:border-system-blue-light focus:outline-none transition-colors"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>

          {/* Back to Login Link */}
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