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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Privacy</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At SD Auto, we highly value your privacy. We are committed to respecting your privacy in relation to any information we may gather from you.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We only request personal information when it is necessary to provide a service to you. We collect this information through fair and lawful means, with your awareness and consent. We will always inform you of the purpose for collecting the information and how it will be used. Rest assured, we will never disclose your information to third parties.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Warranty, Return, and Refund</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We offer a 30-day warranty with a return and refund policy for our customers. Within 30 days of receiving your order, you can initiate a return by contacting us and providing your order number. Customers are responsible for covering the shipping costs to return the item to our address. Upon receiving the return, we will inspect the part to ensure it is unused and in its original packaging and condition. Subsequently, we will process a refund to your account.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                For returns from addresses within Australia, the refund will be issued in full. However, for returns from overseas addresses, the refund will not include the shipping fee that was originally paid to ship the order to you.
              </p>
              <p className="text-gray-600 leading-relaxed">
                For special parts that we do not stock and have ordered for you from dealers, SD Auto reserves the right to deny return requests if customers have ordered by mistake or changed your mind. We only accept returns for special parts in cases where the mistake in the order was made by us.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
