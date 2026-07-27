'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, usePathname } from 'next/navigation';
import { useGetAdminProductDetailsQuery, useGetAllCategoriesQuery } from '@/lib/api/adminApi';
import { usePatchProductMutation } from '@/lib/api/vendorApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { apiError } from '@/lib/utils';

function getIdFromPath(pathname: string | null) {
  if (!pathname) return '';
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length >= 3 && segments[segments.length - 1] === 'edit') {
    return segments[segments.length - 2];
  }
  return segments[segments.length - 1] ?? '';
}

interface EditFormData {
  name: string;
  description: string;
  category: string;
  brand: string;
  tags: string;
  stock: number;
  price: number;
  discount: number;
  images: { file: File | string; color?: string }[];
  variants: { colors: string[]; sizes: string[] };
  variant_stock: { colors: Record<string, number>; sizes: Record<string, number> };
}

function AdminEditProductComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const id = getIdFromPath(pathname);

  const { data: productData, isLoading, error } = useGetAdminProductDetailsQuery(id);
  const { data: categories = [], refetch: refetchCategories } = useGetAllCategoriesQuery();
  const [patchProduct, { isLoading: isSaving }] = usePatchProductMutation();

  useEffect(() => {
    window.addEventListener('focus', refetchCategories);
    return () => window.removeEventListener('focus', refetchCategories);
  }, [refetchCategories]);

  const [formData, setFormData] = useState<EditFormData>({
    name: '',
    description: '',
    category: '',
    brand: '',
    tags: '',
    stock: 0,
    price: 0,
    discount: 0,
    images: [],
    variants: { colors: [], sizes: [] },
    variant_stock: { colors: {}, sizes: {} },
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const product = productData?.data;

  useEffect(() => {
    if (product) {
      let parsedVariants = { colors: [] as string[], sizes: [] as string[] };
      if ((product as any).variants) {
        const pv = (product as any).variants;
        parsedVariants = typeof pv === 'string' ? JSON.parse(pv) : pv;
      }

      let parsedVariantStock = { colors: {} as Record<string, number>, sizes: {} as Record<string, number> };
      if ((product as any).variant_stock) {
        const vs = (product as any).variant_stock;
        parsedVariantStock = { colors: vs.colors || {}, sizes: vs.sizes || {} };
      }

      let existingImages: string[] = [];
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        existingImages = product.images
          .map((img: any) => (typeof img === 'string' ? img : (img.image_url || img.image)))
          .filter((url: any) => typeof url === 'string' && url.length > 0);
      } else if (product.image) {
        existingImages = [product.image];
      }

      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: (product as any).category_slug || String(product.category) || '',
        brand: (product as any).brand || '',
        tags: Array.isArray((product as any).tags) ? (product as any).tags.join(', ') : ((product as any).tags || ''),
        stock: product.stock || 0,
        price: parseFloat(product.price) || 0,
        discount: product.discount || 0,
        images: existingImages.map(url => ({ file: url })),
        variants: { colors: parsedVariants.colors || [], sizes: parsedVariants.sizes || [] },
        variant_stock: parsedVariantStock,
      });

      setPreviewUrls(existingImages);
    }
  }, [product]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles.map(file => ({ file }))],
      }));
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const toggleColor = (color: string) => {
    setFormData(prev => {
      const isSelected = prev.variants.colors.includes(color);
      const newColors = isSelected ? prev.variants.colors.filter(c => c !== color) : [...prev.variants.colors, color];
      const newColorStock = { ...prev.variant_stock.colors };
      if (isSelected) delete newColorStock[color];
      return { ...prev, variants: { ...prev.variants, colors: newColors }, variant_stock: { ...prev.variant_stock, colors: newColorStock } };
    });
  };

  const toggleSize = (size: string) => {
    setFormData(prev => {
      const isSelected = prev.variants.sizes.includes(size);
      const newSizes = isSelected ? prev.variants.sizes.filter(s => s !== size) : [...prev.variants.sizes, size];
      const newSizeStock = { ...prev.variant_stock.sizes };
      if (isSelected) delete newSizeStock[size];
      return { ...prev, variants: { ...prev.variants, sizes: newSizes }, variant_stock: { ...prev.variant_stock, sizes: newSizeStock } };
    });
  };

  const handleSave = async () => {
    const changes = new FormData();
    changes.append('name', formData.name);
    changes.append('description', formData.description);
    changes.append('category', formData.category);
    changes.append('price', formData.price.toString());
    changes.append('stock', formData.stock.toString());
    // Sent unconditionally like every other field above: skipping the empty
    // case meant clearing brand or tags silently kept the previous value.
    changes.append('brand', formData.brand.trim());
    changes.append('tags', formData.tags.trim());
    changes.append('discount', formData.discount.toString());

    if (formData.variants.colors.length > 0 || formData.variants.sizes.length > 0) {
      changes.append('variants', JSON.stringify(formData.variants));
    }
    const hasVariantStock =
      Object.keys(formData.variant_stock.colors).length > 0 ||
      Object.keys(formData.variant_stock.sizes).length > 0;
    if (hasVariantStock) {
      changes.append('variant_stock', JSON.stringify(formData.variant_stock));
    }

    formData.images.forEach((img, index) => {
      if (typeof img.file !== 'string') {
        changes.append(`images_data[${index}][image]`, img.file);
      }
    });

    try {
      await patchProduct({ slug: id, data: changes }).unwrap();
      toast.success('Product updated successfully!');
      router.push('/admin/product');
    } catch (err: any) {
      if (err?.data?.error?.category) {
        setFormData(prev => ({ ...prev, category: '' }));
        refetchCategories();
        toast.error('Category no longer available. Please pick a category again from the refreshed list.');
        return;
      }
      toast.error(apiError(err, 'Failed to save changes.'));
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load product details.</p>
      </div>
    );
  }

  const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const shoeSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
  const mixedSizes = formData.variants.sizes.some(s => clothingSizes.includes(s)) && formData.variants.sizes.some(s => shoeSizes.includes(s));

  return (
    <div className="p-6 pb-24 space-y-8">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
        {product && (
          <span className={`capitalize text-sm font-medium px-3 py-1 rounded-full ${
            product.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
            product.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {product.status}
          </span>
        )}
      </div>

      {/* Basic Info */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

        <div>
          <label className="text-xs text-gray-600 mb-2 block">Product Name</label>
          <input type="text" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 mb-2 block">Product Description</label>
          <textarea value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-system-blue-light"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-600 mb-2 block">Category</label>
            <select value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light appearance-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat: any) => (
                <option key={cat.id || cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-2 block">Brand</label>
            <input type="text" value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="Brand Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-600 mb-2 block">Tags</label>
          <input type="text" value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g., Electronics, fans, home appliances..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input type="file" className="hidden" id="admin-product-image-edit" onChange={handleFileChange} accept="image/*" multiple />
          <label htmlFor="admin-product-image-edit" className="cursor-pointer block">
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
                <Image src={url} alt={`Preview ${index}`} fill sizes="25vw" className="object-cover" unoptimized={url.startsWith('blob:')} />
                <button onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inventory */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Inventory & Pricing</h3>

        <div>
          <label className="text-xs text-gray-600 mb-2 block">Stock (Units)</label>
          <input type="number" value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value || '0') })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-600 mb-2 block">Price (₦)</label>
            <input type="number" value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value || '0') })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-2 block">Discount (%) (Optional)</label>
            <input type="number" min="0" max="100" value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value || '0') })}
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
            <div className="grid grid-cols-3 gap-2">
              {['White', 'Black', 'Green', 'Blue', 'Red', 'Yellow'].map((color) => (
                <button key={color} type="button" onClick={() => toggleColor(color)}
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
            {formData.variants.colors.length > 0 && (
              <div className="mt-3 space-y-2">
                <label className="text-xs text-gray-600">Stock per Color (Optional)</label>
                {formData.variants.colors.map(color => (
                  <div key={color} className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 w-16">{color}</span>
                    <input type="number" min="0"
                      value={formData.variant_stock.colors[color] ?? ''}
                      onChange={(e) => {
                        const n = parseInt(e.target.value, 10);
                        setFormData(prev => ({
                          ...prev,
                          variant_stock: { ...prev.variant_stock, colors: { ...prev.variant_stock.colors, [color]: Number.isNaN(n) ? 0 : n } }
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
              {clothingSizes.map((size) => (
                <button key={size} type="button" onClick={() => toggleSize(size)}
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
              {shoeSizes.map((size) => (
                <button key={size} type="button" onClick={() => toggleSize(size)}
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

            {mixedSizes && (
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
                    <input type="number" min="0"
                      value={formData.variant_stock.sizes[size] ?? ''}
                      onChange={(e) => {
                        const n = parseInt(e.target.value, 10);
                        setFormData(prev => ({
                          ...prev,
                          variant_stock: { ...prev.variant_stock, sizes: { ...prev.variant_stock.sizes, [size]: Number.isNaN(n) ? 0 : n } }
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
        <button onClick={handleSave} disabled={isSaving}
          className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
        <button onClick={() => router.push('/admin/product')} disabled={isSaving}
          className="w-full py-3.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AdminEditProductPage() {
  return (
    <AppLayout showBottomNav={false} userRole="admin">
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
          <AdminEditProductComponent />
        </Suspense>
      </div>
    </AppLayout>
  );
}
