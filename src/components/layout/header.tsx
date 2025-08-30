"use client";

import { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Logo from "@/components/icons/logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "Our Team" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const NavLink = ({ href, label, className }: { href: string, label: string, className?: string }) => (
    <Link
      href={href}
      className={cn(
        "font-medium transition-colors hover:text-primary",
        pathname === href ? "text-primary" : "text-muted-foreground",
        className
      )}
      onClick={() => setIsSheetOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              SD AutoCar
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-start md:hidden">
            <Link href="/" className="flex items-center space-x-2">
                <Logo className="h-6 w-6 text-primary" />
                <span className="font-bold">
                SD AutoCar
                </span>
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden md:flex">
            <Button asChild>
                <Link href="/contact">
                    Book a Service
                </Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <Link href="/" className="mr-6 flex items-center space-x-2 mb-8">
                  <Logo className="h-6 w-6 text-primary" />
                  <span className="font-bold sm:inline-block">
                    SD AutoCar
                  </span>
                </Link>
                <nav className="grid gap-6 text-lg">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} {...link} />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
