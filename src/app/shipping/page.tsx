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
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                alt="Modern Ford truck on desert road" 
                data-ai-hint="Ford truck automotive desert road"
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
                    Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet
                    Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Shipping</h2>
            <p className="text-gray-600 text-lg">Choose from our reliable shipping options</p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* By Ship - Australia Post */}
            <AnimatedSection delay={100}>
              <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col min-h-[300px] md:min-h-[500px]">
                <div className="mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-20 h-16 text-red-600" viewBox="0 0 100 80" fill="currentColor">
                      {/* Australia Post Logo Simplified */}
                      <circle cx="25" cy="40" r="20" />
                      <rect x="45" y="25" width="30" height="30" rx="5" />
                      <text x="50" y="35" fontSize="8" fill="white" fontWeight="bold">POST</text>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">By Ship Autocarparts</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">
                  Reliable shipping through Australia Post network. Perfect for standard delivery across Australia with tracking included.
                </p>
              </div>
            </AnimatedSection>

            {/* By Air */}
            <AnimatedSection delay={200}>
              <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col min-h-[300px] md:min-h-[500px]">
                <div className="mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-800" viewBox="0 0 100 100" fill="currentColor">
                      {/* Airplane icon */}
                      <path d="M85 45l-25-15V15c0-3-2-5-5-5s-5 2-5 5v15L25 45H10c-3 0-5 2-5 5s2 5 5 5h15l25 15v15c0 3 2 5 5 5s5-2 5-5V70l25-15h15c3 0 5-2 5-5s-2-5-5-5H85z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">By Air</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">
                  Fast air freight delivery for urgent parts. Get your automotive components delivered quickly when time is critical.
                </p>
              </div>
            </AnimatedSection>

            {/* By Land */}
            <AnimatedSection delay={300}>
              <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col min-h-[300px] md:min-h-[500px]">
                <div className="mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-800" viewBox="0 0 100 100" fill="currentColor">
                      {/* Truck icon */}
                      <rect x="10" y="40" width="50" height="25" rx="3"/>
                      <rect x="55" y="35" width="25" height="30" rx="3"/>
                      <circle cx="25" cy="75" r="8"/>
                      <circle cx="70" cy="75" r="8"/>
                      <rect x="15" y="45" width="15" height="8" fill="white"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">By Land</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">
                  Ground transportation for local and interstate deliveries. Cost-effective option for heavy parts and bulk orders.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
