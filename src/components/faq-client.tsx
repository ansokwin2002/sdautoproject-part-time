"use client";

import { useState, useEffect, useCallback, useRef } from "react"; // Added useEffect, useCallback, useRef
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type FAQInput } from "@/ai/flows/dynamic-faq-generation";
import { runFlow } from "@genkit-ai/next/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, Loader2 } from "lucide-react";

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


const formSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters."),
});

type FaqEntry = {
  question: string;
  answer: string;
  isLoading: boolean;
};

type FaqClientProps = {
  serviceContext: string;
};

export default function FaqClient({ serviceContext }: FaqClientProps) {
  const [mainAnswer, setMainAnswer] = useState<string>("");
  const [isMainLoading, setIsMainLoading] = useState<boolean>(false);
  const [mainAskedQuestion, setMainAskedQuestion] = useState<string>("");

  const [faqList, setFaqList] = useState<FaqEntry[]>([
    { question: "What are your business hours?", answer: "", isLoading: false },
    { question: "Do you offer car detailing services?", answer: "", isLoading: false },
    { question: "How can I book an appointment?", answer: "", isLoading: false },
    { question: "What kind of warranty do you offer on repairs?", answer: "", isLoading: false },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsMainLoading(true);
    setMainAnswer("");
    setMainAskedQuestion(values.question);

    const faqInput: FAQInput = {
      question: values.question,
      context: serviceContext,
    };

    try {
      const result = await runFlow({
        url: "/api/genkit",
        input: faqInput,
      });
      setMainAnswer(result.answer);
    } catch (error) {
      console.error("Error generating FAQ answer:", error);
      setMainAnswer("Sorry, I couldn't generate an answer. Please try rephrasing your question.");
    } finally {
      setIsMainLoading(false);
    }
  }
  
  const handleAccordionToggle = async (index: number) => {
    const currentFaq = faqList[index];
    if (currentFaq.answer || currentFaq.isLoading) return;

    setFaqList(prevList => {
      const newList = [...prevList];
      newList[index].isLoading = true;
      return newList;
    });

    try {
      const result = await runFlow({
        url: "/api/genkit",
        input: {
          question: currentFaq.question,
          context: serviceContext,
        },
      });
       setFaqList(prevList => {
        const newList = [...prevList];
        newList[index].answer = result.answer;
        newList[index].isLoading = false;
        return newList;
      });
    } catch (error) {
      console.error("Error generating accordion answer:", error);
      setFaqList(prevList => {
        const newList = [...prevList];
        newList[index].answer = "Sorry, an error occurred while fetching the answer.";
        newList[index].isLoading = false;
        return newList;
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatedCard delay={0}>
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="text-primary h-6 w-6" />
              Ask our AI Assistant
            </h2>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Your Question</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Do you service electric vehicles?'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isMainLoading}>
                  {isMainLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Answer...
                    </>
                  ) : (
                    "Get Answer"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </AnimatedCard>

      {(isMainLoading || mainAnswer) && (
        <Card className="mb-12 animate-in fade-in">
          <CardContent className="p-6">
            <p className="font-semibold text-muted-foreground mb-2">Q: {mainAskedQuestion}</p>
            {isMainLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-primary">Thinking...</p>
              </div>
            ) : (
              <p className="text-foreground leading-relaxed">
                <span className="font-semibold text-primary">A:</span> {mainAnswer}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <AnimatedCard delay={100}>
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">Common Questions</h2>
          <Accordion type="single" collapsible className="w-full bg-background rounded-lg shadow-md">
              {faqList.map((faq, i) => (
                   <AccordionItem value={`item-${i}`} key={i}>
                      <AccordionTrigger onClick={() => handleAccordionToggle(i)} className="text-left hover:no-underline px-6">
                          {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                          {faq.isLoading && (
                              <div className="flex items-center space-x-2 pt-2">
                                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                  <p className="text-sm text-primary">Finding answer...</p>
                              </div>
                          )}
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