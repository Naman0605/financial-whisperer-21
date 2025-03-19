
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

export const CallToAction = () => {
  const benefits = [
    "AI-powered financial insights",
    "Personalized savings recommendations",
    "Natural language financial assistant",
    "Beautiful data visualizations",
    "Bank-level security"
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-finance-teal/10 to-transparent" />
      <div className="absolute bottom-0 -left-40 w-80 h-80 bg-finance-teal/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-40 w-80 h-80 bg-finance-gold/10 rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto relative">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/30">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Column: Content */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to transform your financial future?
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of users who are using AI to build better financial habits and achieve their goals.
              </p>
              
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-finance-teal/20 flex items-center justify-center">
                      <Check className="h-3 w-3 text-finance-teal" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-finance-teal hover:bg-finance-teal/90 text-white font-medium px-8 shadow-md hover:shadow-lg transition-all duration-300 group"
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
                  className="border-finance-teal/50 text-finance-teal hover:bg-finance-teal/10"
                >
                  <a href="#features">
                    Learn More
                  </a>
                </Button>
              </div>
            </div>
            
            {/* Right Column: Image */}
            <div className="bg-gradient-to-br from-finance-teal/20 to-finance-gold/20 p-8 md:p-12 lg:p-16 flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl rotate-3 shadow-lg border border-gray-200/50 dark:border-gray-700/30" />
                <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl -rotate-3 shadow-lg border border-gray-200/50 dark:border-gray-700/30" />
                
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/30 p-6 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Your Financial Future</h3>
                    <p className="text-sm text-muted-foreground">Projected savings with FinWhisperer</p>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-xs aspect-square rounded-full bg-gradient-to-br from-finance-teal/20 to-finance-gold/20 flex items-center justify-center relative">
                      <div className="absolute inset-4 rounded-full border-4 border-dashed border-finance-teal/30 animate-spin" style={{ animationDuration: '20s' }} />
                      <div className="text-center">
                        <p className="text-4xl md:text-5xl font-bold text-finance-teal">$24,600</p>
                        <p className="text-sm text-muted-foreground mt-2">Potential 5-year savings</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Monthly progress</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-finance-teal rounded-full" style={{ width: '68%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
