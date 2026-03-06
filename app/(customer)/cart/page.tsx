'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import Image from 'next/image';
import { 
  useGetCartQuery, 
  useRemoveFromCartMutation, 
  useUpdateCartItemMutation,
  CartItem
} from '@/lib/api/publicApi';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CartPage() {
  const { data: cartResponse, isLoading, isError } = useGetCartQuery();
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();

  const cartItems = cartResponse?.data?.items || [];
  const cartTotal = cartResponse?.data?.total || '0.00';

  const handleRemoveItem = async (slug: string, selected_variants: Record<string, string>) => {
    if (!slug) return;
    try {
      await removeFromCart({ slug, selected_variants }).unwrap();
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const handleUpdateQuantity = async (slug: string, newQuantity: number, selected_variants: Record<string, string>) => {
    if (newQuantity < 0) return;
    try {
      await updateCartItem({ slug, quantity: newQuantity, selected_variants }).unwrap();
    } catch (err) {
      console.error('Failed to update quantity:', err);
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

  return (
    <AppLayout showBottomNav={true} userRole="customer">
      <div className="bg-white pb-24">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900 text-center">Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Add products to your cart and they will appear here
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="p-4 space-y-4">
              {cartItems.map((item: any) => {
                const product = item.product_details;
                const slug = product?.slug || item.product; // Fallback to item.product if slug missing in details

                return (
                  <div key={item.id} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                       {product?.image ? (
                          <Image 
                            src={product.image} 
                            alt={product.name || 'Product'} 
                            fill
                            className="object-cover"
                          />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                       )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 pr-2">
                          <Link href={`/product/${slug}`} className="block">
                            <h3 className="text-sm font-medium text-gray-900 truncate hover:text-system-blue-light">
                              {product?.name || 'Unknown Product'}
                            </h3>
                          </Link>
                          
                          {/* Selected Variants Display */}
                          {item.selected_variants && Object.keys(item.selected_variants).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1 mb-1">
                              {Object.entries(item.selected_variants).map(([key, value]) => (
                                <span key={key} className="inline-block px-1.5 py-0.5 bg-gray-100 text-[10px] text-gray-600 rounded capitalize">
                                  {key}: {value as string}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-col">
                            <p className="text-base font-bold text-system-blue-light">
                                {product?.discount && product.discount > 0 ? (
                                    <>
                                    ₦{(parseFloat(product.price) * (1 - product.discount / 100)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    </>
                                ) : (
                                    `₦${parseFloat(product?.price || '0').toLocaleString()}`
                                )}
                            </p>
                            {product?.discount && product.discount > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 line-through font-medium">
                                        ₦{parseFloat(product.price).toLocaleString()}
                                    </span>
                                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                        -{product.discount}%
                                    </span>
                                </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(slug, item.selected_variants)}
                          disabled={isRemoving}
                          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                          <button
                            onClick={() => handleUpdateQuantity(slug, item.quantity - 1, item.selected_variants)}
                            disabled={isUpdating || item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 font-medium hover:bg-white rounded-md transition-colors disabled:opacity-50"
                          >
                            −
                          </button>
                          <span className="text-sm font-medium text-gray-900 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(slug, item.quantity + 1, item.selected_variants)}
                            disabled={isUpdating}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 font-medium hover:bg-white rounded-md transition-colors disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                            Subtotal: ₦{parseFloat(item.subtotal || '0').toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout Footer */}
            <div className="fixed bottom-16 left-0 right-0 mx-auto max-w-150 p-4 bg-white border-t border-gray-200 shadow-lg z-10">
               <div className="flex items-center justify-between gap-4">
                  <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-xl font-bold text-gray-900">₦{parseFloat(cartTotal).toLocaleString()}</p>
                  </div>
                  <Link
                    href="/checkout"
                    className="flex-1 max-w-[200px] py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors text-center shadow-sm"
                  >
                    Checkout
                  </Link>
               </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}