'use client';

import Link from 'next/link';
import { Home, Order, Account, Shop, Product, Users } from './icons'; 
import { usePathname } from 'next/navigation';

export default function AdminBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/admin',
      name: 'Home',
      icon: (active: boolean) => (
        <Home className="w-6 h-6" active={active} />
      )
    },
    {
      href: '/admin/vendor',
      name: 'Vendor',
      icon: (active: boolean) => (
        <Shop className="w-6 h-6" active={active} />
      )
    },
    {
      href: '/admin/product',
      name: 'Product',
      icon: (active: boolean) => (
        <Product className="w-6 h-6" active={active} />
      )
    },
    {
      href: '/admin/users',
      name: 'Users',
      icon: (active: boolean) => (
        <Users className="w-6 h-6" active={active} />
      )
    },
    {
      href: '/admin/orders',
      name: 'Order',
      icon: (active: boolean) => (
        <Order className="w-6 h-6" active={active} />
      )
    },
    {
      href: '/admin/account',
      name: 'Account',
      icon: (active: boolean) => (
        <Account className="w-6 h-6" active={active} />
      )
    },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-center flex-1 py-2 h-10 transition-all duration-200 ${
                isActive
                  ? 'flex-row gap-x-2 bg-system-blue-light text-white rounded-full m-1 px-3'
                  : 'flex-col gap-y-1 text-gray-900 hover:text-black'
              }`}
            >
              {item.icon(isActive)}
              <span className={`text-[16px] ${isActive ? 'font-semibold block' : 'font-medium hidden'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}