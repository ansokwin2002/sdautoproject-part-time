'use client';

import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTopButton from '@/components/ui/scroll-to-top-button';
import PageLoadingIndicator from '@/components/ui/page-loading-indicator';
import { usePathname } from 'next/navigation';

import ErrorBoundary from '@/components/error-boundary';

// Note: Metadata export is not supported in Client Components. 
// If you need to use metadata, consider moving this to a Server Component or a layout.tsx in a parent directory.
// export const metadata: Metadata = {
//   title: 'SD Auto Showcase',
//   description: 'Your trusted partner in automotive care and excellence.',
//   icons: {
//     icon: '/favicon.ico',
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/assets/logo.png" type="image/png" />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        <div className="relative flex min-h-dvh flex-col">
          {!isAdminRoute && <Header />}
          <main className="flex-1">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
          {!isAdminRoute && <Footer />}
        </div>
        <Toaster />
        <ScrollToTopButton />
        <PageLoadingIndicator />
      </body>
    </html>
  );
}