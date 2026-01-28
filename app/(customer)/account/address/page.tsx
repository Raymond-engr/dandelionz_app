'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useGetCustomerProfileQuery, usePartialUpdateCustomerProfileMutation } from '@/lib/api/customerApi';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DeliveryAddressPage() {
  const router = useRouter();
  
  const { data: profile, isLoading: isLoadingProfile } = useGetCustomerProfileQuery();
  const [partialUpdateProfile, { isLoading: isUpdating, isSuccess, error }] = usePartialUpdateCustomerProfileMutation();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const isDirty = profile ? (
    address !== (profile.shipping_address || '') ||
    city !== (profile.city || '') ||
    postalCode !== (profile.postal_code || '')
  ) : false;

  useEffect(() => {
    if (profile) {
      setAddress(profile.shipping_address || '');
      setCity(profile.city || '');
      setPostalCode(profile.postal_code || '');
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('shipping_address', address);
    formData.append('city', city);
    formData.append('postal_code', postalCode);

    try {
      await partialUpdateProfile(formData).unwrap();
      // Optionally show a success message before navigating
      router.back();
    } catch (err) {
      console.error('Failed to update address:', err);
    }
  };
  
  if (isLoadingProfile) {
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
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Delivery Address</h1>
        </div>

        <form onSubmit={handleSave} className="p-6">
          {isSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">Address updated successfully!</p>
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{(error as any)?.data?.message || 'Failed to update address.'}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
                    placeholder="e.g., 123 Main Street"
                />
            </div>
            <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
                    placeholder="e.g., Lagos"
                />
            </div>
            <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                    id="postalCode"
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
                    placeholder="e.g., 100211"
                />
            </div>
          </div>
          

          {/* Action Buttons */}
          <div className="space-y-3 mt-8">
            <button
              type="submit"
              disabled={isUpdating || !isDirty}
              className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
            {isDirty && (
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full py-3.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Discard Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </AppLayout>
  );
}