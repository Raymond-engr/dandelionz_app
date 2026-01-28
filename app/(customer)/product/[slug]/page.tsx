'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
    useGetProductBySlugQuery, 
    useAddToCartMutation, 
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
    useGetWishlistQuery,
    useGetCartQuery,
    useRemoveFromCartMutation
} from '@/lib/api/publicApi';
import { useAppSelector } from '@/lib/hooks';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug as string;
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Fetch real product data
  const { data: response, isLoading, isError } = useGetProductBySlugQuery(slug);
  const product = response?.data;

  // Fetch wishlist data to check if item exists
  const { data: wishlistResponse } = useGetWishlistQuery(undefined, {
      skip: !isAuthenticated
  });
  const wishlistItems = wishlistResponse || [];
  const isInWishlist = product ? wishlistItems.some((item: any) => item.product_details?.slug === product.slug) : false;

  // Fetch cart data to check if item exists
  const { data: cartResponse } = useGetCartQuery(undefined, {
    skip: !isAuthenticated
  });
  const cartItems = cartResponse?.data?.items || [];
  const isInCart = product ? cartItems.some((item: any) => item.product_details?.slug === product.slug) : false;

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [removeFromCart, { isLoading: isRemovingFromCart }] = useRemoveFromCartMutation();
  const [addToWishlist, { isLoading: isAddingToWishlist }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] = useRemoveFromWishlistMutation();

  const handleToggleCart = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    if (!product || !product.slug) return;
    try {
      if (isInCart) {
        await removeFromCart(product.slug).unwrap();
        toast.success('Removed from cart');
      } else {
        await addToCart({ slug: product.slug, quantity }).unwrap();
        toast.success('Product added to cart');
      }
    } catch (err) {
      console.error('Failed to update cart:', err);
      toast.error('Failed to update cart');
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    if (!product || !product.slug) return;
    try {
      if (isInWishlist) {
          await removeFromWishlist(product.slug).unwrap();
          toast.success('Removed from wishlist');
      } else {
          await addToWishlist({ slug: product.slug }).unwrap();
          toast.success('Product added to wishlist');
      }
    } catch (err) {
        console.error('Failed to update wishlist:', err);
        toast.error('Failed to update wishlist');
    }
  };

  if (isLoading) {
    return (
        <AppLayout showBottomNav={true} userRole="customer">
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        </AppLayout>
    );
  }

  if (isError || !product) {
    return (
        <AppLayout showBottomNav={true} userRole="customer">
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h1>
                <p className="text-sm text-gray-600 mb-6">We couldn't find the product you're looking for.</p>
                <button 
                    onClick={() => router.push('/')}
                    className="px-6 py-3 bg-system-blue-light text-white rounded-lg font-medium"
                >
                    Back to Home
                </button>
            </div>
        </AppLayout>
    );
  }

  // Handle images array (fallback to dummy logic if API array is empty)
  const images = product.images && product.images.length > 0 
    ? product.images.map(img => img.image_url) 
    : [product.image || '/placeholder-category.png'];

  return (
    <AppLayout showBottomNav={true} userRole="customer">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-gray-900">Product Description</h1>
          <div className="w-6"></div>
        </div>

        {/* Product Images */}
        <div className="px-4 pt-4">
          
          {/* Main Image */}
          <div className="relative w-full aspect-video bg-gray-100 rounded-2xl mb-4 overflow-hidden">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill 
              className="object-cover" 
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target) {
                    target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="#f3f4f6" width="400" height="400"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="16">Product Image</text></svg>';
                }
              }}
            />
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`flex-none w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedImage === idx ? 'border-system-blue-light' : 'border-transparent'
                }`}
              >
                <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="px-4 pb-24">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {product.name}
          </h2>

          {/* Description */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              {product.description}
            </p>
            {product.store_name && (
                <p className="text-sm font-medium text-system-blue-light">
                    Store: {product.store_name}
                </p>
            )}
          </div>

          {/* Price and Rating */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Amount</p>
              <p className="text-2xl font-bold text-system-blue-light">
                ${product.price}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">{product.rating || '0.0'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {/* Wishlist Button */}
            <button 
                onClick={handleToggleWishlist}
                disabled={isAddingToWishlist || isRemovingFromWishlist}
                className={`w-12 h-12 flex items-center justify-center border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 ${isInWishlist ? 'border-red-200 bg-red-50' : 'border-gray-300'}`}
            >
              <svg className={`w-6 h-6 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Add/Remove Cart Button */}
            <button
              onClick={handleToggleCart}
              disabled={isAddingToCart || isRemovingFromCart || !product.in_stock}
              className={`flex-1 h-12 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
                isInCart 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                    : 'bg-system-blue-light text-white hover:bg-[#020360]'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {isAddingToCart ? 'Adding...' : isRemovingFromCart ? 'Removing...' : isInCart ? 'Remove from Cart' : (product.in_stock ? 'Add to cart' : 'Out of Stock')}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}