'use client';

import React, { useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import Image from 'next/image';
import { useGetCustomerProfileQuery } from '@/lib/api/customerApi';
import { useAppSelector, useLogout } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AccountPage() {
  const router = useRouter();
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);

  const { data: profile, isLoading } = useGetCustomerProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const logout = useLogout();
  
  const accountLinks = [
    { label: 'Profile', href: '/account/profile', icon: UserIcon },
    { label: 'Notifications', href: '/account/notifications', icon: BellIcon, showBadge: true },
    { label: 'Wallet', href: '/account/wallet', icon: WalletIcon },
    { label: 'Payment Settings', href: '/account/payment-settings', icon: CardIcon },
    { label: 'Order', href: '/orders', icon: OrderIcon },
    { label: 'Track Order', href: '/order-tracking', icon: TrackIcon },
    { label: 'Delivery Address', href: '/account/address', icon: LocationIcon },
  ];

  const otherLinks: { label: string; href: string; icon: () => JSX.Element; external?: boolean }[] = [
    { label: 'FAQs', href: '/faqs', icon: QuestionIcon },
    { label: 'Terms and Conditions', href: '/terms', icon: DocumentIcon },
    { label: 'Privacy Policy', href: 'https://dandelionz.com.ng/privacy.html', icon: ShieldIcon, external: true },
    { label: 'Contact Us', href: '/contact', icon: MailIcon },
  ];

  if (!isMounted || isLoading) {
    return (
      <AppLayout showBottomNav={true} userRole="customer">
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  const user = {
    isLoggedIn: isAuthenticated,
    name: profile?.user.full_name || '',
    email: profile?.user.email || '',
    avatar: profile?.user.profile_picture || null,
  };
  
  return (
    <AppLayout showBottomNav={true} userRole="customer">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">Account</h1>
        </div>

        {/* User Info / Sign In */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          {user.isLoggedIn && profile ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-system-blue-light/10 rounded-full flex items-center justify-center">
                {user.avatar ? (
                    <Image src={user.avatar} alt={user.name} width={64} height={64} className="rounded-full object-cover"/>
                ) : (
                    <span className="text-2xl font-semibold text-system-blue-light">
                        {user.name.charAt(0).toUpperCase()}
                    </span>
                )}
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="block text-center py-3 bg-white border border-system-blue-light text-system-blue-light rounded-lg font-medium hover:bg-system-blue-light hover:text-white transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Account Links */}
        <div className="py-2">
          {accountLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <link.icon />
                  {/* Notification Badge */}
                  {link.showBadge && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white box-content">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900">{link.label}</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
        
        {/* Logout & Delete Account */}
        {user.isLoggedIn && (
          <div className="py-2 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex w-full items-center justify-start px-6 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <span className="text-sm font-medium text-system-red">Logout</span>
            </button>
            <Link
              href="/account/delete"
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-system-red">Delete Account</span>
              <svg className="w-5 h-5 text-system-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}

        {/* Other Links */}
        <div className="py-2 border-t border-gray-200">
          {otherLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <link.icon />
                <span className="text-sm font-medium text-gray-900">{link.label}</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Invite Friends Link */}
        {user.isLoggedIn && (
        <div className="py-2 border-t border-gray-200">
          <Link
            href="/account/invite-friends"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Invite Friends</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        )}

        {/* Sign In Button at Bottom (when not logged in) */}
        {!user.isLoggedIn && (
          <div className="p-6 pt-8">
            <Link
              href="/login"
              className="block text-center py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// Icon Components
function BellIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
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

function OrderIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}


function QuestionIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function TrackIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}