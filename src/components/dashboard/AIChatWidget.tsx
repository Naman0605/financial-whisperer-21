
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Coffee, Sparkles, BarChart3 } from "lucide-react";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user"
    };
    
    setMessages([...messages, userMessage]);
    setInput("");
    simulateResponse(input);
  };
  
  const simulateResponse = (question: string) => {
    setIsTyping(true);
    
    // Add typing indicator
    const loadingId = messages.length + 2;
    setMessages(prev => [...prev, { id: loadingId, text: "", sender: "bot", isLoading: true }]);
    
    setTimeout(() => {
      setIsTyping(false);
      
      let responseText = "";
      let chart: "bar" | "pie" | null = null;
      
      if (question.toLowerCase().includes("coffee")) {
        responseText = "Last month, you spent $42.50 on coffee across 17 transactions. This is about 15% less than your average monthly coffee spending ($49.75).";
        chart = "bar";
      } else if (
        question.toLowerCase().includes("spending") && 
        question.toLowerCase().includes("category")
      ) {
        responseText = "Here's your spending breakdown by category for April 2023:\n\nHousing: $1,200 (42.9%)\nFood: $450 (16.1%)\nTransportation: $350 (12.5%)\nEntertainment: $300 (10.7%)\nUtilities: $250 (8.9%)\nShopping: $150 (5.4%)\nOther: $100 (3.6%)";
        chart = "pie";
      } else if (question.toLowerCase().includes("save")) {
        responseText = "Based on your current spending patterns, you could save approximately $320 more per month by:\n\n1. Reducing dining out expenses by $150\n2. Optimizing subscription services to save $45\n3. Using a cash-back credit card for daily purchases to earn about $75\n4. Adjusting your utility usage to save around $50";
      } else {
        responseText = "I'll analyze your finances to answer that question. Would you like me to create a visualization for this data as well?";
      }
      
      // Replace loading message with actual response
      setMessages(prev => prev.map(msg => 
        msg.id === loadingId 
          ? { id: msg.id, text: responseText, sender: "bot", chart } 
          : msg
      ));
    }, 1500);
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
              simulateResponse(suggestion);
              setMessages([...messages, { id: messages.length + 1, text: suggestion, sender: "user" }]);
            }}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    );
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
                    <span>${values[i]}</span>
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
