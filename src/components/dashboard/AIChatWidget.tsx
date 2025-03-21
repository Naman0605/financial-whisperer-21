
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Coffee, Sparkles, BarChart3, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  isLoading?: boolean;
  chart?: "bar" | "pie" | null;
}

export const AIChatWidget = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Hello! I'm your AI financial assistant. Ask me anything about your finances, like 'How much did I spend on coffee last month?' or 'Show me my spending by category.'", 
      sender: "bot" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [user]);
  
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id);
      
      if (expensesError) throw expensesError;
      
      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id);
      
      if (goalsError) throw goalsError;
      
      setExpenses(expensesData || []);
      setGoals(goalsData || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load your financial data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user"
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput("");
    
    // Add typing indicator
    setIsTyping(true);
    const loadingId = messages.length + 2;
    setMessages(prevMessages => [...prevMessages, { id: loadingId, text: "", sender: "bot", isLoading: true }]);
    
    try {
      // Prepare the financial context to send to the API
      const financialContext = {
        expenses,
        goals
      };
      
      // Call our AI chat Supabase function
      const response = await fetch(`${window.location.origin}/api/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input, financialContext }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get a response from the AI');
      }
      
      const data = await response.json();
      
      // Replace loading message with actual response
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === loadingId 
          ? { id: msg.id, text: data.response, sender: "bot", chart: data.chart } 
          : msg
      ));
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Replace loading message with error
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === loadingId 
          ? { id: msg.id, text: "Sorry, I encountered an error processing your request. Please try again later.", sender: "bot" } 
          : msg
      ));
      
      toast({
        title: "Error",
        description: "Failed to get a response from the AI assistant.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };
  
  const renderSuggestions = () => {
    const suggestions = [
      "How much did I spend on coffee last month?",
      "Show me my spending by category",
      "Where can I save more money?",
      "What's my biggest expense?"
    ];
    
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {suggestions.map((suggestion, index) => (
          <Button 
            key={index}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              setInput(suggestion);
              handleSuggestedMessage(suggestion);
            }}
            disabled={isTyping}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    );
  };
  
  const handleSuggestedMessage = (message: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: "user"
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Simulate the form submission
    const event = { preventDefault: () => {} } as React.FormEvent;
    setInput(message);
    
    // Use a timeout to allow state to update
    setTimeout(() => {
      handleSend(event);
    }, 100);
  };
  
  const renderChart = (type: "bar" | "pie") => {
    if (type === "bar") {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-2 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Monthly Coffee Spending</h4>
            <Coffee className="h-4 w-4 text-finance-gold" />
          </div>
          
          <div className="space-y-2">
            {["Jan", "Feb", "Mar", "Apr"].map((month, i) => {
              const values = [38, 52, 45, 42];
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{month}</span>
                    <span>₹{values[i]}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-finance-gold rounded-full"
                      style={{ width: `${(values[i] / 60) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    if (type === "pie") {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-2 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Spending by Category</h4>
            <BarChart3 className="h-4 w-4 text-finance-teal" />
          </div>
          
          <div className="h-40 flex items-center justify-center">
            <div className="relative w-32 h-32">
              {/* This is a simplified pie chart representation */}
              <div className="absolute inset-0 rounded-full border-8 border-l-finance-teal border-r-finance-gold border-t-[#78909C] border-b-[#EF5350]" style={{ borderRadius: "50%" }} />
              <div className="absolute inset-8 bg-white dark:bg-gray-800 rounded-full" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 rounded-full bg-finance-teal" />
              <span>Housing (42.9%)</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 rounded-full bg-finance-gold" />
              <span>Food (16.1%)</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 rounded-full bg-[#78909C]" />
              <span>Transport (12.5%)</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 rounded-full bg-[#EF5350]" />
              <span>Other (28.5%)</span>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-finance-teal animate-spin" />
          <p>Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-finance-teal" />
        <h2 className="text-xl font-semibold">AI Chat Assistant</h2>
      </div>
      
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        <div className="h-96 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map(message => (
              <div 
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-finance-teal text-white"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
                    </div>
                  ) : (
                    <div>
                      <p style={{ whiteSpace: "pre-line" }}>{message.text}</p>
                      {message.chart && renderChart(message.chart)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {messages.length === 1 && renderSuggestions()}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your finances..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              disabled={isTyping} 
              className="bg-finance-teal hover:bg-finance-teal/90 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChatWidget;
