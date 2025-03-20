import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  Wallet, 
  CreditCard, 
  FileText, 
  PiggyBank, 
  MessageSquare,
  X
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const ExpensesStep = ({ 
  expenses, 
  onUpdateExpense, 
  onAddExpense, 
  onRemoveExpense 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-finance-teal/20 mb-4">
          <Home className="h-6 w-6 text-finance-teal" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Let's start with your necessary expenses</h1>
        <p className="text-muted-foreground">
          Enter your fixed monthly expenses to help us understand your baseline financial needs.
        </p>
      </div>
      
      <div className="grid gap-4">
        {expenses.map((expense) => (
          <div key={expense.id} className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`expense-name-${expense.id}`}>Expense Name</Label>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => onRemoveExpense(expense.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input 
                id={`expense-name-${expense.id}`} 
                placeholder="Expense name" 
                value={expense.name}
                onChange={(e) => onUpdateExpense(expense.id, "name", e.target.value)}
              />
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</div>
                <Input 
                  id={`expense-amount-${expense.id}`} 
                  type="number" 
                  placeholder="0.00" 
                  className="pl-7"
                  value={expense.amount}
                  onChange={(e) => onUpdateExpense(expense.id, "amount", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="text-finance-teal border-dashed border-finance-teal/50 hover:bg-finance-teal/10"
          onClick={onAddExpense}
        >
          + Add another expense
        </Button>
      </div>
    </div>
  );
};

export const BankLinkStep = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-finance-teal/20 mb-4">
          <Wallet className="h-6 w-6 text-finance-teal" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Link your bank account</h1>
        <p className="text-muted-foreground">
          Connect your accounts to automatically import transactions and get more accurate insights.
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md cursor-pointer transition-all w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Connect to your bank</p>
              <p className="text-sm text-muted-foreground">This feature is yet to come</p>
            </div>
          </div>
        </div>
        
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md cursor-pointer transition-all w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-green-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Upload a CSV file</p>
              <p className="text-sm text-muted-foreground">Import your transaction history</p>
            </div>
          </div>
        </div>
        
        
        <Button 
          variant="outline" 
          className="w-full justify-center"
          onClick={() => toast({ 
            title: "We'll do this later", 
            description: "You can connect your accounts anytime from your dashboard."
          })}
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export const SavingsGoalsStep = ({ 
  goals, 
  onUpdateGoal, 
  onAddGoal, 
  onRemoveGoal 
}) => {
  const calculateMonths = (target, monthly) => {
    if (!target || !monthly || monthly <= 0) return "N/A";
    const months = Math.ceil(parseFloat(target) / parseFloat(monthly));
    return `${months} months`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-finance-teal/20 mb-4">
          <PiggyBank className="h-6 w-6 text-finance-teal" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Set your savings goals</h1>
        <p className="text-muted-foreground">
          What are you saving for? Let's define some specific goals to track your progress.
        </p>
      </div>
      
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`goal-name-${goal.id}`}>Goal Name</Label>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => onRemoveGoal(goal.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input 
                id={`goal-name-${goal.id}`} 
                placeholder="Goal name" 
                value={goal.name}
                onChange={(e) => onUpdateGoal(goal.id, "name", e.target.value)}
              />
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</div>
                <Input 
                  id={`goal-target-${goal.id}`} 
                  type="number" 
                  placeholder="Target amount" 
                  className="pl-7"
                  value={goal.target}
                  onChange={(e) => onUpdateGoal(goal.id, "target", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</div>
                <Input 
                  id={`goal-monthly-${goal.id}`} 
                  type="number" 
                  placeholder="Monthly contribution" 
                  className="pl-7"
                  value={goal.monthly}
                  onChange={(e) => onUpdateGoal(goal.id, "monthly", e.target.value)}
                />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded px-3 py-2 text-sm flex items-center">
                <span className="text-muted-foreground">
                  Estimated: {calculateMonths(goal.target, goal.monthly)}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="text-finance-teal border-dashed border-finance-teal/50 hover:bg-finance-teal/10"
          onClick={onAddGoal}
        >
          + Add another goal
        </Button>
      </div>
    </div>
  );
};

export const AIAssistantStep = () => {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [botResponses, setBotResponses] = useState<{ text: string; isBot: boolean }[]>([
    { text: "👋 Hi there! I'm your AI financial assistant. What's your biggest financial worry right now?", isBot: true }
  ]);
  
  const simulateResponse = (input: string) => {
    setBotResponses([...botResponses, { text: input, isBot: false }]);
    
    setTimeout(() => {
      let response = "";
      
      if (input.toLowerCase().includes("debt")) {
        response = "I understand debt can be stressful. Based on the information you've provided, I can help create a debt reduction plan that fits your budget. Would you like to prioritize high-interest debt first?";
      } else if (input.toLowerCase().includes("save") || input.toLowerCase().includes("saving")) {
        response = "Saving is a great goal! I've noticed you could potentially save an additional $250/month by optimizing your current expenses. Would you like to see where these savings could come from?";
      } else if (input.toLowerCase().includes("invest") || input.toLowerCase().includes("investing")) {
        response = "Investing is a smart way to grow your wealth. Based on your profile, I can suggest some investment strategies that match your risk tolerance and goals. Would you like to explore these options?";
      } else if (input.toLowerCase().includes("budget")) {
        response = "Creating a sustainable budget is key to financial success. I can help you set up a personalized budget based on the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. Does that sound like a good starting point?";
      } else {
        response = "Thanks for sharing that. I've made a note of your concern and will tailor my recommendations accordingly. As we get more data about your spending patterns, I'll be able to provide more personalized advice.";
      }
      
      setBotResponses(prev => [...prev, { text: response, isBot: true }]);
    }, 1000);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    simulateResponse(userInput);
    setUserInput("");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-finance-teal/20 mb-4">
          <MessageSquare className="h-6 w-6 text-finance-teal" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Meet your AI financial assistant</h1>
        <p className="text-muted-foreground">
          Chat with our AI to get personalized advice and insights about your finances.
        </p>
      </div>
      
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 h-96 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {botResponses.map((message, index) => (
            <div 
              key={index}
              className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
            >
              <div 
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.isBot 
                    ? "bg-gray-100 dark:bg-gray-700" 
                    : "bg-finance-teal text-white"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your financial concerns..."
              className="flex-1"
            />
            <Button type="submit" className="bg-finance-teal hover:bg-finance-teal/90 text-white">
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const SuccessStep = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-finance-teal/20 mb-4">
        <div className="h-10 w-10 text-finance-teal">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">You're all set!</h1>
      
      <p className="text-lg text-muted-foreground">
        Your financial profile has been created and your personalized dashboard is ready.
      </p>
      
      <div className="pt-6">
        <Button 
          onClick={() => navigate("/dashboard")}
          className="bg-finance-teal hover:bg-finance-teal/90 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export const OnboardingSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  return {
    currentStep,
    totalSteps,
    handleNext,
    handlePrev,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    StepComponent: () => {
      switch (currentStep) {
        case 1:
          return <ExpensesStep />;
        case 2:
          return <BankLinkStep />;
        case 3:
          return <SavingsGoalsStep />;
        case 4:
          return <AIAssistantStep />;
        case 5:
          return <SuccessStep />;
        default:
          return <ExpensesStep />;
      }
    }
  };
};

export default OnboardingSteps;
