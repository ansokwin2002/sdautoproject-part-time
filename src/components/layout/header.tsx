"use client";

import { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, MapPin, Mail, Phone, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { products } from "@/lib/products";

const getNavLinks = () => {
  const allBrands = Array.from(new Set(products.map(product => product.brand)));
  const brandsToRemove = ["Mitsubishi Parts", "Nissan Parts", "Porsche Parts", "Ram Parts", "Subaru Parts", "GMC Parts", "Isuzu Parts"];
  const uniqueBrands = allBrands.filter(brand => !brandsToRemove.includes(brand)).sort();

  const brandDropdownItems = uniqueBrands.map(brand => ({
    href: `/genuine-parts?brand=${encodeURIComponent(brand)}`,
    label: brand,
  }));

  return [
    {
      href: "/",
      label: "Genuines Parts and Accessories",
      hasDropdown: true,
      dropdownItems: [
        { href: "/", label: "All Parts and Accessories" },
        { href: "/genuine-parts?brand=Ford", label: "Ford Genuine Parts and Accessories" },
        { href: "/genuine-parts?brand=Isuzu", label: "Isuzu Genuine Parts and Accessories" },
        { href: "/genuine-parts?brand=Toyota", label: "Toyota Genuine Parts and Accessories" },
        { href: "/genuine-parts?brand=Mazda", label: "Mazda Genuine Parts and Accessories" },
        { href: "/genuine-parts?brand=Mitsubishi", label: "Mitsubishi Genuine Parts and Accessories" },
        { href: "/genuine-parts?brand=Nissan", label: "Nissan Genuine Parts and Accessories" },
        { href: "/genuine-parts?brand=Honda", label: "Honda Genuine Parts and Accessories" },
        { href: "/genuine-parts?brand=Suzuki", label: "Suzuki Genuine Parts and Accessories" },
        { href: "/genuine-parts?view=aftermarket", label: "Aftermarket Parts and Accessories" },
      ],
    },
    { href: "/home", label: "Home" },
    { href: "/policy", label: "Policy" },
    { href: "/faq", label: "FAQ" },
    { href: "/shipping", label: "Shipping" },
    { href: "/contact", label: "Contact Us" },
  ];
};

export default function Header() {
  const pathname = usePathname();
  const navLinks = getNavLinks();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef(null);
  const leaveTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    leaveTimeout.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 500);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Clear any existing timer
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }

      // Always update isScrolled immediately for visual effects
      setIsScrolled(currentScrollY > 100);

      // Debounce the visibility logic to prevent jittery behavior
      scrollTimer.current = setTimeout(() => {
        const scrollDifference = currentScrollY - lastScrollY.current;

        // Show header when at top
        if (currentScrollY <= 100) {
          setIsVisible(true);
        }
        // Hide header only when scrolling down significantly (more than 150px)
        else if (scrollDifference > 150) {
          setIsVisible(false);
        }
        // Show header when scrolling up significantly (more than 100px)
        else if (scrollDifference < -100) {
          setIsVisible(true);
        }

        lastScrollY.current = currentScrollY;
      }, 100); // 100ms debounce to smooth out the behavior
    };

    // Set initial scroll position
    lastScrollY.current = window.scrollY;
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  const NavLink = ({ href, label, hasDropdown, dropdownItems, className }: { 
    href: string, 
    label: string, 
    hasDropdown?: boolean,
    dropdownItems?: Array<{href: string, label: string}>,
    className?: string 
  }) => {
    if (hasDropdown && dropdownItems) {
      return (
        <div className="relative" ref={dropdownRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <button
            className={`flex items-center font-medium transition-colors duration-200 hover:text-blue-600 ${
              pathname === href || dropdownItems.some(item => pathname === item.href) 
                ? "text-blue-600" : "text-gray-700"
            } ${className || ""}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {label}
            <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div 
              className="absolute top-full left-0 mt-2 w-max bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-in slide-in-from-top-2 duration-200"
            >
              <div className="py-2">
                {dropdownItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 text-sm transition-all duration-150 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1 ${
                      pathname === item.href ? "text-blue-600 bg-blue-50" : "text-gray-700"
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isDropdownOpen ? `fadeInUp 0.3s ease-out ${index * 50}ms both` : ''
                    }}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href={href}
        className={`flex items-center font-medium transition-colors duration-200 hover:text-blue-600 ${
          pathname === href ? "text-blue-600" : "text-gray-700"
        } ${className || ""}`}
        onClick={() => setIsSheetOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .slide-in-from-top-2 {
          animation: slideInFromTop 0.2s ease-out;
        }
        
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      {/* Header Spacer - prevents content jump when header becomes fixed */}
      <div className="h-auto">
        {/* Contact Bar Spacer */}
        <div className="h-[50px]"></div>
        {/* Main Nav Spacer */}
        <div className="h-32"></div>
      </div>
      
      <header className={`w-full bg-white shadow-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'shadow-lg backdrop-blur-md bg-white/95' : 'shadow-sm'
      }`}>
        {/* Top Contact Bar */}
        <div className={`bg-gray-100 border-b transition-all duration-500 ease-in-out ${
          isScrolled ? 'h-0 overflow-hidden opacity-0 -translate-y-2' : 'h-auto opacity-100 translate-y-0'
        }`}>
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-center py-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2 mb-1 lg:mb-0">
                <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="min-w-0 text-xs sm:text-sm break-words">SD AUTO PART 87 Kookaburra Avenue Werribee, Victoria 3030 Australia</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-2 md:space-x-4 lg:space-x-6">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span>sdautoaustralia@gmail.com</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span>+61 460 786 533</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation - Increased height (doubled) */}
        <div className="container mx-auto">
          <div className="flex h-32 items-center justify-between">
            {/* Logo - Increased size */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-4">
                <div className="relative w-16 h-16">
                  <Image
                    src="/assets/logo.png"
                    alt="SD Auto Logo"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain"
                    priority
                    onError={(e) => {
                      console.log('Image failed to load from /assets/logo.png');
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.fallback-logo') as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="fallback-logo w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg items-center justify-center shadow-lg absolute top-0 left-0 hidden">
                    <span className="text-white font-bold text-xl italic">SD</span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-2xl font-bold text-gray-800">SD AUTO</div>
                  <div className="text-sm text-gray-500 -mt-1">AUTOMOTIVE PARTS</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 md:space-x-6 lg:space-x-10 text-base md:text-base">
              {navLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden mr-2">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-700 h-12 w-12">
                    <Menu className="h-8 w-8" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center space-x-3 mb-8 pb-4 border-b">
                      <div className="relative w-14 h-14">
                        <Image
                          src="/assets/logo.png"
                          alt="SD Auto Logo"
                          width={56}
                          height={56}
                          className="w-14 h-14 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.parentElement?.querySelector('.fallback-logo-mobile') as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="fallback-logo-mobile w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg items-center justify-center shadow-lg absolute top-0 left-0 hidden">
                          <span className="text-white font-bold text-xl italic">SD</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-800">SD AUTO</div>
                        <div className="text-xs text-gray-500 -mt-1">AUTOMOTIVE PARTS</div>
                      </div>
                    </div>
                    
                    <nav className="flex flex-col space-y-6 text-base">
                      {navLinks.map((link) => {
                        if (link.hasDropdown && link.dropdownItems) {
                          return (
                            <div key={link.href} className="space-y-2">
                              <button
                                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                                className={`flex items-center justify-between w-full font-medium transition-colors duration-200 hover:text-blue-600 whitespace-nowrap overflow-hidden text-ellipsis ${
                                  pathname === link.href || link.dropdownItems.some(item => pathname === item.href)
                                    ? "text-blue-600" : "text-gray-700"
                                }`}
                              >
                                {link.label}
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {isMobileDropdownOpen && (
                                <div className="ml-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                                  {link.dropdownItems.map((item, index) => (
                                    <Link
                                      key={item.href}
                                      href={item.href}
                                      className={`block text-sm transition-all duration-200 hover:text-blue-600 hover:translate-x-1 whitespace-nowrap overflow-hidden text-ellipsis ${
                                        pathname === item.href ? "text-blue-600" : "text-gray-600"
                                      }`}
                                      style={{
                                        animationDelay: `${index * 50}ms`,
                                        animation: isMobileDropdownOpen ? `fadeInUp 0.3s ease-out ${index * 50}ms both` : ''
                                      }}
                                      onClick={() => {
                                        setIsSheetOpen(false);
                                        setIsMobileDropdownOpen(false);
                                      }}
                                    >
                                      {item.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }
                        
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={`font-medium transition-colors duration-200 hover:text-blue-600 ${
                              pathname === link.href ? "text-blue-600" : "text-gray-700"
                            }`}
                            onClick={() => setIsSheetOpen(false)}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </nav>

                    <div className="mt-auto pt-6 border-t">
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span className="min-w-0 text-xs">SD AUTO PART 87 Kookaburra Avenue Werribee, Victoria 3030 Australia</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span>sdautaustralia@gmail.com</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span>+61 460 786 533</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
