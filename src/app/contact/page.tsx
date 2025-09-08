"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";

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

// Success/Error notification component
const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';
  
  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg border transition-all duration-300 ${
      isSuccess 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      <div className="flex items-start gap-3">
        {isSuccess ? (
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        )}
        <div className="flex-1">
          <p className="font-medium">
            {isSuccess ? 'Message Sent!' : 'Error Sending Message'}
          </p>
          <p className="text-sm mt-1">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-xl leading-none hover:opacity-70"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    vin: '',
    vehicleMakeModel: '',
    vehicleYear: '',
    engineCapacity: '',
    partsRequired: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    
    if (formData.partsRequired.length < 10) {
      newErrors.partsRequired = 'Parts information must be at least 10 characters.';
    }
    
    return newErrors;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setNotification({
          type: 'success',
          message: 'Your inquiry has been sent successfully! We\'ll get back to you soon.'
        });
        
        // Reset form
        setFormData({
          companyName: '',
          name: '',
          email: '',
          phone: '',
          vin: '',
          vehicleMakeModel: '',
          vehicleYear: '',
          engineCapacity: '',
          partsRequired: ''
        });
        setErrors({});
      } else {
        throw new Error('Failed to send email.');
      }

    } catch (error) {
      console.error('Submission error:', error);
      setNotification({
        type: 'error',
        message: 'There was an issue sending your inquiry. Please try again later or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="container mx-auto py-16 md:py-24 space-y-16">
        {/* Header Section */}
        <div className="text-center">
          <AnimatedText delay={100}>
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Auto Parts Inquiry</h1>
          </AnimatedText>
          <AnimatedText delay={200}>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-lg">
              Looking for specific auto parts? Provide your vehicle details and we'll help you find what you need.
            </p>
          </AnimatedText>
        </div>

        {/* Contact Form Section - First */}
        <AnimatedCard delay={300}>
          <Card className="shadow-lg max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Parts Request Form</CardTitle>
              <CardDescription className="text-base">
                Provide your vehicle information and parts requirements for a quick quote.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Company Name
                    </label>
                    <Input 
                      placeholder="Your company name" 
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Your Name *
                    </label>
                    <Input 
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={errors.name ? 'border-red-500' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="text-sm font-medium text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Phone Number (Optional)
                    </label>
                    <Input 
                      placeholder="+61 460 786 533" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Email Address *
                    </label>
                    <Input 
                      placeholder="you@example.com" 
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-sm font-medium text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      VIN (Vehicle Identification Number)
                    </label>
                    <Input 
                      placeholder="Vehicle VIN number" 
                      value={formData.vin}
                      onChange={(e) => handleInputChange('vin', e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Vehicle Make / Model
                    </label>
                    <Input 
                      placeholder="e.g., Toyota Camry" 
                      value={formData.vehicleMakeModel}
                      onChange={(e) => handleInputChange('vehicleMakeModel', e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Vehicle Year
                    </label>
                    <Input 
                      placeholder="e.g., 2020" 
                      value={formData.vehicleYear}
                      onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Engine Capacity
                    </label>
                    <Input 
                      placeholder="e.g., 2.5L" 
                      value={formData.engineCapacity}
                      onChange={(e) => handleInputChange('engineCapacity', e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Parts Required / Other Information *
                  </label>
                  <Textarea
                    placeholder="Please describe the parts you need, including part numbers if available..."
                    className={`min-h-[150px] ${errors.partsRequired ? 'border-red-500' : ''}`}
                    value={formData.partsRequired}
                    onChange={(e) => handleInputChange('partsRequired', e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.partsRequired && (
                    <p className="text-sm font-medium text-red-500 mt-1">{errors.partsRequired}</p>
                  )}
                </div>
                
                <Button 
                  type="submit"
                  className="w-full md:w-auto px-12 py-3 text-lg" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></div>
                      Sending Inquiry...
                    </div>
                  ) : (
                    "Send Parts Request"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Contact Information Section - Second */}
        <AnimatedSection delay={400}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-headline mb-4">Contact Information</h2>
              <p className="text-muted-foreground text-lg">
                Find us at our location or reach out through any of these channels.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                <CardContent className="p-6 text-center flex flex-col">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <div className="flex-grow flex items-center justify-center">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      SD AUTO PART<br />
                      87 Kookaburra Avenue<br />
                      Werribee, Victoria 3030<br />
                      Australia
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                <CardContent className="p-6 text-center flex flex-col">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <div className="flex-grow flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      <a href="tel:+61460786533" className="hover:text-primary transition-colors">
                        +61 460 786 533
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                <CardContent className="p-6 text-center flex flex-col">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <div className="flex-grow flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      <a href="mailto:sdautoaustralia@gmail.com" className="hover:text-primary transition-colors">
                        sdautoaustralia@gmail.com
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                <CardContent className="p-6 text-center flex flex-col">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Business Hours</h3>
                  <div className="flex-grow flex items-center justify-center">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Monday - Friday<br />
                      8:00 AM - 6:00 PM
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </AnimatedSection>

        {/* Map Section - Third */}
        <AnimatedSection delay={500}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-headline mb-4">Find Us</h2>
              <p className="text-muted-foreground text-lg">
                Visit our location in Werribee, Victoria for in-person assistance.
              </p>
            </div>
            
            <Card className="shadow-lg overflow-hidden">
              <div className="relative w-full h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3149.0000000000005!2d144.6796815!3d-37.8847459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad685f5ea485f2b%3A0x5bafe966a5c282c2!2s87%20Kookaburra%20Ave%2C%20Werribee%20VIC%203030%2C%20Australia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            </Card>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}