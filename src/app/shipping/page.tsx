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
      className={`transition-all duration-1000 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-12'
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
      className={`transition-all duration-800 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
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
      className={`transition-all duration-700 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 -translate-x-8'
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
      className={`transition-all duration-900 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-x-0 scale-100' 
          : 'opacity-0 translate-x-12 scale-95'
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
            <AnimatedSection className="relative h-full order-2 md:order-1" delay={200}>
              <Image 
                src="https://sdmntpraustraliaeast.oaiusercontent.com/files/00000000-ab34-61fa-8aee-bbb30fc3c5e2/raw?se=2025-09-25T14%3A12%3A33Z&sp=r&sv=2024-08-04&sr=b&scid=f8fad558-9291-5712-b5f2-3ac8437abfb9&skoid=cb94e22a-e3df-4e6a-9e17-1696f40fa435&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-24T17%3A19%3A22Z&ske=2025-09-25T17%3A19%3A22Z&sks=b&skv=2024-08-04&sig=DcvYfdpxjppPnpt3tKnJXkLew3I/eNeEC8c218XgtgQ%3D" 
                alt="Modern warehouse with organized shipping boxes and logistics operations" 
                data-ai-hint="Warehouse shipping logistics boxes storage"
                fill 
                className="object-cover rounded-lg shadow-xl"
              />
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
                    Our company offers a wide range of delivery options to meet urgent needs while ensuring competitive pricing.
                    <br /><br />
                    <strong>For customers within Australia:</strong> Upon receiving an order, we promptly begin the packaging process to ensure the safety of the goods during transit. We dispatch all shipments from our store in Melbourne via Australia Post to the address provided in the order. Orders received before 1 PM will be processed and shipped on the same day. For orders placed after 1 PM, shipments will be dispatched the following business day, excluding weekends (Saturday and Sunday).
                    <br /><br />
                    <strong>For international customers:</strong> For those residing in certain Asian countries near Cambodia, we dispatch goods from our store in Phnom Penh via EMS service or, in cases of urgency, via DHL. For customers in more distant regions, shipments will be sent from our Melbourne store via Australia Post, or, for urgent deliveries, via DHL.
                    <br /><br />
                    <strong>Stock Availability:</strong> 95% of the products we offer are readily available in our store. For a small number of specialized items, we require 3 to 5 days to prepare the order before dispatch. In such cases, customers will be notified immediately after order receipt. Customers may cancel their orders at any time and receive a full refund if they are unable to wait.
                  </p>
                </AnimatedSection>
                <AnimatedSection delay={300}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" asChild className="hover:scale-105 transition-transform duration-200">
                      <Link href="/shipping">
                        Read More <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="hover:scale-105 transition-transform duration-200">
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* By Ship - Australia Post */}
            <AnimatedSection delay={100}>
              <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col min-h-[300px] md:min-h-[500px]">
                <div className="mb-6">
                  <div className="relative w-48 h-48 mx-auto mb-4 flex items-center justify-center">
                    <Image
                      src="/assets/post.jpg"
                      alt="Australia Post"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">By Australia Post Express</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">
                  Reliable shipping through Australia Post network. Perfect for standard delivery across Australia with tracking included.
                </p>
              </div>
            </AnimatedSection>

            {/* By Air */}
            <AnimatedSection delay={200}>
              <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col min-h-[300px] md:min-h-[500px]">
                <div className="mb-6">
                  <div className="relative w-48 h-48 mx-auto mb-4 flex items-center justify-center">
                    <Image
                      src="/assets/dhl.svg"
                      alt="DHL Logo"
                      fill
                      className=""
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 mt-auto">By DHL Express</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">
                  Trusted worldwide shipping with fast delivery times and full tracking.
                </p>
              </div>
            </AnimatedSection>

            {/* By Land */}
            <AnimatedSection delay={300}>
              <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col min-h-[300px] md:min-h-[500px]">
                <div className="mb-6">
                  <div className="relative w-48 h-48 mx-auto mb-4 flex items-center justify-center">
                    <Image
                      src="/assets/interparcel.png"
                      alt="Interparcel Delivery"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">By Interparcel</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">
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
