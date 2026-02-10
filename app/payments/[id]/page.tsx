'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PaymentRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      // Redirect to the order details page using the provided ID
      router.replace(`/orders/${id}`);
    } else {
      router.replace('/');
    }
  }, [id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner />
        <p className="text-sm text-gray-600 animate-pulse">Redirecting to order details...</p>
      </div>
    </div>
  );
}
