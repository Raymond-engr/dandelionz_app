'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetVendorProfileQuery, usePartialUpdateVendorProfileMutation } from '@/lib/api/vendorApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function VendorProfilePage() {
  const router = useRouter();
  const { data: profileData, isLoading, error } = useGetVendorProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = usePartialUpdateVendorProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    storeName: '',
    storeDescription: '',
    address: '',
    bank_name: '',
    account_number: '',
  });

  useEffect(() => {
    if (profilePictureFile) {
      const url = URL.createObjectURL(profilePictureFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [profilePictureFile]);

  useEffect(() => {
    if (profileData?.data) {
      const { user, ...vendorInfo } = profileData.data;
      setFormData({
        fullName: user.full_name || '',
        email: user.email || '',
        phoneNumber: user.phone_number || '',
        storeName: vendorInfo.store_name || '',
        storeDescription: vendorInfo.store_description || '',
        address: vendorInfo.address || '',
        bank_name: vendorInfo.bank_name || '',
        account_number: vendorInfo.account_number || '',
      });
    }
  }, [profileData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePictureFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    // Validation
    if (formData.account_number && !/^\d{10}$/.test(formData.account_number)) {
      toast.error('Account number must be exactly 10 digits.');
      return;
    }

    const updateData = new FormData();

    // Only append fields that have changed to be efficient
    if (formData.fullName !== profileData?.data.user.full_name) {
        updateData.append('full_name', formData.fullName);
    }
    if (formData.phoneNumber !== profileData?.data.user.phone_number) {
        updateData.append('phone_number', formData.phoneNumber);
    }
    if (formData.storeName !== profileData?.data.store_name) {
        updateData.append('store_name', formData.storeName);
    }
    if (formData.storeDescription !== profileData?.data.store_description) {
        updateData.append('store_description', formData.storeDescription);
    }
    if (formData.address !== profileData?.data.address) {
        updateData.append('address', formData.address);
    }
    if (formData.bank_name !== profileData?.data.bank_name) {
        updateData.append('bank_name', formData.bank_name);
    }
    if (formData.account_number !== profileData?.data.account_number) {
        updateData.append('account_number', formData.account_number);
    }
    if (profilePictureFile) {
        updateData.append('profile_picture', profilePictureFile);
    }
    
    // Check if any data has been changed
    if ([...updateData.entries()].length === 0) {
        setIsEditing(false);
        return;
    }

    try {
      await updateProfile(updateData).unwrap();
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setProfilePictureFile(null); // Reset file input after successful upload
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setProfilePictureFile(null);
    if (profileData?.data) {
        const { user, ...vendorInfo } = profileData.data;
        setFormData({
            fullName: user.full_name || '',
            email: user.email || '',
            phoneNumber: user.phone_number || '',
            storeName: vendorInfo.store_name || '',
            storeDescription: vendorInfo.store_description || '',
            address: vendorInfo.address || '',
            bank_name: vendorInfo.bank_name || '',
            account_number: vendorInfo.account_number || '',
        });
    }
  }

  if (isLoading) {
    return (
      <AppLayout showBottomNav={false} userRole="vendor">
        <LoadingSpinner fullScreen />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout showBottomNav={false} userRole="vendor">
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
  
  const profile = profileData?.data;
  const currentAvatar = previewUrl || profile?.user.profile_picture;

  return (
    <AppLayout showBottomNav={false} userRole="vendor">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">My Profile</h1>
        </div>

        <div className="p-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="w-16 h-16 bg-system-blue-light rounded-full flex items-center justify-center">
                    {currentAvatar ? (
                    <Image 
                        src={currentAvatar} 
                        alt="Profile" 
                        width={64}
                        height={64}
                        className="w-full h-full rounded-full object-cover"
                        unoptimized={!!previewUrl}
                    />
                    ) : (
                    <span className="text-2xl font-semibold text-white">
                        {formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || 'V'}
                    </span>
                    )}
                </div>
                {isEditing && (
                    <label htmlFor="profile-picture-upload" className="cursor-pointer absolute bottom-0 right-0 w-6 h-6 bg-system-blue-light rounded-full flex items-center justify-center border-2 border-white">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input type="file" id="profile-picture-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                )}
              </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">{formData.fullName}</h2>
              <p className="text-sm text-gray-600">{formData.email}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 mb-8">
            {/* Full Name */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-0 py-2 bg-transparent text-sm text-gray-900 border-b border-gray-300 focus:outline-none focus:border-system-blue-light"
                disabled={!isEditing}
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Email Address</label>
              <input
                type="email"
                value={formData.email}
                className="w-full px-0 py-2 bg-gray-100 text-sm text-gray-500 border-b border-gray-300 focus:outline-none"
                disabled
              />
            </div>

            {/* Store Name */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Store Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                className="w-full px-0 py-2 bg-transparent text-sm text-gray-900 border-b border-gray-300 focus:outline-none focus:border-system-blue-light"
                disabled={!isEditing}
              />
            </div>
            
            {/* Store Description */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Store Description</label>
              <textarea
                value={formData.storeDescription}
                onChange={(e) => setFormData({...formData, storeDescription: e.target.value})}
                className="w-full px-0 py-2 bg-transparent text-sm text-gray-900 border-b border-gray-300 focus:outline-none focus:border-system-blue-light"
                disabled={!isEditing}
                rows={3}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="w-full px-0 py-2 bg-transparent text-sm text-gray-900 border-b border-gray-300 focus:outline-none focus:border-system-blue-light"
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
                className="w-full px-0 py-2 bg-transparent text-sm text-gray-900 border-b border-gray-300 focus:outline-none focus:border-system-blue-light"
                disabled={!isEditing}
              />
            </div>

            {/* Bank Name */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Bank Name</label>
              <input
                type="text"
                value={formData.bank_name}
                onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                className="w-full px-0 py-2 bg-transparent text-sm text-gray-900 border-b border-gray-300 focus:outline-none focus:border-system-blue-light"
                disabled={!isEditing}
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Account Number</label>
              <input
                type="tel" 
                value={formData.account_number}
                onChange={(e) => setFormData({...formData, account_number: e.target.value})}
                className="w-full px-0 py-2 bg-transparent text-sm text-gray-900 border-b border-gray-300 focus:outline-none focus:border-system-blue-light"
                disabled={!isEditing}
                maxLength={10}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value="••••••••"
                  className="w-full px-0 py-2 bg-gray-100 text-sm text-gray-500 border-b border-gray-300 focus:outline-none"
                  readOnly
                />
              </div>
              <Link href="/vendor/account/change-password" className="text-sm text-system-blue-light font-medium mt-2 inline-block">
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
                  onClick={handleCancel}
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