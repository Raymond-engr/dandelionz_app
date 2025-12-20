'use client';

import React, { useState, use } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EditCategoryProps {
  params: Promise<{ id: string }>;
}

export default function EditCategory({ params: paramsPromise }: EditCategoryProps) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [name, setName] = useState('Category Name');
  const [description, setDescription] = useState('');

  const categoryId = params.id;
  // Mock category data - replace with API call based on categoryId

  const isNew = categoryId === 'new';

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[600px] bg-white relative">
        <div className="min-h-screen bg-white">
          <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
            <button onClick={() => router.back()} className="absolute left-4">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-lg font-semibold text-system-blue-light">
              {isNew ? 'Add New Category' : 'Edit Category'}
            </h1>
          </div>

          <div className="p-4">
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-700 block mb-2">Category Name</label>
                <input
                  type="text"
                  placeholder="Enter Category Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 block mb-2">Category Description</label>
                <textarea
                  placeholder="Describe your category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light min-h-[120px] resize-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3 bg-system-blue-light text-white rounded-lg text-sm font-medium hover:bg-[#020360] transition-colors">
                {isNew ? 'Add Category' : 'Update Category'}
              </button>

              <button
                onClick={() => router.back()}
                className="w-full py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
