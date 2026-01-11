'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetCustomerProfileQuery, usePartialUpdateCustomerProfileMutation } from '@/lib/api/customerApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();
  const { data: profileData, isLoading, error } = useGetCustomerProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = usePartialUpdateCustomerProfileMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const profile = profileData?.user;

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone_number: profile.phone_number || '',
        address: 'No. 13 JB Street, Ekosiodin, Edo State', // Placeholder
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile(formData).unwrap();
      alert('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <AppLayout showBottomNav={false} userRole="customer">
        <LoadingSpinner fullScreen />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout showBottomNav={false} userRole="customer">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load profile</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-system-blue-light text-white rounded-lg"
            >
              Retry
            </button>
          </div>
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
          <h1 className="text-lg font-semibold text-system-blue-light">Profile</h1>
        </div>

        <div className="p-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-2">
              {profile?.profile_picture ? (
                  <Image 
                                      src={profile.profile_picture} 
                                      alt="Profile" 
                                      width={64}
                                      height={64}
                                      className="w-full h-full rounded-full object-cover"
                                    />
                ) : (
                  <span className="text-2xl font-semibold text-gray-600">
                    {formData.full_name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </span>
                )}
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-system-blue-light rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{formData.full_name}</h2>
            <p className="text-sm text-gray-600">{formData.email}</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 mb-8">
            {/* Full Name */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="w-full px-0 py-2 bg-gray-50 text-sm text-gray-900 focus:outline-none"
                disabled={!isEditing}
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Email Address</label>
              <input
                type="email"
                value={formData.email}
                className="w-full px-0 py-2 bg-gray-50 text-sm text-gray-900 focus:outline-none"
                disabled
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Phone Number</label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                className="w-full px-0 py-2 bg-gray-50 text-sm text-gray-900 focus:outline-none"
                disabled={!isEditing}
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-0 py-2 bg-gray-50 text-sm text-gray-900 focus:outline-none"
                disabled={!isEditing}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value="••••••••"
                  className="w-full px-0 py-2 bg-gray-50 text-sm text-gray-900 focus:outline-none pr-10"
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <Link href="/account/change-password" className="text-sm text-system-blue-light font-medium mt-2 inline-block">
                Change Password
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    if (profile) {
                      setFormData({
                        full_name: profile.full_name || '',
                        email: profile.email || '',
                        phone_number: profile.phone_number || '',
                        address: 'No. 13 JB Street, Ekosiodin, Edo State',
                      });
                    }
                  }}
                  className="w-full py-3.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Discard
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}