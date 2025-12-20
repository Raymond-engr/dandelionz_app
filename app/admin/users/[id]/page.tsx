'use client';

import React, { useState, use } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserDetailsProps {
  params: Promise<{ id: string }>;
}

export default function UserDetails({ params: paramsPromise }: UserDetailsProps) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [action, setAction] = useState('Suspend User');
  const [reason, setReason] = useState('');

  const userId = params.id;
  // Mock user data - replace with API call
  const user = {
    id: userId,
    name: 'Adam Smith',
    email: 'adamsmith@gmail.com',
    status: 'Active',
    phone: '08123467598',
    address: 'No. 13 JB Street, Ekosoidn, Edo State',
    registrationDate: '4th Dec 2025',
    totalSpend: '₦0.00',
    totalOrders: '0',
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[600px] bg-white relative">
        <div className="min-h-screen bg-white pb-6">
          <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
            <button onClick={() => router.back()} className="absolute left-4">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-lg font-semibold text-system-blue-light">User Details</h1>
          </div>

          <div className="p-4">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {user.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-700 mb-1">Total Spend</p>
                <p className="text-xl font-bold text-gray-900">{user.totalSpend}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-gray-700 mb-1">Total Order</p>
                <p className="text-xl font-bold text-gray-900">{user.totalOrders}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Full Name</label>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Email Address</label>
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Phone Number</label>
                <p className="text-sm font-medium text-gray-900">{user.phone}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">State/Region</label>
                <p className="text-sm font-medium text-gray-900">{user.address}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Registration Date</label>
                <p className="text-sm font-medium text-gray-900">{user.registrationDate}</p>
              </div>
            </div>

            <div className="space-y-3">
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              >
                <option>Suspend User</option>
                <option>Activate User</option>
                <option>Delete User</option>
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
