'use client';

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function AddNewCategory() {
  const router = useRouter();
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const handleAddCategory = () => {
    // Handle add - replace with API call
    console.log('Adding category:', { categoryName, categoryDescription });
    router.back();
  };

  const handleDiscard = () => {
    router.back();
  };

  return (
    <AppLayout showBottomNav={true} userRole="admin">
      <div className="min-h-screen bg-white pb-20">
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Add New Category</h1>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Category Name
              </label>
              <input
                type="text"
                placeholder="Enter Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Category Description
              </label>
              <textarea
                placeholder="Describe your category..."
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent resize-none"
              />
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddCategory}
                className="w-full py-3 bg-system-blue-light text-white rounded-lg text-sm font-semibold hover:bg-[#020360] transition-colors"
              >
                Add Category
              </button>
              <button
                onClick={handleDiscard}
                className="w-full py-3 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
