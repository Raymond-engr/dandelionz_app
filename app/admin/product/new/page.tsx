'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import {
  useCreateDraftMutation,
  useSubmitDraftMutation,
  useGetVendorProfileQuery,
} from '@/lib/api/vendorApi';
import Image from 'next/image';
import toast from 'react-hot-toast';

type ProductStep = 'basic' | 'inventory' | 'preview';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  brand: string;
  images: { file: File; color?: string }[];
  mainImageIndex: number;
  tags: string;
  stock: number;
  price: number;
  discount: number;
  variants: {
    colors: string[];
    sizes: string[];
  };
  video: File | null;
  videoTitle: string;
  videoDescription: string;
}

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

export default function AddNewProductPage() {
  const router = useRouter();
  const { data: profileData, isLoading: isLoadingProfile } = useGetVendorProfileQuery();
  const [createDraft, { isLoading: isSavingDraft, error: draftError }] = useCreateDraftMutation();
  const [submitDraft, { isLoading: isSubmitting, error: submitError }] = useSubmitDraftMutation();

  const [currentStep, setCurrentStep] = useState<ProductStep>('basic');
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    brand: '',
    images: [],
    mainImageIndex: 0,
    tags: '',
    stock: 10,
    price: 550,
    discount: 0,
    variants: {
      colors: [],
      sizes: []
    },
    video: null,
    videoTitle: '',
    videoDescription: ''
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  React.useEffect(() => {
    const urls = formData.images.map(img => URL.createObjectURL(img.file));
    setPreviewUrls(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [formData.images]);

  const isLoading = isSavingDraft || isSubmitting;
  const isError = !!(draftError || submitError);
  const error = draftError || submitError;

  const handleProceed = () => {
    if (currentStep === 'basic') {
      if (formData.images.length === 0) {
        toast.error('Please upload at least one image');
        return;
      }
      setCurrentStep('inventory');
    } else if (currentStep === 'inventory') {
      setCurrentStep('preview');
    }
  };

  const handleBack = () => {
    if (currentStep === 'inventory') {
      setCurrentStep('basic');
    } else if (currentStep === 'preview') {
      setCurrentStep('inventory');
    } else {
      router.back();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...Array.from(e.target.files || []).map(file => ({ file, color: '' }))]
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
        const newImages = prev.images.filter((_, i) => i !== index);
        let newMainIndex = prev.mainImageIndex;
        if (index === prev.mainImageIndex) {
            newMainIndex = 0;
        } else if (index < prev.mainImageIndex) {
            newMainIndex--;
        }
        return {
            ...prev,
            images: newImages,
            mainImageIndex: newMainIndex
        };
    });
  };

  const buildProductData = () => {
    const productData = new FormData();
    productData.append('name', formData.name);
    productData.append('description', formData.description);
    productData.append('category', formData.category);
    productData.append('price', formData.price.toString());
    productData.append('stock', formData.stock.toString());
    
    // Images
    formData.images.forEach((img, index) => {
        productData.append(`images_data[${index}][image]`, img.file);
        productData.append(`images_data[${index}][is_main]`, (index === formData.mainImageIndex).toString());
        productData.append(`images_data[${index}][alt_text]`, formData.name);
        
        if (img.color) {
            productData.append(`images_data[${index}][variant_association]`, img.color);
        }
    });

    if (formData.brand) {
      productData.append('brand', formData.brand);
    }
    if (formData.tags) {
      productData.append('tags', formData.tags);
    }
    if (formData.discount > 0) {
      productData.append('discount', formData.discount.toString());
    }
    
    // Variants as JSON string
    if (formData.variants.colors.length > 0 || formData.variants.sizes.length > 0) {
        productData.append('variants', JSON.stringify(formData.variants));
    }

    // Video Data
    if (formData.video) {
        productData.append('video_data[video]', formData.video);
        if (formData.videoTitle) {
            productData.append('video_data[title]', formData.videoTitle);
        }
        if (formData.videoDescription) {
            productData.append('video_data[description]', formData.videoDescription);
        }
    }

    return productData;
  }

  const handleSaveAsDraft = async () => {
    const productData = buildProductData();
    try {
      await createDraft(productData).unwrap();
      toast.success('Product saved as draft!');
      router.push('/admin/product');
    } catch (err) {
      console.error('Failed to save draft:', err);
    }
  };

  const handlePublish = async () => {
    const productData = buildProductData();
    try {
      const draftResult = await createDraft(productData).unwrap();
      if (draftResult.data.slug) {
        await submitDraft(draftResult.data.slug).unwrap();
        toast.success('Product saved and submitted!');
      } else {
        toast.error('Draft created but slug missing, please submit from list.');
      }
      router.push('/admin/product');
    } catch (err: any) {
      console.error('Failed to create/submit product:', err);
      toast.error(err?.data?.message || 'Failed to complete the operation.');
    }
  };

  const toggleColor = (color: string) => {
    setFormData({
      ...formData,
      variants: {
        ...formData.variants,
        colors: formData.variants.colors.includes(color)
          ? formData.variants.colors.filter(c => c !== color)
          : [...formData.variants.colors, color]
      }
    });
  };

  const toggleSize = (size: string) => {
    setFormData({
      ...formData,
      variants: {
        ...formData.variants,
        sizes: formData.variants.sizes.includes(size)
          ? formData.variants.sizes.filter(s => s !== size)
          : [...formData.variants.sizes, size]
      }
    });
  };

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={handleBack} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Add New Product</h1>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200">
              <div 
                className="h-full bg-system-blue-light transition-all duration-300"
                style={{ 
                  width: currentStep === 'basic' ? '0%' : currentStep === 'inventory' ? '50%' : '100%' 
                }}
              />
            </div>

            <div className="flex flex-col items-center relative z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${
                currentStep !== 'basic' ? 'bg-system-blue-light' : 'bg-system-blue-light'
              }`}>
                {currentStep !== 'basic' ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs font-semibold text-white">1</span>
                )}
              </div>
              <span className={`text-xs text-center font-medium ${
                currentStep === 'basic' ? 'text-system-blue-light' : 'text-gray-500'
              }`}>
                Basic Info
              </span>
            </div>

            <div className="flex flex-col items-center relative z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${
                currentStep === 'preview' ? 'bg-system-blue-light' : currentStep === 'inventory' ? 'bg-system-blue-light' : 'bg-white border-2 border-gray-300'
              }`}>
                {currentStep === 'preview' ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={`text-xs font-semibold ${currentStep === 'inventory' ? 'text-white' : 'text-gray-400'}`}>
                    2
                  </span>
                )}
              </div>
              <span className={`text-xs text-center font-medium ${
                currentStep === 'inventory' ? 'text-system-blue-light' : 'text-gray-500'
              }`}>
                Inventory
              </span>
            </div>

            <div className="flex flex-col items-center relative z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${
                currentStep === 'preview' ? 'bg-system-blue-light' : 'bg-white border-2 border-gray-300'
              }`}>
                <span className={`text-xs font-semibold ${currentStep === 'preview' ? 'text-white' : 'text-gray-400'}`}>
                  3
                </span>
              </div>
              <span className={`text-xs text-center whitespace-pre-line font-medium ${
                currentStep === 'preview' ? 'text-system-blue-light' : 'text-gray-500'
              }`}>
                Product{'\n'}Preview
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pb-24">
          {currentStep === 'basic' && (
            <div className="space-y-6">
              <h2 className="text-base font-semibold text-gray-900">
                Basic Product Information
              </h2>

              <div>
                <label className="text-xs text-gray-600 mb-2 block">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter Product Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-2 block">Product Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your product..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light resize-none"
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
                <label className="text-xs text-gray-600 mb-2 block">Upload Product Images (Min 1)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input type="file" className="hidden" id="product-image" onChange={handleFileChange} accept="image/*" multiple />
                  <label htmlFor="product-image" className="cursor-pointer block">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-600">Click to upload images</p>
                    <p className="text-xs text-red-500 mt-1">Not less than 150kb</p>
                  </label>
                </div>

                {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        {previewUrls.map((url, index) => (
                            <div key={index} className="relative group border rounded-lg overflow-hidden">
                                <Image src={url} alt={`Preview ${index}`} width={100} height={100} className="w-full h-24 object-cover" unoptimized />
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                                <button
                                    onClick={() => setFormData({...formData, mainImageIndex: index})}
                                    className={`absolute bottom-0 w-full text-xs py-1 ${formData.mainImageIndex === index ? 'bg-system-blue-light text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {formData.mainImageIndex === index ? 'Main Image' : 'Set as Main'}
                                </button>
                                {formData.variants.colors.length > 0 && (
                                    <div className="mt-1">
                                        <select
                                            value={formData.images[index].color || ''}
                                            onChange={(e) => {
                                                const newImages = [...formData.images];
                                                newImages[index].color = e.target.value;
                                                setFormData({...formData, images: newImages});
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
                            </div>
                        ))}
                    </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-2 block">Upload Product Video (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input 
                    type="file" 
                    className="hidden" 
                    id="product-video" 
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setFormData({...formData, video: e.target.files[0]});
                        }
                    }} 
                    accept="video/*" 
                  />
                  {!formData.video ? (
                    <label htmlFor="product-video" className="cursor-pointer block">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-600">Click to upload video</p>
                    </label>
                  ) : (
                    <div className="relative group border rounded-lg overflow-hidden p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 truncate">{formData.video.name}</span>
                            <button
                                onClick={() => setFormData({...formData, video: null, videoTitle: '', videoDescription: ''})}
                                className="text-red-500 hover:text-red-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    </div>
                  )}
                </div>

                {formData.video && (
                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="text-xs text-gray-600 mb-2 block">Video Title</label>
                            <input
                              type="text"
                              value={formData.videoTitle}
                              onChange={(e) => setFormData({...formData, videoTitle: e.target.value})}
                              placeholder="e.g., Product Demo"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600 mb-2 block">Video Description</label>
                            <textarea
                              value={formData.videoDescription}
                              onChange={(e) => setFormData({...formData, videoDescription: e.target.value})}
                              placeholder="Describe what's in the video..."
                              rows={2}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light resize-none"
                            />
                        </div>
                    </div>
                )}
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

              <button
                onClick={handleProceed}
                className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
              >
                Proceed
              </button>
            </div>
          )}

          {currentStep === 'inventory' && (
            <div className="space-y-6">
              <h2 className="text-base font-semibold text-gray-900">
                Inventory and Pricing
              </h2>

              <div>
                <label className="text-xs text-gray-600 mb-2 block">Stocks (No. of Available Product)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light appearance-none"
                  />
                  <span className="text-sm text-gray-600">Units</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-2 block">Amount per Product</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                  placeholder="₦ 550"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-2 block">Discount (%) (Optional)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                  placeholder="0"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Variants (Optional)</h3>
                
                {/* Colors */}
                <div className="mb-4">
                  <label className="text-xs text-gray-600 mb-2 block">Color</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat mb-3">
                    <option>Color</option>
                  </select>
                  <div className="grid grid-cols-3 gap-2">
                    {['White', 'Black', 'Green', 'Blue', 'Red', 'Yellow'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => toggleColor(color)}
                        className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                          formData.variants.colors.includes(color)
                            ? 'bg-system-blue-light text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <label className="text-xs text-gray-600 mb-2 block">Size</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat mb-3">
                    <option>Size</option>
                  </select>
                  <div className="grid grid-cols-6 gap-2">
                    {['24', '25', '26', '27', '28', '29', '30', '36', '37', '38', '39', '40', '41', '42', '43'].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                          formData.variants.sizes.includes(size)
                            ? 'bg-system-blue-light text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceed}
                className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
              >
                Proceed
              </button>
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="space-y-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Product Preview
              </h2>

              {/* Product Image */}
              <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center mb-4 relative overflow-hidden">
                {previewUrls.length > 0 ? (
                    <>
                        <Image src={previewUrls[formData.mainImageIndex]} alt={formData.name} width={200} height={200} className="w-full h-full object-contain" unoptimized />
                        {previewUrls.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                +{previewUrls.length - 1} more
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500">No Product Image</p>
                    </div>
                )}
              </div>

              {/* Product Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{formData.name || 'Product Name'}</h3>
                <p className="text-sm text-gray-600 mb-4">{formData.description || 'Product description goes here...'}</p>
                <div className="flex items-center gap-2 mb-4">
                    <p className="text-2xl font-bold text-gray-900">₦{formData.price.toLocaleString()}</p>
                    {formData.discount > 0 && (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                            -{formData.discount}%
                        </span>
                    )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="text-gray-900 font-medium">{formData.category || 'Category Name'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className="text-gray-900 font-medium">{formData.stock} Units</span>
                  </div>
                </div>
              </div>
              
              {isError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">
                          {(error as any)?.data?.message || 'Failed to create product. Please check the fields.'}
                      </p>
                  </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSaveAsDraft}
                  disabled={isLoading}
                  className="flex-1 py-3.5 bg-white text-system-blue-light border border-system-blue-light rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {isSavingDraft ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isLoading}
                  className="flex-1 py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Save & Submit'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}