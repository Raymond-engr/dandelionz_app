'use client';

import React, { useState, useEffect, use } from 'react';
import { ChevronLeft, Camera } from 'lucide-react'; // Added Camera icon for image upload UI
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Image from 'next/image'; // Import Image component
import {
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '@/lib/api/adminApi';

interface EditCategoryProps {
  params: Promise<{ id: string }>;
}

export default function EditCategory({ params: paramsPromise }: EditCategoryProps) {
  const params = use(paramsPromise);
  const router = useRouter();
  const categoryId = params.id;
  
  const isNew = categoryId === 'new';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null); // State for image file
  const [error, setError] = useState<string | null>(null);

  // API hooks
  const { data: categoryData, isLoading: isLoadingCategory, isError: isErrorCategory } = useGetCategoryQuery(
    parseInt(categoryId),
    { skip: isNew || !categoryId }
  );
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] = useUpdateCategoryMutation();

  useEffect(() => {
    if (categoryData && !isNew) {
      setName(categoryData.data.name);
      setDescription(categoryData.data.description);
      // If there's an existing image, you might want to show it but not pre-fill categoryImageFile
      // as it's a File object, not a URL.
    }
  }, [categoryData, isNew]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCategoryImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (categoryImageFile) {
      formData.append('image', categoryImageFile); // 'image' should match the backend field name
    }

    try {
      if (isNew) {
        await createCategory(formData).unwrap();
      } else {
        // For update, the API might expect PUT/PATCH with FormData, or JSON for non-file fields.
        // Assuming PATCH with FormData containing only changed fields for simplicity, matching vendor profile
        // Backend API for updateCategory in adminApi.ts currently takes { id: number; data: Partial<Category> }
        // If it expects FormData for image, we might need to adjust adminApi.ts or send only image via separate endpoint.
        // For now, let's adjust the update mutation to also take FormData.
        await updateCategory({ id: parseInt(categoryId), data: formData as any }).unwrap(); // Cast to any for now
      }
      router.push('/admin/product/category'); // Redirect to category list on success
    } catch (err: any) {
      console.error('Failed to save category:', err);
      setError(err?.data?.message || 'Failed to save category. Please try again.');
    }
  };

  const handleDiscard = () => {
    router.back();
  };

  const isSubmitting = isCreatingCategory || isUpdatingCategory;
  const showLoading = isLoadingCategory || isSubmitting;
  const showErrorMessage = error || isErrorCategory;

  const currentImagePreview = categoryImageFile ? URL.createObjectURL(categoryImageFile) : categoryData?.data.image;

  if (isLoadingCategory && !isNew) {
    return (
      <AppLayout showBottomNav={false}>
        <div className="min-h-screen bg-white p-4 flex items-center justify-center">
          <p className="text-gray-500">Loading category details...</p>
        </div>
      </AppLayout>
    );
  }

  if (isErrorCategory && !isNew) {
    return (
      <AppLayout showBottomNav={false}>
        <div className="min-h-screen bg-white p-4 flex items-center justify-center">
          <p className="text-red-500">Error loading category details. Please try again.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={false}>
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

            <form onSubmit={handleSubmit} className="p-4">
              {showErrorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">{error || 'An error occurred.'}</span>
                </div>
              )}
              
              {/* Category Image Upload */}
              <div className="mb-6 flex flex-col items-center">
                <div className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {currentImagePreview ? (
                    <Image 
                      src={currentImagePreview} 
                      alt="Category Image" 
                      layout="fill" 
                      objectFit="cover"
                      className="rounded-full"
                    />
                  ) : (
                    <Camera className="w-10 h-10 text-gray-400" />
                  )}
                  <label 
                    htmlFor="category-image-upload" 
                    className="absolute bottom-0 right-0 w-8 h-8 bg-system-blue-light rounded-full flex items-center justify-center cursor-pointer border-2 border-white"
                  >
                    <Camera className="w-4 h-4 text-white" />
                    <input 
                      type="file" 
                      id="category-image-upload" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      disabled={showLoading}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Upload Category Image</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-700 block mb-2">Category Name</label>
                  <input
                    type="text"
                    placeholder="Enter Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                    disabled={showLoading}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 block mb-2">Category Description</label>
                  <textarea
                    placeholder="Describe your category..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light min-h-[120px] resize-none"
                    disabled={showLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-system-blue-light text-white rounded-lg text-sm font-medium hover:bg-[#020360] transition-colors"
                  disabled={showLoading}
                >
                  {showLoading ? (isNew ? 'Adding...' : 'Updating...') : (isNew ? 'Add Category' : 'Update Category')}
                </button>

                <button
                  type="button"
                  onClick={handleDiscard}
                  className="w-full py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                  disabled={showLoading}
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
