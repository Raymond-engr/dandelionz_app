import React from 'react';
import BottomNav from './BottomNav';
import VendorBottomNav from './VendorBottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  userRole?: 'customer' | 'vendor';
}

export default function AppLayout({ children, showBottomNav = false, userRole = 'customer' }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-[600px] min-h-screen bg-white relative flex flex-col">
        {/* Main content area */}
        <main className={`flex-1 ${showBottomNav ? 'pb-20' : ''}`}>
          {children}
        </main>
        
        {/* Bottom Navigation - conditionally rendered */}
        {showBottomNav && (userRole === 'vendor' ? <VendorBottomNav /> : <BottomNav />)}
      </div>
    </div>
  );
}