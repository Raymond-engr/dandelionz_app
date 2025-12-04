'use client';

import React, { useState, use } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProductDetails({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [action, setAction] = useState('Approve Product');
  const [reason, setReason] = useState('');

  const productId = params.id;
  // Mock product data - replace with API call
  const product = {
    id: productId,
    name: 'Product Name',
    price: '₦0.00',
    category: 'Category Name',
    stock: '0 Units',
    uploadDate: '11th Nov 2025',
    vendor: 'Store Name Goes Here',
    vendorEmail: 'adamsmith@gmail.com',
    status: 'APPROVED',
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[600px] bg-white relative">
        <div className="min-h-screen bg-white pb-6">
          <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
            <button onClick={() => router.back()} className="absolute left-4">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-lg font-semibold text-system-blue-light">Product Details</h1>
          </div>

          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Product Information</h2>

            <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                <p className="text-xs text-gray-500">Product image will<br />appear here</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <p className="text-xl font-bold text-gray-900">{product.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Product description goes here...</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{product.price}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-900 block mb-1">Category:</label>
                </div>
                <div>
                  
                  <p className="text-sm text-gray-900">{product.category}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-900 block mb-1">Stock:</label>
                </div>
                <div>
                  <p className="text-sm text-gray-900">{product.stock}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-900 block mb-1">Uploaded Date:</label>
              </div>
              <div>
                <p className="text-sm text-gray-900">{product.uploadDate}</p>
              </div>
              </div>
            </div>

            <h2 className="text-sm font-semibold text-gray-900 mb-3">Vendor Information</h2>

            <div className="space-y-3 mb-6">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Store Name</label>
                <p className="text-sm font-medium text-gray-900">{product.vendor}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Email Address</label>
                <p className="text-sm font-medium text-gray-900">{product.vendorEmail}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Status</label>
                <p className="text-sm font-semibold text-green-600">{product.status}</p>
              </div>
            </div>

            <div className="space-y-3">
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light appearance-none bg-white pr-10"
              >
                <option>Approve Product</option>
                <option>Reject Product</option>
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
