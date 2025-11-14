'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Dummy product data
  const product = {
    id: '1',
    name: 'Product Name',
    price: 29.99,
    rating: 3.9,
    description: "Here we'll have a good description of the product it might get very long, but it can be tiny small too.",
    vendor: "Well it depends heavily on the product and the vendor shit, who knows",
    images: [
      '/placeholder-1.jpg',
      '/placeholder-2.jpg',
      '/placeholder-3.jpg',
    ],
  };

  const handleAddToCart = () => {
    console.log('Add to cart:', { product, quantity });
    // Add to cart logic here
  };

  return (
    <AppLayout showBottomNav={true}>
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
        <div className="p-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
            <p className="text-gray-400">Product Image</p>
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`flex-1 aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 ${
                  selectedImage === idx ? 'border-system-blue-light' : 'border-transparent'
                }`}
              >
                <p className="text-xs text-gray-400">Img {idx + 1}</p>
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
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.vendor}
            </p>
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
              <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {/* Wishlist Button */}
            <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-12 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}