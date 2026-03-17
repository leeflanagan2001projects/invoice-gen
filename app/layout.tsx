import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastContainer } from '@/components/shared/Toast';

export const metadata: Metadata = {
  title: 'InvoiceGen – UK Construction Invoicing',
  description: 'Generate, send, and track invoices for UK tradespeople',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'InvoiceGen',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1B4F8A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="bg-background min-h-screen">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
