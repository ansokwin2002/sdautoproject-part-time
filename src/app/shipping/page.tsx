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
      {/* Content Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection delay={100}>
              <h2 className="text-3xl md:text-5xl font-bold font-headline text-gray-900 mb-8 text-center">
                Shipping
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  SD Auto offers fast shipping to meet urgent needs while ensuring competitive pricing. Orders are shipped the same day or the following day if received after 1:00 PM Australia Time, excluding weekends (Saturday and Sunday) and public holidays.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto items-stretch mt-8">
              {/* By Ship - Australia Post */}
              <AnimatedSection delay={100}>
                <div className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col h-full">
                  <div className="mb-4">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-3 flex items-center justify-center">
                      <Image
                        src="/assets/post.jpg"
                        alt="Australia Post"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <Link href="https://auspost.com.au/" target="_blank" rel="noopener noreferrer">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 hover:underline">By Australia Post Express</h3>
                  </Link>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-grow">
                    Reliable shipping through Australia Post network. Perfect for standard delivery across Australia and worldwide, with tracking included.
                  </p>
                </div>
              </AnimatedSection>

              {/* By EMS */}
              <AnimatedSection delay={100}>
                <div className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col h-full">
                  <div className="mb-4">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-3 flex items-center justify-center">
                      <Image
                        src="/assets/ems_3.png"
                        alt="EMS"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <Link href="https://www.ems.post/en/global-network/tracking" target="_blank" rel="noopener noreferrer">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 hover:underline"> By EMS (Express Mail Service)</h3>
                  </Link>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-grow">
                    Fast international delivery with tracking included. Reliable shipping worldwide for your important packages.
                  </p>
                </div>
              </AnimatedSection>

              {/* By Air */}
              <AnimatedSection delay={300}>
                <div className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col h-full">
                  <div className="mb-4">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-3 flex items-center justify-center">
                      <Image
                        src="/assets/dhl.svg"
                        alt="DHL Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <Link href="https://www.dhl.com/au-en/home.html" target="_blank" rel="noopener noreferrer">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 hover:underline">By DHL Express</h3>
                  </Link>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-grow">
                    Trusted worldwide shipping with fast delivery times and full tracking.
                  </p>
                </div>
              </AnimatedSection>

              {/* By Land */}
              <AnimatedSection delay={400}>
                <div className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col h-full">
                  <div className="mb-4">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-3 flex items-center justify-center">
                      <Image
                        src="/assets/interparcel.png"
                        alt="Interparcel Delivery"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <Link href="https://au.interparcel.com/tracking/" target="_blank" rel="noopener noreferrer">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 hover:underline">By Interparcel</h3>
                  </Link>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-grow">
                    Flexible and affordable courier services with multiple delivery options and tracking included.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Map and Text Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/2">
              <AnimatedImage>
                <div className="relative h-[500px] rounded-lg overflow-hidden">
                  <Image
                    src="/assets/shipping.jpg"
                    alt="Shipping Map"
                    fill
                    className="object-cover"
                  />
                </div>
              </AnimatedImage>
            </div>
            <div className="w-full md:w-1/2">
              <AnimatedText>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 text-lg leading-relaxed">
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
                </div>
                <div className="mt-8">
                    <Button size="lg" asChild className="hover:scale-105 transition-transform duration-200">
                        <Link href="/contact">
                            Get Quote
                        </Link>
                    </Button>
                </div>
              </AnimatedText>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
