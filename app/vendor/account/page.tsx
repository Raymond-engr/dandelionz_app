'use client';

import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector, useLogout } from '@/lib/hooks';
import { useGetVendorProfileQuery } from '@/lib/api/vendorApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function VendorAccountPage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data: profileData, isLoading } = useGetVendorProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const logout = useLogout();

  const user = {
    name: profileData?.data.user.full_name || '',
    email: profileData?.data.user.email || '',
    avatar: profileData?.data.user.profile_picture || null
  };

  if (isLoading) {
    return (
      <AppLayout showBottomNav={true} userRole="vendor">
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    // This is a fallback; middleware should handle primary protection.
    if (typeof window !== 'undefined') {
        router.push('/login');
    }
    return (
        <AppLayout showBottomNav={true} userRole="vendor">
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        </AppLayout>
    );
  }
  
  return (
    <AppLayout showBottomNav={true} userRole="vendor">
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
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
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
            href="/vendor/account/profile"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">My Profile</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/vendor/account/notifications"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">Notification</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/vendor/account/payment-settings"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">Payment Settings</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Logout & Close Account */}
        <div className="py-2 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex w-full items-center justify-start px-6 py-4 hover:bg-gray-50 transition-colors text-left"
          >
            <span className="text-sm font-medium text-system-red">Logout</span>
          </button>
          <Link
            href="/vendor/account/delete"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">Close Account</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Other Links */}
        <div className="py-2 border-t border-gray-200">
          <Link
            href="/vendor/account/faqs"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">FAQs</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/vendor/account/terms"
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
            <span className="text-sm font-medium text-gray-900">Contact Us</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}