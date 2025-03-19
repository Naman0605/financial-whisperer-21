
import { useRef, useEffect } from "react";
import { PiggyBank, TrendingUp, MessageSquare, Zap } from "lucide-react";

export const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const featureItems = document.querySelectorAll('.feature-item');
            featureItems.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('is-visible');
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: <TrendingUp className="h-10 w-10 text-finance-teal" />,
      title: "AI-Powered Insights",
      description: "Our algorithm analyzes your spending patterns to provide personalized financial recommendations."
    },
    {
      icon: <PiggyBank className="h-10 w-10 text-finance-teal" />,
      title: "Smart Saving Goals",
      description: "Set and track your saving goals with intelligent projections based on your financial behavior."
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-finance-teal" />,
      title: "Financial Chat Assistant",
      description: "Ask questions about your finances in plain English and get instant answers and visualizations."
    },
    {
      icon: <Zap className="h-10 w-10 text-finance-teal" />,
      title: "Real-time Alerts",
      description: "Get notified about unusual spending, upcoming bills, and opportunities to save money."
    }
  ];

  return (
    <section 
      id="features" 
      ref={sectionRef}
      className="py-20 px-4 bg-white dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-finance-teal">FinWhisperer</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines artificial intelligence with financial expertise to help you make smarter decisions with your money.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-item scroll-fade p-6 rounded-xl glass-card flex flex-col items-center text-center"
            >
              <div className="mb-4 p-3 rounded-full bg-finance-teal/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Demo Video Section */}
        <div className="mt-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl overflow-hidden shadow-lg border border-gray-200/50 dark:border-gray-700/30">
          <div className="aspect-video bg-gradient-to-r from-finance-teal/10 to-finance-gold/10 flex items-center justify-center">
            <div className="text-center p-8">
              <h3 className="text-2xl font-bold mb-4">See FinWhisperer in Action</h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Watch how our AI assistant helps you understand your finances and make smarter decisions.
              </p>
              
              {/* This would be replaced with an actual video player component */}
              <div className="max-w-4xl mx-auto aspect-video bg-gray-900 rounded-lg shadow-xl flex items-center justify-center">
                <div className="text-white">
                  <p className="text-lg font-medium">Demo Video Placeholder</p>
                  <p className="text-sm text-gray-400">Your engaging product demo would appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
