
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, BarChart2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import EmptyDataState from "@/components/expenses/EmptyDataState";
import { useNavigate } from "react-router-dom";

export const SpendingBreakdown = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [spendingData, setSpendingData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  const colors = ["#4DB6AC", "#FFD54F", "#78909C", "#EF5350", "#FFA726", "#66BB6A", "#BA68C8"];

  useEffect(() => {
    const fetchUserExpenses = async () => {
      if (!user) {
        setHasData(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data: expenses, error } = await supabase
          .from('expenses')
          .select('name, amount, category')
          .eq('user_id', user.id);

        if (error) throw error;

        if (!expenses || expenses.length === 0) {
          setHasData(false);
          setIsLoading(false);
          return;
        }

        // User has data, process it
        setHasData(true);
        
        // Group expenses by category
        const categoryMap = new Map();
        let total = 0;

        expenses.forEach(expense => {
          const category = expense.category || 'Other';
          const amount = parseFloat(expense.amount) || 0;
          total += amount;

          if (categoryMap.has(category)) {
            categoryMap.set(category, categoryMap.get(category) + amount);
          } else {
            categoryMap.set(category, amount);
          }
        });

        // Convert to array format for the chart
        const formattedData = Array.from(categoryMap.entries()).map(([name, value], index) => {
          const percentage = total > 0 ? ((value as number / total) * 100).toFixed(1) + "%" : "0%";
          return {
            name,
            value,
            color: colors[index % colors.length],
            percentage
          };
        });

        setSpendingData(formattedData);
        
        // Generate some trend data (simplified for now)
        // In a real app, you'd fetch historical data
        const months = ["Jan", "Feb", "Mar", "Apr"];
        const trendCategories = Array.from(categoryMap.keys()).slice(0, 5);
        
        const generatedTrendData = months.map(month => {
          const monthData: any = { name: month };
          trendCategories.forEach(category => {
            const baseValue = categoryMap.get(category) || 0;
            const randomFactor = 0.9 + Math.random() * 0.2; // Random variation between 0.9 and 1.1
            monthData[category] = Math.round(baseValue * randomFactor);
          });
          return monthData;
        });
        
        setTrendData(generatedTrendData);
      } catch (error) {
        console.error("Error fetching user expenses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserExpenses();
  }, [user]);

  const handlePieEnter = (_, index: number) => {
    setActiveIndex(index);
  };

  const handlePieLeave = () => {
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
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
            title="No spending data yet"
            description="Add your expenses to see a breakdown of your spending patterns."
            actionLabel="Add Expenses"
            onAction={handleAddExpense}
            icon={<BarChart2 className="h-8 w-8 text-finance-teal" />}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Spending Breakdown</CardTitle>
            <CardDescription>Current Period</CardDescription>
          </div>
          {spendingData.length > 0 && spendingData[0].value > spendingData[1]?.value * 1.5 && (
            <Badge variant="outline" className="flex items-center gap-1 border-finance-warning text-finance-warning">
              <AlertCircle className="h-3 w-3" />
              <span>You spend {Math.round(spendingData[0].value / (spendingData[1]?.value || 1))}x more on {spendingData[0].name}</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="categories">
          <TabsList className="mb-4">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="categories" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={handlePieEnter}
                      onMouseLeave={handlePieLeave}
                    >
                      {spendingData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          opacity={activeIndex === null || activeIndex === index ? 1 : 0.5} 
                          stroke={activeIndex === index ? "white" : "none"}
                          strokeWidth={activeIndex === index ? 2 : 0}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`₹${value}`, 'Amount']} 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Category Breakdown</h3>
                <div className="space-y-2">
                  {spendingData.map((item, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-2 rounded ${activeIndex === index ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-sm">{item.percentage}</span>
                        <span className="font-medium">₹{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="trends" className="m-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trendData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  {trendData.length > 0 && Object.keys(trendData[0])
                    .filter(key => key !== 'name')
                    .map((key, index) => (
                      <Bar 
                        key={key} 
                        dataKey={key} 
                        stackId="a" 
                        fill={colors[index % colors.length]} 
                      />
                    ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SpendingBreakdown;
