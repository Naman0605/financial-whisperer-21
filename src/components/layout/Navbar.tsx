
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : 
        isLanding ? "bg-transparent" : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-medium"
        >
          <Sparkles className="h-6 w-6 text-finance-teal" />
          <span className="font-semibold">FinWhisperer</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className="text-sm font-medium hover:text-finance-teal transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className="text-sm font-medium hover:text-finance-teal transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            to="/expenses" 
            className="text-sm font-medium hover:text-finance-teal transition-colors"
          >
            Expenses
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isLanding ? (
            <Button 
              asChild 
              className="bg-finance-teal hover:bg-finance-teal/90 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Link to="/onboarding">Get Started</Link>
            </Button>
          ) : (
            <Button 
              asChild 
              variant="outline" 
              className="border-finance-teal text-finance-teal hover:bg-finance-teal/10"
            >
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
