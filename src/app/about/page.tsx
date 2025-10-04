'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Car, Wrench, Sparkles, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
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

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Welcome Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedImage className="relative h-full order-2 md:order-1" delay={200}>
              <Image 
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                alt="Modern Ford truck on desert road" 
                data-ai-hint="Ford truck automotive desert road"
                fill 
                className="object-cover rounded-lg shadow-xl"
              />
            </AnimatedImage>
            <div className="order-1 md:order-2">
              <div className="max-w-xl">
                <AnimatedText delay={100}>
                  <h2 className="text-3xl md:text-5xl font-bold font-headline text-gray-900 mb-6">
                    Welcome to SD Auto Parts
                  </h2>
                </AnimatedText>
                <AnimatedText delay={200}>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    SD Auto is an Australian family-owned and operated business, officially registered with the Australian Taxation Office (ATO) in 2023, and based in Werribee, Melbourne. We specialize in selling 100% genuine parts for popular Thailand-made brands such as Ford, Isuzu, Toyota, Mazda, Mitsubishi, Nissan, Honda, and Suzuki at affordable prices. We offer worldwide shipping with the best rates to your address. With 15 years of expertise in genuine auto parts for Thailand-made brands, we guarantee to provide you with the correct part for your vehicle at the best price and service. Contact us today!
                  </p>
                </AnimatedText>
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

     {/* Latest Blog Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-16">
            <div className="w-16 h-1 bg-orange-400 mx-auto mb-4"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Blog</h2>
            <p className="text-gray-600 text-lg">Stay updated with our latest news and insights</p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Blog Post 1 */}
            <AnimatedCard delay={100}>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative aspect-[4/3]">
                  <Image 
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    alt="Transportation logistics - ship, plane, and truck"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col min-h-[200px] md:min-h-[500px]">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    We are strongly in quality of transportation to customer
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    Our commitment to excellence ensures your auto parts reach you through the most reliable transportation methods, whether by air, sea, or land.
                  </p>
                  <div className="flex flex-col items-start space-y-2">
                    <span className="text-sm text-gray-500">December 15, 2024</span>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Blog Post 2 */}
            <AnimatedCard delay={200}>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative aspect-[4/3]">
                  <Image 
                    src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    alt="Package delivery service"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col min-h-[200px] md:min-h-[500px]">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Best Delivery Service provided by us will make sure on your hand with safe
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    Experience peace of mind with our premium delivery service that ensures your automotive parts arrive safely and on time, every time.
                  </p>
                  <div className="flex flex-col items-start space-y-2">
                    <span className="text-sm text-gray-500">December 10, 2024</span>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Blog Post 3 */}
            <AnimatedCard delay={300}>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative aspect-[4/3]">
                  <Image 
                    src="https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    alt="Local garage automotive service"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col min-h-[200px] md:min-h-[500px]">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Mostly, Garage in Local always order our products
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    Local garages trust us for quality automotive parts. Discover why professional mechanics choose SD Auto Parts for their repair needs.
                  </p>
                  <div className="flex flex-col items-start space-y-2">
                    <span className="text-sm text-gray-500">December 5, 2024</span>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>

          {/* View All Blog Posts Button */}
          {/* <AnimatedSection className="text-center mt-12">
            <Button size="lg" asChild className="hover:scale-105 transition-transform duration-200">
              <Link href="/blog">
                View All Post <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </AnimatedSection> */}
        </div>
      </section>
    </div>
  );
}