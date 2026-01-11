'use client';

import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

export default function RegistrationSuccessPage() {
  const router = useRouter();

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Registration Successful!</h1>
        <p className="text-sm text-gray-600 mb-8 max-w-sm">
          A verification link has been sent to your email address. Please check your inbox and click the link to verify your account.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="px-8 py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
        >
          Go to Login
        </button>
      </div>
    </AppLayout>
  );
}
