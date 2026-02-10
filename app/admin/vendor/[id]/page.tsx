'use client';

import React, { useState, use } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  useGetVendorDetailsQuery, 
  useApproveVendorMutation,
  useVerifyVendorKYCMutation,
  useSuspendVendorMutation
} from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

interface VendorDetailsProps {
  params: Promise<{ id: string }>;
}

export default function VendorDetails({ params: paramsPromise }: VendorDetailsProps) {
  const params = use(paramsPromise);
  const router = useRouter();
  const vendorId = params.id;

  const { data, isLoading, error } = useGetVendorDetailsQuery(vendorId);
  const [approveVendor, { isLoading: isApproving }] = useApproveVendorMutation();
  const [verifyKYC, { isLoading: isVerifying }] = useVerifyVendorKYCMutation();
  const [suspendVendor, { isLoading: isSuspending }] = useSuspendVendorMutation();

  const [action, setAction] = useState('Approve Vendor');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const vendor = data?.data;

  const handleConfirmAction = async () => {
    if (!vendor) return;

    try {
      if (action === 'Approve Vendor') {
        await approveVendor({ 
          user_uuid: vendorId, 
          approve: true 
        }).unwrap();
        setSuccessMessage('Vendor approved successfully');
      } else if (action === 'Suspend Vendor') {
        await suspendVendor({ 
          uuid: vendorId, 
          suspend: true 
        }).unwrap();
        setSuccessMessage('Vendor suspended successfully');
      } else if (action === 'Reject Vendor') {
        await approveVendor({ 
          user_uuid: vendorId, 
          approve: false 
        }).unwrap();
        setSuccessMessage('Vendor rejected successfully');
      } else if (action === 'Verify KYC') {
        await verifyKYC({ user_uuid: vendorId }).unwrap();
        setSuccessMessage('Vendor KYC verified successfully');
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 2000);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to perform action');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Vendor Details</h1>
        </div>
        <LoadingSpinner fullScreen />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load vendor details</p>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-system-blue-light text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900">{successMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[600px] bg-white relative">
        <div className="min-h-screen bg-white pb-6">
          <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
            <button onClick={() => router.back()} className="absolute left-4">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-lg font-semibold text-system-blue-light">Vendor Details</h1>
          </div>

          <div className="p-4">
            {/* Vendor Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold shrink-0">
                {vendor.store_name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900">{vendor.store_name}</h2>
                <p className="text-sm text-gray-600">{vendor.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    vendor.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {vendor.is_active ? 'Active' : 'Suspended'}
                  </span>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    vendor.is_verified_vendor 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {vendor.is_verified_vendor ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Vendor Information */}
            <div className="space-y-6 mb-6">
              <section>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Business Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 block mb-1">Full Name</label>
                    <p className="text-sm font-medium text-gray-900">{vendor.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Email Address</label>
                    <p className="text-sm font-medium text-gray-900">{vendor.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Phone Number</label>
                    <p className="text-sm font-medium text-gray-900">{vendor.phone_number || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 block mb-1">Store Description</label>
                    <p className="text-sm font-medium text-gray-900">{vendor.store_description || 'No description provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Reg. Number</label>
                    <p className="text-sm font-medium text-gray-900">{vendor.business_registration_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Joined Date</label>
                    <p className="text-sm font-medium text-gray-900">
                      {vendor.created_at ? new Date(vendor.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 block mb-1">Address</label>
                    <p className="text-sm font-medium text-gray-900">{vendor.address || 'N/A'}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Payment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Bank Name</label>
                    <p className="text-sm font-medium text-gray-900">{vendor.bank_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Account Number</label>
                    <p className="text-sm font-medium text-gray-900">{vendor.account_number || 'N/A'}</p>
                  </div>
                  {vendor.recipient_code && (
                    <div className="col-span-2">
                      <label className="text-xs text-gray-500 block mb-1">Recipient Code</label>
                      <p className="text-sm font-medium text-gray-900">{vendor.recipient_code}</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Action Controls */}
            <div className="space-y-3">
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                disabled={isSuspending || isApproving || isVerifying}
              >
                <option>Approve Vendor</option>
                <option>Suspend Vendor</option>
                <option>Reject Vendor</option>
                <option>Verify KYC</option>
              </select>

              <button 
                onClick={handleConfirmAction}
                disabled={isSuspending || isApproving || isVerifying}
                className="w-full py-3 bg-system-blue-light text-white rounded-lg text-sm font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
              >
                {(isSuspending || isApproving || isVerifying) ? 'Processing...' : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}