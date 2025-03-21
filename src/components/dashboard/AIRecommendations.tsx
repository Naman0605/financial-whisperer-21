
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, Trash, Repeat, CreditCard, Calendar, ArrowRight, ShoppingBag, Smartphone, Utensils, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Recommendation {
  title: string;
  description: string;
  savings: string;
  icon: string;
}

interface AIRecommendationData {
  recommendations: Recommendation[];
  analysis: string;
  savingsStrategy: string;
}

const defaultRecommendations: Recommendation[] = [
  {
    title: "Cancel unused subscriptions",
    description: "We found 2 subscriptions you haven't used in 3+ months",
    savings: "₹650/month",
    icon: "Trash"
  },
  {
    title: "Switch utility provider",
    description: "Based on your usage patterns, a different plan could be cheaper",
    savings: "₹1,200/year",
    icon: "Repeat"
  },
  {
    title: "Consider a different credit card",
    description: "Your spending would earn more rewards with this card",
    savings: "₹3,500 more in rewards",
    icon: "CreditCard"
  },
  {
    title: "Set up automatic bill payments",
    description: "You've paid ₹450 in late fees this year",
    savings: "Avoid late fees in the future",
    icon: "Calendar"
  }
];

interface AIRecommendationsProps {
  onViewDetails?: () => void;
}

const AIRecommendations = ({ onViewDetails }: AIRecommendationsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>(defaultRecommendations);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const storedRecommendations = localStorage.getItem('aiRecommendations');
    
    if (storedRecommendations) {
      try {
        const parsedData: AIRecommendationData = JSON.parse(storedRecommendations);
        if (parsedData.recommendations && Array.isArray(parsedData.recommendations)) {
          setRecommendations(parsedData.recommendations);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing stored recommendations:", error);
        generateRecommendations();
      }
    } else if (user) {
      generateRecommendations();
    } else {
      setIsLoading(false);
    }
  }, [user]);
  
  const generateRecommendations = async () => {
    setIsLoading(true);
    
    try {
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('name, amount')
        .eq('user_id', user.id);
      
      if (expensesError) throw expensesError;
      
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('name, target_amount')
        .eq('user_id', user.id);
      
      if (goalsError) throw goalsError;
      
      if (!expenses?.length && !goals?.length) {
        setIsLoading(false);
        return;
      }
      
      const userData = {
        expenses: expenses.map(exp => ({ name: exp.name, amount: exp.amount })),
        goals: goals.map(goal => ({ name: goal.name, target: goal.target_amount }))
      };
      
      console.log("Sending request to AI recommendations API:", userData);
      
      const response = await fetch(`/api/ai-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userData }),
      });
      
      console.log("AI recommendations response status:", response.status);
      
      if (!response.ok) {
        console.error("AI recommendations response error:", await response.text());
        throw new Error('Failed to generate recommendations');
      }
      
      const data = await response.json();
      console.log("AI recommendations data received:", data);
      
      localStorage.setItem('aiRecommendations', JSON.stringify(data));
      
      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to generate personalized recommendations. Using defaults instead.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      toast({
        title: "AI Recommendations",
        description: "Viewing detailed financial recommendations",
      });
      navigate("/dashboard");
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Trash": return <Trash className="h-5 w-5" />;
      case "Repeat": return <Repeat className="h-5 w-5" />;
      case "CreditCard": return <CreditCard className="h-5 w-5" />;
      case "Calendar": return <Calendar className="h-5 w-5" />;
      case "ShoppingBag": return <ShoppingBag className="h-5 w-5" />;
      case "Smartphone": return <Smartphone className="h-5 w-5" />;
      case "Utensils": return <Utensils className="h-5 w-5" />;
      default: return <Lightbulb className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-finance-teal animate-spin" />
          <p>Generating recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">AI Recommendations</h2>
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-finance-teal text-white">
            <Lightbulb className="h-4 w-4" />
          </div>
        </div>
        
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-finance-teal/10 text-finance-teal flex-shrink-0">
                  {getIconComponent(recommendation.icon)}
                </div>
                
                <div>
                  <h3 className="font-medium">{recommendation.title}</h3>
                  <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                  <div className="mt-2">
                    <span className="text-finance-success font-medium">{recommendation.savings}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 text-finance-teal border-finance-teal/50 hover:bg-finance-teal/10"
          onClick={handleViewDetails}
        >
          View Details
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default AIRecommendations;
