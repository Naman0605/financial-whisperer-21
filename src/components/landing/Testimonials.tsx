
import { useRef, useEffect } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    image: "/placeholder.svg",
    quote: "FinWhisperer helped me understand where my business was spending unnecessarily. I've saved over $5,000 in just three months!",
    stars: 5
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    image: "/placeholder.svg",
    quote: "The AI assistant is incredibly intuitive. I can ask questions about my spending habits and get instant, visual answers.",
    stars: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Freelance Designer",
    image: "/placeholder.svg",
    quote: "As someone with irregular income, FinWhisperer has been a game-changer for budgeting and planning for taxes.",
    stars: 5
  }
];

export const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            
            const testimonialItems = document.querySelectorAll('.testimonial-item');
            testimonialItems.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('is-visible');
              }, index * 150);
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

  return (
    <section 
      ref={sectionRef}
      className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="max-w-7xl mx-auto scroll-fade">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of people who are already changing their financial future with FinWhisperer.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="testimonial-item scroll-fade p-6 rounded-xl glass-card"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-finance-gold text-finance-gold" />
                ))}
              </div>
              
              <blockquote className="mb-6 text-lg italic">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
