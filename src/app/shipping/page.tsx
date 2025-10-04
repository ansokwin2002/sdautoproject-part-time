'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Car, Wrench, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useRef } from "react";

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsIntersecting(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasAnimated, options]);

  return [ref, isIntersecting];
};

// Animation variants for different elements
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-400 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-6'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const AnimatedCard = ({ children, className = "", delay = 0 }) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-300 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-4 scale-98'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const AnimatedText = ({ children, className = "", delay = 0 }) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-350 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 -translate-x-4'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const AnimatedImage = ({ children, className = "", delay = 0 }) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-400 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-x-0 scale-100' 
          : 'opacity-0 translate-x-6 scale-98'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function ShippingPage() {
  return (
    <div className="flex flex-col">
      {/* Welcome Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection className="order-2 md:order-1" delay={200}>
              <div className="space-y-6">
                {/* First Image - t.png */}
                <div className="relative">
                  <Image 
                    src="/assets/t.png" 
                    alt="Shipping and logistics operations" 
                    data-ai-hint="Shipping logistics operations"
                    width={600}
                    height={300}
                    className="w-full h-auto rounded-xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                </div>
                
                {/* Second Image - m.png */}
                <div className="relative">
                  <Image 
                    src="/assets/m.png" 
                    alt="Modern warehouse with organized shipping boxes and logistics operations" 
                    data-ai-hint="Warehouse shipping logistics boxes storage"
                    width={600}
                    height={300}
                    className="w-full h-auto rounded-xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                </div>
              </div>
            </AnimatedSection>
            <div className="order-1 md:order-2">
              <div className="max-w-xl">
                <AnimatedSection delay={100}>
                  <h2 className="text-3xl md:text-5xl font-bold font-headline text-gray-900 mb-6">
                    Shipping
                  </h2>
                </AnimatedSection>
                <AnimatedSection delay={200}>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    SD Auto offers fast shipping to meet urgent needs while ensuring competitive pricing. Orders are shipped the same day or the following day if received after 1:00 PM Australia Time, excluding weekends (Saturday and Sunday) and public holidays.
                    <br /><br />
                    <strong>For customers within Australia:</strong>
                    <br />
                    Upon receiving an order, we promptly begin the packaging process to ensure the safety of the parts during transit. We dispatch all shipments from our Melbourne store via Australia Post or other couriers for heavy or large parts to the address provided in the order.
                    <br /><br />
                    <strong>For customers outside Australia:</strong>
                    <br />
                    We have two stores to dispatch international orders. Our main store is located in Melbourne, Australia, and our second branch is in Bangkok, Thailand. Most parts are shipped from our Melbourne store. For special part orders, parts may be shipped from our branch in Thailand.
                    <br /><br />
                    We dispatch orders from our Australian store using Australia Post and from our Thai store using EMS/Thai Post. If customers require urgent delivery, we offer DHL Express shipping to ensure their orders arrive by the deadline. We provide quotes to customers so they can choose between DHL Express, Australia Post, or EMS.
                    <br /><br />
                    <strong>Stock Availability and Dispatch Time:</strong>
                    <br />
                    We have over 99% of the parts listed on our website in stock in either Australia or Thailand. Parts located in our Australian store will be shipped the same day, while parts in our Thai store require 1-3 days for processing, packing, and shipping. In rare cases where a part becomes unavailable or is on back-order, we will promptly notify customers so they can choose to wait or cancel their orders.
                  </p>
                </AnimatedSection>
                <AnimatedSection delay={300}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" asChild className="hover:scale-105 transition-transform duration-200">
                      <Link href="/contact">
                        Get Quote
                      </Link>
                    </Button>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Delivery Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-16">
            <div className="w-16 h-1 bg-orange-400 mx-auto mb-4"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Delivery Partners</h2>
            
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto items-stretch">
            {/* By Ship - Australia Post */}
            <AnimatedSection delay={100}>
              <div className="bg-white rounded-lg p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col h-full">
                <div className="mb-4 md:mb-6">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                    <Image
                      src="/assets/post.jpg"
                      alt="Australia Post"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">By Australia Post Express</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-grow">
                  Reliable shipping through Australia Post network. Perfect for standard delivery across Australia and worldwide, with tracking included.
                </p>
              </div>
            </AnimatedSection>

            {/* By EMS */}
            <AnimatedSection delay={200}>
              <div className="bg-white rounded-lg p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col h-full">
                <div className="mb-4 md:mb-6">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                    <Image
                      src="/assets/EMS.png"
                      alt="EMS Express Mail Service"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">By EMS (Express Mail Service)</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-grow">
                  Fast international delivery with tracking included. Reliable shipping worldwide for your important packages.
                </p>
              </div>
            </AnimatedSection>

            {/* By Air */}
            <AnimatedSection delay={300}>
              <div className="bg-white rounded-lg p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col h-full">
                <div className="mb-4 md:mb-6">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                    <Image
                      src="/assets/dhl.svg"
                      alt="DHL Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">By DHL Express</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-grow">
                  Trusted worldwide shipping with fast delivery times and full tracking.
                </p>
              </div>
            </AnimatedSection>

            {/* By Land */}
            <AnimatedSection delay={400}>
              <div className="bg-white rounded-lg p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col h-full">
                <div className="mb-4 md:mb-6">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                    <Image
                      src="/assets/interparcel.png"
                      alt="Interparcel Delivery"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">By Interparcel</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-grow">
                  Flexible and affordable courier services with multiple delivery options and tracking included.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
