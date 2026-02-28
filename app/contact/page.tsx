import type { Metadata } from 'next';
import ContactUsClientPage from './ContactUsClientPage';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Have questions? Contact Dandelionz support. We are here to help you with your shopping or vendor needs.',
  openGraph: {
    title: 'Contact Us | Dandelionz',
    description: 'Get in touch with Dandelionz.',
  },
};

export default function ContactUsPage() {
  return <ContactUsClientPage />;
}
