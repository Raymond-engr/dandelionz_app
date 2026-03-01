import type { Metadata } from 'next';
import LoginClientPage from './LoginClientPage';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Log in to your Dandelionz account to manage your orders, wishlist, and profile.',
  openGraph: {
    title: 'Login | Dandelionz',
    description: 'Log in to Dandelionz.',
  },
};

export default function LoginPage() {
  return <LoginClientPage />;
}
