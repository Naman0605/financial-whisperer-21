
import { Button } from "@/components/ui/button";
import { Lightbulb, Trash, Repeat, CreditCard, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AIRecommendationsProps {
  onViewDetails?: () => void;
}

const AIRecommendations = ({ onViewDetails }: AIRecommendationsProps) => {
  const navigate = useNavigate();
  
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
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-red-600 flex-shrink-0">
                <Trash className="h-5 w-5" />
              </div>
              
              <div>
                <h3 className="font-medium">Cancel unused subscriptions</h3>
                <p className="text-sm text-muted-foreground">We found 2 subscriptions you haven't used in 3+ months</p>
                <div className="mt-2">
                  <span className="text-finance-success font-medium">Save ₹650/month</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 flex-shrink-0">
                <Repeat className="h-5 w-5" />
              </div>
              
              <div>
                <h3 className="font-medium">Switch utility provider</h3>
                <p className="text-sm text-muted-foreground">Based on your usage patterns, a different plan could be cheaper</p>
                <div className="mt-2">
                  <span className="text-finance-success font-medium">Save ₹1,200/year</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-100 text-amber-600 flex-shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
              
              <div>
                <h3 className="font-medium">Consider a different credit card</h3>
                <p className="text-sm text-muted-foreground">Your spending would earn more rewards with this card</p>
                <div className="mt-2">
                  <span className="text-finance-success font-medium">Earn ₹3,500 more in rewards</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600 flex-shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              
              <div>
                <h3 className="font-medium">Set up automatic bill payments</h3>
                <p className="text-sm text-muted-foreground">You've paid ₹450 in late fees this year</p>
                <div className="mt-2">
                  <span className="text-finance-success font-medium">Avoid late fees in the future</span>
                </div>
              </div>
            </div>
          </div>
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
