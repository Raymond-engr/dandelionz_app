'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useGetAdminPaymentSettingsQuery, useUpdateAdminPaymentSettingsMutation } from '@/lib/api/adminApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function StorePaymentOptionPage() {
  const router = useRouter();
  const { data, isLoading } = useGetAdminPaymentSettingsQuery();
  const [updatePaymentSettings, { isLoading: isUpdating }] = useUpdateAdminPaymentSettingsMutation();

  const [formData, setFormData] = useState({
    accountNumber: '',
    bankName: '',
    accountName: ''
  });

  useEffect(() => {
    if (data?.data) {
      setFormData({
        accountNumber: data.data.account_number,
        bankName: data.data.bank_name,
        accountName: data.data.account_name
      });
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updatePaymentSettings({
        account_number: formData.accountNumber,
        bank_name: formData.bankName,
        account_name: formData.accountName
      }).unwrap();
      toast.success('Payment details updated successfully!');
      router.back();
    } catch (err) {
      toast.error('Failed to update payment details.');
    }
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
          <h1 className="text-lg font-semibold text-system-blue-light">Payout Settings</h1>
        </div>

        <div className="p-6">
          {isLoading ? (
             <div className="flex justify-center py-10">
               <LoadingSpinner />
             </div>
          ) : (
             <>
               <h2 className="text-base font-semibold text-gray-900 mb-4">Bank Details</h2>

               <div className="mb-8">
                 <h3 className="text-sm font-medium text-gray-900 mb-4">Bank Transfer</h3>

                 <div className="space-y-4">
                   <div>
                     <label className="text-xs text-gray-600 mb-2 block">Account Number</label>
                     <input
                       type="text"
                       value={formData.accountNumber}
                       onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                       className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                     />
                   </div>

                   <div>
                     <label className="text-xs text-gray-600 mb-2 block">Bank Name</label>
                     <select
                       value={formData.bankName}
                       onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                       className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light appearance-none"
                     >
                       <option value="">Select Bank</option>
                       <option>United Bank for Africa PLC</option>
                       <option>Access Bank</option>
                       <option>GTBank</option>
                       <option>First Bank</option>
                       <option>Zenith Bank</option>
                     </select>
                   </div>

                   <div>
                     <label className="text-xs text-gray-600 mb-2 block">Account Name</label>
                     <input
                       type="text"
                       value={formData.accountName}
                       onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                       className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                     />
                   </div>
                 </div>
               </div>

               <div className="space-y-3">
                 <button
                   onClick={handleSave}
                   disabled={isUpdating}
                   className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
                 >
                   {isUpdating ? 'Saving...' : 'Save Changes'}
                 </button>
                 <button
                   onClick={() => router.back()}
                   className="w-full py-3.5 bg-white text-system-blue-light border border-system-blue-light rounded-lg font-medium hover:bg-gray-50 transition-colors"
                 >
                   Discard
                 </button>
               </div>
             </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}