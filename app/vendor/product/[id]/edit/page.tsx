'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, usePathname } from 'next/navigation';
import {
  useGetStoreProductDetailsQuery,
  usePatchProductMutation,
  useSubmitDraftMutation,
} from '@/lib/api/vendorApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import Image from 'next/image';

const CATEGORIES = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home_appliances', label: 'Home Appliances' },
    { value: 'beauty', label: 'Beauty & Personal Care' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'books', label: 'Books' },
    { value: 'toys', label: 'Toys & Games' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'computers', label: 'Computers & Accessories' },
    { value: 'phones', label: 'Phones & Tablets' },
    { value: 'jewelry', label: 'Jewelry & Watches' },
    { value: 'baby', label: 'Baby Products' },
    { value: 'pets', label: 'Pet Supplies' },
    { value: 'office', label: 'Office Products' },
    { value: 'gaming', label: 'Video Games & Consoles' },
];

function getIdFromPath(pathname: string | null) {
  if (!pathname) return '';
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length >= 3 && segments[segments.length - 1] === 'edit') {
    return segments[segments.length - 2];
  }
  return segments[segments.length - 1] ?? '';
}

interface EditProductFormData {
  name: string;
  description: string;
  category: string;
  brand: string;
  tags: string;
  stock: number;
  price: number;
  discount: number;
  images: { file: File | string; id?: number; color?: string }[];
  mainImageIndex: number;
  variants: {
    colors: string[];
    sizes: string[];
  };
  variant_stock: {
    colors: Record<string, number>;
    sizes: Record<string, number>;
  };
}

function EditProductComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const id = getIdFromPath(pathname);

  const { data: storeProductData, isLoading: isLoadingStore, error: storeError } = useGetStoreProductDetailsQuery(id);
  const [patchProduct, { isLoading: isPatching }] = usePatchProductMutation();
  const [submitDraft, { isLoading: isSubmitting }] = useSubmitDraftMutation();

  const [formData, setFormData] = useState<EditProductFormData>({
    name: '',
    description: '',
    category: '',
    brand: '',
    tags: '',
    stock: 0,
    price: 0,
    discount: 0,
    images: [], // Combined for new and existing
    mainImageIndex: 0,
    variants: {
      colors: [],
      sizes: []
    },
    variant_stock: {
      colors: {},
      sizes: {}
    }
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const isLoading = isLoadingStore;
  const isUpdating = isPatching || isSubmitting;
  const error = storeError;
  const productData = storeProductData?.data;

  useEffect(() => {
    if (productData) {
      // Parse variants if they come as string or use them if object
      let parsedVariants = { colors: [], sizes: [] };
      if (productData.variants) {
          if (typeof productData.variants === 'string') {
              try {
                  parsedVariants = JSON.parse(productData.variants);
              } catch (e) {
                  console.error("Error parsing variants", e);
              }
          } else {
              parsedVariants = productData.variants as any;
          }
      }

      // Handle existing images for preview
      let existingImages: string[] = [];
      let mainIndex = 0;
      
      // Fix: Check for length > 0 to fallback to 'image' property correctly
      if (productData.images && Array.isArray(productData.images) && productData.images.length > 0) {
          existingImages = productData.images
            .map((img: any) => (typeof img === 'string' ? img : (img.image_url || img.image)))
            .filter((url: any) => typeof url === 'string' && url.length > 0);
            
          const foundIndex = productData.images.findIndex((img: any) => typeof img !== 'string' && img.is_main);
          if (foundIndex !== -1) mainIndex = foundIndex;
      } else if (productData.image) {
          existingImages = [productData.image];
      }

      let parsedVariantStock = { colors: {} as Record<string, number>, sizes: {} as Record<string, number> };
      if ((productData as any).variant_stock) {
        const vs = (productData as any).variant_stock;
        parsedVariantStock = {
          colors: vs.colors || {},
          sizes: vs.sizes || {}
        };
      }

      setFormData({
        name: productData.name || '',
        description: productData.description || '',
        category: productData.category || '',
        brand: productData.brand || '',
        tags: Array.isArray(productData.tags) ? productData.tags.join(', ') : (productData.tags || ''),
        stock: productData.stock || 0,
        price: parseFloat(productData.price) || 0,
        discount: (productData as any).discount || 0,
        images: existingImages.map(url => ({ file: url, color: '' })),
        mainImageIndex: mainIndex,
        variants: {
          colors: parsedVariants.colors || [],
          sizes: parsedVariants.sizes || []
        },
        variant_stock: parsedVariantStock
      });
      
      setPreviewUrls(existingImages);
    }
  }, [productData]);

  // Handle new image selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newFiles.map(file => ({ file, color: '' }))]
      }));
      
      // Add previews for new files
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
        const removedImage = prev.images[index];
        const newImages = prev.images.filter((_, i) => i !== index);
        let newMainIndex = prev.mainImageIndex;
        if (index === prev.mainImageIndex) {
            newMainIndex = 0;
        } else if (index < prev.mainImageIndex) {
            newMainIndex--;
        }
        
        // Revoke object URL if it was a new file
        if (removedImage && typeof removedImage.file !== 'string') {
            URL.revokeObjectURL(URL.createObjectURL(removedImage.file)); // Create then revoke to get the same URL
        }

        return {
            ...prev,
            images: newImages,
            mainImageIndex: newMainIndex
        };
    });
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const toggleColor = (color: string) => {
    setFormData(prev => {
      const isSelected = prev.variants.colors.includes(color);
      const newColors = isSelected
        ? prev.variants.colors.filter(c => c !== color)
        : [...prev.variants.colors, color];
      const newColorStock = { ...prev.variant_stock.colors };
      if (isSelected) delete newColorStock[color];
      return {
        ...prev,
        variants: { ...prev.variants, colors: newColors },
        variant_stock: { ...prev.variant_stock, colors: newColorStock }
      };
    });
  };

  const toggleSize = (size: string) => {
    setFormData(prev => {
      const isSelected = prev.variants.sizes.includes(size);
      const newSizes = isSelected
        ? prev.variants.sizes.filter(s => s !== size)
        : [...prev.variants.sizes, size];
      const newSizeStock = { ...prev.variant_stock.sizes };
      if (isSelected) delete newSizeStock[size];
      return {
        ...prev,
        variants: { ...prev.variants, sizes: newSizes },
        variant_stock: { ...prev.variant_stock, sizes: newSizeStock }
      };
    });
  };

  const handleSave = async () => {
    const changes = new FormData();
    
    // Append fields
    changes.append('name', formData.name);
    changes.append('description', formData.description);
    changes.append('category', formData.category);
    changes.append('price', formData.price.toString());
    changes.append('stock', formData.stock.toString());
    
    if (formData.brand) changes.append('brand', formData.brand);
    if (formData.tags) changes.append('tags', formData.tags);
    changes.append('discount', formData.discount.toString());
    
    // Append variants as JSON string
    if (formData.variants.colors.length > 0 || formData.variants.sizes.length > 0) {
        changes.append('variants', JSON.stringify(formData.variants));
    }

    // Per-option variant stock
    const hasVariantStock =
      Object.keys(formData.variant_stock.colors).length > 0 ||
      Object.keys(formData.variant_stock.sizes).length > 0;
    if (hasVariantStock) {
        changes.append('variant_stock', JSON.stringify(formData.variant_stock));
    }

    // Append ONLY NEW images
    formData.images.forEach((img, index) => {
        if (typeof img.file !== 'string') { // Only append File objects (new images)
            changes.append(`images_data[${index}][image]`, img.file);
            if (img.color) {
                changes.append(`images_data[${index}][variant_association]`, img.color);
            }
        }
    });
    
    try {
      await patchProduct({ slug: id, data: changes }).unwrap();
      toast.success('Product updated successfully!');
      router.push('/vendor/product');
    } catch (err: any) {
      console.error('Failed to save:', err);
      toast.error(err?.data?.message || 'Failed to save changes.');
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      await submitDraft(id).unwrap();
      toast.success('Draft submitted for approval!');
      router.push('/vendor/product');
    } catch (err: any) {
      console.error('Failed to submit:', err);
      toast.error(err?.data?.message || 'Failed to submit draft.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-red-500">Failed to load product details.</p>
        </div>
    );
  }

  return (
    <div className="p-6 pb-24 space-y-8">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900">
            Edit Product
        </h2>
        {productData && <span className="capitalize text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800">{productData.approval_status}</span>}
      </div>

      {/* Basic Info Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        
        <div>
          <label className="text-xs text-gray-600 mb-2 block">Product Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 mb-2 block">Product Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-system-blue-light"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-2 block">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                placeholder="Brand Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              />
            </div>
        </div>

        <div>
            <label className="text-xs text-gray-600 mb-2 block">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="e.g., Electronics, fans, home appliances..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
            />
        </div>
      </div>

      {/* Image Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input type="file" className="hidden" id="product-image-edit" onChange={handleFileChange} accept="image/*" multiple />
            <label htmlFor="product-image-edit" className="cursor-pointer block">
                <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="text-sm text-gray-600">Click to upload more images</p>
            </label>
        </div>

        {previewUrls.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
                {previewUrls.map((url, index) => (
                    <div key={index} className="relative group border rounded-lg overflow-hidden aspect-square">
                                                    <Image 
                                                        src={url} 
                                                        alt={`Preview ${index}`} 
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                                        className="object-cover" 
                                                        unoptimized={url.startsWith('blob:')}
                                                    />
                                                    <button
                                                        onClick={() => handleRemoveImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                    </button>
                                                    {/* 
                                                       Note: "Set Main" logic in edit mode is complex without backend support to re-order existing images.
                                                       Hiding it for now to avoid UI confusion until backend supports it fully.
                                                    */}
                                                    {formData.variants.colors.length > 0 && (
                                                        <div className="absolute bottom-0 left-0 right-0 p-1 bg-white bg-opacity-75">
                                                            <select
                                                                value={formData.images[index].color || ''}
                                                                onChange={(e) => {
                                                                    const updatedImages = [...formData.images];
                                                                    updatedImages[index].color = e.target.value;
                                                                    setFormData(prev => ({ ...prev, images: updatedImages }));
                                                                }}
                                                                className="w-full text-xs p-1 border rounded"
                                                            >
                                                                <option value="">No Color</option>
                                                                {formData.variants.colors.map(color => (
                                                                    <option key={color} value={color}>{color}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>                ))}
            </div>
        )}
      </div>

      {/* Inventory Section */}
      <div className="space-y-6">
         <h3 className="text-lg font-semibold text-gray-900">Inventory & Pricing</h3>
         
         <div>
            <label className="text-xs text-gray-600 mb-2 block">Stock (Units)</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value || '0')})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
            />
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value || '0')})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Discount (%) (Optional)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value || '0')})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
              />
            </div>
         </div>

         {/* Variants */}
         <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Variants (Optional)</h3>
            
            {/* Colors */}
            <div className="mb-4">
                <label className="text-xs text-gray-600 mb-2 block">Available Colors</label>
                <div className="grid grid-cols-4 gap-2">
                {['White', 'Black', 'Green', 'Blue', 'Red', 'Yellow'].map((color) => (
                    <button
                    key={color}
                    type="button"
                    onClick={() => toggleColor(color)}
                    className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors border ${
                        formData.variants.colors.includes(color)
                        ? 'bg-system-blue-light text-white border-system-blue-light'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                    >
                    {color}
                    </button>
                ))}
                </div>
                {formData.variants.colors.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <label className="text-xs text-gray-600">Stock per Color (Optional)</label>
                    {formData.variants.colors.map(color => (
                      <div key={color} className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 w-16">{color}</span>
                        <input
                          type="number"
                          min="0"
                          value={formData.variant_stock.colors[color] ?? ''}
                          onChange={(e) => {
                            const n = parseInt(e.target.value, 10);
                            setFormData(prev => ({
                              ...prev,
                              variant_stock: {
                                ...prev.variant_stock,
                                colors: { ...prev.variant_stock.colors, [color]: Number.isNaN(n) ? 0 : n }
                              }
                            }));
                          }}
                          placeholder="0"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                        />
                        <span className="text-xs text-gray-500">units</span>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* Sizes */}
            <div>
                {/* Clothing Sizes */}
                <label className="text-xs text-gray-600 mb-0.5 block">Clothing Sizes</label>
                <p className="text-xs text-gray-400 mb-2">For apparel like shirts, dresses, trousers</p>
                <div className="grid grid-cols-6 gap-2 mb-4">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`py-2 rounded-lg text-xs font-medium transition-colors border ${
                        formData.variants.sizes.includes(size)
                        ? 'bg-system-blue-light text-white border-system-blue-light'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                    >
                    {size}
                    </button>
                ))}
                </div>

                {/* Shoe Sizes */}
                <label className="text-xs text-gray-600 mb-0.5 block">Shoe Sizes (EU)</label>
                <p className="text-xs text-gray-400 mb-2">For footwear like sneakers, sandals, boots</p>
                <div className="grid grid-cols-6 gap-2">
                {['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'].map((size) => (
                    <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`aspect-square rounded-lg text-xs font-medium transition-colors border flex items-center justify-center ${
                        formData.variants.sizes.includes(size)
                        ? 'bg-system-blue-light text-white border-system-blue-light'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                    >
                    {size}
                    </button>
                ))}
                </div>

                {formData.variants.sizes.some(s => ['XS','S','M','L','XL','XXL'].includes(s)) && formData.variants.sizes.some(s => ['36','37','38','39','40','41','42','43','44','45'].includes(s)) && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-700">Tip: Most products use one size type. Select both only if your product genuinely comes in both clothing and shoe sizes.</p>
                  </div>
                )}

                {formData.variants.sizes.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <label className="text-xs text-gray-600">Stock per Size (Optional)</label>
                    {formData.variants.sizes.map(size => (
                      <div key={size} className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 w-16">Size {size}</span>
                        <input
                          type="number"
                          min="0"
                          value={formData.variant_stock.sizes[size] ?? ''}
                          onChange={(e) => {
                            const n = parseInt(e.target.value, 10);
                            setFormData(prev => ({
                              ...prev,
                              variant_stock: {
                                ...prev.variant_stock,
                                sizes: { ...prev.variant_stock.sizes, [size]: Number.isNaN(n) ? 0 : n }
                              }
                            }));
                          }}
                          placeholder="0"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                        />
                        <span className="text-xs text-gray-500">units</span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
         </div>
      </div>
      
      {/* Actions */}
      <div className="space-y-3 pt-6 border-t border-gray-100">
        <button onClick={handleSave} disabled={isUpdating} className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50">
            {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>

        {productData?.publish_status === 'draft' && (
            <button onClick={handleSubmitForApproval} disabled={isUpdating} className="w-full py-3.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
                {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
            </button>
        )}

        <button onClick={() => router.push('/vendor/product')} disabled={isUpdating} className="w-full py-3.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Cancel
        </button>
      </div>
    </div>
  );
}

export default function EditProductPage() {
    return (
        <AppLayout showBottomNav={false} userRole="vendor">
            <div className="min-h-screen bg-white">
                <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
                    <button onClick={() => window.history.back()} className="absolute left-4 p-2 -ml-2">
                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-system-blue-light">Edit Product</h1>
                </div>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                    <EditProductComponent />
                </Suspense>
            </div>
        </AppLayout>
    );
}