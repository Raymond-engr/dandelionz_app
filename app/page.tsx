import type { Metadata } from 'next';
import ShopClientPage from './ShopClientPage';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Dandelionz - Your one-stop shop for everything. Explore our wide range of products from electronics to fashion.',
  openGraph: {
    title: 'Dandelionz | Home',
    description: 'Explore the best deals on Dandelionz.',
  },
};

export default function ShopPage() {
  return <ShopClientPage />;
}
