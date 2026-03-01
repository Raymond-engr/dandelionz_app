'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/lib/api/authApi';
import { useAppDispatch } from '@/lib/hooks';
import { setCredentials } from '@/lib/features/auth/authSlice';
import PasswordCriteria, { validatePassword } from '@/components/PasswordCriteria';

export default function RegisterClientPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading, error }] = useRegisterMutation();
  
  const [role, setRole] = useState<'CUSTOMER' | 'VENDOR'>('CUSTOMER');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    referralCode: '', // Optional referral code
  });

  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validate Full Name
    if (!formData.fullName.trim()) {
      setValidationError('Full Name is required');
      return;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    // Validate Phone Number
    const phoneRegex = /^\+?[\d\s-]{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setValidationError('Please enter a valid phone number (10-15 digits)');
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    // Validate password strength
    const criteria = validatePassword(formData.password);
    if (!criteria.length || !criteria.uppercase || !criteria.lowercase || !criteria.special) {
      setValidationError('Password does not meet all security requirements.');
      return;
    }

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        phone_number: formData.phoneNumber,
        full_name: formData.fullName,
        role: role,
        ...(role === 'CUSTOMER' && formData.referralCode && { referral_code: formData.referralCode }),
      }).unwrap();

      // If we have tokens, store them (usually means no verification needed or auto-verified)
      if (result.data.tokens) {
        dispatch(setCredentials({
          user: result.data.user,
          accessToken: result.data.tokens.access_token,
          refreshToken: result.data.tokens.refresh_token,
        }));
      }

      // If email verification is needed, redirect to verification page
      if (!result.data.user.is_verified) {
        router.push('/registration-success');
      } else {
        // Redirect based on role
        if (role === 'VENDOR') {
          router.push('/vendor');
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      setValidationError(err?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <AppLayout showBottomNav={false} userRole={role.toLowerCase() as 'customer' | 'vendor'}>
      <div className="min-h-screen flex flex-col p-6">
        {/* Back Button */}
        <button onClick={() => router.back()} className="self-start mb-6">
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          Create your Dandelionz Account
        </h1>

        {/* Error Message */}
        {(validationError || error) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              {validationError || (error as any)?.data?.message || 'An error occurred'}
            </p>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Role Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-600">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'CUSTOMER' | 'VENDOR')}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-system-blue-light text-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-size-[1.25rem] bg-position-[right_0.5rem_center] bg-no-repeat"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="VENDOR">Vendor</option>
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
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            {formData.password && <PasswordCriteria password={formData.password} />}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Referral Code (Optional) - Only for Customers */}
          {role === 'CUSTOMER' && (
            <div className="flex flex-col gap-2">
              <label htmlFor="referralCode" className="text-xs text-gray-600">
                Referral Code <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                id="referralCode"
                type="text"
                value={formData.referralCode}
                onChange={(e) => setFormData({...formData, referralCode: e.target.value.toUpperCase()})}
                className="w-full px-0 py-3 border-b border-gray-300 focus:border-system-blue-light focus:outline-none transition-colors text-sm"
                placeholder="Enter referral code if you have one"
              />
            </div>
          )}

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
            disabled={isLoading}
            className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
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
