'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useGetPaymentSettingsQuery, useUpdatePaymentSettingsMutation } from '@/lib/api/vendorApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function StorePaymentPage() {
  const router = useRouter();
  const { data: paymentSettingsData, isLoading: isLoadingSettings, error: settingsError } = useGetPaymentSettingsQuery();
  const [updatePaymentSettings, { isLoading: isUpdatingSettings, error: updateError }] = useUpdatePaymentSettingsMutation();

  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    account_name: '',
  });

  useEffect(() => {
    if (paymentSettingsData?.data) {
      setFormData({
        bank_name: paymentSettingsData.data.bank_name || '',
        account_number: paymentSettingsData.data.account_number || '',
        account_name: paymentSettingsData.data.account_name || '',
      });
    }
  }, [paymentSettingsData]);

  const handleSave = async () => {
    try {
      await updatePaymentSettings(formData).unwrap();
      toast.success('Payment settings updated successfully!');
      router.back();
    } catch (err) {
      console.error('Failed to update payment settings:', err);
      toast.error('Failed to update payment settings.');
    }
  };

  const isLoading = isLoadingSettings || isUpdatingSettings;
  const error = settingsError || updateError;

  if (isLoadingSettings) {
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
          <p className="text-red-500">Failed to load payment settings.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={false} userRole="vendor">
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Store Payment Option</h1>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="text-xs text-gray-600 mb-2 block">Bank Name</label>
            <input
              type="text"
              value={formData.bank_name}
              onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              placeholder="e.g., Zenith Bank"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-2 block">Account Number</label>
            <input
              type="text"
              value={formData.account_number}
              onChange={(e) => setFormData({...formData, account_number: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              placeholder="e.g., 1234567890"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-2 block">Account Name</label>
            <input
              type="text"
              value={formData.account_name}
              onChange={(e) => setFormData({...formData, account_name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              placeholder="e.g., John Doe"
            />
          </div>
          
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
          >
            {isUpdatingSettings ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
