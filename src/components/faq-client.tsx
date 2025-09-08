"use client";

import { useState, useEffect, useCallback, useRef } from "react"; // Added useEffect, useCallback, useRef
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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




type FaqEntry = {
  question: string;
  answer: string;
};

type FaqClientProps = {}; // serviceContext removed

export default function FaqClient() { // serviceContext removed from props
  const [faqList] = useState<FaqEntry[]>([
    { question: "What are your business hours?", answer: "Our business hours are Monday to Friday, 8:00 AM to 6:00 PM, and Saturday from 9:00 AM to 3:00 PM. We are closed on Sundays." },
    { question: "Do you offer car detailing services?", answer: "Yes, we offer full auto detailing services, including interior and exterior detailing, paint correction, and ceramic coating. Packages start from $199." },
    { question: "How can I book an appointment?", answer: "You can book an appointment by calling +61 460 786 533 or using the contact form on our website." },
    { question: "What kind of warranty do you offer on repairs?", answer: "We stand by our work with a comprehensive warranty on parts and labor." },
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
                          {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                          {faq.answer && <p className="text-muted-foreground pt-2">{faq.answer}</p>}
                      </AccordionContent>
                  </AccordionItem>
              ))}
          </Accordion>
        </div>
      </AnimatedCard>
    </div>
  );
}