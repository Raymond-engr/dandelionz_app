'use client';

import React, { useState, use } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VendorDetails({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [action, setAction] = useState('Approve Vendor');
  const [reason, setReason] = useState('');

  const vendorId = params.id;
  // Mock vendor data - replace with API call
  const vendor = {
    id: vendorId,
    name: 'Adam Smith',
    email: 'adamsmith@gmail.com',
    status: 'Active',
    storeName: 'Store Name Goes Here',
    phone: '08123456789',
    address: 'No. 13 JB Street, Ekosoidn, Edo State',
  };

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
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                {vendor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900">{vendor.name}</h2>
                <p className="text-sm text-gray-600">{vendor.email}</p>
                <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {vendor.status}
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Full Name</label>
                <p className="text-sm font-medium text-gray-900">{vendor.name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Email Address</label>
                <p className="text-sm font-medium text-gray-900">{vendor.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Store Name</label>
                <p className="text-sm font-medium text-gray-900">{vendor.storeName}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Phone Number</label>
                <p className="text-sm font-medium text-gray-900">{vendor.phone}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Address</label>
                <p className="text-sm font-medium text-gray-900">{vendor.address}</p>
              </div>
            </div>

            <div className="space-y-3">
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              >
                <option>Approve Vendor</option>
                <option>Suspend Vendor</option>
                <option>Reject Vendor</option>
              </select>

              <textarea
                placeholder="Reason for action..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light min-h-[80px] resize-none"
              />

              <button className="w-full py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send
              </button>

              <button className="w-full py-3 bg-system-blue-light text-white rounded-lg text-sm font-medium hover:bg-[#020360] transition-colors">
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
