'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import BottomNav from './BottomNav';
import VendorBottomNav from './VendorBottomNav';
import AdminBottomNav from './AdminBottomNav';
import { useAppSelector } from '@/lib/hooks';

interface AppLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  userRole?: 'customer' | 'vendor' | 'admin';
  requireAuth?: boolean;
}

export default function AppLayout({ 
  children, 
  showBottomNav = false, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userRole = 'customer',
  requireAuth = false 
}: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const publicRoutes = ['/login', '/register', '/forgot-password', '/verify-email', '/verify-notice', '/'];
    const protectedRoutePatterns = ['/account', '/checkout', '/wishlist', '/orders', '/cart', '/receipt'];
    
    const isPublicRoute = publicRoutes.includes(pathname) || pathname === '/';
    const isProtectedRoute = protectedRoutePatterns.some(route => pathname.startsWith(route));

    if ((requireAuth || isProtectedRoute) && !isAuthenticated && !isPublicRoute) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Role-based route protection
    if (isAuthenticated && user) {
      const currentRole = user.role;
      
      // Redirect if accessing wrong role's routes
      if (pathname.startsWith('/admin') && currentRole !== 'BUSINESS_ADMIN') {
        router.push('/');
      } else if (pathname.startsWith('/vendor') && currentRole !== 'VENDOR') {
        router.push('/');
      } else if (pathname.startsWith('/account') && currentRole !== 'CUSTOMER') {
        // Allow customer-like account access or redirect? 
        // Docs say customer has profile, so we allow if role is CUSTOMER
        // If they are vendor/admin trying to access /account (customer), send home
        router.push('/');
      }
    }
  }, [isAuthenticated, user, pathname, router, requireAuth]);

  // Determine which nav to show based on authenticated user's actual role
  const actualRole = user?.role;
  const bottomNavComponent = 
    actualRole === 'VENDOR' ? <VendorBottomNav /> :
    actualRole === 'BUSINESS_ADMIN' ? <AdminBottomNav /> :
    <BottomNav />;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-[600px] min-h-screen bg-white relative flex flex-col">
        {/* Main content area */}
        <main className={`flex-1 ${showBottomNav ? 'pb-20' : ''}`}>
          {children}
        </main>
        
        {/* Bottom Navigation - conditionally rendered */}
        {showBottomNav && (
          isAuthenticated ? bottomNavComponent : <BottomNav />
        )}
      </div>
    </div>
  );
}