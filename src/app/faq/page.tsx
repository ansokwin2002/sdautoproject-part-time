"use client";

import FaqClient from "@/components/faq-client";
import { useState, useEffect, useRef } from 'react';

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

const AnimatedText = ({ children, className = "", delay = 0 }) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-350 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function FaqPage() {
    return (
    <div className="bg-white min-h-[calc(100vh-14rem)]">
      <div className="container mx-auto px-4 pt-8 md:pt-12 pb-16 md:pb-20">
        <AnimatedSection>
          <div className="text-center mb-12">
            <AnimatedText>
              <h1 className="text-4xl md:text-5xl font-bold font-headline">Frequently Asked Questions</h1>
            </AnimatedText>
            <AnimatedText delay={100}>
              <p className="text-muted-foreground mt-3 max-w-3xl mx-auto text-lg">
                Find answers to common questions about our services.
              </p>
            </AnimatedText>
          </div>
        </AnimatedSection>
        <FaqClient />
      </div>
    </div>
  );
}