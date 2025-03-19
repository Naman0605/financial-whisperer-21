
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LightbulbIcon, CheckCircle2, Sparkles } from "lucide-react";

const recommendations = [
  {
    title: "Cancel unused subscriptions",
    description: "We found 3 subscriptions you haven't used in the last 2 months.",
    impact: "Save $42.97/month",
    implemented: false
  },
  {
    title: "Switch to a cheaper grocery store",
    description: "Based on your location, Trader Joe's offers similar products for less.",
    impact: "Save ~$120/year",
    implemented: false
  },
  {
    title: "Optimize your utility plan",
    description: "You could switch to a time-of-use electricity plan based on your usage patterns.",
    impact: "Save $15/month",
    implemented: true
  }
];

export const AIRecommendations = () => {
  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-finance-teal" />
          <CardTitle>AI Recommendations</CardTitle>
        </div>
        <CardDescription>Smart suggestions to optimize your finances</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border transition-all ${
                recommendation.implemented
                  ? "border-finance-teal/20 bg-finance-teal/5"
                  : "border-gray-200 dark:border-gray-700 hover:border-finance-teal/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 flex-shrink-0 ${
                  recommendation.implemented
                    ? "text-finance-teal"
                    : "text-finance-gold"
                }`}>
                  {recommendation.implemented ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">{recommendation.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{recommendation.description}</p>
                  
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${
                      recommendation.implemented
                        ? "text-finance-teal"
                        : "text-finance-gold"
                    }`}>
                      {recommendation.impact}
                    </span>
                    
                    {recommendation.implemented && (
                      <span className="ml-2 text-xs bg-finance-teal/20 text-finance-teal px-2 py-0.5 rounded-full">
                        Implemented
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-medium mb-2">Forecast</h3>
          <p className="text-sm text-muted-foreground">
            At your current rate, you'll save approximately <span className="font-medium text-finance-teal">$5,000</span> by December.
          </p>
          
          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-finance-teal to-finance-gold rounded-full"
              style={{ width: "45%" }}
            />
          </div>
          <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
            <span>$0</span>
            <span>Progress: 45%</span>
            <span>$12,000</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
