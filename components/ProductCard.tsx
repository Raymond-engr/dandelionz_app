'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Product, useAddToCartMutation, useAddToWishlistMutation, useRemoveFromWishlistMutation, useGetCartQuery, useGetWishlistQuery, useRemoveFromCartMutation } from '@/lib/api/publicApi';
import { useAppSelector } from '@/lib/hooks';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  hideAddToCart?: boolean;
}

export default function ProductCard({ product, hideAddToCart = false }: ProductCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data: cartResponse } = useGetCartQuery(undefined, {
    skip: !isAuthenticated
  });
  const { data: wishlistResponse } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated
  });

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [removeFromCart, { isLoading: isRemovingFromCart }] = useRemoveFromCartMutation();
  const [addToWishlist, { isLoading: isAddingToWishlist }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] = useRemoveFromWishlistMutation();

  const cartItems = cartResponse?.data?.items || [];
  const wishlistItems = wishlistResponse || [];
  
  const isInCart = cartItems.some((item: any) => item.product_details?.slug === product.slug);
  const isInWishlist = wishlistItems.some((item: any) => item.product_details?.slug === product.slug);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    if (!product.slug) return;
    try {
      if (isInWishlist) {
         await removeFromWishlist(product.slug).unwrap();
         toast.success('Removed from wishlist');
      } else {
         await addToWishlist({ slug: product.slug }).unwrap();
         toast.success('Added to wishlist');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  const handleToggleCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    if (!product.slug) return;
    try {
      if (isInCart) {
        await removeFromCart(product.slug).unwrap();
        toast.success('Removed from cart');
      } else {
        await addToCart({ slug: product.slug, quantity: 1 }).unwrap();
        toast.success('Added to cart');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  return (
    <Link href={`/product/${product.slug || product.id}`}>
    <div className="flex flex-col bg-white rounded-lg overflow-hidden group border border-gray-100 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            fill
            unoptimized={product.image.startsWith('http') || product.image.startsWith('blob:')}
          />

        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        
        {/* Wishlist Icon */}
        <button 
            onClick={handleWishlist}
            disabled={isAddingToWishlist || isRemovingFromWishlist}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex flex-col">
            <p className="text-base font-bold text-system-blue-light break-all line-clamp-2">
              {(product.discount ?? 0) > 0 ? (
                <>
                   ₦{(parseFloat(product.price) * (1 - (product.discount ?? 0) / 100)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </>
              ) : (
                 `₦${parseFloat(product.price || '0').toLocaleString()}`
              )}
            </p>
            {(product.discount ?? 0) > 0 && (
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 line-through">
                        ₦{parseFloat(product.price).toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        -{(product.discount)}%
                    </span>
                </div>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 bg-gray-50 px-1.5 py-0.5 rounded-md mt-0.5">
            <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="text-[10px] font-bold text-gray-700">{product.rating ?? '0.0'}</span>
          </div>
        </div>

        {/* Add/Remove Cart Button */}
        {!hideAddToCart && (
          <button
            onClick={handleToggleCart}
            disabled={isAddingToCart || isRemovingFromCart}
            className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 ${
              isInCart 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-gray-50 text-system-blue-light hover:bg-system-blue-light hover:text-white'
            }`}
          >
            {isAddingToCart ? 'Adding...' : isRemovingFromCart ? 'Removing...' : isInCart ? 'Remove from Cart' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
    </Link>
  );
}