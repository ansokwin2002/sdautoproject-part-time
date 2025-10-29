"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Mail, Clock, Shield, Wrench, Package, MapPin, Truck, CreditCard, FileText, Search, AlertCircle, DollarSign, Globe, Hash, HelpCircle } from "lucide-react";
import { useFaqs } from "@/hooks/useFaqs";

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
  const { faqs, loading, error } = useFaqs();

  // Helper function to get icon for FAQ based on keywords in question
  const getIconForFaq = (question: string): JSX.Element => {
    const q = question.toLowerCase();
    if (q.includes('location') || q.includes('located') || q.includes('address')) return <MapPin className="w-5 h-5" />;
    if (q.includes('contact') || q.includes('phone') || q.includes('email')) return <Phone className="w-5 h-5" />;
    if (q.includes('parts') || q.includes('sell')) return <Wrench className="w-5 h-5" />;
    if (q.includes('genuine') || q.includes('authentic')) return <Shield className="w-5 h-5" />;
    if (q.includes('shipping') || q.includes('delivery') || q.includes('courier')) return <Truck className="w-5 h-5" />;
    if (q.includes('payment') || q.includes('pay') || q.includes('card')) return <CreditCard className="w-5 h-5" />;
    if (q.includes('return') || q.includes('refund')) return <Package className="w-5 h-5" />;
    if (q.includes('vin') || q.includes('part number')) return <Hash className="w-5 h-5" />;
    if (q.includes('time') || q.includes('quickly') || q.includes('ship')) return <Clock className="w-5 h-5" />;
    if (q.includes('tax') || q.includes('vat') || q.includes('import')) return <Globe className="w-5 h-5" />;
    if (q.includes('price') || q.includes('pricing') || q.includes('cost')) return <DollarSign className="w-5 h-5" />;
    if (q.includes('find') || q.includes('source') || q.includes('search')) return <Search className="w-5 h-5" />;
    if (q.includes('installation') || q.includes('install')) return <Wrench className="w-5 h-5" />;
    return <HelpCircle className="w-5 h-5" />; // Default icon
  };

  const [faqList] = useState<FaqEntry[]>([
    { 
      question: "Where are you located?", 
      answer: "We have three branches. Our main branch is in Melbourne, Australia, the second branch is in Bangkok, Thailand, and the third branch is in Phnom Penh, Cambodia.",
      icon: <MapPin className="w-5 h-5" />
    },
    { 
      question: "Can we order and pick up the part from you?", 
      answer: "Yes, you can order and pick up the part from any of our stores in the three countries. Alternatively, you can pay when you pick up the part. We will provide you with our address upon request.",
      icon: <Package className="w-5 h-5" />
    },
    { 
      question: "How can I contact you?", 
      answer: "You can contact us via email, phone, or WhatsApp using the contact details available on our website.",
      icon: <Phone className="w-5 h-5" />
    },
    { 
      question: "What parts do you sell?", 
      answer: "We sell parts for popular Thailand-made brands, including Ford Ranger, Ford Everest, Isuzu Dmax, Isuzu Mux, Toyota Hilux, Toyota Fortuner, Mazda BT50, Mitsubishi Triton, Mitsubishi Pajero, Nissan Navara, and select models of Honda and Suzuki.",
      icon: <Wrench className="w-5 h-5" />
    },
    { 
      question: "Do you sell every part for Thailand-made vehicles?", 
      answer: "No, we do not sell every part due to our limited resources.",
      icon: <AlertCircle className="w-5 h-5" />
    },
    { 
      question: "Are your parts genuine?", 
      answer: "Yes, our parts are 100% genuine, except for some accessories that are sold as aftermarket. Customers are informed whether an accessory is genuine or aftermarket in the listing.",
      icon: <Shield className="w-5 h-5" />
    },
    { 
      question: "Can you source parts that are not listed on your website?", 
      answer: "Yes, we welcome inquiries for any part, whether listed on our website or not. We can provide quotes for parts that we can deliver. Some large parts like doors, engines, and bumpers are sold locally and not for overseas customers.",
      icon: <Search className="w-5 h-5" />
    },
    { 
      question: "How do I know which part to order for my car?", 
      answer: "For every order, we require the VIN (Vehicle Identification Number) to ensure the correct part. If you do not provide the VIN, you have to decide which part that fits your vehicle.",
      icon: <FileText className="w-5 h-5" />
    },
    { 
      question: "Do you diagnose vehicle issues and recommend parts to order?", 
      answer: "No, we do not provide diagnosis services. Please consult your mechanic to determine the parts needed for your vehicle.",
      icon: <AlertCircle className="w-5 h-5" />
    },
    { 
      question: "Do you offer part installation services at your store?", 
      answer: "No, we do not offer part installation services as we do not work as mechanics.",
      icon: <Wrench className="w-5 h-5" />
    },
    { 
      question: "How quickly can you ship the part after an order?", 
      answer: "99% of the parts listed on our website are in stock for same-day delivery if ordered before 1:00 PM Australia Time. Orders received after the cut-off time will be dispatched the next business day excluding weekend and public holidays. Some special parts that are ordered and not in stock may take 2-5 business days before we can dispatch them. In such cases, we will promptly notify customers, who can then choose to either wait or cancel the order.",
      icon: <Clock className="w-5 h-5" />
    },
    { 
      question: "What couriers do you use for part delivery?", 
      answer: "We partner with Australia Post, EMS, DHL Express, and Interparcel Australia for shipping. For customers in Australia, we use Australia Post. For international orders, we ship parts using Australia Post from Australia and EMS from Thailand. If urgent delivery is required, we can also ship with DHL Express.",
      icon: <Truck className="w-5 h-5" />
    },
    { 
      question: "What happens if my order goes missing and we never receive it?", 
      answer: "We have not encountered any missing packages as we work with Australia Post, EMS, and DHL. However, if this situation occurs, we will either send you a replacement or offer you a full refund, depending on your preference.",
      icon: <Package className="w-5 h-5" />
    },
    { 
      question: "Can I return a part if I don't need it?", 
      answer: "Yes, we have a 30-day return policy. Contact us for returns, and we will issue a full refund, excluding shipping costs for overseas customers.",
      icon: <Shield className="w-5 h-5" />
    },
    { 
      question: "Can I return a part after installation?", 
      answer: "No, we do not accept returns for parts that have been installed or tested. The part must be returned in its original packaging and condition.",
      icon: <AlertCircle className="w-5 h-5" />
    },
    { 
      question: "What payment methods do you accept?", 
      answer: "We accept all Visa and Mastercards worldwide, as well as PayPal payments.",
      icon: <CreditCard className="w-5 h-5" />
    },
    { 
      question: "Do you accept bank transfers?", 
      answer: "Yes, we accept bank transfers for larger orders.",
      icon: <DollarSign className="w-5 h-5" />
    },
    { 
      question: "Do you offer special pricing for regular customers?", 
      answer: "Yes, we provide special pricing for regular customers based on negotiation.",
      icon: <DollarSign className="w-5 h-5" />
    },
    { 
      question: "Do I need to pay taxes or VAT for importing parts to my country?", 
      answer: "Customers are responsible for taxes, VAT, and importation costs, except for customers in Australia, Thailand, and Cambodia where we ship from local stores.",
      icon: <Globe className="w-5 h-5" />
    },
    { 
      question: "What is the VIN?", 
      answer: "The VIN (Vehicle Identification Number) is a unique 17-digit code that identifies a vehicle.",
      icon: <Hash className="w-5 h-5" />
    },
    { 
      question: "What is a part number?", 
      answer: "A part number is a code assigned by the factory to identify specific vehicle parts.",
      icon: <Hash className="w-5 h-5" />
    },
    { 
      question: "Where can I find the VIN of my car?", 
      answer: "The VIN is typically located inside the front doors, under the windshield, or in front of the engine under the bonnet.",
      icon: <Search className="w-5 h-5" />
    },
    { 
      question: "Where can I find the part number for a specific part?", 
      answer: "Some parts may not have a visible part number on them. In such cases, the number or letters present may be a manufacturer or engineer number, rather than a specific part number. To obtain the correct part number for any component, you can contact your dealer or local parts specialist.",
      icon: <Search className="w-5 h-5" />
    },
    { 
      question: "Can you provide the part number for us?", 
      answer: "Yes, we can definitely help with that. We are experts in parts for the vehicles we sell and use the latest catalog to identify the part number once we have the VIN from you.",
      icon: <HelpCircle className="w-5 h-5" />
    }
  ]);

  // Use API data if available, otherwise use fallback data
  const displayFaqs = faqs.length > 0 ? faqs : faqList;

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatedCard delay={100}>
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">Common Questions</h2>
          <Accordion type="single" collapsible className="w-full bg-background rounded-lg shadow-md">
            {displayFaqs.map((faq, i) => {
              // For API data, we need to get icon and format properly
              const isApiFaq = 'id' in faq;
              const faqIcon = isApiFaq ? getIconForFaq(faq.question) : (faq as FaqEntry).icon;

              return (
                <AccordionItem value={`item-${i}`} key={isApiFaq ? faq.id : i}>
                  <AccordionTrigger className="text-left hover:no-underline px-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        {faqIcon}
                      </div>
                      <span className="font-medium">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="pl-11">
                      <div
                        className="text-muted-foreground pt-2"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </AnimatedCard>
    </div>
  );
}