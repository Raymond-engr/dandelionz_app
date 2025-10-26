import React from 'react';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
}

export default function AppLayout({ children, showBottomNav = false }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-[600px] min-h-screen bg-white relative flex flex-col">
        {/* Main content area */}
        <main className={`flex-1 ${showBottomNav ? 'pb-20' : ''}`}>
          {children}
        </main>
        
        {/* Bottom Navigation - conditionally rendered */}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}