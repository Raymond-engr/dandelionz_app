'use client';

import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useUploadAdminPhotoMutation, useGetAdminProfileQuery } from '@/lib/api/adminApi';
import { useRef, useState } from 'react';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminPhotoUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadAdminPhoto, { isLoading: isUploading }] = useUploadAdminPhotoMutation();
  const { data: profileData, refetch } = useGetAdminProfileQuery();
  const [error, setError] = useState('');

  const profile = profileData?.data?.user;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      await uploadAdminPhoto(formData).unwrap();
      alert('Photo uploaded successfully!');
      refetch();
      router.back();
    } catch (err) {
      console.error('Failed to upload photo:', err);
      setError('Failed to upload photo. Please try again.');
    }
  };

  const handleSelectFromAlbum = () => {
    setError('');
    fileInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    setError('');
    console.log('Take a photo - not implemented');
    alert('Taking a photo is not implemented yet.');
  };

  return (
    <AppLayout showBottomNav={false} userRole="admin">
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Photo</h1>
        </div>

        <div className="p-6 flex flex-col items-center">
          {/* Profile Photo */}
          <div className="w-32 h-32 bg-system-blue-light rounded-full flex items-center justify-center mb-8 mt-8 overflow-hidden">
            {profile?.profile_picture ? (
              <Image 
                src={profile.profile_picture} 
                alt="Profile" 
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
                              <span className="text-4xl font-semibold text-white">
                                  {profile?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'A'}
                              </span>            )}
          </div>
          
          {isUploading && <LoadingSpinner />}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Action Buttons */}
          <div className="w-full max-w-sm space-y-4 mt-4">
            <button
              onClick={handleSelectFromAlbum}
              className="w-full py-3.5 bg-white text-system-blue-light border border-system-blue-light rounded-lg font-medium hover:bg-gray-50 transition-colors"
              disabled={isUploading}
            >
              Select from album
            </button>
            <button
              onClick={handleTakePhoto}
              className="w-full py-3.5 bg-white text-system-blue-light border border-system-blue-light rounded-lg font-medium hover:bg-gray-50 transition-colors"
              disabled={isUploading}
            >
              Take a Photo
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}