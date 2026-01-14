"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Car, Wrench, Sparkles, ChevronLeft, ChevronRight, Play, Pause, MapPin, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import ProductCard from "@/components/product-card";
import ProductList from "@/components/product-list";
import { useState, useEffect, useCallback, useRef, Suspense, ReactNode } from "react";
import { useHomeSettings } from "@/hooks/useHomeSettings";
import { useSliders } from "@/hooks/useSliders";
import { useProducts } from "@/hooks/useProducts";
import { useDeliveryPartners } from "@/hooks/useDeliveryPartners"; // Added
import { useShipping } from "@/hooks/useShipping"; // Added
import { getImageUrl } from "@/lib/config";
import { API_BASE_URL } from '@/utilities/constants'; // Added

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}): [React.RefObject<HTMLDivElement>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

const heroSlides = [
  // Ford Genuine Parts - 1st in dropdown
  {
    id: 1,
    image: "/assets/slide/new_ford.jpg",
    title: "Ford Genuine Parts",
    subtitle: "Built Ford Tough - Experience legendary durability and performance with Ford's complete range of genuine parts and accessories.",
    primaryButton: {
      text: "View Ford Parts",
      href: "/genuine-parts?brand=Ford"
    },
    secondaryButton: {
      text: "Contact Us",
      href: "/contact"
    },
    aiHint: "Ford Mustang sports car"
  },

  {
    id: 2,
    image: "/assets/slide/new_ford_3.jpg",
    title: "Ford Genuine Parts",
    subtitle: "Built Ford Tough - Experience legendary durability and performance with Ford's complete range of genuine parts and accessories.",
    primaryButton: {
      text: "View Ford Parts",
      href: "/genuine-parts?brand=Ford"
    },
    secondaryButton: {
      text: "Contact Us",
      href: "/contact"
    },
    aiHint: "Ford Mustang sports car"
  },

  // Isuzu Genuine Parts - 2nd in dropdown
  {
    id: 3,
    image: "/assets/slide/new_isuzu_2.jpg",
    title: "Isuzu Genuine Parts",
    subtitle: "Go the Distance - Commercial grade durability and strength with Isuzu's reliable genuine parts for every journey.",
    primaryButton: {
      text: "View Isuzu Parts",
      href: "/genuine-parts?brand=Isuzu"
    },
    secondaryButton: {
      text: "Get Quote",
      href: "/contact"
    },
    aiHint: "Isuzu D-Max pickup truck"
  },

  // Toyota Genuine Parts - 3rd in dropdown
  {
    id: 4,
    image: "/assets/slide/06.-2023-Toyota-HiLux-GR-Sport_1504-e1694843548162.jpg",
    title: "Toyota Genuine Parts",
    subtitle: "Let's Go Places - Reliability and innovation in every part. Discover Toyota's world-class genuine automotive components.",
    primaryButton: {
      text: "View Toyota Parts",
      href: "/genuine-parts?brand=Toyota"
    },
    secondaryButton: {
      text: "Learn More",
      href: "/about"
    },
    aiHint: "Toyota Camry sedan"
  },

  // Mazda Genuine Parts - 4th in dropdown
  {
    id: 5,
    image: "/assets/slide/mazda-bt50-camioneta-roja-selva-rio-v5.jpg",
    title: "Mazda Genuine Parts",
    subtitle: "Driving Matters - Precision engineering and stylish design combined with quality genuine parts for the ultimate driving experience.",
    primaryButton: {
      text: "View Mazda Parts",
      href: "/genuine-parts?brand=Mazda"
    },
    secondaryButton: {
      text: "Contact Us",
      href: "/contact"
    },
    aiHint: "Mazda CX-5 SUV"
  },

  // Mitsubishi Genuine Parts - 5th in dropdown
  {
    id: 6,
    image: "/assets/slide/new_mitsubishi.jpeg",
    title: "Mitsubishi Genuine Parts",
    subtitle: "Drive your Ambition - Proven performance and reliability with Mitsubishi's innovative genuine parts and authentic replacements.",
    primaryButton: {
      text: "View Mitsubishi Parts",
      href: "/genuine-parts?brand=Mitsubishi"
    },
    secondaryButton: {
      text: "Service Center",
      href: "/contact"
    },
    aiHint: "Mitsubishi Lancer Evolution"
  },

  {
    id: 7,
    image: "/assets/slide/16iXf37CbehGot7USBTZzCNh.png",
    title: "Mitsubishi Genuine Parts",
    subtitle: "Drive your Ambition - Proven performance and reliability with Mitsubishi's innovative genuine parts and authentic replacements.",
    primaryButton: {
      text: "View Mitsubishi Parts",
      href: "/genuine-parts?brand=Mitsubishi"
    },
    secondaryButton: {
      text: "Service Center",
      href: "/contact"
    },
    aiHint: "Mitsubishi Lancer Evolution"
  },
];


const featuredCars = [
  {
    name: "Ford Mustang",
    description: "Thrilling performance meets iconic American muscle car design.",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    aiHint: "Ford Mustang sports car",
  },
  {
    name: "Mazda CX-5",
    description: "Sustainable driving without compromising on style and performance.",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    aiHint: "Mazda CX-5 SUV",
  },
  {
    name: "Toyota Camry",
    description: "Experience unparalleled comfort and reliability with Toyota's flagship sedan.",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    aiHint: "Toyota Camry sedan",
  },
];

const services = [
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: "Expert Repairs",
    description: "From engine diagnostics to transmission repairs, our certified mechanics handle it all with precision."
  },
  {
    icon: <Car className="h-8 w-8 text-primary" />,
    title: "Routine Maintenance",
    description: "Keep your vehicle in peak condition with our comprehensive maintenance services, including oil changes and tune-ups."
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: "Auto Detailing",
    description: "Restore your car's showroom shine with our meticulous interior and exterior detailing packages."
  }
];

interface AnimatedComponentProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// Animation variants for different elements
const AnimatedSection = ({ children, className = "", delay = 0 }: AnimatedComponentProps) => {
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

const AnimatedCard = ({ children, className = "", delay = 0 }: AnimatedComponentProps) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-300 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-4 scale-98'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const AnimatedText = ({ children, className = "", delay = 0 }: AnimatedComponentProps) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-350 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 -translate-x-4'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const AnimatedImage = ({ children, className = "", delay = 0 }: AnimatedComponentProps) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-400 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-x-0 scale-100' 
          : 'opacity-0 translate-x-6 scale-98'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

function HomePageDeliveryPartners({ partners, loading, error }) { // Accepts props
  const assetBase = API_BASE_URL.replace(/\/api\/public$/, ''); 

  // Removed internal items fallback

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto items-stretch">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow animate-pulse h-64" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading delivery partners.
      </div>
    );
  }

  if (!partners || partners.length === 0) { // If no partners and no error/loading, return null (handled by Home component)
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto items-stretch">
      {partners.map((p, idx) => ( // <--- uses partners directly
        <AnimatedSection key={(p as any).id ?? idx} delay={100 * (idx + 1)}>
          <div className="bg-white rounded-lg p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col h-full">
            <div className="mb-4 md:mb-6">
              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                <Image
                  src={p.image.startsWith('http') ? p.image : `${assetBase}${p.image}`} // Ensure absolute paths
                  alt={p.title}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <Link href={p.url_link || '#'} target="_blank" rel="noopener noreferrer">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 hover:underline">{p.title}</h3>
            </Link>
            {p.description && (
              <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-grow">{p.description}</p>
            )}
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
}

const staticDeliveryPartnersHtml = (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto items-stretch">
    {/* By Ship - Australia Post */}
    <AnimatedSection delay={100}>
      <div className="bg-white rounded-lg p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col h-full">
        <div className="mb-4 md:mb-6">
          <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-3 md:mb-4 flex items-center justify-center">
            <Image
              src="/assets/post.jpg"
              alt="Australia Post"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <Link href="https://auspost.com.au/" target="_blank" rel="noopener noreferrer">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 hover:underline">By Australia Post Express</h3>
        </Link>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-grow">
          Reliable shipping through Australia Post network. Perfect for standard and express delivery across Australia and worldwide, with tracking included.
        </p>
      </div>
    </AnimatedSection>

    {/* By EMS */}
    <AnimatedSection delay={200}>
      <div className="bg-white rounded-lg p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col h-full">
        <div className="mb-4 md:mb-6">
          <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-3 md:mb-4 flex items-center justify-center">
            <Image
              src="/assets/ems_3.png"
              alt="EMS Express Mail Service"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <Link href="https://www.ems.post/en/global-network/tracking" target="_blank" rel="noopener noreferrer">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 hover:underline">By EMS (Express Mail Service)</h3>
        </Link>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-grow">
          Fast international delivery with tracking included. Reliable shipping worldwide for your important packages.
        </p>
      </div>
    </AnimatedSection>

    {/* By Air */}
    <AnimatedSection delay={300}>
      <div className="bg-white rounded-lg p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col h-full">
        <div className="mb-4 md:mb-6">
          <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-3 md:mb-4 flex items-center justify-center">
            <Image
              src="/assets/dhl.svg"
              alt="DHL Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <Link href="https://www.dhl.com/au-en/home.html" target="_blank" rel="noopener noreferrer">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 hover:underline">By DHL Express</h3>
        </Link>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-grow">
          Trusted worldwide shipping with fast delivery times and full tracking.
        </p>
      </div>
    </AnimatedSection>

    {/* By Land */}
    <AnimatedSection delay={400}>
      <div className="bg-white rounded-lg p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-center flex flex-col h-full">
        <div className="mb-4 md:mb-6">
          <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-3 md:mb-4 flex items-center justify-center">
            <Image
              src="/assets/interparcel.png"
              alt="Interparcel Delivery"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <Link href="https://au.interparcel.com/tracking/" target="_blank" rel="noopener noreferrer">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 hover:underline">By Interparcel</h3>
        </Link>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-grow">
          Flexible and affordable courier services with multiple delivery options and tracking included.
        </p>
      </div>
    </AnimatedSection>
  </div>
);

function HeroCarousel() {
  const { sliders, loading: slidersLoading, error: slidersError } = useSliders();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Use dynamic sliders from API, fallback to hardcoded slides if no API data
  const slides = sliders.length > 0 ? sliders : heroSlides;



  // Helper function to get slide properties
  const getSlideProps = (slide: any, index: number) => {
    // If it's an API slider (has ordering field), use image directly
    if ('ordering' in slide) {
      // Convert relative image path to full URL using dynamic config
      const imageUrl = getImageUrl(slide.image);
      return {
        id: slide.id,
        image: imageUrl,
        title: 'SD Auto Parts', // Default title for API sliders
        subtitle: 'Quality Genuine Parts for Your Vehicle', // Default subtitle
        aiHint: 'auto parts slider',
        primaryButton: {
          text: "View Parts",
          href: "/genuine-parts"
        },
        secondaryButton: {
          text: "Contact Us",
          href: "/contact"
        }
      };
    }
    // Otherwise it's a hardcoded slide
    return slide;
  };

  const nextSlide = useCallback(() => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, slides.length]);

  const prevSlide = useCallback(() => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, slides.length]);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, currentSlide]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(!isAutoPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, prevSlide, isAutoPlaying]);

  // Ensure currentSlide is within bounds
  const safeCurrentSlide = slides.length > 0 ? Math.min(currentSlide, slides.length - 1) : 0;
  const currentSlideData = slides.length > 0 ? getSlideProps(slides[safeCurrentSlide], safeCurrentSlide) : null;

  // Don't render if no slides available
  if (slides.length === 0 || !currentSlideData) {
    return null;
  }

  return (
    <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden group bg-gray-900">
      {/* Background Images with Smooth Transition */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => {
          const slideProps = getSlideProps(slide, index);
          return (
            <div
              key={slideProps.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out bg-gray-800 ${
                index === safeCurrentSlide
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105'
              }`}
            >
              <Image
                src={slideProps.image}
                alt={slideProps.title}
                data-ai-hint={slideProps.aiHint}
                fill
                className={`object-cover scale-110 ${
                  index === 0 ? 'object-[center_55%]' :
                  index === 1 ? 'object-[center_75%]' : // Ford - current good position
                  index === 2 ? 'object-[center_75%]' : // Isuzu - show more top
                  index === 3 ? 'object-[center_22%]' :
                  index === 4 ? 'object-[center_35%]' :
                  index === 5 ? 'object-[center_60%]' :
                  'object-[center_55%]' // Default for other slides
                }`}
                priority={index === 0}
              />
            </div>
          );
        })}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
      
      {/* Content */}
      <div className="relative container mx-auto h-full flex flex-col items-start justify-center text-white z-10">
        <div className="max-w-4xl">
          <h1 className={`text-4xl md:text-6xl font-bold font-headline mb-4 transition-all duration-500 ease-out ${
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            {currentSlideData.title}
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mb-8 transition-all duration-500 ease-out delay-100 ${
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            {currentSlideData.subtitle}
          </p>
          <div className={`flex flex-wrap gap-4 transition-all duration-500 ease-out delay-200 ${
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            <Button size="lg" asChild className="hover:scale-105 transition-transform duration-200">
              <Link href={currentSlideData.primaryButton.href}>
                {currentSlideData.primaryButton.text} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="hover:scale-105 transition-transform duration-200">
              <Link href={currentSlideData.secondaryButton.href}>
                {currentSlideData.secondaryButton.text}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-4 flex items-center z-20">
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="group/btn bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-white group-hover/btn:text-white/90 transition-colors" />
        </button>
      </div>
      
      <div className="absolute inset-y-0 right-4 flex items-center z-20">
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="group/btn bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-white group-hover/btn:text-white/90 transition-colors" />
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-6 z-20">
        {/* Slide Indicators */}
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === safeCurrentSlide
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/70 hover:scale-125'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110"
          aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isAutoPlaying ? (
            <Pause className="h-4 w-4 text-white" />
          ) : (
            <Play className="h-4 w-4 text-white ml-0.5" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{
            width: `${((currentSlide + 1) / heroSlides.length) * 100}%`
          }}
        />
      </div>

      {/* Touch/Swipe Indicators (Mobile) */}
      <div className="absolute inset-x-0 bottom-20 md:hidden flex justify-center z-10">
        <div className="text-white/70 text-xs font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
          Swipe to navigate
        </div>
      </div>
    </section>
  );
}



export default function Home() {
  const [loading, setLoading] = useState(true);
  const { settings } = useHomeSettings();
  const { shipping, loading: shippingLoading } = useShipping(); // Added
  const { partners: deliveryPartners, loading: deliveryLoading, error: deliveryError } = useDeliveryPartners(); // Added

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate a 2-second loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col">
      <HeroCarousel />

      {/* Welcome Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection className="relative h-full order-2 md:order-1" delay={200}>
              <Image
                src={settings?.welcome_logo || "assets/home/p1.webp"}
                alt="Auto parts and automotive service"
                data-ai-hint="auto parts automotive service garage"
                fill
                className="object-cover rounded-lg shadow-xl"
              />
            </AnimatedSection>
            <div className="order-1 md:order-2">
              <div className="max-w-xl">
                <AnimatedSection delay={100}>
                  <h2 className="text-3xl md:text-5xl font-bold font-headline text-gray-900 mb-6">
                    {settings?.title_welcome || "Welcome to SD Auto Parts"}
                  </h2>
                </AnimatedSection>
                <AnimatedSection delay={200}>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    {settings?.description_welcome || "SD Auto is an Australian family-owned and operated business, officially registered with the Australian Taxation Office (ATO) in 2023, and based in Werribee, Melbourne. We specialize in selling 100% genuine parts for popular Thailand-made brands suchs as Ford, Isuzu, Toyota, Mazda, Mitsubishi, Nissan, Honda, and Suzuki at affordable prices. We offer worldwide shipping with the best rates to your address. With 15 years of experience in the auto parts industry, we guarantee to provide you with the correct part for your vehicle at the best price and service. Contact us today!"}
                  </p>
                </AnimatedSection>
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

      {/* Our Delivery Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-16">
            <div className="w-16 h-1 bg-orange-400 mx-auto mb-4"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {shippingLoading ? <span className="animate-pulse bg-gray-300 h-10 w-64 block mx-auto rounded"></span> : (shipping[0]?.label_partner || "Our Delivery Partners")}
            </h2>
          </AnimatedSection>
          
          {/* Conditional rendering for Delivery Partners */}
          {deliveryLoading || deliveryError || deliveryPartners.length > 0 ? (
            <HomePageDeliveryPartners partners={deliveryPartners} loading={deliveryLoading} error={deliveryError} />
          ) : (
            staticDeliveryPartnersHtml
          )}
        </div>
      </section>

      <Suspense fallback={
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      }>
        <HomeWithProducts />
      </Suspense>

     {/* Latest Blog Section */}
     

      {/* Why Choose Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection className="relative h-full" delay={200}>
            <Image
              src={settings?.why_choose_logo || "assets/home/p2.webp"}
              alt="High-quality car products"
              data-ai-hint="car parts automotive products"
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </AnimatedSection>
          <div>
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">{settings?.why_choose_title || "Why Choose SD Auto?"}</h2>
            </AnimatedSection>
            <ul className="space-y-4">
              {settings?.why_choose_title1 && (
                <AnimatedSection delay={200}>
                  <li className="flex items-start">
                    <div className="bg-primary/10 text-primary rounded-full p-2 mr-4 mt-1">
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{settings.why_choose_title1}</h4>
                      <p className="text-muted-foreground">{settings.why_choose_description1}</p>
                    </div>
                  </li>
                </AnimatedSection>
              )}
              {!settings?.why_choose_title1 && (
                <AnimatedSection delay={200}>
                  <li className="flex items-start">
                    <div className="bg-primary/10 text-primary rounded-full p-2 mr-4 mt-1">
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">With 15 years of experience</h4>
                      <p className="text-muted-foreground">SD Auto has established expertise in providing genuine auto parts for Thailand-made brands, backed by a proven track record.</p>
                    </div>
                  </li>
                </AnimatedSection>
              )}
              {settings?.why_choose_title2 && (
                <AnimatedSection delay={300}>
                  <li className="flex items-start">
                    <div className="bg-primary/10 text-primary rounded-full p-2 mr-4 mt-1">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{settings.why_choose_title2}</h4>
                      <p className="text-muted-foreground">{settings.why_choose_description2}</p>
                    </div>
                  </li>
                </AnimatedSection>
              )}
              {!settings?.why_choose_title2 && (
                <AnimatedSection delay={300}>
                  <li className="flex items-start">
                    <div className="bg-primary/10 text-primary rounded-full p-2 mr-4 mt-1">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Family-owned Australian business</h4>
                      <p className="text-muted-foreground">Based in Melbourne, Australia, shipping locally and internationally.</p>
                    </div>
                  </li>
                </AnimatedSection>
              )}
              {settings?.why_choose_title3 && (
                <AnimatedSection delay={400}>
                  <li className="flex items-start">
                    <div className="bg-primary/10 text-primary rounded-full p-2 mr-4 mt-1">
                      <Car className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{settings.why_choose_title3}</h4>
                      <p className="text-muted-foreground">{settings.why_choose_description3}</p>
                    </div>
                  </li>
                </AnimatedSection>
              )}
              {!settings?.why_choose_title3 && (
                <AnimatedSection delay={400}>
                  <li className="flex items-start">
                    <div className="bg-primary/10 text-primary rounded-full p-2 mr-4 mt-1">
                      <Car className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Fair pricing without compromise</h4>
                      <p className="text-muted-foreground">We understand the challenges of high dealer prices and offer reliable alternatives without compromising on quality.</p>
                    </div>
                  </li>
                </AnimatedSection>
              )}
              {settings?.why_choose_title4 && (
                <AnimatedSection delay={500}>
                  <li className="flex items-start">
                    <div className="bg-primary/10 text-primary rounded-full p-2 mr-4 mt-1">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{settings.why_choose_title4}</h4>
                      <p className="text-muted-foreground">{settings.why_choose_description4}</p>
                    </div>
                  </li>
                </AnimatedSection>
              )}
              {!settings?.why_choose_title4 && (
                <AnimatedSection delay={500}>
                  <li className="flex items-start">
                    <div className="bg-primary/10 text-primary rounded-full p-2 mr-4 mt-1">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Top-rated eBay seller since 2011</h4>
                      <p className="text-muted-foreground">One of eBay's most reputable sellers since 2011, consistently providing outstanding customer service.</p>
                    </div>
                  </li>
                </AnimatedSection>
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function HomeWithProducts() {
  const { products, loading, error } = useProducts();

  // You can add error handling here if you want
  // if (error) return <div>Error loading products...</div>;

  return (
    <ProductList 
      products={products} 
      isLoading={loading}
      showContainer={true} 
      allowedBrands={["Ford Parts", "Isuzu Parts", "Toyota Parts", "Mazda Parts", "Mitsubishi Parts", "Nissan Parts", "Honda Parts", "Suzuki Parts", "Aftermarket"]} 
    />
  );
}