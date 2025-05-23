
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, Trash, Repeat, CreditCard, Calendar, ArrowRight, ShoppingBag, Smartphone, Utensils, Loader2, RefreshCw, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import EmptyDataState from "@/components/expenses/EmptyDataState";

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
  error?: string;
}

interface AIRecommendationsProps {
  onViewDetails?: () => void;
}

const AIRecommendations = ({ onViewDetails }: AIRecommendationsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [hasData, setHasData] = useState(false);
  
  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true);
      
      // First check if the user has any data in their profile
      await checkUserData();
      
      // Attempt to load from localStorage first
      const storedRecommendations = localStorage.getItem('aiRecommendations');
      
      if (storedRecommendations) {
        try {
          const parsedData: AIRecommendationData = JSON.parse(storedRecommendations);
          if (parsedData.recommendations && Array.isArray(parsedData.recommendations) && parsedData.recommendations.length > 0) {
            setRecommendations(parsedData.recommendations);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error("Error parsing stored recommendations:", error);
          // Fall through to generating new recommendations
        }
      }
      
      // If we have a user but no valid stored recommendations, generate new ones
      if (user && hasData) {
        await generateRecommendations();
      } else {
        setIsLoading(false);
      }
    };
    
    loadRecommendations();
  }, [user, hasData]);
  
  const checkUserData = async () => {
    if (!user) {
      setHasData(false);
      return;
    }
    
    try {
      // Check if user has any expenses or goals
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (expensesError) throw expensesError;
      
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (goalsError) throw goalsError;
      
      // Set hasData to true if user has any expenses or goals
      setHasData((expenses && expenses.length > 0) || (goals && goals.length > 0));
    } catch (error) {
      console.error("Error checking user data:", error);
      setHasData(false);
    }
  };
  
  const generateRecommendations = async () => {
    setIsLoading(true);
    setErrorState(null);
    
    try {
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('name, amount')
        .eq('user_id', user.id);
      
      if (expensesError) {
        console.error("Error fetching expenses:", expensesError);
        throw expensesError;
      }
      
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('name, target_amount')
        .eq('user_id', user.id);
      
      if (goalsError) {
        console.error("Error fetching goals:", goalsError);
        throw goalsError;
      }
      
      if (!expenses?.length && !goals?.length) {
        setErrorState("You need to add expenses or savings goals to get personalized recommendations.");
        setIsLoading(false);
        setRecommendations([]);
        localStorage.removeItem('aiRecommendations');
        return;
      }
      
      const userData = {
        expenses: expenses.map(exp => ({ name: exp.name, amount: exp.amount })),
        goals: goals.map(goal => ({ name: goal.name, target: goal.target_amount }))
      };
      
      console.log("Sending request to AI recommendations API:", userData);
      
      const response = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ANON_KEY || ''}`,
        },
        body: JSON.stringify({ userData }),
      });
      
      console.log("AI recommendations response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI recommendations response error:", errorText);
        throw new Error(`Failed to generate recommendations: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("AI recommendations data received:", data);
      
      if (data.error) {
        console.warn("API returned an error but with data:", data.error);
        setErrorState(data.error);
      }
      
      // Only store if we have valid recommendations
      if (data.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
        localStorage.setItem('aiRecommendations', JSON.stringify(data));
        setRecommendations(data.recommendations);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        setRecommendations([]);
        localStorage.removeItem('aiRecommendations');
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setRecommendations([]);
      localStorage.removeItem('aiRecommendations');
      
      toast({
        title: "Error",
        description: "Failed to generate personalized recommendations. Please try again later.",
        variant: "destructive"
      });
      
      setErrorState(error.message);
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
  
  const handleAddData = () => {
    navigate("/expenses");
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

  // Show empty state if the user has no data
  if (!hasData) {
    return (
      <div className="glass-card h-full">
        <EmptyDataState
          title="No financial data available"
          description="Add your expenses and savings goals to get personalized AI recommendations."
          actionLabel="Add Financial Data"
          onAction={handleAddData}
          icon={<Lightbulb className="h-8 w-8 text-finance-teal" />}
        />
      </div>
    );
  }

  return (
    <div className="glass-card h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">AI Recommendations</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={generateRecommendations} 
              title="Refresh recommendations"
              className="h-8 w-8 text-finance-teal"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-finance-teal text-white">
              <Lightbulb className="h-4 w-4" />
            </div>
          </div>
        </div>
        
        {errorState && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
            <p>{errorState}</p>
          </div>
        )}
        
        <div className="space-y-4">
          {recommendations && recommendations.length > 0 ? (
            recommendations.map((recommendation, index) => (
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
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-muted-foreground mb-4">No recommendations available</p>
              <Button onClick={generateRecommendations} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Generate Recommendations
              </Button>
            </div>
          )}
        </div>
        
        {recommendations && recommendations.length > 0 && (
          <Button 
            variant="outline" 
            className="w-full mt-4 text-finance-teal border-finance-teal/50 hover:bg-finance-teal/10"
            onClick={handleViewDetails}
          >
            View Details
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AIRecommendations;
