"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Mail, Clock, Shield, Wrench, Package } from "lucide-react";

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

type FaqEntry = {
  question: string;
  answer: string;
  icon: JSX.Element;
};

export default function FaqClient() {
  const [faqList] = useState<FaqEntry[]>([
    { 
      question: "What types of automotive parts do you sell?", 
      answer: "We offer a comprehensive range of automotive parts including engine components, brake systems, suspension parts, electrical components, filters, belts, hoses, and performance upgrades. All parts are sourced from trusted manufacturers and come with quality guarantees.",
      icon: <Package className="w-5 h-5" />
    },
    { 
      question: "Do you offer genuine OEM parts or aftermarket alternatives?", 
      answer: "We stock both genuine OEM parts and high-quality aftermarket alternatives. OEM parts ensure perfect fit and original specifications, while aftermarket options provide cost-effective solutions without compromising quality. Our team can help you choose the best option for your needs and budget.",
      icon: <Wrench className="w-5 h-5" />
    },
    { 
      question: "How can I find the right part for my vehicle?", 
      answer: "Simply provide us with your vehicle's make, model, year, and VIN number. Our experienced team will cross-reference this information to ensure you get the exact part you need. We also offer online compatibility checking tools for your convenience.",
      icon: <Phone className="w-5 h-5" />
    },
    { 
      question: "What is your return and warranty policy?", 
      answer: "All parts come with manufacturer warranty ranging from 12 months to lifetime coverage depending on the component. We offer 30-day returns on unused parts in original packaging. Defective parts are replaced or refunded according to warranty terms.",
      icon: <Shield className="w-5 h-5" />
    },
    { 
      question: "Do you provide installation services?", 
      answer: "Yes, we have certified technicians who can install most automotive parts. Installation services are available by appointment, and we use professional-grade tools and equipment. Labor comes with our workmanship guarantee.",
      icon: <Wrench className="w-5 h-5" />
    },
    { 
      question: "How quickly can I get my parts?", 
      answer: "In-stock parts are available for immediate pickup or same-day local delivery. Special order items typically arrive within 2-5 business days. We'll provide accurate timing estimates when you place your order and keep you updated on delivery status.",
      icon: <Clock className="w-5 h-5" />
    },
    { 
      question: "Do you offer bulk pricing for businesses?", 
      answer: "Yes, we offer competitive wholesale pricing for automotive businesses, repair shops, and fleet operators. Contact us to discuss volume discounts, credit terms, and dedicated account management services.",
      icon: <Package className="w-5 h-5" />
    },
    { 
      question: "Can you help with performance upgrades?", 
      answer: "Absolutely! We specialize in performance parts including cold air intakes, exhaust systems, suspension upgrades, turbo components, and engine tuning parts. Our team can recommend compatible upgrades to enhance your vehicle's performance safely.",
      icon: <Wrench className="w-5 h-5" />
    }
  ]);

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatedCard delay={100}>
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">Common Questions</h2>
          <Accordion type="single" collapsible className="w-full bg-background rounded-lg shadow-md">
            {faqList.map((faq, i) => (
              <AccordionItem value={`item-${i}`} key={i}>
                <AccordionTrigger className="text-left hover:no-underline px-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      {faq.icon}
                    </div>
                    <span className="font-medium">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="pl-11">
                    <p className="text-muted-foreground pt-2">{faq.answer}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </AnimatedCard>
    </div>
  );
}