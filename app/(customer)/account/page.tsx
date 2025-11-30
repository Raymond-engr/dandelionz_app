'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';

export default function AccountPage() {
  const user = {
    isLoggedIn: true, // Change to true to show logged in state
    name: 'John Doe',
    email: 'john@example.com',
  };

  const accountLinks = [
    { label: 'Profile', href: '/account/profile', icon: UserIcon },
    { label: 'Order', href: '/orders', icon: OrderIcon },
    { label: 'Delivery Address', href: '/account/addresses', icon: LocationIcon },
    { label: 'Payment Option', href: '/account/payment', icon: CardIcon },
  ];

  const otherLinks = [
    { label: 'FAQs', href: '/faqs', icon: QuestionIcon },
    { label: 'Terms and Conditions', href: '/terms', icon: DocumentIcon },
    { label: 'Contact Us', href: '/contact', icon: MailIcon },
  ];

  return (
    <AppLayout showBottomNav={true}>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">Account</h1>
        </div>

        {/* User Info / Sign In */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          {user.isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-system-blue-light/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-system-blue-light">
                  {user.name.charAt(0)}
                </span>
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
                <link.icon />
                <span className="text-sm font-medium text-gray-900">{link.label}</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Delete Account */}
        {user.isLoggedIn && (
          <div className="py-2 border-t border-gray-200">
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
function UserIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

function CardIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
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

function MailIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}