'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetCustomerProfileQuery, useUpdateCustomerProfileMutation, useUploadCustomerPhotoMutation } from '@/lib/api/customerApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { data: profileData, isLoading, error } = useGetCustomerProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateCustomerProfileMutation();
  const [uploadPhoto, { isLoading: isUploading }] = useUploadCustomerPhotoMutation();


  const [isEditing, setIsEditing] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    shipping_address: '',
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
    if (profileData) {
      setFormData({
        fullName: profileData.user.full_name || '',
        email: profileData.user.email || '',
        phoneNumber: profileData.user.phone_number || '',
        shipping_address: profileData.shipping_address || '',
      });
    }
  }, [profileData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check file size (limit to 3MB)
      if (file.size > 3 * 1024 * 1024) {
        toast.error('Image size must be less than 3MB');
        e.target.value = ''; // Reset input
        return;
      }
      setProfilePictureFile(file);
    }
  };

  const handleSave = async () => {
    let photoUploaded = false;
    let profileUpdated = false;

    try {
      // 1. Handle Photo Upload
      if (profilePictureFile) {
        const photoData = new FormData();
        photoData.append('profile_picture', profilePictureFile);
        await uploadPhoto(photoData).unwrap();
        photoUploaded = true;
      }

      // 2. Handle Profile Data Update
      const changedFields: any = {};
      if (formData.fullName !== profileData?.user.full_name) {
        changedFields.full_name = formData.fullName;
      }
      if (formData.phoneNumber !== profileData?.user.phone_number) {
        changedFields.phone_number = formData.phoneNumber;
      }

      if (Object.keys(changedFields).length > 0) {
        await updateProfile(changedFields).unwrap();
        profileUpdated = true;
      }

      if (photoUploaded || profileUpdated) {
        toast.success('Profile updated successfully');
      }
      
      setIsEditing(false);
      setProfilePictureFile(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfilePictureFile(null);
    if (profileData) {
        setFormData({
            fullName: profileData.user.full_name || '',
            email: profileData.user.email || '',
            phoneNumber: profileData.user.phone_number || '',
            shipping_address: profileData.shipping_address || '',
        });
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

  const profile = profileData;
  const currentAvatar = previewUrl || profile?.user.profile_picture;

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
              {currentAvatar ? (
                  <Image 
                      src={currentAvatar} 
                      alt="Profile" 
                      width={80}
                      height={80}
                      className="w-full h-full rounded-full object-cover"
                      unoptimized={!!previewUrl}
                    />
                ) : (
                  <span className="text-2xl font-semibold text-gray-600">
                    {formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </span>
                )}
              {isEditing && (
                <label htmlFor="profile-picture-upload" className="cursor-pointer absolute bottom-0 right-0 w-7 h-7 bg-system-blue-light rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input type="file" id="profile-picture-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{formData.fullName}</h2>
            <p className="text-sm text-gray-600">{formData.email}</p>
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
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-600 block">Address</label>
                {isEditing && (
                   <Link href="/account/address" className="text-xs text-system-blue-light font-medium">
                     Change Address
                   </Link>
                )}
              </div>
              <input
                type="text"
                value={formData.shipping_address}
                className="w-full px-0 py-2 bg-gray-100 text-sm text-gray-500 border-b border-gray-300 focus:outline-none"
                disabled
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
                  disabled={isSaving || isUploading}
                  className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
                >
                  {isSaving || isUploading ? 'Saving...' : 'Save Changes'}
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