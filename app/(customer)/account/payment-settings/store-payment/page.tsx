'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import {
  useGetCustomerPaymentSettingsQuery,
  useUpdateCustomerPaymentSettingsMutation,
} from '@/lib/api/customerApi';
import { useGetBanksQuery, useVerifyBankAccountMutation } from '@/lib/api/vendorApi';
import { ChevronLeft, CheckCircle, Search, Loader2 } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { apiError } from '@/lib/utils';

export default function CustomerPayoutDetailsPage() {
  const router = useRouter();

  const { data: response, isLoading } = useGetCustomerPaymentSettingsQuery();
  const { data: banksResponse, isLoading: isLoadingBanks } = useGetBanksQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateCustomerPaymentSettingsMutation();
  const [verifyAccount, { isLoading: isVerifying }] = useVerifyBankAccountMutation();

  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showBankPicker, setShowBankPicker] = useState(false);
  const [isAccountVerified, setIsAccountVerified] = useState(false);

  const banks = banksResponse?.data || [];
  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (response?.data) {
      setBankName(response.data.bank_name || "");
      setBankCode(response.data.bank_code || "");
      setAccountNumber(response.data.account_number || "");
      setAccountName(response.data.account_name || "");
      if (response.data.account_name) {
        setIsAccountVerified(true);
      }
    }
  }, [response]);

  const handleVerify = async () => {
    if (!accountNumber || accountNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit account number.");
      return;
    }
    if (!bankCode) {
      toast.error("Please select a bank.");
      return;
    }

    try {
      const result = await verifyAccount({
        account_number: accountNumber,
        bank_code: bankCode
      }).unwrap();

      if (result.success) {
        setAccountName(result.data.account_name);
        setIsAccountVerified(true);
        toast.success("Account verified successfully.");
      }
    } catch (err: any) {
      setIsAccountVerified(false);
      setAccountName("");
      toast.error(apiError(err, "Could not verify this account. Please check details."));
    }
  };

  const handleUpdate = async () => {
    if (!bankName || !bankCode || !accountNumber || !accountName) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!isAccountVerified) {
      toast.error("Please verify your account details first.");
      return;
    }

    try {
      await updateSettings({
        bank_name: bankName,
        bank_code: bankCode,
        account_number: accountNumber,
        account_name: accountName
      }).unwrap();
      toast.success("Payout details updated successfully.");
      router.back();
    } catch (err: any) {
      toast.error(apiError(err, "Failed to update payout details."));
    }
  };

  return (
    <AppLayout showBottomNav={false} userRole="customer">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8 border-b border-gray-100 pb-4">
          <button onClick={() => router.back()} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-system-blue-light" />
          </button>
          <h1 className="text-xl font-bold text-system-blue-light">Payout Details</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Bank Details</h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Bank Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Bank Name</label>
                <div className="relative">
                  <button
                    onClick={() => setShowBankPicker(!showBankPicker)}
                    className="w-full text-left border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-system-blue-light transition-all"
                  >
                    <span className={bankName ? 'text-gray-900' : 'text-gray-400'}>
                      {bankName || (isLoadingBanks ? "Loading banks..." : "Select Bank")}
                    </span>
                    {isLoadingBanks ? (
                      <Loader2 className="w-4 h-4 animate-spin text-system-blue-light" />
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>

                  {showBankPicker && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-hidden flex flex-col">
                      <div className="p-3 border-b border-gray-100 flex items-center bg-gray-50">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                          type="text"
                          className="bg-transparent border-none focus:ring-0 text-sm w-full"
                          placeholder="Search banks..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="overflow-y-auto">
                        {filteredBanks.map((bank) => (
                          <button
                            key={bank.code}
                            className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex justify-between items-center ${bankCode === bank.code ? 'bg-blue-50 text-system-blue-light font-medium' : 'text-gray-900'}`}
                            onClick={() => {
                              setBankName(bank.name);
                              setBankCode(bank.code);
                              setShowBankPicker(false);
                              setIsAccountVerified(false);
                              setSearchTerm("");
                            }}
                          >
                            {bank.name}
                            {bankCode === bank.code && <CheckCircle className="w-4 h-4" />}
                          </button>
                        ))}
                        {filteredBanks.length === 0 && (
                          <div className="px-4 py-3 text-sm text-gray-500 italic">No banks found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Account Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={10}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-system-blue-light transition-all"
                    placeholder="10-digit Account Number"
                    value={accountNumber}
                    onChange={(e) => {
                      setAccountNumber(e.target.value.replace(/\D/g, ''));
                      setIsAccountVerified(false);
                    }}
                  />
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying || accountNumber.length !== 10 || !bankCode}
                    className="px-6 py-2 bg-blue-50 text-system-blue-light rounded-lg text-sm font-bold hover:bg-blue-100 disabled:opacity-50 disabled:hover:bg-blue-50 transition-colors flex items-center shadow-sm"
                  >
                    {isVerifying ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                    Verify
                  </button>
                </div>
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Account Name</label>
                <div className="border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 flex justify-between items-center">
                  <span className={accountName ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                    {accountName || "Verify account to see name"}
                  </span>
                  {isAccountVerified && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                {isAccountVerified && (
                  <p className="text-[10px] text-gray-400 mt-2 italic">* Details verified via Paystack. Click Save to confirm.</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-6">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating || !isAccountVerified}
                  className="w-full bg-system-blue-light text-white py-4 rounded-xl font-semibold hover:bg-[#020360] transition-colors disabled:opacity-50 flex justify-center items-center shadow-md"
                >
                  {isUpdating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  Save Changes
                </button>
                <button
                  onClick={() => router.back()}
                  className="w-full border border-gray-200 text-gray-600 py-4 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Discard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
