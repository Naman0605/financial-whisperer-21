
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  UserRound,
  LogIn,
  Menu,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";
  
  // Check if user is on signin page to determine logged in state
  const isLoggedIn = location.pathname !== "/signin";

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
            <>
              <Button 
                asChild 
                variant="outline" 
                className="hidden md:flex"
              >
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button 
                asChild 
                className="bg-finance-teal hover:bg-finance-teal/90 text-white shadow-md hover:shadow-lg transition-all"
              >
                <Link to="/onboarding">Get Started</Link>
              </Button>
            </>
          ) : (
            <>
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 bg-finance-teal/10">
                      <UserRound className="h-5 w-5 text-finance-teal" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-start p-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">Rahul Sharma</p>
                        <p className="text-sm text-muted-foreground truncate">rahul.sharma@example.com</p>
                      </div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/expenses" className="cursor-pointer">Expenses</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="text-red-500 focus:text-red-500">
                      <Link to="/signin" className="cursor-pointer">Sign out</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  asChild 
                  variant="outline" 
                  className="border-finance-teal text-finance-teal hover:bg-finance-teal/10"
                >
                  <Link to="/signin">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              )}
            </>
          )}
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className="text-lg font-medium hover:text-finance-teal transition-colors p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className="text-lg font-medium hover:text-finance-teal transition-colors p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/expenses" 
              className="text-lg font-medium hover:text-finance-teal transition-colors p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Expenses
            </Link>
            <Link 
              to="/profile" 
              className="text-lg font-medium hover:text-finance-teal transition-colors p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            {isLanding && (
              <Link 
                to="/signin" 
                className="text-lg font-medium hover:text-finance-teal transition-colors p-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
