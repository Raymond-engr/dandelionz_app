'use client';

import React, { useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector, useLogout } from '@/lib/hooks';
import { useGetAdminProfileQuery } from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function AdminAccountPage() {
  const router = useRouter();
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: profileData, isLoading } = useGetAdminProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const logout = useLogout();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  const user = {
    name: profileData?.data.full_name || 'Admin User',
    email: profileData?.data.email || '',
    avatar: profileData?.data.profile_picture || null
  };

  if (!isMounted || isLoading) {
    return (
      <AppLayout showBottomNav={true} userRole="admin">
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    return (
        <AppLayout showBottomNav={true} userRole="admin">
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={true} userRole="admin">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 text-center">
          <h1 className="text-xl font-bold text-gray-900">Account</h1>
        </div>

        {/* User Info */}
        <div className="p-6 flex items-center gap-4 border-b border-gray-200">
          <div className="w-16 h-16 bg-system-blue-light rounded-full flex items-center justify-center shrink-0">
            {user.avatar ? (
              <Image src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" width={64} height={64} />
            ) : (
                              <span className="text-2xl font-semibold text-white">
                                  {user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'A'}
                              </span>            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h2>
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <Link
            href="/admin/account/profile"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <UserIcon />
              <span className="text-sm font-medium text-gray-900">My Profile</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/admin/account/change-password"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LockIcon />
              <span className="text-sm font-medium text-gray-900">Change Password</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/admin/account/notifications"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900 ml-8">Notification</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/admin/account/payment-settings"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900 ml-8">Payment Settings</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Admin Account Links */}
        <div className="py-2 border-t border-gray-200">
          <Link
            href="/admin/account/analytics"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">Analytics</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/admin/account/settlements"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">Payments & Settlements</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/admin/account/withdrawal"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">Withraw Earnings</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Other Links */}
        <div className="py-2 border-t border-gray-200">
          <Link
            href="/admin/account/faqs"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">FAQs</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href="/admin/account/terms"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">Terms and Conditions</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href="/contact"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">Contact Support</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Logout */}
        <div className="py-2 border-t border-gray-200">
            <button
                onClick={logout}
                className="flex w-full items-center justify-start px-6 py-4 hover:bg-gray-50 transition-colors text-left"
            >
                <span className="text-sm font-medium text-system-red">Logout</span>
            </button>
        </div>
      </div>
    </AppLayout>
  );
}

function UserIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}
