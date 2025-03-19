
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

const spendingData = [
  { name: "Housing", value: 1200, color: "#4DB6AC", percentage: "42.9%" },
  { name: "Food", value: 450, color: "#FFD54F", percentage: "16.1%" },
  { name: "Transportation", value: 350, color: "#78909C", percentage: "12.5%" },
  { name: "Entertainment", value: 300, color: "#EF5350", percentage: "10.7%" },
  { name: "Utilities", value: 250, color: "#FFA726", percentage: "8.9%" },
  { name: "Shopping", value: 150, color: "#66BB6A", percentage: "5.4%" },
  { name: "Other", value: 100, color: "#BA68C8", percentage: "3.6%" },
];

const trendData = [
  { name: "Jan", Housing: 1150, Food: 430, Transportation: 320, Entertainment: 280, Utilities: 240 },
  { name: "Feb", Housing: 1150, Food: 440, Transportation: 310, Entertainment: 290, Utilities: 245 },
  { name: "Mar", Housing: 1175, Food: 445, Transportation: 330, Entertainment: 310, Utilities: 230 },
  { name: "Apr", Housing: 1200, Food: 450, Transportation: 350, Entertainment: 300, Utilities: 250 },
];

const colors = ["#4DB6AC", "#FFD54F", "#78909C", "#EF5350", "#FFA726"];

export const SpendingBreakdown = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handlePieEnter = (_, index: number) => {
    setActiveIndex(index);
  };

  const handlePieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Spending Breakdown</CardTitle>
            <CardDescription>April 2023</CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 border-finance-warning text-finance-warning">
            <AlertCircle className="h-3 w-3" />
            <span>You spend 2x more on dining out than peers</span>
          </Badge>
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
                      formatter={(value: number) => [`$${value}`, 'Amount']} 
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
                        <span className="font-medium">${item.value}</span>
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
                    formatter={(value: number) => [`$${value}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  {Object.keys(trendData[0])
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
