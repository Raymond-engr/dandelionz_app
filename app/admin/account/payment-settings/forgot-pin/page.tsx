'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';

type ForgotPinStep = 'otp' | 'newPin' | 'success';

export default function ForgotPINPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ForgotPinStep>('otp');
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [newPin, setNewPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(45);

  useEffect(() => {
    if (countdown > 0 && currentStep === 'otp') {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, currentStep]);

  const handlePinInput = (index: number, value: string, setter: React.Dispatch<React.SetStateAction<string[]>>, pinArray: string[], nextId?: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newArray = [...pinArray];
      newArray[index] = value;
      setter(newArray);
      if (value && index < pinArray.length - 1 && nextId) {
        document.getElementById(nextId)?.focus();
      }
    }
  };

  const handleVerifyOTP = () => {
    setCurrentStep('newPin');
  };

  const handleChangePIN = () => {
    setCurrentStep('success');
  };

  const handleGoHome = () => {
    router.push('/admin/account/payment-settings');
  };

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">
            {currentStep === 'success' ? 'Confirmation' : currentStep === 'otp' ? 'Forgot Payment PIN' : 'Set New PIN'}
          </h1>
        </div>

        {currentStep === 'otp' && (
          <div className="p-6">
            <p className="text-sm text-gray-700 mb-6 text-center">
              A 5-digit OTP has been sent to your email{' '}
              <span className="text-system-blue-light font-medium">adamsmith@.....com</span>
            </p>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-900 mb-4 block">OTP</label>
              <div className="flex gap-3 justify-center mb-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinInput(index, e.target.value, setOtp, otp, `otp-${index + 1}`)}
                    className="w-14 h-14 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-system-blue-light"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Resend in <span className="font-medium">0:{countdown.toString().padStart(2, '0')}s</span>
              </p>
            </div>

            <button
              onClick={handleVerifyOTP}
              className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors mt-8"
            >
              Verify OTP
            </button>
          </div>
        )}

        {currentStep === 'newPin' && (
          <div className="p-6">
            <div className="space-y-12 mb-12">
              <div>
                <label className="text-sm font-medium text-gray-900 mb-4 block">New PIN</label>
                <div className="flex gap-3 justify-center">
                  {newPin.map((digit, index) => (
                    <input
                      key={index}
                      id={`new-pin-${index}`}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinInput(index, e.target.value, setNewPin, newPin, `new-pin-${index + 1}`)}
                      className="w-16 h-16 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-system-blue-light"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 mb-4 block">Confirm PIN</label>
                <div className="flex gap-3 justify-center">
                  {confirmPin.map((digit, index) => (
                    <input
                      key={index}
                      id={`confirm-pin-${index}`}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinInput(index, e.target.value, setConfirmPin, confirmPin, `confirm-pin-${index + 1}`)}
                      className="w-16 h-16 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-system-blue-light"
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleChangePIN}
              className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Change PIN
            </button>
          </div>
        )}

        {currentStep === 'success' && (
          <div className="flex flex-col items-center justify-center px-6 py-20">
            <div className="w-32 h-32 bg-system-blue-light rounded-full flex items-center justify-center mb-8">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-system-blue-light text-center mb-12">
              PIN has been successfully<br />changed
            </h2>

            <button
              onClick={handleGoHome}
              className="w-full max-w-sm py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
            >
              Go Home
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}