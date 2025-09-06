"use client";

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

export default function PolicyPage() {
  return (
    <div className="bg-white">
      <div className="container mx-auto py-16 md:py-20">
        <AnimatedSection>
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">Our Policies</h1>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
          <AnimatedSection delay={100}>
            <div className="bg-gray-50 rounded-lg p-8 mb-12 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Your privacy is important to us. It is SD Auto Parts' policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="bg-gray-50 rounded-lg p-8 mb-12 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Terms of Service</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                By accessing the website at [Your Website URL], you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
              <p className="text-gray-600 leading-relaxed">
                The materials contained in this website are protected by applicable copyright and trademark law.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Return Policy</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
              </p>
              <p className="text-gray-600 leading-relaxed">
                To start a return, you can contact us at [Your Contact Email]. If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
