'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';

export default function RegisterPage() {
  const [role, setRole] = useState('Customer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    stateRegion: 'Abia State',
    storeName: '', // Only for vendors
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', { role, ...formData });
  };

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen flex flex-col p-6">
        {/* Back Button */}
        <button className="self-start mb-6">
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          Create your Dandelionz Account
        </h1>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Role Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-600">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-system-blue-light text-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
            >
              <option value="Customer">Customer</option>
              <option value="Vendor">Vendor</option>
            </select>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="fullName" className="text-xs text-gray-600">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full px-0 py-3 border-b border-gray-300 focus:border-system-blue-light focus:outline-none transition-colors text-sm"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs text-gray-600">Email Address</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-0 py-3 border-b border-gray-300 focus:border-system-blue-light focus:outline-none transition-colors text-sm"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-xs text-gray-600">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              className="w-full px-0 py-3 border-b border-gray-300 focus:border-system-blue-light focus:outline-none transition-colors text-sm"
              required
            />
          </div>

          {/* State/Region */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-600">State/Region</label>
            <select
              value={formData.stateRegion}
              onChange={(e) => setFormData({...formData, stateRegion: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-system-blue-light text-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
            >
              <option>Abia State</option>
              <option>Lagos State</option>
              <option>Abuja FCT</option>
            </select>
          </div>

          {/* Store Name (Vendors only) */}
          {role === 'Vendor' && (
            <div className="flex flex-col gap-2">
              <label htmlFor="storeName" className="text-xs text-gray-600">Store Name</label>
              <input
                id="storeName"
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                className="w-full px-0 py-3 border-b border-gray-300 focus:border-system-blue-light focus:outline-none transition-colors text-sm"
                required={role === 'Vendor'}
              />
            </div>
          )}

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-xs text-gray-600">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-0 py-3 border-b border-gray-300 focus:border-system-blue-light focus:outline-none transition-colors text-sm pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-xs text-gray-600">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-0 py-3 border-b border-gray-300 focus:border-system-blue-light focus:outline-none transition-colors text-sm pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Remember Password Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberPassword}
              onChange={(e) => setRememberPassword(e.target.checked)}
              className="w-4 h-4 text-system-blue-light border-gray-300 rounded focus:ring-system-blue-light"
            />
            <span className="text-sm text-gray-700">Remember my Password</span>
          </label>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors mt-2"
          >
            Register
          </button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-system-blue-light font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </AppLayout>
  );
}