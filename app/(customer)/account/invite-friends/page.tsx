"use client";

import AppLayout from '@/components/AppLayout';
import React, { useState } from 'react';
import { useGetCustomerProfileQuery } from '@/lib/api/customerApi';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function InviteFriendsPage() {
  const { data: profile, isLoading } = useGetCustomerProfileQuery();
  const [copied, setCopied] = useState(false);

  const referralCode = profile?.user.referral_code || '...';

  const handleBack = () => {
    window.history.back();
  };

  const handleCopyCode = () => {
    if (referralCode === '...') return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    if (referralCode === '...') return;
    const shareText = `Join me on this amazing shopping platform! Use my referral code: ${referralCode} to get exclusive discounts on your first order!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join me on Dandelionz',
        text: shareText,
        url: window.location.origin,
      }).catch(() => {
        // Fallback if sharing fails
        handleCopyCode();
      });
    } else {
      handleCopyCode();
    }
  };

  if (isLoading) {
    return (
        <AppLayout showBottomNav={false} userRole="customer">
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={false} userRole="customer">
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
        <button 
          onClick={handleBack} 
          className="absolute left-4 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-system-blue-light">Invite Friends</h1>
      </div>

      <div className="px-6 py-8">
        {/* Gift Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-system-blue-light rounded-3xl flex items-center justify-center shadow-lg">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-10">
          <div className="flex gap-4">
            <div className="shrink-0 w-8 h-8 bg-system-blue-light text-white rounded-full flex items-center justify-center font-semibold">
              1
            </div>
            <div className="pt-0.5">
              <p className="text-sm text-gray-700 leading-relaxed">
                Send an invite to a friend using your unique link/code
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="shrink-0 w-8 h-8 bg-system-blue-light text-white rounded-full flex items-center justify-center font-semibold">
              2
            </div>
            <div className="pt-0.5">
              <p className="text-sm text-gray-700 leading-relaxed">
                Your friend signs up
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="shrink-0 w-8 h-8 bg-system-blue-light text-white rounded-full flex items-center justify-center font-semibold">
              3
            </div>
            <div className="pt-0.5">
              <p className="text-sm text-gray-700 leading-relaxed">
                You&apos;ll get discounted prices when they make their first order
              </p>
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="mb-8">
          <label className="text-xs text-gray-500 mb-2 block font-medium">
            Your unique Code
          </label>
          <div className="relative">
            <input
              type="text"
              value={referralCode}
              readOnly
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-base font-semibold text-gray-900 focus:outline-none pr-14"
            />
            <button
              onClick={handleCopyCode}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Copy code"
            >
              {copied ? (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-system-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-xs text-green-600 mt-2 font-medium">Code copied to clipboard!</p>
          )}
        </div>

        {/* Invite Button */}
        <button
          onClick={handleInvite}
          className="w-full py-4 bg-system-blue-light text-white rounded-xl font-semibold hover:bg-[#020360] transition-colors shadow-lg shadow-blue-500/20"
        >
          Invite Friends
        </button>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-system-blue-light shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-gray-600 leading-relaxed">
              The more friends you invite, the more discounts you earn! There&apos;s no limit to how many friends you can refer.
            </p>
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}