'use client';

import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector, useLogout } from '@/lib/hooks';
import { useGetAdminProfileQuery } from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function AdminAccountPage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data: profileData, isLoading } = useGetAdminProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const logout = useLogout();

  const user = {
    name: profileData?.data.user.full_name || 'Admin User',
    email: profileData?.data.user.email || '',
    avatar: profileData?.data.user.profile_picture || null
  };

  if (isLoading) {
    return (
      <AppLayout showBottomNav={true} userRole="admin">
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
        router.push('/login');
    }
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
                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'A'}
              </span>
            )}
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
            <span className="text-sm font-medium text-gray-900">My Profile</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/admin/account/notifications"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">Notification</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/admin/account/payment-settings"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">Payment Settings</span>
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