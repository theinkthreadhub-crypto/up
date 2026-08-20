import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import CartDrawer from '@/components/layout/CartDrawer';
import Script from 'next/script';
import { CartProvider } from '@/lib/store';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://inkthreadhub.com'),
  title: 'InkThread Hub | Heavyweight Artisanal Streetwear & Underground Drops',
  description:
    'Explore premium Gen-Z streetwear, 240 GSM oversized graphic t-shirts, 380 GSM French terry hoodies, and limited drops by InkThread Hub.',
  keywords: [
    'streetwear India',
    'oversized t-shirts',
    'heavyweight hoodies',
    'anime graphic tees',
    'InkThread Hub',
    '240 GSM t-shirt',
    '380 GSM hoodie',
  ],
  openGraph: {
    title: 'InkThread Hub | Heavyweight Artisanal Streetwear',
    description: '240 GSM Oversized Tees, 380 GSM Hoodies, and Limited Drops.',
    url: 'https://inkthreadhub.com',
    siteName: 'InkThread Hub',
    images: [
      {
        url: '/images/hero_banner.png',
        width: 1200,
        height: 630,
        alt: 'InkThread Hub Streetwear',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-brand-neon selection:text-black">
        {/* Razorpay Standard Checkout Script */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

        <CartProvider>
          <AnnouncementBar />
          <Navbar />

          <main className="flex-1">{children}</main>

          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
