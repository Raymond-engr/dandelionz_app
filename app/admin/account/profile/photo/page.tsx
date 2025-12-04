'use client';

import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function AdminPhotoUploadPage() {
  const router = useRouter();

  const handleSelectFromAlbum = () => {
    console.log('Select from album');
  };

  const handleTakePhoto = () => {
    console.log('Take a photo');
  };

  return (
    <AppLayout showBottomNav={false} userRole="admin">
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
          <div className="w-32 h-32 bg-system-blue-light rounded-full flex items-center justify-center mb-12 mt-8">
            <span className="text-4xl font-semibold text-white">AS</span>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={handleSelectFromAlbum}
              className="w-full py-3.5 bg-white text-system-blue-light border border-system-blue-light rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Select from album
            </button>
            <button
              onClick={handleTakePhoto}
              className="w-full py-3.5 bg-white text-system-blue-light border border-system-blue-light rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Take a Photo
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}