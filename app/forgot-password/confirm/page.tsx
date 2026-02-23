'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConfirmPasswordResetMutation } from '@/lib/api/authApi';
import PasswordCriteria, { validatePassword } from '@/components/PasswordCriteria';

export default function ConfirmPasswordResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [confirmPasswordReset, { isLoading, isSuccess, error: apiError }] = useConfirmPasswordResetMutation();

  // State for form fields and validation
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  // Extract directly to avoid flicker
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newPassword || !confirmPassword) {
      setFormError('Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    const criteria = validatePassword(newPassword);
    if (!criteria.length || !criteria.uppercase || !criteria.lowercase || !criteria.special) {
      setFormError('Password does not meet all security requirements.');
      return;
    }

    if (!uid || !token) {
        setFormError('Invalid or missing reset link parameters. Please request a new link.');
        return;
    }

    try {
        await confirmPasswordReset({ uid, token, new_password: newPassword }).unwrap();
    } catch (err) {
        console.error('Failed to reset password:', err);
    }
  };

  if (!uid || !token) {
    return (
        <AppLayout showBottomNav={false}>
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h1 className="text-xl font-semibold text-gray-900 mb-2">Invalid Link</h1>
                <p className="text-sm text-gray-600 mb-6">The password reset link is invalid or has expired. Please request a new one.</p>
                <button
                    onClick={() => router.push('/forgot-password')}
                    className="px-6 py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
                >
                    Request New Link
                </button>
            </div>
        </AppLayout>
    );
  }

  if (isSuccess) {
    return (
      <AppLayout showBottomNav={false}>
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Password Reset Successful</h1>
          <p className="text-sm text-gray-600 mb-6">You can now use your new password to log in.</p>
          <button
            onClick={() => router.replace('/login')}
            className="px-6 py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
          >
            Back to Login
          </button>
        </div>
      </AppLayout>
    );
  }

  const errorMessage = formError || (apiError as any)?.data?.error || (apiError as any)?.data?.message || null;

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen flex flex-col p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2 mt-16">
          Set a New Password
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Please create a new password for your account.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
                {errorMessage}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="new-password" className="text-sm text-gray-600">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-300 focus:border-system-blue-light focus:outline-none transition-colors"
              required
              disabled={isLoading}
            />
            {newPassword && <PasswordCriteria password={newPassword} />}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirm-password" className="text-sm text-gray-600">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-300 focus:border-system-blue-light focus:outline-none transition-colors"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Resetting Password...' : 'Set New Password'}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
