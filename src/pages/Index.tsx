
import { useEffect, useRef } from "react";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import CallToAction from "@/components/landing/CallToAction";
import Navbar from "@/components/layout/Navbar";

const Index = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const scrollElements = document.querySelectorAll('.scroll-fade');
    scrollElements.forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      scrollElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background" ref={contentRef}>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <CallToAction />
      </main>
      <footer className="bg-white dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} FinWhisperer. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Illustrations and designs are created for demonstration purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
