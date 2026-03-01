import type { Metadata } from 'next';
import RegisterClientPage from './RegisterClientPage';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create a Dandelionz account to start shopping from the best vendors or start selling your own products.',
  openGraph: {
    title: 'Register | Dandelionz',
    description: 'Create an account on Dandelionz.',
  },
};

export default function RegisterPage() {
  return <RegisterClientPage />;
}
