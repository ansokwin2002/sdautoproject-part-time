'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Home, ShoppingCart, Users, LineChart, Menu, Package2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/admin"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    pathname === '/admin' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/admin/products/list"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    pathname.startsWith('/admin/products') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Manage Products</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Manage Products</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col w-full">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/admin"
                  className={`flex items-center gap-4 px-2.5 ${
                    pathname === '/admin' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setIsSheetOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/admin/products/list"
                  className={`flex items-center gap-4 px-2.5 ${
                    pathname.startsWith('/admin/products') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setIsSheetOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Manage Products
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          {/* You can add a search bar or other header elements here if needed */}
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 sm:ml-14">
          {children}
        </main>
      </div>
    </div>
  );
}