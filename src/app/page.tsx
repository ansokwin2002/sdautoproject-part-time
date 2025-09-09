"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Car, Wrench, Sparkles, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { products } from "@/lib/products";
import ProductCard from "@/components/product-card";
import ProductList from "@/components/product-list";
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

const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Excellence in Every Detail",
    subtitle: "SD AutoCar offers premium automotive services, from routine maintenance to full-scale restorations.",
    primaryButton: {
      text: "Our Services",
      href: "/services"
    },
    secondaryButton: {
      text: "Book Now",
      href: "/contact"
    },
    aiHint: "Ford Mustang sports car automotive"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Genuine Parts & Expert Care",
    subtitle: "Only the finest genuine parts combined with decades of automotive expertise to keep your vehicle running perfectly.",
    primaryButton: {
      text: "Browse Parts",
      href: "/genuine-parts"
    },
    secondaryButton: {
      text: "Learn More",
      href: "/about"
    },
    aiHint: "Mazda CX-5 SUV automotive"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Fast & Reliable Shipping",
    subtitle: "Get your genuine auto parts delivered quickly with our nationwide shipping network. Quality parts, delivered on time.",
    primaryButton: {
      text: "Shipping Info",
      href: "/shipping"
    },
    secondaryButton: {
      text: "Contact Us",
      href: "/contact"
    },
    aiHint: "Toyota Camry sedan automotive"
  }
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

function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

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

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden group">
      {/* Background Images with Smooth Transition */}
      <div className="relative w-full h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              data-ai-hint={slide.aiHint}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
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
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
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
                    Welcome to SD Auto Parts
                  </h2>
                </AnimatedSection>
                <AnimatedSection delay={200}>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    SD Auto Parts has earned 15 years of experience with auto parts business specializing in parts for any vehicle from Thailand, UK, and America. If you have any difficulty to get any part for your vehicle because of dealer's price is too high, please don't hesitate to contact us at{' '}
                    <span className="font-semibold text-blue-600">0460786533</span>, email:{' '}
                    <span className="font-semibold text-blue-600">sdautaustralia@gmail.com</span>. Thank You!...
                  </p>
                </AnimatedSection>
                <AnimatedSection delay={300}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" asChild className="hover:scale-105 transition-transform duration-200">
                      <Link href="/about">
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

      <ProductList showContainer={true} />

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
                        

            {/* Blog Post 2 */}
            <AnimatedSection delay={200}>
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
                   <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-200 rounded-md px-4 py-2"
                    >
                      <Link href="/blog/transportation-quality">
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Blog Post 3 */}
            <AnimatedSection delay={300}>
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
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-200 rounded-md px-4 py-2"
                      >
                        <Link href="/blog/transportation-quality">
                          Read More <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                  </div>
                </div>
              </div>
            </AnimatedSection>

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
                   <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-200 rounded-md px-4 py-2"
                    >
                      <Link href="/blog/transportation-quality">
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
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

      {/* Why Choose Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection className="relative h-full" delay={200}>
            <Image
              src="https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
              alt="High-quality car products"
              data-ai-hint="car parts automotive products"
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </AnimatedSection>
          <div>
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Choose SD AutoCar Products?</h2>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <p className="text-muted-foreground mt-4 mb-6 text-lg">
                We provide top-quality car parts and accessories that ensure your vehicle runs smoothly and safely. Your satisfaction is our priority.
              </p>
            </AnimatedSection>
            <ul className="space-y-4">
              <AnimatedSection delay={200}>
                <li className="flex items-start">
                  <div className="bg-primary/10 text-primary rounded-full p-2 mr-4 mt-1">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Premium Quality</h4>
                    <p className="text-muted-foreground">All products are made with high-quality materials to ensure durability and performance.</p>
                  </div>
                </li>
              </AnimatedSection>
              <AnimatedSection delay={300}>
                <li className="flex items-start">
                  <div className="bg-primary/10 text-primary rounded-full p-2 mr-4 mt-1">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Affordable Prices</h4>
                    <p className="text-muted-foreground">Get the best value for money with competitive pricing and great deals on all products.</p>
                  </div>
                </li>
              </AnimatedSection>
              <AnimatedSection delay={400}>
                <li className="flex items-start">
                  <div className="bg-primary/10 text-primary rounded-full p-2 mr-4 mt-1">
                    <Car className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Wide Selection</h4>
                    <p className="text-muted-foreground">We offer a broad range of car parts and accessories to meet all your automotive needs.</p>
                  </div>
                </li>
              </AnimatedSection>
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
}