
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const elements = [
      { ref: headingRef, delay: 100 },
      { ref: subheadingRef, delay: 300 },
      { ref: ctaRef, delay: 500 }
    ];
    
    elements.forEach(({ ref, delay }) => {
      if (ref.current) {
        setTimeout(() => {
          ref.current?.classList.add("opacity-100", "translate-y-0");
        }, delay);
      }
    });
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-finance-teal/10 via-transparent to-transparent" />
      
      {/* Animated circles */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-finance-teal/20 rounded-full blur-3xl animate-pulse-gentle" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-finance-gold/20 rounded-full blur-3xl animate-pulse-gentle" style={{ animationDelay: "1s" }} />
      
      <div className="max-w-4xl mx-auto text-center relative z-10 pt-16">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-finance-teal/10 text-finance-teal text-sm font-medium mb-6 animate-fade-in">
          <Sparkles className="h-4 w-4 mr-2" />
          AI-Powered Financial Insights
        </div>
        
        <h1 
          ref={headingRef}
          className="text-4xl md:text-6xl font-bold mb-6 opacity-0 translate-y-4 transition-all duration-700 ease-out"
        >
          Take control of your finances <span className="text-finance-teal">with AI</span>
        </h1>
        
        <p 
          ref={subheadingRef}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto opacity-0 translate-y-4 transition-all duration-700 ease-out delay-300"
        >
          FinWhisperer analyzes your spending patterns, provides personalized recommendations, and helps you achieve your financial goals – all through the power of artificial intelligence.
        </p>
        
        <div 
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 translate-y-4 transition-all duration-700 ease-out delay-500"
        >
          <Button 
            asChild
            size="lg" 
            className="bg-finance-teal hover:bg-finance-teal/90 text-white rounded-full font-medium px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Link to="/onboarding">
              Get Started for Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            size="lg" 
            className="border-finance-teal/50 text-finance-teal hover:bg-finance-teal/10 rounded-full px-8 py-6"
          >
            <a href="#features">
              See how it works
            </a>
          </Button>
        </div>
      </div>
      
      {/* Mockup Image */}
      <div className="w-full max-w-5xl mx-auto mt-16 px-4 opacity-0 animate-fade-in" style={{ animationDelay: "700ms", animationFillMode: "forwards" }}>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-700/30">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none z-10" />
          
          {/* This would be your actual dashboard preview image */}
          <div className="aspect-[16/9] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 md:p-8 flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-finance-teal flex items-center justify-center text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">FinWhisperer Dashboard</h3>
                <p className="text-sm text-muted-foreground">AI insights that save you money</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/30">
                <h4 className="text-sm font-medium mb-2">Monthly Savings</h4>
                <p className="text-2xl font-bold text-finance-teal">₹24,500</p>
                <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-finance-teal w-3/4 rounded-full" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/30">
                <h4 className="text-sm font-medium mb-2">Spending vs Budget</h4>
                <p className="text-2xl font-bold text-finance-slate">₹45,800</p>
                <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-finance-slate w-1/2 rounded-full" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/30">
                <h4 className="text-sm font-medium mb-2">AI Insights</h4>
                <p className="text-sm text-muted-foreground">3 money-saving opportunities found</p>
                <Button variant="link" className="text-finance-teal p-0 h-auto mt-2 text-sm">View details</Button>
              </div>
            </div>
            
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Recent Transactions</h4>
                <Button variant="outline" size="sm" className="h-8">View all</Button>
              </div>
              
              <div className="space-y-2">
                {[
                  { name: "Grocery Store", amount: "₹3,500", date: "Today" },
                  { name: "Coffee Shop", amount: "₹150", date: "Yesterday" },
                  { name: "Monthly Subscription", amount: "₹499", date: "Jan 12" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/30 last:border-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <span>{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
