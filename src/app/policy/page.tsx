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
      <div className="container mx-auto pt-8 md:pt-12 pb-16 md:pb-20">
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
            <div className="bg-gray-50 rounded-lg p-8 mb-12 shadow-sm">
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

          <AnimatedSection delay={300}>
            <div className="bg-gray-50 rounded-lg p-8 mb-12 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We have partnerships with Australia Post, DHL, EMS, and Interparcel Australia for shipping. Australia Post is our preferred method for both domestic and international orders due to its cost-effectiveness and reliability. For urgent orders, we use DHL. Customers can choose any preferred shipping method, and shipping costs will be quoted accordingly. Some orders may be shipped from our second stock in Thailand via EMS or DHL upon request. If your order is shipped from Thailand instead of our Australian address, we will notify you. Interparcel Australia is used for shipping large or heavy parts like bumpers, doors, and bonnets within Australia.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Overseas customers are responsible for paying any taxes or VAT required by the importing country. We can assist with paperwork to facilitate customs clearance upon customer's request.
              </p>
              <p className="text-gray-600 leading-relaxed">
                To assist customers in reducing import taxes and fees, we usually declare a lower value on shipping documents when orders are dispatched.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Cancellation</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Customers can request to cancel their order and receive a full refund at any time before the order is shipped out. However, for special parts that have already been ordered from our dealers, we reserve the right to deny cancellation requests.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                SD Auto reserves the right to cancel an order if the part becomes out of stock or on backorder for 2-3 months. However, over 99% of the parts listed on our website are in stock in Australia or Thailand.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We also reserve the right to cancel orders if any part is rejected by the courier as dangerous goods, although we are able to ship almost everything, including airbags and seatbelts.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
