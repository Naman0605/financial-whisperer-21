
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Home, ShoppingBag, Car, Utensils, CreditCard, Palette, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import EmptyDataState from "@/components/expenses/EmptyDataState";
import { useNavigate } from "react-router-dom";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a855f7", "#ec4899"];

const CATEGORY_ICONS = {
  "Housing": <Home size={16} />,
  "Groceries": <ShoppingBag size={16} />,
  "Transportation": <Car size={16} />,
  "Dining": <Utensils size={16} />,
  "Bills": <CreditCard size={16} />,
  "Other": <Palette size={16} />
};

const CATEGORY_DEFAULTS = {
  "Housing": { color: "#0088FE", icon: <Home size={16} /> },
  "Groceries": { color: "#00C49F", icon: <ShoppingBag size={16} /> },
  "Transportation": { color: "#FFBB28", icon: <Car size={16} /> },
  "Dining": { color: "#FF8042", icon: <Utensils size={16} /> },
  "Bills": { color: "#a855f7", icon: <CreditCard size={16} /> },
  "Other": { color: "#ec4899", icon: <Palette size={16} /> }
};

interface ChartData {
  name: string;
  value: number;
  color: string;
  icon: JSX.Element;
}

const SpendingBreakdown = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSpending, setTotalSpending] = useState(0);
  
  useEffect(() => {
    const fetchExpenseData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data: expenses, error } = await supabase
          .from('expenses')
          .select('category, amount')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (!expenses || expenses.length === 0) {
          setData([]);
          setTotalSpending(0);
          setIsLoading(false);
          return;
        }
        
        // Group by category and sum amounts
        const categoryTotals: Record<string, number> = {};
        let total = 0;
        
        expenses.forEach(expense => {
          const category = expense.category || "Other";
          const amount = parseFloat(String(expense.amount)) || 0;
          
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
          total += amount;
        });
        
        // Convert to chart data format
        const chartData: ChartData[] = Object.entries(categoryTotals).map(([category, amount], index) => {
          const defaultCategory = CATEGORY_DEFAULTS[category] || CATEGORY_DEFAULTS["Other"];
          return {
            name: category,
            value: amount,
            color: defaultCategory.color || COLORS[index % COLORS.length],
            icon: defaultCategory.icon || CATEGORY_DEFAULTS["Other"].icon
          };
        });
        
        setData(chartData);
        setTotalSpending(total);
      } catch (error) {
        console.error("Error fetching expense data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExpenseData();
  }, [user]);
  
  const handleAddExpense = () => {
    navigate("/expenses");
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-2 shadow-lg rounded border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></div>
            <p className="font-medium">{data.name}</p>
          </div>
          <p className="text-lg font-semibold">₹{data.value.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">
            {((data.value / totalSpending) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };
  
  if (isLoading) {
    return (
      <Card className="glass-card h-full">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-36" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (data.length === 0) {
    return (
      <Card className="glass-card h-full">
        <CardContent className="h-full">
          <EmptyDataState
            title="No expense data"
            description="Add your expenses to see your spending breakdown."
            actionLabel="Add Expenses"
            onAction={handleAddExpense}
            icon={<ShoppingBag className="h-8 w-8 text-finance-teal" />}
          />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>Where your money is going</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4">
          <div className="grid gap-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <div className="flex items-center gap-1.5">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">₹{item.value.toLocaleString()}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleAddExpense}
          >
            Manage Expenses
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingBreakdown;
