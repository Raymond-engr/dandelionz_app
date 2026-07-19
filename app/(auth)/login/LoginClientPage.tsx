'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLoginMutation } from '@/lib/api/authApi';
import { useAppDispatch } from '@/lib/hooks';
import { setCredentials } from '@/lib/features/auth/authSlice';
import { apiError } from '@/lib/utils';
import { isSafeRedirectTarget } from '@/lib/redirects';

export default function LoginClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationError, setValidationError] = useState('');

  const redirect = searchParams.get('redirect');
  // searchParams.get() decodes the value, so a redirect carrying its own query string
  // ("/account/wallet/deposit/callback?reference=DEP-X") arrives intact here.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.email || !formData.password) {
      setValidationError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      // Store auth data
      dispatch(setCredentials({
        user: result.data.user,
        accessToken: result.data.tokens.access_token,
        refreshToken: result.data.tokens.refresh_token,
      }));

      // Store in cookies for middleware
      document.cookie = `access_token=${result.data.tokens.access_token}; path=/`;
      document.cookie = `user_role=${result.data.user.role}; path=/`;

      // Check if the user's email is verified
      if (!result.data.user.is_verified) {
        router.push('/verify-notice');
        return;
      }

      // Role-based routing
      const userRole = result.data.user.role;
      
      // Never navigate to `redirect` unchecked: it comes from the query string, so an
      // unvalidated push would let /login?redirect=https://evil.com send a user off-site
      // immediately after they entered their password.
      if (isSafeRedirectTarget(redirect)) {
        router.push(redirect as string);
      } else {
        switch (userRole) {
          case 'BUSINESS_ADMIN':
            router.push('/admin');
            break;
          case 'VENDOR':
            router.push('/vendor');
            break;
          case 'CUSTOMER':
            router.push('/');
            break;
          default:
            router.push('/');
        }
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      // Handle unverified email error from backend (403 Forbidden)
      if (err?.status === 403 && err?.data?.email_not_verified) {
        // Pass email as query param so verify-notice can use it
        router.push(`/verify-notice?email=${encodeURIComponent(formData.email)}`);
        return;
      }
      if (err?.status === 403) {
        setValidationError(
          apiError(err, 'Your account has been suspended. Please contact support.')
        );
        return;
      }
      setValidationError(apiError(err, 'Invalid email or password'));
    }
  };

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen flex flex-col p-6">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <Link href="/" className="text-sm font-medium text-system-blue-light">
            Go to Home
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Login to your Dandelionz Account
        </h1>

        {/* Error Message */}
        {(validationError || error) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              {validationError || apiError(error, 'An error occurred')}
            </p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-gray-600">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border-b border-gray-300 focus:border-system-blue-light focus:outline-none transition-colors"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm text-gray-600">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border-b border-gray-300 focus:border-system-blue-light focus:outline-none transition-colors pr-10"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <Link href="/forgot-password" className="text-sm text-system-blue-light font-medium self-start">
            Forgot Password?
          </Link>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-system-blue-light font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </AppLayout>
  );
}
