'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  quantity: number;
  selected: boolean;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', name: 'Product Name', price: 3.1, rating: 3.1, quantity: 1, selected: true },
    { id: '2', name: 'Product Name', price: 3.9, rating: 3.9, quantity: 2, selected: false },
    { id: '3', name: 'Product Name', price: 4.5, rating: 4.5, quantity: 1, selected: true },
  ]);

  const toggleSelection = (id: string) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <AppLayout showBottomNav={true} userRole="customer">
      <div className="min-h-screen bg-white pb-24">
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
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  {/* Radio Button */}
                  <button
                    onClick={() => toggleSelection(item.id)}
                    className="flex-shrink-0"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      item.selected ? 'border-system-blue-light bg-system-blue-light' : 'border-gray-300'
                    }`}>
                      {item.selected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                      )}
                    </div>
                  </button>

                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0"></div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-base font-bold text-system-blue-light">
                          ${item.price.toFixed(1)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex-shrink-0 p-1"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-gray-600 text-lg font-medium"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium text-gray-900 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-gray-600 text-lg font-medium"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Button */}
            <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[600px] p-4 bg-white border-t border-gray-200">
              <Link
                href="/checkout"
                className="block w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors text-center"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}