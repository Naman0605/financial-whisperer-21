
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label, Tooltip } from "recharts";
import { ArrowUpCircle, ArrowDownCircle, LineChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import EmptyDataState from "@/components/expenses/EmptyDataState";
import { useNavigate } from "react-router-dom";

// Fix the TypeScript error by adding proper type definitions
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload?: any;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 shadow-lg rounded border border-gray-200 dark:border-gray-700">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-lg font-semibold">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export const MonthlySnapshot = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [snapshotData, setSnapshotData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [currentMonth, setCurrentMonth] = useState("");
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [savingsProgress, setSavingsProgress] = useState(0);
  
  useEffect(() => {
    // Set current month name
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
    const now = new Date();
    setCurrentMonth(`${monthNames[now.getMonth()]} ${now.getFullYear()}`);

    const fetchUserData = async () => {
      if (!user) {
        setHasData(false);
        setIsLoading(false);
        return;
      }

      try {
        // Fetch expenses
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('amount')
          .eq('user_id', user.id);
        
        if (expensesError) throw expensesError;
        
        // Fetch goals
        const { data: goals, error: goalsError } = await supabase
          .from('goals')
          .select('target_amount, current_amount')
          .eq('user_id', user.id);
        
        if (goalsError) throw goalsError;

        // If there's no data, show empty state
        if ((!expenses || expenses.length === 0) && (!goals || goals.length === 0)) {
          setHasData(false);
          setIsLoading(false);
          return;
        }

        setHasData(true);
        
        // Calculate total expenses
        const totalExpenses = expenses ? expenses.reduce((sum, expense) => {
          return sum + (parseFloat(String(expense.amount)) || 0);
        }, 0) : 0;
        
        // Estimate income (for demo, 160% of expenses)
        const estimatedIncome = Math.round(totalExpenses * 1.6);
        
        // Calculate savings
        const savings = Math.max(0, estimatedIncome - totalExpenses);
        
        // Get savings goal from goals if exists
        let mainSavingsGoal = 0;
        if (goals && goals.length > 0) {
          // Use the first goal as the main savings goal for simplicity
          mainSavingsGoal = parseFloat(String(goals[0].target_amount)) || 2000;
          setSavingsGoal(mainSavingsGoal);
          
          // Calculate progress
          const progress = (savings / mainSavingsGoal) * 100;
          setSavingsProgress(Math.min(100, progress));
        } else {
          setSavingsGoal(2000); // Default goal
          setSavingsProgress((savings / 2000) * 100);
        }
        
        // Set data for chart
        setSnapshotData([
          { name: "Inc", value: estimatedIncome, color: "#4DB6AC" },
          { name: "Expenses", value: totalExpenses, color: "#78909C" },
          { name: "Savings", value: savings, color: "#FFD54F" },
        ]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };
  
  const handleAddExpense = () => {
    navigate("/expenses");
  };

  if (isLoading) {
    return (
      <Card className="glass-card h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-pulse w-full max-w-md">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-52 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasData) {
    return (
      <Card className="glass-card h-full">
        <CardContent className="h-full">
          <EmptyDataState
            title="No monthly data"
            description="Add your expenses to see your monthly financial snapshot."
            actionLabel="Add Financial Data"
            onAction={handleAddExpense}
            icon={<LineChart className="h-8 w-8 text-finance-teal" />}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-2">
        <CardTitle>Monthly Snapshot</CardTitle>
        <CardDescription>{currentMonth}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={snapshotData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {snapshotData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                    stroke={activeIndex === index ? "#fff" : "none"}
                    strokeWidth={activeIndex === index ? 2 : 0}
                  />
                ))}
                <Label
                  value={`₹${snapshotData.length > 0 ? snapshotData[2]?.value : 0}`}
                  position="center"
                  className="text-xl font-bold"
                  fill="#333"
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-2">
          {snapshotData.map((item, index) => (
            <div 
              key={index} 
              className="text-center transition-all duration-200 hover:scale-105 p-1 rounded-md cursor-pointer"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }} />
              <p className="text-xs text-muted-foreground">{item.name}</p>
              <p className="font-medium">₹{item.value}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Progress toward savings goal</span>
              <span className="text-sm font-medium">₹{snapshotData.length > 0 ? snapshotData[2]?.value : 0} of ₹{savingsGoal}</span>
            </div>
            <Progress value={savingsProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/30">
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5 text-finance-success" />
                <span className="text-xs text-muted-foreground">Income</span>
              </div>
              <p className="text-lg font-semibold mt-1">₹{snapshotData.length > 0 ? snapshotData[0]?.value : 0}</p>
            </div>
            
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/30">
              <div className="flex items-center gap-2">
                <ArrowDownCircle className="h-5 w-5 text-finance-danger" />
                <span className="text-xs text-muted-foreground">Expenses</span>
              </div>
              <p className="text-lg font-semibold mt-1">₹{snapshotData.length > 0 ? snapshotData[1]?.value : 0}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlySnapshot;
